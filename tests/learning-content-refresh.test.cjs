const { test } = require('node:test');
const assert = require('node:assert/strict');
const library = import('../scripts/refresh-learning-materials.mjs');

test('content refresh respects JSONB key ordering', async () => {
  const { mergeLearningContent } = await library;
  const conflicts = [];
  const actual = mergeLearningContent({ html: 'old', title: 'Lesson', type: 'text' }, { type: 'text', title: 'Lesson', html: 'old' }, { type: 'text', title: 'Lesson', html: 'new' }, conflicts);
  assert.equal(actual.html, 'new');
  assert.deepEqual(conflicts, []);
});

test('new models are added once while online fields and custom products remain', async () => {
  const { mergeLearningContent } = await library;
  const before = [{ slug: 'old', title: 'Old', summary: 'Original', colors: [] }];
  const after = [{ ...before[0], title: 'Corrected' }, { slug: 'new', title: 'New model', colors: [] }];
  const current = [{ ...before[0], summary: 'Edited online' }, { slug: 'custom', title: 'Custom', colors: [] }];
  const conflicts = [];
  const result = mergeLearningContent(current, before, after, conflicts);
  assert.deepEqual(result.map(v => v.slug), ['old', 'custom', 'new']);
  assert.equal(result[0].title, 'Corrected');
  assert.equal(result[0].summary, 'Edited online');
  assert.deepEqual(mergeLearningContent(result, before, after), result);
  assert.deepEqual(conflicts, []);
});

test('overlapping online edits and newly occupied product slugs require review', async () => {
  const { mergeLearningContent } = await library;
  const conflicts = [];
  const result = mergeLearningContent({ title: 'Online' }, { title: 'Original' }, { title: 'Correction' }, conflicts, 'lesson');
  assert.equal(result.title, 'Online');
  assert.deepEqual(conflicts, ['lesson.title']);
  const productConflicts = [];
  mergeLearningContent([{ slug: 'new', title: 'Online product' }], [{ slug: 'old', title: 'Old' }], [{ slug: 'old', title: 'Old' }, { slug: 'new', title: 'Source product' }], productConflicts, 'catalog');
  assert.deepEqual(productConflicts, ['catalog[new]']);
});

test('known wording is corrected without replacing customized facts', async () => {
  const { mergeLearningContent } = await library;
  const conflicts = [];
  const result = mergeLearningContent(['Custom shop policy', 'Old wording'], ['Default policy', 'Old wording'], ['Default policy', 'Clear wording'], conflicts);
  assert.deepEqual(result, ['Custom shop policy', 'Clear wording']);
  assert.deepEqual(conflicts, []);
});
