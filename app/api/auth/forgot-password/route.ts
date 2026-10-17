import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const parsed = forgotPasswordSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Вкажіть коректний email" }, { status: 400 });

    const contact = process.env.PASSWORD_RESET_SUPPORT_CONTACT?.trim();
    return NextResponse.json({
      mode: "administrator",
      message: contact
        ? "Для відновлення доступу зверніться до адміністратора: " + contact + ". Повідомте email свого акаунта."
        : "Для відновлення доступу зверніться до адміністратора порталу та повідомте email свого акаунта."
    });
  } catch {
    return NextResponse.json({ error: "Некоректний запит" }, { status: 400 });
  }
}
