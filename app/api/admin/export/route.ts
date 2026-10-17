import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { createAdminAuditLog, getRequestIpAddress } from "@/lib/admin-audit";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await requireRole([Role.ADMIN, Role.MANAGER]);
  if (!user) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const progress = await prisma.userProgress.findMany({
    include: {
      user: true,
      module: {
        include: {
          category: {
            include: {
              brand: true
            }
          }
        }
      }
    },
    orderBy: { lastSeenAt: "desc" }
  });

  const header = [
    "ПІБ",
    "Email",
    "Роль",
    "Відділ",
    "Магазин",
    "Бренд",
    "Категорія",
    "Модуль",
    "Статус",
    "Прогрес",
    "Дата завершення"
  ];

  const rows = progress.map((item) => [
    item.user.name,
    item.user.email,
    item.user.role,
    item.user.department,
    item.user.store ?? "",
    item.module.category.brand.name,
    item.module.category.name,
    item.module.title,
    item.status,
    String(item.progressPct),
    item.completedAt ? item.completedAt.toISOString() : ""
  ]);

  const csv = [header, ...rows]
    .map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  await createAdminAuditLog({
    actorId: user.id,
    action: "report.export",
    targetType: "report",
    targetId: "progress-csv",
    targetLabel: "CSV експорт прогресу",
    summary: "Експортовано CSV-звіт по прогресу навчання",
    ipAddress: getRequestIpAddress(request),
    details: {
      rows: progress.length
    }
  });

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=report.csv"
    }
  });
}
