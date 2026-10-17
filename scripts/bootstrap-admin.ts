import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

function requireEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
}

async function main() {
  const email = requireEnv("ADMIN_EMAIL").toLowerCase();
  const password = requireEnv("ADMIN_PASSWORD");
  const name = process.env.ADMIN_NAME?.trim() || "Адміністратор Порталу";
  const position = process.env.ADMIN_POSITION?.trim() || "Адміністратор";
  const department = process.env.ADMIN_DEPARTMENT?.trim() || "Навчання";
  const store = process.env.ADMIN_STORE?.trim() || "Netlify";

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: Role.ADMIN,
      position,
      department,
      store,
      isActive: true
    },
    create: {
      name,
      email,
      passwordHash,
      role: Role.ADMIN,
      position,
      department,
      store,
      isActive: true
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true
    }
  });

  console.log("Admin user is ready:");
  console.log(JSON.stringify(user, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
