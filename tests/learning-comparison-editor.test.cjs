const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { parseLearningGuide, getLearningGuideAnchor } = require('../lib/learning-guide.ts');

function comparison() {
  return { id: 'camera-choice', title: 'Дві моделі для зйомки', question: 'Яке наближення потрібне покупцю?',
    left: { title: 'Модель A', anchor: 'module-2-topic-2-product-1' }, right: { title: 'Модель B', anchor: 'module-2-topic-2-product-2' },
    rows: [{ id: 'camera', label: 'Камера', left: 'Основна камера', right: 'Основна й телефото' },
      { id: 'display', label: 'Екран', left: 'Менша діагональ', right: 'Більша діагональ' }],
    takeaway: 'Зіставте наближення та зручність корпусу з потребою покупця.', sourceIds: ['apple'] };
}
function guide(withComparison = true) {
  return { version: 1, reviewedAt: '2026-10-27', objectives: ['Пояснити відмінності моделей.'], prerequisites: 'Основи консультації.', route: [], reference: [],
    sources: [{ id: 'apple', title: 'Apple', url: 'https://www.apple.com/iphone/compare/', scope: 'Параметри моделей.', anchors: ['module-2-topic-2'] },
      { id: 'other', title: 'Apple Support', url: 'https://support.apple.com/en-us/108044', scope: 'Визначення моделі.', anchors: [] }],
    practice: [{ id: 'consultation', title: 'Підбір пристрою', situation: 'Покупець порівнює телефони.', prompt: 'Що уточните?', explanation: 'Уточніть сценарій використання.', sourceIds: ['apple'] }],
    ...(withComparison ? { comparisons: [comparison()] } : {}) };
}
function loadSource(relative, overrides = {}) {
  const filename = path.resolve(__dirname, '..', relative), installed = Module.createRequire(filename), loaded = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText;
  new Function('require', 'module', 'exports', compiled)(request => Object.hasOwn(overrides, request) ? overrides[request] : installed(request), loaded, loaded.exports);
  return loaded.exports;
}
const helpers = loadSource('components/admin/AdminModuleEditor.tsx', {
  '@/components/admin/AdminImageField': { AdminImageField: () => null },
  '@/components/admin/LearningGuideEditor': { LearningGuideEditor: () => null }
});
const text = (metadata) => ({ type: 'text', title: 'Основи', html: '<p>Матеріал</p>', ...(metadata ? { learningGuide: metadata } : {}) });
const product = title => ({ slug: title, title, overview: [], highlights: [], colors: [] });
const blocks = metadata => [text(metadata), { type: 'productCatalog', title: 'Моделі', products: [product('a'), product('b')] }];

test('comparison and practice extensions are optional, bounded and refer to sources from the same guide', () => {
  const legacy = guide(false); assert.deepEqual(parseLearningGuide(legacy, 2), legacy);
  const data = guide(); Object.assign(data.practice[0], { questions: ['Який сценарій?', 'Який розмір зручний?'], demonstration: 'Дайте потримати обидві моделі.', pitfall: 'Не обирайте лише за назвою.' });
  assert.deepEqual(parseLearningGuide(data, 2), data);
  assert.equal(getLearningGuideAnchor(2, 'comparison', 'camera-choice'), 'module-2-guide-comparison-camera-choice');
  for (const mutate of [
    value => value.comparisons[0].left.anchor = 'module-3-topic-2-product-1',
    value => value.comparisons[0].right.anchor = 'javascript:alert(1)',
    value => value.comparisons[0].left.title = 'x'.repeat(101),
    value => value.comparisons[0].sourceIds = ['missing-source'],
    value => value.comparisons[0].sourceIds = Array(9).fill('apple'),
    value => value.comparisons[0].rows.pop(),
    value => value.comparisons[0].rows = Array.from({ length: 6 }, (_, i) => ({ id: 'row-'+i, label: 'Параметр', left: 'A', right: 'B' })),
    value => value.comparisons[0].rows[1].id = value.comparisons[0].rows[0].id,
    value => value.comparisons[0].rows[0].right = ' ',
    value => value.comparisons[0].rows[0].left = 'x'.repeat(281),
    value => value.comparisons.push(structuredClone(value.comparisons[0])),
    value => value.comparisons = Array.from({ length: 5 }, (_, i) => ({ ...comparison(), id: 'comparison-'+i })),
    value => value.practice[0].questions = Array(4).fill('Запитання'),
    value => value.practice[0].questions = ['x'.repeat(181)],
    value => value.practice[0].demonstration = 'x'.repeat(401),
    value => value.practice[0].pitfall = '',
    value => value.practice[0].pitfall = 'x'.repeat(301)
  ]) {
    const invalid = structuredClone(data); mutate(invalid);
    assert.equal(parseLearningGuide(invalid, 2), null, JSON.stringify(invalid));
  }
});

test('editor normalization and moving targets preserve comparison identities and optional practice copy', () => {
  const data = guide(); data.practice[0].questions = ['Що важливо покупцю?'];
  const original = blocks(data), next = helpers.reorderModuleEditorProducts(original, 1, [original[1].products[1], original[1].products[0]], 2);
  assert.equal(next[0].learningGuide.comparisons[0].left.anchor, 'module-2-topic-2-product-2');
  assert.equal(next[0].learningGuide.comparisons[0].right.anchor, 'module-2-topic-2-product-1');
  assert.deepEqual(next[0].learningGuide.comparisons[0].rows, data.comparisons[0].rows, 'row IDs stay stable after a product move');
  assert.equal(original[0].learningGuide.comparisons[0].left.anchor, 'module-2-topic-2-product-1', 'incoming data is never mutated');
  const reordered = helpers.reorderModuleEditorBlocks(original, [original[1], original[0]], 2);
  assert.equal(reordered[1].learningGuide.comparisons[0].left.anchor, 'module-2-topic-1-product-1');
  const removed = helpers.reorderModuleEditorProducts(original, 1, [original[1].products[0]], 2);
  assert.deepEqual(removed[0].learningGuide.comparisons, [], 'a comparison loses no meaning by retaining a deleted endpoint');
  assert.deepEqual(removed[0].learningGuide.practice[0].questions, data.practice[0].questions);
  const draft = guide(); draft.comparisons[0].title = '';
  assert.equal(parseLearningGuide(draft, 2), null);
  assert.deepEqual(helpers.normalizeModuleEditorBlocks(blocks(draft))[0].learningGuide, draft, 'an incomplete edit survives until save validation');
  assert.equal(Object.hasOwn(helpers.remapEditorGuideTargets(blocks(guide(false)), a=>a)[0].learningGuide, 'comparisons'), false, 'legacy shape remains unchanged');
});

function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!React.isValidElement(node)) return [];
  return [node, ...elements(node.props.children)];
}
function editorHarness(initial) {
  const { LearningGuideEditor } = loadSource('components/admin/LearningGuideEditor.tsx', { react: { ...React, useState: value => [value, ()=>{}] } });
  let value = initial;
  const render = () => elements(LearningGuideEditor({ value, moduleId: 2, blocks: blocks(value), onChange: next => { value = next; } }));
  return { render, get value() { return value; },
    button(label, index = 0) { return render().filter(element => element.type === 'button' && element.props.children === label)[index]; },
    field(label, index = 0) { return render().filter(element => element.props.label === label)[index]; }
  };
}

test('removing a source removes its comparison and practice references, preserving every other field', () => {
  const editor = editorHarness(guide());
  const before = structuredClone(editor.value.comparisons[0]);
  editor.button('Прибрати джерело', 0).props.onClick();
  assert.deepEqual(editor.value.comparisons[0], { ...before, sourceIds: [] });
  assert.deepEqual(editor.value.practice[0].sourceIds, []);
  assert.deepEqual(editor.value.sources.map(source=>source.id), ['other']);
  assert.ok(parseLearningGuide(editor.value, 2));
});

test('structured comparison editing keeps row IDs stable and stores optional consultation fields', () => {
  const editor = editorHarness(guide(false));
  editor.button('Додати порівняння').props.onClick();
  const identity = editor.value.comparisons[0].id, rows = editor.value.comparisons[0].rows.map(row=>row.id);
  editor.field('Назва порівняння').props.onChange('Моделі для зйомки');
  editor.field('Запит покупця').props.onChange('Яке наближення потрібне?');
  editor.field('Назва моделі', 0).props.onChange('Модель A');
  editor.field('Назва моделі', 1).props.onChange('Модель B');
  for (let i = 0; i < 2; i++) {
    editor.field('Що порівнюємо', i).props.onChange(i ? 'Розмір' : 'Камера');
    editor.field('Значення першої моделі', i).props.onChange('Параметр A');
    editor.field('Значення другої моделі', i).props.onChange('Параметр B');
  }
  editor.field('Як пояснити вибір').props.onChange('Порівняйте за сценарієм покупця.');
  editor.field('Запитання до покупця (необов’язково)').props.onChange('Що ви знімаєте?\nЯкий розмір зручний?');
  editor.field('Що показати покупцю (необов’язково)').props.onChange('Покажіть однакову сцену.');
  editor.field('Типова помилка (необов’язково)').props.onChange('Порівнювати лише за назвою.');
  assert.equal(editor.value.comparisons[0].id, identity);
  assert.deepEqual(editor.value.comparisons[0].rows.map(row=>row.id), rows);
  assert.deepEqual(editor.value.practice[0].questions, ['Що ви знімаєте?', 'Який розмір зручний?']);
  assert.equal(editor.value.practice[0].demonstration, 'Покажіть однакову сцену.');
  assert.equal(editor.value.practice[0].pitfall, 'Порівнювати лише за назвою.');
  assert.ok(parseLearningGuide(editor.value, 2));
  editor.button('Додати відмінність').props.onClick();
  const newRow = editor.value.comparisons[0].rows[2].id;
  assert.ok(newRow && !rows.includes(newRow));
  editor.button('Прибрати рядок', 2).props.onClick();
  assert.deepEqual(editor.value.comparisons[0].rows.map(row=>row.id), rows);
  editor.field('Що показати покупцю (необов’язково)').props.onChange('');
  editor.field('Типова помилка (необов’язково)').props.onChange('');
  editor.field('Запитання до покупця (необов’язково)').props.onChange('');
  assert.ok(parseLearningGuide(editor.value, 2));
  editor.button('Прибрати порівняння').props.onClick();
  assert.deepEqual(editor.value.comparisons, []);
});

function routeFixture() {
  const writes = [], transactions = [];
  const tx = {
    module: { findUnique: async () => ({ id: 2, title: 'Моделі', categoryId: 1, durationMin: 10, sortOrder: 0, isPublished: true }),
      update: async ({ data }) => { writes.push(data); return { id: 2, ...data }; } },
    quizQuestion: { findMany: async () => [] }
  };
  const prisma = { $transaction: async callback => { transactions.push(true); return callback(tx); },
    category: { findUnique: async () => ({ id: 1, name: 'iPhone' }) },
    module: { aggregate: async () => ({ _max: { sortOrder: 0 } }), create: async ({ data }) => { writes.push(data); return { id: 2, ...data }; } } };
  const route = loadSource('app/api/admin/content/route.ts', {
    '@/lib/auth': { requireRole: async () => ({ id: 'admin' }) }, '@/lib/prisma': { prisma },
    '@/lib/admin-audit': { createAdminAuditLog: async () => {}, getRequestIpAddress: () => null }
  });
  const base = { entity: 'module', id: 2, categoryId: 1, title: 'Моделі iPhone', description: 'Вибір моделі за сценарієм', durationMin: 10, sortOrder: 0, isPublished: true, questions: [] };
  return { writes, transactions, send: (metadata, method = 'PATCH') => route[method](new Request('https://portal.example/api/admin/content', {
    method, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...base, contentBlocks: blocks(metadata) })
  })) };
}

test('comparison-only links cannot be assigned before a new module has an ID', async () => {
  const fixture = routeFixture(), data = guide();
  data.sources.forEach(source => { source.anchors = []; });
  assert.ok(parseLearningGuide(data), 'only comparison endpoints are bound to the existing module');
  assert.equal((await fixture.send(data, 'POST')).status, 400);
  assert.deepEqual(fixture.writes, []);
  assert.deepEqual(fixture.transactions, []);
  data.comparisons = [];
  assert.equal((await fixture.send(data, 'POST')).status, 200, 'unbound guides remain valid for a new module');
  assert.deepEqual(fixture.writes[0].contentBlocks[0].learningGuide, data);
});

test('PATCH validates comparison endpoints and consultation extensions before writes and preserves valid fields', async () => {
  const fixture = routeFixture();
  for (const mutate of [
    value => value.comparisons[0].right.anchor = 'module-3-topic-2-product-1',
    value => value.comparisons[0].sourceIds = ['missing'],
    value => value.comparisons[0].rows[1].id = value.comparisons[0].rows[0].id,
    value => value.practice[0].questions = ['x'.repeat(181)],
    value => value.practice[0].demonstration = 'x'.repeat(401)
  ]) {
    const data = guide(); mutate(data);
    assert.equal((await fixture.send(data)).status, 400);
  }
  assert.deepEqual(fixture.writes, []);
  assert.deepEqual(fixture.transactions, [], 'invalid guide data is rejected before the write transaction');
  const data = guide();
  Object.assign(data.practice[0], { questions: ['Що потрібно покупцю?'], demonstration: 'Покажіть однакову сцену.', pitfall: 'Обирати лише за назвою.' });
  assert.equal((await fixture.send(data)).status, 200);
  assert.deepEqual(fixture.writes[0].contentBlocks[0].learningGuide, data);
  assert.equal(fixture.transactions.length, 1);
});
