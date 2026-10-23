const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), Module = require('node:module'), ts = require('typescript');
const policy = require('../lib/avatar-upload.ts');
class UploadStorageConfigurationError extends Error {}

function fixture(options = {}) {
  const calls = { saved: [], updated: [], deleted: [], read: 0 };
  const filename = path.resolve(__dirname, '../app/api/profile/avatar/route.ts');
  const loaded = new Module(filename, module); loaded.filename = filename; loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const installed = Module.createRequire(filename);
  const mocks = {
    '@/lib/auth': { requireUser: async () => options.anonymous ? null : { id: 'current-user' } },
    '@/lib/avatar-upload': policy,
    '@/lib/prisma': { prisma: { user: {
      findUnique: async input => { calls.read++; assert.deepEqual(input.where, { id: 'current-user' }); return { avatarUrl: '/uploads/avatars/previous.png' }; },
      update: async input => { calls.updated.push(input); if (options.databaseError) throw Error('private database detail'); return {}; }
    } } },
    '@/lib/upload-storage': {
      UploadStorageConfigurationError,
      saveUploadFile: async input => { calls.saved.push(input); if (options.storageError) throw options.storageError; return { url: '/uploads/'+input.key }; },
      deleteUploadByUrl: async url => { calls.deleted.push(url); if (options.cleanupError) throw Error('private cleanup detail'); }
    }
  };
  loaded.require = name => Object.hasOwn(mocks,name) ? mocks[name] : installed(name);
  loaded._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,filename);
  return { ...loaded.exports, calls };
}

function upload(file = new File(['image-data'], 'photo.png', { type: 'image/png' })) {
  const form = new FormData(); if (file) form.append('avatar',file);
  return new Request('https://example.invalid/api/profile/avatar', { method:'POST',body:form });
}

test('avatar mutations deny anonymous requests before any profile or storage operation', async () => {
  const api = fixture({anonymous:true});
  assert.equal((await api.POST(upload())).status,401);
  assert.equal((await api.DELETE()).status,401);
  assert.equal(api.calls.read,0); assert.equal(api.calls.saved.length,0); assert.equal(api.calls.updated.length,0);
});

test('avatar upload rejects malformed, unsupported, empty and oversized files before touching storage', async () => {
  for (const [request,status] of [
    [new Request('https://example.invalid',{method:'POST',body:'text'}),400],
    [new Request('https://example.invalid',{method:'POST',headers:{'content-type':'multipart/form-data; boundary=broken'},body:'invalid'}),400],
    [upload(null),400], [upload('not-a-file'),400],
    [upload(new File(['image'],'photo.heic',{type:'image/heic'})),400],
    [upload(new File([],'empty.png',{type:'image/png'})),400],
    [upload(new File([new Uint8Array(policy.MAX_AVATAR_FILE_SIZE+1)],'large.png',{type:'image/png'})),413],
    [new Request('https://example.invalid',{method:'POST',headers:{'content-type':'multipart/form-data; boundary=test','content-length':String(policy.MAX_AVATAR_FILE_SIZE+65*1024)},body:''}),413]
  ]) {
    const api=fixture(); const response=await api.POST(request);
    assert.equal(response.status,status); assert.equal(typeof(await response.json()).error,'string');
    assert.equal(api.calls.read,0); assert.equal(api.calls.saved.length,0); assert.equal(api.calls.updated.length,0);
  }
});

test('valid avatar upload saves unique names for the signed-in user and removes only the previous file after committing', async () => {
  const api=fixture();
  const responses=await Promise.all([api.POST(upload()),api.POST(upload())]);
  assert.deepEqual(responses.map(r=>r.status),[200,200]);
  const urls=await Promise.all(responses.map(r=>r.json()));
  assert.notEqual(urls[0].avatarUrl,urls[1].avatarUrl);
  assert.equal(api.calls.saved.length,2);
  for(const entry of api.calls.saved){assert.match(entry.key,/^avatars\/current-user-[a-f0-9-]{36}\.png$/);assert.equal(entry.metadata.kind,'avatar');}
  for(const entry of api.calls.updated){assert.deepEqual(entry.where,{id:'current-user'});assert.equal(Object.keys(entry.data).join(','),'avatarUrl');}
  assert.deepEqual(api.calls.deleted,['/uploads/avatars/previous.png','/uploads/avatars/previous.png']);
});

test('old-file cleanup failure cannot turn a committed avatar upload or removal into an error', async () => {
  const api=fixture({cleanupError:true});
  assert.equal((await api.POST(upload())).status,200);
  assert.equal((await api.DELETE()).status,200);
  assert.deepEqual(api.calls.updated.at(-1),{where:{id:'current-user'},data:{avatarUrl:null}});
});

test('database failure cleans up the new file while preserving the previous avatar', async () => {
  const api=fixture({databaseError:true}); const response=await api.POST(upload());
  assert.equal(response.status,500); assert.equal(api.calls.deleted.length,1);
  assert.equal(api.calls.deleted[0],'/uploads/'+api.calls.saved[0].key);
  assert.equal(api.calls.deleted.includes('/uploads/avatars/previous.png'),false);
  assert.equal(JSON.stringify(await response.json()).includes('private database detail'),false);
});

test('storage failure preserves the profile and returns a safe retryable error', async () => {
  for(const [error,status] of [[new UploadStorageConfigurationError('secret storage configuration'),503],[Error('secret provider token'),500]]) {
    const api=fixture({storageError:error}); const response=await api.POST(upload()); const data=await response.json();
    assert.equal(response.status,status); assert.equal(api.calls.updated.length,0); assert.equal(api.calls.deleted.length,0);
    assert.equal(typeof data.error,'string'); assert.equal(JSON.stringify(data).includes('secret'),false);
  }
});
