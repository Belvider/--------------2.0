type ScoredAttempt = { moduleId: number; score: number; passed?: boolean };

export function getBestModuleScores(attempts: readonly ScoredAttempt[]) {
  const best = new Map<number, number>();
  for (const attempt of attempts) {
    const previous = best.get(attempt.moduleId);
    if (previous === undefined || attempt.score > previous) best.set(attempt.moduleId, attempt.score);
  }
  return best;
}

export function getQuizStatistics(attempts: readonly ScoredAttempt[]) {
  const scores = [...getBestModuleScores(attempts).values()];
  const passed = new Set(attempts.filter((attempt) => attempt.passed).map((attempt) => attempt.moduleId));
  return {
    avgScore: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
    passRate: scores.length ? Math.round(passed.size / scores.length * 100) : 0,
    testedModules: scores.length
  };
}
