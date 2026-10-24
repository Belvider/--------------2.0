const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function sourceLoader() {
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
      if (request === '@/components/PortalShell') return { PortalShell: ({ children }) => React.createElement('main', null, children) };
      if (request === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
      if (request === '@/lib/prisma') throw Error('Portal search coverage tests must not access a database');
      if (request.startsWith('@/')) {
        const target = request.slice(2);
        return load(target + (fs.existsSync(path.resolve(__dirname, '..', target + '.tsx')) ? '.tsx' : '.ts'));
      }
      return installed(request);
    };
    loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
    }).outputText, filename);
    return loaded.exports;
  }
  return load;
}

function verifyIndexedTargets(content) {
  const load = sourceLoader();
  const { PortalContentPage } = load('components/portal/PortalContentPage.tsx');
  const { buildPortalSearchIndex, searchPortalIndex } = load('lib/portal-search.ts');
  const markup = renderToStaticMarkup(React.createElement(PortalContentPage, {
    user: { id: 'search-coverage-user', name: 'Навчальний користувач', role: 'SELLER' }, content
  }));
  const index = buildPortalSearchIndex({ modules: [], portalPages: [content] });
  const targeted = index.filter(entry => entry.result.href.includes('#'));
  assert.equal(targeted.length, content.cards.reduce((count, card) => count + 1 + card.items.length, 0));
  for (const entry of targeted) {
    const anchor = decodeURIComponent(entry.result.href.split('#')[1]);
    const escaped = anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    assert.equal([...markup.matchAll(new RegExp(`\\bid="${escaped}"`, 'g'))].length, 1, `${entry.result.href} must have exactly one rendered target`);
    assert.match(markup, new RegExp(`<(?:article|li)\\b[^>]*id="${escaped}"[^>]*tabindex="-1"`), `${entry.result.href} must permit keyboard focus after navigation`);
  }
  return { markup, index, searchPortalIndex };
}

for (const slug of ['services', 'credits', 'accessories']) {
  test(`every searchable ${slug} overview card and item has a rendered focus target`, () => {
    const { getDefaultPortalPageContent } = sourceLoader()('lib/portal-pages.ts');
    verifyIndexedTargets(getDefaultPortalPageContent(slug));
  });
}

test('administrator-edited overview content receives exact search targets without relying on its labels or stored card IDs', () => {
  const { getDefaultPortalPageContent } = sourceLoader()('lib/portal-pages.ts');
  const content = getDefaultPortalPageContent('services');
  content.cards = [{
    id: 'custom-imported-card-id', title: 'Новий розділ & консультація', icon: 'messages-square',
    text: 'Оновлена інструкція для команди.', items: ['Унікальний пункт про перенесення контактів', 'Новий пункт про синхронізацію даних'],
    imageUrl: '', imageAlt: '', href: '/module/123'
  }];
  const { markup, index, searchPortalIndex } = verifyIndexedTargets(content);
  const response = searchPortalIndex(index, 'перенесення контактів');
  assert.equal(response.total, 1);
  assert.equal(response.results[0].href, '/services#portal-services-card-1-item-1');
  assert.match(markup, /Новий розділ &amp; консультація/);
  assert.match(markup, /href="\/module\/123"/);
  assert.doesNotMatch(markup, /id="custom-imported-card-id"/);
});
