'use client';
import {useState} from 'react';
import {portuguese3Practice} from '../portuguese3-data';
import {useWrittenDraft} from '../../lib/use-written-draft';
export default function Portuguese3Practice({lessonId}:{lessonId:string}) {
  const task = portuguese3Practice.find(t => t.lesson === lessonId);
  const {draft, ready, status, change} = useWrittenDraft(`bela-portuguese3-practice-${lessonId}`);
  const [show, setShow] = useState(false);
  if (!task) return null;
  return <section className="ela3-practice" aria-label="Atividade escrita de Português">
    <h3>✍️ Agora é com você</h3>
    <p>{task.prompt}</p>
    <label htmlFor={`write-${lessonId}`}>Sua resposta</label>
    <textarea id={`write-${lessonId}`} disabled={!ready} value={draft} onChange={e => change(e.target.value)} rows={5} placeholder="Escreva aqui ou no caderno." />
    <small role="status">{status}</small>
    <button onClick={() => setShow(!show)}>{show ? 'Esconder resposta' : 'Já respondi: conferir uma resposta'}</button>
    {show && <p className="practice-answer">{task.answer}</p>}
    <p>Respostas abertas podem usar outras palavras. Confira com um adulto.</p>
  </section>;
}
