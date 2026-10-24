const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { prepareSearchableHtml, stripSearchableHtml } = require('../lib/content-anchors.ts');

function loadSource(relative, overrides = {}, globals = {}) {
  const filename = path.resolve(__dirname, '..', relative);
  const installed = Module.createRequire(filename);
  const loaded = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText;
  new Function('require', 'module', 'exports', ...Object.keys(globals), compiled)(
    request => Object.hasOwn(overrides, request) ? overrides[request] : installed(request),
    loaded, loaded.exports, ...Object.values(globals)
  );
  return loaded.exports;
}

function permalinkHarness(writeText) {
  const hooks = [], timers = new Map();
  let cursor = 0, nextTimer = 1;
  const react = { ...React,
    useState(initial) { const index = cursor++; hooks[index] ??= { value: initial }; return [hooks[index].value, value => { hooks[index].value = value; }]; },
    useRef(initial) { const index = cursor++; hooks[index] ??= { current: initial }; return hooks[index]; },
    useEffect(effect) { const index = cursor++; hooks[index] ??= { cleanup: effect() }; }
  };
  const location = new URL('https://portal.example/module/2?view=compact#previous');
  const clipboard = writeText === undefined ? {} : { writeText };
  const { MaterialPermalink } = loadSource('components/MaterialPermalink.tsx', { react }, {
    navigator: { clipboard }, window: { location },
    setTimeout(callback, delay) { const id = nextTimer++; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); }
  });
  const props = { anchor: 'module-2-камера', title: 'Основна камера', compact: true };
  const render = () => { cursor = 0; return MaterialPermalink(props); };
  return { location, timers, render,
    async click(overrides = {}) {
      const event = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, prevented: false,
        preventDefault() { this.prevented = true; }, ...overrides };
      render().props.onClick(event); await new Promise(setImmediate); return event;
    },
    expire() { const pending = [...timers.values()]; timers.clear(); pending.forEach(timer => timer.callback()); },
    destroy() { hooks.forEach(hook => hook?.cleanup?.()); }
  };
}

test('visible rich beacons are opt-in and preserve all searchable copy and exact targets', () => {
  const html = '<h2 id="authored">Камера</h2><p>Основна камера 48 Мп.</p><ul><li>Перший пункт</li><li>Другий пункт</li></ul><table><tr><th>Модель</th><td>iPhone 17 Pro</td></tr><tr><td>Пам’ять</td><td><p>256 ГБ</p></td></tr></table>';
  const plain = prepareSearchableHtml(html, 'module-2-topic-1');
  const visible = prepareSearchableHtml(html, 'module-2-topic-1', { showPermalinks: true });
  assert.doesNotMatch(plain.html, /data-material-permalink|data-rich-permalink/);
  assert.deepEqual(visible.fragments, plain.fragments);
  assert.equal(visible.fragments.length, 6, 'heading, paragraph, list items and table rows each have one target');
  assert.equal(stripSearchableHtml(visible.html), stripSearchableHtml(plain.html), 'controls do not add indexable labels or icons');
  assert.match(visible.html, /id="authored" data-material-anchor="module-2-topic-1-text-1"/);
  assert.equal([...visible.html.matchAll(/data-rich-permalink="true"/g)].length, visible.fragments.length);
  for (const fragment of visible.fragments) {
    assert.equal(visible.html.split(`data-material-permalink="${fragment.anchor}"`).length - 1, 1);
    assert.ok(visible.html.includes(`href="#${encodeURIComponent(fragment.anchor)}"`));
  }
  for (const match of visible.html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)) {
    const row = match[1], beacon = row.indexOf('data-rich-permalink="true"');
    assert.ok(beacon > row.lastIndexOf('<td') && beacon < row.lastIndexOf('</td>'), 'a row beacon belongs to its last cell');
    assert.doesNotMatch(row, /^\s*<a\b|<\/t[dh]>\s*<a\b/, 'links are never direct row children');
  }
});

test('rich beacons avoid authored link nesting, hidden material and unsafe label attributes', () => {
  const html = '<a href="/guide"><h3>Інструкція</h3></a><p>Відкрийте <a href="/help">довідку</a> та оберіть &quot;камеру&quot; &lt;об’єкт&gt;.</p><div hidden><p>Прихований секрет</p></div><div aria-hidden="true"><h4>Інший секрет</h4></div><script>"<p>Секрет скрипту</p>"</script>';
  const prepared = prepareSearchableHtml(html, 'module-2-topic-2', { showPermalinks: true });
  assert.equal(prepared.fragments.length, 2);
  assert.equal([...prepared.html.matchAll(/data-rich-permalink="true"/g)].length, 2);
  let linkOpen = false;
  for (const match of prepared.html.matchAll(/<\/?a\b[^>]*>/g)) {
    if (match[0].startsWith('</')) { assert.equal(linkOpen, true); linkOpen = false; }
    else { assert.equal(linkOpen, false, 'generated beacons never nest in authored links'); linkOpen = true; }
  }
  assert.equal(linkOpen, false);
  assert.match(prepared.html, /&quot;камеру&quot; &lt;об’єкт&gt;\./);
  assert.doesNotMatch(JSON.stringify(prepared.fragments), /секрет/i);
  const labels = [...prepared.html.matchAll(/aria-label="([^"]*)"/g)].map(match => match[1]);
  assert.ok(labels.some(label => label.includes('&quot;камеру&quot;') && label.includes('&lt;об’єкт&gt;')));
  assert.ok(labels.every(label => !/секрет/i.test(label)));
});

test('a compact material link copies the complete canonical URL and announces success until its timer expires', async () => {
  const copied = [], h = permalinkHarness(async value => { copied.push(value); });
  try {
    assert.equal(h.render().props.href, '#module-2-%D0%BA%D0%B0%D0%BC%D0%B5%D1%80%D0%B0');
    assert.equal((await h.click()).prevented, true);
    assert.deepEqual(copied, ['https://portal.example/module/2?view=compact#module-2-%D0%BA%D0%B0%D0%BC%D0%B5%D1%80%D0%B0']);
    assert.equal(h.location.hash, '#previous', 'copying preserves the current reading position');
    assert.equal(h.render().props.title, 'Посилання скопійовано');
    assert.match(renderToStaticMarkup(h.render()), /role="status">Посилання скопійовано/);
    assert.equal(h.timers.size, 1);
    assert.equal([...h.timers.values()][0].delay, 2400);
    await h.click();
    assert.equal(h.timers.size, 1, 'a repeat copy replaces the pending reset');
    h.expire();
    assert.equal(h.render().props.title, 'Скопіювати посилання: Основна камера');
    await h.click(); h.destroy();
    assert.equal(h.timers.size, 0, 'unmount clears pending feedback work');
  } finally { h.destroy(); }
});

test('modified clicks and unavailable clipboard preserve native link behavior', async () => {
  const copied = [], h = permalinkHarness(async value => { copied.push(value); });
  try {
    for (const event of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
      assert.equal((await h.click(event)).prevented, false);
    }
    assert.equal(copied.length, 0);
  } finally { h.destroy(); }
  const unsupported = permalinkHarness();
  try {
    assert.equal((await unsupported.click()).prevented, false);
    assert.equal(unsupported.location.hash, '#previous');
  } finally { unsupported.destroy(); }
});

test('clipboard rejection opens the exact native fragment instead of claiming it was copied', async () => {
  const h = permalinkHarness(async () => { throw Error('Clipboard unavailable'); });
  try {
    assert.equal((await h.click()).prevented, true);
    assert.equal(h.location.hash, '#module-2-%D0%BA%D0%B0%D0%BC%D0%B5%D1%80%D0%B0');
    assert.equal(h.render().props.title, 'Скопіювати посилання: Основна камера');
    assert.equal(h.timers.size, 0);
  } finally { h.destroy(); }
});

test('overview anchors remain addressable while their permalink controls are visually hidden', () => {
  const { MaterialPermalink } = loadSource('components/MaterialPermalink.tsx');
  const { PortalContentPage } = loadSource('components/portal/PortalContentPage.tsx', {
    '@/components/PortalShell': { PortalShell: ({ children }) => React.createElement('main', null, children) },
    '@/components/MaterialPermalink': { MaterialPermalink },
    '@/lib/content-anchors': require('../lib/content-anchors.ts'),
    'next/link': { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) }
  });
  const { getDefaultPortalPageContent } = require('../lib/portal-pages.ts');
  for (const slug of ['services', 'credits', 'accessories']) {
    const content = getDefaultPortalPageContent(slug);
    const markup = renderToStaticMarkup(React.createElement(PortalContentPage, { user: { id: 'permalink-test', name: 'Тест', role: 'SELLER' }, content }));
    const expected = content.cards.flatMap((card, index) => {
      const anchor = `portal-${slug}-card-${index + 1}`;
      return [anchor, ...card.items.map((_, itemIndex) => `${anchor}-item-${itemIndex + 1}`)];
    });
    const beacons = [...markup.matchAll(/<a\b[^>]*data-material-permalink="([^"]+)"[^>]*>/g)];
    assert.deepEqual(beacons.map(match => match[1]).sort(), expected.sort());
    for (const beacon of beacons) {
      assert.ok(beacon[0].includes(`href="#${beacon[1]}"`));
      assert.match(beacon[0], /aria-label="Скопіювати посилання:/);
      assert.match(beacon[0], /\bhidden=""/);
      assert.match(beacon[0], /style="display:none"/);
      assert.ok(markup.includes(`id="${beacon[1]}"`), 'the actual search target is independent of its hidden control');
    }
  }
});
