import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authCookieName, getCurrentUser } from "@/lib/auth";

export async function requireAuthPageUser() {
  const user = await getCurrentUser();

  if (!user) {
    // Server Components cannot clear cookies. Let the route handler remove an
    // expired/revoked session before returning to the sign-in page.
    const cookieStore = await cookies();
    redirect(cookieStore.has(authCookieName) ? "/api/auth/session" : "/login");
  }

  return user;
}

export async function requireAdminOrManagerPageUser() {
  const user = await requireAuthPageUser();

  if (user.role !== Role.ADMIN && user.role !== Role.MANAGER) {
    redirect("/dashboard");
  }

  return user;
}

export async function requireAdminPageUser() {
  const user = await requireAuthPageUser();

  if (user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  return user;
}
