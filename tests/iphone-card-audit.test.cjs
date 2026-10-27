const test = require('node:test');
const assert = require('node:assert/strict');
const { iphoneProductCatalog } = require('../lib/content/apple-iphone.ts');
const guide = require('../content/learning-guides/iphone.json')['2'];
const review = require('../content/reviews/2026-10-27-iphone-cards.json');
const audit = require('../content/audits/2026-10-27-iphone-cards.json');
const { parseLearningGuide } = require('../lib/learning-guide.ts');
const { getProductAnchor, getProductDetailAnchor } = require('../lib/content-anchors.ts');
const { buildPortalSearchIndex, searchPortalIndex } = require('../lib/portal-search.ts');
const { iphoneCatalogBlocks } = require('../lib/content/apple-iphone.ts');

test('the card review preserves positional search targets, device ordering and existing learning media', () => {
  assert.equal(iphoneProductCatalog.length, 24);
  assert.deepEqual(iphoneProductCatalog.map(p=>p.slug), Array.from({length:24},(_,i)=>`iphone-${i+1}`));
  for (const edit of review.edits) {
    assert.equal(edit.moduleId, 2);
    assert.match(edit.path, /^\/contentBlocks\//);
    if (edit.path.startsWith('/contentBlocks/2/products/')) {
      assert.equal(typeof edit.before, 'string'); assert.equal(typeof edit.after, 'string');
      const [, , , , index, group, item] = edit.path.split('/');
      const anchor=getProductAnchor('module-2-topic-3',Number(index));
      assert.ok(['overview','highlights','colors'].includes(group));
      assert.equal(getProductDetailAnchor(anchor,group==='overview'?'spec':group==='highlights'?'highlight':'color',Number(item)), `${anchor}-${group==='overview'?'spec':group==='highlights'?'highlight':'color'}-${Number(item)+1}`);
    }
  }
  assert.ok(parseLearningGuide(guide,2));
  assert.equal(guide.models3d[0].viewer.provider,'local');
  assert.equal(guide.models3d[0].viewer.assetId,'iphone-15-pro-max');
});

test('every audited textual card field has source coverage and every model retains its own official specification', () => {
  assert.equal(audit.coverage.length,24);
  let count=0;
  for (const card of audit.coverage) {
    assert.equal(iphoneProductCatalog[card.productIndex].slug,card.slug);
    const anchor=`module-2-topic-3-product-${card.productIndex+1}`;
    assert.ok(guide.sources.some(s=>s.id.startsWith('spec-')&&s.anchors.includes(anchor)));
    const fields=new Set();
    for(const field of card.fields){
      assert.ok(!fields.has(field.path)); fields.add(field.path); count++;
      const actual=field.path.slice(1).split('/').reduce((value,key)=>value[key],iphoneProductCatalog[card.productIndex]);
      assert.equal(typeof actual,'string'); assert.ok(field.sources.length);
      assert.ok(field.sources.every(url=>new URL(url).hostname==='www.apple.com'||new URL(url).hostname==='support.apple.com'));
    }
    for(const field of ['title',...iphoneProductCatalog[card.productIndex].overview.map((_,i)=>`overview/${i}`),...iphoneProductCatalog[card.productIndex].highlights.map((_,i)=>`highlights/${i}`)])assert.ok(fields.has('/'+field));
    assert.ok(card.media.every(m=>m.exists));
  }
  assert.equal(count,audit.fieldCount);
});

test('Ukrainian memory units remain searchable through Latin or Cyrillic queries and point to the same field', () => {
  const index=buildPortalSearchIndex({modules:[{id:2,title:'iPhone',description:'',durationMin:1,contentBlocks:iphoneCatalogBlocks,
    category:{name:'iPhone',slug:'iphone',brand:{name:'Apple',slug:'apple'}}}]});
  for(const [latin,ukrainian,target] of [
    ['iPhone 15 Pro 128 GB','iPhone 15 Pro 128 ГБ','/module/2#module-2-topic-3-product-15-spec-3'],
    ['iPhone 18 Pro 2TB','iPhone 18 Pro 2ТБ','/module/2#module-2-topic-3-product-22-spec-3']
  ]) {
    const a=searchPortalIndex(index,latin),b=searchPortalIndex(index,ukrainian);
    assert.ok(a.results.some(result=>result.href===target));
    assert.deepEqual(a.results.map(r=>r.href),b.results.map(r=>r.href));
    assert.ok(a.results.some(result=>/ГБ|ТБ/.test(result.snippet)));
  }
});
