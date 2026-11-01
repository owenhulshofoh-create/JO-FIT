/* JO FIT private AI chat: deploy Supabase Edge Function with verified JWT.
 * Secrets OPENAI_API_KEY (server only), SUPABASE_URL, SUPABASE_ANON_KEY.
 */
import { createClient } from 'npm:@supabase/supabase-js@2';
const origin = Deno.env.get('ALLOWED_ORIGIN') || 'https://owenhulshofoh-create.github.io';
const cors = {'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin'};
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json'}});
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response(null,{headers:cors});
 if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 const token=req.headers.get('Authorization')?.replace(/^Bearer /i,'');if(!token)return reply({error:'Niet ingelogd'},401);
 const endpoint=Deno.env.get('SUPABASE_URL')||'',key=Deno.env.get('SUPABASE_ANON_KEY')||'',secret=Deno.env.get('OPENAI_API_KEY')||'';
 if(!endpoint||!key||!secret||!Deno.env.get('OPENAI_MODEL'))return reply({error:'AI is nog niet door de beheerder geconfigureerd'},503);
 const db=createClient(endpoint,key,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user},error:authError}=await db.auth.getUser(token);if(authError||!user)return reply({error:'Ongeldige sessie'},401);
 let body;try{body=await req.json()}catch{return reply({error:'Ongeldig verzoek'},400)}
 const message=String(body?.message||'').trim().slice(0,800);if(message.length<3)return reply({error:'Een vraag is verplicht'},400);
 const context=body?.context&&typeof body.context==='object'?body.context:{};
 const safeContext={goal:String(context.goal||'').slice(0,35),days:Number(context.days)||3,minutes:Number(context.minutes)||45,
  equipment:Array.isArray(context.equipment)?context.equipment.slice(0,25).map((s:unknown)=>String(s).slice(0,40)):[],
  recentSets:Array.isArray(context.recentSets)?context.recentSets.slice(0,12):[]};
 const {data:allowed,error:quotaError}=await db.rpc('jofit_claim_request',{p_kind:'coach',p_daily_limit:10});
 if(quotaError)return reply({error:'Limietcontrole niet beschikbaar'},503);if(!allowed)return reply({error:'Daglimiet voor AI-coaching bereikt (10 vragen)'},429);
 const instruction='Je bent JO FIT, een Nederlandstalige trainingsassistent. Bedenk GEEN prestaties, persoonsgegevens of medische diagnoses. Vertel wanneer informatie ontbreekt. Baseer trainingsvoorstellen op beschikbare materialen; wees terughoudend bij pijn/blessure, eetstoornissen, extreme calorietekorten en minderjarigen. Adviezen zijn informatief. Wijzig nooit schema’s: geef alleen concrete voorstellen met uitleg die de gebruiker moet bevestigen.';
 try{const upstream=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:`Bearer ${secret}`,'Content-Type':'application/json'},body:JSON.stringify({model:Deno.env.get('OPENAI_MODEL'),max_output_tokens:350,input:[{role:'system',content:instruction},{role:'user',content:`Geanonimiseerde trainingscontext: ${JSON.stringify(safeContext)}\nVraag: ${message}`} ]})});
 if(!upstream.ok)return reply({error:'AI is tijdelijk niet beschikbaar'},502);
 const out=await upstream.json();const answer=out.output_text||out.output?.flatMap((o:any)=>o.content||[]).filter((c:any)=>c.type==='output_text').map((c:any)=>c.text).join('\n')||'';
 if(!answer)return reply({error:'Geen bruikbaar antwoord van AI'},502);return reply({answer:String(answer).slice(0,2400),source:'AI-taalmodel',applied:false});
 }catch{return reply({error:'AI-verbinding is tijdelijk niet beschikbaar'},502)}
});
