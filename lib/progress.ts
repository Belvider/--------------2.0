import { ProgressStatus } from "@prisma/client";

type ExistingProgress = {
  status: ProgressStatus;
  progressPct: number;
  completedAt: Date | null;
} | null;

type ResolveStoredProgressInput = {
  existing: ExistingProgress;
  progressPct: number;
  hasQuiz: boolean;
  explicitStatus?: ProgressStatus | null;
  quizPassed?: boolean;
  now?: Date;
};

function clampProgressPct(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

export function inferAutomaticProgressStatus(progressPct: number, hasQuiz: boolean) {
  if (progressPct <= 0) {
    return ProgressStatus.NOT_STARTED;
  }

  if (progressPct >= 100) {
    return hasQuiz ? ProgressStatus.IN_PROGRESS : ProgressStatus.COMPLETED;
  }

  return ProgressStatus.IN_PROGRESS;
}

export function resolveStoredProgress({
  existing,
  progressPct,
  hasQuiz,
  explicitStatus,
  quizPassed = false,
  now = new Date()
}: ResolveStoredProgressInput) {
  const normalizedProgressPct = clampProgressPct(progressPct);
  const mergedProgressPct = Math.max(existing?.progressPct ?? 0, normalizedProgressPct);

  const statusFromIntent = (() => {
    if (explicitStatus === ProgressStatus.COMPLETED && (!hasQuiz || quizPassed)) {
      return ProgressStatus.COMPLETED;
    }

    if (explicitStatus === ProgressStatus.NOT_STARTED) {
      return mergedProgressPct > 0 ? ProgressStatus.IN_PROGRESS : ProgressStatus.NOT_STARTED;
    }

    if (explicitStatus === ProgressStatus.IN_PROGRESS) {
      return mergedProgressPct <= 0 ? ProgressStatus.NOT_STARTED : ProgressStatus.IN_PROGRESS;
    }

    return inferAutomaticProgressStatus(mergedProgressPct, hasQuiz);
  })();

  const status =
    existing?.status === ProgressStatus.COMPLETED ? ProgressStatus.COMPLETED : statusFromIntent;

  const progressPctToStore = status === ProgressStatus.COMPLETED ? 100 : mergedProgressPct;
  const completedAt = status === ProgressStatus.COMPLETED ? existing?.completedAt ?? now : null;

  return {
    status,
    progressPct: progressPctToStore,
    completedAt
  };
}

export function getProgressStatusLabel(status: ProgressStatus, progressPct: number) {
  if (status === ProgressStatus.COMPLETED) {
    return "Завершено";
  }

  if (status === ProgressStatus.IN_PROGRESS && progressPct >= 100) {
    return "Готово до тесту";
  }

  if (status === ProgressStatus.IN_PROGRESS) {
    return "В процесі";
  }

  return "Не розпочато";
}
