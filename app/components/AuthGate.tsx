'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import {flushPendingSaves,clearPendingSaves} from '../../lib/pending-saves';
import {flushDrafts} from '../../lib/draft-client';
import {flushAttempts} from '../../lib/attempt-client';
import {clearAccountCache,setStudyMode,type StudyMode} from '../../lib/study-storage';
const Context=createContext<{mode:StudyMode}>({mode:'guest'});
export const useStudyAccount=()=>useContext(Context);
export default function AuthGate({children}:{children:React.ReactNode}){
 const [mode,setMode]=useState<StudyMode|null>(null),[loading,setLoading]=useState(true),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const enter=(next:StudyMode)=>{setStudyMode(next);setMode(next);if(next==='bela'){void flushAttempts().catch(()=>{});void flushDrafts().catch(()=>{});}};
 useEffect(()=>{
  let cancelled=false;
  if(sessionStorage.getItem('bela-guest-mode')==='yes'){enter('guest');setLoading(false);}
  else void fetch('/api/auth',{cache:'no-store'}).then(r=>r.json()).then(r=>{if(!cancelled&&r.authenticated)enter('bela');}).catch(()=>{if(!cancelled)setError('Conecte-se à internet para entrar como Bela. Você pode praticar como convidado.');}).finally(()=>{if(!cancelled)setLoading(false);});
  const onStorage=(e:StorageEvent)=>{if(e.key==='bela-auth-event'&&e.newValue?.startsWith('logout:')){clearAccountCache();window.location.reload();}};
  const onOnline=()=>{void flushAttempts().catch(()=>{});void flushDrafts().catch(()=>{});void flushPendingSaves().catch(()=>{});};window.addEventListener('online',onOnline);
  window.addEventListener('storage',onStorage);
  return()=>{cancelled=true;window.removeEventListener('storage',onStorage);window.removeEventListener('online',onOnline);};
 },[]);
 async function login(e:React.FormEvent){
  e.preventDefault();if(busy)return;setBusy(true);setError('');
  try{const r=await fetch('/api/auth',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'login',password})});const data=await r.json();if(!r.ok)throw new Error(data.error);
   sessionStorage.removeItem('bela-guest-mode');setPassword('');enter('bela');
  }catch(e){setError(e instanceof Error?e.message:'Não foi possível entrar.');}finally{setBusy(false);}
 }
 async function leave(){
  if(busy)return;setBusy(true);setError('');
  try{
   if(mode==='bela'){await flushPendingSaves();await flushDrafts();await flushAttempts();const r=await fetch('/api/auth',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'logout'})});if(!r.ok)throw new Error('Não foi possível sair. Tente novamente.');clearPendingSaves();clearAccountCache();localStorage.setItem('bela-auth-event','logout:'+Date.now());}
   sessionStorage.removeItem('bela-guest-mode');setMode(null);
  }catch(e){setError(e instanceof Error?e.message:'Não foi possível sair.');}finally{setBusy(false);}
 }
 if(loading)return <main className="account-screen"><section className="account-card"><h1>Estudos da Bela</h1><p>Verificando seu acesso…</p></section></main>;
 if(!mode)return <main className="account-screen"><section className="account-card">
  <span className="account-icon" aria-hidden="true">✦</span><small>APRENDER, REVISAR E PRATICAR</small><h1>Vamos estudar?</h1><p>Entre como Bela para continuar seu histórico em qualquer aparelho.</p>
  <form onSubmit={login}><label htmlFor="bela-password">Senha da Bela</label><input id="bela-password" type="password" inputMode="numeric" autoComplete="current-password" maxLength={64} value={password} onChange={e=>setPassword(e.target.value)} required /><button className="primary-button" disabled={busy||!password}>{busy?'Entrando…':'Entrar como Bela'}</button></form>
  <p className="account-detail">Seu acesso fica lembrado neste aparelho. Use Sair em aparelhos compartilhados.</p>
  <button className="account-guest" disabled={busy} onClick={()=>{sessionStorage.setItem('bela-guest-mode','yes');enter('guest');}}>Praticar como convidado</button>
  <p className="account-detail">Convidados praticam sem gravar avanço no banco ou alterar o histórico da Bela.</p>{error&&<p role="alert" className="form-error">{error}</p>}
 </section></main>;
 return <Context.Provider value={{mode}}><div className={`account-bar ${mode==='guest'?'account-guest-bar':''}`}><span>{mode==='bela'?'Bela • histórico na sua conta':'Convidado • prática sem salvar no banco'}</span><button disabled={busy} onClick={()=>void leave()}>{mode==='bela'?'Sair da conta':'Entrar como Bela'}</button>{error&&<span role="alert">{error}</span>}</div><div key={mode}>{children}</div></Context.Provider>;
}
