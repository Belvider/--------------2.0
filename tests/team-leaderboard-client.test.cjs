const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function entries(count) {
  return Array.from({ length: count }, (_, index) => ({
    userId: `user-${index + 1}`, name: `Учасник ${index + 1}`,
    department: 'Навчання', completed: Math.max(5 - index, 0)
  }));
}

function harness(initialEntries, currentUserId = 'user-7') {
  let expanded = false;
  const props = { entries: initialEntries, currentUserId };
  const filename = path.resolve(__dirname, '../components/home/TeamLeaderboard.tsx');
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const installed = Module.createRequire(filename);
  loaded.require = request => {
    if (request === 'react') return {
      ...React, useId: () => 'team-list-test',
      useState: () => [expanded, value => { expanded = typeof value === 'function' ? value(expanded) : value; }]
    };
    if (request.endsWith('.module.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
    return installed(request);
  };
  loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText, filename);
  const tree = () => loaded.exports.TeamLeaderboard(props);
  const nodes = () => {
    const result = [];
    function visit(node) {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!node?.props) return;
      result.push(node); visit(node.props.children);
    }
    visit(tree()); return result;
  };
  return {
    markup: () => renderToStaticMarkup(tree()),
    rows: () => nodes().filter(node => node.type === 'li'),
    button: () => nodes().find(node => node.type === 'button'),
    update: nextEntries => { props.entries = nextEntries; }
  };
}

test('team ranking expands beyond five, exposes the last participant, and collapses without changing ranks', () => {
  const h = harness(entries(8));
  assert.equal(h.rows().length, 5);
  assert.match(h.markup(), /Учасників: 8/);
  assert.match(h.markup(), /Показано 5 із 8/);
  assert.equal(h.button().props['aria-expanded'], false);
  assert.equal(h.button().props['aria-controls'], 'team-list-test');
  assert.equal(h.button().props.children[0], 'Показати всіх (8)');
  h.button().props.onClick();
  assert.equal(h.rows().length, 8);
  assert.equal(h.button().props['aria-expanded'], true);
  assert.equal(h.button().props.children[0], 'Згорнути');
  assert.match(h.markup(), /Показано 8 із 8/);
  assert.match(h.markup(), /Учасник 8/);
  assert.match(h.markup(), /currentUser[\s\S]*?Учасник 7[\s\S]*? · Ви/);
  assert.deepEqual(h.rows().map(row => row.props.children[0].props.children), [1, 2, 3, 4, 5, 6, 7, 8]);
  h.button().props.onClick();
  assert.equal(h.rows().length, 5);
  assert.doesNotMatch(h.markup(), /Учасник 8/);
  assert.equal(h.button().props['aria-expanded'], false);
});

test('new portal participants appear when refreshed entries reach an already expanded ranking', () => {
  const h = harness(entries(7));
  h.button().props.onClick();
  h.update(entries(9));
  assert.equal(h.rows().length, 9);
  assert.match(h.markup(), /Учасників: 9/);
  assert.match(h.markup(), /Учасник 9/);
  assert.match(h.markup(), /Показано 9 із 9/);
});

test('small teams include zero-progress users, show correct module labels and need no expansion', () => {
  const rows = entries(4).map((row, index) => ({ ...row, completed: [0, 1, 2, 11][index] }));
  const h = harness(rows, 'user-1');
  assert.equal(h.rows().length, 4);
  assert.equal(h.button(), undefined);
  const markup = h.markup();
  assert.match(markup, /0<small>модулів/);
  assert.match(markup, /1<small>модуль/);
  assert.match(markup, /2<small>модулі/);
  assert.match(markup, /11<small>модулів/);
  assert.match(markup, /currentUser[\s\S]*?Учасник 1[\s\S]*? · Ви/);
});

test('an empty team does not show an empty ranking container', () => {
  const h = harness([]);
  assert.equal(h.markup(), '');
  assert.equal(h.button(), undefined);
});
