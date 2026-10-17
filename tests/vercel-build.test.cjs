const test = require("node:test");
const assert = require("node:assert/strict");

function productionEnv(overrides = {}) {
  return {
    VERCEL_ENV: "production",
    PORTAL_RUN_MIGRATIONS: "true",
    JWT_SECRET: "x".repeat(64),
    DATABASE_URL: "postgresql://test@example.invalid/portal",
    DATABASE_URL_UNPOOLED: "postgresql://test@direct.example.invalid/portal",
    ...overrides
  };
}

function captureRun() {
  const calls = [];
  return {
    calls,
    execute: (command, args, options) => {
      calls.push({ command, args, options });
      return { status: 0 };
    }
  };
}

test("Vercel production setup passes Neon direct URL to migrations and keeps the pooled runtime URL", async () => {
  const { buildVercelProject } = await import("../scripts/vercel-build.mjs");
  const env = productionEnv();
  const run = captureRun();
  buildVercelProject(env, run.execute);
  assert.deepEqual(run.calls.map((call) => call.args.slice(1)), [["generate"], ["migrate", "deploy"], ["build"]]);
  assert.equal(run.calls[1].options.env.DIRECT_URL, env.DATABASE_URL_UNPOOLED);
  assert.equal(run.calls[1].options.env.DATABASE_URL, env.DATABASE_URL);
  assert.equal(env.DIRECT_URL, undefined);
  assert.ok(run.calls.every((call) => call.command === process.execPath));
});

test("preview, development and other Vercel projects do not run database migrations", async () => {
  const { buildVercelProject } = await import("../scripts/vercel-build.mjs");
  for (const overrides of [
    { VERCEL_ENV: "preview" },
    { VERCEL_ENV: "development" },
    { PORTAL_RUN_MIGRATIONS: undefined },
    { PORTAL_RUN_MIGRATIONS: "false" },
    { VERCEL_ENV: undefined }
  ]) {
    const run = captureRun();
    buildVercelProject(productionEnv(overrides), run.execute);
    assert.deepEqual(run.calls.map((call) => call.args.slice(1)), [["generate"], ["build"]]);
  }
});

test("missing JWT or database configuration stops production before any process or DB write", async () => {
  const { buildVercelProject } = await import("../scripts/vercel-build.mjs");
  for (const overrides of [
    { JWT_SECRET: undefined },
    { JWT_SECRET: "too-short" },
    { DATABASE_URL: undefined },
    { DATABASE_URL_UNPOOLED: undefined },
    { DIRECT_URL: "not-a-postgres-url" },
    { DATABASE_URL: "https://example.invalid" }
  ]) {
    const run = captureRun();
    assert.throws(() => buildVercelProject(productionEnv(overrides), run.execute), /JWT_SECRET|DATABASE_URL|DIRECT_URL/);
    assert.equal(run.calls.length, 0);
  }
});

test("explicit DIRECT_URL takes precedence over provider aliases", async () => {
  const { buildVercelProject } = await import("../scripts/vercel-build.mjs");
  const env = productionEnv({ DIRECT_URL: "postgresql://test@explicit.example.invalid/portal" });
  const run = captureRun();
  buildVercelProject(env, run.execute);
  assert.equal(run.calls[1].options.env.DIRECT_URL, env.DIRECT_URL);
});

test("legacy direct URL alias works and a failed migration prevents Next.js from building", async () => {
  const { buildVercelProject } = await import("../scripts/vercel-build.mjs");
  const env = productionEnv({ DATABASE_URL_UNPOOLED: undefined, POSTGRES_URL_NON_POOLING: "postgresql://test@legacy.example.invalid/portal" });
  const calls = [];
  assert.throws(() => buildVercelProject(env, (command, args, options) => {
    calls.push({ args, env: options.env });
    return { status: args.includes("deploy") ? 1 : 0 };
  }), /migrations failed/);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].env.DIRECT_URL, env.POSTGRES_URL_NON_POOLING);
});
