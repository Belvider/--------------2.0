const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { parseLearningGuide, getLearningGuideAnchor } = require('../lib/learning-guide.ts');
const { buildPortalSearchIndex, searchPortalIndex } = require('../lib/portal-search.ts');

function load(filename) {
  const installed = Module.createRequire(filename), loaded = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true
  } }).outputText;
  new Function('require', 'module', 'exports', compiled)(request => {
    if (!request.startsWith('@/')) return installed(request);
    const target = path.resolve(__dirname, '..', request.slice(2));
    return fs.existsSync(target + '.tsx') ? load(target + '.tsx') : require(target + '.ts');
  }, loaded, loaded.exports);
  return loaded.exports;
}
function fixture(metadata) {
  return { modules: [{ id: 2, title: 'Apple iPhone', description: 'Консультація покупця', durationMin: 20, isPublished: true,
    category: { name: 'iPhone', slug: 'iphone', brand: { name: 'Apple', slug: 'apple' } },
    contentBlocks: [{ type: 'text', title: 'Вступ', html: '<p>Основи консультації.</p>', learningGuide: metadata }],
    questions: [{ question: 'Неопубліковане запитання', correctAnswer: 'secretquizanswer7549', options: ['secretquizoption3497'] }] }] };
}
const guide = () => structuredClone(require('../content/learning-guides/iphone.json')['2']);
const href = anchor => `/module/2#${anchor}`;
const results = (metadata, query) => searchPortalIndex(buildPortalSearchIndex(fixture(metadata)), query, { limit: 30 }).results;

test('all comparison and consultation search fragments are unique, rendered and addressable', () => {
  const metadata = guide(); assert.ok(parseLearningGuide(metadata, 2));
  assert.equal(metadata.comparisons.length, 4); assert.equal(metadata.practice.length, 4);
  const { LearningGuideResources } = load(path.resolve(__dirname, '../components/module/ModuleLearningGuide.tsx'));
  const html = renderToStaticMarkup(React.createElement(LearningGuideResources, { guide: metadata, moduleId: 2 }));
  const rendered = [...html.matchAll(/data-material-anchor="([^"]+)"/g)].map(match => match[1]);
  assert.equal(rendered.length, new Set(rendered).size, 'every target ID is unique');
  const index = buildPortalSearchIndex(fixture(metadata));
  const indexed = index.filter(entry => /^module-2-guide-(comparison|practice)-/.test(String(entry.result.id)));
  for (const entry of indexed) {
    assert.ok(rendered.includes(String(entry.result.id)), entry.result.href);
    assert.equal(entry.result.href, href(String(entry.result.id)));
  }
  for (const comparison of metadata.comparisons) {
    const base = getLearningGuideAnchor(2, 'comparison', comparison.id);
    for (const suffix of ['', '-question', '-takeaway', ...comparison.rows.map(row => `-row-${row.id}`)]) {
      assert.ok(indexed.some(entry => entry.result.id === base + suffix), base + suffix);
    }
    assert.ok(html.includes(`href="#${comparison.left.anchor}"`));
    assert.ok(html.includes(`href="#${comparison.right.anchor}"`));
  }
  for (const item of metadata.practice) {
    const base = getLearningGuideAnchor(2, 'practice', item.id);
    for (const suffix of ['-demonstration', '-pitfall', ...item.questions.map((_, index) => `-question-${index + 1}`)]) {
      assert.ok(indexed.some(entry => entry.result.id === base + suffix), base + suffix);
    }
  }
  assert.doesNotMatch(html, /<iframe|<video|<model-viewer|data-material-permalink|<details[^>]*\sopen(?:=|\s|>)/);
});

test('a comparison searches the requested model column without borrowing its neighbour’s feature', () => {
  const metadata = guide();
  const base = 'module-2-guide-comparison-16e-and-17e';
  assert.equal(results(metadata, 'iPhone 17e MagSafe')[0]?.href, href(`${base}-row-charging`));
  assert.equal(results(metadata, 'iPhone 16e Qi')[0]?.href, href(`${base}-row-charging`));
  assert.equal(results(metadata, 'iPhone 16e MagSafe').some(item => item.href.startsWith(href(base))), false);
  const battery = 'module-2-guide-comparison-17-and-17-pro-row-video-battery';
  assert.ok(results(metadata, 'iPhone 17 Pro 31').some(item => item.href === href(battery)));
  assert.equal(results(metadata, 'iPhone 17 Pro 30').some(item => item.href === href(battery)), false);
  const camera = 'module-2-guide-comparison-15-pro-and-pro-max-row-telephoto';
  assert.ok(results(metadata, 'iPhone 15 Pro Max 5×').some(item => item.href === href(camera)));
  assert.equal(results(metadata, 'iPhone 15 Pro Max 3×').some(item => item.href === href(camera)), false);
  assert.ok(results(metadata, 'iPhone 16e iPhone 17e MagSafe').some(item => item.href === href(`${base}-row-charging`)), 'an explicit two-model comparison can cover the difference');
});

test('a precise row outranks its comparison and keeps its URL after row reordering', () => {
  const metadata = guide(), base = 'module-2-guide-comparison-16e-and-17e';
  const before = results(metadata, 'iPhone 16e 128 GB');
  assert.equal(before[0]?.href, href(`${base}-row-storage`));
  assert.equal(before.some(item => item.href === href(base)), false, 'a matching row replaces its aggregate');
  metadata.comparisons[0].rows.reverse();
  assert.equal(results(metadata, 'iPhone 16e 128 ГБ')[0]?.href, href(`${base}-row-storage`));
  const index = buildPortalSearchIndex(fixture(metadata));
  const row = index.find(entry => entry.result.id === `${base}-row-storage`);
  assert.match(row.original, /iPhone 16e/); assert.match(row.original, /iPhone 17e/);
});

test('a comparison remains discoverable by its complete authored heading', () => {
  const metadata = guide();
  for (const item of metadata.comparisons) {
    assert.equal(results(metadata, item.title)[0]?.href, href(getLearningGuideAnchor(2, 'comparison', item.id)), item.title);
  }
});

test('questions, hands-on demonstrations and common mistakes open their own precise fragments', () => {
  const metadata = guide();
  for (const item of metadata.practice) {
    const base = getLearningGuideAnchor(2, 'practice', item.id);
    const fields = [
      ...item.questions.map((question, index) => [`-question-${index + 1}`, question]),
      ['-demonstration', item.demonstration], ['-pitfall', item.pitfall]
    ];
    for (const [suffix, value] of fields) {
      assert.ok(value, `${base}${suffix}`);
      const matches = results(metadata, value);
      assert.ok(matches.some(result => result.href === href(base + suffix)), `${base}${suffix}: ${value}`);
      assert.equal(matches.some(result => result.href === href(base)), false, 'the exact field replaces its practice container');
    }
  }
});

test('source URLs and quiz material never become consultation search text', () => {
  const metadata = guide();
  metadata.sources[0].url = 'https://support.apple.com/secreturl7549';
  metadata.sources[0].title = 'secretsourcetitle2498';
  for (const query of ['secreturl7549', 'secretsourcetitle2498', 'secretquizanswer7549', 'secretquizoption3497', 'Неопубліковане запитання']) {
    assert.equal(results(metadata, query).length, 0, query);
  }
});

test('legacy guides without comparisons or optional practice fields retain their original targets', () => {
  const metadata = guide(); delete metadata.comparisons;
  for (const item of metadata.practice) { delete item.questions; delete item.demonstration; delete item.pitfall; }
  assert.ok(parseLearningGuide(metadata, 2));
  const index = buildPortalSearchIndex(fixture(metadata));
  assert.equal(index.some(entry => String(entry.result.id).includes('-guide-comparison-')), false);
  for (const item of metadata.practice) {
    const base = getLearningGuideAnchor(2, 'practice', item.id);
    assert.ok(index.some(entry => entry.result.id === base));
    assert.ok(index.some(entry => entry.result.id === `${base}-explanation`));
    assert.equal(index.some(entry => String(entry.result.id).startsWith(`${base}-question-`)), false);
  }
});
