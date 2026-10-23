const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { MAX_AVATAR_FILE_SIZE, AVATAR_ACCEPT } = require("../lib/avatar-upload.ts");

// Run the real component handlers and HTTP helpers with controlled fetches.
// The hook harness preserves refs/effect dependencies across rerenders; no real
// browser, account, storage, or database is involved.
function harness(avatarUrl = "/uploads/avatars/old.png") {
  const hooks = [];
  let cursor = 0, dirty = true, effects = [], tree, refreshes = 0;
  const same = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
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
    useEffect(effect, dependencies) {
      const i = cursor++;
      if (!same(hooks[i]?.dependencies, dependencies)) effects.push(() => { hooks[i]?.cleanup?.(); hooks[i] = { dependencies, cleanup: effect() }; });
    }
  };
  const Avatar = () => null;
  const filename = path.resolve(__dirname, "../components/profile/ProfileIdentityCard.tsx");
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const installed = Module.createRequire(filename);
  loaded.require = (request) => {
    if (request === "react") return react;
    if (request === "next/navigation") return { useRouter: () => ({ refresh() { refreshes++; } }) };
    if (request === "@/components/UserAvatar") return { UserAvatar: Avatar };
    if (request === "@/lib/http-client") return require("../lib/http-client.ts");
    if (request === "@/lib/avatar-upload") return require("../lib/avatar-upload.ts");
    if (request.endsWith(".css")) return { __esModule: true, default: new Proxy({}, { get: (_, name) => String(name) }) };
    return installed(request);
  };
  loaded._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText, filename);
  const props = { user: { name: "Тестовий Користувач", email: "fixture@example.test", position: "Консультант", department: "Навчання", store: null, avatarUrl } };
  const render = () => {
    for (let round = 0; dirty; round++) {
      assert.ok(round < 20, "component effects settle");
      dirty = false; cursor = 0; tree = loaded.exports.ProfileIdentityCard(props);
      const pending = effects; effects = []; pending.forEach(effect => effect());
    }
    return tree;
  };
  const nodes = () => {
    const result = [];
    function visit(node) { if (Array.isArray(node)) return node.forEach(visit); if (!node?.props) return; result.push(node); visit(node.props.children); }
    visit(render()); return result;
  };
  return {
    nodes,
    input: () => nodes().find(n => n.type === "input" && n.props.type === "file"),
    remove: () => nodes().find(n => n.type === "button" && n.props.children?.some?.(c => c === "Видалити")),
    avatar: () => nodes().find(n => n.type === Avatar).props.avatarUrl,
    alert: () => nodes().find(n => n.props.role === "alert")?.props.children,
    status: () => nodes().find(n => n.props.role === "status")?.props.children,
    get refreshes() { return refreshes; }
  };
}

const image = (type = "image/png", size = 32) => new File([new Uint8Array(size)], "photo.png", { type });
function select(h, file) {
  const input = { files: [file], value: "C:\\fakepath\\photo.png" };
  const pending = h.input().props.onChange({ target: input, currentTarget: input });
  assert.equal(input.value, "", "the same file can be selected again before the request settles");
  return pending;
}

test("avatar upload recovers from network and non-JSON 413 failures and retries the same file", async () => {
  const original = global.fetch;
  try {
    for (const fail of [
      async () => { throw new TypeError("Failed to fetch"); },
      async () => new Response("FUNCTION_PAYLOAD_TOO_LARGE", { status: 413 })
    ]) {
      const h = harness();
      const file = image();
      let calls = 0;
      global.fetch = async (url, init) => {
        calls++;
        assert.equal(url, "/api/profile/avatar");
        assert.equal(init.method, "POST");
        assert.equal(init.body.get("avatar"), file);
        return calls === 1 ? fail() : Response.json({ avatarUrl: "/uploads/avatars/new.png" });
      };
      await select(h, file);
      assert.match(h.alert(), /сервер|відповідь/);
      assert.equal(h.avatar(), "/uploads/avatars/old.png", "failure keeps the current photo");
      assert.equal(h.refreshes, 0);
      assert.ok(h.nodes().filter(n => n.type === "button").every(n => n.props.disabled === false));
      assert.equal(h.input().props.disabled, false);
      await select(h, file);
      assert.equal(calls, 2);
      assert.equal(h.alert(), undefined);
      assert.equal(h.avatar(), "/uploads/avatars/new.png");
      assert.match(h.status(), /оновлено/);
      assert.equal(h.refreshes, 1);
    }
  } finally { global.fetch = original; }
});

test("invalid format, empty file, and oversize avatar never leave the browser", async () => {
  const original = global.fetch;
  try {
    let calls = 0;
    global.fetch = async () => { calls++; throw Error("unexpected request"); };
    const h = harness();
    assert.equal(h.input().props.accept, AVATAR_ACCEPT);
    assert.equal(MAX_AVATAR_FILE_SIZE, 4 * 1024 * 1024);
    for (const file of [image("image/gif"), image("image/png", 0), image("image/png", MAX_AVATAR_FILE_SIZE + 1)]) {
      await select(h, file);
      assert.ok(h.alert());
      assert.equal(h.input().props.disabled, false);
      assert.equal(h.avatar(), "/uploads/avatars/old.png");
    }
    assert.equal(calls, 0);
    global.fetch = async () => { calls++; return Response.json({ avatarUrl: "/uploads/avatars/limit.png" }); };
    await select(h, image("image/png", MAX_AVATAR_FILE_SIZE));
    assert.equal(calls, 1, "the inclusive 4 MiB boundary is accepted");
    assert.equal(h.alert(), undefined);
  } finally { global.fetch = original; }
});

test("a malformed success response cannot replace the photo or announce success", async () => {
  const original = global.fetch;
  try {
    for (const data of [null, {}, { avatarUrl: 123 }, { avatarUrl: " " }]) {
      const h = harness();
      global.fetch = async () => Response.json(data);
      await select(h, image());
      assert.match(h.alert(), /не повернув фото/);
      assert.equal(h.avatar(), "/uploads/avatars/old.png");
      assert.equal(h.status(), undefined);
      assert.equal(h.refreshes, 0);
      assert.equal(h.input().props.disabled, false);
    }
  } finally { global.fetch = original; }
});

test("pending avatar mutation disables every control and blocks simultaneous uploads or delete", async () => {
  const original = global.fetch;
  try {
    const h = harness();
    const staleDelete = h.remove().props.onClick;
    let resolve, calls = 0;
    global.fetch = () => { calls++; return new Promise(done => { resolve = done; }); };
    const upload = select(h, image());
    assert.ok(h.nodes().filter(n => n.type === "button").every(n => n.props.disabled === true));
    assert.equal(h.input().props.disabled, true);
    await select(h, image());
    await staleDelete();
    assert.equal(calls, 1, "a synchronous ref also blocks stale handlers before a rerender");
    resolve(Response.json({ avatarUrl: "/api/uploads/avatars/new.png" }));
    await upload;
    assert.equal(h.input().props.disabled, false);
    assert.equal(h.avatar(), "/api/uploads/avatars/new.png");
  } finally { global.fetch = original; }
});

test("delete handles network, HTML, and server JSON errors and supports a successful retry", async () => {
  const original = global.fetch;
  try {
    for (const fail of [
      async () => { throw new TypeError("offline"); },
      async () => new Response("Bad Gateway", { status: 502 }),
      async () => Response.json({ error: "Сховище тимчасово недоступне" }, { status: 503 })
    ]) {
      const h = harness();
      let calls = 0;
      global.fetch = async (_url, init) => { assert.equal(init.method, "DELETE"); return ++calls === 1 ? fail() : new Response(null, { status: 204 }); };
      await h.remove().props.onClick();
      assert.ok(h.alert());
      assert.equal(h.avatar(), "/uploads/avatars/old.png");
      assert.equal(h.remove().props.disabled, false);
      await h.remove().props.onClick();
      assert.equal(h.avatar(), null);
      assert.equal(h.remove(), undefined);
      assert.match(h.status(), /видалено/);
      assert.equal(h.alert(), undefined);
      assert.equal(h.refreshes, 1);
    }
  } finally { global.fetch = original; }
});

test("private avatar proxy URLs bypass the optimizer and remain browser-authenticated requests", () => {
  global.React = React;
  const { UserAvatar } = require("../components/UserAvatar.tsx");
  for (const avatarUrl of ["/uploads/avatars/example.png", "/api/uploads/avatars/example.webp"]) {
    const html = renderToStaticMarkup(React.createElement(UserAvatar, { name: "Тест", avatarUrl }));
    assert.ok(html.includes(`src="${avatarUrl}"`));
    assert.equal(html.includes("/_next/image"), false);
  }
});
