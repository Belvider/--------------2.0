import type { Prisma } from "@prisma/client";

// Progress updates and quiz submissions share a lock so a late progress write
// cannot overwrite completion, and concurrent submissions cannot exceed limits.
export async function lockLearningProgress(tx: Prisma.TransactionClient, userId: string, moduleId: number) {
  await tx.$executeRaw`
    SELECT pg_advisory_xact_lock(hashtext(${`learning:${userId}`}), CAST(${moduleId} AS integer))
  `;
}
