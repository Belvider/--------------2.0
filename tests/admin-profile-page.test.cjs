const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const subject = { id: 'subject-user', name: 'Профіль працівника' };
function setup({ role = 'ADMIN', signedIn = true, exists = true, certificateOwner = subject.id } = {}) {
  const viewer = signedIn ? { id: 'viewer-admin', name: 'Адміністратор', role } : null;
  const calls = [], cache = new Map();
  const profile = { user: exists ? subject : null };
  const mocks = {
    '@/lib/auth': { getCurrentUser: async () => viewer, authCookieName: 'portal_token' },
    'next/headers': { cookies: async () => ({ has: () => false }) },
    'next/navigation': {
      redirect: href => { throw Error('REDIRECT:' + href); },
      notFound: () => { throw Error('NOT_FOUND'); }
    },
    'next/link': { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) },
    '@/lib/queries': { getProfileData: async id => { calls.push({ type: 'profile', id }); return profile; } },
    '@/components/profile/LearningProfile': { LearningProfile: ({ profile, isOwnProfile = true }) => React.createElement('h1', { 'data-own': String(isOwnProfile), 'data-subject': profile.user.id }, profile.user.name) },
    '@/components/PortalShell': { PortalShell: ({ user, children }) => React.createElement('main', { 'data-viewer': user.id }, children) },
    '@/components/CertificateActions': { CertificateActions: () => null },
    '@/lib/prisma': { prisma: { certificate: { findFirst: async query => {
      calls.push({ type: 'certificate', query });
      if (query.where.userId && query.where.userId !== certificateOwner) return null;
      return { id: 7, userId: certificateOwner, issuedAt: new Date('2026-10-20T12:00:00Z'),
        user: { name: 'Працівник', firstName: 'Олег', lastName: 'Приклад', position: 'Консультант', department: 'Магазин' },
        module: { title: 'Навчальний матеріал', category: { name: 'Категорія', brand: { name: 'Бренд' } } } };
    } } } }
  };
  function load(relative) {
    const filename = path.resolve(__dirname, '..', relative);
    if (cache.has(filename)) return cache.get(filename).exports;
    const loaded = new Module(filename, module);
    loaded.filename = filename;
    loaded.paths = Module._nodeModulePaths(path.dirname(filename));
    cache.set(filename, loaded);
    const installed = Module.createRequire(filename);
    loaded.require = request => {
      if (Object.hasOwn(mocks, request)) return mocks[request];
      if (request.startsWith('@/')) return load(request.slice(2) + '.ts');
      return installed(request);
    };
    loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
    }).outputText, filename);
    return loaded.exports;
  }
  return { viewer, calls, profile, load };
}
const adminRoute = 'app/admin/users/[id]/profile/page.tsx';

test('administrator learning view loads the selected user in read-only shared profile with contextual editing', async () => {
  const { load, calls } = setup();
  const markup = renderToStaticMarkup(await load(adminRoute).default({ params: Promise.resolve({ id: subject.id }) }));
  assert.deepEqual(calls, [{ type: 'profile', id: subject.id }]);
  assert.match(markup, /data-own="false"/);
  assert.match(markup, /data-subject="subject-user"/);
  assert.match(markup, /href="\/admin\/users\/subject-user#profile-data"/);
  assert.match(markup, /Перегляд для аналізу/);
  assert.doesNotMatch(markup, /viewer-admin#profile-data/);
});

test('anonymous, seller and manager cannot load another learning profile or trigger its data query', async () => {
  for (const options of [{ signedIn: false }, { role: 'SELLER' }, { role: 'MANAGER' }]) {
    const { load, calls } = setup(options);
    await assert.rejects(load(adminRoute).default({ params: Promise.resolve({ id: subject.id }) }), /REDIRECT:(\/login|\/dashboard)/);
    assert.equal(calls.length, 0);
  }
});

test('a deleted or unknown selected user returns not found', async () => {
  const { load } = setup({ exists: false });
  await assert.rejects(load(adminRoute).default({ params: Promise.resolve({ id: 'missing-user' }) }), /NOT_FOUND/);
});

test('own profile remains scoped to the signed-in user and offers self editing only to administrators', async () => {
  for (const role of ['ADMIN', 'MANAGER', 'SELLER']) {
    const { load, calls, viewer, profile } = setup({ role });
    profile.user = viewer;
    const markup = renderToStaticMarkup(await load('app/profile/page.tsx').default());
    assert.deepEqual(calls, [{ type: 'profile', id: viewer.id }]);
    assert.match(markup, /data-viewer="viewer-admin"/);
    assert.match(markup, /data-own="true"/);
    if (role === 'ADMIN') {
      assert.match(markup, /href="\/admin\/users\/viewer-admin#profile-data"/);
      assert.match(markup, /Редагувати мої дані/);
    } else assert.doesNotMatch(markup, /#profile-data|Профілі користувачів/);
  }
});

test('administrator can open a selected user certificate and return to that learning profile', async () => {
  const { load, calls } = setup();
  const markup = renderToStaticMarkup(await load('app/certificate/[id]/page.tsx').default({ params: Promise.resolve({ id: '7' }) }));
  assert.deepEqual(calls[0].query.where, { id: 7 });
  assert.match(markup, /href="\/admin\/users\/subject-user\/profile"/);
  assert.doesNotMatch(markup, /Продовжити навчання/);
  assert.match(markup, /Приклад Олег/);
  assert.equal(calls[0].query.include.user.select.passwordHash, undefined);
});

test('seller and manager remain restricted to their own certificates', async () => {
  for (const role of ['SELLER', 'MANAGER']) {
    const forbidden = setup({ role });
    await assert.rejects(forbidden.load('app/certificate/[id]/page.tsx').default({ params: Promise.resolve({ id: '7' }) }), /NOT_FOUND/);
    assert.deepEqual(forbidden.calls[0].query.where, { id: 7, userId: 'viewer-admin' });
    const owner = setup({ role, certificateOwner: 'viewer-admin' });
    const markup = renderToStaticMarkup(await owner.load('app/certificate/[id]/page.tsx').default({ params: Promise.resolve({ id: '7' }) }));
    assert.match(markup, /href="\/profile"/);
    assert.match(markup, /Продовжити навчання/);
    assert.doesNotMatch(markup, /\/admin\/users\//);
  }
});

test('invalid certificate IDs and anonymous requests never query a certificate', async () => {
  for (const id of ['abc', '-1', '1.2', '2147483648']) {
    const { load, calls } = setup();
    await assert.rejects(load('app/certificate/[id]/page.tsx').default({ params: Promise.resolve({ id }) }), /NOT_FOUND/);
    assert.equal(calls.length, 0);
  }
  const { load, calls } = setup({ signedIn: false });
  await assert.rejects(load('app/certificate/[id]/page.tsx').default({ params: Promise.resolve({ id: '7' }) }), /REDIRECT:\/login/);
  assert.equal(calls.length, 0);
});
