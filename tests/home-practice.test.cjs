const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { HOME_PRACTICE_QUESTIONS, getPracticeStartIndex } = require('../lib/home-practice.ts');

// Exercise the real client handlers and JSX with isolated React state. No account,
// browser, database, or quiz attempt is involved in this optional practice.
function practiceHarness(initialIndex = 0) {
  const states = [];
  const refs = [];
  let stateIndex = 0;
  let refIndex = 0;
  const hooks = {
    ...React,
    useState(initial) {
      const index = stateIndex++;
      if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial;
      return [states[index], next => { states[index] = typeof next === 'function' ? next(states[index]) : next; }];
    },
    useRef(initial) {
      const index = refIndex++;
      if (!(index in refs)) refs[index] = { current: initial };
      return refs[index];
    },
    useEffect() {}
  };
  const filename = path.resolve(__dirname, '../components/home/QuickPractice.tsx');
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.paths = Module._nodeModulePaths(path.dirname(filename));
  const installed = Module.createRequire(filename);
  loaded.require = request => {
    if (request === 'react') return hooks;
    if (request === '@/lib/home-practice') return { HOME_PRACTICE_QUESTIONS, getPracticeStartIndex };
    if (request.endsWith('.module.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
    return installed(request);
  };
  loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }
  }).outputText, filename);
  return {
    render() { stateIndex = 0; refIndex = 0; return loaded.exports.QuickPractice({ initialIndex }); }
  };
}

function findElements(node, predicate, result = []) {
  if (Array.isArray(node)) {
    for (const child of node) findElements(child, predicate, result);
  } else if (node && typeof node === 'object' && node.props) {
    if (predicate(node)) result.push(node);
    findElements(node.props.children, predicate, result);
  }
  return result;
}

const find = (tree, type) => findElements(tree, node => node.type === type);
const submit = tree => find(tree, 'form')[0].props.onSubmit({ preventDefault() {} });
const choose = (tree, index) => find(tree, 'input')[index].props.onChange();
const status = tree => findElements(tree, node => node.props.role === 'status')[0];
const nextButton = tree => find(tree, 'button').find(node => node.props.type === 'button');

test('practice keeps unanswered submissions unlocked and reveals no result before checking', () => {
  const harness = practiceHarness();
  let tree = harness.render();
  assert.equal(find(tree, 'button')[0].props.disabled, true);
  submit(tree);
  tree = harness.render();
  assert.equal(find(tree, 'fieldset')[0].props.disabled, false);
  assert.equal(findElements(status(tree), node => node.type === 'strong').length, 0);

  choose(tree, 0);
  tree = harness.render();
  assert.equal(find(tree, 'button')[0].props.disabled, false);
  assert.equal(findElements(status(tree), node => node.type === 'strong').length, 0, 'selecting an option alone does not reveal the answer');
});

test('a correct answer reveals the explanation and freezes the choices until the next situation', () => {
  const harness = practiceHarness();
  const question = HOME_PRACTICE_QUESTIONS[0];
  choose(harness.render(), question.correctAnswer);
  submit(harness.render());
  let tree = harness.render();
  assert.equal(find(tree, 'fieldset')[0].props.disabled, true);
  assert.equal(findElements(status(tree), node => node.type === 'strong')[0].props.children, 'Саме так!');
  assert.equal(findElements(status(tree), node => node.type === 'p')[0].props.children, question.explanation);
  assert.ok(find(tree, 'label')[question.correctAnswer].props.className.includes('choiceCorrect'));

  nextButton(tree).props.onClick();
  tree = harness.render();
  assert.equal(find(tree, 'legend')[0].props.children, HOME_PRACTICE_QUESTIONS[1].situation);
  assert.equal(find(tree, 'fieldset')[0].props.disabled, false);
  assert.ok(find(tree, 'input').every(node => node.props.checked === false), 'the previous selection cannot carry over');
  assert.equal(find(tree, 'button')[0].props.disabled, true);
  assert.equal(findElements(status(tree), node => node.type === 'strong').length, 0);
});

test('an incorrect answer shows guidance and identifies both the selected and correct choices', () => {
  const harness = practiceHarness(2);
  const question = HOME_PRACTICE_QUESTIONS[2];
  const wrong = (question.correctAnswer + 1) % 3;
  choose(harness.render(), wrong);
  submit(harness.render());
  const tree = harness.render();
  assert.equal(findElements(status(tree), node => node.type === 'strong')[0].props.children, 'Є кращий підхід');
  assert.equal(findElements(status(tree), node => node.type === 'p')[0].props.children, question.explanation);
  assert.ok(find(tree, 'label')[wrong].props.className.includes('choiceIncorrect'));
  assert.ok(find(tree, 'label')[question.correctAnswer].props.className.includes('choiceCorrect'));
  assert.equal(status(tree).props['aria-live'], 'polite');
});

test('a daily starting point covers every situation once and can restart after completion', () => {
  const harness = practiceHarness(-1);
  const start = HOME_PRACTICE_QUESTIONS.length - 1;
  const seen = new Set();
  for (let step = 0; step < HOME_PRACTICE_QUESTIONS.length; step++) {
    const question = HOME_PRACTICE_QUESTIONS[(start + step) % HOME_PRACTICE_QUESTIONS.length];
    let tree = harness.render();
    assert.equal(find(tree, 'legend')[0].props.children, question.situation);
    assert.equal(findElements(tree, node => node.props.role === 'progressbar')[0].props['aria-valuenow'], step + 1);
    seen.add(question.id);
    choose(tree, question.correctAnswer);
    submit(harness.render());
    tree = harness.render();
    nextButton(tree).props.onClick();
  }
  assert.equal(seen.size, HOME_PRACTICE_QUESTIONS.length);
  const completed = harness.render();
  assert.equal(find(completed, 'form').length, 0);
  assert.equal(find(completed, 'h3')[0].props.children, 'Практику завершено');
  nextButton(completed).props.onClick();
  const restarted = harness.render();
  assert.equal(find(restarted, 'legend')[0].props.children, HOME_PRACTICE_QUESTIONS[start].situation);
  assert.ok(find(restarted, 'input').every(node => node.props.checked === false));
});
