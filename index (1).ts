/* Server-only account deletion. Service key must NEVER ship to client. */
import {createClient} from 'npm:@supabase/supabase-js@2';
const cors={'Access-Control-Allow-Origin':Deno.env.get('ALLOWED_ORIGIN')||'https://owenhulshofoh-create.github.io','Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin'};
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,'Content-Type':'application/json'}});
Deno.serve(async(req)=>{if(req.method==='OPTIONS')return new Response(null,{headers:cors});if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 const token=req.headers.get('Authorization')?.replace(/^Bearer /i,'');if(!token)return reply({error:'Niet ingelogd'},401);
 let data;try{data=await req.json()}catch{return reply({error:'Ongeldige invoer'},400)}if(data?.confirm!=='VERWIJDER')return reply({error:'Bevestiging vereist'},400);
 const endpoint=Deno.env.get('SUPABASE_URL'),anon=Deno.env.get('SUPABASE_ANON_KEY'),secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');if(!endpoint||!anon||!secret)return reply({error:'Verwijderfunctie niet ingesteld'},503);
 const client=createClient(endpoint,anon,{auth:{persistSession:false}});const {data:{user},error}=await client.auth.getUser(token);if(error||!user)return reply({error:'Ongeldig accounttoken'},401);
 const admin=createClient(endpoint,secret,{auth:{persistSession:false,autoRefreshToken:false}});const result=await admin.auth.admin.deleteUser(user.id);if(result.error)return reply({error:'Account kon niet worden verwijderd'},500);
 return reply({deleted:true});
});
