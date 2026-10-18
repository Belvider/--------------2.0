/**
 * Insert-only transfer of the portal's local PostgreSQL data into its cloud DB.
 * Usage: SOURCE_DATABASE_URL=... TARGET_DATABASE_URL=... node scripts/transfer-database.mjs
 * Add --apply to write, after reviewing the default dry-run. Never loads .env.
 * Backups include password hashes/tokens/PII: they stay in ignored reports/.
 */
import { createHash, randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Dependency order matters. Natural keys beyond schema uniques deliberately err
// on the side of a conflict: two different lessons with the same title are never
// guessed to be the same lesson. Event tables use their full scalar contents.
export const MODELS = [
  { name: 'User', key: 'user', table: 'users', natural: ['email'], stringId: true },
  { name: 'Brand', key: 'brand', table: 'brands', natural: ['slug'] },
  { name: 'Badge', key: 'badge', table: 'badges', natural: ['code'] },
  { name: 'Category', key: 'category', table: 'categories', natural: ['brandId', 'slug'], refs: { brandId: 'brand' } },
  { name: 'Module', key: 'module', table: 'modules', natural: ['categoryId', 'title'], refs: { categoryId: 'category' }, json: ['contentBlocks'] },
  { name: 'QuizQuestion', key: 'quizQuestion', table: 'quiz_questions', natural: ['moduleId', 'sortOrder', 'question'], refs: { moduleId: 'module' }, json: ['options', 'correctAnswer'] },
  { name: 'UserProgress', key: 'userProgress', table: 'user_progress', natural: ['userId', 'moduleId'], refs: { userId: 'user', moduleId: 'module' } },
  { name: 'LearningActivity', key: 'learningActivity', table: 'learning_activity', natural: ['userId', 'moduleId', 'day'], refs: { userId: 'user' }, historicalRefs: { moduleId: 'module' } },
  { name: 'QuizAttempt', key: 'quizAttempt', table: 'quiz_attempts', refs: { userId: 'user', moduleId: 'module' }, json: ['answers'] },
  { name: 'Certificate', key: 'certificate', table: 'certificates', natural: ['userId', 'moduleId'], refs: { userId: 'user', moduleId: 'module' } },
  { name: 'UserBadge', key: 'userBadge', table: 'user_badges', natural: ['userId', 'badgeId'], refs: { userId: 'user', badgeId: 'badge' } },
  { name: 'PasswordResetToken', key: 'passwordResetToken', table: 'password_reset_tokens', natural: ['token'], stringId: true, historicalRefs: { userId: 'user' } },
  { name: 'LoginAttempt', key: 'loginAttempt', table: 'login_attempts' },
  { name: 'LearningAssignment', key: 'learningAssignment', table: 'learning_assignments', refs: { moduleId: 'module', assignedById: 'user', userId: 'user' } },
  { name: 'AdminAuditLog', key: 'adminAuditLog', table: 'admin_audit_logs', refs: { actorId: 'user' }, json: ['details'], nullableJson: ['details'] },
  { name: 'AppSetting', key: 'appSetting', table: 'app_settings', natural: ['key'], json: ['value'] }
];

const jsonRefs = {
  moduleId: 'module', moduleIds: 'module', categoryId: 'category', categoryIds: 'category',
  brandId: 'brand', brandIds: 'brand', questionId: 'quizQuestion', questionIds: 'quizQuestion',
  userId: 'user', userIds: 'user', actorId: 'user', assignedById: 'user', badgeId: 'badge',
  badgeIds: 'badge', assignmentId: 'learningAssignment', assignmentIds: 'learningAssignment'
};
const auditTargets = { user: 'user', brand: 'brand', category: 'category', module: 'module', assignment: 'learningAssignment' };
const withoutId = ({ id, ...rest }) => rest;
const clone = (value) => structuredClone(value);
const sameId = (a, b) => String(a) === String(b);
const idKey = (id) => String(id);

function sorted(value) {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(sorted);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sorted(value[key])]));
  return value;
}
export const canonical = (value) => JSON.stringify(sorted(value));
export const fingerprint = (value) => createHash('sha256').update(canonical(value)).digest('hex');
export function emptySnapshot() {
  return { models: Object.fromEntries(MODELS.map(({ key }) => [key, []])), jsonNulls: { adminAuditLog: { details: [] } } };
}

function assertSnapshot(snapshot) {
  if (!snapshot?.models || MODELS.some(({ key }) => !Array.isArray(snapshot.models[key])) || Object.keys(snapshot.models).length !== MODELS.length) {
    throw new Error('Snapshot does not cover exactly the portal models.');
  }
  for (const spec of MODELS) {
    const ids = snapshot.models[spec.key].map(({ id }) => idKey(id));
    if (new Set(ids).size !== ids.length || ids.some((id) => id === 'undefined' || id === 'null')) throw new Error(`Invalid IDs in ${spec.name}.`);
  }
}

function nullFields(snapshot, spec, id) {
  return (spec.nullableJson ?? []).filter((field) => (snapshot.jsonNulls?.[spec.key]?.[field] ?? []).some((value) => sameId(value, id)));
}

function mappedId(maps, model, value) {
  if (value == null) return value;
  return maps[model]?.get(idKey(value)) ?? value;
}

// Rewrites only known reference structures. Unknown ID-like keys which would
// change are reported rather than interpreted. Numeric option indices and block
// IDs are intentionally left alone.
function rewriteJson(value, maps, onUnknown, key = '', context = '') {
  const ref = jsonRefs[key];
  if (ref && (typeof value === 'number' || typeof value === 'string')) return mappedId(maps, ref, value);
  if (Array.isArray(value)) return value.map((item, index) => rewriteJson(item, maps, onUnknown, ref ? key : '', `${context}[${index}]`));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([childKey, item]) => [childKey, rewriteJson(item, maps, onUnknown, childKey, `${context}.${childKey}`)]));
  }
  if (/(?:[_-]id(?:s)?|Id(?:s)?|IDs)$/.test(key) && !ref && value != null) {
    const changes = Object.values(maps).some((map) => map.has(idKey(value)) && !sameId(map.get(idKey(value)), value));
    if (changes) onUnknown(context, 'unrecognized-json-reference');
  }
  if (typeof value === 'string') {
    return value.replace(/(https?:\/\/[^\s"'<>]+)?\/(module|admin\/modules)\/(\d+)(?=[/#?\s"'<>]|$)/g, (whole, origin, route, rawId) => {
      const next = mappedId(maps, 'module', Number(rawId));
      if (sameId(next, rawId)) return whole;
      if (origin) { onUnknown(context, 'absolute-module-link'); return whole; }
      return `/${route}/${next}`;
    });
  }
  return value;
}

function transformRow(spec, row, maps, onUnknown = () => {}) {
  const next = clone(row);
  for (const [field, ref] of Object.entries({ ...spec.refs, ...spec.historicalRefs })) next[field] = mappedId(maps, ref, next[field]);
  for (const field of spec.json ?? []) next[field] = rewriteJson(next[field], maps, onUnknown, '', field);
  if (spec.key === 'adminAuditLog' && auditTargets[next.targetType] && next.targetId != null) {
    next.targetId = String(mappedId(maps, auditTargets[next.targetType], next.targetId));
    // Audit details often store the target's complete scalar row, with `id`.
    if (next.details && typeof next.details === 'object' && !Array.isArray(next.details) && next.details.id != null) {
      next.details.id = mappedId(maps, auditTargets[next.targetType], next.details.id);
    }
  }
  return next;
}

function differenceFields(expected, actual, expectedNulls, actualNulls) {
  const fields = new Set([...Object.keys(expected), ...Object.keys(actual)]);
  fields.delete('id');
  const changed = [...fields].filter((field) => canonical(expected[field]) !== canonical(actual[field]));
  for (const field of new Set([...expectedNulls, ...actualNulls])) {
    if (expectedNulls.includes(field) !== actualNulls.includes(field) && !changed.includes(field)) changed.push(field);
  }
  return changed.sort();
}

export function planTransfer(source, target) {
  assertSnapshot(source);
  assertSnapshot(target);
  const maps = Object.fromEntries(MODELS.map(({ key }) => [key, new Map()]));
  const conflicts = [];
  const planned = [];
  const counts = {};
  const conflict = (spec, sourceId, reason, extra = {}) => conflicts.push({ model: spec.name, sourceId, reason, ...extra });
  const refsExist = (spec, row) => {
    for (const [field, ref] of Object.entries(spec.refs ?? {})) {
      if (row[field] != null && !maps[ref].has(idKey(row[field]))) conflict(spec, row.id, 'missing-source-relation', { field });
    }
    for (const [field, ref] of Object.entries(spec.historicalRefs ?? {})) {
      if (row[field] != null && !maps[ref].has(idKey(row[field])) && target.models[ref].some((item) => sameId(item.id, row[field]))) {
        conflict(spec, row.id, 'historical-reference-collides-with-cloud-record', { field });
      }
    }
  };

  for (const spec of MODELS) {
    const sourceRows = [...source.models[spec.key]].sort((a, b) => typeof a.id === 'number' ? a.id - b.id : String(a.id).localeCompare(String(b.id)));
    const targetRows = target.models[spec.key];
    const reserved = new Set([...sourceRows, ...targetRows].map(({ id }) => idKey(id)));
    const usedTarget = new Set();
    let nextInteger = Math.max(0, ...[...sourceRows, ...targetRows].map(({ id }) => typeof id === 'number' ? id : 0)) + 1;
    counts[spec.key] = { source: sourceRows.length, target: targetRows.length, insert: 0, identical: 0, remapped: 0 };
    const plannedNatural = new Map();
    for (const row of sourceRows) {
      refsExist(spec, row);
      const transformed = transformRow(spec, row, maps);
      const sourceNulls = nullFields(source, spec, row.id);
      const identity = spec.natural ? canonical(spec.natural.map((field) => transformed[field])) : canonical({ row: withoutId(transformed), jsonNulls: sourceNulls });
      let candidates = targetRows.filter((item) => {
        if (usedTarget.has(idKey(item.id))) return false;
        if (spec.natural) return identity === canonical(spec.natural.map((field) => item[field]));
        return identity === canonical({ row: withoutId(item), jsonNulls: nullFields(target, spec, item.id) });
      });
      if (spec.natural && plannedNatural.has(identity)) {
        conflict(spec, row.id, 'ambiguous-source-natural-key', { otherSourceId: plannedNatural.get(identity) });
      }
      if (spec.natural) plannedNatural.set(identity, row.id);
      if (candidates.length > 1) {
        const same = candidates.filter((item) => differenceFields(transformed, item, sourceNulls, nullFields(target, spec, item.id)).length === 0);
        candidates = same.some((item) => sameId(item.id, row.id)) ? same.filter((item) => sameId(item.id, row.id)) : same;
        if (candidates.length !== 1) {
          // Identical append-only events are a multiset, not a unique key.
          if (!spec.natural && candidates.length > 0) candidates = [candidates.sort((a, b) => a.id - b.id)[0]];
          else { conflict(spec, row.id, 'ambiguous-cloud-natural-key', { targetIds: candidates.map(({ id }) => id) }); candidates = []; }
        }
      }
      const match = candidates[0];
      let newId = match?.id ?? row.id;
      if (!match && targetRows.some((item) => sameId(item.id, row.id))) {
        if (spec.stringId) {
          let salt = 0;
          do { newId = `transfer_${fingerprint([spec.key, row.id, salt++]).slice(0, 24)}`; } while (reserved.has(idKey(newId)));
        } else {
          if (nextInteger > 2147483647) { conflict(spec, row.id, 'integer-id-space-exhausted'); continue; }
          newId = nextInteger++;
        }
        reserved.add(idKey(newId));
      }
      maps[spec.key].set(idKey(row.id), newId);
      if (match) usedTarget.add(idKey(match.id));
      counts[spec.key][match ? 'identical' : 'insert']++;
      if (!sameId(row.id, newId)) counts[spec.key].remapped++;
      planned.push({ spec, source: row, target: match, id: newId, jsonNulls: sourceNulls });
    }
  }

  const inserts = Object.fromEntries(MODELS.map(({ key }) => [key, []]));
  for (const item of planned) {
    const { spec, source: row, target: match } = item;
    const data = transformRow(spec, row, maps, (field, reason) => conflict(spec, row.id, reason, { field }));
    data.id = item.id;
    if (match) {
      const fields = differenceFields(data, match, item.jsonNulls, nullFields(target, spec, match.id));
      if (fields.length) conflict(spec, row.id, 'cloud-record-differs', { targetId: match.id, fields });
    } else inserts[spec.key].push({ data, jsonNulls: item.jsonNulls });
  }
  return { counts, conflicts, inserts, maps, sourceFingerprint: fingerprint(source), targetFingerprint: fingerprint(target) };
}

export function publicReport(plan) {
  return { mode: 'dry-run', counts: plan.counts, conflicts: plan.conflicts, sourceFingerprint: plan.sourceFingerprint, targetFingerprint: plan.targetFingerprint };
}

export async function readSnapshot(client, { withinTransaction = false } = {}) {
  const read = async (tx) => {
    const snapshot = emptySnapshot();
    for (const spec of MODELS) snapshot.models[spec.key] = await tx[spec.key].findMany({ orderBy: { id: 'asc' } });
    // Prisma exposes both SQL NULL and JSON null as JS null. Keep the distinction
    // for the one nullable JSON column when backing up and importing.
    const rows = await tx.$queryRawUnsafe('SELECT "id" FROM "admin_audit_logs" WHERE "details" = \'null\'::jsonb');
    snapshot.jsonNulls.adminAuditLog.details = rows.map(({ id }) => id);
    return snapshot;
  };
  if (withinTransaction) return read(client);
  return client.$transaction(async (tx) => {
    await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');
    return read(tx);
  }, { isolationLevel: 'RepeatableRead', timeout: 120000, maxWait: 15000 });
}

export function assertDistinctDatabases(sourceUrl, targetUrl) {
  const identity = (raw) => {
    const url = new URL(raw);
    if (!['postgresql:', 'postgres:'].includes(url.protocol)) throw new Error('Both database URLs must use PostgreSQL.');
    // Neon pooled/unpooled hostnames are the same underlying database.
    return canonical({ host: url.hostname.replace(/-pooler(?=\.)/, ''), port: url.port || '5432', database: url.pathname, schema: url.searchParams.get('schema') || 'public' });
  };
  if (identity(sourceUrl) === identity(targetUrl)) throw new Error('Source and target resolve to the same database.');
  return fingerprint(identity(targetUrl));
}

export async function writeVerifiedBackup(snapshot, { backupPath, targetIdentity, workspace = process.cwd() } = {}) {
  assertSnapshot(snapshot);
  const root = await fs.realpath(workspace);
  const reports = path.join(root, 'reports');
  await fs.mkdir(reports, { recursive: true });
  const actualReports = await fs.realpath(reports);
  if (actualReports !== reports) throw new Error('Backup reports directory must not be a symbolic link.');
  const destination = path.resolve(root, backupPath ?? path.join('reports', `database-target-backup-${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID()}.json`));
  if (path.dirname(destination) !== reports) throw new Error('Target backup must be directly inside the workspace reports/ directory.');
  try { execFileSync('git', ['check-ignore', '--quiet', '--', destination], { cwd: root, stdio: 'ignore' }); }
  catch { throw new Error('Target backup directory is not ignored by Git.'); }
  const envelope = { format: 'portal-database-backup-v1', createdAt: new Date().toISOString(), targetIdentity, fingerprint: fingerprint(snapshot), snapshot };
  await fs.writeFile(destination, JSON.stringify(envelope), { encoding: 'utf8', flag: 'wx', mode: 0o600 });
  const readBack = JSON.parse(await fs.readFile(destination, 'utf8'));
  if (readBack.format !== envelope.format || readBack.targetIdentity !== targetIdentity || readBack.fingerprint !== fingerprint(readBack.snapshot) || readBack.fingerprint !== envelope.fingerprint) {
    throw new Error('Local target backup verification failed. No database writes have been performed.');
  }
  return { verified: true, fingerprint: readBack.fingerprint, path: destination };
}

function prismaData(spec, entry, prisma) {
  const data = clone(entry.data);
  for (const field of spec.json ?? []) {
    if (data[field] === null) data[field] = (spec.nullableJson ?? []).includes(field) && !entry.jsonNulls.includes(field) ? prisma.DbNull : prisma.JsonNull;
  }
  return data;
}

export async function transferDatabase({ sourceClient, targetClient, apply = false, backupWriter, prisma = {}, sourceSnapshot, targetSnapshot }) {
  const source = sourceSnapshot ?? await readSnapshot(sourceClient);
  const target = targetSnapshot ?? await readSnapshot(targetClient);
  const plan = planTransfer(source, target);
  const report = publicReport(plan);
  if (plan.conflicts.length || !apply) return report;
  if (typeof backupWriter !== 'function') throw new Error('Apply requires a verified local target backup.');
  const backup = await backupWriter(target);
  if (!backup?.verified || backup.fingerprint !== plan.targetFingerprint) throw new Error('Verified target backup does not match the transfer plan.');
  await targetClient.$transaction(async (tx) => {
    // Block concurrent signups/content writes for the brief import, then re-read
    // everything. Any change since backup/planning aborts without inserting.
    await tx.$executeRawUnsafe(`LOCK TABLE ${MODELS.map(({ table }) => `"${table}"`).join(', ')} IN SHARE ROW EXCLUSIVE MODE`);
    const current = await readSnapshot(tx, { withinTransaction: true });
    if (fingerprint(current) !== plan.targetFingerprint) throw new Error('Cloud data changed after the backup. Run a fresh dry-run and apply again.');
    for (const spec of MODELS) {
      const entries = plan.inserts[spec.key];
      for (let offset = 0; offset < entries.length; offset += 100) {
        await tx[spec.key].createMany({ data: entries.slice(offset, offset + 100).map((entry) => prismaData(spec, entry, prisma)) });
      }
    }
    // Verify all imported fields, including hashes, timestamps, JSON and the
    // cloud-only records, before commit. Reports contain counts/IDs only.
    const after = await readSnapshot(tx, { withinTransaction: true });
    for (const spec of MODELS) {
      const expected = [...target.models[spec.key], ...plan.inserts[spec.key].map(({ data }) => data)].sort((a, b) => typeof a.id === 'number' ? a.id - b.id : String(a.id).localeCompare(String(b.id)));
      const actual = [...after.models[spec.key]].sort((a, b) => typeof a.id === 'number' ? a.id - b.id : String(a.id).localeCompare(String(b.id)));
      if (canonical(expected) !== canonical(actual)) throw new Error(`Verification failed for ${spec.name}; transaction rolled back.`);
      const expectedJsonNulls = [...(target.jsonNulls?.[spec.key]?.details ?? []), ...plan.inserts[spec.key].filter(({ jsonNulls }) => jsonNulls.includes('details')).map(({ data }) => data.id)].map(String).sort();
      const actualJsonNulls = (after.jsonNulls?.[spec.key]?.details ?? []).map(String).sort();
      if (canonical(expectedJsonNulls) !== canonical(actualJsonNulls)) throw new Error(`JSON null verification failed for ${spec.name}; transaction rolled back.`);
    }
    for (const spec of MODELS.filter((item) => !item.stringId && plan.inserts[item.key].length)) {
      // Never lower a sequence which has previously handed out higher IDs.
      await tx.$queryRawUnsafe(`SELECT setval(pg_get_serial_sequence('"${spec.table}"', 'id'), GREATEST(COALESCE((SELECT MAX("id") FROM "${spec.table}"), 1), COALESCE((SELECT last_value FROM pg_sequences WHERE format('%I.%I', schemaname, sequencename)::regclass = pg_get_serial_sequence('"${spec.table}"', 'id')::regclass), 1)), true)`);
    }
  }, { isolationLevel: 'Serializable', timeout: 120000, maxWait: 15000 });
  return { ...report, mode: 'applied', backupPath: backup.path };
}

export function validateSchema(prisma) {
  const models = prisma.dmmf?.datamodel?.models ?? [];
  if (models.length !== MODELS.length || MODELS.some((spec) => !models.some((model) => model.name === spec.name && model.dbName === spec.table))) throw new Error('Prisma schema changed; review the transfer model coverage before using this tool.');
  const knownRefs = new Set(MODELS.flatMap((spec) => Object.keys(spec.refs ?? {}).map((field) => `${spec.name}.${field}`)));
  for (const model of models) {
    for (const field of model.fields) {
      if (field.kind === 'object') for (const scalar of field.relationFromFields ?? []) {
        if (!knownRefs.has(`${model.name}.${scalar}`)) throw new Error(`Uncovered relation ${model.name}.${scalar}.`);
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Set SOURCE_DATABASE_URL and TARGET_DATABASE_URL in the process environment. Run without flags to dry-run; add --apply to import. Optional --backup reports/FILE.json. No .env is loaded.');
    return;
  }
  let apply = false;
  let backupPath;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--apply') apply = true;
    else if (args[i] === '--backup' && args[i + 1]) backupPath = args[++i];
    else throw new Error('Unknown arguments. Use --help.');
  }
  const sourceUrl = process.env.SOURCE_DATABASE_URL;
  const targetUrl = process.env.TARGET_DATABASE_URL;
  if (!sourceUrl || !targetUrl) throw new Error('Set both SOURCE_DATABASE_URL and TARGET_DATABASE_URL.');
  const targetIdentity = assertDistinctDatabases(sourceUrl, targetUrl);
  const { PrismaClient, Prisma } = await import('@prisma/client');
  validateSchema(Prisma);
  const sourceClient = new PrismaClient({ datasources: { db: { url: sourceUrl } } });
  const targetClient = new PrismaClient({ datasources: { db: { url: targetUrl } } });
  try {
    const report = await transferDatabase({ sourceClient, targetClient, apply, prisma: Prisma, backupWriter: (snapshot) => writeVerifiedBackup(snapshot, { backupPath, targetIdentity }) });
    console.log(JSON.stringify(report, null, 2));
    if (report.conflicts.length) process.exitCode = 2;
  } finally { await Promise.allSettled([sourceClient.$disconnect(), targetClient.$disconnect()]); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    // Prisma/network errors may embed complete credentials, SQL or user data.
    // Emit only our deliberately safe errors or a diagnostic code.
    const safe = error instanceof Error && !error.name.startsWith('Prisma') && !/postgres(?:ql)?:\/\/|password|token|email|connect|authentication/i.test(error.message);
    console.error(safe ? error.message : `Database transfer failed (${typeof error?.code === 'string' && /^[A-Z0-9_]+$/.test(error.code) ? error.code : 'redacted'}). No credentials or record values are printed.`);
    process.exitCode = 1;
  });
}
