const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");

// Exercise the actual components' effects and event handlers with controlled
// requests. No browser, real account, or database writes are needed.
function componentHarness(relative, exportName, props, requestJson) {
  const hooks = [];
  let cursor = 0;
  let dirty = true;
  let tree;
  let pendingEffects = [];
  const timers = new Map();
  let timerId = 0;
  const sameDependencies = (left, right) => left && right && left.length === right.length && left.every((value, index) => Object.is(value, right[index]));
  const react = {
    ...React,
    useState(initial) {
      const index = cursor++;
      hooks[index] ??= { value: typeof initial === "function" ? initial() : initial };
      return [hooks[index].value, (next) => {
        const value = typeof next === "function" ? next(hooks[index].value) : next;
        if (!Object.is(value, hooks[index].value)) { hooks[index].value = value; dirty = true; }
      }];
    },
    useRef(initial) {
      const index = cursor++;
      hooks[index] ??= { current: initial };
      return hooks[index];
    },
    useMemo(calculate, dependencies) {
      const index = cursor++;
      if (!sameDependencies(hooks[index]?.dependencies, dependencies)) hooks[index] = { value: calculate(), dependencies };
      return hooks[index].value;
    },
    useEffect(effect, dependencies) {
      const index = cursor++;
      if (!sameDependencies(hooks[index]?.dependencies, dependencies)) {
        pendingEffects.push(() => {
          hooks[index]?.cleanup?.();
          hooks[index] = { dependencies, cleanup: effect() };
        });
      }
    }
  };
  let refreshes = 0;
  const router = { refresh() { refreshes++; } };
  const filename = path.resolve(__dirname, "..", relative);
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const installed = Module.createRequire(filename);
  loaded.require = (request) => {
    if (request === "react") return react;
    if (request === "next/navigation") return { useRouter: () => router };
    if (request === "@/lib/http-client") return { requestJson, getRequestError: (failure) => failure.message };
    if (request === "@test/timers") return {
      setTimeout(callback) { const id = ++timerId; timers.set(id, callback); return id; },
      clearTimeout(id) { timers.delete(id); }
    };
    if (request.endsWith(".css")) return { __esModule: true, default: new Proxy({}, { get: (_, name) => String(name) }) };
    return installed(request);
  };
  loaded._compile('const { setTimeout, clearTimeout } = require("@test/timers");\n' + ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText, filename);
  const Component = loaded.exports[exportName];
  function render() {
    for (let round = 0; dirty; round++) {
      assert.ok(round < 30, "component effects settle");
      dirty = false;
      cursor = 0;
      tree = Component(props);
      const effects = pendingEffects;
      pendingEffects = [];
      effects.forEach((effect) => effect());
    }
    return tree;
  }
  function nodes() {
    const result = [];
    function visit(node) {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!node || typeof node !== "object") return;
      result.push(node);
      visit(node.props?.children);
    }
    visit(render());
    return result;
  }
  return {
    render,
    nodes,
    get refreshes() { return refreshes; },
    runTimers() { const callbacks = [...timers.values()]; timers.clear(); callbacks.forEach((callback) => callback()); render(); },
    dispose() { hooks.forEach((hook) => hook.cleanup?.()); timers.clear(); }
  };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const settle = () => new Promise((resolve) => setImmediate(resolve));
const viewerProps = {
  moduleId: 42, initialProgressPct: 0, hasQuiz: true,
  blocks: [{ type: "text", title: "Lesson", html: "<p>Learning material</p>" }]
};
const quizLink = (harness) => harness.nodes().find((node) => node.type === "a" && node.props.href === "/module/42/quiz");

test("local 100% does not open the quiz until its progress write is acknowledged", async () => {
  const saved = deferred();
  const writes = [];
  const harness = componentHarness("components/module/ModuleViewer.tsx", "ModuleViewer", viewerProps, (url, request) => {
    writes.push({ url, body: JSON.parse(request.body) });
    return saved.promise;
  });
  try {
    assert.equal(quizLink(harness), undefined);
    harness.runTimers();
    assert.deepEqual(writes, [{ url: "/api/progress", body: { moduleId: 42, progressPct: 100 } }]);
    assert.equal(quizLink(harness), undefined);
    saved.resolve({ progress: { progressPct: 100 } });
    await settle();
    assert.ok(quizLink(harness));
    assert.equal(harness.refreshes, 1);
  } finally { harness.dispose(); }
});

test("failed progress saves leave the quiz locked and recover through the retry control", async () => {
  const first = deferred();
  const second = deferred();
  let requests = 0;
  const harness = componentHarness("components/module/ModuleViewer.tsx", "ModuleViewer", viewerProps, () => (++requests === 1 ? first.promise : second.promise));
  try {
    harness.render();
    harness.runTimers();
    first.reject(new Error("Connection unavailable"));
    await settle();
    assert.equal(quizLink(harness), undefined);
    const alert = harness.nodes().find((node) => node.props?.role === "alert");
    assert.ok(alert);
    const retry = harness.nodes().find((node) => node.type === "button" && node.props.children === "Спробувати ще раз");
    assert.equal(retry.props.disabled, false);
    retry.props.onClick();
    harness.render();
    harness.runTimers();
    second.resolve({ progress: { progressPct: 100 } });
    await settle();
    assert.ok(quizLink(harness));
    assert.equal(requests, 2);
  } finally { harness.dispose(); }
});

test("quiz request failure restores submit and preserves the selected answer for retry", async () => {
  const failure = deferred();
  const submissions = [];
  const harness = componentHarness("components/module/ModuleQuiz.tsx", "ModuleQuiz", {
    moduleId: 42, passScore: 70, questions: [{ id: 10, question: "Choose", type: "SINGLE", options: ["A", "B"] }]
  }, (url, request) => { submissions.push(JSON.parse(request.body)); return failure.promise; });
  try {
    const answer = harness.nodes().find((node) => node.type === "input" && node.props.type === "radio");
    answer.props.onChange();
    const form = harness.nodes().find((node) => node.type === "form");
    const pending = form.props.onSubmit({ preventDefault() {} });
    assert.equal(harness.nodes().find((node) => node.type === "button" && node.props.type === "submit").props.disabled, true);
    failure.reject(new Error("Connection unavailable"));
    await pending;
    assert.equal(harness.nodes().find((node) => node.type === "button" && node.props.type === "submit").props.disabled, false);
    assert.equal(harness.nodes().find((node) => node.type === "input" && node.props.type === "radio").props.checked, true);
    assert.deepEqual(submissions, [{ moduleId: 42, answers: [{ questionId: 10, answer: 0 }] }]);
    assert.ok(harness.nodes().some((node) => Array.isArray(node.props?.children) && node.props.children.includes("Connection unavailable")));
  } finally { harness.dispose(); }
});
