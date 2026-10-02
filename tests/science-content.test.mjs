import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateScienceContent } from '../scripts/validate-science-content.mjs';
const content = JSON.parse(readFileSync(new URL('../app/science-content.json', import.meta.url), 'utf8'));

test('canonical Science lessons preserve stable editorial IDs and bilingual teaching', () => {
  validateScienceContent(content, { lessonsOnly: true });
  assert.deepEqual(content.scienceSubject.lessons.map(l => l.id), ['s3-sound','s3-hearing','s3-rocks-minerals','s3-rock-types','s3-fossils','s3-landscapes','s3-weathering-erosion','s3-soil']);
  for (const lesson of content.scienceSubject.lessons) {
    assert.match(lesson.intro, /\n\n/);
    assert.ok(content.scienceDeepStudyByLesson[lesson.id].vocabulary.length > 0);
  }
  assert.equal(content.scienceSubject.assessmentDate, '');
});

test('partial Science bundle cannot pass the release gate', () => {
  if (!content.scienceQuiz.length) assert.throws(() => validateScienceContent(content));
});
