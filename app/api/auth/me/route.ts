import { NextResponse } from "next/server";
import { clearAuthCookie, getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return clearAuthCookie(NextResponse.json({ error: "Не авторизовано" }, { status: 401 }));
  }

  return NextResponse.json({ user });
}
