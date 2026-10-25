const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { parseLearningGuide } = require('../lib/learning-guide.ts');

const uid = '45c182d5b0ae4e80a67038d04de0b573';
function viewer() {
  return { provider: 'sketchfab', uid, author: 'extraakash', authorUrl: 'https://sketchfab.com/AakashMansukhani',
    sourceUrl: `https://sketchfab.com/3d-models/apple-iphone-18-pro-glacier-2026-${uid}`,
    license: 'Free Standard', licenseUrl: 'https://sketchfab.com/licenses' };
}
function guide(withViewer = true) {
  return { version: 1, reviewedAt: '2026-10-25', objectives: ['Пояснити конструкцію пристрою.'], prerequisites: 'Основи консультації.',
    route: [], reference: [], sources: [], practice: [], models3d: [{ title: 'iPhone 18 Pro',
      url: 'https://www.apple.com/iphone-18-pro/', variant: 'Glacier', note: 'Характеристики звіряйте зі специфікацією виробника.',
      ...(withViewer ? { viewer: viewer() } : {}) }] };
}

test('inline models preserve legacy links and accept only matching Sketchfab model pages', () => {
  for (const data of [guide(false), guide()]) assert.deepEqual(parseLearningGuide(data, 1), data);
  for (const sourceUrl of [`https://sketchfab.com/models/${uid}`, `https://www.sketchfab.com/3d-models/${uid}/`]) {
    const data = guide(); data.models3d[0].viewer.sourceUrl = sourceUrl;
    assert.deepEqual(parseLearningGuide(data, 1), data);
  }
});

test('unsafe identifiers, embed URLs and foreign or mismatched model sources are rejected', () => {
  for (const mutate of [
    value => value.provider = 'iframe', value => value.uid = uid.toUpperCase(), value => value.uid = uid.slice(1),
    value => value.uid = `../${uid}`, value => value.sourceUrl = `https://sketchfab.com/models/${'0'.repeat(32)}`,
    value => value.sourceUrl = `https://sketchfab.com/models/${uid}/embed`,
    value => value.sourceUrl = `https://sketchfab.com.evil.example/models/${uid}`,
    value => value.sourceUrl = `https://evil.example/models/${uid}`,
    value => value.sourceUrl = `https://user:secret@sketchfab.com/models/${uid}`,
    value => value.sourceUrl = `http://sketchfab.com/models/${uid}`,
    value => value.sourceUrl = `https://sketchfab.com:8443/models/${uid}`,
    value => value.sourceUrl = `https://sketchfab.com/models/${uid}?embed=1`,
    value => value.sourceUrl = `https://sketchfab.com/models/${uid}#embed`,
    value => value.embedUrl = 'https://evil.example/iframe', value => value.srcDoc = '<script>alert(1)</script>'
  ]) {
    const data = guide(); mutate(data.models3d[0].viewer);
    assert.equal(parseLearningGuide(data, 1), null, JSON.stringify(data.models3d[0].viewer));
  }
  const data = guide(); data.models3d[0].viewer = null;
  assert.equal(parseLearningGuide(data, 1), null);
});

test('every inline model requires usable author credits and HTTPS license terms', () => {
  for (const mutate of [
    value => delete value.author, value => value.author = ' ', value => value.author = 'A'.repeat(101),
    value => value.authorUrl = 'https://sketchfab.com/', value => value.authorUrl = 'https://sketchfab.com/terms',
    value => value.authorUrl = 'https://sketchfab.com/models/extraakash',
    value => value.authorUrl = 'https://sketchfab.com.evil.example/extraakash',
    value => value.authorUrl = 'https://user:secret@sketchfab.com/extraakash',
    value => value.authorUrl = 'https://sketchfab.com/extraakash?tab=models',
    value => value.license = '', value => value.license = 'L'.repeat(141), value => delete value.licenseUrl,
    value => value.licenseUrl = 'http://creativecommons.org/licenses/by/4.0/',
    value => value.licenseUrl = 'javascript:alert(1)',
    value => value.licenseUrl = 'https://user:secret@creativecommons.org/licenses/by/4.0/'
  ]) {
    const data = guide(); mutate(data.models3d[0].viewer);
    assert.equal(parseLearningGuide(data, 1), null, JSON.stringify(data.models3d[0].viewer));
  }
});

function loadEditor() {
  const filename = path.resolve(__dirname, '../components/admin/LearningGuideEditor.tsx');
  const installed = Module.createRequire(filename), loaded = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText;
  new Function('require', 'module', 'exports', compiled)(
    request => request === 'react' ? { ...React, useState: initial => [initial, () => {}] } : installed(request), loaded, loaded.exports
  );
  return loaded.exports.LearningGuideEditor;
}
function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!React.isValidElement(node)) return [];
  return [node, ...elements(node.props.children)];
}

test('the structured editor adds, edits and removes a viewer without losing its original external link', () => {
  const LearningGuideEditor = loadEditor();
  let value = guide(false);
  const original = structuredClone(value.models3d[0]);
  const render = () => elements(LearningGuideEditor({ value, moduleId: 1, blocks: [{ type: 'text', title: 'Основи', html: '<p>Текст</p>' }], onChange: next => { value = next; } }));
  const button = label => render().find(item => item.type === 'button' && item.props.children === label);
  const field = label => render().find(item => item.props.label === label);
  assert.ok(render().some(item => item.type === 'h3' && item.props.children === '3D-перегляди та авторські моделі'));
  button('Додати 3D-перегляд на сайті').props.onClick();
  assert.equal(parseLearningGuide(value, 1), null, 'incomplete drafts are kept editable but cannot be saved');
  const expected = viewer();
  for (const [label, key] of [
    ['Посилання на модель Sketchfab', 'sourceUrl'], ['Ім’я автора 3D-моделі', 'author'],
    ['Профіль автора на Sketchfab', 'authorUrl'], ['Ліцензія 3D-моделі', 'license'], ['Посилання на умови ліцензії', 'licenseUrl']
  ]) field(label).props.onChange(expected[key]);
  assert.deepEqual(value.models3d[0].viewer, expected, 'UID is derived from the canonical model URL');
  assert.deepEqual(parseLearningGuide(JSON.parse(JSON.stringify(value)), 1), value, 'all credits survive JSON round trips');
  const { viewer: savedViewer, ...external } = value.models3d[0];
  assert.deepEqual(external, original);
  button('Прибрати вбудований перегляд').props.onClick();
  assert.equal(value.models3d[0].viewer, undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(value.models3d[0])), original);
  assert.ok(parseLearningGuide(value, 1));
});
