const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { parseLearningGuide, getModuleLearningGuide } = require('../lib/learning-guide.ts');
const { buildPortalSearchIndex, searchPortalIndex } = require('../lib/portal-search.ts');
const { prepareSearchableHtml } = require('../lib/content-anchors.ts');

function guide(overrides = {}) {
  return { version: 1, reviewedAt: '2026-10-25', objectives: ['Пояснити сумісність пристроїв.'], prerequisites: 'Спершу з’ясуйте потребу клієнта.',
    route: [{ title: 'Основи', anchor: 'module-7-topic-1' }], reference: [{ title: 'Сумісність', anchor: 'module-7-topic-1' }],
    sources: [{ id: 'apple-guide', title: 'Інструкція виробника', url: 'https://support.apple.com/en-us/102659', scope: 'Підготовка до перенесення даних.', anchors: ['module-7-topic-1'] }],
    video: { title: 'Перенесення даних', url: 'https://www.youtube.com/watch?v=8UrN8XBP9PE', author: 'Apple Support',
      summary: ['Зробіть резервну копію.', 'Увімкніть Bluetooth на попередньому пристрої.'], exercise: 'Поясніть підготовку покупцю.' },
    practice: [{ id: 'transfer', title: 'Допомога після покупки', situation: 'Покупець змінює телефон.', prompt: 'Що уточнити перед початком?', explanation: 'Власник сам вводить пароль облікового запису.', sourceIds: ['apple-guide'] }],
    models3d: [{ title: 'Огляд корпусу', url: 'https://www.apple.com/iphone-18-pro/', variant: 'US/eSIM', note: 'Зовнішній перегляд у виробника.' }], ...overrides };
}
function components() {
  function load(filename) {
    const installed = Module.createRequire(filename), loaded = { exports: {} };
    const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    new Function('require', 'module', 'exports', compiled)(request => {
      if (!request.startsWith('@/')) return installed(request);
      const target = path.resolve(__dirname, '..', request.slice(2));
      return fs.existsSync(target + '.tsx') ? load(target + '.tsx') : require(target + '.ts');
    }, loaded, loaded.exports);
    return loaded.exports;
  }
  return load(path.resolve(__dirname, '../components/module/ModuleLearningGuide.tsx'));
}

test('legacy blocks remain usable and guide metadata does not change their reading targets', () => {
  const block = { type: 'text', title: 'Основи', html: '<h3>Початок</h3><p>Унікальний фрагмент.</p>' };
  assert.equal(getModuleLearningGuide([block], 7), null);
  const enriched = { ...block, learningGuide: guide() };
  assert.deepEqual(getModuleLearningGuide([enriched], 7), guide());
  assert.deepEqual(prepareSearchableHtml(enriched.html, 'module-7-topic-1'), prepareSearchableHtml(block.html, 'module-7-topic-1'));
});

test('metadata rejects invalid dates, unsafe sources, duplicate identities and cross-module links', () => {
  assert.ok(parseLearningGuide(guide(), 7));
  const invalid = [
    guide({ reviewedAt: '2026-02-30' }), guide({ objectives: [] }),
    guide({ route: [{ title: 'Інший модуль', anchor: 'module-8-topic-1' }] }),
    guide({ sources: [{ ...guide().sources[0], url: 'javascript:alert(1)' }] }),
    guide({ sources: [{ ...guide().sources[0], url: 'https://private:secret@example.com/path' }] }),
    guide({ sources: [...guide().sources, ...guide().sources] }),
    guide({ practice: [{ ...guide().practice[0], sourceIds: ['missing'] }] }),
    guide({ video: { ...guide().video, url: 'https://untrusted.example/arbitrary-frame' } })
  ];
  for (const value of invalid) assert.equal(parseLearningGuide(value, 7), null);
});

test('video notes, objectives and practice explanations have precise searchable targets', () => {
  const index = buildPortalSearchIndex({ modules: [{ id: 7, title: 'Навчання iPhone', description: 'Основи консультації', durationMin: 20, isPublished: true,
    category: { name: 'Телефони', slug: 'phones', brand: { name: 'Apple', slug: 'apple' } },
    contentBlocks: [{ type: 'text', title: 'Основи', html: '<p>Вступ.</p>', learningGuide: guide() }] }] });
  const cases = [
    ['Bluetooth', '/module/7#module-7-guide-video-note-2'],
    ['сумісність пристроїв', '/module/7#module-7-guide-overview-objective-1'],
    ['сам вводить пароль', '/module/7#module-7-guide-practice-transfer-explanation']
  ];
  for (const [query, href] of cases) assert.ok(searchPortalIndex(index, query).results.some(item => item.href === href), query);
  assert.equal(searchPortalIndex(index, '102659').total, 0, 'source URLs are not treated as lesson copy');
});

test('resources keep a readable summary and official fallback without eager third-party frames', () => {
  const { LearningGuideOverview, LearningGuideResources } = components();
  const overview = renderToStaticMarkup(React.createElement(LearningGuideOverview, { guide: guide(), moduleId: 7 }));
  const resources = renderToStaticMarkup(React.createElement(LearningGuideResources, { guide: guide(), moduleId: 7 }));
  assert.match(overview, /Вивчаю вперше/); assert.match(overview, /Швидкий довідник/);
  assert.match(resources, /module-7-guide-video-note-2/);
  assert.match(resources, /module-7-guide-practice-transfer-explanation/);
  assert.match(resources, /Bluetooth/); assert.match(resources, /Відкрити оригінал відео/);
  assert.doesNotMatch(resources, /<iframe|<video|<model-viewer|data-material-permalink/);
  assert.match(resources, /rel="noopener noreferrer"/);
});

test('a video title does not turn unrelated summary notes into duplicate search hits', () => {
  const metadata = guide(); metadata.video.summary = ['Увімкніть Bluetooth.', 'Підготуйте зарядний пристрій.', 'Дочекайтеся завершення.'];
  const index = buildPortalSearchIndex({ modules: [{ id: 7, title: 'Навчання iPhone', description: 'Основи', durationMin: 20,
    category: { name: 'Телефони', slug: 'phones', brand: { name: 'Apple', slug: 'apple' } },
    contentBlocks: [{ type: 'text', title: 'Вступ', html: '<p>Основи.</p>', learningGuide: metadata }] }] });
  assert.deepEqual(searchPortalIndex(index, 'Перенесення даних').results.map(item => item.href), ['/module/7#module-7-guide-video']);
  assert.deepEqual(searchPortalIndex(index, 'Перенесення даних Bluetooth').results.map(item => item.href), ['/module/7#module-7-guide-video-note-1']);
});

test('source references belong to their explicit topic and learner copy is escaped', () => {
  const { LearningGuideResources, LearningSourceReferences } = components();
  assert.equal(renderToStaticMarkup(React.createElement(LearningSourceReferences, { guide: guide(), anchor: 'module-7-topic-2' })), '');
  const source = renderToStaticMarkup(React.createElement(LearningSourceReferences, { guide: guide(), anchor: 'module-7-topic-1' }));
  assert.match(source, /Офіційні джерела/); assert.match(source, /25\.10\.2026/);
  const metadata = guide(); metadata.practice[0].situation = '<img src=x onerror=alert(1)>';
  const html = renderToStaticMarkup(React.createElement(LearningGuideResources, { guide: metadata, moduleId: 7 }));
  assert.doesNotMatch(html, /<img/); assert.match(html, /&lt;img/);
});

test('the published iPhone pilot covers all existing models without changing block positions', () => {
  const content = require('../lib/content/apple-iphone.ts');
  const metadata = require('../content/learning-guides/iphone.json');
  for (const [moduleId, blocks, count] of [[1, content.iphoneFoundationBlocks, 12], [2, content.iphoneCatalogBlocks, 5]]) {
    assert.equal(blocks.length, count);
    const value = getModuleLearningGuide(blocks, moduleId);
    assert.deepEqual(value, metadata[String(moduleId)]);
    const targets = [...value.route, ...value.reference, ...value.sources.flatMap(source => source.anchors.map(anchor => ({ anchor })))];
    for (const { anchor } of targets) {
      const match = anchor.match(/-topic-(\d+)(?:-product-(\d+))?/);
      const block = blocks[Number(match[1]) - 1]; assert.ok(block, anchor);
      if (match[2]) assert.ok(block.type === 'productCatalog' && block.products[Number(match[2]) - 1], anchor);
    }
    blocks.forEach((block, index) => {
      if (block.type !== 'productCatalog') return;
      for (let productIndex = 0; productIndex < block.products.length; productIndex++) {
        const anchor = `module-${moduleId}-topic-${index + 1}-product-${productIndex + 1}`;
        assert.ok(value.sources.some(source => source.anchors.includes(anchor)), block.products[productIndex].title);
      }
    });
  }
  assert.equal(content.iphoneProductCatalog.length, 24);
});
