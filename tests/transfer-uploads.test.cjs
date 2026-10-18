const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const CONFIG = { BLOB_READ_WRITE_TOKEN: 'test-only-token' };

async function fixture(t, files = {}) {
  const root = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'portal-upload-transfer-test-')));
  t.after(async () => {
    const resolved = path.resolve(root);
    assert.equal(path.dirname(resolved), await fs.realpath(os.tmpdir()));
    assert.ok(path.basename(resolved).startsWith('portal-upload-transfer-test-'));
    await fs.rm(resolved, { recursive: true, force: true });
  });
  await fs.mkdir(path.join(root, 'public', 'uploads'), { recursive: true });
  for (const [key, content] of Object.entries(files)) {
    const filename = path.join(root, 'public', 'uploads', key);
    await fs.mkdir(path.dirname(filename), { recursive: true });
    await fs.writeFile(filename, content);
  }
  return root;
}

function fakeStore(initial = {}) {
  const files = new Map(Object.entries(initial).map(([key, value]) => [key, Buffer.from(value)]));
  const calls = { list: [], get: [], put: [] };
  const sdk = {
    list: async (options) => {
      calls.list.push(options);
      return { blobs: [...files.keys()].map((pathname) => ({ pathname })), hasMore: false };
    },
    get: async (key, options) => {
      calls.get.push({ key, options });
      return files.has(key)
        ? { statusCode: 200, stream: new Blob([files.get(key)]).stream() }
        : null;
    },
    put: async (key, bytes, options) => {
      calls.put.push({ key, options });
      if (files.has(key)) throw new Error('Must never overwrite an existing pathname');
      files.set(key, Buffer.from(bytes));
    }
  };
  return { files, calls, sdk };
}

test('upload transfer defaults to an offline dry-run and writes only aggregate counts', async (t) => {
  const { transferUploads } = await import('../scripts/transfer-uploads.mjs');
  const root = await fixture(t, { 'avatars/a.png': 'private-image', 'media/general/a.svg': '<svg/>' });
  const env = new Proxy({}, { get() { throw new Error('Dry-run must not read storage credentials'); } });
  const sdk = new Proxy({}, { get() { throw new Error('Dry-run must not contact a storage provider'); } });
  const { report, reportPath } = await transferUploads({ projectRoot: root, env, sdk });
  assert.equal(report.status, 'dry-run');
  assert.deepEqual(report.local, { files: 2, bytes: 19 });
  assert.deepEqual(report.uploaded, { files: 0, bytes: 0 });
  assert.equal(path.dirname(reportPath), path.join(root, 'reports'));
  const saved = await fs.readFile(reportPath, 'utf8');
  assert.deepEqual(JSON.parse(saved), report);
  for (const secret of ['private-image', 'avatars/a.png', '<svg/>', 'BLOB_READ_WRITE_TOKEN']) assert.equal(saved.includes(secret), false);
});

test('apply copies stable private paths and skips identical files after all target pages are listed', async (t) => {
  const { transferUploads } = await import('../scripts/transfer-uploads.mjs');
  const root = await fixture(t, { 'avatars/a.png': 'same', 'media/general/new.svg': '<svg/>' });
  const store = fakeStore({ 'avatars/a.png': 'same' });
  store.sdk.list = async (options) => {
    store.calls.list.push(options);
    return options.cursor
      ? { blobs: [{ pathname: 'avatars/a.png' }], hasMore: false }
      : { blobs: [{ pathname: 'unrelated/document.pdf' }], hasMore: true, cursor: 'page-2' };
  };
  const { report } = await transferUploads({ projectRoot: root, apply: true, env: CONFIG, sdk: store.sdk });
  assert.equal(report.status, 'complete');
  assert.deepEqual(report.identical, { files: 1, bytes: 4 });
  assert.deepEqual(report.uploaded, { files: 1, bytes: 6 });
  assert.deepEqual(store.calls.list, [{ cursor: undefined }, { cursor: 'page-2' }]);
  assert.deepEqual(store.calls.get, [{ key: 'avatars/a.png', options: { access: 'private', useCache: false } }]);
  assert.deepEqual(store.calls.put, [{ key: 'media/general/new.svg', options: {
    access: 'private', addRandomSuffix: false, allowOverwrite: false, contentType: 'image/svg+xml'
  } }]);
  assert.equal(store.files.get('media/general/new.svg').toString(), '<svg/>');
});

test('different bytes at an existing pathname abort before any pending new upload is written', async (t) => {
  const { transferUploads, UploadTransferError } = await import('../scripts/transfer-uploads.mjs');
  const root = await fixture(t, { 'avatars/a-new.png': 'new', 'avatars/z-existing.png': 'local' });
  const store = fakeStore({ 'avatars/z-existing.png': 'remote' });
  let reportPath;
  await assert.rejects(transferUploads({ projectRoot: root, apply: true, env: CONFIG, sdk: store.sdk }), (error) => {
    assert.ok(error instanceof UploadTransferError);
    assert.equal(error.report.status, 'failed');
    assert.equal(error.report.failureStage, 'conflict detection');
    assert.deepEqual(error.report.uploaded, { files: 0, bytes: 0 });
    reportPath = error.reportPath;
    return true;
  });
  assert.equal(JSON.parse(await fs.readFile(reportPath, 'utf8')).failureStage, 'conflict detection');
  assert.equal(store.calls.put.length, 0);
  assert.equal(store.files.get('avatars/z-existing.png').toString(), 'remote');
});

test('partial uploads are safely resumable without overwriting the successfully copied files', async (t) => {
  const { transferUploads } = await import('../scripts/transfer-uploads.mjs');
  const root = await fixture(t, { 'avatars/a.png': 'one', 'avatars/b.png': 'two' });
  const store = fakeStore();
  const put = store.sdk.put;
  let fail = true;
  store.sdk.put = async (...args) => {
    if (args[0] === 'avatars/b.png' && fail) throw new Error('Provider error contains secret-test-token');
    await put(...args);
  };
  await assert.rejects(transferUploads({ projectRoot: root, apply: true, env: CONFIG, sdk: store.sdk }), (error) => {
    assert.equal(error.report.failureStage, 'upload');
    assert.deepEqual(error.report.uploaded, { files: 1, bytes: 3 });
    assert.equal(error.message.includes('secret-test-token'), false);
    return true;
  });
  assert.equal(store.files.size, 1);
  fail = false;
  const { report } = await transferUploads({ projectRoot: root, apply: true, env: CONFIG, sdk: store.sdk });
  assert.deepEqual(report.identical, { files: 1, bytes: 3 });
  assert.deepEqual(report.uploaded, { files: 1, bytes: 3 });
  assert.equal(store.calls.put.filter((call) => call.key === 'avatars/a.png').length, 1);
  assert.equal(store.files.size, 2);
});

test('missing storage configuration fails before any storage call and OIDC configuration is supported', async (t) => {
  const { transferUploads } = await import('../scripts/transfer-uploads.mjs');
  const root = await fixture(t, { 'avatars/a.png': 'one' });
  const store = fakeStore();
  await assert.rejects(transferUploads({ projectRoot: root, apply: true, env: {}, sdk: store.sdk }), (error) => {
    assert.equal(error.report.failureStage, 'storage configuration');
    return true;
  });
  assert.equal(store.calls.list.length, 0);
  const { report } = await transferUploads({
    projectRoot: root, apply: true, env: { BLOB_STORE_ID: 'store-test', VERCEL_OIDC_TOKEN: 'test-oidc' }, sdk: store.sdk
  });
  assert.equal(report.status, 'complete');
});

test('symbolic links inside uploads are rejected before private files can be read or uploaded', async (t) => {
  const { transferUploads } = await import('../scripts/transfer-uploads.mjs');
  const root = await fixture(t);
  const external = path.join(root, 'private');
  await fs.mkdir(external);
  await fs.writeFile(path.join(external, 'secret.png'), 'private-outside-upload-root');
  try { await fs.symlink(external, path.join(root, 'public/uploads/linked'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) {
    if (['EPERM', 'EACCES'].includes(error.code)) { t.skip('Symlink creation is unavailable'); return; }
    throw error;
  }
  const store = fakeStore();
  await assert.rejects(transferUploads({ projectRoot: root, apply: true, env: CONFIG, sdk: store.sdk }), (error) => {
    assert.equal(error.report.failureStage, 'source validation');
    return true;
  });
  assert.equal(store.calls.list.length, 0);
  assert.equal(store.calls.put.length, 0);
});

test('unsafe URL and traversal pathnames are rejected while nested stable filenames are accepted', async () => {
  const { isSafeUploadPathname } = await import('../scripts/transfer-uploads.mjs');
  for (const key of ['../secret.png', '/avatars/a.png', 'avatars/../a.png', 'avatars\\a.png', 'a.png:stream',
    'avatars/%2e%2e/a.png', 'avatars/a.png?secret', 'avatars/a.png#fragment', 'avatars/ a.png', 'avatars/a.png/', '']) {
    assert.equal(isSafeUploadPathname(key), false, key);
  }
  assert.equal(isSafeUploadPathname('media/general/safe-file_123.png'), true);
});

test('invalid target pagination fails before uploads and remote errors never enter the report', async (t) => {
  const { transferUploads } = await import('../scripts/transfer-uploads.mjs');
  const root = await fixture(t, { 'avatars/a.png': 'one' });
  await assert.rejects(transferUploads({ projectRoot: root, apply: true, env: CONFIG, sdk: {
    list: async () => ({ blobs: [], hasMore: true })
  } }), (error) => {
    assert.equal(error.report.failureStage, 'target listing');
    return true;
  });
  let reportPath;
  await assert.rejects(transferUploads({ projectRoot: root, apply: true, env: CONFIG, sdk: {
    list: async () => { throw new Error('Token=secret-content'); }
  } }), (error) => {
    reportPath = error.reportPath;
    assert.equal(error.message.includes('secret-content'), false);
    return true;
  });
  assert.equal((await fs.readFile(reportPath, 'utf8')).includes('secret-content'), false);
});
