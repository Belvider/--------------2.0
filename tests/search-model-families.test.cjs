const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPortalSearchIndex, searchPortalIndex } = require('../lib/portal-search.ts');

function learningModule(id, title, blocks, brand = 'Apple') {
  return { id, title, description: 'Навчальний каталог пристроїв.', durationMin: 20, isPublished: true, contentBlocks: blocks,
    category: { name: title, slug: 'devices', brand: { name: brand, slug: brand.toLowerCase() } } };
}

function device(title, fields = {}) {
  return { title, slug: title.toLowerCase().replaceAll(' ', '-'), family: '', summary: '', overview: [], highlights: [], colors: [], ...fields };
}

function catalog(id, title, products, brand = 'Apple', extraBlocks = []) {
  return buildPortalSearchIndex({ modules: [learningModule(id, title, [{ type: 'productCatalog', title, products }, ...extraBlocks], brand)] });
}

function find(index, query) {
  return searchPortalIndex(index, query, { limit: 30 }).results;
}

test('Watch Ultra generation cannot come from SE, Series or an Ultra Wideband chip', () => {
  const index = catalog(10, 'Apple Watch: Series, SE та Ultra — моделі й технічні характеристики', [
    device('Apple Watch Ultra 3 (2025)', { family: 'Ultra', overview: ['Процесор: Apple S10', 'Корпус: титан 49 мм'] }),
    device('Apple Watch SE 3 (2025)', { family: 'SE', overview: ['Процесор: Apple S10'] }),
    device('Apple Watch Series 3 (2017)', { family: 'Series', overview: ['Процесор: Apple S3, чип W2'] }),
    device('Apple Watch Ultra 2 (2023/2024)', { family: 'Ultra', highlights: ['Процесор: Apple S9, чип W3, Ultra Wideband 2-го покоління'] })
  ]);
  const results = find(index, 'Apple Watch Ultra 3');
  assert.ok(results.some(result => result.type === 'product' && result.title === 'Apple Watch Ultra 3 (2025)'));
  assert.equal(results.some(result => /Watch (?:SE|Series)|Watch Ultra 2/.test(result.title)), false);
  const feature = find(index, 'Apple Watch Ultra 3 корпус');
  assert.equal(feature.length, 1);
  assert.equal(feature[0].href, '/module/10#module-10-topic-1-product-1-spec-2');
});

test('JBL Flip 6 excludes Charge 6 and incidental PartyBox driver sizes', () => {
  const index = catalog(26, 'JBL: Flip, Charge та PartyBox', [
    device('JBL Flip 6', { family: 'Everyday portable', overview: ['Потужність: 30 Вт'] }),
    device('JBL Charge 6', { family: 'Charge', overview: ['Потужність: 45 Вт RMS'] }),
    device('JBL PartyBox 310', { family: 'PartyBox', highlights: ['2 × 6,5-дюймові низькочастотні драйвери'] })
  ], 'JBL');
  const results = find(index, 'JBL Flip 6');
  assert.ok(results.some(result => result.type === 'product' && result.title === 'JBL Flip 6'));
  assert.equal(results.some(result => /Charge 6|PartyBox 310/.test(result.title)), false);
  assert.equal(find(index, 'JBL Flip 6 потужність')[0]?.href, '/module/26#module-26-topic-1-product-1-spec-1');
});

test('a bare Apple Watch generation is not inferred from the S11 processor in a different model', () => {
  const index = catalog(10, 'Apple Watch: Series, SE та Ultra — моделі й технічні характеристики', [
    device('Apple Watch Series 11 (2025)', { family: 'Series', overview: ['Процесор: Apple S10'] }),
    device('Apple Watch Series 12 (2026)', { family: 'Series', overview: ['Процесор: Apple S11, пам’ять 64 ГБ'] }),
    device('Apple Watch Ultra 4 (2026)', { family: 'Ultra', overview: ['Процесор: Apple S11, пам’ять 64 ГБ'] })
  ]);
  const results = find(index, 'Apple Watch 11');
  assert.ok(results.some(result => result.type === 'product' && result.title === 'Apple Watch Series 11 (2025)'));
  assert.equal(results.some(result => /Watch Series 12|Watch Ultra 4/.test(result.title)), false);
});

test('Dyson V15 stays in the requested vacuum family despite the broad catalogue heading', () => {
  const index = catalog(18, 'Dyson Пилососи: V16, V15, V12, V8 та інші моделі', [
    device('Dyson V15 Detect', { family: 'Dyson V15', overview: ['Лазерне підсвічування'] }),
    device('Dyson V8 Absolute', { family: 'Dyson V8', overview: ['Потужність: до 115 аВт'], highlights: ['До 15 хвилин у посиленому режимі'] }),
    device('Dyson V16 Piston Animal', { family: 'Dyson V16', overview: ['Комплектація: стандартна'] })
  ], 'Dyson');
  const results = find(index, 'Dyson V15');
  assert.ok(results.some(result => result.type === 'product' && result.title === 'Dyson V15 Detect'));
  assert.equal(results.some(result => /Dyson V8|Dyson V16/.test(result.title)), false);
  assert.equal(find(index, 'Dyson V15 лазер')[0]?.href, '/module/18#module-18-topic-1-product-1-spec-1');
});

test('iPad Pro is a device line rather than the Pro chip inside iPad mini', () => {
  const index = catalog(4, 'Apple iPad: Air, Pro та mini', [
    device('iPad Pro 11″ (M4, 2024)', { family: 'iPad Pro', overview: ['ProMotion 10–120 Гц', 'Процесор: Apple M4'] }),
    device('iPad mini (A17 Pro, 2024)', { family: 'iPad mini', overview: ['Процесор: Apple A17 Pro', 'Дисплей: 8,3 дюйма'] }),
    device('iPad Air 11″ (M3, 2025)', { family: 'iPad Air', overview: ['Процесор: Apple M3'] })
  ]);
  assert.ok(find(index, 'iPad Pro').some(result => result.type === 'product' && result.title.startsWith('iPad Pro')));
  assert.equal(find(index, 'iPad Pro').some(result => result.title.startsWith('iPad mini')), false);
  assert.ok(find(index, 'A17 Pro').some(result => result.title.startsWith('iPad mini') && result.meta === 'Характеристика'), 'generic chip searches remain available');
  assert.ok(find(index, 'M4').some(result => result.title.startsWith('iPad Pro')), 'generic chip generation is searchable');
});

test('MacBook Air M3 opens its explicit charging row instead of M5 or an M2 MagSafe3 argument', () => {
  const index = catalog(6, 'Apple MacBook: Air і Pro — моделі та технічні характеристики', [
    device('MacBook Air 13″ M2 (2022)', { family: 'MacBook Air 13″', overview: ['Процесор: Apple M2'], highlights: ['Порти: Thunderbolt / USB 4 ×2, MagSafe3, аудіо 3,5 мм'] })
  ], 'Apple', [
    { type: 'text', title: 'Актуальні лінійки', html: '<p>MacBook Air M5 (2026): 13,6/15,3 дюйма, CPU 10 ядер, 12 Мп Center Stage.</p><p>MacBook Pro M3: для роботи з графікою.</p>' },
    { type: 'text', title: 'Швидке заряджання для Mac', html: '<table><tr><th>MacBook Air (лінійка M3)</th><td>Адаптер 70W USB-C, кабель USB-C ↔ MagSafe 3. Підтримує швидке заряджання.</td></tr></table>' }
  ]);
  const results = find(index, 'MacBook Air M3');
  assert.equal(results.length, 1, JSON.stringify(results));
  assert.equal(results[0].href, '/module/6#module-6-topic-3-text-1');
  assert.match(results[0].snippet, /MacBook Air \(лінійка M3\)/);
  assert.equal(find(index, 'MacBook Air M3 заряджання')[0]?.href, '/module/6#module-6-topic-3-text-1');
});

test('Garmin Fenix 8 preserves its generation detail while rejecting other Garmin series numbered 8', () => {
  const index = catalog(22, 'Garmin: Fenix, Tactix та Quatix', [
    device('Garmin Fenix', { family: 'Outdoor flagship', highlights: ['У Pineapple є Fenix 8 / E та Fenix 9 / 9 Pro; характеристики поколінь відрізняються.'] }),
    device('Garmin Tactix', { family: 'Tactical premium', overview: ['Покоління: Tactix 7 / 8'] })
  ], 'Garmin', [{ type: 'text', title: 'Інші серії', html: '<p>Quatix 8: морські сценарії та взаємодія із сумісним судновим обладнанням.</p>' }]);
  const results = find(index, 'Garmin Fenix 8');
  assert.equal(results.length, 1, JSON.stringify(results));
  assert.equal(results[0].href, '/module/22#module-22-topic-1-product-1-highlight-1');
});

test('an explicit accessory compatibility sentence remains a valid target for the named device', () => {
  const index = catalog(14, 'Apple Периферія: Pencil і сумісність із iPad', [
    device('Apple Pencil Pro', { family: 'Apple Pencil', highlights: [
      'Сумісність: iPad Pro M4/M5 (11/13), iPad Air M2/M3/M4 (11/13), iPad mini (A17 Pro); iPadOS 17.5+',
      'Функції: squeeze, haptic feedback і barrel roll.'
    ] }),
    device('Apple Pencil (2-го покоління)', { family: 'Apple Pencil', highlights: ['Сумісність: iPad Pro 11″ (1–4 покоління), iPad Air (4–5 покоління), iPad mini (6 покоління)'] })
  ]);
  const results = find(index, 'iPad Pro M4');
  assert.ok(results.some(result => result.href === '/module/14#module-14-topic-1-product-1-highlight-1'), JSON.stringify(results));
  assert.equal(results.some(result => result.href.endsWith('product-1-highlight-2')), false, 'the accessory model name cannot qualify an unrelated feature');
  assert.equal(results.some(result => result.title === 'Apple Pencil (2-го покоління)'), false);
});
