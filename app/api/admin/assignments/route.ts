import { AssignmentTargetType, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createAdminAuditLog, getRequestIpAddress } from "@/lib/admin-audit";
import { getAdminAssignmentsWorkspace } from "@/lib/queries";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  moduleId: z.number().int().positive(),
  targetType: z.nativeEnum(AssignmentTargetType),
  userId: z.string().min(3).optional(),
  department: z.string().min(2).optional(),
  dueAt: z.string().optional(),
  required: z.boolean().optional(),
  note: z.string().max(1200).optional()
});

const updateSchema = z.object({
  id: z.number().int().positive(),
  dueAt: z.string().optional(),
  required: z.boolean().optional(),
  note: z.string().max(1200).optional(),
  isActive: z.boolean().optional()
});

function parseOptionalDueDate(rawValue: string | undefined) {
  const value = rawValue?.trim();
  if (!value) {
    return null;
  }

  const parsed = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function buildAssignmentTargetLabel(input: {
  moduleTitle: string;
  targetType: AssignmentTargetType;
  userName?: string | null;
  department?: string | null;
}) {
  if (input.targetType === AssignmentTargetType.USER) {
    return `${input.moduleTitle} → ${input.userName ?? "Користувач"}`;
  }

  return `${input.moduleTitle} → ${input.department ?? "Відділ"}`;
}

export async function GET(request: Request) {
  const user = await requireRole([Role.ADMIN, Role.MANAGER]);
  if (!user) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query")?.trim() || undefined;
    const department = url.searchParams.get("department")?.trim() || undefined;
    const targetTypeRaw = url.searchParams.get("targetType")?.trim();
    const targetType =
      targetTypeRaw && Object.values(AssignmentTargetType).includes(targetTypeRaw as AssignmentTargetType)
        ? (targetTypeRaw as AssignmentTargetType)
        : undefined;

    const workspace = await getAdminAssignmentsWorkspace({
      query,
      department,
      targetType
    });

    return NextResponse.json(workspace);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не вдалося завантажити призначення навчання" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await requireRole([Role.ADMIN]);
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Некоректні параметри призначення" }, { status: 400 });
    }

    const payload = parsed.data;
    const note = payload.note?.trim() || null;
    const dueAt = parseOptionalDueDate(payload.dueAt);

    if (payload.targetType === AssignmentTargetType.USER && !payload.userId) {
      return NextResponse.json({ error: "Оберіть користувача для персонального призначення" }, { status: 400 });
    }

    if (payload.targetType === AssignmentTargetType.DEPARTMENT && !payload.department?.trim()) {
      return NextResponse.json({ error: "Оберіть відділ для групового призначення" }, { status: 400 });
    }

    const trainingModule = await prisma.module.findUnique({
      where: { id: payload.moduleId },
      select: {
        id: true,
        title: true,
        isPublished: true
      }
    });

    if (!trainingModule || !trainingModule.isPublished) {
      return NextResponse.json({ error: "Модуль недоступний для призначення" }, { status: 404 });
    }

    const assignee =
      payload.targetType === AssignmentTargetType.USER && payload.userId
        ? await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
              id: true,
              name: true,
              department: true,
              isActive: true
            }
          })
        : null;

    if (payload.targetType === AssignmentTargetType.USER && (!assignee || !assignee.isActive)) {
      return NextResponse.json({ error: "Користувач недоступний для призначення" }, { status: 404 });
    }

    const duplicate = await prisma.learningAssignment.findFirst({
      where: {
        moduleId: payload.moduleId,
        targetType: payload.targetType,
        isActive: true,
        ...(payload.targetType === AssignmentTargetType.USER
          ? {
              userId: payload.userId!
            }
          : {
              department: payload.department!.trim()
            })
      },
      select: {
        id: true
      }
    });

    if (duplicate) {
      return NextResponse.json({ error: "Таке активне призначення вже існує" }, { status: 409 });
    }

    const assignment = await prisma.learningAssignment.create({
      data: {
        moduleId: payload.moduleId,
        assignedById: admin.id,
        targetType: payload.targetType,
        userId: payload.targetType === AssignmentTargetType.USER ? payload.userId! : null,
        department: payload.targetType === AssignmentTargetType.DEPARTMENT ? payload.department!.trim() : null,
        dueAt,
        required: payload.required ?? true,
        note
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            department: true
          }
        },
        module: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    await createAdminAuditLog({
      actorId: admin.id,
      action: "assignment.create",
      targetType: "assignment",
      targetId: assignment.id,
      targetLabel: buildAssignmentTargetLabel({
        moduleTitle: assignment.module.title,
        targetType: assignment.targetType,
        userName: assignment.user?.name,
        department: assignment.department
      }),
      summary:
        assignment.targetType === AssignmentTargetType.USER
          ? `Призначено модуль «${assignment.module.title}» користувачу «${assignment.user?.name ?? "—"}»`
          : `Призначено модуль «${assignment.module.title}» відділу «${assignment.department ?? "—"}»`,
      ipAddress: getRequestIpAddress(request),
      details: {
        moduleId: assignment.module.id,
        moduleTitle: assignment.module.title,
        targetType: assignment.targetType,
        userId: assignment.user?.id ?? null,
        department: assignment.department,
        dueAt: assignment.dueAt?.toISOString() ?? null,
        required: assignment.required,
        note: assignment.note
      }
    });

    return NextResponse.json({ assignment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не вдалося створити призначення" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await requireRole([Role.ADMIN]);
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Некоректні параметри оновлення" }, { status: 400 });
    }

    const payload = parsed.data;
    const previous = await prisma.learningAssignment.findUnique({
      where: { id: payload.id },
      include: {
        module: {
          select: {
            title: true
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    });

    if (!previous) {
      return NextResponse.json({ error: "Призначення не знайдено" }, { status: 404 });
    }

    const updated = await prisma.learningAssignment.update({
      where: { id: payload.id },
      data: {
        dueAt: payload.dueAt !== undefined ? parseOptionalDueDate(payload.dueAt) : undefined,
        required: payload.required,
        note: payload.note !== undefined ? payload.note.trim() || null : undefined,
        isActive: payload.isActive
      }
    });

    await createAdminAuditLog({
      actorId: admin.id,
      action: "assignment.update",
      targetType: "assignment",
      targetId: updated.id,
      targetLabel: buildAssignmentTargetLabel({
        moduleTitle: previous.module.title,
        targetType: previous.targetType,
        userName: previous.user?.name,
        department: previous.department
      }),
      summary: `Оновлено параметри призначення для модуля «${previous.module.title}»`,
      ipAddress: getRequestIpAddress(request),
      details: {
        before: {
          dueAt: previous.dueAt?.toISOString() ?? null,
          required: previous.required,
          note: previous.note,
          isActive: previous.isActive
        },
        after: {
          dueAt: updated.dueAt?.toISOString() ?? null,
          required: updated.required,
          note: updated.note,
          isActive: updated.isActive
        }
      }
    });

    return NextResponse.json({ assignment: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не вдалося оновити призначення" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await requireRole([Role.ADMIN]);
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));

  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Некоректний ідентифікатор призначення" }, { status: 400 });
  }

  try {
    const previous = await prisma.learningAssignment.findUnique({
      where: { id },
      include: {
        module: {
          select: {
            title: true
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    });

    if (!previous) {
      return NextResponse.json({ error: "Призначення не знайдено" }, { status: 404 });
    }

    await prisma.learningAssignment.update({
      where: { id },
      data: {
        isActive: false
      }
    });

    await createAdminAuditLog({
      actorId: admin.id,
      action: "assignment.deactivate",
      targetType: "assignment",
      targetId: previous.id,
      targetLabel: buildAssignmentTargetLabel({
        moduleTitle: previous.module.title,
        targetType: previous.targetType,
        userName: previous.user?.name,
        department: previous.department
      }),
      summary: `Деактивовано призначення для модуля «${previous.module.title}»`,
      ipAddress: getRequestIpAddress(request),
      details: {
        targetType: previous.targetType,
        userName: previous.user?.name ?? null,
        department: previous.department,
        dueAt: previous.dueAt?.toISOString() ?? null
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не вдалося деактивувати призначення" }, { status: 500 });
  }
}
