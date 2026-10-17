import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import { PrismaClient, type Prisma } from "@prisma/client";
import {
  getLearningTopicBlocks,
  getLearningTopicQuestions,
  learningTopics
} from "../lib/content/learning-category-repairs";
import { smegCoffeeMachinesFoundationBlocks } from "../lib/content/smeg-coffee-machines";

// Dry-run by default. Apply only after creating a full database backup:
// node --import tsx scripts/repair-audited-content.ts --apply --backup reports/site-fixes-2026-10-13/before-fixes.dump
// This repairs existing content and existing question IDs, never seeds or deletes.
loadEnvConfig(process.cwd());
const prisma = new PrismaClient();
const reportDir = path.join(process.cwd(), "reports/site-fixes-2026-10-13");
const targetIds = [2, 4, 37, ...learningTopics.flatMap((topic) => topic.moduleIds)].sort((a, b) => a - b);

function fingerprint(value: unknown) {
  function canonical(item: unknown): unknown {
    if (Array.isArray(item)) return item.map(canonical);
    if (item && typeof item === "object") {
      return Object.fromEntries(Object.entries(item).sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, canonical(entry)]));
    }
    return item;
  }
  return createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");
}

function repairAssetUrls(value: unknown): unknown {
  if (typeof value === "string") {
    if (!/^\/materials\/(iphone|ipad)\/Color\//.test(value)) return value;
    const repaired = value.replaceAll(":", "_");
    if (repaired !== value) {
      const localPath = path.resolve(process.cwd(), "public", decodeURIComponent(repaired.slice(1)));
      const publicRoot = path.resolve(process.cwd(), "public") + path.sep;
      if (!localPath.startsWith(publicRoot) || !fs.existsSync(localPath)) {
        throw new Error(`Replacement asset does not exist: ${repaired}`);
      }
    }
    return repaired;
  }
  if (Array.isArray(value)) return value.map(repairAssetUrls);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, repairAssetUrls(item)]));
  }
  return value;
}

async function historyCounts() {
  const where = { moduleId: { in: targetIds } };
  const [modules, questions, progress, attempts, certificates] = await Promise.all([
    prisma.module.count({ where: { id: { in: targetIds } } }),
    prisma.quizQuestion.count({ where }),
    prisma.userProgress.count({ where }),
    prisma.quizAttempt.count({ where }),
    prisma.certificate.count({ where })
  ]);
  return { modules, questions, progress, attempts, certificates };
}

async function main() {
  const apply = process.argv.includes("--apply");
  const backupArgIndex = process.argv.indexOf("--backup");
  const fullBackup = backupArgIndex >= 0 ? process.argv[backupArgIndex + 1] : undefined;
  if (apply && (!fullBackup || !fs.existsSync(path.resolve(fullBackup)) || fs.statSync(path.resolve(fullBackup)).size === 0)) {
    throw new Error("Apply requires --backup pointing to an existing non-empty full database backup.");
  }

  const modules = await prisma.module.findMany({
    where: { id: { in: targetIds } },
    include: {
      category: { include: { brand: true } },
      questions: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }
    },
    orderBy: { id: "asc" }
  });
  if (modules.length !== targetIds.length) throw new Error("Some expected modules are missing; refusing partial repair.");

  const changes = modules.map((module) => {
    let contentBlocks: unknown = module.contentBlocks;
    let questions: ReturnType<typeof getLearningTopicQuestions> | null = null;
    const topic = learningTopics.find((item) => item.moduleIds.includes(module.id));

    if (topic) {
      if (module.category.brand.slug !== topic.brand || module.category.slug !== topic.category) {
        throw new Error(`Module ${module.id} does not match expected ${topic.brand}/${topic.category}.`);
      }
      const kind = module.id === topic.moduleIds[0] ? "basics" : "sales";
      contentBlocks = getLearningTopicBlocks(topic, kind);
      questions = getLearningTopicQuestions(topic, kind);
      if (module.questions.length !== questions.length) {
        throw new Error(`Module ${module.id} needs ${questions.length} existing question IDs; found ${module.questions.length}.`);
      }
    } else if (module.id === 2 || module.id === 4) {
      const expectedCategory = module.id === 2 ? "iphone" : "ipad";
      if (module.category.brand.slug !== "apple" || module.category.slug !== expectedCategory) {
        throw new Error(`Module ${module.id} is not expected Apple ${expectedCategory} module.`);
      }
      contentBlocks = repairAssetUrls(contentBlocks);
    } else if (module.id === 37) {
      if (module.category.brand.slug !== "smeg" || module.category.slug !== "coffee-machines" || !Array.isArray(contentBlocks)) {
        throw new Error("Module 37 is not the expected coffee-machine content.");
      }
      const replacement = smegCoffeeMachinesFoundationBlocks.find((block) => block.title === "Технології кавоварок Smeg: ECF02 та DCF02");
      if (!replacement) throw new Error("Missing Smeg replacement source block.");
      contentBlocks = contentBlocks.map((block) => {
        if (block && typeof block === "object" && "title" in block && block.title === "Основні технології Smeg:") return replacement;
        return block;
      });
    }

    const currentQuestions = module.questions.map(({ question, type, options, correctAnswer, sortOrder }) => ({ question, type, options, correctAnswer, sortOrder }));
    return {
      id: module.id, title: module.title,
      originalFingerprint: fingerprint({ contentBlocks: module.contentBlocks, questions: currentQuestions }),
      contentBlocks,
      questions,
      contentChanged: fingerprint(contentBlocks) !== fingerprint(module.contentBlocks),
      questionsChanged: questions !== null && fingerprint(questions) !== fingerprint(currentQuestions),
      questionIds: module.questions.map((question) => question.id)
    };
  }).filter((change) => change.contentChanged || change.questionsChanged);

  const beforeCounts = await historyCounts();
  fs.mkdirSync(reportDir, { recursive: true });
  const planPath = path.join(reportDir, "content-repair-plan.json");
  fs.writeFileSync(planPath, JSON.stringify({ apply, beforeCounts, changes }, null, 2), "utf8");
  console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", changedModules: changes.length, changedQuestionSets: changes.filter((change) => change.questionsChanged).length, planPath, beforeCounts }));
  if (!apply || changes.length === 0) return;

  const stamp = new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
  const contentBackupPath = path.join(reportDir, `content-before-${stamp}.json`);
  fs.writeFileSync(contentBackupPath, JSON.stringify({
    createdAt: new Date().toISOString(), fullBackup: path.resolve(fullBackup!), beforeCounts,
    modules: modules.map(({ id, title, contentBlocks, questions }) => ({ id, title, contentBlocks, questions }))
  }, null, 2), { encoding: "utf8", flag: "wx" });

  await prisma.$transaction(async (tx) => {
    for (const change of changes) {
      const current = await tx.module.findUniqueOrThrow({ where: { id: change.id }, include: { questions: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } } });
      const currentQuestions = current.questions.map(({ question, type, options, correctAnswer, sortOrder }) => ({ question, type, options, correctAnswer, sortOrder }));
      if (fingerprint({ contentBlocks: current.contentBlocks, questions: currentQuestions }) !== change.originalFingerprint) {
        throw new Error(`Module ${change.id} changed after plan preparation; refusing to overwrite.`);
      }
      if (change.contentChanged) await tx.module.update({ where: { id: change.id }, data: { contentBlocks: change.contentBlocks as Prisma.InputJsonValue } });
      if (change.questionsChanged && change.questions) {
        for (let index = 0; index < change.questions.length; index++) {
          await tx.quizQuestion.update({ where: { id: change.questionIds[index] }, data: change.questions[index] });
        }
      }
    }
  }, { timeout: 30000 });

  const afterCounts = await historyCounts();
  if (fingerprint(beforeCounts) !== fingerprint(afterCounts)) throw new Error("History counts changed unexpectedly; inspect backups before continuing.");
  const afterModules = await prisma.module.findMany({ where: { id: { in: changes.map((change) => change.id) } }, select: { id: true, contentBlocks: true, questions: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } } });
  for (const module of afterModules) {
    const expected = changes.find((change) => change.id === module.id)!;
    if (fingerprint(module.contentBlocks) !== fingerprint(expected.contentBlocks)) throw new Error(`Content verification failed for module ${module.id}.`);
    if (fingerprint(module.questions.map((question) => question.id)) !== fingerprint(expected.questionIds)) throw new Error(`Question IDs changed for module ${module.id}.`);
    if (expected.questions) {
      const questions = module.questions.map(({ question, type, options, correctAnswer, sortOrder }) => ({ question, type, options, correctAnswer, sortOrder }));
      if (fingerprint(questions) !== fingerprint(expected.questions)) throw new Error(`Question verification failed for module ${module.id}.`);
    }
  }
  const resultPath = path.join(reportDir, "content-repair-result.json");
  fs.writeFileSync(resultPath, JSON.stringify({ repairedModules: changes.map((change) => change.id), repairedQuestions: changes.filter((change) => change.questionsChanged).reduce((sum, change) => sum + change.questionIds.length, 0), beforeCounts, afterCounts, contentBackupPath }, null, 2), "utf8");
  console.log(JSON.stringify({ verified: true, resultPath, contentBackupPath, afterCounts }));
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
