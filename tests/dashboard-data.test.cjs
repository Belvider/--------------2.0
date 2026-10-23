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

function fixture({ currentPct = 25, activities = [], users = [
  { id: 'learner', name: 'Learner', department: '' },
  { id: 'draft-only', name: 'Draft learner', department: '' },
  { id: 'newcomer', name: 'New learner', department: '' }
], additionalProgress = [], additionalAttempts = [] } = {}) {
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
    { userId: 'draft-only', moduleId: 4, module: modules[3], status: 'COMPLETED', progressPct: 100, completedAt: new Date('2026-10-25T10:00:00Z'), lastSeenAt: new Date('2026-10-25T10:00:00Z') },
    ...additionalProgress.map(row => ({ status: 'COMPLETED', progressPct: 100, ...row, module: modules.find(item => item.id === row.moduleId) }))
  ];
  const attempts = [
    { userId: 'learner', moduleId: 1, score: 0 },
    { userId: 'learner', moduleId: 1, score: 80 },
    { userId: 'learner', moduleId: 2, score: 0 },
    { userId: 'learner', moduleId: 4, score: 100 },
    { userId: 'draft-only', moduleId: 4, score: 100 },
    ...additionalAttempts
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
        calls.push({ name: 'leaderboardProgress', query });
        const counts = new Map();
        filtered(progress, query.where).forEach(row => counts.set(row.userId, (counts.get(row.userId) ?? 0) + 1));
        return [...counts].map(([userId, count]) => ({ userId, _count: { _all: count } }));
      }
    },
    quizAttempt: {
      findMany: async query => filtered(attempts, query.where),
      groupBy: async query => {
        calls.push({ name: 'leaderboardScores', query });
        const best = new Map();
        for (const row of filtered(attempts, query.where)) {
          const key = `${row.userId}:${row.moduleId}`;
          const previous = best.get(key)?._max.score ?? Number.NEGATIVE_INFINITY;
          best.set(key, { userId: row.userId, moduleId: row.moduleId, _max: { score: Math.max(previous, row.score) } });
        }
        return [...best.values()];
      }
    },
    userBadge: { findMany: async () => [] },
    certificate: { count: async () => 0 },
    user: {
      findUnique: async () => ({ department: '' }),
      findMany: async query => {
        calls.push({ name: 'leaderboardUsers', query });
        return users.filter(row => !query.where?.id?.in || query.where.id.in.includes(row.id));
      }
    },
    learningAssignment: { findMany: async () => [] },
    learningActivity: {
      groupBy: async query => {
        calls.push({ name: 'activity', query });
        return activities.filter(row => row.day >= query.where.day.gte && row.day <= query.where.day.lte);
      }
    }
  };
  return { getDashboardData: loadDashboardQuery(prisma), calls, users };
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
  assert.deepEqual(data.leaderboard.map(row => [row.userId, row.completed, row.avgScore]), [
    ['learner', 1, 40], ['draft-only', 0, null], ['newcomer', 0, null]
  ]);
});

test('leaderboard includes all registered users beyond ten completers and picks up future registrations', async () => {
  const users = Array.from({ length: 14 }, (_, index) => ({
    id: `user-${index}`, name: `Учасник ${String(index).padStart(2, '0')}`, department: '',
    role: ['SELLER', 'MANAGER', 'ADMIN'][index % 3], isActive: index !== 13
  }));
  const { getDashboardData, calls, users: registered } = fixture({ users,
    additionalProgress: users.slice(0, 12).map(row => ({ userId: row.id, moduleId: 1 }))
  });
  const first = await getDashboardData('learner');
  assert.equal(first.leaderboard.length, 14);
  assert.equal(first.leaderboard.filter(row => row.completed === 1).length, 12);
  assert.equal(first.leaderboard.filter(row => row.completed === 0).length, 2);
  assert.equal(new Set(first.leaderboard.map(row => row.userId)).size, 14);
  registered.push({ id: 'future-user', name: 'Новий користувач', department: 'Новий відділ' });
  const next = await getDashboardData('learner');
  assert.equal(next.leaderboard.length, 15);
  assert.deepEqual(next.leaderboard.find(row => row.userId === 'future-user'), {
    userId: 'future-user', name: 'Новий користувач', department: 'Новий відділ', completed: 0, avgScore: null
  });
  for (const { name, query } of calls.filter(call => call.name.startsWith('leaderboard'))) {
    assert.equal(query.take, undefined, `${name} must not cap portal membership`);
    if (name === 'leaderboardUsers') {
      assert.equal(query.where, undefined);
      assert.deepEqual(Object.keys(query.select).sort(), ['department', 'id', 'name']);
    }
  }
});

test('leaderboard ranks completed published modules first and resolves ties consistently', async () => {
  const { getDashboardData } = fixture({
    users: [
      { id: 'zero-b', name: 'Богдан', department: '' },
      { id: 'tie-z', name: 'Анна', department: '' },
      { id: 'leader', name: 'Ярослав', department: '' },
      { id: 'tie-a', name: 'Анна', department: '' }
    ],
    additionalProgress: [
      { userId: 'leader', moduleId: 1 }, { userId: 'leader', moduleId: 2 },
      { userId: 'tie-z', moduleId: 1 }, { userId: 'tie-a', moduleId: 1 }
    ],
    additionalAttempts: [
      { userId: 'leader', moduleId: 1, score: 0 }, { userId: 'leader', moduleId: 1, score: 80 },
      { userId: 'leader', moduleId: 2, score: 0 }, { userId: 'leader', moduleId: 4, score: 100 },
      { userId: 'tie-z', moduleId: 1, score: 0 }
    ]
  });
  const data = await getDashboardData('learner');
  assert.deepEqual(data.leaderboard.map(row => [row.userId, row.completed, row.avgScore]), [
    ['leader', 2, 40], ['tie-a', 1, null], ['tie-z', 1, 0], ['zero-b', 0, null]
  ]);
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
