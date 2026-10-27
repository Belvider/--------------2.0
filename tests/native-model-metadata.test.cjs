const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { parseLearningGuide } = require('../lib/learning-guide.ts');
const { LOCAL_LEARNING_MODEL_ASSETS, getLearningModelAsset, getLocalLearningModelViewer } = require('../lib/learning-model-assets.ts');

function guide(viewer = getLocalLearningModelViewer('iphone-15-pro-max')) {
  return { version: 1, reviewedAt: '2026-10-27', objectives: ['Пояснити конструкцію пристрою.'], prerequisites: 'Основи консультації.',
    route: [], reference: [], sources: [], practice: [], models3d: [{ title: 'iPhone 15 Pro Max',
      url: 'https://support.apple.com/en-us/111828', variant: 'Авторська візуалізація.',
      note: 'Технічні характеристики звіряйте з офіційною специфікацією.', ...(viewer ? { viewer } : {}) }] };
}

test('local model metadata selects a reviewed same-origin asset and preserves its exact attribution', () => {
  const viewer = getLocalLearningModelViewer('iphone-15-pro-max');
  const asset = getLearningModelAsset(viewer.assetId);
  assert.equal(asset.path, '/models/iphone-15-pro-max.glb');
  assert.equal(asset.title, 'iPhone 15 Pro Max');
  assert.equal(viewer.uid, 'df17520841214c1792fb8a44c6783ee7');
  assert.equal(viewer.author, 'polyman Studio');
  assert.equal(viewer.license, 'CC BY 4.0');
  assert.deepEqual(parseLearningGuide(JSON.parse(JSON.stringify(guide())), 2), guide());
  assert.equal(Object.hasOwn(viewer, 'path'), false, 'stored metadata never supplies an asset path');
  assert.equal(Object.hasOwn(viewer, 'presentation'), false, 'device copy is separate from fixed viewer credentials');
  assert.notEqual(getLocalLearningModelViewer('iphone-15-pro-max'), viewer, 'editor drafts do not mutate shared catalog credits');
});

test('unknown assets, arbitrary files and edited or missing attribution cannot be saved', () => {
  for (const assetId of [undefined, null, 123, '', '__proto__', 'constructor', '../iphone-15-pro-max',
    '/models/iphone-15-pro-max.glb', 'https://evil.example/model.glb']) {
    assert.equal(getLearningModelAsset(assetId), undefined, String(assetId));
    const data = guide(); data.models3d[0].viewer.assetId = assetId;
    assert.equal(parseLearningGuide(data, 2), null, String(assetId));
  }
  const expected = getLocalLearningModelViewer('iphone-15-pro-max');
  for (const key of ['uid', 'author', 'authorUrl', 'sourceUrl', 'license', 'licenseUrl']) {
    const missing = guide(); delete missing.models3d[0].viewer[key];
    assert.equal(parseLearningGuide(missing, 2), null, `missing ${key}`);
    const altered = guide(); altered.models3d[0].viewer[key] = expected[key] + 'changed';
    assert.equal(parseLearningGuide(altered, 2), null, `altered ${key}`);
  }
  for (const extra of [{ path: '/models/other.glb' }, { src: 'https://evil.example/model.glb' },
    { embedUrl: 'https://evil.example/iframe' }, { srcDoc: '<script>alert(1)</script>' }]) {
    const data = guide(); Object.assign(data.models3d[0].viewer, extra);
    assert.equal(parseLearningGuide(data, 2), null, Object.keys(extra)[0]);
  }
});

test('local support preserves legacy external links and strict Sketchfab validation', () => {
  assert.deepEqual(parseLearningGuide(guide(null), 2), guide(null));
  const sketchfab = { provider: 'sketchfab', uid: '45c182d5b0ae4e80a67038d04de0b573',
    author: 'extraakash', authorUrl: 'https://sketchfab.com/AakashMansukhani',
    sourceUrl: 'https://sketchfab.com/3d-models/apple-iphone-18-pro-glacier-2026-45c182d5b0ae4e80a67038d04de0b573',
    license: 'Free Standard', licenseUrl: 'https://sketchfab.com/licenses' };
  assert.deepEqual(parseLearningGuide(guide(sketchfab), 2), guide(sketchfab));
  assert.equal(parseLearningGuide(guide({ ...sketchfab, assetId: 'iphone-15-pro-max' }), 2), null);
  assert.equal(parseLearningGuide(guide({ ...sketchfab, sourceUrl: 'https://evil.example/model' }), 2), null);
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

test('selecting a different local model replaces old device details and removal preserves the selected device copy', () => {
  const LearningGuideEditor = loadEditor();
  let value = guide(null);
  Object.assign(value.models3d[0], { title: 'iPhone 18 Pro', url: 'https://www.apple.com/iphone-18-pro/',
    variant: 'Glacier', note: 'Опис попереднього пристрою.' });
  const render = () => elements(LearningGuideEditor({ value, moduleId: 2, blocks: [{ type: 'text', title: 'Огляд', html: '<p>Матеріал</p>' }], onChange: next => { value = next; } }));
  const button = label => render().find(item => item.type === 'button' && item.props.children === label);
  button('Вибрати локальну 3D-модель').props.onClick();
  const asset = getLearningModelAsset('iphone-15-pro-max');
  assert.deepEqual(value.models3d[0], { title: asset.title, ...asset.presentation, viewer: getLocalLearningModelViewer('iphone-15-pro-max') }, 'the 15 Pro Max model cannot retain an 18 Pro label or official URL');
  assert.equal(value.models3d[0].url, 'https://support.apple.com/en-us/111828');
  assert.deepEqual(value.models3d[0].viewer, getLocalLearningModelViewer('iphone-15-pro-max'));
  assert.ok(parseLearningGuide(value, 2));
  assert.ok(render().some(item => item.type === 'legend' && item.props.children === 'Локальна 3D-модель'));
  assert.equal(render().some(item => item.props.label === 'Посилання на модель Sketchfab'), false, 'local model credits are not editable Sketchfab fields');
  for (const key of ['authorUrl', 'sourceUrl', 'licenseUrl']) assert.ok(render().some(item => item.type === 'a' && item.props.href === value.models3d[0].viewer[key]), key);
  const select = render().find(item => item.type === 'select' && item.props.value === 'iphone-15-pro-max');
  assert.ok(select);
  select.props.onChange({ target: { value: '../../other.glb' } });
  assert.deepEqual(value.models3d[0].viewer, getLocalLearningModelViewer('iphone-15-pro-max'), 'unlisted selections cannot supply paths');
  select.props.onChange({ target: { value: Object.keys(LOCAL_LEARNING_MODEL_ASSETS)[0] } });
  assert.deepEqual(value.models3d[0].viewer, getLocalLearningModelViewer('iphone-15-pro-max'));
  button('Прибрати вбудований перегляд').props.onClick();
  assert.deepEqual(JSON.parse(JSON.stringify(value.models3d[0])), { title: asset.title, ...asset.presentation });
  assert.ok(parseLearningGuide(value, 2));
});
