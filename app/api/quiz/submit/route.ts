import { Prisma, ProgressStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { clearAuthCookie, requireUser } from "@/lib/auth";
import { recordLearningActivity } from "@/lib/learning-activity";
import { lockLearningProgress } from "@/lib/learning-lock";
import { resolveStoredProgress } from "@/lib/progress";
import { prisma } from "@/lib/prisma";
import { calculateQuizScore, parseQuizRules } from "@/lib/quiz";

const submitSchema = z.object({
  moduleId: z.number().int().positive().max(2147483647),
  answers: z.array(z.object({ questionId: z.number().int().positive().max(2147483647), answer: z.unknown() })).max(500)
}).refine((value) => new Set(value.answers.map((item) => item.questionId)).size === value.answers.length, {
  message: "Відповіді на питання не повинні повторюватись"
});

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user) return clearAuthCookie(NextResponse.json({ error: "Не авторизовано" }, { status: 401 }));
    const parsed = submitSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Некоректні відповіді" }, { status: 400 });

    return await prisma.$transaction(async (tx) => {
      await lockLearningProgress(tx, user.id, parsed.data.moduleId);
      const learningModule = await tx.module.findFirst({
        where: { id: parsed.data.moduleId, isPublished: true },
        select: {
          id: true,
          questions: { orderBy: { sortOrder: "asc" }, select: { id: true, type: true, correctAnswer: true } }
        }
      });
      if (!learningModule) return NextResponse.json({ error: "Модуль не знайдено" }, { status: 404 });
      if (learningModule.questions.length === 0) return NextResponse.json({ error: "Для цього модуля тест ще не додано" }, { status: 400 });

      const key = { userId_moduleId: { userId: user.id, moduleId: learningModule.id } };
      const existingProgress = await tx.userProgress.findUnique({
        where: key,
        select: { status: true, progressPct: true, completedAt: true }
      });
      if (!existingProgress || existingProgress.progressPct < 100) {
        return NextResponse.json({ error: "Спершу завершіть перегляд матеріалу" }, { status: 400 });
      }
      const questionIds = new Set(learningModule.questions.map((question) => question.id));
      if (parsed.data.answers.some((answer) => !questionIds.has(answer.questionId))) {
        return NextResponse.json({ error: "Відповідь містить питання з іншого тесту" }, { status: 400 });
      }
      const settings = await tx.appSetting.findUnique({ where: { key: "quiz_rules" } });
      const rules = parseQuizRules(settings?.value);
      const attemptsCount = await tx.quizAttempt.count({ where: { userId: user.id, moduleId: learningModule.id } });
      if (attemptsCount >= rules.maxAttempts) {
        return NextResponse.json({ error: "Вичерпано ліміт спроб для цього тесту" }, { status: 429 });
      }

      const normalizedAnswers = parsed.data.answers.map((item) => ({ questionId: item.questionId, answer: item.answer ?? null }));
      const score = calculateQuizScore(learningModule.questions, normalizedAnswers);
      const passed = score.percentage >= rules.passScore;
      await tx.quizAttempt.create({
        data: { userId: user.id, moduleId: learningModule.id, score: score.percentage, passed, answers: normalizedAnswers as Prisma.InputJsonValue }
      });
      const now = new Date();
      const resolvedProgress = resolveStoredProgress({
        existing: existingProgress,
        progressPct: 100,
        hasQuiz: true,
        explicitStatus: passed ? ProgressStatus.COMPLETED : ProgressStatus.IN_PROGRESS,
        quizPassed: passed,
        now
      });
      await tx.userProgress.upsert({
        where: key,
        create: { userId: user.id, moduleId: learningModule.id, ...resolvedProgress, lastSeenAt: now },
        update: { ...resolvedProgress, lastSeenAt: now }
      });
      if (passed) {
        await tx.certificate.upsert({
          where: key,
          create: { userId: user.id, moduleId: learningModule.id, pdfUrl: null },
          update: {}
        });
      }
      await recordLearningActivity(tx, user.id, learningModule.id);
      return NextResponse.json({
        score: score.percentage,
        correct: score.correct,
        total: score.total,
        passed,
        passScore: rules.passScore,
        attemptsLeft: Math.max(0, rules.maxAttempts - attemptsCount - 1),
        questionResults: score.questionResults
      });
    }, { maxWait: 5000, timeout: 15000 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка обробки тесту" }, { status: 500 });
  }
}
