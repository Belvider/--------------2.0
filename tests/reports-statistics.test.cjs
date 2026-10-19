const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

function loadReports(user, prisma) {
  const filename = path.resolve(__dirname, '../app/api/admin/reports/route.ts');
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const installed = Module.createRequire(filename);
  loaded.require = request => {
    if (request === '@/lib/auth') return { requireRole: async () => user };
    if (request === '@/lib/prisma') return { prisma };
    return installed(request);
  };
  loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText, filename);
  return loaded.exports.GET;
}

test('reports include employees with no progress, including when no one has started', async () => {
  const employees = [
    { id: 'new', name: 'New employee', department: 'Test', store: null },
    { id: 'learner', name: 'Learner', department: 'Test', store: null }
  ];
  let progress = [];
  const GET = loadReports({ role: 'MANAGER' }, {
    user: { findMany: async () => employees },
    userProgress: { findMany: async () => progress },
    quizAttempt: { findMany: async () => [] }
  });
  const request = () => new Request('http://localhost:3000/api/admin/reports');
  const empty = await (await GET(request())).json();
  assert.equal(empty.summary.users, 2);
  assert.equal(empty.summary.notStartedUsers, 2);
  assert.equal(empty.rows.length, 2);

  progress = [{ userId: 'learner', moduleId: 1, status: 'COMPLETED', user: employees[1],
    module: { title: 'Lesson', category: { name: 'Category', brand: { name: 'Brand' } } } }];
  const started = await (await GET(request())).json();
  assert.equal(started.summary.notStartedUsers, 1);
  assert.equal(started.summary.completedModules, 1);
  assert.equal(started.rows.find(row => row.userId === 'new').total, 0);
});

test('reports reject unauthorized requests before querying employee data', async () => {
  const GET = loadReports(null, new Proxy({}, { get() { throw new Error('Unexpected database access'); } }));
  const response = await GET(new Request('http://localhost:3000/api/admin/reports'));
  assert.equal(response.status, 403);
});
