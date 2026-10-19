const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");
const React = require("react");

global.React = React;

// Exercise the actual submit handlers without a browser or database. React clears
// SyntheticEvent.currentTarget once the synchronous part of the handler ends.
function componentHarness(path, exportName) {
  const states = [];
  let stateIndex = 0;
  let effects = [];
  let refreshes = 0;
  const hooks = {
    ...React,
    useState(initial) {
      const index = stateIndex++;
      if (!(index in states)) states[index] = typeof initial === "function" ? initial() : initial;
      return [states[index], (next) => { states[index] = typeof next === "function" ? next(states[index]) : next; }];
    },
    useMemo: (compute) => compute(),
    useEffect: (effect) => { effects.push(effect); }
  };
  const originalLoad = Module._load;
  const resolved = require.resolve(path);
  delete require.cache[resolved];
  Module._load = function (request, parent, isMain) {
    if (request === "react") return hooks;
    if (request === "next/navigation") return { useRouter: () => ({ refresh: () => { refreshes++; } }) };
    return originalLoad.call(this, request, parent, isMain);
  };
  let Component;
  try { Component = require(resolved)[exportName]; }
  finally { Module._load = originalLoad; delete require.cache[resolved]; }
  return {
    render(props) { stateIndex = 0; effects = []; return Component(props); },
    flushEffects() { for (const effect of effects) effect(); },
    get states() { return states; },
    get refreshes() { return refreshes; }
  };
}

function findElements(node, predicate, result = []) {
  if (Array.isArray(node)) {
    for (const child of node) findElements(child, predicate, result);
  } else if (node && typeof node === "object" && node.props) {
    if (predicate(node)) result.push(node);
    findElements(node.props.children, predicate, result);
  }
  return result;
}

const brands = [{ id: 1, name: "Brand", slug: "brand", logoUrl: "", description: "Brand description", categoryCount: 1, moduleCount: 0,
  categories: [{ id: 2, name: "Category", slug: "category", description: "Category description", modules: [] }] }];

function fakeForm() {
  const fields = { name: "New item", slug: "new-item", logoUrl: "/logos/example.svg", description: "A meaningful description", brandId: "1", categoryId: "2", title: "New module", durationMin: "10" };
  return { fields, resets: 0, reset() { this.resets++; } };
}

async function withFormData(callback) {
  const original = global.FormData;
  global.FormData = class {
    constructor(form) { this.fields = { ...form.fields }; }
    get(name) { return this.fields[name] ?? null; }
  };
  try { await callback(); }
  finally { global.FormData = original; }
}

test("brand, category and module forms reset the captured form after React clears currentTarget", async () => {
  const originalFetch = global.fetch;
  try {
    await withFormData(async () => {
      for (const [index, entity] of ["brand", "category", "module"].entries()) {
        const notices = [];
        const harness = componentHarness("../components/admin/tabs/AdminContentTab.tsx", "AdminContentTab");
        const tree = harness.render({ role: "ADMIN", initialBrands: brands, portalPages: [], onNotice: (notice) => notices.push(notice) });
        const form = fakeForm();
        let resolveFetch;
        global.fetch = (_url, options) => {
          assert.equal(JSON.parse(options.body).entity, entity);
          return new Promise((resolve) => { resolveFetch = resolve; });
        };
        const submit = findElements(tree, (element) => element.type === "form")[index].props.onSubmit;
        const event = { preventDefault() {}, currentTarget: form };
        const pending = submit(event);
        event.currentTarget = null;
        resolveFetch(Response.json({ [entity]: { id: 7, name: "New item", title: "New module" } }));
        await pending;
        assert.equal(form.resets, 1, `${entity}: reset succeeds after the awaited response`);
        assert.equal(harness.refreshes, 1, `${entity}: the new item is refreshed exactly once`);
        assert.equal(notices.length, 1, `${entity}: no post-success exception is reported`);
        assert.match(notices[0], /додано|створено/);
        assert.equal(harness.states.at(-1), false, `${entity}: the submit button recovers`);
      }
    });
  } finally { global.fetch = originalFetch; }
});

test("admin create forms preserve the draft and unlock submission after network or invalid JSON failures", async () => {
  const originalFetch = global.fetch;
  try {
    await withFormData(async () => {
      for (const fail of [async () => { throw new TypeError("Failed to fetch"); }, async () => new Response("Not JSON", { status: 502 })]) {
        for (const index of [0, 1, 2]) {
          const notices = [];
          const harness = componentHarness("../components/admin/tabs/AdminContentTab.tsx", "AdminContentTab");
          const props = { role: "ADMIN", initialBrands: brands, portalPages: [], onNotice: (notice) => notices.push(notice) };
          const form = fakeForm();
          global.fetch = fail;
          const submit = findElements(harness.render(props), (element) => element.type === "form")[index].props.onSubmit;
          await submit({ preventDefault() {}, currentTarget: form });
          assert.equal(form.resets, 0, "failed requests must preserve entered data");
          assert.equal(form.fields.name, "New item");
          assert.equal(harness.refreshes, 0);
          assert.equal(harness.states.at(-1), false);
          assert.equal(notices.length, 1);
          assert.match(notices[0], /сервер|відповідь/);
          const buttons = findElements(harness.render(props), (element) => element.type === "button" && element.props.type === "submit");
          assert.equal(buttons[index].props.disabled, false, "the user can retry without reloading");
        }
      }
    });
  } finally { global.fetch = originalFetch; }
});

test("refreshed employee props replace stale rows and remove deleted selections", () => {
  const harness = componentHarness("../components/admin/tabs/AdminUsersTab.tsx", "AdminUsersTab");
  const user = (id, name) => ({ id, name, email: `${id}@example.test`, role: "SELLER", department: "Sales", position: "Seller", store: null, isActive: true, createdAt: "2026-10-01", _count: { progresses: 0, attempts: 0 } });
  const props = { currentUserId: "admin", role: "ADMIN", initialUsers: [user("one", "One"), user("two", "Two")], onNotice() {} };
  const first = harness.render(props);
  harness.flushEffects();
  const selectAll = findElements(first, (element) => element.type === "input" && element.props.type === "checkbox")[0];
  selectAll.props.onChange({ target: { checked: true } });
  assert.deepEqual(harness.states[2], ["one", "two"]);

  const refreshed = [user("one", "Updated one"), user("three", "New employee")];
  harness.render({ ...props, initialUsers: refreshed });
  harness.flushEffects();
  assert.deepEqual(harness.states[0], refreshed);
  assert.deepEqual(harness.states[2], ["one"], "deleted users cannot remain selected for later bulk actions");
  const tree = harness.render({ ...props, initialUsers: refreshed });
  const labels = findElements(tree, (element) => typeof element.props.children === "string").map((element) => element.props.children);
  assert.ok(labels.includes("Updated one"));
  assert.ok(labels.includes("New employee"));
  assert.equal(labels.includes("Two"), false);
});
