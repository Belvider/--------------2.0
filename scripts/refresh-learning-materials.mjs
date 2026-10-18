import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { PrismaClient } from '@prisma/client';

// A targeted content update, never a seed/reset. Load credentials explicitly:
// node --env-file=.env.transfer.local scripts/refresh-learning-materials.mjs
// Review reports/learning-refresh-2026-10-18/plan.json, then add --apply.
const BASELINE = '25cc7eb';
const REPORT_DIR = 'reports/learning-refresh-2026-10-18';
const clone = value => structuredClone(value);
const canonical = value => Array.isArray(value) ? value.map(canonical) : record(value)
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const json = value => JSON.stringify(canonical(value));
const equal = (a, b) => json(a) === json(b);
const hash = value => createHash('sha256').update(json(value)).digest('hex');
const record = value => value && typeof value === 'object' && !Array.isArray(value);

// Keep online edits. Only fields still equal to the previous source are replaced.
export function mergeLearningContent(current, before, after, conflicts = [], location = '') {
  if (equal(before, after) || equal(current, after)) return clone(current);
  if (equal(current, before)) return clone(after);
  if (record(current) && record(before) && record(after)) {
    const result = clone(current);
    for (const key of Object.keys(after)) {
      if (!(key in before)) {
        if (!(key in current)) result[key] = clone(after[key]);
        else if (!equal(current[key], after[key])) conflicts.push(`${location}.${key}`);
      } else if (key in current) {
        result[key] = mergeLearningContent(current[key], before[key], after[key], conflicts, `${location}.${key}`);
      } else if (!equal(before[key], after[key])) conflicts.push(`${location}.${key}`);
    }
    return result;
  }
  if (Array.isArray(current) && Array.isArray(before) && Array.isArray(after)) {
    if (arraysOfStrings(current, before, after) && before.length === after.length) {
      return current.map(value => {
        const index = before.indexOf(value);
        return index >= 0 ? after[index] : value;
      });
    }
    const arrays = [current, before, after];
    const key = ['slug', 'id'].find(k => arrays.every(a => a.every(v => record(v) && v[k] !== undefined) && new Set(a.map(v => v[k])).size === a.length));
    if (key) {
      const oldById = new Map(before.map(v => [v[key], v]));
      const newById = new Map(after.map(v => [v[key], v]));
      const result = current.map(v => oldById.has(v[key]) && newById.has(v[key])
        ? mergeLearningContent(v, oldById.get(v[key]), newById.get(v[key]), conflicts, `${location}[${v[key]}]`) : clone(v));
      for (const item of after) {
        if (!oldById.has(item[key])) {
          const existing = result.find(v => v[key] === item[key]);
          if (!existing) result.push(clone(item));
          else if (!equal(existing, item)) conflicts.push(`${location}[${item[key]}]`);
        }
      }
      return result;
    }
  }
  conflicts.push(location);
  return clone(current);
}

function arraysOfStrings(...arrays) { return arrays.every(a => a.every(v => typeof v === 'string')); }

function sourceModule(file, revision, cache = new Map()) {
  const filename = path.resolve(file);
  if (cache.has(filename)) return cache.get(filename).exports;
  const source = revision ? execFileSync('git', ['show', `${revision}:${file.replaceAll('\\', '/')}`], { encoding: 'utf8', maxBuffer: 10e6 }) : fs.readFileSync(filename, 'utf8');
  const loaded = new Module(filename);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  cache.set(filename, loaded);
  const installed = Module.createRequire(filename);
  loaded.require = request => {
    if (request.startsWith('@/') || request.startsWith('.')) {
      const dependency = request.startsWith('@/') ? request.slice(2) : path.relative(process.cwd(), path.resolve(path.dirname(filename), request));
      const resolved = path.extname(dependency) ? dependency : `${dependency}.ts`;
      return sourceModule(resolved, revision, cache);
    }
    return installed(request);
  };
  loaded._compile(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
  return loaded.exports;
}

function sourceChanges() {
  const files = execFileSync('git', ['-c', 'core.autocrlf=false', 'diff', '--name-only', BASELINE, '--', 'lib/content', 'lib/portal-pages.ts'], { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
  const pairs = new Map();
  function collect(before, after, file) {
    if (Array.isArray(before) && Array.isArray(after)) {
      if (before.length === after.length) before.forEach((v, i) => collect(v, after[i], file));
      return;
    }
    if (!record(before) || !record(after)) return;
    if (typeof before.type === 'string' && typeof before.title === 'string' && before.type === after.type) {
      if (!equal(before, after)) pairs.set(hash([file, before]), { before, after, file });
      return;
    }
    for (const key of Object.keys(before)) if (key in after) collect(before[key], after[key], file);
  }
  for (const file of files.filter(f => f.startsWith('lib/content/'))) collect(sourceModule(file, BASELINE), sourceModule(file), file);
  const oldPortal = sourceModule('lib/portal-pages.ts', BASELINE);
  const newPortal = sourceModule('lib/portal-pages.ts');
  return { pairs: [...pairs.values()], portals: newPortal.portalPageSlugs.map(slug => ({ key: newPortal.getPortalPageSettingKey(slug), before: oldPortal.getDefaultPortalPageContent(slug), after: newPortal.getDefaultPortalPageContent(slug) })), files };
}

const quizEdits = [
  { before: 'Що означає перший символ «M» у номері моделі iPhone?', after: 'Яке позначення потрібно звірити з довідником Apple, щоб визначити модель і регіональну версію?', options: ['Номер моделі Axxxx', 'Колір шпалер', 'Першу літеру імені власника', 'Кількість встановлених програм'], expected: { index: 0 } },
  { before: 'Яка версія iPhone зазвичай має один фізичний слот nano-SIM і підтримку eSIM?', after: 'Що потрібно перевірити, щоб точно визначити підтримувані SIM-картки конкретного iPhone?', options: ['Номер моделі та офіційні характеристики регіональної версії', 'Лише колір корпусу', 'Лише назву Global у прайсі', 'Кількість встановлених програм'], expected: { index: 0 } },
  { before: 'Яка модель у вашому матеріалі описується як компактніший сценарій на 1-2 людини?', after: 'Яка модель має чотири окремі слоти та дві незалежні зони керування?', expected: { index: 1 } },
  { before: "Яка модель більше підійде для сім'ї або активного сніданкового сценарію?", after: 'Яка модель має два довгі слоти зі спільним керуванням?', expected: { index: 1 } }
];

async function counts(db) {
  const models = ['user', 'module', 'quizQuestion', 'userProgress', 'quizAttempt', 'certificate'];
  return Object.fromEntries(await Promise.all(models.map(async name => [name, await db[name].count()])));
}

function saveJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2), { flag: 'wx' });
  if (!equal(JSON.parse(fs.readFileSync(file, 'utf8')), value)) throw new Error('Backup verification failed.');
}

async function plan(db, targetIdentity) {
  const sources = sourceChanges();
  const [modules, settings] = await Promise.all([
    db.module.findMany({ orderBy: { id: 'asc' }, include: { category: { include: { brand: true } }, questions: true } }),
    db.appSetting.findMany()
  ]);
  const entries = [], conflicts = [], ambiguous = [];
  for (const module of modules) {
    if (!Array.isArray(module.contentBlocks)) continue;
    const blocks = module.contentBlocks.map((block, i) => {
      if (!record(block)) return block;
      if (sources.pairs.some(pair => equal(pair.after, block))) return block;
      let candidates = sources.pairs.filter(p => p.before.type === block.type && p.before.title === block.title);
      const sourceName = `${module.category.brand.slug}-${module.category.slug}`;
      const scoped = candidates.filter(p => p.file === `lib/content/${sourceName}.ts` || (module.category.brand.slug === 'apple' && p.file === `lib/content/${module.category.slug}.ts`));
      if (fs.existsSync(`lib/content/${sourceName}.ts`)) candidates = scoped;
      const exact = candidates.find(p => equal(p.before, block));
      const pair = exact ?? (candidates.length === 1 ? candidates[0] : undefined);
      if (!pair) { if (candidates.length > 1) ambiguous.push({ moduleId: module.id, block: i }); return block; }
      return mergeLearningContent(block, pair.before, pair.after, conflicts, `module:${module.id}.blocks[${i}]`);
    });
    if (!equal(blocks, module.contentBlocks)) entries.push({ model: 'module', id: module.id, before: { contentBlocks: module.contentBlocks }, after: { contentBlocks: blocks } });
    const iphone = module.category.brand.slug === 'apple' && module.category.slug === 'iphone';
    for (const question of module.questions) {
      let text = question.question.replace(/^True\/False:\s*/, '').replaceAll('у вашому матеріалі', 'в матеріалі').replaceAll('у вашому каталозі', 'в каталозі').replaceAll('із вашого матеріалу', 'із матеріалу').replaceAll('з вашого матеріалу', 'із матеріалу').replaceAll('з вашого каталогу', 'із каталогу').replaceAll('SE 2 gen і SE 3 gen', 'SE 2-го та 3-го поколінь');
      let options = clone(question.options);
      if (iphone && Array.isArray(options)) options = options.map(v => v === 'iPhone 17 Air' ? 'iPhone Air' : v);
      if (module.category.slug === 'airpods') {
        if (Array.isArray(options)) options = options.map(v => v === 'AirPods Max 2' ? 'AirPods Max із USB-C (2024)' : v);
        if (question.question === 'True/False: AirPods Max 2 у вашому каталозі вже перейшли на USB-C.') text = 'AirPods Max із USB-C (2024) мають роз’єм USB-C для заряджання.';
      }
      const edit = quizEdits.find(v => v.before === question.question);
      if (edit) {
        if (!equal(question.correctAnswer, edit.expected)) throw new Error(`Unexpected quiz answer for question ${question.id}.`);
        text = edit.after; if (edit.options) options = edit.options;
      }
      if (text !== question.question || !equal(options, question.options)) entries.push({ model: 'quizQuestion', id: question.id, before: { question: question.question, options: question.options }, after: { question: text, options } });
    }
  }
  for (const setting of settings) {
    const pair = sources.portals.find(v => v.key === setting.key);
    if (!pair) continue;
    const value = mergeLearningContent(setting.value, pair.before, pair.after, conflicts, `setting:${setting.key}`);
    if (!equal(value, setting.value)) entries.push({ model: 'appSetting', id: setting.id, before: { value: setting.value }, after: { value } });
  }
  return { version: 1, baseline: BASELINE, targetIdentity, files: sources.files, counts: await counts(db), conflicts, ambiguous, entries };
}

async function main() {
  const local = process.argv.includes('--local');
  const uri = process.env[local ? 'SOURCE_DATABASE_URL' : 'TARGET_DATABASE_URL'];
  if (!uri) throw new Error('Set the named database URL in the process environment.');
  const parsed = new URL(uri);
  if (!local && !parsed.hostname.endsWith('.neon.tech')) throw new Error('Expected the configured Neon target.');
  if (local && !['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname)) throw new Error('Expected a local source database.');
  const targetIdentity = hash([parsed.hostname, parsed.port, parsed.pathname, parsed.username]);
  const db = new PrismaClient({ datasourceUrl: uri, log: [] });
  const planPath = `${REPORT_DIR}/${local ? 'local-' : ''}plan.json`;
  try {
    if (!process.argv.includes('--apply')) {
      const result = await plan(db, targetIdentity);
      if (fs.existsSync(planPath)) fs.renameSync(planPath, `${planPath}.${Date.now()}.previous`);
      saveJson(planPath, result);
      console.log(JSON.stringify({ mode: 'dry-run', plan: planPath, changes: result.entries.reduce((a, v) => ({ ...a, [v.model]: (a[v.model] ?? 0) + 1 }), {}), conflicts: result.conflicts, ambiguous: result.ambiguous, counts: result.counts }));
      return;
    }
    const result = JSON.parse(fs.readFileSync(planPath, 'utf8'));
    if (result.targetIdentity !== targetIdentity || result.conflicts.length || result.ambiguous.length) throw new Error('Review target/conflicts before applying.');
    const backup = `${REPORT_DIR}/${local ? 'local-' : ''}before-${Date.now()}.json`;
    saveJson(backup, result);
    await db.$transaction(async tx => {
      const beforeCounts = await counts(tx);
      for (const entry of result.entries) {
        const select = Object.fromEntries(Object.keys(entry.before).map(key => [key, true]));
        const current = await tx[entry.model].findUnique({ where: { id: entry.id }, select });
        if (!equal(current, entry.before)) throw new Error(`Concurrent edit for ${entry.model}:${entry.id}; rebuild the plan.`);
        const updated = await tx[entry.model].update({ where: { id: entry.id }, data: entry.after, select });
        if (!equal(updated, entry.after)) throw new Error('Updated content verification failed.');
      }
      if (!equal(beforeCounts, await counts(tx))) throw new Error('Record counts changed.');
    }, { isolationLevel: 'Serializable', maxWait: 15000, timeout: 90000 });
    console.log(JSON.stringify({ mode: 'applied', records: result.entries.length, backup, counts: await counts(db) }));
  } finally { await db.$disconnect(); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.name?.startsWith('Prisma') ? `Content update failed (${error.code ?? 'database'}).` : String(error.message).replace(/postgres(?:ql)?:\/\/\S+/g, '[redacted]')); process.exitCode = 1; });
}
