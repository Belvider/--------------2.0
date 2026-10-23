import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';

const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const canonical = value => value instanceof Date ? value.toISOString() : Array.isArray(value) ? value.map(canonical) : record(value)
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const json = value => JSON.stringify(canonical(value));
const equal = (a, b) => json(a) === json(b);
const hash = value => createHash('sha256').update(json(value)).digest('hex');
const copy = value => structuredClone(value);

export function parseReviewPath(pointer) {
  if (typeof pointer !== 'string' || !pointer.startsWith('/') || /~(?![01])/.test(pointer)) throw new Error('Invalid review path.');
  const parts = pointer.slice(1).split('/').map(part => part.replaceAll('~1', '/').replaceAll('~0', '~'));
  if (parts.some(part => !part || ['__proto__', 'prototype', 'constructor'].includes(part))) throw new Error('Unsafe review path.');
  const numeric = part => /^(0|[1-9]\d*)$/.test(part);
  const allowed = (parts.length === 1 && ['title', 'description'].includes(parts[0]))
    || (parts[0] === 'contentBlocks' && (parts.length === 1 || numeric(parts[1])))
    || (parts[0] === 'questions' && parts.length >= 3 && numeric(parts[1]) && ['question', 'options', 'correctAnswer'].includes(parts[2]));
  if (!allowed) throw new Error('Review path is outside editable content.');
  return parts;
}

function at(value, parts) {
  for (const part of parts) {
    if (value === null || typeof value !== 'object' || !Object.hasOwn(value, part)) throw new Error('Review path is missing from current content.');
    value = value[part];
  }
  return value;
}

function replace(value, parts, after) {
  const parent = at(value, parts.slice(0, -1));
  parent[parts.at(-1)] = copy(after);
}

export function validateReviewManifest(manifest) {
  if (manifest?.version !== 1 || !Array.isArray(manifest.modules) || !Array.isArray(manifest.edits)) throw new Error('Invalid review manifest.');
  const identities = new Map();
  for (const identity of manifest.modules) {
    if (!Number.isInteger(identity.id) || identity.id < 1 || identities.has(identity.id)
      || !Number.isInteger(identity.categoryId) || typeof identity.brandSlug !== 'string'
      || typeof identity.categorySlug !== 'string' || !Array.isArray(identity.questionIds)
      || !identity.questionIds.every(id => Number.isInteger(id) && id > 0)
      || new Set(identity.questionIds).size !== identity.questionIds.length) throw new Error('Invalid module identity in review.');
    identities.set(identity.id, identity);
  }
  const paths = new Map();
  for (const edit of manifest.edits) {
    if (!identities.has(edit.moduleId) || !Object.hasOwn(edit, 'before') || !Object.hasOwn(edit, 'after')
      || edit.before === undefined || edit.after === undefined || typeof edit.reason !== 'string'
      || !Array.isArray(edit.sourceUrls)) throw new Error('Invalid review edit.');
    const parts = parseReviewPath(edit.path);
    if (parts[0] === 'questions' && Number(parts[1]) >= identities.get(edit.moduleId).questionIds.length) throw new Error('Question index is outside reviewed identity.');
    const previous = paths.get(edit.moduleId) ?? [];
    if (previous.some(p => p.every((part, i) => parts[i] === part) || parts.every((part, i) => p[i] === part))) throw new Error('Overlapping review edits.');
    previous.push(parts); paths.set(edit.moduleId, previous);
  }
  return identities;
}

// Prepare an atomic plan from fresh database content. Unrelated online edits survive.
export function prepareContentReview(currentModules, manifest) {
  const identities = validateReviewManifest(manifest);
  const current = new Map(currentModules.map(module => [module.id, module]));
  const changed = new Map();
  const conflicts = [];
  let alreadyApplied = 0;
  for (const id of new Set(manifest.edits.map(edit => edit.moduleId))) {
    const identity = identities.get(id), module = current.get(id);
    if (!module || module.categoryId !== identity.categoryId || module.category?.slug !== identity.categorySlug
      || module.category?.brand?.slug !== identity.brandSlug || !equal(module.questions.map(q => q.id), identity.questionIds)
      || module.questions.some(q => q.moduleId !== id)) throw new Error(`Module identity changed: ${id}.`);
  }
  for (const edit of manifest.edits) {
    const module = current.get(edit.moduleId), parts = parseReviewPath(edit.path);
    const value = at(module, parts);
    if (equal(value, edit.after)) { alreadyApplied++; continue; }
    if (!equal(value, edit.before)) { conflicts.push(`${edit.moduleId}${edit.path}`); continue; }
    if (!changed.has(module.id)) changed.set(module.id, copy(module));
    replace(changed.get(module.id), parts, edit.after);
  }
  if (conflicts.length) return { conflicts, entries: [], alreadyApplied };
  const entries = [];
  for (const [id, next] of changed) {
    const before = current.get(id), data = {};
    for (const key of ['title', 'description', 'contentBlocks']) if (!equal(before[key], next[key])) data[key] = next[key];
    const questions = next.questions.flatMap((question, i) => {
      const data = {};
      for (const key of ['question', 'options', 'correctAnswer']) if (!equal(before.questions[i][key], question[key])) data[key] = question[key];
      return Object.keys(data).length ? [{ id: question.id, data }] : [];
    });
    entries.push({ id, data, questions });
  }
  return { conflicts, entries, alreadyApplied };
}

function saveVerified(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  if (hash(JSON.parse(fs.readFileSync(file, 'utf8'))) !== hash(value)) throw new Error('Content backup verification failed.');
}

async function readModules(db) {
  return db.module.findMany({ orderBy: { id: 'asc' }, include: {
    category: { include: { brand: true } }, questions: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }
  } });
}

export async function writeContentReview(tx, plan) {
  if (plan.conflicts.length) throw new Error('Content review has conflicts.');
  for (const entry of plan.entries) {
    if (Object.keys(entry.data).length) await tx.module.update({ where: { id: entry.id }, data: entry.data });
    for (const question of entry.questions) await tx.quizQuestion.update({ where: { id: question.id }, data: question.data });
  }
}

export function parseReviewArguments(args) {
  let reviewDate = '2026-10-19', local = false, apply = false;
  const seen = new Set();
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (seen.has(arg)) throw new Error('Duplicate review argument.');
    seen.add(arg);
    if (arg === '--local') local = true;
    else if (arg === '--apply') apply = true;
    else if (arg === '--review') {
      const date = args[++i];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') || Number.isNaN(Date.parse(date))
        || new Date(date).toISOString().slice(0, 10) !== date) throw new Error('Use --review YYYY-MM-DD with a valid date.');
      reviewDate = date;
    } else throw new Error('Use --review YYYY-MM-DD, --local and/or --apply only.');
  }
  return { reviewDate, local, apply };
}

async function main() {
  const { reviewDate, local, apply } = parseReviewArguments(process.argv.slice(2));
  const url = process.env[local ? 'SOURCE_DATABASE_URL' : 'TARGET_DATABASE_URL'];
  if (!url) throw new Error('Load the transfer environment file explicitly.');
  let hostname;
  try { hostname = new URL(url).hostname; } catch { throw new Error('Invalid configured database address.'); }
  if (local ? !['localhost', '127.0.0.1', '[::1]'].includes(hostname) : !hostname.endsWith('.neon.tech')) throw new Error('Unexpected database target.');
  const manifest = JSON.parse(fs.readFileSync(`content/reviews/${reviewDate}.json`, 'utf8'));
  if (manifest.reviewedAt !== reviewDate) throw new Error('Review date does not match the selected manifest.');
  validateReviewManifest(manifest);
  const ids = [...new Set(manifest.edits.map(edit => edit.moduleId))].sort((a, b) => a - b);
  const target = local ? 'local' : 'production';
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const prefix = `reports/content-verification-${reviewDate}/${target}-${stamp}`;
  const db = new PrismaClient({ datasources: { db: { url } } });
  try {
    const result = await db.$transaction(async tx => {
      if (apply) {
        await tx.$queryRawUnsafe('SELECT id FROM modules WHERE id = ANY($1::int[]) ORDER BY id FOR UPDATE', ids);
        await tx.$queryRawUnsafe('SELECT id FROM quiz_questions WHERE module_id = ANY($1::int[]) ORDER BY id FOR UPDATE', ids);
      } else await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');
      const modules = await readModules(tx);
      const plan = prepareContentReview(modules, manifest);
      saveVerified(prefix + '-plan.json', { target, manifestHash: hash(manifest), ...plan });
      if (plan.conflicts.length) return { target, applied: false, conflicts: plan.conflicts };
      if (apply && plan.entries.length) {
        const backupModules = modules.filter(m => ids.includes(m.id));
        saveVerified(prefix + '-backup.json', { target, manifestHash: hash(manifest), contentHash: hash(backupModules), modules: backupModules });
        await writeContentReview(tx, plan);
        const verification = prepareContentReview(await readModules(tx), manifest);
        if (verification.conflicts.length || verification.entries.length) throw new Error('Content readback failed.');
      }
      return { target, applied: apply, changedModules: plan.entries.length,
        changedQuestions: plan.entries.reduce((sum, e) => sum + e.questions.length, 0),
        alreadyApplied: plan.alreadyApplied, totalModules: modules.length,
        totalQuestions: modules.reduce((sum, m) => sum + m.questions.length, 0), conflicts: [] };
    }, { isolationLevel: 'Serializable', maxWait: 20_000, timeout: 90_000 });
    saveVerified(prefix + '-result.json', result);
    console.log(JSON.stringify(result, null, 2));
    if (result.conflicts.length) process.exitCode = 1;
  } finally { await db.$disconnect(); }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch(error => {
    // Prisma errors may include connection strings or query context. Do not log them.
    console.error(error?.name?.startsWith('Prisma') ? `Database content review failed (${error.code ?? 'database error'}).` : error.message);
    process.exitCode = 1;
  });
}
