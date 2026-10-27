'use client';
import {flushDrafts,scheduleDraftSave} from './draft-client';
import {useEffect,useRef,useState} from 'react';
import {getStudyMode,studyStorage} from './study-storage';
export function useWrittenDraft(task:string){
 const [draft,setDraft]=useState(''),[ready,setReady]=useState(false),[status,setStatus]=useState(''),[retry,setRetry]=useState(0);
 const dirty=useRef(false);
 useEffect(()=>{
  let cancelled=false;const cached=studyStorage.getItem(task)??'';dirty.current=studyStorage.getItem(task+':pending')==='yes';setDraft(cached);
  if(getStudyMode()==='guest'){setStatus('Rascunho da sessão de convidado. Não será gravado no banco.');setReady(true);return;}
  void fetch('/api/drafts?task='+encodeURIComponent(task),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(r=>{if(!cancelled){setDraft(dirty.current?cached:r.draft?.answer??cached);setStatus('Rascunho salvo na conta da Bela.');}}).catch(()=>{if(!cancelled)setStatus('Sem conexão. O rascunho ficará neste aparelho até sincronizar.');}).finally(()=>{if(!cancelled)setReady(true);});
  const online=()=>setRetry(n=>n+1);window.addEventListener('online',online);
  return()=>{cancelled=true;window.removeEventListener('online',online);};
 },[task]);
 useEffect(()=>{
  if(!ready||!dirty.current)return;
  studyStorage.setItem(task,draft);if(getStudyMode()==='guest')return;
  const timer=setTimeout(()=>{setStatus('Salvando rascunho…');void flushDrafts().then(()=>{if(studyStorage.getItem(task)===draft)dirty.current=false;setStatus('Rascunho salvo na conta da Bela.');}).catch(()=>setStatus('Rascunho neste aparelho. Aguardando conexão para sincronizar.'));},500);
  return()=>clearTimeout(timer);
 },[draft,ready,task,retry]);
 return {draft,ready,status,change:(value:string)=>{dirty.current=true;studyStorage.setItem(task,value);studyStorage.setItem(task+':pending','yes');setDraft(value);scheduleDraftSave();}};
}
