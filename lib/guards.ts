import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function requireAuthPageUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
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
