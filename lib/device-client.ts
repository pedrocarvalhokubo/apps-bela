import {getStudyMode} from './study-storage';
// Account sessions live in an HttpOnly cookie, never in JavaScript storage.
export async function ensureDevice():Promise<string>{
 if(getStudyMode()==='guest')return '';
 const response=await fetch('/api/auth',{cache:'no-store'});
 const result=await response.json();
 if(!response.ok||!result.authenticated)throw new Error('Entre novamente como Bela.');
 return 'account-session';
}
