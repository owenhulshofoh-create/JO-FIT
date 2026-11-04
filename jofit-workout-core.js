/* JO FIT 5.2 — pure powerset and weight progression rules.
   Do not transform historic workouts or previously entered kg. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.JOWORKOUT=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const clamp=(v,min,max,fallback)=>{if(v==null||v==='')return fallback;const n=Number(v);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback};
 function setting(routine,day){const raw=routine?.powersetDays?.[day]||{};return {enabled:raw.enabled===true,restSeconds:Math.round(clamp(raw.restSeconds,30,300,120)/30)*30};}
 function isBodyweight(ex){const s=(ex?.equipment||'')+' '+(ex?.name||'');return /lichaamsgewicht|bodyweight|optrekstang|diprek|muur|vloer|mat/i.test(s)&& !/dumbbell|halter(?!s)|extra gewicht|machine|kabel|cable|gewichtsvest|enkelgewicht/i.test(s);}
 function weightStep(ex){if(!ex||isBodyweight(ex))return 0;const s=(ex.equipment||'')+' '+(ex.name||'');return /machine|kabel|cable|lat.?pulldown|roeimachine|pec.?deck|leg.?curl|leg.?extension|smith|station|katrol/i.test(s)?5:2.5;}
 function recommended(lastKg,ex){if(lastKg===''||lastKg==null||!Number.isFinite(Number(lastKg)))return null;const step=weightStep(ex);return step?Math.round((Number(lastKg)+step)*100)/100:null;}
 function pairLabel(index,enabled){return enabled?`${Math.floor(index/2)+1}${index%2?'B':'A'}`:String(index+1);}
 function count(x){return Math.max(0,Math.min(Math.max(0,Number(x?.sets)||0),Number(x?.done)||0));}
 function restAfterSingle(items,index,oldDone,settings){if(!settings?.enabled)return null;const a=index-index%2,b=a+1;if(!items[b])return null;
 const beforeA=a===index?Math.max(0,Number(oldDone)||0):count(items[a]),beforeB=b===index?Math.max(0,Number(oldDone)||0):count(items[b]);
 const before=Math.min(beforeA,beforeB),after=Math.min(count(items[a]),count(items[b]));if(after<=before)return null;
 const workRemaining=items.some(x=>count(x)<Math.max(0,Number(x.sets)||0));return workRemaining?settings.restSeconds||120:null;
 }
 function taskOrder(items,people,enabled){const out=[];if(!enabled){items.forEach((ex,index)=>{for(let r=1;r<=Number(ex.sets||0);r++)for(const person of people)out.push({index,round:r,person});});return out;}
 for(let start=0;start<items.length;start+=2){const sub=items.slice(start,start+2);const max=Math.max(0,...sub.map(x=>Number(x.sets)||0));for(let r=1;r<=max;r++)sub.forEach((ex,j)=>{if(r>Number(ex.sets))return;for(const person of people)out.push({index:start+j,round:r,person});});}return out;}
 function nextTask(items,people,enabled,progress){return taskOrder(items,people,enabled).find(t=>(progress[String(t.index)]?.[t.person]||0)<t.round)||null;}
 function duoRestAfter(items,people,enabled,progress,task,restSeconds){if(!enabled)return null;const a=task.index-task.index%2,b=a+1;if(!items[b])return null;
 const completed=people.every(person=>(progress[String(a)]?.[person]||0)>=task.round&&(progress[String(b)]?.[person]||0)>=task.round);if(!completed)return null;
 // Only signal at the event that finishes the round for everyone.
 if(task.index!==b||task.person!==people[people.length-1])return null;
 return nextTask(items,people,enabled,progress)?restSeconds||120:null;}
 return {setting,isBodyweight,weightStep,recommended,pairLabel,restAfterSingle,taskOrder,nextTask,duoRestAfter};
});
