const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { getSketchfabEmbedUrl } = require('../lib/inline-model.ts');

const uid = '45c182d5b0ae4e80a67038d04de0b573';
function model() {
  return { title: 'iPhone 18 Pro', url: 'https://www.apple.com/iphone-18-pro/', variant: 'Glacier',
    note: 'Характеристики звіряйте зі специфікацією виробника.', viewer: { provider: 'sketchfab', uid,
      author: 'extraakash', authorUrl: 'https://sketchfab.com/AakashMansukhani',
      sourceUrl: `https://sketchfab.com/3d-models/apple-iphone-18-pro-glacier-2026-${uid}`,
      license: 'Free Standard', licenseUrl: 'https://sketchfab.com/licenses' } };
}
function loadViewer(react = React) {
  const filename = path.resolve(__dirname, '../components/module/InlineModelViewer.tsx');
  const installed = Module.createRequire(filename), loaded = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText;
  new Function('require', 'module', 'exports', compiled)(
    request => request === 'react' ? react : installed(request), loaded, loaded.exports
  );
  return loaded.exports.InlineModelViewer;
}
function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!React.isValidElement(node)) return [];
  return [node, ...elements(node.props.children)];
}
function visibleText(node) {
  if (Array.isArray(node)) return node.map(visibleText).join('');
  if (React.isValidElement(node)) return visibleText(node.props.children);
  return typeof node === 'string' || typeof node === 'number' ? String(node) : '';
}

// Flush dependency-based effects and state changes after each controlled render.
// This keeps the retry test faithful when the parent keeps the same active UID.
function viewerHarness() {
  const states = [], effects = [];
  let cursor = 0, pending = [], dirty = false, tree, activations = 0, closes = 0;
  const react = { ...React,
    useState(initial) {
      const index = cursor++;
      if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial;
      return [states[index], next => {
        const updated = typeof next === 'function' ? next(states[index]) : next;
        if (!Object.is(updated, states[index])) { states[index] = updated; dirty = true; }
      }];
    },
    useEffect(effect, dependencies) {
      const index = cursor++, previous = effects[index];
      if (!previous || dependencies.some((value, i) => !Object.is(value, previous[i]))) {
        effects[index] = [...dependencies]; pending.push(effect);
      }
    }
  };
  const InlineModelViewer = loadViewer(react);
  const props = { model: model(), active: false,
    onActivate() { activations++; props.active = true; }, onClose() { closes++; props.active = false; } };
  return {
    render(changes = {}) {
      Object.assign(props, changes);
      let renders = 0;
      do {
        assert.ok(++renders < 10, 'effects should settle without a render loop');
        dirty = false; cursor = 0; pending = []; tree = InlineModelViewer(props);
        for (const effect of pending) effect();
      } while (dirty);
      return tree;
    },
    get nodes() { return elements(tree); }, get tree() { return tree; },
    get activations() { return activations; }, get closes() { return closes; }
  };
}
function assertCredits(harness) {
  const expected = model();
  for (const href of [expected.viewer.authorUrl, expected.viewer.licenseUrl, expected.viewer.sourceUrl]) {
    const link = harness.nodes.find(item => item.type === 'a' && item.props.href === href);
    assert.ok(link, `credit link retained: ${href}`);
    assert.equal(link.props.target, '_blank');
    assert.equal(link.props.rel, 'noopener noreferrer');
  }
  const text = visibleText(harness.tree);
  for (const value of [expected.viewer.author, expected.viewer.license, expected.variant, expected.note]) assert.ok(text.includes(value), value);
}

test('Sketchfab iframe sources are constructed from a lowercase UID, never a supplied URL', () => {
  assert.equal(getSketchfabEmbedUrl(uid), `https://sketchfab.com/models/${uid}/embed?autostart=1`);
  for (const unsafe of [undefined, null, 123, {}, '', uid.toUpperCase(), uid.slice(1), ` ${uid}`, `${uid}/embed`,
    `${uid}?autostart=0`, `${uid}#x`, `../${uid}`, `https://evil.example/${uid}`, `\" onload=\"alert(1)`]) {
    assert.equal(getSketchfabEmbedUrl(unsafe), null, String(unsafe));
  }
});

test('server rendering and the initial view retain attribution without loading a third-party iframe', () => {
  const InlineModelViewer = loadViewer();
  const markup = renderToStaticMarkup(React.createElement(InlineModelViewer, { model: model(), active: false, onActivate() {}, onClose() {} }));
  assert.doesNotMatch(markup, /<iframe/);
  assert.match(markup, /Переглянути 3D на сайті/);
  for (const value of ['Незалежна 3D-візуалізація', 'extraakash', 'Free Standard', 'Модель у Sketchfab']) assert.ok(markup.includes(value), value);
  for (const badModel of [{ ...model(), viewer: undefined }, { ...model(), viewer: { ...model().viewer, uid: 'bad' } }]) {
    assert.equal(renderToStaticMarkup(React.createElement(InlineModelViewer, { model: badModel, active: true, onActivate() {}, onClose() {} })), '');
  }
  const harness = viewerHarness(); harness.render();
  assert.equal(harness.nodes.filter(item => item.type === 'iframe').length, 0);
  assertCredits(harness);
});

test('activation, loading, errors, retry of the same active model and closing keep attribution intact', () => {
  const harness = viewerHarness(); harness.render();
  harness.nodes.find(item => item.type === 'button' && visibleText(item).includes('Переглянути 3D на сайті')).props.onClick();
  harness.render();
  assert.equal(harness.activations, 1);
  let frame = harness.nodes.find(item => item.type === 'iframe');
  assert.ok(frame); assert.equal(frame.props.src, getSketchfabEmbedUrl(uid));
  assert.equal(frame.props.title, '3D-перегляд: iPhone 18 Pro');
  assert.equal(frame.props.allowFullScreen, true);
  assert.equal(frame.props.referrerPolicy, 'strict-origin-when-cross-origin');
  assert.ok(harness.nodes.some(item => item.props.role === 'status'));
  assertCredits(harness);

  frame.props.onLoad(); harness.render();
  assert.equal(harness.nodes.some(item => item.props.role === 'status'), false);
  frame = harness.nodes.find(item => item.type === 'iframe');
  frame.props.onError(); harness.render();
  assert.equal(harness.nodes.some(item => item.type === 'iframe'), false);
  assert.ok(harness.nodes.some(item => item.props.role === 'alert'));
  assertCredits(harness);

  harness.nodes.find(item => item.type === 'button' && visibleText(item).includes('Спробувати завантажити 3D ще раз')).props.onClick();
  harness.render();
  assert.equal(harness.activations, 2, 'retry calls the parent even while it keeps the same active UID');
  assert.ok(harness.nodes.some(item => item.type === 'iframe'));
  assert.ok(harness.nodes.some(item => item.props.role === 'status'), 'retry must reset loading without relying on changed effect dependencies');
  assert.equal(harness.nodes.some(item => item.props.role === 'alert'), false);
  assertCredits(harness);

  harness.nodes.find(item => item.type === 'button' && item.props['aria-label'] === 'Закрити 3D: iPhone 18 Pro').props.onClick();
  harness.render();
  assert.equal(harness.closes, 1);
  assert.equal(harness.nodes.some(item => item.type === 'iframe'), false);
  assertCredits(harness);
});
