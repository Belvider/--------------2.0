import { ProgressStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { clearAuthCookie, requireUser } from "@/lib/auth";
import { recordLearningActivity } from "@/lib/learning-activity";
import { lockLearningProgress } from "@/lib/learning-lock";
import { resolveStoredProgress } from "@/lib/progress";
import { prisma } from "@/lib/prisma";

const progressSchema = z.object({
  moduleId: z.number().int().positive().max(2147483647),
  progressPct: z.number().min(0).max(100),
  status: z.nativeEnum(ProgressStatus).optional()
});

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    if (!user) return clearAuthCookie(NextResponse.json({ error: "Не авторизовано" }, { status: 401 }));

    const rawModuleId = new URL(request.url).searchParams.get("moduleId");
    if (rawModuleId !== null) {
      const moduleId = Number(rawModuleId);
      if (!rawModuleId.trim() || !Number.isSafeInteger(moduleId) || moduleId <= 0 || moduleId > 2147483647) {
        return NextResponse.json({ error: "Некоректний ідентифікатор модуля" }, { status: 400 });
      }
      const learningModule = await prisma.module.findFirst({ where: { id: moduleId, isPublished: true }, select: { id: true } });
      if (!learningModule) return NextResponse.json({ error: "Модуль не знайдено" }, { status: 404 });
      const progress = await prisma.userProgress.findUnique({ where: { userId_moduleId: { userId: user.id, moduleId } } });
      return NextResponse.json({ progress });
    }

    const progress = await prisma.userProgress.findMany({
      where: { userId: user.id, module: { isPublished: true } },
      orderBy: { lastSeenAt: "desc" }
    });
    return NextResponse.json({ progress });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка завантаження прогресу" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user) return clearAuthCookie(NextResponse.json({ error: "Не авторизовано" }, { status: 401 }));
    const parsed = progressSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Некоректні дані прогресу" }, { status: 400 });

    return await prisma.$transaction(async (tx) => {
      await lockLearningProgress(tx, user.id, parsed.data.moduleId);
      const learningModule = await tx.module.findFirst({
        where: { id: parsed.data.moduleId, isPublished: true },
        select: { id: true, _count: { select: { questions: true } } }
      });
      if (!learningModule) return NextResponse.json({ error: "Модуль не знайдено" }, { status: 404 });
      if (learningModule._count.questions > 0 && parsed.data.status === ProgressStatus.COMPLETED) {
        return NextResponse.json({ error: "Для завершення цього модуля потрібно успішно скласти тест" }, { status: 400 });
      }
      const key = { userId_moduleId: { userId: user.id, moduleId: learningModule.id } };
      const existingProgress = await tx.userProgress.findUnique({
        where: key,
        select: { status: true, progressPct: true, completedAt: true }
      });
      const now = new Date();
      const resolvedProgress = resolveStoredProgress({
        existing: existingProgress,
        progressPct: parsed.data.progressPct,
        hasQuiz: learningModule._count.questions > 0,
        explicitStatus: parsed.data.status,
        now
      });
      const progress = await tx.userProgress.upsert({
        where: key,
        update: { ...resolvedProgress, lastSeenAt: now },
        create: { userId: user.id, moduleId: learningModule.id, ...resolvedProgress, lastSeenAt: now }
      });
      await recordLearningActivity(tx, user.id, learningModule.id);
      return NextResponse.json({ progress });
    }, { maxWait: 5000, timeout: 15000 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка оновлення прогресу" }, { status: 500 });
  }
}
