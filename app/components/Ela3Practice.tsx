"use client";

import { useEffect, useState } from 'react';
import { ela3Practice } from '../ela3-data';

export default function Ela3Practice({ lessonId }: { lessonId: string }) {
  const task = ela3Practice.find(item => item.lesson === lessonId);
  const [draft, setDraft] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { setDraft(localStorage.getItem(`bela-ela3-practice-${lessonId}`) ?? ''); } catch { /* Storage can be unavailable. */ }
    setReady(true);
  }, [lessonId]);
  if (!task) return null;
  return <section className="ela3-practice" aria-label="Writing practice">
    <small>✍️ WRITING PRACTICE</small>
    <h3>Your turn • Agora é com você</h3>
    <p>{task.prompt}</p>
    <label htmlFor={`practice-${lessonId}`}>Your answer • Sua resposta</label>
    <textarea id={`practice-${lessonId}`} value={draft} disabled={!ready} rows={5} onChange={event => {
      setDraft(event.target.value);
      try { localStorage.setItem(`bela-ela3-practice-${lessonId}`, event.target.value); } catch { /* Keep editable in memory. */ }
    }} placeholder="Write in English. You can also practise in your notebook." />
    <small>Rascunho neste aparelho. Você também pode responder no caderno.</small>
    <details><summary>Compare after trying • Ver sugestão depois de tentar</summary><p>{task.answer}</p><p>Respostas abertas podem usar outras palavras. Confira as ideias e as evidências com um adulto.</p></details>
  </section>;
}
