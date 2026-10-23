const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Load the real query and date helpers without connecting to a database.
function loadDashboardQuery(prisma) {
  const cache = new Map();
  function load(relative) {
    const filename = path.resolve(__dirname, '..', relative);
    if (cache.has(filename)) return cache.get(filename).exports;
    const loaded = new Module(filename, module);
    loaded.filename = filename;
    loaded.paths = Module._nodeModulePaths(path.dirname(filename));
    cache.set(filename, loaded);
    const installed = Module.createRequire(filename);
    loaded.require = request => {
      if (request === '@/lib/prisma') return { prisma };
      if (request === '@/lib/portal-pages') return {};
      if (request.startsWith('@/')) return load(request.slice(2) + '.ts');
      return installed(request);
    };
    loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    }).outputText, filename);
    return loaded.exports;
  }
  return load('lib/queries.ts').getDashboardData;
}

function fixture({ currentPct = 25, activities = [] } = {}) {
  const calls = [];
  const modules = [1, 2, 3, 4].map(id => ({
    id, title: `Module ${id}`, isPublished: id !== 4, durationMin: id === 4 ? 200 : 20,
    _count: { questions: id === 2 ? 3 : 0 },
    category: { name: 'Category', brand: { id: 1, name: 'Brand', slug: 'brand' } }
  }));
  const progress = [
    { userId: 'learner', moduleId: 1, module: modules[0], status: 'COMPLETED', progressPct: 100, completedAt: new Date('2026-10-20T10:00:00Z'), lastSeenAt: new Date('2026-10-20T10:00:00Z') },
    { userId: 'learner', moduleId: 2, module: modules[1], status: 'IN_PROGRESS', progressPct: currentPct, completedAt: null, lastSeenAt: new Date('2026-10-25T22:00:00Z') },
    { userId: 'learner', moduleId: 3, module: modules[2], status: 'IN_PROGRESS', progressPct: 80, completedAt: null, lastSeenAt: new Date('2026-10-24T12:00:00Z') },
    { userId: 'learner', moduleId: 4, module: modules[3], status: 'COMPLETED', progressPct: 100, completedAt: new Date('2026-10-25T10:00:00Z'), lastSeenAt: new Date('2026-10-25T10:00:00Z') },
    { userId: 'draft-only', moduleId: 4, module: modules[3], status: 'COMPLETED', progressPct: 100, completedAt: new Date('2026-10-25T10:00:00Z'), lastSeenAt: new Date('2026-10-25T10:00:00Z') }
  ];
  const attempts = [
    { userId: 'learner', moduleId: 1, score: 0 },
    { userId: 'learner', moduleId: 1, score: 80 },
    { userId: 'learner', moduleId: 2, score: 0 },
    { userId: 'learner', moduleId: 4, score: 100 },
    { userId: 'draft-only', moduleId: 4, score: 100 }
  ].map(row => ({ ...row, module: modules.find(item => item.id === row.moduleId) }));
  function filtered(rows, where = {}) {
    return rows.filter(row =>
      (!where.userId || (typeof where.userId === 'string' ? row.userId === where.userId : where.userId.in.includes(row.userId))) &&
      (!where.status || row.status === where.status) &&
      (!where.module?.isPublished || row.module.isPublished)
    );
  }
  const prisma = {
    module: {
      count: async () => modules.filter(row => row.isPublished).length,
      aggregate: async () => ({ _sum: { durationMin: 60 } }),
      findMany: async () => modules.filter(row => row.isPublished)
    },
    userProgress: {
      count: async query => filtered(progress, query.where).length,
      findMany: async query => filtered(progress, query.where),
      findFirst: async query => {
        calls.push({ name: 'currentProgress', query });
        return filtered(progress, query.where).sort((left, right) => {
          for (const order of query.orderBy) {
            const [key, direction] = Object.entries(order)[0];
            const difference = Number(left[key]) - Number(right[key]);
            if (difference) return direction === 'desc' ? -difference : difference;
          }
          return 0;
        })[0] ?? null;
      },
      groupBy: async query => {
        const counts = new Map();
        filtered(progress, query.where).forEach(row => counts.set(row.userId, (counts.get(row.userId) ?? 0) + 1));
        return [...counts].map(([userId, count]) => ({ userId, _count: { _all: count } }));
      }
    },
    quizAttempt: { findMany: async query => filtered(attempts, query.where) },
    userBadge: { findMany: async () => [] },
    certificate: { count: async () => 0 },
    user: {
      findUnique: async () => ({ department: '' }),
      findMany: async query => query.where.id.in.map(id => ({ id, name: id, department: '' }))
    },
    learningAssignment: { findMany: async () => [] },
    learningActivity: {
      groupBy: async query => {
        calls.push({ name: 'activity', query });
        return activities.filter(row => row.day >= query.where.day.gte && row.day <= query.where.day.lte);
      }
    }
  };
  return { getDashboardData: loadDashboardQuery(prisma), calls };
}

test('home metrics, quiz averages and leaderboard exclude unpublished modules', async t => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-25T22:30:00Z') });
  const { getDashboardData } = fixture();
  const data = await getDashboardData('learner');
  assert.equal(data.totalModules, 3);
  assert.equal(data.completedModules, 1);
  assert.equal(data.inProgressModules, 2);
  assert.equal(data.progressPct, 33);
  assert.equal(data.learnedMinutes, 41);
  assert.equal(data.remainingMinutes, 19);
  assert.equal(data.completedLast7Days, 1);
  assert.equal(data.averageQuizScore, 40); // best of 0/80 plus the other module's zero
  assert.equal(data.quizAttemptsCount, 3);
  assert.deepEqual(data.leaderboard.map(row => [row.userId, row.completed, row.avgScore]), [['learner', 1, 40]]);
});

test('continue action uses the most recently studied published module and retains quiz readiness', async t => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-25T22:30:00Z') });
  const recent = fixture();
  const data = await recent.getDashboardData('learner');
  assert.equal(data.continueModule.id, 2);
  assert.equal(data.continueModuleProgress, 25); // older module has 80%
  const { getDashboardData, calls } = fixture({ currentPct: 100 });
  const quizReady = await getDashboardData('learner');
  assert.equal(quizReady.continueModule.id, 2);
  assert.equal(quizReady.continueModuleProgress, 100);
  assert.equal(quizReady.continueModuleRemainingMin, 0);
  assert.equal(quizReady.continueModule._count.questions, 3);
  assert.deepEqual(calls.find(call => call.name === 'currentProgress').query.include.module.include._count, { select: { questions: true } });
});

test('activity uses Kyiv calendar days across DST, fills empty days and shares one 14-day query', async t => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-25T22:30:00Z') });
  const { getDashboardData, calls } = fixture({ activities: [
    { day: '2026-10-12', _count: { _all: 5 } },
    { day: '2026-10-13', _count: { _all: 1 } },
    { day: '2026-10-20', _count: { _all: 2 } },
    { day: '2026-10-25', _count: { _all: 1 } },
    { day: '2026-10-26', _count: { _all: 3 } },
    { day: '2026-10-27', _count: { _all: 4 } }
  ] });
  const data = await getDashboardData('learner');
  assert.equal(data.activeDaysLast14, 4);
  assert.deepEqual(data.weeklyActivity, [
    { day: '2026-10-20', modulesCount: 2, isToday: false },
    { day: '2026-10-21', modulesCount: 0, isToday: false },
    { day: '2026-10-22', modulesCount: 0, isToday: false },
    { day: '2026-10-23', modulesCount: 0, isToday: false },
    { day: '2026-10-24', modulesCount: 0, isToday: false },
    { day: '2026-10-25', modulesCount: 1, isToday: false },
    { day: '2026-10-26', modulesCount: 3, isToday: true }
  ]);
  const activityCalls = calls.filter(call => call.name === 'activity');
  assert.equal(activityCalls.length, 1);
  assert.deepEqual(activityCalls[0].query.where, { userId: 'learner', day: { gte: '2026-10-13', lte: '2026-10-26' } });
});

test('no recorded activity yields a complete seven-day empty state', async t => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-25T22:30:00Z') });
  const { getDashboardData } = fixture();
  const data = await getDashboardData('learner');
  assert.equal(data.activeDaysLast14, 0);
  assert.equal(data.weeklyActivity.length, 7);
  assert.equal(data.weeklyActivity.every(day => day.modulesCount === 0), true);
  assert.equal(data.weeklyActivity.filter(day => day.isToday).length, 1);
});
