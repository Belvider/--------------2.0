import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createAdminAuditLog, getRequestIpAddress } from "@/lib/admin-audit";
import { prisma } from "@/lib/prisma";

const bulkUsersSchema = z
  .object({
    action: z.enum(["activate", "deactivate", "set-role", "delete"]),
    userIds: z.array(z.string().min(3)).min(1, "Оберіть хоча б одного користувача"),
    role: z.enum(["ADMIN", "MANAGER", "SELLER"]).optional()
  })
  .superRefine((value, ctx) => {
    if (value.action === "set-role" && !value.role) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["role"],
        message: "Для зміни ролі потрібно передати нову роль"
      });
    }
  });

export async function POST(request: Request) {
  const admin = await requireRole([Role.ADMIN]);
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = bulkUsersSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некоректні параметри" }, { status: 400 });
    }

    const uniqueIds = Array.from(new Set(parsed.data.userIds));
    const targetIds = uniqueIds.filter((userId) => userId !== admin.id);
    const skippedCurrentUserCount = uniqueIds.length - targetIds.length;

    if (targetIds.length === 0) {
      return NextResponse.json({ error: "Для масової дії не залишилось жодного доступного користувача" }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: targetIds
        }
      },
      select: {
        id: true,
        name: true,
        role: true,
        isActive: true
      }
    });

    let affectedCount = 0;

    if (parsed.data.action === "activate" || parsed.data.action === "deactivate") {
      const result = await prisma.user.updateMany({
        where: {
          id: {
            in: targetIds
          }
        },
        data: {
          isActive: parsed.data.action === "activate"
        }
      });

      affectedCount = result.count;
    }

    if (parsed.data.action === "set-role" && parsed.data.role) {
      const result = await prisma.user.updateMany({
        where: {
          id: {
            in: targetIds
          }
        },
        data: {
          role: parsed.data.role
        }
      });

      affectedCount = result.count;
    }

    if (parsed.data.action === "delete") {
      const result = await prisma.user.deleteMany({
        where: {
          id: {
            in: targetIds
          }
        }
      });

      affectedCount = result.count;
    }

    const actionLabel =
      parsed.data.action === "activate"
        ? "активовано"
        : parsed.data.action === "deactivate"
          ? "деактивовано"
          : parsed.data.action === "delete"
            ? "видалено"
            : `переведено в роль ${parsed.data.role}`;

    const ipAddress = getRequestIpAddress(request);

    await Promise.all(
      users.map((user) =>
        createAdminAuditLog({
          actorId: admin.id,
          action: parsed.data.action === "delete" ? "user.bulk-delete" : "user.bulk-update",
          targetType: "user",
          targetId: user.id,
          targetLabel: user.name,
          summary: `Масова дія над користувачем «${user.name}»: ${actionLabel}`,
          ipAddress,
          details: {
            action: parsed.data.action,
            role: parsed.data.role ?? null,
            skippedCurrentUserCount,
            batchSize: targetIds.length,
            before: {
              role: user.role,
              isActive: user.isActive
            }
          }
        })
      )
    );

    return NextResponse.json({
      ok: true,
      affectedCount,
      skippedCurrentUserCount
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка масової обробки користувачів" }, { status: 500 });
  }
}
