const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { NextRequest } = require('next/server');

// Load the actual TypeScript handlers with explicit in-memory database mocks.
// This avoids test accounts, real password changes, email, and development CLI
// dependencies; it does not load the application's Prisma singleton.
function source(relative, mocks = {}, cache = new Map()) {
  const filename = path.resolve(__dirname, '..', relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  cache.set(filename, loaded);
  const requireInstalled = Module.createRequire(filename);
  loaded.require = (request) => {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) return mocks[request];
    if (request.startsWith('@/')) return source(request.slice(2) + '.ts', mocks, cache);
    return requireInstalled(request);
  };
  loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  }).outputText, filename);
  return loaded.exports;
}

process.env.JWT_SECRET = 'backend-regression-test-signing-key';
const authToken = source('lib/auth-token.ts');
const progressLogic = source('lib/progress.ts');
const quizLogic = source('lib/quiz.ts');
const userClaims = { sub: 'test-user', email: 'test@example.invalid', name: 'Test', role: 'SELLER' };
const authMock = { requireUser: async () => ({ id: userClaims.sub }), clearAuthCookie: (response) => response };
const activityMock = { recordLearningActivity: async () => {} };

function post(url, body) {
  return new Request('http://localhost:3000' + url, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body)
  });
}

test('password changes invalidate earlier signed sessions without exposing the hash', () => {
  const token = authToken.signAuthToken(userClaims, 'old-password-hash');
  const claims = authToken.verifyAuthToken(token);
  assert.ok(claims);
  assert.equal(authToken.isAuthSessionCurrent(claims, 'old-password-hash'), true);
  assert.equal(authToken.isAuthSessionCurrent(claims, 'new-password-hash'), false);
  assert.equal(JSON.stringify(claims).includes('old-password-hash'), false);
  assert.equal(authToken.verifyAuthToken('invalid'), null);
  const legacy = require('jsonwebtoken').sign(userClaims, process.env.JWT_SECRET);
  assert.equal(authToken.verifyAuthToken(legacy), null);
});

test('authenticated user responses strip authentication material', async () => {
  const token = authToken.signAuthToken(userClaims, 'current-password-hash');
  const auth = source('lib/auth.ts', {
    'next/headers': { cookies: async () => ({ get: () => ({ value: token }) }) },
    '@/lib/prisma': { prisma: { user: { findUnique: async () => ({ id: userClaims.sub, role: 'SELLER', isActive: true, passwordHash: 'current-password-hash' }) } } }
  });
  const user = await auth.getCurrentUser();
  assert.equal(user.id, userClaims.sub);
  assert.equal(Object.hasOwn(user, 'passwordHash'), false);
});

test('invalid cookie does not redirect away from login or reset pages', () => {
  const { middleware } = source('middleware.ts');
  for (const route of ['/login', '/forgot-password', '/reset-password?token=administrator-link']) {
    const response = middleware(new NextRequest('http://localhost:3000' + route, { headers: { cookie: 'portal_token=invalid' } }));
    assert.equal(response.headers.get('location'), null);
  }
  const protectedResponse = middleware(new NextRequest('http://localhost:3000/dashboard'));
  assert.equal(new URL(protectedResponse.headers.get('location')).pathname, '/login');
});

test('client completion cannot finish a module with a quiz; successful grading can', () => {
  const input = { existing: null, progressPct: 100, hasQuiz: true, explicitStatus: 'COMPLETED' };
  assert.equal(progressLogic.resolveStoredProgress(input).status, 'IN_PROGRESS');
  assert.equal(progressLogic.resolveStoredProgress({ ...input, quizPassed: true }).status, 'COMPLETED');
  assert.equal(progressLogic.resolveStoredProgress({ ...input, hasQuiz: false }).status, 'COMPLETED');
  const completed = { status: 'COMPLETED', progressPct: 100, completedAt: new Date('2026-01-01') };
  assert.deepEqual(progressLogic.resolveStoredProgress({ existing: completed, progressPct: 5, hasQuiz: true }), completed);
});

test('matching answers compare their content independent of object key order', () => {
  const questions = [{ id: 1, type: 'MATCHING', correctAnswer: { pairs: { a: 'A', b: 'B' } } }];
  assert.equal(quizLogic.calculateQuizScore(questions, [{ questionId: 1, answer: { pairs: { b: 'B', a: 'A' } } }]).percentage, 100);
  assert.equal(quizLogic.calculateQuizScore(questions, [{ questionId: 1, answer: { pairs: { b: 'A', a: 'B' } } }]).percentage, 0);
});

test('multiple-choice answers reject non-numeric extras and invalid quiz rules are bounded', () => {
  const questions = [{ id: 1, type: 'MULTIPLE', correctAnswer: { indices: [0, 1] } }];
  assert.equal(quizLogic.calculateQuizScore(questions, [{ questionId: 1, answer: [0, 1, 'extra'] }]).percentage, 0);
  assert.deepEqual(quizLogic.parseQuizRules({ passScore: -1, maxAttempts: 0 }), { passScore: 1, maxAttempts: 1, scoringMode: 'BEST' });
});

test('GET progress without a module ID returns the full published list; malformed IDs are rejected', async () => {
  const rows = [{ moduleId: 1, progressPct: 25 }, { moduleId: 2, progressPct: 100 }];
  let calls = 0;
  const { GET } = source('app/api/progress/route.ts', {
    '@/lib/auth': authMock,
    '@/lib/learning-activity': activityMock,
    '@/lib/prisma': { prisma: { userProgress: { findMany: async (query) => { calls++; assert.equal(query.where.module.isPublished, true); return rows; } } } }
  });
  assert.deepEqual(await (await GET(new Request('http://localhost:3000/api/progress'))).json(), { progress: rows });
  for (const value of ['', '1.2', '-1', 'invalid', '2147483648']) {
    assert.equal((await GET(new Request('http://localhost:3000/api/progress?moduleId=' + value))).status, 400);
  }
  assert.equal(calls, 1);
});

test('progress POST refuses unpublished modules and quiz completion before writing', async () => {
  for (const trainingModule of [null, { id: 1, _count: { questions: 1 } }]) {
    let writes = 0;
    const tx = {
      $executeRaw: async () => 0,
      module: { findFirst: async (query) => { assert.equal(query.where.isPublished, true); return trainingModule; } },
      userProgress: { upsert: async () => { writes++; } }
    };
    const { POST } = source('app/api/progress/route.ts', {
      '@/lib/auth': authMock, '@/lib/learning-activity': activityMock,
      '@/lib/prisma': { prisma: { $transaction: async (work) => work(tx) } }
    });
    const response = await POST(post('/api/progress', { moduleId: 1, progressPct: 0, status: 'COMPLETED' }));
    assert.equal(response.status, trainingModule ? 400 : 404);
    assert.equal(writes, 0);
  }
});

test('simultaneous final quiz attempts serialize before counting and only one is accepted', async () => {
  let attempts = 2;
  let lockTail = Promise.resolve();
  let activityWrites = 0;
  const prisma = { $transaction: async (work) => {
    let release;
    const tx = {
      $executeRaw: async (sql) => {
        assert.match(sql.join('?'), /pg_advisory_xact_lock/);
        const previous = lockTail;
        lockTail = new Promise((resolve) => { release = resolve; });
        await previous;
        return 1;
      },
      module: { findFirst: async (query) => { assert.equal(query.where.isPublished, true); return { id: 1, questions: [{ id: 10, type: 'SINGLE', correctAnswer: { index: 0 } }] }; } },
      userProgress: { findUnique: async () => ({ status: 'IN_PROGRESS', progressPct: 100, completedAt: null }), upsert: async () => {} },
      appSetting: { findUnique: async () => ({ value: { passScore: 70, maxAttempts: 3 } }) },
      quizAttempt: { count: async () => attempts, create: async () => { attempts++; } },
      certificate: { upsert: async () => {} }
    };
    try { return await work(tx); } finally { if (release) release(); }
  } };
  const { POST } = source('app/api/quiz/submit/route.ts', {
    '@/lib/auth': authMock,
    '@/lib/learning-activity': { recordLearningActivity: async () => { activityWrites++; } },
    '@/lib/prisma': { prisma }
  });
  const responses = await Promise.all([1, 2].map(() => POST(post('/api/quiz/submit', { moduleId: 1, answers: [{ questionId: 10, answer: 0 }] }))));
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 429]);
  assert.equal(attempts, 3);
  assert.equal(activityWrites, 1);
});

test('quiz POST requires a published module and completed material before consuming attempts', async () => {
  for (const trainingModule of [null, { id: 1, questions: [{ id: 10, type: 'SINGLE', correctAnswer: { index: 0 } }] }]) {
    let attemptsRead = false;
    const tx = {
      $executeRaw: async () => 0,
      module: { findFirst: async (query) => { assert.equal(query.where.isPublished, true); return trainingModule; } },
      userProgress: { findUnique: async () => ({ status: 'IN_PROGRESS', progressPct: 50, completedAt: null }) },
      quizAttempt: { count: async () => { attemptsRead = true; return 0; } }
    };
    const { POST } = source('app/api/quiz/submit/route.ts', {
      '@/lib/auth': authMock, '@/lib/learning-activity': activityMock,
      '@/lib/prisma': { prisma: { $transaction: async (work) => work(tx) } }
    });
    assert.equal((await POST(post('/api/quiz/submit', { moduleId: 1, answers: [{ questionId: 10, answer: 0 }] }))).status, trainingModule ? 400 : 404);
    assert.equal(attemptsRead, false);
  }
});

test('upload keys cannot escape the upload root through Windows or encoded traversal', () => {
  const storage = source('lib/upload-storage.ts');
  for (const value of ['../uploads-backup/file.png', '..\\uploads-backup\\file.png', '%2e%2e%5cuploads-backup%5cfile.png', 'avatars/file.png:stream', 'avatars/%00file.png', '%bad']) {
    assert.equal(storage.getLocalUploadPathFromKey(value), null, value);
  }
  assert.equal(storage.getLocalUploadPathFromKey('avatars/test.png'), path.resolve('public/uploads/avatars/test.png'));
});

test('manual password recovery has no database side effects or false email promise', async () => {
  const { POST } = source('app/api/auth/forgot-password/route.ts', {
    '@/lib/prisma': { get prisma() { throw new Error('Recovery must not use the database'); } }
  });
  const response = await POST(post('/api/auth/forgot-password', { email: 'person@example.invalid' }));
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.mode, 'administrator');
  assert.match(data.message, /адміністратора/);
  assert.equal(Object.hasOwn(data, 'demoResetUrl'), false);
});

test('new modules stay private drafts and only include media supplied by the administrator', async () => {
  const { POST } = source('app/api/admin/content/route.ts', {
    '@/lib/auth': { requireRole: async () => ({ id: 'test-admin' }) },
    '@/lib/admin-audit': { createAdminAuditLog: async () => {}, getRequestIpAddress: () => null },
    '@/lib/prisma': { prisma: {
      category: { findUnique: async () => ({ id: 1, name: 'Test category' }) },
      module: {
        aggregate: async () => ({ _max: { sortOrder: 0 } }),
        create: async ({ data }) => ({ id: 1, isPublished: true, ...data })
      }
    } }
  });
  const create = async (fields = {}) => {
    const response = await POST(post('/api/admin/content', {
      entity: 'module', categoryId: 1, title: 'New module', description: 'A module to prepare',
      durationMin: 10, isPublished: true, ...fields
    }));
    assert.equal(response.status, 200);
    const { module: created } = await response.json();
    assert.equal(created.isPublished, false);
    return created.contentBlocks;
  };
  const emptyMedia = await create();
  assert.ok(emptyMedia.length > 0);
  assert.equal(emptyMedia.filter((block) => ['video', 'image', 'pdf'].includes(block.type)).length, 0);
  const media = { videoUrl: 'https://youtu.be/abcDEF123_-', imageUrl: '/uploads/image.png', pdfUrl: '/uploads/guide.pdf' };
  const suppliedMedia = await create(media);
  for (const [type, url] of [['video', media.videoUrl], ['image', media.imageUrl], ['pdf', media.pdfUrl]]) {
    assert.equal(suppliedMedia.find((block) => block.type === type)?.url, url);
  }
  const customBlocks = [{ type: 'text', title: 'Ready content', html: '<p>Custom content</p>' }];
  assert.deepEqual(await create({ contentBlocks: customBlocks }), customBlocks);
});

test('the admin content tree receives both draft and published module rows after refresh', async () => {
  const createdAt = new Date('2026-10-17T09:00:00Z');
  const rows = [false, true].map((isPublished, index) => ({
    id: index + 1, title: isPublished ? 'Published module' : 'Draft module', description: 'Module description',
    durationMin: 10, sortOrder: index, isPublished, createdAt
  }));
  const { fetchAdminConsoleData } = source('app/admin/_shared/fetchAdminData.ts', {
    '@/lib/queries': { getAdminPortalPages: async () => [] },
    '@/lib/prisma': { prisma: {
      user: { findMany: async () => [] },
      brand: { findMany: async () => [{
        id: 1, name: 'Brand', slug: 'brand', logoUrl: '/logo.svg', description: 'Description', sortOrder: 0,
        categories: [{ id: 1, name: 'Category', slug: 'category', description: 'Description', sortOrder: 0,
          _count: { modules: 2 }, modules: rows }]
      }] }
    } }
  });
  const { brandRows } = await fetchAdminConsoleData();
  assert.equal(brandRows[0].moduleCount, 2);
  const category = brandRows[0].categories[0];
  assert.equal(category.modulesCount, 2);
  assert.deepEqual(category.modules.map(({ id, title, isPublished }) => ({ id, title, isPublished })),
    rows.map(({ id, title, isPublished }) => ({ id, title, isPublished })));
  assert.equal(category.modules[0].createdAt, createdAt.toISOString());
});

test('administrator reset links are consumed once and invalidate sibling links atomically', async () => {
  let consumed = false;
  let passwordWrites = 0;
  let siblingInvalidations = 0;
  let lockTail = Promise.resolve();
  const prisma = { $transaction: async (work) => {
    let release;
    const tx = {
      $executeRaw: async (sql) => {
        assert.match(sql.join('?'), /FOR UPDATE/);
        const previous = lockTail;
        lockTail = new Promise((resolve) => { release = resolve; });
        await previous;
        return 1;
      },
      passwordResetToken: {
        findFirst: async () => consumed ? null : { id: 'reset-entry', userId: 'test-user' },
        updateMany: async (query) => {
          if (query.where.userId) { siblingInvalidations++; return { count: 1 }; }
          if (consumed) return { count: 0 };
          consumed = true;
          return { count: 1 };
        }
      },
      user: { findUnique: async () => ({ id: 'test-user', email: 'test@example.invalid', isActive: true }), update: async () => { passwordWrites++; } },
      loginAttempt: { deleteMany: async () => ({ count: 0 }) }
    };
    try { return await work(tx); } finally { if (release) release(); }
  } };
  const { POST } = source('app/api/auth/reset-password/route.ts', {
    '@/lib/auth': authMock, '@/lib/prisma': { prisma }, 'bcryptjs': { hash: async () => 'new-test-hash' }
  });
  const responses = await Promise.all([1, 2].map(() => POST(post('/api/auth/reset-password', { token: 'administrator-test-token', password: 'NewPassword123!' }))));
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 400]);
  assert.equal(passwordWrites, 1);
  assert.equal(siblingInvalidations, 1);
});
