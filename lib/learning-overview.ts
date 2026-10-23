import { getBestModuleScores } from "@/lib/learning-statistics";

type LearningModule = {
  id: number;
  title: string;
  durationMin: number;
  isPublished: boolean;
  _count: { questions: number };
  category: {
    name: string;
    brand: { id: number; slug: string; name: string };
  };
};

type LearningProgress = {
  moduleId: number;
  status: string;
  progressPct: number;
  lastSeenAt?: Date | string | null;
};

type LearningAttempt = { moduleId: number; score: number; passed?: boolean };

export type LearningRecommendation = {
  id: number;
  title: string;
  durationMin: number;
  category: { name: string; brand: { name: string; slug: string } };
  reason: "continue" | "review" | "next";
  progressPct: number;
  quizReady: boolean;
};

export type LearningOverview = {
  brands: {
    id: number;
    slug: string;
    name: string;
    total: number;
    completed: number;
    inProgress: number;
    progressPct: number;
  }[];
  recommendations: LearningRecommendation[];
};

function seenAt(progress?: LearningProgress) {
  const value = progress?.lastSeenAt;
  const timestamp = value instanceof Date ? value.getTime() : value ? Date.parse(value) : 0;
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function readingProgress(progress?: LearningProgress) {
  if (progress?.status === "COMPLETED") return 100;
  const value = progress?.progressPct ?? 0;
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

function isStarted(progress?: LearningProgress) {
  return Boolean(progress && progress.status !== "COMPLETED" &&
    (progress.status === "IN_PROGRESS" || readingProgress(progress) > 0));
}

// Catalog order supplies stable tie-breaks. Only its published modules may
// contribute to coverage or appear in the personalized learning queue.
export function buildLearningOverview({
  modules,
  progress,
  attempts
}: {
  modules: readonly LearningModule[];
  progress: readonly LearningProgress[];
  attempts: readonly LearningAttempt[];
}): LearningOverview {
  const published = [...new Map(modules.filter((module) => module.isPublished)
    .map((module) => [module.id, module])).values()];
  const catalogOrder = new Map(published.map((module, index) => [module.id, index]));
  const progressByModule = new Map<number, LearningProgress>();
  for (const item of progress) {
    const previous = progressByModule.get(item.moduleId);
    if (!previous || seenAt(item) > seenAt(previous) ||
      (seenAt(item) === seenAt(previous) && readingProgress(item) > readingProgress(previous))) {
      progressByModule.set(item.moduleId, item);
    }
  }

  const brandsById = new Map<number, LearningOverview["brands"][number]>();
  for (const learningModule of published) {
    const brand = learningModule.category.brand;
    let coverage = brandsById.get(brand.id);
    if (!coverage) {
      coverage = { id: brand.id, slug: brand.slug, name: brand.name, total: 0, completed: 0, inProgress: 0, progressPct: 0 };
      brandsById.set(brand.id, coverage);
    }
    coverage.total += 1;
    const current = progressByModule.get(learningModule.id);
    if (current?.status === "COMPLETED") coverage.completed += 1;
    else if (isStarted(current)) coverage.inProgress += 1;
  }
  const brands = [...brandsById.values()];
  for (const brand of brands) brand.progressPct = Math.round(brand.completed / brand.total * 100);

  const bestScores = getBestModuleScores(attempts.filter((attempt) => Number.isFinite(attempt.score)));
  // A later failed retry must not erase an earlier pass or make that module
  // look like new material. Keep score and pass history separate.
  const passedModules = new Set(attempts.filter((attempt) => attempt.passed).map((attempt) => attempt.moduleId));
  const recommendations: LearningRecommendation[] = [];
  const selected = new Set<number>();
  const append = (module: LearningModule, reason: LearningRecommendation["reason"]) => {
    if (recommendations.length >= 3 || selected.has(module.id)) return;
    selected.add(module.id);
    const progressPct = readingProgress(progressByModule.get(module.id));
    recommendations.push({
      id: module.id,
      title: module.title,
      durationMin: module.durationMin,
      category: { name: module.category.name, brand: { name: module.category.brand.name, slug: module.category.brand.slug } },
      reason,
      progressPct,
      quizReady: progressPct >= 100 && module._count.questions > 0
    });
  };
  const stableOrder = (left: LearningModule, right: LearningModule) =>
    catalogOrder.get(left.id)! - catalogOrder.get(right.id)!;

  const continuing = published.filter((module) => {
    const current = progressByModule.get(module.id);
    const needsReview = readingProgress(current) >= 100 && bestScores.has(module.id) && !passedModules.has(module.id);
    return isStarted(current) && !needsReview;
  })
    .sort((left, right) => seenAt(progressByModule.get(right.id)) - seenAt(progressByModule.get(left.id)) ||
      readingProgress(progressByModule.get(right.id)) - readingProgress(progressByModule.get(left.id)) || stableOrder(left, right));
  for (const learningModule of continuing) append(learningModule, "continue");

  const reviewing = published.filter((module) => bestScores.has(module.id) && !passedModules.has(module.id))
    .sort((left, right) => bestScores.get(left.id)! - bestScores.get(right.id)! ||
      seenAt(progressByModule.get(right.id)) - seenAt(progressByModule.get(left.id)) || stableOrder(left, right));
  for (const learningModule of reviewing) append(learningModule, "review");

  const nextModules = published.filter((module) => {
    const current = progressByModule.get(module.id);
    return !selected.has(module.id) && current?.status !== "COMPLETED" && !isStarted(current) &&
      !bestScores.has(module.id) && !passedModules.has(module.id);
  }).sort((left, right) => {
    const leftBrand = brandsById.get(left.category.brand.id)!;
    const rightBrand = brandsById.get(right.category.brand.id)!;
    return leftBrand.completed / leftBrand.total - rightBrand.completed / rightBrand.total || stableOrder(left, right);
  });
  for (const learningModule of nextModules) append(learningModule, "next");

  return { brands, recommendations };
}
