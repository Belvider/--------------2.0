import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { hashPasswordResetToken } from "@/lib/auth-token";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const parsed = resetPasswordSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Перевірте дані" }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const now = new Date();
    const reset = await prisma.$transaction(async (tx) => {
      // Legacy administrator links remain usable once; new tokens are stored
      // as a digest so reading the database does not grant password reset.
      const tokenEntry = await tx.passwordResetToken.findFirst({
        where: {
          token: { in: [hashPasswordResetToken(parsed.data.token), parsed.data.token] },
          usedAt: null,
          expiresAt: { gt: now }
        }
      });
      if (!tokenEntry) return false;
      await tx.$executeRaw`SELECT id FROM users WHERE id = ${tokenEntry.userId} FOR UPDATE`;
      const user = await tx.user.findUnique({ where: { id: tokenEntry.userId }, select: { id: true, email: true, isActive: true } });
      if (!user?.isActive) return false;
      // A reset may wait for another password operation's row lock. Check its
      // expiry again at consumption time, not at the start of that wait.
      const consumedAt = new Date();
      const consumed = await tx.passwordResetToken.updateMany({
        where: { id: tokenEntry.id, usedAt: null, expiresAt: { gt: consumedAt } },
        data: { usedAt: consumedAt }
      });
      if (consumed.count !== 1) return false;
      await tx.user.update({ where: { id: tokenEntry.userId }, data: { passwordHash } });
      await tx.passwordResetToken.updateMany({
        where: { userId: tokenEntry.userId, usedAt: null },
        data: { usedAt: consumedAt }
      });
      await tx.loginAttempt.deleteMany({ where: { email: user.email, successful: false } });
      return true;
    });
    if (!reset) return NextResponse.json({ error: "Токен недійсний або протермінований" }, { status: 400 });
    return clearAuthCookie(NextResponse.json({ message: "Пароль успішно оновлено. Увійдіть із новим паролем." }));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка зміни пароля" }, { status: 500 });
  }
}
