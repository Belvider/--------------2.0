const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Each load gets its own process/env object and mocked backends. These tests
// never load .env files, change the real environment, or call a storage service.
function source(relative, { env = {}, mocks = {}, cache = new Map() } = {}) {
  const filename = path.resolve(__dirname, '..', relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const loaded = { exports: {} };
  cache.set(filename, loaded);
  const requireInstalled = Module.createRequire(filename);
  const scopedRequire = (request) => {
    if (Object.hasOwn(mocks, request)) return mocks[request];
    if (request.startsWith('@/')) return source(request.slice(2) + '.ts', { env, mocks, cache });
    return requireInstalled(request);
  };
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  }).outputText;
  new Function('require', 'module', 'exports', 'process', compiled)(
    scopedRequire, loaded, loaded.exports, { env, cwd: () => process.cwd() }
  );
  return loaded.exports;
}

const denyDisk = Object.fromEntries(['mkdir', 'readFile', 'readdir', 'stat', 'writeFile', 'unlink'].map((name) => [
  name, async () => { throw new Error('Unexpected disk operation: ' + name); }
]));
const image = () => new File(['private-image'], 'avatar.png', { type: 'image/png' });
const storage = (env, sdk = {}, fsMock = denyDisk) => source('lib/upload-storage.ts', {
  env, mocks: { '@vercel/blob': sdk, 'node:fs/promises': fsMock }
});
const vercelEnv = { VERCEL: '1', BLOB_READ_WRITE_TOKEN: 'test-token' };

test('Vercel Blob credentials are separate from Netlify and support connected-store OIDC', () => {
  const runtime = storage(vercelEnv);
  assert.equal(runtime.isVercelBlobStorageEnabled(), true);
  assert.equal(runtime.isNetlifyBlobStorageEnabled(), false);
  assert.equal(runtime.isLocalUploadStorageEnabled(), false);
  assert.equal(storage({ NETLIFY: 'true' }).isNetlifyBlobStorageEnabled(), true);
  assert.equal(storage({ BLOB_STORE_ID: 'store-test', VERCEL_OIDC_TOKEN: 'test-oidc' }).isVercelBlobStorageEnabled(), true);
  assert.equal(storage({ BLOB_STORE_ID: 'store-test' }).isVercelBlobStorageEnabled(), false);
  assert.equal(storage({ BLOB_STORE_ID: 'store-test' }).isLocalUploadStorageEnabled(), true);
  assert.equal(storage({}).isLocalUploadStorageEnabled(), true);
});

test('Vercel connected stores let the SDK authenticate through the request-context OIDC token', async () => {
  for (const env of [
    { VERCEL: '1', BLOB_STORE_ID: 'store-test' },
    { VERCEL_ENV: 'production', BLOB_STORE_ID: 'store-test' }
  ]) {
    const calls = [];
    // The SDK obtains the OIDC token from Vercel's request context. It need not
    // be copied into process.env or passed through this storage adapter.
    const runtime = storage(env, {
      put: async (...args) => { calls.push(['put', ...args]); },
      get: async (...args) => {
        calls.push(['get', ...args]);
        return { statusCode: 200, stream: new Blob(['avatar-bytes']).stream(), blob: { contentType: 'image/png' } };
      }
    });
    assert.equal(runtime.isVercelBlobStorageEnabled(), true);
    assert.equal(runtime.isLocalUploadStorageEnabled(), false);
    const saved = await runtime.saveUploadFile({ key: 'avatars/context.png', file: image(), metadata: { kind: 'avatar' } });
    assert.equal(saved.url, '/uploads/avatars/context.png');
    assert.equal(calls[0][0], 'put');
    assert.equal(calls[0][3].access, 'private');
    assert.equal(Object.hasOwn(calls[0][3], 'token'), false);
    assert.equal(Object.hasOwn(calls[0][3], 'oidcToken'), false);
    assert.equal(Buffer.from((await runtime.getStoredUpload('avatars/context.png')).data).toString(), 'avatar-bytes');
    assert.deepEqual(calls[1], ['get', 'avatars/context.png', { access: 'private' }]);
  }
});

test('Vercel saves privately, preserves application URLs, reads via authenticated SDK and deletes by pathname', async () => {
  const calls = [];
  const runtime = storage(vercelEnv, {
    put: async (...args) => { calls.push(['put', ...args]); },
    get: async (...args) => {
      calls.push(['get', ...args]);
      return { statusCode: 200, stream: new Blob(['private-image']).stream(), blob: { contentType: 'image/png' } };
    },
    del: async (...args) => { calls.push(['del', ...args]); }
  });
  const saved = await runtime.saveUploadFile({ key: 'avatars/person-123.png', file: image(), metadata: { kind: 'avatar' } });
  assert.equal(saved.url, '/uploads/avatars/person-123.png');
  assert.equal(calls[0][1], 'avatars/person-123.png');
  assert.equal(Buffer.from(calls[0][2]).toString(), 'private-image');
  assert.deepEqual(calls[0][3], { access: 'private', addRandomSuffix: false, allowOverwrite: false, contentType: 'image/png' });
  const loaded = await runtime.getStoredUpload('avatars/person-123.png');
  assert.equal(Buffer.from(loaded.data).toString(), 'private-image');
  assert.equal(loaded.contentType, 'image/png');
  assert.deepEqual(calls[1], ['get', 'avatars/person-123.png', { access: 'private' }]);
  await runtime.deleteUploadByUrl(saved.url);
  assert.deepEqual(calls[2], ['del', 'avatars/person-123.png']);
});

test('Vercel lists every page with an exact folder boundary and derives admin metadata', async () => {
  const requests = [];
  const uploadedAt = new Date('2026-10-18T09:00:00Z');
  const runtime = storage(vercelEnv, {
    list: async (options) => {
      requests.push(options);
      return options.cursor
        ? { blobs: [{ pathname: 'media/general/b.webp', size: 34, uploadedAt }], hasMore: false }
        : { blobs: [
          { pathname: 'media/general/a.png', size: 12, uploadedAt },
          { pathname: 'media-private/secret.png', size: 10, uploadedAt },
          { pathname: 'media/../secret.png', size: 10, uploadedAt }
        ], hasMore: true, cursor: 'page-2' };
    }
  });
  const items = await runtime.listBlobUploads('media');
  assert.deepEqual(requests, [{ prefix: 'media/', cursor: undefined }, { prefix: 'media/', cursor: 'page-2' }]);
  assert.deepEqual(items.map((item) => item.key), ['media/general/a.png', 'media/general/b.webp']);
  assert.deepEqual(items[0].metadata, { contentType: 'image/png', size: 12, updatedAt: uploadedAt.toISOString() });
});

test('Vercel without durable storage rejects mutations before reading bytes or touching disk', async () => {
  for (const env of [{ VERCEL: '1' }, { VERCEL_ENV: 'production' }]) {
    const runtime = storage(env);
    let readBytes = false;
    await assert.rejects(runtime.saveUploadFile({
      key: 'avatars/test.png',
      file: { type: 'image/png', size: 1, arrayBuffer: async () => { readBytes = true; } },
      metadata: { kind: 'avatar' }
    }), (error) => {
      assert.ok(error instanceof runtime.UploadStorageConfigurationError);
      assert.equal(error.name, 'UploadStorageConfigurationError');
      assert.match(error.message, /private Vercel Blob store/);
      return true;
    });
    assert.equal(readBytes, false);
    await assert.rejects(runtime.deleteUploadByKey('avatars/test.png'), runtime.UploadStorageConfigurationError);
    await assert.rejects(runtime.deleteUploadByUrl('/uploads/avatars/test.png'), runtime.UploadStorageConfigurationError);
  }
});

test('admin media never creates local folders on Vercel, with or without storage configured', async () => {
  for (const env of [{ VERCEL: '1' }, vercelEnv]) {
    const saved = [];
    const admin = source('lib/admin-media.ts', {
      env,
      mocks: {
        'node:fs/promises': denyDisk,
        '@vercel/blob': {
          list: async () => ({ blobs: [], hasMore: false }),
          put: async (...args) => { saved.push(args); }
        }
      }
    });
    await admin.ensureAdminMediaDirectories();
    assert.deepEqual(await admin.listAdminMedia(), []);
    if (env.BLOB_READ_WRITE_TOKEN) {
      const result = await admin.saveAdminMedia(image(), 'general');
      assert.match(result.url, /^\/uploads\/media\/general\/.+\.png$/);
      assert.equal(saved.length, 1);
    } else {
      await assert.rejects(admin.saveAdminMedia(image(), 'general'), /private Vercel Blob store/);
    }
  }
});

test('a store ID without local credentials keeps save, read and delete on local disk', async () => {
  const calls = [];
  const runtime = storage({ BLOB_STORE_ID: 'store-test' }, {}, {
    mkdir: async (...args) => { calls.push(['mkdir', ...args]); },
    writeFile: async (...args) => { calls.push(['writeFile', ...args]); },
    readFile: async (key) => { calls.push(['readFile', key]); return Buffer.from('local-image'); },
    unlink: async (key) => { calls.push(['unlink', key]); }
  });
  const key = 'media/general/local.png';
  await runtime.saveUploadFile({ key, file: image(), metadata: { kind: 'media' } });
  const loaded = await runtime.getStoredUpload(key);
  assert.equal(Buffer.from(loaded.data).toString(), 'local-image');
  await runtime.deleteUploadByKey(key);
  const localPath = path.resolve('public/uploads', key);
  assert.equal(calls[0][1], path.dirname(localPath));
  assert.equal(calls[1][1], localPath);
  assert.equal(calls[2][1], localPath);
  assert.equal(calls[3][1], localPath);
});

test('Netlify save, read, delete and metadata listing continue to use the Netlify store', async () => {
  const calls = [];
  const metadata = { kind: 'media', contentType: 'image/png', size: 13, updatedAt: '2026-10-18T09:00:00Z' };
  const store = {
    set: async (...args) => { calls.push(['set', ...args]); },
    delete: async (...args) => { calls.push(['delete', ...args]); },
    getWithMetadata: async () => ({ data: new Uint8Array([1, 2]).buffer, metadata }),
    list: async () => ({ blobs: [{ key: 'media/general/test.png' }] }),
    getMetadata: async () => ({ metadata })
  };
  const runtime = source('lib/upload-storage.ts', {
    env: { NETLIFY: 'true' },
    mocks: {
      'node:fs/promises': denyDisk,
      '@netlify/blobs': { getStore: (name) => { assert.equal(name, 'portal-uploads'); return store; } }
    }
  });
  await runtime.saveUploadFile({ key: 'media/general/test.png', file: image(), metadata });
  assert.deepEqual(calls[0][3], { metadata });
  assert.equal((await runtime.getStoredUpload('media/general/test.png')).contentType, 'image/png');
  assert.deepEqual(await runtime.listBlobUploads('media'), [{ key: 'media/general/test.png', metadata }]);
  await runtime.deleteUploadByKey('media/general/test.png');
  assert.deepEqual(calls[1], ['delete', 'media/general/test.png']);
});

test('traversal and malformed keys are rejected before any storage backend runs', async () => {
  const runtime = storage(vercelEnv);
  for (const key of ['../file.png', 'avatars/../file.png', '%2e%2e%5cfile.png', 'avatars/file.png:stream', 'avatars/%00file.png', '%bad']) {
    assert.equal(runtime.getLocalUploadPathFromKey(key), null, key);
    assert.equal(await runtime.getStoredUpload(key), null, key);
    await assert.rejects(runtime.saveUploadFile({ key, file: image(), metadata: { kind: 'avatar' } }));
    await assert.rejects(runtime.deleteUploadByKey(key));
    await assert.rejects(runtime.listBlobUploads(key));
  }
});

test('missing private blobs return null while provider errors do not fall back to disk', async () => {
  assert.equal(await storage(vercelEnv, { get: async () => null }).getStoredUpload('avatars/missing.png'), null);
  const error = new Error('Storage unavailable');
  await assert.rejects(storage(vercelEnv, { get: async () => { throw error; } }).getStoredUpload('avatars/test.png'), error);
  await assert.rejects(storage(vercelEnv, { put: async () => { throw error; } }).saveUploadFile({
    key: 'avatars/test.png', file: image(), metadata: { kind: 'avatar' }
  }), error);
  const oidcEnv = { VERCEL: '1', BLOB_STORE_ID: 'store-test' };
  await assert.rejects(storage(oidcEnv, { put: async () => { throw error; } }).saveUploadFile({
    key: 'avatars/test.png', file: image(), metadata: { kind: 'avatar' }
  }), error);
});

test('an invalid pagination cursor fails instead of returning a partial or looping list', async () => {
  await assert.rejects(storage(vercelEnv, { list: async () => ({ blobs: [], hasMore: true }) }).listBlobUploads('media'), /pagination cursor/);
});
