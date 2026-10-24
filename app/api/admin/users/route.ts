import bcrypt from "bcryptjs";
import { Prisma, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createAdminAuditLog, getRequestIpAddress } from "@/lib/admin-audit";
import { prisma } from "@/lib/prisma";
import { buildDisplayName, getEditableNameParts, normalizeProfileText, parseDateInput } from "@/lib/user-profile";
import { adminUserCreateSchema, adminUserUpdateSchema } from "@/lib/validators";

function hasOwnProperty<ObjectType extends object>(value: ObjectType, key: keyof ObjectType) {
  return Object.prototype.hasOwnProperty.call(value, key);
}

const deleteSchema = z.object({
  userId: z.string().min(3)
});

export async function GET() {
  const user = await requireRole([Role.ADMIN, Role.MANAGER]);
  if (!user) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      position: true,
      department: true,
      store: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          progresses: true,
          attempts: true
        }
      }
    }
  });

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const admin = await requireRole([Role.ADMIN]);
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = adminUserCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некоректні параметри" }, { status: 400 });
    }

    const data = parsed.data;
    const firstName = normalizeProfileText(data.firstName);
    const lastName = normalizeProfileText(data.lastName);
    const middleName = normalizeProfileText(data.middleName);
    const email = data.email.toLowerCase();

    const created = await prisma.user.create({
      data: {
        name: buildDisplayName({
          firstName,
          lastName,
          middleName,
          name: email.split("@")[0] ?? "Користувач"
        }),
        firstName,
        lastName,
        middleName,
        email,
        passwordHash: await bcrypt.hash(data.password, 10),
        phone: normalizeProfileText(data.phone),
        birthday: parseDateInput(data.birthday),
        city: normalizeProfileText(data.city),
        role: data.role ?? Role.SELLER,
        position: data.position.trim(),
        department: data.department.trim(),
        store: normalizeProfileText(data.store),
        hireDate: parseDateInput(data.hireDate),
        notes: normalizeProfileText(data.notes),
        isActive: data.isActive ?? true
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        middleName: true,
        email: true,
        phone: true,
        birthday: true,
        city: true,
        role: true,
        position: true,
        department: true,
        store: true,
        hireDate: true,
        notes: true,
        isActive: true,
        createdAt: true
      }
    });

    await createAdminAuditLog({
      actorId: admin.id,
      action: "user.create",
      targetType: "user",
      targetId: created.id,
      targetLabel: created.name,
      summary: `Створено нового користувача «${created.name}»`,
      ipAddress: getRequestIpAddress(request),
      details: {
        after: created
      }
    });

    return NextResponse.json({ user: created });
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Користувач із таким email вже існує" }, { status: 409 });
    }

    return NextResponse.json({ error: "Помилка створення користувача" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await requireRole([Role.ADMIN]);
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = adminUserUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некоректні параметри" }, { status: 400 });
    }

    const data = parsed.data;

    const previous = await prisma.user.findUnique({
      where: { id: data.userId },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        middleName: true,
        email: true,
        phone: true,
        birthday: true,
        role: true,
        position: true,
        department: true,
        store: true,
        city: true,
        hireDate: true,
        notes: true,
        isActive: true
      }
    });

    if (!previous) {
      return NextResponse.json({ error: "Користувача не знайдено" }, { status: 404 });
    }

    if (
      data.userId === admin.id &&
      ((hasOwnProperty(data, "role") && data.role !== previous.role) ||
        (hasOwnProperty(data, "isActive") && data.isActive !== previous.isActive))
    ) {
      return NextResponse.json({ error: "Не можна змінювати власну роль або блокувати власний акаунт" }, { status: 400 });
    }

    const previousNameParts = getEditableNameParts(previous);
    const nextFirstName = hasOwnProperty(data, "firstName")
      ? normalizeProfileText(data.firstName)
      : normalizeProfileText(previousNameParts.firstName);
    const nextLastName = hasOwnProperty(data, "lastName")
      ? normalizeProfileText(data.lastName)
      : normalizeProfileText(previousNameParts.lastName);
    const nextMiddleName = hasOwnProperty(data, "middleName")
      ? normalizeProfileText(data.middleName)
      : normalizeProfileText(previousNameParts.middleName);

    const updateData: Prisma.UserUpdateInput = {};

    if (hasOwnProperty(data, "role")) {
      updateData.role = data.role;
    }

    if (hasOwnProperty(data, "isActive")) {
      updateData.isActive = data.isActive;
    }

    if (hasOwnProperty(data, "firstName")) {
      updateData.firstName = nextFirstName;
    }

    if (hasOwnProperty(data, "lastName")) {
      updateData.lastName = nextLastName;
    }

    if (hasOwnProperty(data, "middleName")) {
      updateData.middleName = nextMiddleName;
    }

    if (
      hasOwnProperty(data, "firstName") ||
      hasOwnProperty(data, "lastName") ||
      hasOwnProperty(data, "middleName")
    ) {
      updateData.name = buildDisplayName({
        name: previous.name,
        firstName: nextFirstName,
        lastName: nextLastName,
        middleName: nextMiddleName
      });
    }

    if (hasOwnProperty(data, "email")) {
      const nextEmail = data.email?.toLowerCase();

      if (nextEmail) {
        updateData.email = nextEmail;
      }
    }

    if (hasOwnProperty(data, "phone")) {
      updateData.phone = normalizeProfileText(data.phone);
    }

    if (hasOwnProperty(data, "birthday")) {
      updateData.birthday = parseDateInput(data.birthday);
    }

    if (hasOwnProperty(data, "city")) {
      updateData.city = normalizeProfileText(data.city);
    }

    if (hasOwnProperty(data, "position")) {
      updateData.position = data.position?.trim();
    }

    if (hasOwnProperty(data, "department")) {
      updateData.department = data.department?.trim();
    }

    if (hasOwnProperty(data, "store")) {
      updateData.store = normalizeProfileText(data.store);
    }

    if (hasOwnProperty(data, "hireDate")) {
      updateData.hireDate = parseDateInput(data.hireDate);
    }

    if (hasOwnProperty(data, "notes")) {
      updateData.notes = normalizeProfileText(data.notes);
    }

    const updated = await prisma.user.update({
      where: { id: data.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        middleName: true,
        phone: true,
        birthday: true,
        position: true,
        department: true,
        store: true,
        city: true,
        hireDate: true,
        notes: true,
        isActive: true
      }
    });

    await createAdminAuditLog({
      actorId: admin.id,
      action: "user.update",
      targetType: "user",
      targetId: updated.id,
      targetLabel: updated.name,
      summary: `Оновлено профіль користувача «${updated.name}»`,
      ipAddress: getRequestIpAddress(request),
      details: {
        before: previous,
        after: updated
      }
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error(error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Користувач із таким email вже існує" }, { status: 409 });
    }

    return NextResponse.json({ error: "Помилка оновлення користувача" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const admin = await requireRole([Role.ADMIN]);
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const url = new URL(request.url);
  const parsed = deleteSchema.safeParse({
    userId: url.searchParams.get("userId")
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Некоректні параметри" }, { status: 400 });
  }

  if (parsed.data.userId === admin.id) {
    return NextResponse.json({ error: "Власний акаунт не можна видалити" }, { status: 400 });
  }

  try {
    const previous = await prisma.user.findUnique({
      where: { id: parsed.data.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    await prisma.user.delete({
      where: { id: parsed.data.userId }
    });

    await createAdminAuditLog({
      actorId: admin.id,
      action: "user.delete",
      targetType: "user",
      targetId: parsed.data.userId,
      targetLabel: previous?.name ?? parsed.data.userId,
      summary: `Видалено користувача «${previous?.name ?? parsed.data.userId}»`,
      ipAddress: getRequestIpAddress(request),
      details: previous
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка видалення користувача" }, { status: 500 });
  }
}
