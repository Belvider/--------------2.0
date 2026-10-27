const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { LOCAL_LEARNING_MODEL_ASSETS, getLocalLearningModelViewer } = require('../lib/learning-model-assets.ts');
const { parseLearningGuide } = require('../lib/learning-guide.ts');

const publicDir = path.resolve(__dirname, '../public');
const modelDir = path.join(publicDir, 'models');
const expectedHash = 'a628339ba9960424b1e6285d31423be0dedf02a71b02e4e61f706a2e4bb8770e';
const asset = LOCAL_LEARNING_MODEL_ASSETS['iphone-15-pro-max'];

function assetFile(urlPath) {
  assert.match(urlPath, /^\/models\//, 'curated models must be packaged under the public model directory');
  const filename = path.resolve(publicDir, '.' + urlPath);
  assert.ok(filename.startsWith(modelDir + path.sep), 'asset path stays inside the shipped model directory');
  assert.ok(fs.statSync(filename).isFile(), `model asset exists: ${urlPath}`);
  return filename;
}

function parseGlb(bytes) {
  assert.ok(bytes.length >= 20, 'GLB has a complete header and first chunk');
  assert.equal(bytes.readUInt32LE(0), 0x46546c67, 'GLB magic');
  assert.equal(bytes.readUInt32LE(4), 2, 'GLB format version');
  assert.equal(bytes.readUInt32LE(8), bytes.length, 'declared byte length matches the shipped file');
  const chunks = [];
  let offset = 12;
  while (offset < bytes.length) {
    assert.ok(offset + 8 <= bytes.length, 'chunk header is complete');
    const length = bytes.readUInt32LE(offset), type = bytes.readUInt32LE(offset + 4);
    assert.equal(length % 4, 0, 'GLB chunks remain aligned');
    assert.ok(offset + 8 + length <= bytes.length, 'chunk content is complete');
    chunks.push({ type, data: bytes.subarray(offset + 8, offset + 8 + length) });
    offset += 8 + length;
  }
  assert.equal(offset, bytes.length);
  assert.equal(chunks[0]?.type, 0x4e4f534a, 'first GLB chunk contains JSON');
  const binary = chunks.find(chunk => chunk.type === 0x004e4942);
  assert.ok(binary, 'embedded geometry binary chunk exists');
  return { gltf: JSON.parse(chunks[0].data.toString('utf8')), binary };
}

test('the packaged native model is the reviewed complete GLB rather than a missing file or a different device', () => {
  for (const entry of Object.values(LOCAL_LEARNING_MODEL_ASSETS)) assetFile(entry.path);
  const bytes = fs.readFileSync(assetFile(asset.path));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), expectedHash, 'reviewed original model bytes are preserved');
  const { gltf, binary } = parseGlb(bytes);
  assert.equal(gltf.asset.version, '2.0');
  assert.equal(gltf.meshes.length, 31, 'the full reviewed device geometry is packaged');
  assert.equal(gltf.asset.extras.title, 'Apple iPhone 15 Pro Max Black');
  for (const image of gltf.images ?? []) {
    if (image.uri !== undefined) assert.match(image.uri, /^data:/, 'textures must not depend on an external host or missing relative image');
    else assert.ok(Number.isInteger(image.bufferView) && gltf.bufferViews[image.bufferView], 'texture data is embedded in a valid buffer view');
  }
  for (const buffer of gltf.buffers ?? []) {
    if (buffer.uri !== undefined) assert.match(buffer.uri, /^data:/, 'geometry must not depend on an external buffer');
    else assert.ok(buffer.byteLength > 0 && buffer.byteLength <= binary.data.length, 'geometry fits inside the embedded binary chunk');
  }
});

test('model attribution and all required local Draco decoder files ship with their licenses', () => {
  const { gltf } = parseGlb(fs.readFileSync(assetFile(asset.path)));
  const provenance = gltf.asset.extras;
  assert.match(provenance.author, /^polyman\b/i);
  assert.ok(provenance.author.includes(asset.authorUrl));
  assert.equal(provenance.source, asset.sourceUrl);
  assert.match(provenance.license, /^CC-BY-4\.0\b/);
  assert.match(provenance.license, /https?:\/\/creativecommons\.org\/licenses\/by\/4\.0\//);
  const attribution = fs.readFileSync(path.join(modelDir, 'ATTRIBUTION.md'), 'utf8');
  for (const value of [asset.author, asset.authorUrl, asset.sourceUrl, asset.licenseUrl, expectedHash]) assert.ok(attribution.includes(value), `published attribution retains ${value}`);

  assert.ok(gltf.extensionsRequired.includes('KHR_draco_mesh_compression'));
  const decoderDir = path.join(modelDir, 'draco');
  for (const name of ['draco_decoder.js', 'draco_wasm_wrapper.js', 'draco_decoder.wasm']) {
    const filename = path.join(decoderDir, name);
    assert.ok(fs.statSync(filename).isFile() && fs.statSync(filename).size > 1000, `local decoder is packaged: ${name}`);
  }
  const wasm = fs.readFileSync(path.join(decoderDir, 'draco_decoder.wasm'));
  assert.equal(wasm.readUInt32LE(0), 0x6d736100, 'decoder contains a WebAssembly module');
  const license = fs.readFileSync(path.join(decoderDir, 'LICENSE.txt'), 'utf8');
  assert.match(license, /Apache License/);
  assert.match(license, /Version 2\.0, January 2004/);
  assert.match(license, /END OF TERMS AND CONDITIONS/);
});

test('published iPhone learning metadata selects the shipped native device and keeps 18 Pro and Duo external', () => {
  const guides = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../content/learning-guides/iphone.json'), 'utf8'));
  const guide = parseLearningGuide(guides['2'], 2);
  assert.ok(guide, 'published module 2 guide passes the same validation used by the portal');
  const native = guide.models3d.filter(model => model.viewer?.provider === 'local');
  assert.equal(native.length, 1);
  assert.deepEqual(native[0], { title: asset.title, ...asset.presentation, viewer: getLocalLearningModelViewer('iphone-15-pro-max') });
  for (const [name, url] of [['iPhone 18 Pro', 'https://www.apple.com/iphone-18-pro/'], ['iPhone Duo', 'https://www.apple.com/iphone-duo/']]) {
    const model = guide.models3d.find(entry => entry.title.startsWith(name));
    assert.ok(model, `${name} retains its official reference`);
    assert.equal(model.url, url);
    assert.equal(Object.hasOwn(model, 'viewer'), false, `${name} does not launch a stalled external iframe`);
  }
});
