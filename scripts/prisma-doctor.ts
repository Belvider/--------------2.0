import { PrismaClient } from "@prisma/client";

function maskConnectionString(value: string) {
  try {
    const url = new URL(value);

    if (url.password) {
      url.password = "********";
    }

    return url.toString();
  } catch {
    return value;
  }
}

function readUrl(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    return null;
  }

  try {
    const parsed = new URL(value);

    return {
      raw: value,
      masked: maskConnectionString(value),
      host: parsed.host,
      protocol: parsed.protocol,
      pathname: parsed.pathname
    };
  } catch {
    return {
      raw: value,
      masked: value,
      host: "unknown",
      protocol: "unknown",
      pathname: "unknown"
    };
  }
}

async function main() {
  const databaseUrl = readUrl("DATABASE_URL");
  const directUrl = readUrl("DIRECT_URL");

  console.log("Prisma doctor");
  console.log("-------------");
  console.log(`JWT_SECRET in shell: ${process.env.JWT_SECRET ? "yes" : "no"}`);
  console.log(`DATABASE_URL set: ${databaseUrl ? "yes" : "no"}`);
  console.log(`DIRECT_URL set: ${directUrl ? "yes" : "no"}`);

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing in the current shell");
  }

  console.log("");
  console.log(`DATABASE_URL host: ${databaseUrl.host}`);
  console.log(`DATABASE_URL value: ${databaseUrl.masked}`);

  if (directUrl) {
    console.log(`DIRECT_URL host: ${directUrl.host}`);
    console.log(`DIRECT_URL value: ${directUrl.masked}`);
  }

  if (databaseUrl.host.includes("localhost") || databaseUrl.host.startsWith("127.")) {
    console.log("");
    console.log("Warning: DATABASE_URL points to a local database, not production.");
  }

  const prisma = new PrismaClient();

  try {
    await prisma.$queryRaw`SELECT 1`;

    const [users, admins] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { email: true, isActive: true },
        take: 10,
        orderBy: { createdAt: "asc" }
      })
    ]);

    console.log("");
    console.log(`Connected successfully. Users in DB: ${users}`);
    console.log(`Admin users found: ${admins.length}`);

    if (admins.length > 0) {
      for (const admin of admins) {
        console.log(`- ${admin.email} (active: ${admin.isActive ? "yes" : "no"})`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("");
  console.error("Prisma doctor failed.");
  console.error(error);
  process.exitCode = 1;
});
