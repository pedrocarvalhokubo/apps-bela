"use client";
import { useState } from 'react';
import content from '../science-matching.json';

export default function ScienceMatching({ lessonId }: { lessonId: string }) {
  const activity = content.activities.find(item => item.lessonId === lessonId);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);
  if (!activity) return null;
  // A stable different order prevents matching by position alone.
  const options = activity.pairs.map((pair, index) => ({ pair, index })).reverse();
  const correct = activity.pairs.filter((_, index) => answers[index] === String(index)).length;
  return <section className="science-matching" aria-label={activity.title.en}>
    <h3>{activity.title.en}<small>{activity.title.pt}</small></h3>
    <p>Match each concept to its meaning. / Associe cada conceito ao significado.</p>
    {activity.pairs.map((pair, index) => <div className="science-match-row" key={pair.left.en}>
      <label htmlFor={`${activity.id}-${index}`}><strong>{pair.left.en}</strong><small>{pair.left.pt}</small></label>
      <select id={`${activity.id}-${index}`} value={answers[index] ?? ''} onChange={event => { setAnswers({ ...answers, [index]: event.target.value }); setChecked(false); }}>
        <option value="">Choose / Escolha</option>
        {options.map(option => <option key={option.index} value={option.index}>{option.pair.right.en} / {option.pair.right.pt}</option>)}
      </select>
      {checked && <p className={answers[index] === String(index) ? 'match-correct' : 'match-retry'}>{answers[index] === String(index) ? '✓ Correct / Correto' : 'Try again / Tente novamente'}</p>}
    </div>)}
    <div className="science-match-actions">
      <button onClick={() => setChecked(true)} disabled={Object.values(answers).filter(Boolean).length !== activity.pairs.length}>Check matches / Conferir</button>
      <button onClick={() => setHint(!hint)}>Hint / Pista</button>
      <button onClick={() => { setAnswers({}); setChecked(false); setHint(false); }}>Try again / Recomeçar</button>
    </div>
    {hint && <p role="status">{activity.hint.en}<br />{activity.hint.pt}</p>}
    {checked && <p role="status">{correct}/{activity.pairs.length} correct / associações corretas</p>}
  </section>;
}
