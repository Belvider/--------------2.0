import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AUTH_TTL_SECONDS, isAuthSessionCurrent, signAuthToken, verifyAuthToken, type JwtUser } from "@/lib/auth-token";

export { signAuthToken, verifyAuthToken } from "@/lib/auth-token";

const AUTH_COOKIE_NAME = "portal_token";
export function attachAuthCookie(response: NextResponse, payload: JwtUser, passwordHash: string) {
  const token = signAuthToken(payload, passwordHash);
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    maxAge: AUTH_TTL_SECONDS,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  return response;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  return response;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const claims = verifyAuthToken(token);
  if (!claims?.sub) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: claims.sub },
    select: {
      id: true,
      name: true,
      firstName: true,
      email: true,
      avatarUrl: true,
      role: true,
      department: true,
      position: true,
      store: true,
      isActive: true,
      passwordHash: true,
      createdAt: true
    }
  });

  if (!user || !user.isActive) {
    return null;
  }

  // Authentication material is never included in page props or API responses.
  const { passwordHash, ...publicUser } = user;
  if (!isAuthSessionCurrent(claims, passwordHash)) return null;
  return publicUser;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  return user;
}

export async function requireRole(roles: Role[]) {
  const user = await getCurrentUser();

  if (!user || !roles.includes(user.role)) {
    return null;
  }

  return user;
}

export const authCookieName = AUTH_COOKIE_NAME;
