import {AsyncLocalStorage} from 'node:async_hooks';
import {randomUUID} from 'node:crypto';
import {getDatabase} from './database';

// Only numeric metering is persisted here. Never prompts, audio, keys or provider payloads.
const scope=new AsyncLocalStorage<string>();
export const withTutorUsage=<T>(profile:string,work:()=>T)=>scope.run(profile,work);
export const priceDate='2026-11-04';
export const priceSource='https://developers.openai.com/api/docs/pricing';
const day=(time:number)=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Bahia',year:'numeric',month:'2-digit',day:'2-digit'}).format(time);
const number=(value:unknown)=>typeof value==='number'&&Number.isFinite(value)&&value>=0?value:null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped JSON from the provider
type Usage=Record<string,any>;
export function usageEstimate(model:string,usage:Usage|undefined){
 const input=number(usage?.input_tokens),output=number(usage?.output_tokens),seconds=number(usage?.seconds);
 let usd:number|null=null;
 if(model==='gpt-transcribe'&&seconds!==null)usd=seconds/60*.0045;
 if(model==='gpt-6.1-terra'&&input!==null&&output!==null){
  const details=usage?.input_tokens_details??{},cached=number(details.cached_tokens)??0,write=number(details.cache_write_tokens)??0;
  const long=number(details.cache_write_tokens_details?.ttl_12h_tokens)??0;
  if(cached+write<=input&&long<=write){
   const multiplier=input>272000?2:1;
   usd=((input-cached-write)+cached*.05+(write-long)*1.25+long*2.5)*multiplier/1e6+output*5*(input>272000?1.5:1)/1e6;
  }
 }
 if(model==='gpt-image-2.5-flare'&&input!==null&&output!==null){
  const detail=usage?.input_tokens_details,text=number(detail?.text_tokens),image=number(detail?.image_tokens);
  // Image cache savings are not exposed reliably; use the published uncached rates.
  if(text!==null&&image!==null&&text+image===input)usd=(text*5+image*8+output*30)/1e6;
 }
 if(model==='gpt-realtime-2.1-mini'&&input!==null&&output!==null){
  const i=usage?.input_token_details,o=usage?.output_token_details;
  const it=number(i?.text_tokens),ia=number(i?.audio_tokens),ot=number(o?.text_tokens),oa=number(o?.audio_tokens),cached=number(i?.cached_tokens)??0;
  const ct=number(i?.cached_tokens_details?.text_tokens)??0,ca=number(i?.cached_tokens_details?.audio_tokens)??0;
  if(it!==null&&ia!==null&&ot!==null&&oa!==null&&it+ia===input&&ot+oa===output&&ct+ca===cached&&ct<=it&&ca<=ia)usd=((it-ct)*.6+(ia-ca)*10+ct*.06+ca*.3+ot*2.4+oa*20)/1e6;
 }
 return {input:input??0,output:output??0,seconds:seconds??0,nano:usd===null?null:Math.round(usd*1e9)};
}
export async function recordTutorUsage(model:string,operation:string,payload:{id?:string;usage?:Usage}){
 const profile=scope.getStore();if(!profile)return;
 const measured=usageEstimate(model,payload.usage),now=Date.now();
 try{
  const db=await getDatabase();
  await db.prepare('INSERT OR IGNORE INTO tutor_api_costs(id,profile_id,model,operation,day,created_at,input_tokens,output_tokens,seconds,cost_nano_usd,price_date) VALUES(?,?,?,?,?,?,?,?,?,?,?)').bind(payload.id?model+':'+payload.id:randomUUID(),profile,model,operation,day(now),now,measured.input,measured.output,measured.seconds,measured.nano,priceDate).run();
 }catch{console.warn('tutor_usage_record_failed');}
}
export async function tutorCostSummary(profile:string,now=Date.now()){
 const db=await getDatabase(),today=day(now),month=today.slice(0,7)+'-01';
 type Row={day:string;model:string;calls:number;inputTokens:number;outputTokens:number;seconds:number;nano:number;unpriced:number};
 const api=await db.prepare('SELECT day,model,COUNT(*) AS calls,SUM(input_tokens) AS inputTokens,SUM(output_tokens) AS outputTokens,SUM(seconds) AS seconds,COALESCE(SUM(cost_nano_usd),0) AS nano,SUM(cost_nano_usd IS NULL) AS unpriced FROM tutor_api_costs WHERE profile_id=? AND day>=? GROUP BY day,model ORDER BY day DESC,model').bind(profile,month).all<Row>();
 const live=await db.prepare("SELECT day,COUNT(*) AS calls,SUM(used_seconds) AS seconds,SUM(MAX(used_seconds,15)) AS billableSeconds,SUM(state<>'closed') AS pending FROM tutor_live_sessions WHERE profile_id=? AND day>=? AND provider_id<>'' GROUP BY day ORDER BY day DESC").bind(profile,month).all<{day:string;calls:number;seconds:number;billableSeconds:number;pending:number}>();
 const rows:Row[]=[...api.results,...live.results.map(row=>({...row,model:'gpt-live-1',inputTokens:0,outputTokens:0,nano:Math.round(row.billableSeconds/60*.05*1e9),unpriced:0}))];
 const summarize=(items:Row[])=>({usd:items.reduce((n,r)=>n+r.nano,0)/1e9,calls:items.reduce((n,r)=>n+r.calls,0),seconds:items.reduce((n,r)=>n+r.seconds,0),unpriced:items.reduce((n,r)=>n+r.unpriced,0)});
 const group=(key:'model'|'day')=>[...new Set(rows.map(r=>r[key]))].sort().map(value=>({[key]:value,...summarize(rows.filter(r=>r[key]===value)),inputTokens:rows.filter(r=>r[key]===value).reduce((n,r)=>n+r.inputTokens,0),outputTokens:rows.filter(r=>r[key]===value).reduce((n,r)=>n+r.outputTokens,0)}));
 const first=await db.prepare('SELECT MIN(created_at) AS at FROM tutor_api_costs WHERE profile_id=?').bind(profile).first<{at:number|null}>();
 return {currency:'USD',basis:'estimate',month:today.slice(0,7),updatedAt:now,priceDate,priceSource,meteringSince:first?.at??null,today:summarize(rows.filter(r=>r.day===today)),total:summarize(rows),models:group('model'),days:group('day').reverse(),pendingLiveSessions:live.results.reduce((n,r)=>n+r.pending,0)};
}
