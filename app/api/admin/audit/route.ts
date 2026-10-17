import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { getAdminAuditSummary, getAdminAuditTrail } from "@/lib/queries";

export async function GET(request: Request) {
  const user = await requireRole([Role.ADMIN, Role.MANAGER]);
  if (!user) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action")?.trim() || undefined;
    const targetType = url.searchParams.get("targetType")?.trim() || undefined;
    const query = url.searchParams.get("query")?.trim() || undefined;
    const rawLimit = Number(url.searchParams.get("limit") ?? "60");
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 10), 200) : 60;

    const [rows, summary] = await Promise.all([
      getAdminAuditTrail({
        action,
        targetType,
        query,
        take: limit
      }),
      getAdminAuditSummary()
    ]);

    return NextResponse.json({ rows, summary });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не вдалося завантажити журнал дій" }, { status: 500 });
  }
}
