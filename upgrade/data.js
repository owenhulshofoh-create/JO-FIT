/* JO FIT 4.1: independent per-profile data and analysis. No third-party dependencies. */
(function(w){'use strict';
const PREFIX='jofit_upgrade_v1_';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=x=>(x===''||x===undefined||x===null||!Number.isFinite(Number(x)))?null:Number(x);
const first=x=>{const m=String(x??'').match(/\d+/);return m?Number(m[0]):null};
const date=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const profiles=()=>typeof allProfiles!=='undefined'?allProfiles.profiles:{};
const active=()=>typeof activeProfile!=='undefined'?activeProfile:'p_eigen';
const day=()=>typeof current!=='undefined'?current:'ma';
const tab=()=>typeof window.tab!=='undefined'?window.tab:document.querySelector('[data-tab].active')?.dataset.tab||'schema';
const catalog=()=>typeof EX!=='undefined'?EX:{};
const days=()=>typeof keys!=='undefined'?keys:['ma','wo','vr','za','zo'];
const name=(id)=>profiles()[id]?.name||'Persoonlijk profiel';
const exname=(id)=>catalog()[id]?.name||id;
const nformat=(n,d=1)=>n===null||n===undefined||!Number.isFinite(Number(n))?'—':Number(n).toLocaleString('nl-NL',{maximumFractionDigits:d});
function get(id=active()){try{const x=JSON.parse(localStorage.getItem(PREFIX+id)||'null');if(x?.version===1&&Array.isArray(x.sets))return{version:1,sets:x.sets,prefs:x.prefs||{}};}catch(e){console.warn(e)}return{version:1,sets:[],prefs:{}}}
function save(id,obj){try{localStorage.setItem(PREFIX+id,JSON.stringify(obj));window.dispatchEvent(new Event('jofit-updated'));return true}catch(e){alert('JO FIT heeft onvoldoende opslagruimte. Exporteer eerst je volledige back-up.');return false}}
function prefs(id=active()){return get(id).prefs}
function setPrefs(change,id=active()){const v=get(id);v.prefs={...v.prefs,...change};return save(id,v)}
function plan(id=active(),d=day()){const p=profiles()[id];return p?.routines?.[p.activeRoutine]?.schedule?.[d]||[]}
function combined(id=active()){
 const exact=get(id).sets.filter(s=>/^\d{4}-\d{2}-\d{2}$/.test(s.date||'')).map(s=>({...s,kg:num(s.kg),reps:num(s.reps),rir:num(s.rir),exact:true}));
 const counts={};exact.forEach(s=>{const k=[s.date,s.day,s.exerciseId].join('|');counts[k]=(counts[k]||0)+1});
 const old=[];for(const session of profiles()[id]?.sessions||[]){if(!/^\d{4}-\d{2}-\d{2}$/.test(session.date||''))continue;
  for(const ex of session.exercises||[]){const n=Math.min(50,Math.max(0,Number(ex.sets)||0)),k=[session.date,session.day,ex.id].join('|'),skip=Math.min(n,counts[k]||0);counts[k]=Math.max(0,(counts[k]||0)-skip);
    for(let i=skip;i<n;i++)old.push({id:`old-${session.id}-${ex.id}-${i}`,date:session.date,day:session.day,exerciseId:ex.id,kg:num(ex.kg),reps:first(ex.reps),rir:num(ex.rir),exact:false});}}
 return [...exact,...old].sort((a,b)=>a.date.localeCompare(b.date));
}
function records(exId,id=active()){
 const set=combined(id).filter(s=>s.exerciseId===exId),weighted=set.filter(s=>s.kg>0),exact=set.filter(s=>s.exact&&s.reps>=1),values=exact.filter(s=>s.kg>0);
 const max=a=>a.length?Math.max(...a):null;const daily={};values.forEach(s=>daily[s.date]=(daily[s.date]||0)+s.kg*s.reps);
 return {weight:max(weighted.map(s=>s.kg)),reps:max(exact.map(s=>s.reps)),e1rm:max(values.filter(s=>s.reps<=12).map(s=>Math.round((s.kg*(1+s.reps/30))*10)/10)),volume:max(Object.values(daily)),sets:set.length,exact:exact.length};
}
function weekly(exId,count=8){const all=combined().filter(s=>s.exerciseId===exId);const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-(d.getDay()+6)%7);const format=x=>`${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;
 return Array.from({length:count},(_,i)=>{const start=new Date(d),end=new Date(d);start.setDate(start.getDate()-7*(count-i-1));end.setDate(start.getDate()+7);const w=all.filter(s=>s.date>=format(start)&&s.date<format(end)&&s.kg>0);return{label:'W'+(i+1),weight:w.length?Math.max(...w.map(x=>x.kg)):null,sets:all.filter(s=>s.date>=format(start)&&s.date<format(end)).length}})}
function muscles(){const d=new Date();d.setDate(d.getDate()-6);const iso=d.toLocaleDateString('sv-SE');const a={};combined().filter(s=>s.date>=iso).forEach(s=>(catalog()[s.exerciseId]?.primary||[]).forEach(m=>a[m]=(a[m]||0)+1));return Object.entries(a).sort((a,b)=>b[1]-a[1]);}
function advise(exId){const data=combined().filter(s=>s.exerciseId===exId&&s.exact&&s.kg>0),dates=[...new Set(data.map(s=>s.date))].slice(-2);
 if(dates.length<2)return{type:'more',text:'Registreer minimaal twee trainingen met echte herhalingen en RIR voor een gewichtsadvies.'};
 const groups=dates.map(d=>data.filter(s=>s.date===d));if(groups.some(g=>g.length<2||g.some(s=>s.rir===null)))return{type:'more',text:'Log minimaal twee sets per training en vul ook RIR in.'};
 const target=plan().flatMap(x=>x).find(e=>e.id===exId)?.reps||'8–12',m=String(target).match(/\d+/g),top=m?Number(m.at(-1)):12,sets=groups.flat(),kg=sets.at(-1).kg;
 if(sets.some(x=>x.kg!==kg))return{type:'hold',text:'Houd hetzelfde gewicht eerst twee trainingen aan voor een duidelijke vergelijking.'};
 if(sets.every(s=>s.reps>=top&&s.rir>=1&&s.rir<=4)){const gear=catalog()[exId]?.equipment||'',step=/dumbbell|halter/i.test(gear)&&/dumbbell/i.test(gear)?1:2.5;return{type:'up',kg:kg+step,text:`Alle sets haalden het boveneinde van ${target} met 1–4 RIR. Probeer voorzichtig +${step} kg, indien je materiaal dit toelaat.`}}
 if(sets.filter(s=>s.reps<top-3&&s.rir<=1).length>1)return{type:'down',text:'Meerdere sets halen het doel niet bij hoge inspanning. Overweeg iets minder gewicht of extra herstel.'};
 return{type:'hold',text:'Houd je gewicht gelijk en werk eerst aan nette herhalingen.'};}
const timers=new Map();const timer=(id)=>Math.max(0,Math.ceil(((timers.get(id)||0)-Date.now())/1000));const clock=n=>`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;const startTimer=(id,seconds)=>timers.set(id,Date.now()+Number(seconds||90)*1000);
function addSet(id,input){if(!profiles()[id])throw Error('Profiel ontbreekt');const kg=input.kg===''?null:Number(input.kg),reps=Number(input.reps),rir=input.rir===''?null:Number(input.rir);
 if(!catalog()[input.exerciseId]||kg!==null&&(!Number.isFinite(kg)||kg<0||kg>500)||!Number.isInteger(reps)||reps<1||reps>100||rir!==null&&(!Number.isFinite(rir)||rir<0||rir>10))throw Error('Controleer oefening, gewicht, herhalingen en RIR');
 const before=records(input.exerciseId,id),obj=get(id);obj.sets.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random(),date:date(),day:input.day||day(),exerciseId:input.exerciseId,kg,reps,rir});if(obj.sets.length>10000)throw Error('Te veel sets; maak eerst een back-up');if(!save(id,obj))throw Error('Set niet opgeslagen');const after=records(input.exerciseId,id);return Object.entries({weight:'Gewichtsrecord',reps:'Herhalingsrecord',e1rm:'Geschat 1RM-record',volume:'Volumerecord'}).filter(([k])=>before[k]!==null&&after[k]!==null&&after[k]>before[k]+.001).map(([,v])=>v)}
function mark(d,exId){try{const entry=plan(active(),d).find(x=>x.id===exId&&Number(x.done||0)<Number(x.sets||0));if(entry){entry.done=(Number(entry.done)||0)+1;if(typeof persist==='function')persist()}}catch(e){console.warn(e)}}
function updateWeight(exId,kg){let count=0;days().forEach(d=>plan().forEach(x=>{if(x.id===exId){x.kg=kg;count++}}));if(count&&typeof persist==='function')persist();return count}
function updateSetCount(d,exId,sets){const n=Number(sets);if(!Number.isInteger(n)||n<1||n>8)return false;let count=0;plan(active(),d).forEach(x=>{if(x.id===exId){x.sets=n;x.done=Math.min(Number(x.done)||0,n);count++}});if(count&&typeof persist==='function')persist();return count>0}
w.JOFIT_DATA={updateSetCount,esc,num,date,profiles,active,day,tab,catalog,days,name,exname,nformat,get,save,prefs,setPrefs,plan,combined,records,weekly,muscles,advise,addSet,mark,updateWeight,timer,clock,startTimer};
})(window);
