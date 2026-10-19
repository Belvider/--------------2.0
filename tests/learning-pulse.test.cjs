const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");

function pulseHarness() {
  const states = [];
  let cursor = 0;
  const filename = path.resolve(__dirname, "../components/home/LearningPulse.tsx");
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const installed = Module.createRequire(filename);
  loaded.require = (request) => {
    if (request === "react") return {
      ...React,
      useState(initial) {
        const index = cursor++;
        if (!(index in states)) states[index] = typeof initial === "function" ? initial() : initial;
        return [states[index], (next) => { states[index] = typeof next === "function" ? next(states[index]) : next; }];
      }
    };
    if (request === "next/link") return { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) };
    if (request.endsWith(".module.css")) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
    return installed(request);
  };
  loaded._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText, filename);
  return {
    render(days) { cursor = 0; return loaded.exports.LearningPulse({ days }); }
  };
}

function nodes(tree, predicate) {
  const result = [];
  function visit(node) {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node || typeof node !== "object" || !node.props) return;
    if (predicate(node)) result.push(node);
    visit(node.props.children);
  }
  visit(tree);
  return result;
}

function textOf(node) {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (Array.isArray(node)) return node.map(textOf).join("");
  return typeof node === "object" ? textOf(node.props?.children) : String(node);
}

function selectionText(tree) {
  return textOf(nodes(tree, (node) => node.props.className === "selection")[0]);
}

test("learning rhythm selects today and clicking another day updates the live detail and pressed state", () => {
  const harness = pulseHarness();
  const days = [
    { day: "2026-10-18", modulesCount: 2, isToday: false },
    { day: "2026-10-19", modulesCount: 0, isToday: true }
  ];
  let tree = harness.render(days);
  let buttons = nodes(tree, (node) => node.type === "button");
  assert.equal(buttons[0].props["aria-pressed"], false);
  assert.equal(buttons[1].props["aria-pressed"], true);
  assert.match(selectionText(tree), /Сьогодні · 19 жовтня0 модулів/);
  assert.equal(nodes(tree, (node) => node.props["aria-live"] === "polite").length, 1);
  buttons[0].props.onClick();
  tree = harness.render(days);
  buttons = nodes(tree, (node) => node.type === "button");
  assert.equal(buttons[0].props["aria-pressed"], true);
  assert.equal(buttons[1].props["aria-pressed"], false);
  assert.match(selectionText(tree), /18 жовтня2 модулі опрацьовано/);
  assert.doesNotMatch(selectionText(tree), /Сьогодні/);
});

test("learning rhythm uses Ukrainian module plurals for accessible day controls and their selected detail", () => {
  for (const [count, label] of [[0, "0 модулів"], [1, "1 модуль"], [2, "2 модулі"], [5, "5 модулів"], [11, "11 модулів"], [21, "21 модуль"], [22, "22 модулі"]]) {
    const tree = pulseHarness().render([{ day: "2026-10-19", modulesCount: count, isToday: true }]);
    const button = nodes(tree, (node) => node.type === "button")[0];
    assert.ok(button.props["aria-label"].includes(label));
    assert.ok(selectionText(tree).includes(label));
    assert.match(button.props["aria-label"], /понеділок, 19 жовтня/);
  }
});

test("learning rhythm handles an empty week and falls back when refreshed days replace the selected day", () => {
  const harness = pulseHarness();
  const empty = harness.render([]);
  assert.equal(nodes(empty, (node) => node.type === "button").length, 0);
  assert.match(textOf(empty), /Активність з’явиться/);
  assert.match(selectionText(empty), /0 модулів/);
  assert.doesNotMatch(textOf(empty), /NaN|Infinity|Invalid Date/);

  const refreshed = harness.render([
    { day: "2026-10-18", modulesCount: 0, isToday: false },
    { day: "2026-10-19", modulesCount: 3, isToday: false }
  ]);
  assert.equal(nodes(refreshed, (node) => node.type === "button" && node.props["aria-pressed"] === true).length, 1);
  assert.match(selectionText(refreshed), /19 жовтня3 модулі/);
  const zeroBar = nodes(refreshed, (node) => node.props.className === "bar zero")[0];
  assert.equal(zeroBar.props.style["--bar-height"], "3px");
});
