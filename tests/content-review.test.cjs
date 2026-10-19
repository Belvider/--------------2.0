const { test } = require('node:test');
const assert = require('node:assert/strict');
const library = import('../scripts/apply-content-review.mjs');
const moduleFixture = () => ({ id: 1, categoryId: 2, category: { slug: 'phones', brand: { slug: 'apple' } },
  title: 'Original', description: 'Editable online', contentBlocks: [{ type: 'text', title: 'Lesson', html: 'Old' }],
  questions: [{ id: 9, moduleId: 1, question: 'Old question', options: ['A', 'B'], correctAnswer: { index: 0 } }] });
const review = (edits = [{ moduleId: 1, path: '/contentBlocks/0/html', before: 'Old', after: 'Verified', reason: 'Official source', sourceUrls: [] }]) => ({ version: 1,
  modules: [{ id: 1, categoryId: 2, categorySlug: 'phones', brandSlug: 'apple', questionIds: [9] }], edits });

test('review preserves independent online edits and is idempotent with JSONB key order', async () => {
  const { prepareContentReview } = await library;
  const current = moduleFixture(); current.description = 'Edited online'; current.contentBlocks[0].title = 'Custom heading';
  const plan = prepareContentReview([current], review());
  assert.deepEqual(plan.conflicts, []);
  assert.deepEqual(plan.entries[0].data, { contentBlocks: [{ type: 'text', title: 'Custom heading', html: 'Verified' }] });
  assert.equal(current.contentBlocks[0].html, 'Old');
  Object.assign(current, plan.entries[0].data);
  assert.deepEqual(prepareContentReview([current], review()), { conflicts: [], entries: [], alreadyApplied: 1 });
});

test('one conflicting edit blocks the entire proposed plan', async () => {
  const { prepareContentReview } = await library;
  const current = moduleFixture(); current.contentBlocks[0].html = 'Online text';
  const manifest = review([...review().edits, { moduleId: 1, path: '/title', before: 'Original', after: 'New', reason: 'Copy', sourceUrls: [] }]);
  const result = prepareContentReview([current], manifest);
  assert.deepEqual(result.entries, []);
  assert.deepEqual(result.conflicts, ['1/contentBlocks/0/html']);
  assert.equal(current.title, 'Original');
});

test('changed question identity and category cannot retarget a content patch', async () => {
  const { prepareContentReview } = await library;
  for (const mutate of [m => m.questions[0].id = 10, m => m.categoryId = 3, m => m.category.brand.slug = 'other', m => m.questions[0].moduleId = 2]) {
    const current = moduleFixture(); mutate(current);
    assert.throws(() => prepareContentReview([current], review()), /identity changed/);
  }
});

test('unsafe paths, record IDs, missing paths and overlapping edits are rejected', async () => {
  const { prepareContentReview } = await library;
  for (const path of ['/id', '/isPublished', '/questions/0/id', '/contentBlocks/0/__proto__/x', '/contentBlocks/01/html', '/contentBlocks/0/html~2', '/contentBlocks/0/missing']) {
    assert.throws(() => prepareContentReview([moduleFixture()], review([{ ...review().edits[0], path }])));
  }
  assert.throws(() => prepareContentReview([moduleFixture()], review([...review().edits, { ...review().edits[0], path: '/contentBlocks/0', before: {}, after: {} }])), /Overlapping/);
});

test('question corrections update their original IDs without touching attempts or progress', async () => {
  const { prepareContentReview, writeContentReview } = await library;
  const manifest = review([{ moduleId: 1, path: '/questions/0/question', before: 'Old question', after: 'Verified question', reason: 'Copy', sourceUrls: [] }]);
  const plan = prepareContentReview([moduleFixture()], manifest);
  const writes = [];
  await writeContentReview({ module: { update: async v => writes.push(['module', v]) }, quizQuestion: { update: async v => writes.push(['question', v]) } }, plan);
  assert.deepEqual(writes, [['question', { where: { id: 9 }, data: { question: 'Verified question' } }]]);
});

test('writer propagates failures to the surrounding transaction and rejects conflicts', async () => {
  const { writeContentReview } = await library;
  await assert.rejects(writeContentReview({}, { conflicts: ['x'], entries: [] }), /conflicts/);
  const failure = new Error('transaction must roll back');
  await assert.rejects(writeContentReview({ module: { update: async () => { throw failure; } } }, { conflicts: [], entries: [{ id: 1, data: { title: 'New' }, questions: [] }] }), error => error === failure);
});
