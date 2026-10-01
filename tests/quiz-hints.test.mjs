import { test } from 'node:test';
import assert from 'node:assert/strict';
import { questionHint } from '../app/quiz-hints.ts';

test('graduated hints show a new clue on the second error and retain legacy support', () => {
  assert.equal(questionHint({support:'legacy support'}, 1), 'legacy support');
  const question = {support:'initial support', hints:['first clue', 'second clue']};
  assert.equal(questionHint(question, 1), 'first clue');
  assert.equal(questionHint(question, 2), 'second clue');
  assert.equal(questionHint(question, 3), 'second clue');
});
