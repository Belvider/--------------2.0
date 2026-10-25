const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { parseLearningGuide } = require('../lib/learning-guide.ts');

function loadSource(relative, overrides = {}) {
  const filename = path.resolve(__dirname, '..', relative);
  const installed = Module.createRequire(filename);
  const loaded = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText;
  new Function('require', 'module', 'exports', compiled)(
    request => Object.hasOwn(overrides, request) ? overrides[request] : installed(request), loaded, loaded.exports
  );
  return loaded.exports;
}

const helpers = loadSource('components/admin/AdminModuleEditor.tsx', {
  '@/components/admin/AdminImageField': { AdminImageField: () => null },
  '@/components/admin/LearningGuideEditor': { LearningGuideEditor: () => null }
});
function guide() {
  return { version: 1, reviewedAt: '2026-10-25', objectives: ['Пояснити відмінності версій.'], prerequisites: 'Основи консультації.',
    route: [{ title: 'Основи', anchor: 'module-1-topic-1' }, { title: 'Камери', anchor: 'module-1-topic-2-text-3' }],
    reference: [{ title: 'Сумісність', anchor: 'module-1-topic-3-product-2-spec-1' }],
    sources: [{ id: 'apple', title: 'Apple', url: 'https://support.apple.com/en-us/102659', scope: 'Перенесення даних.', anchors: ['module-1-topic-1', 'module-1-topic-3-product-2'] }],
    video: { title: 'Quick Start', url: 'https://www.youtube.com/watch?v=8UrN8XBP9PE', author: 'Apple Support', summary: ['Підготуйте обидва пристрої.'], exercise: 'Поясніть послідовність.' },
    practice: [{ id: 'switch', title: 'Зміна пристрою', situation: 'Клієнт переходить на інший iPhone.', prompt: 'Які дані потрібно уточнити?', explanation: 'Визначте спосіб перенесення даних і підготуйте пристрої.', sourceIds: ['apple'] }],
    models3d: [{ title: 'Офіційний перегляд', url: 'https://www.apple.com/iphone-18-pro/', variant: 'US/eSIM', note: 'Відкривається на сайті виробника.' }] };
}
const text = (title, metadata) => ({ type: 'text', title, html: '<p>Зміст</p>', ...(metadata ? { learningGuide: metadata } : {}) });
const product = title => ({ slug: title, title, overview: [], highlights: [], colors: [{ label: 'Black', imageUrl: '/black.png', caption: 'Чорний', default: true }] });

test('all editor block types preserve the entire learning guide, including temporarily incomplete drafts', () => {
  const original = guide();
  assert.ok(parseLearningGuide(original, 1));
  const blocks = [
    text('Текст', original), { type: 'facts', title: 'Факти', items: ['Факт'], learningGuide: original },
    { type: 'video', title: 'Відео', url: original.video.url, learningGuide: original },
    { type: 'image', title: 'Фото', url: '/photo.png', learningGuide: original },
    { type: 'pdf', title: 'Документ', url: '/manual.pdf', learningGuide: original },
    { type: 'productCatalog', title: 'Моделі', products: [product('First')], learningGuide: original }
  ];
  const normalized = helpers.normalizeModuleEditorBlocks(blocks);
  for (const block of normalized) assert.deepEqual(block.learningGuide, original);
  const draft = { ...original, objectives: [''], video: { ...original.video, url: '' } };
  assert.equal(parseLearningGuide(draft, 1), null);
  assert.deepEqual(helpers.normalizeModuleEditorBlocks([text('Чернетка', draft)])[0].learningGuide, draft, 'typing must not erase metadata before save validation');
  assert.equal(blocks[0].learningGuide, original, 'normalization never mutates incoming content');
});

test('moving blocks keeps guide routes and sources attached to the same content', () => {
  const first = text('Основи', guide()), second = text('Камери'), third = { type: 'productCatalog', title: 'Моделі', products: [product('A'), product('B')] };
  const reordered = helpers.reorderModuleEditorBlocks([first, second, third], [third, first, second], 1);
  const retained = reordered[1].learningGuide;
  assert.deepEqual(retained.route.map(item => item.anchor), ['module-1-topic-2', 'module-1-topic-3-text-3']);
  assert.equal(retained.reference[0].anchor, 'module-1-topic-1-product-2-spec-1');
  assert.deepEqual(retained.sources[0].anchors, ['module-1-topic-2', 'module-1-topic-1-product-2']);
  assert.equal(first.learningGuide.route[0].anchor, 'module-1-topic-1', 'the saved source draft is not mutated');
});

test('deleting the host transfers its guide, removes only deleted targets, and protects the final host', () => {
  const first = text('Основи', guide()), second = text('Камери'), third = { type: 'productCatalog', title: 'Моделі', products: [product('A'), product('B')] };
  const remaining = helpers.removeModuleEditorBlock([first, second, third], 0, 1);
  assert.equal(remaining.length, 2);
  assert.deepEqual(remaining[0].learningGuide.route.map(item => item.anchor), ['module-1-topic-1-text-3']);
  assert.deepEqual(remaining[0].learningGuide.sources[0].anchors, ['module-1-topic-2-product-2']);
  assert.equal(remaining[0].learningGuide.reference[0].anchor, 'module-1-topic-2-product-2-spec-1');
  assert.deepEqual(remaining[0].learningGuide.video, guide().video);
  const singleton = [first];
  assert.equal(helpers.removeModuleEditorBlock(singleton, 0, 1), singleton, 'the final host cannot silently discard its guide');
});

test('moving and removing products rebinds model-specific routes and sources without touching photos', () => {
  const a = product('A'), b = product('B');
  const blocks = [text('Основи', guide()), text('Камери'), { type: 'productCatalog', title: 'Моделі', products: [a, b] }];
  const moved = helpers.reorderModuleEditorProducts(blocks, 2, [b, a], 1);
  assert.equal(moved[0].learningGuide.reference[0].anchor, 'module-1-topic-3-product-1-spec-1');
  assert.equal(moved[0].learningGuide.sources[0].anchors[1], 'module-1-topic-3-product-1');
  assert.equal(moved[2].products[0], b);
  assert.equal(moved[2].products[0].colors[0].imageUrl, '/black.png');
  const removed = helpers.reorderModuleEditorProducts(blocks, 2, [a], 1);
  assert.deepEqual(removed[0].learningGuide.reference, []);
  assert.deepEqual(removed[0].learningGuide.sources[0].anchors, ['module-1-topic-1']);
});

test('the guide editor provides structured fields for every content section without a JSON textarea', () => {
  const { LearningGuideEditor } = loadSource('components/admin/LearningGuideEditor.tsx');
  const markup = renderToStaticMarkup(React.createElement(LearningGuideEditor, { value: guide(), moduleId: 1, blocks: [text('Основи')], onChange() {} }));
  for (const label of ['Що працівник зможе зробити', 'Попередні знання', 'Маршрут для першого вивчення', 'Швидкий довідник', 'Офіційні джерела', 'Український конспект', 'Практичні сценарії', 'Пояснення відповіді', '3D-перегляди та авторські моделі']) assert.ok(markup.includes(label), label);
  assert.doesNotMatch(markup, /JSON/);
});

function routeFixture(authorized = true) {
  const writes = [], transactions = [];
  const tx = {
    module: { findUnique: async () => ({ id: 1, title: 'Попередній', categoryId: 1, durationMin: 10, sortOrder: 0, isPublished: true }),
      update: async ({ data }) => { writes.push(data); return { id: 1, ...data }; } },
    quizQuestion: { findMany: async () => [] }
  };
  const prisma = { $transaction: async callback => { transactions.push(true); return callback(tx); },
    category: { findUnique: async () => ({ id: 1, name: 'iPhone' }) },
    module: { aggregate: async () => ({ _max: { sortOrder: 0 } }), create: async ({ data }) => { writes.push(data); return { id: 1, ...data }; } } };
  const route = loadSource('app/api/admin/content/route.ts', {
    '@/lib/auth': { requireRole: async roles => { assert.deepEqual(roles, ['ADMIN']); return authorized ? { id: 'admin' } : null; } },
    '@/lib/prisma': { prisma }, '@/lib/admin-audit': { createAdminAuditLog: async () => {}, getRequestIpAddress: () => null }
  });
  const base = { entity: 'module', id: 1, categoryId: 1, title: 'Навчальний модуль', description: 'Опис матеріалу', durationMin: 10, sortOrder: 0, isPublished: true, questions: [] };
  return { writes, transactions, send: (blocks, method = 'PATCH') => route[method](new Request('https://portal.example/api/admin/content', {
    method, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...base, contentBlocks: blocks })
  })) };
}

test('module APIs reject duplicate, unsafe, foreign-module or malformed guide data before content writes', async () => {
  const fixture = routeFixture();
  const invalid = [];
  const duplicate = [text('Перший', guide()), text('Другий', guide())];
  invalid.push(duplicate);
  for (const mutate of [
    value => value.reviewedAt = '2026-02-31', value => value.sources[0].url = 'javascript:alert(1)',
    value => value.route[0].anchor = 'module-2-topic-1', value => value.practice[0].sourceIds = ['missing'],
    value => value.video.url = 'https://unknown.example/embed', value => value.sources.push({ ...value.sources[0] })
  ]) { const data = guide(); mutate(data); invalid.push([text('Матеріал', data)]); }
  for (const blocks of invalid) assert.equal((await fixture.send(blocks)).status, 400);
  assert.equal((await fixture.send(duplicate, 'POST')).status, 400);
  assert.equal((await fixture.send([text('Новий модуль', guide())], 'POST')).status, 400, 'a new module cannot accept references to an existing module before its own ID exists');
  assert.deepEqual(fixture.writes, []);
  assert.deepEqual(fixture.transactions, [], 'invalid metadata never enters the write transaction');
});

test('valid guide JSON round trips through PATCH and POST; legacy modules and role gates still work', async () => {
  const fixture = routeFixture();
  const blocks = [text('Матеріал', guide())];
  assert.equal((await fixture.send(blocks)).status, 200);
  assert.deepEqual(fixture.writes[0].contentBlocks, blocks);
  const unboundGuide = guide(); unboundGuide.route = []; unboundGuide.reference = []; unboundGuide.sources[0].anchors = [];
  const creationBlocks = [text('Новий матеріал', unboundGuide)];
  assert.equal((await fixture.send(creationBlocks, 'POST')).status, 200);
  assert.deepEqual(fixture.writes[1].contentBlocks, creationBlocks);
  assert.equal((await fixture.send([text('Старий модуль')])).status, 200);
  const denied = routeFixture(false);
  assert.equal((await denied.send(blocks)).status, 403);
  assert.equal((await denied.send(blocks, 'POST')).status, 403);
  assert.deepEqual(denied.writes, []);
});
