"use client";
import {useEffect,useState} from 'react';
import styles from './TutorParents.module.css';
type Totals={usd:number;calls:number;seconds:number;unpriced:number};
type Costs={month:string;updatedAt:number;priceDate:string;priceSource:string;meteringSince:number|null;today:Totals;total:Totals;models:(Totals&{model:string;inputTokens:number;outputTokens:number})[];days:(Totals&{day:string})[];pendingLiveSessions:number};
const money=(value:number)=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'USD',minimumFractionDigits:4,maximumFractionDigits:4}).format(value);
const minutes=(seconds:number)=>(seconds/60).toLocaleString('pt-BR',{maximumFractionDigits:1})+' min';
export default function TutorUsage({parentToken}:{parentToken:string}){
 const [data,setData]=useState<Costs|null>(null),[error,setError]=useState(''),[refresh,setRefresh]=useState(0),[busy,setBusy]=useState(false);
 useEffect(()=>{
  const controller=new AbortController();let fetching=false;
  async function load(){
   if(fetching||document.hidden)return;fetching=true;setBusy(true);
   try{
    const response=await fetch('/api/tutor/parent',{method:'POST',headers:{'content-type':'application/json','x-bela-parent-token':parentToken},body:JSON.stringify({action:'costs'}),signal:AbortSignal.any([controller.signal,AbortSignal.timeout(15000)])});
    const result=await response.json();if(!response.ok)throw new Error(result.error||'Não foi possível consultar o consumo.');
    if(!controller.signal.aborted){setData(result);setError('');}
   }catch(failure){if(!controller.signal.aborted)setError(failure instanceof Error?failure.message:'Não foi possível consultar o consumo.');}
   finally{fetching=false;if(!controller.signal.aborted)setBusy(false);}
  }
  void load();const timer=setInterval(()=>void load(),30000);const visible=()=>{if(!document.hidden)void load();};document.addEventListener('visibilitychange',visible);
  return()=>{controller.abort();clearInterval(timer);document.removeEventListener('visibilitychange',visible);};
 },[parentToken,refresh]);
 return <>
  <div className={styles.sectionHeading}><div><h3>Uso e gastos da API</h3><p>Consumo deste app, atualizado a cada 30 segundos enquanto esta aba estiver aberta.</p></div><button disabled={busy} onClick={()=>setRefresh(n=>n+1)}>{busy?'Atualizando…':'Atualizar gastos'}</button></div>
  {error&&<p role="alert" className={styles.error}>{error}</p>}
  {!data?<p role="status">Consultando o consumo registrado…</p>:<>
   <div className={styles.costCards}><div><span>HOJE · ESTIMATIVA PARCIAL</span><strong>{money(data.today.usd)}</strong><small>{data.today.calls} chamadas e sessões</small></div><div><span>MÊS · {data.month.split('-').reverse().join('/')} · ESTIMATIVA PARCIAL</span><strong>{money(data.total.usd)}</strong><small>Valores em dólar americano (USD)</small></div><div><span>VOZ AO VIVO NO MÊS</span><strong>{minutes(data.models.find(m=>m.model==='gpt-live-1')?.seconds??0)}</strong><small>Tempo informado pela OpenAI</small></div></div>
   <div className={styles.notice}><strong>Como ler estes valores</strong><p>Estimativa calculada com os segundos e tokens informados pela API e a tabela pública de preços de {data.priceDate.split('-').reverse().join('/')}. Inclui explicações, revisões, imagens, transcrições e replay medidos pelo app. Não representa a fatura nem o saldo da OpenAI.</p><p>A voz ao vivo usa US$ 0,05 por minuto, além do processamento das respostas. O tempo conectado, inclusive em silêncio, pode ser cobrado. A estimativa considera o mínimo inicial de 15 segundos por sessão WebRTC, sem adicioná-lo novamente à duração. Imagens usam a tarifa sem desconto de cache; o valor final pode ser menor.</p><p>O histórico de voz usa os segundos já registrados. Tokens de texto, imagens e replay anteriores a esta atualização não estavam sendo medidos e não entram no total.{data.meteringSince?' Primeira medição detalhada: '+new Date(data.meteringSince).toLocaleString('pt-BR',{timeZone:'America/Bahia'})+'.':''}</p>{data.total.unpriced>0&&<p><b>{data.total.unpriced} chamada(s) sem dados suficientes de consumo.</b> Seus custos não estão no total.</p>}{data.pendingLiveSessions>0&&<p><b>{data.pendingLiveSessions} sessão(ões) de voz com duração final pendente.</b> O total considera apenas os segundos já recebidos.</p>}</div>
   <div className={styles.costTable}><table><caption>Consumo por modelo neste mês</caption><thead><tr><th>Modelo</th><th>Chamadas / sessões</th><th>Consumo medido</th><th>Estimativa USD</th></tr></thead><tbody>{data.models.map(row=><tr key={row.model}><th scope="row">{row.model}</th><td>{row.calls}</td><td>{row.model==='gpt-live-1'||row.model==='gpt-transcribe'?minutes(row.seconds):(row.inputTokens+row.outputTokens).toLocaleString('pt-BR')+' tokens'}</td><td>{money(row.usd)}{row.unpriced>0&&<small>+ {row.unpriced} sem medição completa</small>}</td></tr>)}</tbody></table>{!data.models.length&&<p className={styles.help}>Ainda não há consumo registrado neste mês. O acompanhamento começa nas próximas chamadas.</p>}</div>
   {data.days.length>0&&<details className={styles.disclosure}><summary>Ver consumo por dia</summary><div className={styles.costTable}><table><thead><tr><th>Dia (Bahia)</th><th>Chamadas / sessões</th><th>Estimativa USD</th></tr></thead><tbody>{data.days.map(row=><tr key={row.day}><th scope="row">{row.day.split('-').reverse().join('/')}</th><td>{row.calls}</td><td>{money(row.usd)}</td></tr>)}</tbody></table></div></details>}
   <p className={styles.help}>Atualizado em {new Date(data.updatedAt).toLocaleTimeString('pt-BR',{timeZone:'America/Bahia'})} (Bahia). Os limites de perguntas, imagens e minutos ficam em Conexão e limites; esta tela não impõe um teto em dólares.</p>
   <details className={styles.disclosure}><summary>Conferir a cobrança oficial</summary><p>A fatura completa está no painel de uso da OpenAI. A integração com a API de custos exige uma credencial administrativa separada, que não está configurada neste app. A chave de conversação continua protegida no servidor.</p><p><a href="https://platform.openai.com/usage" target="_blank" rel="noreferrer">Abrir uso e cobrança da OpenAI ↗</a> · <a href={data.priceSource} target="_blank" rel="noreferrer">Tabela de preços usada ↗</a></p></details>
  </>}
 </>;
}
