const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

function route(mocks) {
  const filename = path.resolve(__dirname, '../app/api/uploads/[...path]/route.ts');
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const installed = Module.createRequire(filename);
  loaded.require = (name) => Object.hasOwn(mocks, name) ? mocks[name] : installed(name);
  loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  }).outputText, filename);
  return loaded.exports;
}

const context = { params: Promise.resolve({ path: ['avatars', 'photo.jpg'] }) };
const request = () => new Request('https://example.invalid/api/uploads/avatars/photo.jpg');

test('private uploads require authentication before storage is accessed', async () => {
  let reads = 0;
  const { GET } = route({
    '@/lib/auth': { requireUser: async () => null },
    '@/lib/upload-storage': { getStoredUpload: async () => { reads++; } }
  });
  const result = await GET(request(), context);
  assert.equal(result.status, 401);
  assert.equal(reads, 0);
});

test('authenticated uploads keep their MIME type and cannot enter a shared cache', async () => {
  const { GET } = route({
    '@/lib/auth': { requireUser: async () => ({ id: 'test-user' }) },
    '@/lib/upload-storage': { getStoredUpload: async (key) => {
      assert.equal(key, 'avatars/photo.jpg');
      return { data: new TextEncoder().encode('private-photo').buffer, contentType: 'image/jpeg' };
    } }
  });
  const result = await GET(request(), context);
  assert.equal(result.status, 200);
  assert.equal(result.headers.get('content-type'), 'image/jpeg');
  assert.equal(result.headers.get('cache-control'), 'private, no-store');
  assert.equal(result.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(result.headers.get('content-security-policy'), "default-src 'none'; sandbox");
  assert.equal(await result.text(), 'private-photo');
});

test('missing private uploads return 404 to authenticated users', async () => {
  const { GET } = route({
    '@/lib/auth': { requireUser: async () => ({ id: 'test-user' }) },
    '@/lib/upload-storage': { getStoredUpload: async () => null }
  });
  assert.equal((await GET(request(), context)).status, 404);
});
