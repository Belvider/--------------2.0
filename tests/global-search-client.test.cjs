const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

// Run the actual client effects and event handlers with controlled requests,
// timers and DOM surfaces. This also exercises responses that ignore aborts.
function harness() {
  const hooks = [], timers = new Map(), listeners = new Map(), frames = [], pushes = [], events = [], scrolls = [];
  let cursor = 0, dirty = true, effects = [], tree, nextTimer = 1;
  const same = (a, b) => a && b && a.length === b.length && a.every((value, i) => Object.is(value, b[i]));
  const react = {
    ...React,
    useState(initial) {
      const i = cursor++;
      hooks[i] ??= { value: typeof initial === "function" ? initial() : initial };
      return [hooks[i].value, (next) => {
        const value = typeof next === "function" ? next(hooks[i].value) : next;
        if (!Object.is(value, hooks[i].value)) { hooks[i].value = value; dirty = true; }
      }];
    },
    useRef(initial) { const i = cursor++; hooks[i] ??= { current: initial }; return hooks[i]; },
    useId() { const i = cursor++; hooks[i] ??= { value: `search-${i}` }; return hooks[i].value; },
    useCallback(callback, dependencies) {
      const i = cursor++;
      if (!same(hooks[i]?.dependencies, dependencies)) hooks[i] = { dependencies, callback };
      return hooks[i].callback;
    },
    useEffect(effect, dependencies) {
      const i = cursor++;
      if (!same(hooks[i]?.dependencies, dependencies)) effects.push(() => { hooks[i]?.cleanup?.(); hooks[i] = { dependencies, cleanup: effect() }; });
    }
  };
  const location = { href: "https://portal.example/dashboard", pathname: "/dashboard", hash: "" };
  const window = {
    location,
    addEventListener(name, callback) { listeners.set(name, callback); },
    removeEventListener(name) { listeners.delete(name); },
    dispatchEvent(event) { events.push(event); listeners.get(event.type)?.(event); },
    requestAnimationFrame(callback) { frames.push(callback); }
  };
  const document = { getElementById(id) { return { scrollIntoView(options) { scrolls.push({ id, options }); } }; } };
  const Dialog = ({ children }) => React.createElement("section", {}, children);
  const Link = (props) => React.createElement("a", props);
  const filename = path.resolve(__dirname, "../components/GlobalSearch.tsx");
  const installed = Module.createRequire(filename);
  const requireSource = (request) => {
    if (request === "react") return react;
    if (request === "next/link") return { __esModule: true, default: Link };
    if (request === "next/navigation") return { useRouter: () => ({ push(href) { pushes.push(href); } }) };
    if (request === "@/components/AccessibleDialog") return { AccessibleDialog: Dialog };
    if (request === "@/lib/http-client") return require("../lib/http-client.ts");
    if (request === "@/lib/search-highlights") return require("../lib/search-highlights.ts");
    return installed(request);
  };
  const loaded = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText;
  new Function("require", "module", "exports", "setTimeout", "clearTimeout", "window", "document", compiled)(
    requireSource, loaded, loaded.exports,
    (callback) => { const id = nextTimer++; timers.set(id, callback); return id; },
    (id) => timers.delete(id), window, document
  );
  const render = () => {
    for (let round = 0; dirty; round++) {
      assert.ok(round < 25, "component effects settle");
      dirty = false; cursor = 0; tree = loaded.exports.GlobalSearch();
      const pending = effects; effects = []; pending.forEach(effect => effect());
    }
    return tree;
  };
  const nodes = () => {
    const result = [];
    function visit(node) { if (Array.isArray(node)) return node.forEach(visit); if (!node?.props) return; result.push(node); visit(node.props.children); }
    visit(render()); return result;
  };
  const h = {
    nodes, pushes, events, scrolls, location,
    open() { render(); listeners.get("portal:open-search")(); render(); },
    input() { return nodes().find(node => node.type === "input"); },
    query(value) { h.input().props.onChange({ target: { value } }); render(); },
    options() { return nodes().filter(node => node.props.role === "option"); },
    button(label) { return nodes().find(node => node.type === "button" && (node.props.children === label || node.props["aria-label"] === label)); },
    dialog() { return nodes().find(node => node.type === Dialog); },
    html() { return renderToStaticMarkup(render()); },
    key(key) { const event = { key, preventDefault() { this.prevented = true; } }; h.input().props.onKeyDown(event); render(); return event; },
    async tick() {
      const pending = [...timers.values()]; timers.clear(); pending.forEach(callback => callback());
      await new Promise(setImmediate); render();
    },
    async settle() { await new Promise(setImmediate); render(); },
    flushFrames() { frames.splice(0).forEach(callback => callback()); },
    destroy() { hooks.forEach(hook => hook?.cleanup?.()); }
  };
  render();
  return h;
}

function result(id, extra = {}) {
  return { type: "section", id, title: `Матеріал ${id}`, subtitle: "Apple · iPhone", snippet: "Частота оновлення екрана: 120 Гц", href: `/module/2#section-${id}`, ...extra };
}
function response(results, extra = {}) {
  return Response.json({ results, total: results.length, offset: 0, limit: 12, hasMore: false, ...extra });
}

test("search requires two characters and invalidates late responses even when abort is ignored", async () => {
  const original = global.fetch;
  let h;
  try {
    const requests = [];
    global.fetch = (url, init) => new Promise(resolve => requests.push({ url, init, resolve }));
    h = harness(); h.open();
    assert.match(h.html(), /щонайменше 2 символи/);
    h.query("а"); await h.tick();
    assert.equal(requests.length, 0);
    h.query("екран"); await h.tick();
    assert.equal(requests.length, 1);
    h.query("камера"); await h.tick();
    assert.equal(requests[0].init.signal.aborted, true);
    requests[1].resolve(response([result("camera", { title: "Камера" })])); await h.settle();
    requests[0].resolve(response([result("stale", { title: "Застарілий екран" })])); await h.settle();
    assert.deepEqual(h.options().map(node => node.props.href), ["/module/2#section-camera"]);
    assert.equal(h.html().includes("Застарілий"), false);
    h.query("к"); await h.tick();
    assert.equal(h.options().length, 0);
    assert.match(h.html(), /щонайменше 2 символи/);
  } finally { h?.destroy(); global.fetch = original; }
});

test("whitespace-only query edits keep an active request valid", async () => {
  const original = global.fetch;
  let h;
  try {
    let resolve, calls = 0;
    global.fetch = () => { calls++; return new Promise(done => { resolve = done; }); };
    h = harness(); h.open(); h.query("екран"); await h.tick();
    h.query(" екран "); await h.tick();
    resolve(response([result(1)])); await h.settle();
    assert.equal(calls, 1);
    assert.equal(h.options().length, 1);
    assert.equal(h.html().includes("Шукаємо в матеріалах"), false);
  } finally { h?.destroy(); global.fetch = original; }
});

test("search pages through all results without duplicate rows or jumping the selected row", async () => {
  const original = global.fetch;
  let h;
  try {
    const urls = [];
    global.fetch = async url => {
      urls.push(url);
      return urls.length === 1
        ? response(Array.from({ length: 12 }, (_, i) => result(i)), { total: 20, hasMore: true })
        : response(Array.from({ length: 8 }, (_, i) => result(i + 12)), { total: 20, offset: 12 });
    };
    h = harness(); h.open(); h.query("екран"); await h.tick();
    assert.equal(h.options().length, 12);
    const scrollCount = h.scrolls.length;
    h.button("Показати ще (8)").props.onClick(); await h.settle();
    assert.equal(h.options().length, 20);
    assert.match(urls[1], /offset=12&limit=12$/);
    assert.equal(h.scrolls.length, scrollCount, "loading a page preserves the reading position");
    assert.equal(h.button("Показати ще (0)"), undefined);
    assert.match(h.html(), /Знайдено: 20. Показано: 20./);
  } finally { h?.destroy(); global.fetch = original; }
});

test("keyboard selection exposes the active option and opens its precise cross-module fragment", async () => {
  const original = global.fetch;
  let h;
  try {
    global.fetch = async () => response([result(1), result(2)]);
    h = harness(); h.open(); h.query("екран"); await h.tick();
    assert.equal(h.input().props.role, "combobox");
    h.key("ArrowDown");
    assert.equal(h.options()[1].props["aria-selected"], true);
    assert.equal(h.input().props["aria-activedescendant"], h.options()[1].props.id);
    assert.equal(h.scrolls.at(-1).id, h.options()[1].props.id);
    const restoreFocus = h.dialog().props.restoreFocus;
    assert.equal(restoreFocus(), true);
    assert.equal(h.key("Enter").prevented, true);
    assert.equal(h.input(), undefined);
    assert.equal(restoreFocus(), false, "navigation does not restore focus to the header");
    assert.deepEqual(h.pushes, [], "navigation waits for the dialog to unmount");
    h.flushFrames();
    assert.deepEqual(h.pushes, ["/module/2#section-2"]);
  } finally { h?.destroy(); global.fetch = original; }
});

test("same-module navigation updates the native fragment and explicitly reopens an already selected anchor", async () => {
  const original = global.fetch;
  let h;
  try {
    global.fetch = async () => response([result("details")]);
    h = harness(); h.location.href = "https://portal.example/module/2#section-details"; h.location.pathname = "/module/2"; h.location.hash = "#section-details";
    h.open(); h.query("екран"); await h.tick(); h.key("Enter"); h.flushFrames();
    assert.deepEqual(h.pushes, []);
    assert.equal(h.location.hash, "#section-details");
    const navigation = h.events.find(event => event.type === "material:navigate");
    assert.deepEqual(navigation.detail, { anchor: "section-details" });
  } finally { h?.destroy(); global.fetch = original; }
});

test("a failed next page keeps previous results and retries the same offset", async () => {
  const original = global.fetch;
  let h;
  try {
    const urls = [];
    global.fetch = async url => {
      urls.push(url);
      if (urls.length === 1) return response([result(1)], { total: 2, hasMore: true });
      if (urls.length === 2) throw new TypeError("offline");
      return response([result(2)], { total: 2, offset: 1 });
    };
    h = harness(); h.open(); h.query("екран"); await h.tick();
    h.button("Показати ще (1)").props.onClick(); await h.settle();
    assert.equal(h.options().length, 1);
    assert.ok(h.nodes().some(node => node.props.role === "alert"));
    h.button("Спробувати ще раз").props.onClick(); await h.settle();
    assert.equal(urls[1], urls[2]);
    assert.equal(h.options().length, 2);
    assert.equal(h.nodes().some(node => node.props.role === "alert"), false);
  } finally { h?.destroy(); global.fetch = original; }
});

test("safe excerpts highlight literal search text and escape markup from material content", async () => {
  const original = global.fetch;
  let h;
  try {
    global.fetch = async () => response([result(1, { title: "Екран A+", snippet: '<img src=x onerror="alert(1)"> A+ — екран' })]);
    h = harness(); h.open(); h.query("A+"); await h.tick();
    const html = h.html();
    assert.match(html, /<mark[^>]*>A\+<\/mark>/);
    assert.equal(html.includes("<img"), false);
    assert.ok(html.includes("&lt;img"));
    const restoreFocus = h.dialog().props.restoreFocus;
    h.button("Закрити пошук").props.onClick();
    assert.equal(restoreFocus(), true, "manual close restores the trigger focus");
  } finally { h?.destroy(); global.fetch = original; }
});

test("visible results highlight normalized device names, feature stems and apostrophes", async () => {
  const original = global.fetch;
  let h;
  try {
    global.fetch = async () => response([result(1, { title: "iPhone 17 Pro Max", snippet: "Пам'ять: 256 ГБ" })]);
    h = harness(); h.open(); h.query("айфон17 promax пам’ять"); await h.tick();
    const html = h.html();
    for (const word of ["iPhone", "17", "Pro", "Max", "Пам&#x27;ять"]) {
      assert.ok(html.includes(`>${word}</mark>`), `the visible result explains the match: ${word}`);
    }
  } finally { h?.destroy(); global.fetch = original; }
});

test("an initial malformed response can be retried and pending requests cannot be duplicated", async () => {
  const original = global.fetch;
  let h;
  try {
    let calls = 0, resolve;
    global.fetch = async () => {
      if (++calls === 1) return Response.json([]);
      return new Promise(done => { resolve = done; });
    };
    h = harness(); h.open(); h.query("екран"); await h.tick();
    assert.match(h.html(), /некоректні результати/);
    const retry = h.button("Спробувати ще раз").props.onClick;
    retry(); retry();
    assert.equal(calls, 2, "the synchronous request guard rejects a duplicate stale handler");
    resolve(response([result(1)])); await h.settle();
    assert.equal(h.options().length, 1);
    assert.equal(h.nodes().some(node => node.props.role === "alert"), false);
  } finally { h?.destroy(); global.fetch = original; }
});

test("the real dialog releases its scroll lock and restores focus only for manual close", () => {
  for (const navigating of [false, true]) {
    const effects = [], listeners = new Map(), focused = [];
    let cursor = 0, closed = false;
    class Element {
      constructor(name) { this.name = name; this.isConnected = true; this.tabIndex = 0; }
      focus(options) { focused.push({ name: this.name, options }); document.activeElement = this; }
      getClientRects() { return [1]; }
      contains(node) { return node === this || (this.name === "dialog" && node === input); }
      querySelectorAll() { return [input, option]; }
    }
    const trigger = new Element("trigger"), input = new Element("input"), dialog = new Element("dialog"), option = new Element("option");
    option.tabIndex = -1;
    const document = {
      activeElement: trigger, body: { style: { overflow: "auto" } },
      addEventListener(name, callback) { listeners.set(name, callback); },
      removeEventListener(name) { listeners.delete(name); }
    };
    const filename = path.resolve(__dirname, "../components/AccessibleDialog.tsx");
    const installed = Module.createRequire(filename);
    const loaded = { exports: {} };
    const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
    }).outputText;
    const react = { ...React, useRef(value) { return { current: cursor++ === 0 ? dialog : value }; }, useEffect(effect) { effects.push(effect); } };
    new Function("require", "module", "exports", "document", "HTMLElement", "Node", compiled)(
      request => request === "react" ? react : installed(request), loaded, loaded.exports, document, Element, Element
    );
    loaded.exports.AccessibleDialog({ label: "Пошук", onClose() { closed = true; }, initialFocusRef: { current: input }, restoreFocus: () => !navigating });
    const cleanup = effects[0]();
    assert.equal(document.body.style.overflow, "hidden");
    assert.equal(document.activeElement, input);
    listeners.get("keydown")({ key: "Tab", shiftKey: true, preventDefault() {} });
    assert.equal(document.activeElement, input, "the focus trap excludes listbox options with tabIndex=-1");
    const escape = { key: "Escape", preventDefault() {}, stopPropagation() {} };
    listeners.get("keydown")(escape);
    assert.equal(closed, true, "Escape invokes the supplied close handler");
    cleanup();
    assert.equal(document.body.style.overflow, "auto");
    assert.equal(listeners.size, 0);
    assert.equal(focused.some(item => item.name === "trigger"), !navigating);
    if (!navigating) assert.deepEqual(focused.at(-1).options, { preventScroll: true });
  }
});
