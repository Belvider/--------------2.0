import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CreateAdminAuditLogInput = {
  actorId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | number | null;
  targetLabel?: string | null;
  summary: string;
  details?: Prisma.InputJsonValue | null;
  ipAddress?: string | null;
};

function normalizeText(value: string | null | undefined, maxLength: number) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1)}…` : trimmed;
}

export function getRequestIpAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || null;
  }

  return request.headers.get("x-real-ip")?.trim() || null;
}

export async function createAdminAuditLog(input: CreateAdminAuditLogInput) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        actorId: input.actorId ?? null,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId != null ? String(input.targetId) : null,
        targetLabel: normalizeText(input.targetLabel, 160),
        summary: normalizeText(input.summary, 400) ?? "Без опису",
        details: input.details ?? undefined,
        ipAddress: normalizeText(input.ipAddress, 120)
      }
    });
  } catch (error) {
    console.error("Failed to write admin audit log", error);
  }
}
