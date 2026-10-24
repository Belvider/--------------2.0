const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const React = require("react");

function loadSource(relativePath, mocks = {}) {
  const filename = path.resolve(__dirname, relativePath);
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const installed = Module.createRequire(filename);
  loaded.require = name => Object.hasOwn(mocks, name) ? mocks[name] : installed(name);
  loaded._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText, filename);
  return loaded.exports;
}

function employee(overrides = {}) {
  return {
    id: "current-admin", name: "Олег Любарщук", firstName: "Олег", lastName: "Любарщук", middleName: null,
    email: "fixture@example.test", phone: null, birthday: null, city: null, position: "Адміністратор",
    department: "Навчання", store: null, hireDate: null, notes: null, role: "ADMIN", isActive: true, ...overrides
  };
}

function apiFixture({ actor = { id: "current-admin", role: "ADMIN" }, previous = employee() } = {}) {
  const calls = { reads: [], updates: [], audits: [], deletes: [] };
  const api = loadSource("../app/api/admin/users/route.ts", {
    "@/lib/auth": { requireRole: async roles => actor && roles.includes(actor.role) ? actor : null },
    "@/lib/prisma": { prisma: { user: {
      findUnique: async input => { calls.reads.push(input); return previous; },
      update: async input => { calls.updates.push(input); return { ...previous, ...input.data }; },
      delete: async input => { calls.deletes.push(input); return previous; }
    } } },
    "@/lib/admin-audit": { createAdminAuditLog: async input => { calls.audits.push(input); }, getRequestIpAddress: () => "127.0.0.1" },
    "@/lib/user-profile": require("../lib/user-profile.ts"),
    "@/lib/validators": require("../lib/validators.ts")
  });
  return { ...api, calls };
}

function patch(body) {
  return new Request("https://example.invalid/api/admin/users", {
    method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body)
  });
}

test("profile updates reject anonymous, seller and manager requests before reading any employee", async () => {
  for (const actor of [null, { id: "seller", role: "SELLER" }, { id: "manager", role: "MANAGER" }]) {
    const api = apiFixture({ actor });
    assert.equal((await api.PATCH(patch({ userId: "current-admin", firstName: "Олексій" }))).status, 403);
    assert.equal(api.calls.reads.length, 0);
    assert.equal(api.calls.updates.length, 0);
    assert.equal(api.calls.audits.length, 0);
  }
});

test("an administrator can update their own names, with trimmed canonical identity and an audit record", async () => {
  const api = apiFixture();
  const response = await api.PATCH(patch({
    userId: "current-admin", firstName: "  Олексій  ", lastName: "  Шевченко ", middleName: " Іванович "
  }));
  assert.equal(response.status, 200);
  const { user } = await response.json();
  assert.equal(user.name, "Олексій Шевченко Іванович");
  assert.equal(user.firstName, "Олексій");
  assert.equal(user.lastName, "Шевченко");
  assert.equal(user.role, "ADMIN");
  assert.equal(user.isActive, true);
  assert.deepEqual(api.calls.updates[0].data, {
    firstName: "Олексій", lastName: "Шевченко", middleName: "Іванович", name: "Олексій Шевченко Іванович"
  });
  assert.equal(api.calls.audits.length, 1);
  assert.equal(api.calls.audits[0].actorId, "current-admin");
  assert.equal(api.calls.audits[0].details.after.name, user.name);
});

test("unchanged access fields in an older self-profile form do not prevent saving names", async () => {
  const api = apiFixture();
  const response = await api.PATCH(patch({
    userId: "current-admin", firstName: "Олексій", lastName: "Шевченко", middleName: "", role: "ADMIN", isActive: true
  }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).user.name, "Олексій Шевченко");
  assert.equal(api.calls.updates[0].data.middleName, null);
});

test("self-demotion, self-blocking and self-deletion remain forbidden without partial writes", async () => {
  for (const access of [{ role: "MANAGER" }, { role: "SELLER" }, { isActive: false }, { role: "SELLER", isActive: false }]) {
    const api = apiFixture();
    const response = await api.PATCH(patch({ userId: "current-admin", firstName: "Олексій", ...access }));
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /власну роль|власний акаунт/);
    assert.equal(api.calls.updates.length, 0);
    assert.equal(api.calls.audits.length, 0);
  }
  const api = apiFixture();
  assert.equal((await api.DELETE(new Request("https://example.invalid/api/admin/users?userId=current-admin", { method: "DELETE" }))).status, 400);
  assert.equal(api.calls.deletes.length, 0);
});

test("administrators retain access management for another employee while password fields are ignored", async () => {
  const api = apiFixture({ previous: employee({ id: "another-user", role: "SELLER" }) });
  const response = await api.PATCH(patch({
    userId: "another-user", firstName: "Марія", role: "MANAGER", isActive: false,
    password: "should-not-be-written", passwordHash: "should-not-be-written"
  }));
  assert.equal(response.status, 200);
  assert.equal(api.calls.updates[0].data.role, "MANAGER");
  assert.equal(api.calls.updates[0].data.isActive, false);
  assert.equal(Object.hasOwn(api.calls.updates[0].data, "password"), false);
  assert.equal(Object.hasOwn(api.calls.updates[0].data, "passwordHash"), false);
});

test("partial name edits preserve names from legacy accounts and allow explicitly clearing a middle name", async () => {
  const legacy = apiFixture({ previous: employee({ name: "Олег Любарщук Петрович", firstName: null, lastName: null, middleName: null }) });
  assert.equal((await legacy.PATCH(patch({ userId: "current-admin", firstName: "Олексій" }))).status, 200);
  assert.equal(legacy.calls.updates[0].data.name, "Олексій Любарщук Петрович");
  const current = apiFixture({ previous: employee({ name: "Олег Любарщук Петрович", middleName: "Петрович" }) });
  assert.equal((await current.PATCH(patch({ userId: "current-admin", middleName: " " }))).status, 200);
  assert.equal(current.calls.updates[0].data.name, "Олег Любарщук");
  assert.equal(current.calls.updates[0].data.middleName, null);
});

test("invalid and missing target profiles cannot be changed", async () => {
  const invalid = apiFixture();
  assert.equal((await invalid.PATCH(patch({ userId: "current-admin", role: "OWNER" }))).status, 400);
  assert.equal(invalid.calls.reads.length, 0);
  const missing = apiFixture({ previous: null });
  assert.equal((await missing.PATCH(patch({ userId: "missing-user", firstName: "Олег" }))).status, 404);
  assert.equal(missing.calls.updates.length, 0);
});

test("empty name edits are rejected without replacing the administrator's existing identity", async () => {
  const api = apiFixture();
  const response = await api.PATCH(patch({ userId: "current-admin", firstName: " ", lastName: " ", middleName: " " }));
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /Вкажіть ім'я/);
  assert.equal(api.calls.reads.length, 0);
  assert.equal(api.calls.updates.length, 0);
});

function formHarness(overrides = {}) {
  const hooks = [];
  let cursor = 0, refreshes = 0;
  const react = {
    ...React,
    useState(initial) {
      const index = cursor++;
      hooks[index] ??= { value: typeof initial === "function" ? initial() : initial };
      return [hooks[index].value, next => { hooks[index].value = typeof next === "function" ? next(hooks[index].value) : next; }];
    },
    useRef(initial) { const index = cursor++; hooks[index] ??= { current: initial }; return hooks[index]; },
    useMemo: compute => compute()
  };
  const { AdminUserProfileForm } = loadSource("../components/admin/AdminUserProfileForm.tsx", {
    react,
    "next/navigation": { useRouter: () => ({ refresh() { refreshes++; } }) },
    "@/lib/http-client": require("../lib/http-client.ts"),
    "@/lib/user-profile": require("../lib/user-profile.ts")
  });
  const props = { user: employee(), canEdit: true, canChangeAccess: false, ...overrides };
  function nodes() {
    cursor = 0;
    const found = [];
    function visit(node) {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!node?.props) return;
      found.push(node);
      visit(node.props.children);
    }
    visit(AdminUserProfileForm(props));
    return found;
  }
  return {
    nodes,
    submit: () => nodes().find(n => n.type === "form").props.onSubmit({ preventDefault() {} }),
    firstName: () => nodes().find(n => n.type === "input" && n.props.placeholder === "Ім'я"),
    lastName: () => nodes().find(n => n.type === "input" && n.props.placeholder === "Прізвище"),
    save: () => nodes().find(n => n.type === "button" && n.props.type === "submit"),
    feedback: role => nodes().find(n => n.props.role === role)?.props.children,
    get refreshes() { return refreshes; }
  };
}

test("self-profile form enables name edits, omits access fields, and refreshes the saved identity", async () => {
  const original = global.fetch;
  try {
    const form = formHarness();
    assert.equal(form.firstName().props.disabled, false);
    assert.equal(form.lastName().props.disabled, false);
    assert.equal(form.nodes().find(n => n.type === "select").props.disabled, true);
    assert.equal(form.nodes().find(n => n.type === "input" && n.props.type === "checkbox").props.disabled, true);
    form.firstName().props.onChange({ target: { value: "Олексій" } });
    form.lastName().props.onChange({ target: { value: "Шевченко" } });
    global.fetch = async (url, options) => {
      assert.equal(url, "/api/admin/users");
      assert.equal(options.method, "PATCH");
      const body = JSON.parse(options.body);
      assert.equal(body.firstName, "Олексій");
      assert.equal(body.lastName, "Шевченко");
      assert.equal(Object.hasOwn(body, "role"), false);
      assert.equal(Object.hasOwn(body, "isActive"), false);
      return Response.json({ user: { name: "Олексій Шевченко" } });
    };
    await form.submit();
    assert.match(form.feedback("status"), /Олексій Шевченко/);
    assert.equal(form.refreshes, 1);
    assert.equal(form.save().props.disabled, false);
  } finally { global.fetch = original; }
});

test("profile form preserves drafts and allows retry after network, invalid JSON and server errors", async () => {
  const original = global.fetch;
  try {
    for (const fail of [
      async () => { throw new TypeError("Failed to fetch"); },
      async () => new Response("Not JSON", { status: 502 }),
      async () => Response.json({ error: "Цей email уже зайнятий" }, { status: 409 })
    ]) {
      const form = formHarness();
      form.firstName().props.onChange({ target: { value: "Олексій" } });
      global.fetch = fail;
      await form.submit();
      assert.equal(typeof form.feedback("alert"), "string");
      assert.equal(form.feedback("status"), undefined);
      assert.equal(form.firstName().props.value, "Олексій");
      assert.equal(form.save().props.disabled, false);
      assert.equal(form.refreshes, 0);
      global.fetch = async () => Response.json({ user: { name: "Олексій Любарщук" } });
      await form.submit();
      assert.equal(form.feedback("alert"), undefined);
      assert.equal(form.refreshes, 1);
    }
  } finally { global.fetch = original; }
});

test("pending profile saves cannot be submitted twice, and view-only forms never make requests", async () => {
  const original = global.fetch;
  try {
    let calls = 0, finish;
    global.fetch = async () => { calls++; return new Promise(resolve => { finish = resolve; }); };
    const form = formHarness();
    const pending = form.submit();
    assert.equal(form.save().props.disabled, true);
    assert.equal(form.firstName().props.disabled, true);
    await form.submit();
    assert.equal(calls, 1);
    finish(Response.json({ user: { name: "Олег Любарщук" } }));
    await pending;
    assert.equal(form.save().props.disabled, false);
    const readOnly = formHarness({ canEdit: false });
    await readOnly.submit();
    assert.equal(readOnly.firstName().props.disabled, true);
    assert.equal(calls, 1);
  } finally { global.fetch = original; }
});
