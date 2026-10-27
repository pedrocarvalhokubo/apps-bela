'use client';
import {getStudyMode,studyStorage} from './study-storage';
let flushing:Promise<void>|undefined;
export async function flushDrafts(){
 if(getStudyMode()!=='bela')return;
 if(flushing)return flushing;
 flushing=(async()=>{
  while(getStudyMode()==='bela'){
   const prefix='bela-account-v2:';
   const key=Object.keys(localStorage).find(k=>k.startsWith(prefix+'bela-')&&k.endsWith(':pending'));
   if(!key)return;
   const task=key.slice(prefix.length,-8),answer=studyStorage.getItem(task)??'';
   const r=await fetch('/api/drafts',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({task,answer})});
   if(!r.ok)throw new Error('Os rascunhos aguardam conexão para sincronizar.');
   if(studyStorage.getItem(task)===answer)studyStorage.removeItem(task+':pending');
  }
 })().finally(()=>{flushing=undefined;});
 return flushing;
}

let timer:ReturnType<typeof setTimeout>|undefined;
export function scheduleDraftSave(){if(getStudyMode()!=='bela')return;clearTimeout(timer);timer=setTimeout(()=>{void flushDrafts().catch(()=>{});},500);}
