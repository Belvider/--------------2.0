import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";
import { getActivityDay } from "../lib/activity-days";

loadEnvConfig(process.cwd());
const prisma = new PrismaClient();

async function main() {
  const [progress, attempts] = await Promise.all([
    prisma.userProgress.findMany({ select: { userId: true, moduleId: true, lastSeenAt: true, completedAt: true } }),
    prisma.quizAttempt.findMany({ select: { userId: true, moduleId: true, attemptedAt: true } })
  ]);
  const activities = new Map<string, { userId: string; moduleId: number; day: string; viewedAt: Date }>();
  const add = (userId: string, moduleId: number, date: Date | null) => {
    if (!date) return;
    const day = getActivityDay(date);
    const key = `${userId}/${moduleId}/${day}`;
    const previous = activities.get(key);
    if (!previous || previous.viewedAt < date) activities.set(key, { userId, moduleId, day, viewedAt: date });
  };
  progress.forEach((row) => { add(row.userId, row.moduleId, row.lastSeenAt); add(row.userId, row.moduleId, row.completedAt); });
  attempts.forEach((row) => add(row.userId, row.moduleId, row.attemptedAt));
  const result = await prisma.learningActivity.createMany({ data: [...activities.values()], skipDuplicates: true });
  console.log(`Historical activity imported: ${result.count}; distinct known module-days: ${activities.size}`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
