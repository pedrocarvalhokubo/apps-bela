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
  assert.throws(() => validateScienceContent({ ...content, scienceQuiz: [] }));
});


test('release bundle includes complete questions, assets and matching activities', () => {
  validateScienceContent(content);
  for (const resource of [...content.scienceInfographicPages, ...content.scienceDownloads]) {
    const bytes = readFileSync(new URL('../public' + resource.src, import.meta.url));
    assert.ok(bytes.length > 1000);
    if (resource.src.endsWith('.pdf')) assert.equal(bytes.subarray(0,4).toString(), '%PDF');
  }
  const matching = JSON.parse(readFileSync(new URL('../app/science-matching.json', import.meta.url), 'utf8'));
  assert.equal(matching.activities.length,4);
  for (const activity of matching.activities) {
    assert.ok(content.scienceSubject.lessons.some(l => l.id === activity.lessonId));
    assert.ok(activity.pairs.length >= 3);
    assert.equal(new Set(activity.pairs.map(p => p.left.en)).size, activity.pairs.length);
    assert.equal(new Set(activity.pairs.map(p => p.right.en)).size, activity.pairs.length);
    assert.ok(activity.hint.en && activity.hint.pt);
  }
});
