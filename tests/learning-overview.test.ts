import test from "node:test";
import assert from "node:assert/strict";
import { buildLearningOverview } from "../lib/learning-overview";

function learningModule(id: number, brandId = 1, isPublished = true, questions = 4) {
  return {
    id,
    title: `Module ${id}`,
    durationMin: 10 + id,
    isPublished,
    _count: { questions },
    category: { name: `Category ${id}`, brand: { id: brandId, name: `Brand ${brandId}`, slug: `brand-${brandId}` } }
  };
}

test("an empty catalog produces no fabricated coverage or recommendations", () => {
  assert.deepEqual(buildLearningOverview({ modules: [], progress: [], attempts: [] }), { brands: [], recommendations: [] });
});

test("a finished catalog stays complete without recommending finished modules as new", () => {
  const result = buildLearningOverview({
    modules: [learningModule(1), learningModule(2)],
    progress: [1, 2].map((moduleId) => ({ moduleId, status: "COMPLETED", progressPct: 100 })),
    attempts: [{ moduleId: 1, score: 100, passed: true }]
  });
  assert.deepEqual(result.brands, [{ id: 1, slug: "brand-1", name: "Brand 1", total: 2, completed: 2, inProgress: 0, progressPct: 100 }]);
  assert.deepEqual(result.recommendations, []);
});

test("continue prioritizes recent study and marks quiz readiness only after reading with questions", () => {
  const modules = [learningModule(1), learningModule(2, 1, true, 0), learningModule(3), learningModule(4)];
  const result = buildLearningOverview({
    modules,
    progress: [
      { moduleId: 1, status: "IN_PROGRESS", progressPct: 100, lastSeenAt: "2026-10-23T13:00:00Z" },
      { moduleId: 2, status: "IN_PROGRESS", progressPct: 100, lastSeenAt: "2026-10-23T12:00:00Z" },
      { moduleId: 3, status: "IN_PROGRESS", progressPct: 25, lastSeenAt: "2026-10-23T14:00:00Z" }
    ],
    attempts: [{ moduleId: 3, score: 0, passed: false }]
  });
  assert.deepEqual(result.recommendations.map((item) => [item.id, item.reason, item.progressPct, item.quizReady]), [
    [3, "continue", 25, false], [1, "continue", 100, true], [2, "continue", 100, false]
  ]);
  assert.equal(new Set(result.recommendations.map((item) => item.id)).size, 3);
  assert.equal(result.recommendations[0].durationMin, modules[2].durationMin);
  assert.deepEqual(result.recommendations[0].category, { name: "Category 3", brand: { name: "Brand 1", slug: "brand-1" } });
});

test("review uses the best failed score and a later failure never erases an earlier pass", () => {
  const result = buildLearningOverview({
    modules: [1, 2, 3, 4].map((id) => learningModule(id)),
    progress: [{ moduleId: 4, status: "COMPLETED", progressPct: 100 }],
    attempts: [
      { moduleId: 1, score: 10, passed: false }, { moduleId: 1, score: 60, passed: false },
      { moduleId: 2, score: 50, passed: false },
      { moduleId: 3, score: 0, passed: false }, { moduleId: 3, score: 80, passed: true },
      { moduleId: 3, score: 0, passed: false },
      { moduleId: 4, score: 70, passed: false }
    ]
  });
  assert.deepEqual(result.recommendations.map((item) => [item.id, item.reason]), [[2, "review"], [1, "review"], [4, "review"]]);
  assert.equal(result.recommendations.some((item) => item.id === 3), false);
});

test("fully read failed modules require review while partial reading and previous passes retain continue", () => {
  const result = buildLearningOverview({
    modules: [1, 2, 3].map((id) => learningModule(id)),
    progress: [
      { moduleId: 1, status: "IN_PROGRESS", progressPct: 100, lastSeenAt: "2026-10-23T14:00:00Z" },
      { moduleId: 2, status: "IN_PROGRESS", progressPct: 45, lastSeenAt: "2026-10-23T13:00:00Z" },
      { moduleId: 3, status: "IN_PROGRESS", progressPct: 100, lastSeenAt: "2026-10-23T12:00:00Z" }
    ],
    attempts: [
      { moduleId: 1, score: 20, passed: false },
      { moduleId: 2, score: 0, passed: false },
      { moduleId: 3, score: 80, passed: true },
      { moduleId: 3, score: 0, passed: false }
    ]
  });
  assert.deepEqual(result.recommendations.map((item) => [item.id, item.reason, item.quizReady]), [
    [2, "continue", false], [3, "continue", true], [1, "review", true]
  ]);
});

test("coverage combines categories within a brand, excludes drafts and starts with the least covered brand", () => {
  const result = buildLearningOverview({
    modules: [learningModule(1), learningModule(2), learningModule(3, 2), learningModule(4, 2), learningModule(5, 2, false)],
    progress: [
      { moduleId: 1, status: "COMPLETED", progressPct: 100 },
      { moduleId: 2, status: "IN_PROGRESS", progressPct: 50 },
      { moduleId: 5, status: "COMPLETED", progressPct: 100 }
    ],
    attempts: [{ moduleId: 5, score: 0, passed: false }]
  });
  assert.deepEqual(result.brands, [
    { id: 1, slug: "brand-1", name: "Brand 1", total: 2, completed: 1, inProgress: 1, progressPct: 50 },
    { id: 2, slug: "brand-2", name: "Brand 2", total: 2, completed: 0, inProgress: 0, progressPct: 0 }
  ]);
  assert.deepEqual(result.recommendations.map((item) => [item.id, item.reason]), [[2, "continue"], [3, "next"], [4, "next"]]);
});

test("latest progress wins without duplicating modules or mutating source records", () => {
  const modules = [learningModule(1), learningModule(1), learningModule(2), learningModule(3, 2)];
  const progress = [
    { moduleId: 1, status: "IN_PROGRESS", progressPct: 80, lastSeenAt: "2026-10-21T10:00:00Z" },
    { moduleId: 1, status: "IN_PROGRESS", progressPct: 20, lastSeenAt: "2026-10-23T10:00:00Z" },
    { moduleId: 2, status: "IN_PROGRESS", progressPct: 40, lastSeenAt: "2026-10-22T10:00:00Z" }
  ];
  const before = JSON.stringify({ modules, progress });
  const result = buildLearningOverview({ modules, progress, attempts: [] });
  assert.equal(result.brands[0].total, 2);
  assert.equal(result.brands[0].inProgress, 2);
  assert.deepEqual(result.recommendations.map((item) => [item.id, item.progressPct]), [[1, 20], [2, 40], [3, 0]]);
  assert.equal(JSON.stringify({ modules, progress }), before);
});

test("an existing pass without a progress row is never offered as new material", () => {
  const result = buildLearningOverview({ modules: [learningModule(1)], progress: [], attempts: [{ moduleId: 1, score: 80, passed: true }] });
  assert.deepEqual(result.recommendations, []);
});
