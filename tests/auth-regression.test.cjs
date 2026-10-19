const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Execute the real handlers/components with an in-memory store. Never load the
// application Prisma singleton, send mail, or change an actual account.
function source(relative, mocks = {}, cache = new Map()) {
  const filename = path.resolve(__dirname, '..', relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  cache.set(filename, loaded);
  const requireInstalled = Module.createRequire(filename);
  loaded.require = (request) => {
    if (Object.hasOwn(mocks, request)) return mocks[request];
    if (request.startsWith('@/')) return source(request.slice(2) + '.ts', mocks, cache);
    return requireInstalled(request);
  };
  loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText, filename);
  return loaded.exports;
}

process.env.JWT_SECRET = 'isolated-auth-regression-signing-key';
const tokens = source('lib/auth-token.ts');
const claims = { sub: 'employee', email: 'employee@example.invalid', name: 'Employee', role: 'SELLER' };
const post = (url, data) => new Request('https://portal.example.invalid' + url, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data)
});

function authWith(token, getUser) {
  return source('lib/auth.ts', {
    'next/headers': { cookies: async () => ({ get: () => token ? { value: token } : undefined }) },
    '@/lib/prisma': { prisma: { user: { findUnique: getUser } } }
  });
}

test('page guards clean invalid cookies through a handler, while missing cookies go directly to login', async () => {
  for (const hasCookie of [false, true]) {
    const guards = source('lib/guards.ts', {
      '@/lib/auth': { authCookieName: 'portal_token', getCurrentUser: async () => null },
      'next/headers': { cookies: async () => ({ has: (name) => name === 'portal_token' && hasCookie }) },
      'next/navigation': { redirect: (location) => { throw new Error(location); } }
    });
    await assert.rejects(guards.requireAuthPageUser(), { message: hasCookie ? '/api/auth/session' : '/login' });
  }
  const user = { id: 'employee', role: 'SELLER' };
  const guards = source('lib/guards.ts', { '@/lib/auth': { getCurrentUser: async () => user } });
  assert.equal(await guards.requireAuthPageUser(), user);
});

test('session cleanup clears malformed, revoked, inactive and deleted sessions; valid sessions survive', async () => {
  const token = tokens.signAuthToken(claims, 'current-test-hash');
  for (const scenario of [
    { token: 'invalid', user: null },
    { token, user: { ...claims, isActive: true, passwordHash: 'new-test-hash' } },
    { token, user: { ...claims, isActive: false, passwordHash: 'current-test-hash' } },
    { token, user: null },
    { token, user: { ...claims, isActive: true, passwordHash: 'current-test-hash' }, valid: true }
  ]) {
    const auth = authWith(scenario.token, async () => scenario.user);
    const { GET } = source('app/api/auth/session/route.ts', { '@/lib/auth': auth });
    const response = await GET(new Request('https://portal.example.invalid/api/auth/session?next=https://attacker.invalid'));
    assert.equal(response.status, 303);
    assert.equal(response.headers.get('location'), 'https://portal.example.invalid/' + (scenario.valid ? 'dashboard' : 'login'));
    assert.match(response.headers.get('cache-control'), /no-store/);
    if (scenario.valid) assert.equal(response.headers.get('set-cookie'), null);
    else assert.match(response.headers.get('set-cookie'), /portal_token=;.*Max-Age=0/);
  }
});

test('current permissions come from the account and invalid JWTs never query a user', async () => {
  const adminClaims = { ...claims, role: 'ADMIN' };
  const token = tokens.signAuthToken(adminClaims, 'current-test-hash');
  const user = await authWith(token, async () => ({ id: claims.sub, role: 'SELLER', isActive: true, passwordHash: 'current-test-hash' })).getCurrentUser();
  assert.equal(user.role, 'SELLER');
  assert.equal(Object.hasOwn(user, 'passwordHash'), false);
  const jwt = require('jsonwebtoken');
  const expired = jwt.sign({ ...claims, session: '0'.repeat(64), exp: 1 }, process.env.JWT_SECRET);
  for (const invalid of [null, 'invalid', expired, jwt.sign(claims, process.env.JWT_SECRET)]) {
    assert.equal(await authWith(invalid, async () => { throw new Error('Invalid tokens must not query the database'); }).getCurrentUser(), null);
  }
});

test('administrator password changes revoke old sessions and reset links without exposing passwords', async () => {
  for (const self of [false, true]) {
    let hash = 'old-test-hash';
    let deletedLinks = 0;
    const tx = {
      user: { update: async ({ data }) => { hash = data.passwordHash; } },
      passwordResetToken: { deleteMany: async () => { deletedLinks++; } },
      loginAttempt: { deleteMany: async () => {} }
    };
    const auth = authWith(tokens.signAuthToken(claims, hash), async () => ({ id: claims.sub, isActive: true, passwordHash: hash }));
    const { POST } = source('app/api/admin/users/access/route.ts', {
      '@/lib/auth': { ...auth, requireRole: async () => ({ id: self ? claims.sub : 'administrator' }) },
      '@/lib/admin-audit': { createAdminAuditLog: async (entry) => { assert.equal(JSON.stringify(entry).includes('NewPassword123!'), false); }, getRequestIpAddress: () => null },
      '@/lib/prisma': { prisma: { user: { findUnique: async () => ({ id: claims.sub, name: 'Employee', email: claims.email }) }, $transaction: async (work) => work(tx) } },
      bcryptjs: { hash: async () => 'new-test-hash' }
    });
    const response = await POST(post('/api/admin/users/access', { action: 'set-password', userId: claims.sub, password: 'NewPassword123!' }));
    assert.equal(response.status, 200);
    assert.equal(hash, 'new-test-hash');
    assert.equal(deletedLinks, 1);
    assert.equal(await auth.getCurrentUser(), null);
    assert.equal(JSON.stringify(await response.json()).includes('NewPassword123!'), false);
    assert.equal(Boolean(response.headers.get('set-cookie')), self);
  }
});

test('password management denies unauthorised callers before accessing an account', async () => {
  const { POST } = source('app/api/admin/users/access/route.ts', {
    '@/lib/auth': { requireRole: async () => null },
    '@/lib/prisma': { get prisma() { throw new Error('Unauthorised requests must not access the database'); } }
  });
  const response = await POST(post('/api/admin/users/access', { action: 'set-password', userId: claims.sub, password: 'NewPassword123!' }));
  assert.equal(response.status, 403);
});

test('reset expiry is rechecked after waiting for the account lock', async () => {
  const RealDate = Date;
  let clock = new RealDate('2026-10-19T08:00:00Z').valueOf();
  const expiresAt = clock + 1000;
  let passwordWrites = 0;
  const tx = {
    $executeRaw: async () => { clock += 2000; },
    passwordResetToken: {
      findFirst: async () => ({ id: 'reset-entry', userId: claims.sub }),
      updateMany: async ({ where }) => ({ count: where.expiresAt.gt.valueOf() < expiresAt ? 1 : 0 })
    },
    user: { findUnique: async () => ({ id: claims.sub, email: claims.email, isActive: true }), update: async () => { passwordWrites++; } }
  };
  const { POST } = source('app/api/auth/reset-password/route.ts', {
    '@/lib/auth': { clearAuthCookie: (response) => response },
    '@/lib/prisma': { prisma: { $transaction: async (work) => work(tx) } },
    bcryptjs: { hash: async () => 'new-test-hash' }
  });
  global.Date = class extends RealDate {
    constructor(...args) { super(...(args.length ? args : [clock])); }
    static now() { return clock; }
  };
  try {
    const response = await POST(post('/api/auth/reset-password', { token: 'one-time-test-token', password: 'NewPassword123!' }));
    assert.equal(response.status, 400);
    assert.equal(passwordWrites, 0);
  } finally { global.Date = RealDate; }
});

function hookComponent(relative, name, props = {}, extraMocks = {}) {
  const states = [];
  let cursor = 0;
  const hooks = {
    useState: (initial) => {
      const index = cursor++;
      if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial;
      return [states[index], (value) => { states[index] = typeof value === 'function' ? value(states[index]) : value; }];
    },
    useMemo: (factory) => factory()
  };
  const component = source(relative, {
    react: hooks,
    'next/navigation': { useRouter: () => ({ push() {}, refresh() {} }), useSearchParams: () => new URLSearchParams({ token: 'one-time-test-token' }) },
    ...extraMocks
  })[name];
  return () => { cursor = 0; return component(props); };
}

function find(tree, predicate) {
  if (!tree || typeof tree !== 'object') return undefined;
  if (predicate(tree)) return tree;
  return [].concat(tree.props?.children ?? []).map((child) => find(child, predicate)).find(Boolean);
}

function text(tree) {
  if (tree == null || typeof tree === 'boolean') return '';
  if (typeof tree !== 'object') return String(tree);
  return [].concat(tree.props?.children ?? []).map(text).join('');
}

test('login, registration and reset restore submit controls after network, JSON and server errors', async () => {
  const originalFetch = global.fetch;
  const OriginalFormData = global.FormData;
  global.FormData = class { get(name) { return ({ name: 'Test Employee', email: claims.email, password: 'NewPassword123!', position: 'Seller', department: 'Sales', store: 'Test store' })[name]; } };
  try {
    for (const failure of [
      async () => { throw new TypeError('Failed to fetch'); },
      async () => new Response('<html>upstream error</html>', { status: 502 }),
      async () => Response.json({ error: 'Test server error' }, { status: 400 })
    ]) {
      global.fetch = failure;
      for (const name of ['LoginForm', 'RegisterForm', 'ResetPasswordForm']) {
        const render = hookComponent('components/auth/' + name + '.tsx', name);
        const submit = find(render(), (element) => element.type === 'form').props.onSubmit;
        await submit({ preventDefault() {}, currentTarget: {} });
        const result = render();
        assert.equal(find(result, (element) => element.type === 'button' && element.props.type === 'submit').props.disabled, false, name);
        const alert = find(result, (element) => element.props?.role === 'alert');
        assert.ok(alert, name + ' must expose a readable error');
        assert.ok(text(alert).length > 10);
      }
    }
  } finally { global.fetch = originalFetch; global.FormData = OriginalFormData; }
});

test('both administrator access actions become retryable after network or non-JSON failures', async () => {
  const originalFetch = global.fetch;
  try {
    for (const failure of [
      async () => { throw new TypeError('Failed to fetch'); },
      async () => new Response('<html>upstream error</html>', { status: 502 })
    ]) {
      global.fetch = failure;
      for (const action of ['Встановити пароль', 'Створити reset-посилання']) {
        const render = hookComponent('components/admin/AdminUserAccessPanel.tsx', 'AdminUserAccessPanel', { userId: claims.sub, userName: 'Employee', canManage: true });
        find(render(), (element) => element.type === 'input').props.onChange({ target: { value: 'NewPassword123!' } });
        await find(render(), (element) => element.type === 'button' && text(element).trim() === action).props.onClick();
        assert.equal(find(render(), (element) => element.type === 'button' && text(element).trim() === action).props.disabled, false, action);
        assert.match(text(find(render(), (element) => element.props?.role === 'alert')), /зв’язку|некоректну відповідь/);
      }
    }
  } finally { global.fetch = originalFetch; }
});

test('manual recovery displays a configured support contact without claiming delivery', () => {
  const previous = process.env.PASSWORD_RESET_SUPPORT_CONTACT;
  process.env.PASSWORD_RESET_SUPPORT_CONTACT = 'Internal support desk';
  try {
    const { ForgotPasswordForm } = source('components/auth/ForgotPasswordForm.tsx');
    const rendered = text(ForgotPasswordForm());
    assert.match(rendered, /Internal support desk/);
    assert.match(rendered, /Автоматичне надсилання листів зараз не використовується/);
  } finally {
    if (previous === undefined) delete process.env.PASSWORD_RESET_SUPPORT_CONTACT;
    else process.env.PASSWORD_RESET_SUPPORT_CONTACT = previous;
  }
});
