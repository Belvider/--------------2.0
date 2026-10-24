const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { buildPortalSearchIndex, searchPortalIndex } = require('../lib/portal-search.ts');
const { getModuleBlockAnchor, getProductAnchor, getProductDetailAnchor, prepareSearchableHtml } = require('../lib/content-anchors.ts');

function learningModule(id, blocks, overrides = {}) {
  return { id, title: 'Apple iPhone', description: 'Оберіть пристрій для потреб клієнта.', durationMin: 25, contentBlocks: blocks, isPublished: true,
    category: { name: 'Смартфони', slug: 'phones', brand: { name: 'Apple', slug: 'apple' } }, ...overrides };
}
function fixture() {
  const html = '<h3 id="authored">Безпечний період</h3><p>Унікальна гарантія триває 31 день.</p><table><tr><th>Потужність</th><td>Адаптер 20 Вт</td></tr></table><ul><li>Підмінний телефон на період ремонту</li></ul>';
  const product = title => ({ slug: title.replaceAll(' ', '-'), title, family: 'Pro', summary: 'Для професійної зйомки.',
    overview: ['Екран: 6,3 дюйма', 'Камера: 48 Мп зі змінною діафрагмою'],
    highlights: ['Один', 'Два', 'Три', 'Чотири', 'П’ять', 'Шість', 'Сім', 'Восьмий прихований аргумент'],
    colors: [{ label: 'Glacier', caption: 'Льодовиковий колір', imageUrl: '/not-searchable-private-file.png' }] });
  const blocks = [
    { type: 'text', title: 'Умови обслуговування', html },
    { type: 'facts', title: 'Комплектація', items: ['Безпровідне заряджання MagSafe'] },
    { type: 'image', title: 'Перевірка', caption: 'Фотоприклад стану корпусу', url: '/private-image-token.png' },
    { type: 'productCatalog', title: 'Моделі', products: [product('iPhone 17 Pro'), product('iPhone 17 Pro Max'), product('iPhone X (2017)')] },
    { type: 'text', title: 'Додатково', html: '<div>Винятковий некласифікований фрагмент</div><p>Інший абзац</p><script>секретнийскрипт</script>' },
    { type: 'pdf', title: 'Пам’ятка догляду', url: '/private-pdf-token.pdf' },
    { type: 'video', title: 'Відеоурок розпакування', url: 'https://example.test/private-video-token' }
  ];
  return { blocks, index: buildPortalSearchIndex({ modules: [learningModule(11, blocks), learningModule(12, [], { title: 'Закритийчернетковиймаркер', isPublished: false })] }) };
}

test('search covers paragraph, authored heading, table row and list text with renderer-generated anchors', () => {
  const { blocks, index } = fixture();
  const prepared = prepareSearchableHtml(blocks[0].html, getModuleBlockAnchor(11, 0));
  for (const query of ['Безпечний період', '31 день', 'Адаптер 20 Вт', 'Підмінний телефон']) {
    const response = searchPortalIndex(index, query);
    const fragment = prepared.fragments.find(item => item.text.includes(query));
    assert.ok(fragment, query);
    assert.ok(response.results.some(result => result.href === '/module/11#' + fragment.anchor), query);
    assert.ok(response.results.some(result => result.snippet?.includes(query)), query);
    assert.equal(response.results.some(result => result.href === '/module/11#module-11-topic-1'), false, 'a precise match supersedes aggregate text');
  }
});

test('every matching model remains available even when the module title and several products also match', () => {
  const { index } = fixture();
  const response = searchPortalIndex(index, 'iPhone 17 Pro');
  const products = response.results.filter(result => result.type === 'product');
  assert.deepEqual(products.map(result => result.title), ['iPhone 17 Pro', 'iPhone 17 Pro Max']);
  assert.equal(response.results.some(result => result.title === 'iPhone X (2017)'), false);
  assert.equal(new Set(response.results.map(result => result.href)).size, response.results.length);
});

test('multiword context finds a precise specification, hidden highlight and requested color', () => {
  const { index } = fixture();
  const productAnchor = getProductAnchor(getModuleBlockAnchor(11, 3), 0);
  for (const [query, kind, number] of [['iPhone 17 Pro Камера', 'spec', 1], ['Восьмий прихований', 'highlight', 7], ['Льодовиковий колір', 'color', 0]]) {
    const response = searchPortalIndex(index, query, { limit: 30 });
    assert.ok(response.results.some(result => result.href === '/module/11#' + getProductDetailAnchor(productAnchor, kind, number)), query);
  }
  assert.ok(searchPortalIndex(index, 'айфон17 promax').results.some(result => result.title === 'iPhone 17 Pro Max'));
});

test('facts, captions, document/video titles and otherwise unwrapped visible text remain searchable', () => {
  const { index } = fixture();
  for (const query of ['MagSafe', 'Фотоприклад', 'Пам’ятка догляду', 'Відеоурок', 'некласифікований']) {
    assert.ok(searchPortalIndex(index, query).results.some(result => result.href.startsWith('/module/11#')), query);
  }
  for (const query of ['Закритийчернетковиймаркер', 'секретнийскрипт', 'private-image-token', 'private-pdf-token', 'private-video-token', 'not-searchable-private-file']) {
    assert.equal(searchPortalIndex(index, query).total, 0, query);
  }
});

test('case, apostrophe variants, compact device queries and HTML entities do not lose visible matches', () => {
  const index = buildPortalSearchIndex({ modules: [learningModule(1, [{ type: 'text', title: 'Пам’ять iPhone 17e', html: '<p>Пам&#8217;ять&nbsp;і USB&#45;C: 256 GB.</p>' }])] });
  for (const query of ["пам'ять", 'ПАМʼЯТЬ', 'USB C', 'iphone17е', '256 GB']) assert.ok(searchPortalIndex(index, query).total > 0, query);
  for (const query of ['', ' ', 'x', '%_', '><']) assert.equal(searchPortalIndex(index, query).total, 0);
});

test('pagination exposes all matches past former module/product/result caps with stable, unique order', () => {
  const index = buildPortalSearchIndex({ modules: Array.from({ length: 38 }, (_, i) => learningModule(i + 1, [{ type: 'facts', title: 'Консультація', items: ['Пагінований ключовий факт'] }], { title: `Модуль ${i + 1}` })) });
  const all = [];
  for (let offset = 0; offset < 38; offset += 12) {
    const page = searchPortalIndex(index, 'Пагінований ключовий', { offset, limit: 12 });
    assert.equal(page.total, 38);
    assert.equal(page.hasMore, offset + page.results.length < 38);
    all.push(...page.results);
  }
  assert.equal(all.length, 38);
  assert.equal(new Set(all.map(result => result.href)).size, 38);
  assert.equal(all.at(-1).href, '/module/38#module-38-topic-1-fact-1');
});

function apiFixture({ authenticated = true, fails = false } = {}) {
  const calls = [], modules = [learningModule(1, [{ type: 'facts', title: 'Маяк', items: ['Живий пошуковий маркер'] }])];
  let fail = fails;
  const prisma = {
    module: { findMany: async args => { calls.push(['modules', args]); if (fail) throw Error('sensitive-db-url'); return modules.filter(item => item.isPublished); } },
    brand: { findMany: async () => [] }, category: { findMany: async () => [] }, appSetting: { findMany: async () => [] }
  };
  const cache = new Map();
  function load(relative) {
    const filename = path.resolve(__dirname, '..', relative);
    if (cache.has(filename)) return cache.get(filename).exports;
    const loaded = new Module(filename, module); loaded.filename = filename; loaded.paths = Module._nodeModulePaths(path.dirname(filename)); cache.set(filename, loaded);
    const installed = Module.createRequire(filename);
    loaded.require = request => request === '@/lib/auth' ? { requireUser: async () => authenticated ? { id: 'search-user' } : null }
      : request === '@/lib/prisma' ? { prisma } : request.startsWith('@/') ? load(request.slice(2) + '.ts') : installed(request);
    loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
    return loaded.exports;
  }
  const get = load('app/api/search/route.ts').GET;
  return { calls, modules, recover() { fail = false; }, get: params => get(new Request('http://localhost/api/search?' + params)) };
}

test('search API authenticates first and rejects malformed paging before loading any content', async () => {
  const anonymous = apiFixture({ authenticated: false });
  assert.equal((await anonymous.get('q=Маяк')).status, 401);
  assert.equal(anonymous.calls.length, 0);
  const fixture = apiFixture();
  for (const params of ['q=Маяк&offset=-1', 'q=Маяк&offset=NaN', 'q=Маяк&limit=31', 'q=Маяк&limit=0', 'q=' + 'x'.repeat(161)]) assert.equal((await fixture.get(params)).status, 400);
  const empty = await fixture.get('q=x');
  assert.equal((await empty.json()).total, 0);
  assert.equal(fixture.calls.length, 0);
});

test('API shares a short index snapshot across keystrokes and discovers new publications after expiry', async t => {
  t.mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-24T12:00:00Z') });
  const fixture = apiFixture();
  const first = await fixture.get('q=Живий');
  assert.equal(first.headers.get('cache-control'), 'private, no-store');
  assert.equal((await first.json()).results[0].href, '/module/1#module-1-topic-1-fact-1');
  await fixture.get('q=маркер');
  assert.equal(fixture.calls.length, 1);
  assert.deepEqual(fixture.calls[0][1].where, { isPublished: true });
  assert.equal(fixture.calls[0][1].take, undefined);
  assert.equal(fixture.calls[0][1].select.questions, undefined);
  fixture.modules.push(learningModule(2, [{ type: 'facts', title: 'Новий', items: ['Щойно опублікований маркер'] }]));
  t.mock.timers.tick(10_001);
  const next = await (await fixture.get('q=Щойно')).json();
  assert.ok(next.results.some(result => result.href.startsWith('/module/2#')));
  assert.equal(fixture.calls.length, 2);
});

test('failed search loads return a safe retryable error and do not poison the next index load', async () => {
  const fixture = apiFixture({ fails: true });
  const failed = await fixture.get('q=Живий');
  assert.equal(failed.status, 503);
  assert.doesNotMatch(JSON.stringify(await failed.json()), /sensitive|db-url/);
  fixture.recover();
  const recovered = await fixture.get('q=Живий');
  assert.equal(recovered.status, 200);
  assert.ok((await recovered.json()).total > 0);
});
