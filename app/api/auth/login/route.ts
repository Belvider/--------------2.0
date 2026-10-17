import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { attachAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";

const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

function getIpAddress(request: Request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    return xff.split(",")[0]?.trim() ?? null;
  }

  return request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Невірний email або пароль" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const ipAddress = getIpAddress(request);

    const attempts = await prisma.loginAttempt.count({
      where: {
        email,
        successful: false,
        attemptedAt: { gte: new Date(Date.now() - ATTEMPT_WINDOW_MS) }
      }
    });

    if (attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          error: "Забагато невдалих спроб. Спробуйте ще раз через 15 хвилин."
        },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    const validPassword = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;

    if (!user || !validPassword) {
      await prisma.loginAttempt.create({
        data: {
          email,
          ipAddress,
          successful: false
        }
      });

      return NextResponse.json({ error: "Невірний email або пароль" }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Акаунт деактивовано адміністратором" }, { status: 403 });
    }

    await prisma.loginAttempt.create({
      data: {
        email,
        ipAddress,
        successful: true
      }
    });

    const response = NextResponse.json({
      message: "Вхід успішний",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        store: user.store
      }
    });

    attachAuthCookie(response, {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }, user.passwordHash);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка під час входу" }, { status: 500 });
  }
}
