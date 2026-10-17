import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { attachAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEditableNameParts } from "@/lib/user-profile";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.issues[0]?.message ?? "Перевірте коректність полів"
        },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const nameParts = getEditableNameParts({ name: parsed.data.name });
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Користувач із таким email вже існує" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        firstName: nameParts.firstName || null,
        lastName: nameParts.lastName || null,
        middleName: nameParts.middleName || null,
        email,
        passwordHash,
        role: Role.SELLER,
        position: parsed.data.position,
        department: parsed.data.department,
        store: parsed.data.store
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        store: true
      }
    });

    const response = NextResponse.json({
      message: "Реєстрація успішна. Роль можна змінити в адмін-панелі.",
      user
    });

    attachAuthCookie(response, {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }, passwordHash);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Помилка під час реєстрації" }, { status: 500 });
  }
}
