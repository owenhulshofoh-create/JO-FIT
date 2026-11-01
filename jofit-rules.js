/* JO FIT 5 - deterministic exercise requirements and plan generator.
   No medical diagnosis, no invented start weights, no AI claims. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.JORULES=api;})(typeof window!=='undefined'?window:null,function(){
'use strict';
const EQUIPMENT={dumbbells:'Dumbbells',barbell:'Halterstang',plates:'Halterschijven',bench:'Verstelbare bank',rack:'Squatrek / haltersteunen',cable:'Kabelstation',lat:'Lat-pulldownstation',latbar:'Latstang',row:'Roeimachine',pecdeck:'Pec-deckmachine',legcurl:'Leg-curlmachine',legextension:'Leg-extensionmachine',pullup:'Optrekstang',dipbar:'Diprek',abwheel:'Ab-wheel',bands:'Weerstandsbanden',step:'Stevige verhoging',mat:'Mat',preacher:'Preacherbank',smith:'Smith machine'};
// Alternative equipment groups: one complete group must be available.
// Bodyweight/floor needs no extra device. The location name NEVER grants equipment.
const RAW={
'incline-press':[['dumbbells','bench'],'pushH','chest'],
'crossbody-triceps':[['cable'],'arms','triceps'],
'shoulder-press':[['dumbbells','bench'],'pushV','shoulders'],
'triceps-dips':[['dipbar'],'pushH','triceps'],
'lat-wide':[['lat'],['cable','latbar'],'pullV','lats'],
'incline-curl':[['dumbbells','bench'],'arms','biceps'],
'bentover-row':[['barbell','plates'],'pullH','midback'],
'face-pull':[['cable'],'pullH','reardelts'],
'inverted-row':[['rack','barbell'],'pullH','midback'],
'hammer-curl':[['dumbbells'],'arms','biceps'],
'bench-press':[['barbell','plates','bench','rack'],'pushH','chest'],
'overhead-triceps':[['cable'],'arms','triceps'],
'pec-deck':[['pecdeck'],'pushH','chest'],
'lateral-raise':[['dumbbells'],'accessory','sidedelts'],
'reverse-fly':[['dumbbells'],'pullH','reardelts'],
 'triceps-pushdown':[['cable'],'arms','triceps'],
'lat-narrow':[['lat'],['cable','latbar'],'pullV','lats'],
'standing-curl':[['dumbbells'],'arms','biceps'],
'seated-cable-row':[['row'],['cable'],'pullH','midback'],
'preacher-curl':[['preacher','dumbbells'],['preacher','barbell','plates'],'arms','biceps'],
'squat':[['barbell','plates','rack'],'squat','quads'],
'hamstring-curl':[['legcurl'],'hinge','hamstrings'],
'calf-raise':[['step'],'calves','calves'],
'cable-crunch':[['cable'],'core','abs'],
'leg-extension':[['legextension'],'squat','quads'],
'weighted-leg-raise':[['pullup'],['dipbar'],['bench'],'core','abs'],
'pullup':[['pullup'],'pullV','lats'],
'chinup':[['pullup'],'pullV','lats'],
'pushup':[[],'pushH','chest'],
'cable-fly':[['cable'],'pushH','chest'],
'singlearm-row':[['dumbbells','bench'],'pullH','lats'],
'cable-reverse-fly':[['cable'],'pullH','reardelts'],
'rdl':[['barbell','plates'],'hinge','hamstrings'],
'lunge':[[],['dumbbells'],'squat','quads'],
'hip-thrust':[['bench','barbell','plates'],'hinge','glutes'],
'goblet-squat':[['dumbbells'],'squat','quads'],
'ab-wheel':[['abwheel'],'core','abs'],
'seated-calf':[['bench','dumbbells'],['bench','barbell','plates'],'calves','calves'],
'rope-hammer':[['cable'],'arms','biceps'],
'cable-lateral':[['cable'],'accessory','sidedelts'],
'incline-fly':[['dumbbells','bench'],'pushH','chest'],
'glute-bridge':[[],'hinge','glutes'],
'dead-bug':[[],'core','abs'],
'farmer-carry':[['dumbbells'],'core','abs'],
'bw-squat':[[],'squat','quads'],
'split-squat':[[],'squat','quads'],
'wall-sit':[[],'squat','quads'],
'pike-pushup':[[],'pushV','shoulders'],
'incline-pushup':[['bench'],['step'],'pushH','chest'],
'band-row':[['bands'],'pullH','midback'],
'band-pulldown':[['bands','pullup'],'pullV','lats'],
'band-pull-apart':[['bands'],'pullH','reardelts'],
'band-chest-press':[['bands'],'pushH','chest'],
'bird-dog':[[],'core','abs'],
'side-plank':[[],'core','obliques'],
'singleleg-bridge':[[],'hinge','glutes'],
'step-up':[['step'],'squat','quads'],
'wall-pushup':[[],'pushH','chest'],
'prone-y-raise':[[],'pullH','midback']
};
// Each entry has alternative equipment arrays, a pattern, and a primary target.
const CATALOG=Object.fromEntries(Object.entries(RAW).map(([id,raw])=>{
const arr=raw.slice(),primary=arr.pop(),pattern=arr.pop();return [id,{id,anyOf:arr,pattern,primary,level:id==='wall-pushup'?'beginner':'all'}];
}));
const DAYS=['ma','di','wo','do','vr','za','zo'];
const NAMES={ma:'maandag',di:'dinsdag',wo:'woensdag',do:'donderdag',vr:'vrijdag',za:'zaterdag',zo:'zondag'};
const PLANS={1:['full'],2:['full','full'],3:['full','full','full'],4:['upper','lower','upper','lower'],5:['push','pull','legs','upper','lower'],6:['push','pull','legs','push','pull','legs']};
const PATTERNS={full:['squat','pushH','pullH','hinge','pullV','pushV','core','arms'],upper:['pushH','pullH','pushV','pullV','arms','accessory','core'],lower:['squat','hinge','calves','core','squat'],push:['pushH','pushV','arms','accessory'],pull:['pullH','pullV','arms','pullH'],legs:['squat','hinge','calves','core']};
const TYPES={full:'Full body',upper:'Bovenlichaam',lower:'Onderlichaam',push:'Push',pull:'Pull',legs:'Benen & core'};
function canDo(id,equipment){const meta=CATALOG[id];if(!meta)return false;const available=new Set(Array.isArray(equipment)?equipment:[]);return meta.anyOf.some(group=>group.every(token=>available.has(token)));}
function getLevel(p){const score=(p.experience==='long'?2:p.experience==='some'?1:0)+(p.technique==='strong'?2:p.technique==='okay'?1:0)+(p.consistency==='high'?2:p.consistency==='medium'?1:0);return score>=5?'gevorderd':score>=3?'gemiddeld':'beginner';}
function chooseDays(p){const n=Math.max(1,Math.min(6,Number(p.days)||3));const pref=Array.isArray(p.preferredDays)?p.preferredDays.filter(x=>DAYS.includes(x)):[];return [...new Set([...pref,...DAYS])].slice(0,n).sort((a,b)=>DAYS.indexOf(a)-DAYS.indexOf(b));}
function generate(profile,knownIds){const p=profile||{},ids=new Set(knownIds||Object.keys(CATALOG)),equipment=Array.isArray(p.equipment)?p.equipment:[];
const level=getLevel(p),days=chooseDays(p),types=PLANS[days.length]||PLANS[3],avoid=new Set(Array.isArray(p.avoid)?p.avoid:[]),love=new Set(Array.isArray(p.favorites)?p.favorites:[]),focus=new Set(Array.isArray(p.focus)?p.focus:[]);
const minutes=Math.min(120,Math.max(20,Number(p.minutes)||45));const sets=level==='beginner'?2:level==='gevorderd'?3:3;
const reps=p.goal==='strength'?'5–8':p.goal==='fitness'?'10–15':'8–12',rest=p.goal==='strength'?150:90;
const limit=Math.max(2,Math.min(8,Math.floor((minutes-8)/(sets*(rest/60+1.2)+2))));
const available=Object.keys(CATALOG).filter(id=>ids.has(id)&&canDo(id,equipment)&&!avoid.has(id));
const warnings=[];if(p.limitations?.trim())warnings.push('Je hebt een beperking gemeld. JO FIT beoordeelt geen medische veiligheid; controleer elke oefening en vraag zo nodig deskundig advies.');
if(!equipment.length)warnings.push('Er is nog geen materiaal aangevinkt. Alleen oefeningen zonder extra benodigdheden worden voorgesteld.');
const usedFrequency={};const output=days.map((day,i)=>{const type=types[i],chosen=[],patterns=PATTERNS[type];
for(let j=0;chosen.length<limit&&j<Math.max(patterns.length,limit*2);j++){
 const pattern=patterns[j%patterns.length];const candidates=available.filter(id=>CATALOG[id].pattern===pattern&&!chosen.includes(id));
 candidates.sort((a,b)=>((love.has(b)?5:0)+(focus.has(CATALOG[b].primary)?3:0)-(usedFrequency[b]||0)*3)-((love.has(a)?5:0)+(focus.has(CATALOG[a].primary)?3:0)-(usedFrequency[a]||0)*3));
 if(candidates[0]){const id=candidates[0];chosen.push(id);usedFrequency[id]=(usedFrequency[id]||0)+1;}
}
if(chosen.length<Math.min(3,limit))warnings.push(`Voor ${NAMES[day]} zijn maar ${chosen.length} geschikte oefeningen gevonden. Voeg materiaal toe of pas je doel aan.`);
return {day,type,label:TYPES[type],items:chosen.map(id=>({id,sets,reps,kg:'',done:0,rest:CATALOG[id].pattern==='core'?60:rest,kind:'work'}))};});
return {level,days:output,minutes,rest,sets,reps,warnings:[...new Set(warnings)],equipment:[...equipment],generatedAt:new Date().toISOString(),basis:'regels; geen medische of AI-beoordeling'};
}
return {EQUIPMENT,CATALOG,DAYS,NAMES,PLANS,canDo,chooseDays,getLevel,generate};
});
