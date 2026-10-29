const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { appleWatchFoundationBlocks, appleWatchCatalogBlocks } = require('../lib/content/apple-watch.ts');
const { getModuleBlockAnchor, getProductAnchor, getProductDetailAnchor, getFactAnchor, prepareSearchableHtml } = require('../lib/content-anchors.ts');
const review = require('../content/reviews/2026-10-29-apple-watch-focused.json');
const library = import('../scripts/apply-content-review.mjs');
const read = (value,path) => path.slice(1).split('/').reduce((current,key)=>current[key],value);
function set(value,path,next) {
  const parts = path.slice(1).split('/'), key = parts.pop();
  parts.reduce((current,key)=>current[key],value)[key] = structuredClone(next);
}
function sourceModules() {
  return review.modules.map(identity=>({
    id:identity.id, categoryId:identity.categoryId, category:{slug:identity.categorySlug,brand:{slug:identity.brandSlug}},
    title:'Existing module title', description: identity.id === 9 ? review.edits.find(e=>e.path==='/description').after : 'Independent online description',
    contentBlocks:structuredClone(identity.id===9 ? appleWatchFoundationBlocks : appleWatchCatalogBlocks),
    questions:identity.questionIds.map(id=>({id,moduleId:identity.id,question:'Unchanged question '+id,options:['A','B'],correctAnswer:{index:1}}))
  }));
}
function beforeModules() {
  const modules=sourceModules();
  for(const edit of review.edits)set(modules.find(m=>m.id===edit.moduleId),edit.path,edit.before);
  return modules;
}
function targets(module) {
  return module.contentBlocks.flatMap((block,blockIndex)=>{
    const base=getModuleBlockAnchor(module.id,blockIndex), anchors=[base];
    if(block.type==='text')anchors.push(...prepareSearchableHtml(block.html,base).fragments.map(f=>f.anchor));
    if(block.type==='facts')anchors.push(...block.items.map((_,i)=>getFactAnchor(base,i)));
    if(block.type==='productCatalog')for(const [i,product] of block.products.entries()) {
      const productAnchor=getProductAnchor(base,i); anchors.push(product.slug,productAnchor);
      if(product.summary)anchors.push(getProductDetailAnchor(productAnchor,'summary'));
      for(const [field,kind] of [['overview','spec'],['highlights','highlight'],['colors','color']])anchors.push(...product[field].map((_,j)=>getProductDetailAnchor(productAnchor,kind,j)));
    }
    return anchors;
  });
}

test('focused Watch review applies seven fields while preserving all old targets, cards and questions', async()=>{
  const {prepareContentReview}=await library;
  const before=beforeModules(), untouched=structuredClone(before), plan=prepareContentReview(before,review);
  assert.equal(review.edits.length,7); assert.equal(plan.entries.length,2); assert.deepEqual(plan.conflicts,[]);
  assert.deepEqual(before,untouched,'planning must not mutate the current material');
  const after=structuredClone(before);
  for(const entry of plan.entries) {
    assert.deepEqual(entry.questions,[]);
    Object.assign(after.find(m=>m.id===entry.id),entry.data);
  }
  for(const [i,module] of after.entries()) {
    assert.equal(module.contentBlocks.length,i===0?9:7);
    assert.deepEqual(module.questions,before[i].questions);
    const oldCards=before[i].contentBlocks.flatMap(b=>b.products??[]), newCards=module.contentBlocks.flatMap(b=>b.products??[]);
    assert.equal(newCards.length,i===0?0:17);
    assert.deepEqual(newCards.map(p=>({slug:p.slug,title:p.title,overview:p.overview.length,highlights:p.highlights.length,colors:p.colors})),oldCards.map(p=>({slug:p.slug,title:p.title,overview:p.overview.length,highlights:p.highlights.length,colors:p.colors})));
    assert.deepEqual(targets(module),targets(before[i]),'all pre-existing target identities and counts remain exactly equal');
    assert.equal(module.title,before[i].title);
  }
  assert.equal(after[1].description,'Independent online description');
  for(const edit of review.edits.filter(e=>e.path.endsWith('/html'))) {
    const blockIndex=Number(edit.path.split('/')[2]),base=getModuleBlockAnchor(edit.moduleId,blockIndex);
    assert.deepEqual(prepareSearchableHtml(edit.after,base).fragments.map(f=>f.anchor),prepareSearchableHtml(edit.before,base).fragments.map(f=>f.anchor),'modified HTML keeps its exact readable-fragment targets: '+edit.moduleId+edit.path);
  }
  assert.deepEqual(prepareContentReview(after,review),{conflicts:[],entries:[],alreadyApplied:7});
});

test('source defaults match the reviewed after values and conflicting online edits block the complete batch',async()=>{
  const {prepareContentReview}=await library, source=sourceModules();
  for(const edit of review.edits)assert.deepEqual(read(source.find(m=>m.id===edit.moduleId),edit.path),edit.after);
  const seed=fs.readFileSync(require.resolve('../prisma/seed.ts'),'utf8');
  assert.ok(seed.includes('description: '+JSON.stringify(review.edits.find(e=>e.path==='/description').after)));
  const before=beforeModules();before[0].contentBlocks[2].html+='<!-- Saved independently by administrator -->';
  const plan=prepareContentReview(before,review);
  assert.deepEqual(plan.conflicts,['9/contentBlocks/2/html']);assert.deepEqual(plan.entries,[]);
});

test('cellular guidance links to primary eligibility information and new-model compatibility stays explicit',()=>{
  const html=appleWatchFoundationBlocks[2].html;
  assert.match(html,/lifecell/);assert.match(html,/https:\/\/www\.apple\.com\/ua\/watch\/cellular\//);
  assert.match(html,/номер моделі, країну призначення та сумісність тарифу/);
  assert.doesNotMatch(html,/українські оператори не зазначені/);
  const ultra4=appleWatchCatalogBlocks[4].products.find(p=>p.slug==='apple-watch-ultra-4-2026');
  assert.match(ultra4.highlights[7],/iPhone 11.*iPhone SE 2.*iOS 27/);
  const summary=appleWatchCatalogBlocks[1].products.find(p=>p.slug==='apple-watch-series-8-2022').summary;
  assert.match(summary,/температури зап’ястя під час сну/);assert.match(summary,/не призначений для разового/);
  assert.ok(review.edits.every(edit=>edit.sourceUrls.every(url=>['www.apple.com','support.apple.com'].includes(new URL(url).hostname))));
});
