const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function fixture() {
  const brand = { name: 'Apple', slug: 'apple' };
  const learningModule = (id, title, durationMin) => ({ id, title, durationMin, category: { brand } });
  const first = learningModule(1, 'Завершений матеріал', 20);
  const second = learningModule(2, 'Потрібне повторення', 30);
  const hidden = learningModule(3, 'Прихований матеріал', 90);
  const progress = (id, module, status, progressPct) => ({
    id, moduleId: module.id, module, status, progressPct,
    lastSeenAt: new Date('2026-10-23T10:00:00Z'), completedAt: status === 'COMPLETED' ? new Date('2026-10-23T10:00:00Z') : null
  });
  const attempt = (id, module, score, passed) => ({
    id, moduleId: module.id, module, score, passed, attemptedAt: new Date(`2026-10-2${id}T11:00:00Z`)
  });
  return {
    user: {
      id: 'target-user', name: 'Анна Коваленко', firstName: 'Анна', lastName: 'Коваленко',
      email: 'target@example.test', avatarUrl: '/api/uploads/avatars/target.png',
      position: 'Консультант', department: 'Навчання', store: 'Магазин',
      notes: 'PRIVATE_HR_NOTE', phone: 'PRIVATE_PHONE', passwordHash: 'PRIVATE_PASSWORD'
    },
    publishedModules: [first, second],
    progressList: [progress(1, first, 'COMPLETED', 100), progress(2, second, 'IN_PROGRESS', 50), progress(3, hidden, 'COMPLETED', 100)],
    attempts: [attempt(1, first, 80, true), attempt(2, first, 40, false), attempt(3, second, 20, false), attempt(4, hidden, 100, true)],
    certificates: [
      { id: 11, module: first, issuedAt: new Date('2026-10-20T12:00:00Z') },
      { id: 12, module: hidden, issuedAt: new Date('2026-10-20T12:00:00Z') }
    ],
    badges: [{ id: 21, badge: { name: 'Перший крок', description: 'Перший завершений модуль', icon: null } }],
    activityDays: [{ day: '2026-10-23', count: 2 }], assignments: [],
    assignmentSummary: { open: 0, completed: 0, overdue: 0 }
  };
}

function renderProfile(profile, isOwnProfile) {
  const cache = new Map(), received = {};
  function load(relative) {
    const filename = path.resolve(__dirname, '..', relative);
    if (cache.has(filename)) return cache.get(filename).exports;
    const loaded = new Module(filename, module);
    loaded.filename = filename;
    loaded.paths = Module._nodeModulePaths(path.dirname(filename));
    cache.set(filename, loaded);
    const installed = Module.createRequire(filename);
    loaded.require = request => {
      if (request === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
      if (request === 'next/navigation') return { useRouter: () => ({ refresh() { throw new Error('Rendering a profile cannot mutate or refresh it'); } }) };
      if (request === '@/components/UserAvatar') return { UserAvatar: ({ name, avatarUrl }) => React.createElement('img', { src: avatarUrl || undefined, alt: name }) };
      if (request.endsWith('.module.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
      if (request === '@/lib/queries' || request === '@/lib/prisma') throw new Error('Shared profile rendering must not access a database');
      if (request === '@/components/profile/ProfileIdentityCard') {
        const { ProfileIdentityCard } = load('components/profile/ProfileIdentityCard.tsx');
        return { ProfileIdentityCard: props => { received.identity = props; return React.createElement(ProfileIdentityCard, props); } };
      }
      if (request === '@/components/profile/ProfileHistory') {
        const { ProfileHistory } = load('components/profile/ProfileHistory.tsx');
        return { ProfileHistory: props => { received.history = props; return React.createElement(ProfileHistory, props); } };
      }
      if (request.startsWith('@/')) {
        const relative = request.slice(2);
        return load(relative + (fs.existsSync(path.resolve(__dirname, '..', relative + '.tsx')) ? '.tsx' : '.ts'));
      }
      return installed(request);
    };
    loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
    }).outputText, filename);
    return loaded.exports;
  }
  const { LearningProfile } = load('components/profile/LearningProfile.tsx');
  const markup = renderToStaticMarkup(React.createElement(LearningProfile, { profile, isOwnProfile }));
  return { markup, received };
}

test('own and administrator views show the same target progress, best quiz scores, activity, and historical certificates', () => {
  const profile = fixture();
  const own = renderProfile(profile, true);
  const admin = renderProfile(profile, false);
  for (const result of [own, admin]) {
    assert.match(result.markup, /Анна Коваленко/);
    assert.match(result.markup, /<strong>50<small>%<\/small><\/strong>/);
    assert.match(result.markup, /<span class="progressFraction">1 із 2<\/span>/);
    assert.match(result.markup, /Обсяг опрацьованих матеріалів — 35 хв/);
    assert.match(result.markup, /<strong>50%<\/strong><h3>Середній результат/);
    assert.match(result.markup, /<strong>50%<\/strong><h3>Успішно складені тести/);
    assert.match(result.markup, /<strong>2<\/strong><h3>Сертифікати/);
    assert.match(result.markup, /Здобуті відзнаки/);
    assert.deepEqual(result.received.history.modules.map(item => item.moduleId), [1, 2]);
    assert.deepEqual(result.received.history.attempts.map(item => item.id), [3, 2, 1]);
    assert.equal(result.received.history.certificates.length, 2, 'an archived module does not erase an issued certificate');
  }
  assert.deepEqual(admin.received.history.modules, own.received.history.modules);
  assert.deepEqual(admin.received.history.attempts, own.received.history.attempts);
  assert.deepEqual(admin.received.history.certificates, own.received.history.certificates);
  assert.equal(admin.markup.match(/<div class="activityTrack"[\s\S]*?<\/div>/)?.[0], own.markup.match(/<div class="activityTrack"[\s\S]*?<\/div>/)?.[0]);
});

test('foreign profile identity is read-only while the own profile retains photo controls by default', () => {
  const own = renderProfile(fixture());
  const foreign = renderProfile(fixture(), false);
  assert.match(own.markup, /Мій профіль/);
  assert.match(own.markup, /type="file"/);
  assert.match(own.markup, /Змінити фото/);
  assert.match(own.markup, /Видалити/);
  assert.match(foreign.markup, /Профіль користувача/);
  assert.match(foreign.markup, /src="\/api\/uploads\/avatars\/target.png"/);
  assert.doesNotMatch(foreign.markup, /type="file"|Змінити фото|Видалити|Мій профіль/);
  assert.equal(foreign.received.identity.editable, false);
});

test('client profile props contain only presentation fields and public learning history', () => {
  for (const own of [true, false]) {
    const { markup, received } = renderProfile(fixture(), own);
    assert.deepEqual(Object.keys(received.identity.user).sort(), ['avatarUrl', 'department', 'email', 'name', 'position', 'store']);
    assert.doesNotMatch(JSON.stringify(received), /PRIVATE_HR_NOTE|PRIVATE_PHONE|PRIVATE_PASSWORD|passwordHash|notes/);
    assert.doesNotMatch(markup, /PRIVATE_HR_NOTE|PRIVATE_PHONE|PRIVATE_PASSWORD/);
  }
});

test('foreign learning links open materials without learner-directed advice or impersonation', () => {
  const { markup, received } = renderProfile(fixture(), false);
  assert.match(markup, /Матеріал для повторення/);
  assert.match(markup, /href="\/module\/2" class="focus-ring primaryLink">Відкрити матеріал/);
  assert.match(markup, /aria-label="Відкрити матеріал: Потрібне повторення"/);
  assert.match(markup, /Модулі, спроби тестів і збережені сертифікати користувача/);
  assert.doesNotMatch(markup, /Ваш|ваш|Продовжити модуль|Закріпіть|Перегляньте|\/quiz/);
  assert.equal(received.history.isOwnProfile, false);
});

test('an empty target profile remains factual and a missing target renders no personal content', () => {
  const empty = { ...fixture(), publishedModules: [], progressList: [], attempts: [], certificates: [], badges: [], activityDays: [] };
  const { markup } = renderProfile(empty, false);
  assert.match(markup, /<span class="progressFraction">0 із 0<\/span>/);
  assert.match(markup, /Немає поточної серії/);
  assert.match(markup, /Користувач ще не розпочав навчальні модулі/);
  assert.doesNotMatch(markup, /NaN|Infinity|Почнімо навчання|Змінити фото/);
  assert.equal(renderProfile({ ...empty, user: null }, false).markup, '');
});
