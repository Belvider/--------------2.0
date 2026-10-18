const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const load = () => import('../scripts/transfer-database.mjs');
const at = new Date('2026-01-02T03:04:05.000Z');
const user = (id = 'local-admin', email = 'local-admin@example.invalid') => ({
  id, name: 'Fixture Admin', firstName: 'Fixture', lastName: 'Admin', middleName: null,
  email, phone: null, birthday: null, avatarUrl: '/uploads/fixture.png', passwordHash: 'fixture-hash-only',
  role: 'ADMIN', position: 'Administrator', department: 'Fixture', store: null, city: null,
  hireDate: at, notes: null, isActive: true, createdAt: at, updatedAt: at
});

async function fixture() {
  const { emptySnapshot } = await load();
  const snapshot = emptySnapshot();
  const m = snapshot.models;
  m.user.push(user());
  m.brand.push({ id: 1, name: 'Fixture Brand', slug: 'fixture', logoUrl: '/uploads/logo.png', description: 'Brand', sortOrder: 3, createdAt: at, updatedAt: at });
  m.badge.push({ id: 1, code: 'fixture', name: 'Badge', description: 'Badge', icon: 'star', createdAt: at });
  m.category.push({ id: 1, brandId: 1, name: 'Category', slug: 'fixture', description: 'Category', sortOrder: 2, createdAt: at, updatedAt: at });
  m.module.push({ id: 1, categoryId: 1, title: 'Fixture Module', description: 'Lesson', contentBlocks: [{ type: 'text', html: '<a href="/module/1#test">Lesson</a>' }], durationMin: 25, sortOrder: 1, isPublished: true, createdAt: at, updatedAt: at });
  m.quizQuestion.push({ id: 1, moduleId: 1, question: 'Fixture Question', type: 'SINGLE', options: ['A', 'B'], correctAnswer: { index: 1 }, sortOrder: 1, createdAt: at, updatedAt: at });
  m.userProgress.push({ id: 1, userId: 'local-admin', moduleId: 1, status: 'COMPLETED', progressPct: 100, completedAt: at, lastSeenAt: at });
  m.learningActivity.push({ id: 1, userId: 'local-admin', moduleId: 1, day: '2026-01-02', viewedAt: at });
  m.quizAttempt.push({ id: 1, userId: 'local-admin', moduleId: 1, score: 100, passed: true, answers: [{ questionId: 1, answer: 1 }], attemptedAt: at });
  m.certificate.push({ id: 1, userId: 'local-admin', moduleId: 1, issuedAt: at, pdfUrl: '/uploads/certificate.pdf' });
  m.userBadge.push({ id: 1, userId: 'local-admin', badgeId: 1, issuedAt: at });
  m.passwordResetToken.push({ id: 'local-reset', userId: 'local-admin', token: 'fixture-not-a-real-token', expiresAt: at, usedAt: null, createdAt: at });
  m.loginAttempt.push({ id: 1, email: 'local-admin@example.invalid', ipAddress: null, successful: true, attemptedAt: at });
  m.learningAssignment.push({ id: 1, moduleId: 1, assignedById: 'local-admin', targetType: 'USER', userId: 'local-admin', department: null, dueAt: at, required: true, note: null, isActive: true, createdAt: at, updatedAt: at });
  m.adminAuditLog.push({ id: 1, actorId: 'local-admin', action: 'assignment.create', targetType: 'assignment', targetId: '1', targetLabel: 'Fixture', summary: 'Fixture', details: { id: 1, moduleId: 1, userId: 'local-admin' }, ipAddress: null, createdAt: at });
  m.appSetting.push({ id: 1, key: 'fixture', value: { moduleIds: [1], questionId: 1, enabled: false, nested: null }, updatedAt: at });
  return snapshot;
}

function mockClient(initial, models) {
  const state = { snapshot: structuredClone(initial), events: [], transactions: [], beforeTransaction: null, failTable: null };
  const tx = {};
  const JsonNull = Symbol('JsonNull');
  const DbNull = Symbol('DbNull');
  for (const spec of models) {
    tx[spec.key] = {
      findMany: async () => structuredClone(state.snapshot.models[spec.key]),
      createMany: async ({ data }) => {
        state.events.push(`insert:${spec.key}`);
        if (state.failTable === spec.key) throw new Error('fixture insertion failure');
        for (const input of data) {
          const row = { ...input };
          for (const field of spec.json ?? []) {
            if (row[field] === JsonNull) {
              row[field] = null;
              if ((spec.nullableJson ?? []).includes(field)) state.snapshot.jsonNulls[spec.key][field].push(row.id);
            } else if (row[field] === DbNull) row[field] = null;
          }
          assert.ok(!state.snapshot.models[spec.key].some((item) => item.id === row.id), 'duplicate ID');
          state.snapshot.models[spec.key].push(structuredClone(row));
          state.snapshot.models[spec.key].sort((a, b) => typeof a.id === 'number' ? a.id - b.id : String(a.id).localeCompare(String(b.id)));
        }
      }
    };
  }
  tx.$executeRawUnsafe = async (sql) => { state.events.push(sql.startsWith('LOCK') ? 'lock' : sql); return 0; };
  tx.$queryRawUnsafe = async (sql) => {
    if (sql.startsWith('SELECT setval')) { state.events.push('sequence'); return []; }
    if (sql.includes('FROM "admin_audit_logs"')) return state.snapshot.jsonNulls.adminAuditLog.details.map((id) => ({ id }));
    throw new Error('unexpected query');
  };
  const client = {
    ...tx,
    $transaction: async (fn, options) => {
      await state.beforeTransaction?.();
      state.transactions.push(options);
      state.events.push('transaction');
      const before = structuredClone(state.snapshot);
      try { const result = await fn(tx); state.events.push('commit'); return result; }
      catch (error) { state.snapshot = before; state.events.push('rollback'); throw error; }
    }
  };
  return { client, state, prisma: { JsonNull, DbNull } };
}

test('dry-run covers every schema model, preserves hashes/roles/scalars, and does no target writes', async () => {
  const { MODELS, planTransfer, publicReport, transferDatabase, canonical, emptySnapshot } = await load();
  const source = await fixture();
  const target = emptySnapshot();
  const cloud = { ...user('cloud-only', 'cloud-only@example.invalid'), role: 'SELLER' };
  target.models.user.push(cloud);
  const mock = mockClient(target, MODELS);
  const report = await transferDatabase({ sourceSnapshot: source, targetSnapshot: target, targetClient: mock.client });
  assert.equal(MODELS.length, 16);
  assert.equal(Object.keys(report.counts).length, 16);
  assert.deepEqual(report.conflicts, []);
  assert.ok(Object.values(report.counts).every(({ insert }) => insert === 1));
  assert.deepEqual(mock.state.events, []);
  const plan = planTransfer(source, target);
  assert.equal(canonical(plan.inserts.user[0].data), canonical(source.models.user[0]));
  assert.equal(plan.inserts.user[0].data.passwordHash, 'fixture-hash-only');
  assert.equal(plan.inserts.user[0].data.role, 'ADMIN');
  assert.ok(!JSON.stringify(publicReport(plan)).includes('fixture-hash-only'));
  assert.ok(!JSON.stringify(publicReport(plan)).includes('@example.invalid'));
  assert.deepEqual(mock.state.snapshot.models.user, [cloud]);
});

test('apply backs up first, imports all models atomically, retains cloud-only records and repeats safely', async () => {
  const { MODELS, transferDatabase, fingerprint, emptySnapshot, planTransfer, canonical } = await load();
  const source = await fixture();
  const target = emptySnapshot();
  target.models.user.push({ ...user('cloud-only', 'cloud-only@example.invalid'), role: 'SELLER' });
  // Unrelated online event with the same integer ID must remain unchanged.
  target.models.loginAttempt.push({ ...source.models.loginAttempt[0], email: 'cloud-only@example.invalid' });
  const mock = mockClient(target, MODELS);
  const report = await transferDatabase({ sourceSnapshot: source, targetSnapshot: target, targetClient: mock.client, apply: true, prisma: mock.prisma, backupWriter: async (snapshot) => {
    mock.state.events.push('backup-verified');
    return { verified: true, fingerprint: fingerprint(snapshot), path: 'reports/fixture.json' };
  } });
  assert.equal(report.mode, 'applied');
  assert.deepEqual(mock.state.events.slice(0, 3), ['backup-verified', 'transaction', 'lock']);
  assert.equal(mock.state.events.at(-1), 'commit');
  assert.equal(mock.state.transactions.length, 1);
  assert.equal(mock.state.transactions[0].isolationLevel, 'Serializable');
  assert.equal(mock.state.snapshot.models.user.length, 2);
  assert.ok(mock.state.snapshot.models.user.some(({ id, role }) => id === 'cloud-only' && role === 'SELLER'));
  assert.equal(canonical(mock.state.snapshot.models.loginAttempt[0]), canonical(target.models.loginAttempt[0]));
  assert.equal(mock.state.snapshot.models.loginAttempt[1].id, 2);
  assert.equal(mock.state.events.filter((event) => event === 'sequence').length, 14);
  const repeated = planTransfer(source, mock.state.snapshot);
  assert.deepEqual(repeated.conflicts, []);
  assert.ok(Object.values(repeated.counts).every(({ insert }) => insert === 0));
  assert.ok(Object.values(repeated.counts).every(({ identical }) => identical === 1));
});

test('ID collisions remap relations, quiz answer references, audit targets and relative content links', async () => {
  const { planTransfer, emptySnapshot } = await load();
  const source = await fixture();
  const target = emptySnapshot();
  target.models.user.push({ ...user('local-admin', 'different-cloud-user@example.invalid'), role: 'SELLER' });
  target.models.brand.push({ ...source.models.brand[0], slug: 'cloud', name: 'Cloud' });
  target.models.category.push({ ...source.models.category[0], slug: 'cloud' });
  target.models.module.push({ ...source.models.module[0], title: 'Cloud' });
  target.models.quizQuestion.push({ ...source.models.quizQuestion[0], question: 'Cloud' });
  target.models.learningAssignment.push({ ...source.models.learningAssignment[0], note: 'Cloud' });
  const plan = planTransfer(source, target);
  assert.deepEqual(plan.conflicts, []);
  const newUserId = plan.inserts.user[0].data.id;
  assert.match(newUserId, /^transfer_[a-f0-9]{24}$/);
  assert.equal(plan.inserts.category[0].data.brandId, 2);
  assert.equal(plan.inserts.module[0].data.categoryId, 2);
  assert.match(plan.inserts.module[0].data.contentBlocks[0].html, /href="\/module\/2#test"/);
  assert.equal(plan.inserts.quizQuestion[0].data.moduleId, 2);
  assert.equal(plan.inserts.userProgress[0].data.userId, newUserId);
  assert.equal(plan.inserts.learningActivity[0].data.moduleId, 2);
  assert.equal(plan.inserts.quizAttempt[0].data.answers[0].questionId, 2);
  assert.equal(plan.inserts.quizAttempt[0].data.answers[0].answer, 1);
  assert.equal(plan.inserts.passwordResetToken[0].data.userId, newUserId);
  assert.equal(plan.inserts.learningAssignment[0].data.assignedById, newUserId);
  assert.equal(plan.inserts.adminAuditLog[0].data.actorId, newUserId);
  assert.equal(plan.inserts.adminAuditLog[0].data.targetId, '2');
  assert.equal(plan.inserts.adminAuditLog[0].data.details.id, 2);
  assert.equal(plan.inserts.adminAuditLog[0].data.details.moduleId, 2);
  assert.deepEqual(plan.inserts.appSetting[0].data.value.moduleIds, [2]);
  assert.equal(plan.inserts.appSetting[0].data.value.questionId, 2);
  const again = planTransfer(source, target);
  assert.equal(again.inserts.user[0].data.id, newUserId, 'string remapping is deterministic');
});

test('same natural key with changed cloud user or progress is a conflict, never an overwrite', async () => {
  const { MODELS, emptySnapshot, planTransfer, transferDatabase } = await load();
  const source = await fixture();
  const target = structuredClone(source);
  target.models.user[0].passwordHash = 'cloud-password-hash';
  target.models.user[0].role = 'SELLER';
  target.models.userProgress[0].progressPct = 75;
  const plan = planTransfer(source, target);
  assert.deepEqual(plan.conflicts.find(({ model }) => model === 'User').fields, ['passwordHash', 'role']);
  assert.equal(plan.conflicts.find(({ model }) => model === 'UserProgress').reason, 'cloud-record-differs');
  const mock = mockClient(target, MODELS);
  const report = await transferDatabase({ sourceSnapshot: source, targetSnapshot: target, targetClient: mock.client, apply: true, backupWriter: () => assert.fail('must not back up or write an unresolved plan') });
  assert.ok(report.conflicts.length);
  assert.deepEqual(mock.state.events, []);
  assert.ok(!JSON.stringify(report).includes('cloud-password-hash'));
  const timestamps = emptySnapshot();
  timestamps.models.user.push({ ...source.models.user[0], updatedAt: new Date('2026-02-01') });
  assert.deepEqual(planTransfer(source, timestamps).conflicts.find(({ model }) => model === 'User').fields, ['updatedAt']);
});

test('refuses apply without a verified matching backup and aborts on a concurrent cloud signup', async () => {
  const { MODELS, transferDatabase, emptySnapshot, fingerprint } = await load();
  const source = await fixture();
  const target = emptySnapshot();
  const mock = mockClient(target, MODELS);
  const args = { sourceSnapshot: source, targetSnapshot: target, targetClient: mock.client, apply: true, prisma: mock.prisma };
  await assert.rejects(transferDatabase(args), /verified local target backup/);
  await assert.rejects(transferDatabase({ ...args, backupWriter: async () => ({ verified: true, fingerprint: 'wrong' }) }), /does not match/);
  assert.deepEqual(mock.state.events, []);
  mock.state.beforeTransaction = async () => { mock.state.snapshot.models.user.push(user('new-cloud', 'new-cloud@example.invalid')); };
  await assert.rejects(transferDatabase({ ...args, backupWriter: async () => ({ verified: true, fingerprint: fingerprint(target) }) }), /Cloud data changed/);
  assert.ok(!mock.state.events.some((event) => event.startsWith('insert:')));
  assert.equal(mock.state.events.at(-1), 'rollback');
  assert.equal(mock.state.snapshot.models.user.length, 1, 'concurrent cloud signup remains');
});

test('an insertion failure rolls back prior model inserts', async () => {
  const { MODELS, transferDatabase, emptySnapshot, fingerprint } = await load();
  const source = await fixture();
  const target = emptySnapshot();
  const mock = mockClient(target, MODELS);
  mock.state.failTable = 'module';
  await assert.rejects(transferDatabase({ sourceSnapshot: source, targetSnapshot: target, targetClient: mock.client, apply: true, prisma: mock.prisma, backupWriter: async () => ({ verified: true, fingerprint: fingerprint(target) }) }), /fixture insertion failure/);
  assert.equal(mock.state.events.at(-1), 'rollback');
  assert.deepEqual(mock.state.snapshot, target);
});

test('preserves SQL NULL versus JSON null and reads the source using a read-only snapshot', async () => {
  const { MODELS, transferDatabase, emptySnapshot, fingerprint, readSnapshot, canonical } = await load();
  const source = await fixture();
  source.models.adminAuditLog[0].details = null;
  source.models.adminAuditLog.push({ ...source.models.adminAuditLog[0], id: 2, action: 'fixture.sql-null' });
  source.jsonNulls.adminAuditLog.details = [1];
  const sourceMock = mockClient(source, MODELS);
  assert.equal(canonical(await readSnapshot(sourceMock.client)), canonical(source));
  assert.ok(sourceMock.state.events.includes('SET TRANSACTION READ ONLY'));
  assert.ok(!sourceMock.state.events.some((event) => event.startsWith('insert:')));
  const target = emptySnapshot();
  const mock = mockClient(target, MODELS);
  const report = await transferDatabase({ sourceSnapshot: source, targetSnapshot: target, targetClient: mock.client, apply: true, prisma: mock.prisma, backupWriter: async () => ({ verified: true, fingerprint: fingerprint(target) }) });
  assert.equal(report.mode, 'applied');
  assert.deepEqual(mock.state.snapshot.jsonNulls.adminAuditLog.details, [1]);
});

test('ambiguous source keys, missing relations and unknown remapped JSON links abort conservatively', async () => {
  const { planTransfer, emptySnapshot } = await load();
  const source = await fixture();
  const target = emptySnapshot();
  source.models.module.push({ ...source.models.module[0], id: 2 });
  assert.ok(planTransfer(source, target).conflicts.some(({ reason }) => reason === 'ambiguous-source-natural-key'));
  source.models.module.pop();
  source.models.userProgress[0].userId = 'missing';
  assert.ok(planTransfer(source, target).conflicts.some(({ reason }) => reason === 'missing-source-relation'));
  source.models.userProgress[0].userId = 'local-admin';
  target.models.module.push({ ...source.models.module[0], title: 'Different cloud lesson' });
  source.models.module[0].contentBlocks = [{ href: 'https://unknown.example.invalid/module/1', module_id: 1 }];
  const reasons = planTransfer(source, target).conflicts.map(({ reason }) => reason);
  assert.ok(reasons.includes('absolute-module-link'));
  assert.ok(reasons.includes('unrecognized-json-reference'));
});

test('keeps duplicate identical event rows as a multiset across repeated imports', async () => {
  const { planTransfer, emptySnapshot } = await load();
  const source = await fixture();
  source.models.loginAttempt.push({ ...source.models.loginAttempt[0], id: 2 });
  const target = emptySnapshot();
  target.models.loginAttempt.push({ ...source.models.loginAttempt[0], id: 15 });
  const plan = planTransfer(source, target);
  assert.deepEqual(plan.conflicts, []);
  assert.equal(plan.counts.loginAttempt.identical, 1);
  assert.equal(plan.counts.loginAttempt.insert, 1);
  for (const [key, entries] of Object.entries(plan.inserts)) target.models[key].push(...entries.map(({ data }) => data));
  assert.equal(planTransfer(source, target).counts.loginAttempt.insert, 0);
});

test('refuses same-database aliases and schema drift; writes verified backup only under ignored reports/', async () => {
  const { assertDistinctDatabases, validateSchema, MODELS, writeVerifiedBackup, fingerprint } = await load();
  assert.throws(() => assertDistinctDatabases('postgresql://one:a@ep-test.neon.tech/db', 'postgresql://other:b@ep-test-pooler.neon.tech/db'), /same database/);
  assert.equal(typeof assertDistinctDatabases('postgresql://localhost/source', 'postgresql://cloud/target'), 'string');
  const { Prisma } = require('@prisma/client');
  validateSchema(Prisma);
  assert.throws(() => validateSchema({ dmmf: { datamodel: { models: [] } } }), /schema changed/);
  assert.equal(Prisma.dmmf.datamodel.models.length, MODELS.length);
  const snapshot = await fixture();
  const backupPath = path.join('reports', `transfer-test-${randomUUID()}.json`);
  let result;
  try {
    result = await writeVerifiedBackup(snapshot, { backupPath, targetIdentity: 'fixture-only' });
    assert.equal(result.verified, true);
    const saved = JSON.parse(await fs.readFile(result.path, 'utf8'));
    assert.equal(saved.fingerprint, fingerprint(snapshot));
    assert.equal(saved.snapshot.models.user[0].passwordHash, 'fixture-hash-only');
    await assert.rejects(writeVerifiedBackup(snapshot, { backupPath: 'unsafe-backup.json', targetIdentity: 'fixture-only' }), /reports/);
    await assert.rejects(writeVerifiedBackup(snapshot, { backupPath, targetIdentity: 'fixture-only' }), { code: 'EEXIST' });
  } finally { if (result) await fs.unlink(result.path); }
});
