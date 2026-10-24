const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPortalSearchIndex, searchPortalIndex } = require('../lib/portal-search.ts');

function learningModule(id, blocks) {
  return { id, title: 'Apple iPhone: моделі та технології', description: 'Матеріали для консультації.', durationMin: 20,
    isPublished: true, contentBlocks: blocks, category: { name: 'Смартфони', slug: 'phones', brand: { name: 'Apple', slug: 'apple' } } };
}

function device(title, overrides = {}) {
  return { title, slug: title.toLowerCase().replaceAll(' ', '-'), family: 'Pro',
    summary: 'Професійна зйомка та щоденне користування.',
    overview: ['Екран: ProMotion 120 Гц', 'Основна камера: 48 Мп'],
    highlights: ['Чип A17 Pro, 18 годин роботи'], colors: [], ...overrides };
}

function catalog() {
  return buildPortalSearchIndex({ modules: [learningModule(2, [{ type: 'productCatalog', title: 'Усі моделі iPhone', products: [
    device('iPhone 17'), device('iPhone 17 Pro'), device('iPhone 17 Pro Max'), device('iPhone 18 Pro / iPhone 18 Pro Max (2026)'),
    device('iPhone 15 Pro / iPhone 15 Pro Max'), device('iPhone X (2017)', { highlights: ['Face ID і бездротове заряджання'] })
  ] }])] });
}

test('a named iPhone model is matched by its title, not a chip, launch year, family or ProMotion', () => {
  const index = catalog();
  const found = searchPortalIndex(index, 'iPhone 17 Pro', { limit: 30 });
  assert.deepEqual(found.results.filter(item => item.type === 'product').map(item => item.title), ['iPhone 17 Pro', 'iPhone 17 Pro Max']);
  assert.ok(found.results.every(item => /iPhone 17 Pro(?: Max)?$/.test(item.title)), JSON.stringify(found.results));
  assert.equal(found.results.some(item => /-(?:spec|highlight)-/.test(item.href)), false, 'model-only search does not flood the result list with incidental model tokens');
  const latest = searchPortalIndex(index, 'iphone18', { limit: 30 });
  assert.deepEqual(latest.results.filter(item => item.type === 'product').map(item => item.title), ['iPhone 18 Pro / iPhone 18 Pro Max (2026)']);
  assert.equal(latest.results.some(item => item.title.includes('iPhone 17')), false, '18 hours of use is not iPhone 18');
});

test('a requested feature belongs to the named model and aliases keep the same exact model intent', () => {
  const index = catalog();
  const found = searchPortalIndex(index, 'iPhone 17 Pro камер', { limit: 30 });
  assert.equal(found.total, 2);
  assert.ok(found.results.every(item => /iPhone 17 Pro(?: Max)?$/.test(item.title) && item.meta === 'Характеристика'));
  assert.ok(found.results.every(item => item.snippet.includes('камера')));
  const compact = searchPortalIndex(index, 'айфон17 promax', { limit: 30 });
  assert.equal(compact.total, 1);
  assert.equal(compact.results[0].title, 'iPhone 17 Pro Max');
  for (const query of ['айфон 17 про макс', 'айфон17промакс']) {
    const translated = searchPortalIndex(index, query, { limit: 30 });
    assert.equal(translated.total, 1, query);
    assert.equal(translated.results[0].title, 'iPhone 17 Pro Max', query);
  }
  const explicit = searchPortalIndex(index, 'iPhone 15 Pro Max', { limit: 30 });
  assert.ok(explicit.results.some(item => item.type === 'product' && item.title === 'iPhone 15 Pro / iPhone 15 Pro Max'));
});

test('comparison rows require an explicit model rather than collecting identifiers from a broad heading', () => {
  const index = buildPortalSearchIndex({ modules: [learningModule(1, [{ type: 'text', title: 'Лінійка iPhone', html: `
    <h3>Моделі та екрани</h3><table>
      <tr><th>Базова / Plus</th><td>iPhone 17: ProMotion, екран 120 Гц</td></tr>
      <tr><th>iPhone 17 Pro</th><td>Основна камера 48 Мп</td></tr>
      <tr><th>iPhone X (2017)</th><td>Камера та екран</td></tr>
    </table>` }])] });
  const found = searchPortalIndex(index, 'iPhone 17 Pro', { limit: 30 });
  assert.equal(found.total, 1);
  assert.match(found.results[0].snippet, /iPhone 17 Pro Основна камера/);
  assert.equal(searchPortalIndex(index, 'iPhone 17 Pro екран').total, 0);
});

test('feature search uses one local model heading and rejects mixed-model headings and cross-paragraph aggregates', () => {
  const index = buildPortalSearchIndex({ modules: [learningModule(4, [
    { type: 'text', title: 'Порівняння', html: '<p>iPhone 17 Pro: екран 120 Гц.</p><p>iPhone 18 Pro: основна камера 48 Мп.</p>' },
    { type: 'text', title: 'Окрема модель', html: '<h3>iPhone 17 Pro</h3><p>Камера зі стабілізацією та наближенням.</p>' },
    { type: 'text', title: 'Різні покоління', html: '<h3>iPhone 17 Pro / iPhone 18 Pro</h3><p>Спільна камера для порівняння.</p>' }
  ])] });
  const found = searchPortalIndex(index, 'iPhone 17 Pro камер', { limit: 30 });
  assert.equal(found.total, 1);
  assert.equal(found.results[0].href, '/module/4#module-4-topic-2-text-2');
});

test('all requested model features must occur in the same own unit, not in unrelated ancestor headings', () => {
  const index = buildPortalSearchIndex({ modules: [learningModule(44, [{ type: 'productCatalog', title: 'Камера і консультація', products: [
    device('iPhone 17 Pro', { overview: ['Основна камера: 48 Мп', 'Пам’ять: 48 GB'], highlights: [] })
  ] }])] });
  const found = searchPortalIndex(index, 'iPhone 17 Pro камер 48', { limit: 30 });
  assert.equal(found.total, 1);
  assert.equal(found.results[0].href, '/module/44#module-44-topic-1-product-1-spec-1');
});

test('the same product card can name two generations without losing the second model', () => {
  const index = buildPortalSearchIndex({ modules: [learningModule(5, [{ type: 'productCatalog', title: 'Порівняння моделей', products: [device('iPhone 16 / iPhone 17')] }])] });
  assert.equal(searchPortalIndex(index, 'iPhone 16').results[0]?.type, 'product');
  assert.equal(searchPortalIndex(index, 'iPhone 17').results[0]?.type, 'product');
});

test('general partial Ukrainian terms, chip names and exact numeric tokens stay searchable', () => {
  const index = catalog();
  assert.ok(searchPortalIndex(index, 'камер').total >= 6);
  assert.ok(searchPortalIndex(index, 'A17 Pro').total >= 5);
  assert.equal(searchPortalIndex(index, '17').results.some(item => item.title === 'iPhone X (2017)'), false);
  assert.ok(searchPortalIndex(index, '2017').results.some(item => item.title === 'iPhone X (2017)'));
});

test('Ukrainian edition aliases apply only next to an explicit iPhone generation', () => {
  const { tokenizeSearchQuery } = require('../lib/search-query.ts');
  assert.deepEqual(tokenizeSearchQuery('айфон17про'), ['iphone', '17', 'pro']);
  assert.deepEqual(tokenizeSearchQuery('про ремонт'), ['про', 'ремонт']);
  assert.deepEqual(tokenizeSearchQuery('розповісти про iPhone 17'), ['розповісти', 'про', 'iphone', '17']);
});

test('nested list matches prefer the leaf target while a parent remains searchable by its own copy', () => {
  const index = buildPortalSearchIndex({ modules: [learningModule(73, [{ type: 'text', title: 'Анкета клієнта', html:
    '<ul><li>Підготуйте анкету клієнта та номер заявки.<ul><li>Номер телефону, адреса, сімейний стан, контактна особа.</li><li>Паспорт і додаткові документи.</li></ul></li></ul>' }])] });
  const precise = searchPortalIndex(index, 'Номер телефону');
  assert.equal(precise.total, 1);
  assert.equal(precise.results[0].href, '/module/73#module-73-topic-1-text-2');
  const parent = searchPortalIndex(index, 'Підготуйте анкету');
  assert.equal(parent.total, 1);
  assert.equal(parent.results[0].href, '/module/73#module-73-topic-1-text-1');
  assert.equal(searchPortalIndex(index, 'телефону документи').total, 0, 'terms from unrelated sibling items do not create a parent-only match');
});

test('a feature snippet focuses on the wanted information rather than an earlier model name', () => {
  const index = buildPortalSearchIndex({ modules: [learningModule(8, [{ type: 'productCatalog', title: 'Моделі', products: [
    device('iPhone 17 Pro', { overview: ['iPhone 17 Pro. ' + 'Зручний пристрій для щоденного використання. '.repeat(8) + 'Камера: 48 Мп зі стабілізацією.'] })
  ] }])] });
  const found = searchPortalIndex(index, 'iPhone 17 Pro камера');
  assert.equal(found.total, 1);
  assert.match(found.results[0].snippet, /Камера: 48 Мп/);
  assert.ok(found.results[0].snippet.startsWith('…'));
});

test('snippet positioning uses the same apostrophe normalization as matching and highlighting', () => {
  const index = buildPortalSearchIndex({ modules: [learningModule(9, [{ type: 'facts', title: 'Характеристики', items: [
    'Спочатку порівняйте потреби клієнта. '.repeat(10) + 'Пам’ять: 256 GB.'
  ] }])] });
  const found = searchPortalIndex(index, "пам'ять");
  assert.equal(found.total, 1);
  assert.match(found.results[0].snippet, /Пам’ять: 256 GB/);
  assert.ok(found.results[0].snippet.startsWith('…'));
});
