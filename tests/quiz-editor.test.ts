import assert from "node:assert/strict";
import test from "node:test";
import Module from "node:module";
import { createEmptyQuizQuestion, normalizeQuizQuestion, serializeQuizQuestions, validateQuizQuestions, validateQuestionIds, type StoredQuizQuestion } from "../lib/quiz-editor";

test("blank single options preserve positions and correct index, then fail save validation", () => {
  const stored: StoredQuizQuestion = { id: 42, question: "Choose C", type: "SINGLE", options: ["A", "  ", "C"], correctAnswer: { index: 2 } };
  const draft = normalizeQuizQuestion(stored, 0);
  assert.equal(draft.options.length, 3);
  const [serialized] = serializeQuizQuestions([draft]);
  assert.deepEqual(serialized.options, ["A", "", "C"]);
  assert.deepEqual(serialized.correctAnswer, { index: 2 });
  assert.ok(validateQuizQuestions([serialized]));
  draft.options[1] = "B";
  assert.equal(validateQuizQuestions(serializeQuizQuestions([draft])), null);
  assert.deepEqual(serializeQuizQuestions([draft])[0].correctAnswer, { index: 2 });
});

test("multiple-answer blanks and invalid indices are rejected without a fallback answer", () => {
  const draft = normalizeQuizQuestion({ question: "Choose C", type: "MULTIPLE", options: ["A", "", "C", "D"], correctAnswer: { indices: [2] } }, 0);
  const [serialized] = serializeQuizQuestions([draft]);
  assert.deepEqual(serialized.correctAnswer, { indices: [2] });
  assert.ok(validateQuizQuestions([serialized]));
  draft.options[1] = "B";
  draft.correctMultipleIndices = [];
  assert.deepEqual(serializeQuizQuestions([draft])[0].correctAnswer, { indices: [] });
  assert.ok(validateQuizQuestions(serializeQuizQuestions([draft])));
  draft.correctMultipleIndices = [4];
  assert.ok(validateQuizQuestions(serializeQuizQuestions([draft])));
  draft.correctMultipleIndices = [2];
  assert.equal(validateQuizQuestions(serializeQuizQuestions([draft])), null);
});

test("single invalid indices are retained for validation rather than silently changed to zero", () => {
  const draft = normalizeQuizQuestion({ question: "Choose", type: "SINGLE", options: ["A", "B"], correctAnswer: { index: 9 } }, 0);
  assert.deepEqual(serializeQuizQuestions([draft])[0].correctAnswer, { index: 9 });
  assert.ok(validateQuizQuestions(serializeQuizQuestions([draft])));
});

test("canonical MATCHING questions round trip with stable IDs and mappings", () => {
  const stored: StoredQuizQuestion = { id: 17, question: "Match products", type: "MATCHING", options: { left: ["Phone", "Watch"], right: ["Wrist", "Pocket"] }, correctAnswer: { "0": 1, "1": 0 } };
  const draft = normalizeQuizQuestion(stored, 0);
  assert.deepEqual(draft.correctMatchingIndices, [1, 0]);
  const [serialized] = serializeQuizQuestions([draft]);
  assert.deepEqual(serialized, stored);
  assert.equal(validateQuizQuestions([serialized]), null);
  const switchedBack = { ...draft, type: "MATCHING" as const, correctBooleanValue: false };
  assert.deepEqual(serializeQuizQuestions([switchedBack])[0], stored);
});

test("MATCHING validation rejects blank labels, missing/extra left keys and out-of-range right choices", () => {
  const stored: StoredQuizQuestion = { question: "Match", type: "MATCHING", options: { left: ["A", "B"], right: ["X", "Y"] }, correctAnswer: { "0": 0, "1": 1 } };
  assert.ok(validateQuizQuestions([{ ...stored, correctAnswer: { "0": 0 } }]));
  assert.ok(validateQuizQuestions([{ ...stored, correctAnswer: { "0": 0, "1": 2 } }]));
  assert.ok(validateQuizQuestions([{ ...stored, correctAnswer: { "0": 0, "1": 1, "2": 0 } }]));
  assert.ok(validateQuizQuestions([{ ...stored, options: { left: ["A", "B"], right: ["X", " "] } }]));
});

test("live JSON preview accepts incomplete drafts while save requires explicit answers", () => {
  for (const type of ["SINGLE", "MULTIPLE", "TRUE_FALSE", "MATCHING"] as const) {
    const draft = createEmptyQuizQuestion(type);
    assert.doesNotThrow(() => JSON.stringify(serializeQuizQuestions([draft])));
    assert.ok(validateQuizQuestions(serializeQuizQuestions([draft])));
  }
});

test("question ownership rejects foreign, duplicated and simultaneously retained/deleted IDs", () => {
  assert.equal(validateQuestionIds([{ id: 11 }, {}], [11, 12], [12]), null);
  assert.equal(validateQuestionIds([], [11, 12]), null);
  assert.ok(validateQuestionIds([{ id: 99 }], [11, 12]));
  assert.ok(validateQuestionIds([{ id: 11 }, { id: 11 }], [11, 12]));
  assert.ok(validateQuestionIds([{ id: 11 }], [11, 12], [11]));
  assert.ok(validateQuestionIds([], [11, 12], [99]));
});

test("module PATCH keeps existing question IDs, creates only new questions, and deletes only explicit IDs", async () => {
  const loader = Module as unknown as { _load: (request: string, parent: unknown, isMain: boolean) => unknown };
  const originalLoad = loader._load;
  type Row = { id: number; moduleId: number; question: string; type: string; options: unknown; correctAnswer: unknown; sortOrder: number };
  const rows = new Map<number, Row>([
    [11, { id: 11, moduleId: 1, question: "Old single", type: "SINGLE", options: ["A", "B"], correctAnswer: { index: 0 }, sortOrder: 1 }],
    [12, { id: 12, moduleId: 1, question: "Keep matching", type: "MATCHING", options: { left: ["A", "B"], right: ["X", "Y"] }, correctAnswer: { "0": 1, "1": 0 }, sortOrder: 2 }]
  ]);
  let creates = 0;
  let deletes = 0;
  let moduleUpdates = 0;
  const transaction = {
    module: {
      findUnique: async () => ({ id: 1, title: "Previous", categoryId: 1, durationMin: 10, sortOrder: 0, isPublished: true }),
      update: async ({ data }: { data: Record<string, unknown> }) => { moduleUpdates++; return { id: 1, ...data }; }
    },
    quizQuestion: {
      findMany: async () => [...rows.values()].map((row) => ({ id: row.id })),
      update: async ({ where, data }: { where: { id: number }; data: Omit<Row, "id" | "moduleId"> }) => {
        const previous = rows.get(where.id);
        assert.ok(previous);
        rows.set(where.id, { ...previous, ...data });
        return { id: where.id };
      },
      create: async ({ data }: { data: Omit<Row, "id"> }) => {
        const id = 1000 + ++creates;
        rows.set(id, { id, ...data });
        return { id };
      },
      deleteMany: async ({ where }: { where: { moduleId: number; id?: { in: number[] } } }) => {
        deletes++;
        for (const [id, row] of rows) if (row.moduleId === where.moduleId && (!where.id || where.id.in.includes(id))) rows.delete(id);
      }
    }
  };
  const routePath = require.resolve("../app/api/admin/content/route");
  delete require.cache[routePath];
  loader._load = (request, parent, isMain) => {
    if (request === "@/lib/auth") return { requireRole: async () => ({ id: "test-admin" }) };
    if (request === "@/lib/prisma") return { prisma: { $transaction: async (callback: (tx: typeof transaction) => Promise<unknown>) => callback(transaction) } };
    if (request === "@/lib/admin-audit") return { createAdminAuditLog: async () => undefined, getRequestIpAddress: () => null };
    if (request === "@/lib/quiz-editor") return originalLoad(require.resolve("../lib/quiz-editor"), parent, isMain);
    return originalLoad(request, parent, isMain);
  };
  let patch: (request: Request) => Promise<Response>;
  // CommonJS loading is needed to inject transaction/auth mocks before evaluating the route.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  try { patch = (require(routePath) as { PATCH: typeof patch }).PATCH; }
  finally { loader._load = originalLoad; delete require.cache[routePath]; }
  const payload = { entity: "module", id: 1, categoryId: 1, title: "Updated module", description: "Description", durationMin: 10, sortOrder: 0, isPublished: true, contentBlocks: [] };
  const existing = { id: 11, question: "Updated single", type: "SINGLE", options: ["A", "B"], correctAnswer: { index: 1 } };
  const newQuestion = { question: "New matching", type: "MATCHING", options: { left: ["L1", "L2"], right: ["R1", "R2"] }, correctAnswer: { "0": 1, "1": 0 } };
  const send = (body: unknown) => patch(new Request("http://localhost/api/admin/content", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }));
  const first = await send({ ...payload, questions: [existing, newQuestion] });
  assert.equal(first.status, 200);
  const result = await first.json() as { questions: Array<{ id: number }>; questionIds: number[] };
  assert.deepEqual(result.questions.map((question) => question.id), [11, 1001]);
  assert.ok(result.questionIds.includes(12), "an omitted existing question must remain");
  assert.equal(creates, 1);
  assert.equal(deletes, 0);
  assert.equal(rows.get(11)?.question, "Updated single");
  assert.deepEqual(rows.get(1001)?.correctAnswer, newQuestion.correctAnswer);

  const second = await send({ ...payload, questions: [existing, { ...newQuestion, id: 1001 }], deletedQuestionIds: [12] });
  assert.equal(second.status, 200);
  assert.equal(creates, 1, "saving returned IDs must update the new question, never recreate it");
  assert.equal(rows.has(12), false);
  assert.equal(rows.has(11), true);
  assert.equal(rows.has(1001), true);

  const beforeUpdates = moduleUpdates;
  const foreign = await send({ ...payload, questions: [{ ...existing, id: 99 }] });
  assert.equal(foreign.status, 400);
  assert.equal(moduleUpdates, beforeUpdates, "foreign question IDs fail before any mutation");
  const blank = await send({ ...payload, questions: [{ ...existing, options: ["A", " "] }] });
  assert.equal(blank.status, 400);
  assert.equal(moduleUpdates, beforeUpdates);
});
