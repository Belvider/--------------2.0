import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createAdminAuditLog, getRequestIpAddress } from "@/lib/admin-audit";
import { prisma } from "@/lib/prisma";

const bulkModulesSchema = z.object({
  action: z.enum(["publish", "unpublish", "delete"]),
  moduleIds: z.array(z.number().int().positive()).min(1, "Оберіть хоча б один модуль")
});

export async function POST(request: Request) {
  const admin = await requireRole([Role.ADMIN]);
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = bulkModulesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некоректні параметри" }, { status: 400 });
    }

    const moduleIds = Array.from(new Set(parsed.data.moduleIds));
    const modules = await prisma.module.findMany({
      where: {
        id: {
          in: moduleIds
        }
      },
      select: {
        id: true,
        title: true,
        isPublished: true,
        categoryId: true
      }
    });

    let affectedCount = 0;

    if (parsed.data.action === "publish" || parsed.data.action === "unpublish") {
      const result = await prisma.module.updateMany({
        where: {
          id: {
            in: moduleIds
          }
        },
        data: {
          isPublished: parsed.data.action === "publish"
        }
      });

      affectedCount = result.count;
    }

    if (parsed.data.action === "delete") {
      const result = await prisma.module.deleteMany({
        where: {
          id: {
            in: moduleIds
          }
        }
      });

      affectedCount = result.count;
    }

    const actionLabel =
      parsed.data.action === "publish"
        ? "опубліковано"
        : parsed.data.action === "unpublish"
          ? "знято з публікації"
          : "видалено";

    const ipAddress = getRequestIpAddress(request);

    await Promise.all(
      modules.map((moduleItem) =>
        createAdminAuditLog({
          actorId: admin.id,
          action: parsed.data.action === "delete" ? "module.bulk-delete" : "module.bulk-update",
          targetType: "module",
          targetId: String(moduleItem.id),
          targetLabel: moduleItem.title,
          summary: `Масова дія над модулем «${moduleItem.title}»: ${actionLabel}`,
          ipAddress,
          details: {
            action: parsed.data.action,
            batchSize: moduleIds.length,
            before: {
              isPublished: moduleItem.isPublished,
              categoryId: moduleItem.categoryId
            }
          }
        })
      )
    );

    return NextResponse.json({
      ok: true,
      affectedCount
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка масової обробки модулів" }, { status: 500 });
  }
}
