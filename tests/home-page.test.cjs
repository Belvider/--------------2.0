const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function homeData(overrides = {}) {
  return {
    totalModules: 3, completedModules: 1, inProgressModules: 1, progressPct: 33,
    continueModule: null, continueModuleProgress: 0, activeDaysLast14: 0,
    assignments: [], newMaterials: [], leaderboard: [], averageQuizScore: null,
    certificatesCount: 0,
    weeklyActivity: Array.from({ length: 7 }, (_, index) => ({
      day: `2026-10-${13 + index}`, modulesCount: 0, isToday: index === 6
    })),
    ...overrides
  };
}

function learningModule(id, title, questions = 3) {
  return { id, title, durationMin: 20, category: { name: 'iPhone', brand: { name: 'Apple' } }, _count: { questions } };
}

function assignment(moduleId, title, overrides = {}) {
  return {
    id: moduleId, moduleId, title, durationMin: 20,
    brand: { name: 'Apple' }, category: { name: 'iPhone' },
    progress: { progressPct: 20 }, dueAt: new Date('2026-10-01T10:00:00Z'),
    isCompleted: false, isOverdue: false, isDueSoon: false, ...overrides
  };
}

async function renderHome(data) {
  const cache = new Map();
  const user = { id: 'home-test-user', name: 'Любарщук Олег', firstName: 'Олег', role: 'SELLER' };
  function load(relative) {
    const filename = path.resolve(__dirname, '..', relative);
    if (cache.has(filename)) return cache.get(filename).exports;
    const loaded = new Module(filename, module);
    loaded.filename = filename;
    loaded.paths = Module._nodeModulePaths(path.dirname(filename));
    cache.set(filename, loaded);
    const installed = Module.createRequire(filename);
    loaded.require = request => {
      if (request === '@/lib/guards') return { requireAuthPageUser: async () => user };
      if (request === '@/lib/queries') return { getDashboardData: async userId => {
        assert.equal(userId, user.id);
        return data;
      } };
      if (request === '@/components/PortalShell') return { PortalShell: ({ children }) => React.createElement('main', null, children) };
      if (request === '@/components/OnboardingModal') return { OnboardingModal: () => null };
      if (request === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
      if (request.endsWith('.module.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
      if (request === '@/lib/prisma') throw new Error('Home SSR tests must not access a database');
      if (request.startsWith('@/')) return load(request.slice(2) + '.ts');
      return installed(request);
    };
    loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true
      }
    }).outputText, filename);
    return loaded.exports;
  }
  return renderToStaticMarkup(await load('app/dashboard/page.tsx').default());
}

function primaryAction(markup) {
  const anchor = markup.match(/<a\b([^>]*class="[^"]*\bprimaryButton\b[^"]*"[^>]*)>([\s\S]*?)<\/a>/);
  assert.ok(anchor, 'the home page must offer one primary learning action');
  return { href: anchor[1].match(/href="([^"]+)"/)?.[1], content: anchor[2] };
}

test('home prioritizes overdue work and removes that module from the remaining assignment list', async () => {
  const markup = await renderHome(homeData({
    continueModule: learningModule(22, 'Останній відкритий модуль'), continueModuleProgress: 70,
    assignments: [
      assignment(33, 'Наступне призначення', { isDueSoon: true }),
      assignment(11, 'Прострочене призначення', { isOverdue: true }),
      assignment(44, 'Вже завершене призначення', { isCompleted: true })
    ]
  }));
  assert.equal(primaryAction(markup).href, '/module/11');
  assert.match(markup, /<h2 class="featureTitle">Прострочене призначення<\/h2>/);
  assert.equal(markup.split('Прострочене призначення').length - 1, 1);
  assert.match(markup, /Призначені вам/);
  assert.match(markup, /href="\/module\/33"/);
  assert.doesNotMatch(markup, /Останній відкритий модуль|Вже завершене призначення/);
});

test('a fully viewed material with questions directs the next action to its quiz', async () => {
  const markup = await renderHome(homeData({
    continueModule: learningModule(22, 'Готовий до тесту матеріал', 3), continueModuleProgress: 100
  }));
  const action = primaryAction(markup);
  assert.equal(action.href, '/module/22/quiz');
  assert.match(action.content, /Перейти до тесту/);
  assert.match(markup, /Матеріал переглянуто\. Залишилося перевірити знання\./);
});

test('a fully viewed material without questions keeps its action on the material page', async () => {
  const markup = await renderHome(homeData({
    continueModule: learningModule(22, 'Матеріал без тесту', 0), continueModuleProgress: 100
  }));
  const action = primaryAction(markup);
  assert.equal(action.href, '/module/22');
  assert.match(action.content, /Продовжити навчання/);
  assert.doesNotMatch(markup, /href="\/module\/22\/quiz"|Перейти до тесту/);
});

test('an empty catalog renders honest zero progress and the no-result state without crashing', async () => {
  const markup = await renderHome(homeData({ totalModules: 0, completedModules: 0, inProgressModules: 0, progressPct: 0 }));
  assert.match(markup, /<h1>Головна<\/h1>/);
  assert.match(markup, /Матеріали незабаром з’являться/);
  assert.equal(primaryAction(markup).href, '/brands');
  assert.match(markup, /<p class="progressDescription">[^<]*0 із 0[^<]*<\/p>/);
  assert.match(markup, /aria-valuenow="0"/);
  assert.match(markup, /Нових матеріалів поки немає\./);
  assert.match(markup, /<p class="statValue">—<\/p><h2>Середній результат<\/h2>/);
  assert.match(markup, /Після першого тесту/);
  assert.doesNotMatch(markup, /NaN|Infinity|Ви завершили всі модулі|Рейтинг команди/);
});

test('a genuine zero quiz result remains visible rather than being treated as an absent result', async () => {
  const markup = await renderHome(homeData({ averageQuizScore: 0 }));
  assert.match(markup, /<p class="statValue">0%<\/p><h2>Середній результат<\/h2>/);
  assert.match(markup, /Найкращі спроби за модулями/);
  assert.doesNotMatch(markup, /Після першого тесту/);
});
