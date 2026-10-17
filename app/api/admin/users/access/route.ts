import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { createAdminAuditLog, getRequestIpAddress } from "@/lib/admin-audit";
import { clearAuthCookie, requireRole } from "@/lib/auth";
import { hashPasswordResetToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";
import { adminUserAccessSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const admin = await requireRole([Role.ADMIN]);
  if (!admin) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = adminUserAccessSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Некоректні параметри" }, { status: 400 });
    }

    const data = parsed.data;
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Користувача не знайдено" }, { status: 404 });
    }

    if (data.action === "set-password") {
      const passwordHash = await bcrypt.hash(data.password, 10);
      await prisma.$transaction(async (tx) => {
        await tx.user.update({ where: { id: data.userId }, data: { passwordHash } });
        await tx.passwordResetToken.deleteMany({ where: { userId: data.userId, usedAt: null } });
        await tx.loginAttempt.deleteMany({ where: { email: user.email, successful: false } });
      });

      await createAdminAuditLog({
        actorId: admin.id,
        action: "user.password-set",
        targetType: "user",
        targetId: user.id,
        targetLabel: user.name,
        summary: `Адміністратор перевизначив пароль для «${user.name}»`,
        ipAddress: getRequestIpAddress(request),
        details: {
          method: "admin-direct-set"
        }
      });

      const response = NextResponse.json({
        message: `Пароль для «${user.name}» оновлено`
      });
      return data.userId === admin.id ? clearAuthCookie(response) : response;
    }

    const token = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT id FROM users WHERE id = ${data.userId} FOR UPDATE`;
      await tx.passwordResetToken.deleteMany({ where: { userId: data.userId, usedAt: null } });
      await tx.passwordResetToken.create({
        data: { userId: data.userId, token: hashPasswordResetToken(token), expiresAt }
      });
    });

    const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const resetUrl = `${origin}/reset-password?token=${token}`;

    await createAdminAuditLog({
      actorId: admin.id,
      action: "user.reset-link",
      targetType: "user",
      targetId: user.id,
      targetLabel: user.name,
      summary: `Створено reset-посилання для «${user.name}»`,
      ipAddress: getRequestIpAddress(request),
      details: {
        expiresAt: expiresAt.toISOString()
      }
    });

    return NextResponse.json({
      message: `Reset-посилання для «${user.name}» створено`,
      resetUrl,
      expiresAt: expiresAt.toISOString()
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка керування доступом" }, { status: 500 });
  }
}
