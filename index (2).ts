/* Server-side Open Food Facts proxy, identified User-Agent and daily quota.
   No data republished as a bundled database. */
import { createClient } from 'npm:@supabase/supabase-js@2';
const cors={'Access-Control-Allow-Origin':Deno.env.get('ALLOWED_ORIGIN')||'https://owenhulshofoh-create.github.io','Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin'};
const reply=(v:unknown,n=200)=>new Response(JSON.stringify(v),{status:n,headers:{...cors,'Content-Type':'application/json'}});
Deno.serve(async req=>{if(req.method==='OPTIONS')return new Response(null,{headers:cors});if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 const token=req.headers.get('Authorization')?.replace(/^Bearer /i,'');if(!token)return reply({error:'Log eerst in'},401);
 const db=createClient(Deno.env.get('SUPABASE_URL')||'',Deno.env.get('SUPABASE_ANON_KEY')||'',{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data:{user}}=await db.auth.getUser(token);if(!user)return reply({error:'Niet ingelogd'},401);
 let body;try{body=await req.json()}catch{return reply({error:'Ongeldig verzoek'},400)}const query=String(body?.query||'').trim().slice(0,70);if(query.length<3)return reply({error:'Vul minimaal 3 letters in'},400);
 const {data:allowed,error}=await db.rpc('jofit_claim_request',{p_kind:'food',p_daily_limit:40});if(error)return reply({error:'Zoeklimiet kon niet worden gecontroleerd'},503);if(!allowed)return reply({error:'Dagelijkse zoeklimiet bereikt'},429);const {data:burstOk,error:burstError}=await db.rpc('jofit_claim_off_global');if(burstError)return reply({error:'Snelheidslimiet niet beschikbaar'},503);if(!burstOk)return reply({error:'Even te veel zoekverzoeken. Probeer het over een minuut opnieuw.'},429);
 try{const agent=Deno.env.get('OFF_USER_AGENT')||'';if(!/^JO-FIT\/[\d.]+ \([^()@ ]+@[^()@ ]+\)$/.test(agent))return reply({error:'Configureer een herkenbare OFF_USER_AGENT met contact-e-mailadres'},503);const addr=new URL('https://world.openfoodfacts.org/cgi/search.pl');addr.searchParams.set('search_terms',query);addr.searchParams.set('search_simple','1');addr.searchParams.set('action','process');addr.searchParams.set('json','1');addr.searchParams.set('page_size','10');addr.searchParams.set('fields','code,product_name,product_name_nl,nutriments,quantity');
 const response=await fetch(addr,{headers:{'User-Agent':agent}});if(!response.ok)return reply({error:'Open Food Facts is niet beschikbaar'},502);
 const raw=await response.json();const n=(v:any)=>typeof v==='number'&&Number.isFinite(v)&&v>=0?v:null;
 const products=(raw.products||[]).filter((p:any)=>p.code&&(p.product_name_nl||p.product_name)).map((p:any)=>{const x=p.nutriments||{};return {code:String(p.code),name:String(p.product_name_nl||p.product_name).slice(0,80),per100g:{kcal:n(x['energy-kcal_100g']),protein:n(x.proteins_100g),carbs:n(x.carbohydrates_100g),fat:n(x.fat_100g)},sourceVersion:'Live Open Food Facts; raadpleeg productpagina',source:'Open Food Facts (ODbL)'};});return reply({products,attribution:'Open Food Facts · ODbL · https://world.openfoodfacts.org/'});
 }catch{return reply({error:'Verbinding met productdatabase mislukt'},502)}
});
