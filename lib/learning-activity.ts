import type { Prisma } from "@prisma/client";
import { getActivityDay } from "@/lib/activity-days";

export async function recordLearningActivity(tx: Prisma.TransactionClient, userId: string, moduleId: number) {
  const viewedAt = new Date();
  const day = getActivityDay(viewedAt);
  await tx.learningActivity.upsert({
    where: { userId_moduleId_day: { userId, moduleId, day } },
    create: { userId, moduleId, day, viewedAt },
    update: { viewedAt }
  });
}
