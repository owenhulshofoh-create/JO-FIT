/* JO FIT - nutrition math. Unknown is null, never silently zero. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.JOFOODCORE=api;})(typeof window!=='undefined'?window:null,function(){
 'use strict';
 const NAMES=['kcal','protein','carbs','fat'];
 function numberOrNull(x){if(x===null||x===undefined||x==='')return null;const n=Number(x);return Number.isFinite(n)&&n>=0?n:null;}
 function calculate(food,unit,quantity,options={}){
  const amount=Number(quantity);if(!Number.isFinite(amount)||amount<=0||amount>10000)throw Error('Vul een geldige hoeveelheid in');
  const f=food||{};let factor=0,grams=null,ml=null,origin='';
  if(unit==='g'){if(!f.per100g)throw Error('Voedingswaarden per 100 gram ontbreken');grams=amount;factor=amount/100;origin='per100g';}
  else if(unit==='stuk'){const mass=numberOrNull(options.gramsPerPiece??f.gramsPerPiece);if(mass===null||mass<=0)throw Error('Vul het gewicht per stuk in');if(!f.per100g)throw Error('Voedingswaarden per 100 gram ontbreken');grams=amount*mass;factor=grams/100;origin='per100g';}
  else if(unit==='ml'){
    if(f.per100ml){ml=amount;factor=ml/100;origin='per100ml';}
    else {const density=numberOrNull(options.density??f.density);if(density===null||density<=0)throw Error('Vul een bekende dichtheid in; milliliters zijn niet automatisch grammen');if(!f.per100g)throw Error('Voedingswaarden per 100 gram ontbreken');ml=amount;grams=amount*density;factor=grams/100;origin='per100g';}
  }else if(unit==='portie'){
    if(!f.perPortion)throw Error('Een bekende portie ontbreekt');factor=amount;origin='perPortion';
  }else throw Error('Onbekende hoeveelheidseenheid');
  const values=f[origin],out={quantity:amount,unit,grams,ml,source:f.source||'Eigen invoer',origin};
  NAMES.forEach(k=>{const val=numberOrNull(values?.[k]);out[k]=val===null?null:Math.round(val*factor*10)/10});return out;
 }
 function totals(logs){const result={};for(const k of NAMES){let total=0,unknown=0;for(const l of logs||[]){const n=numberOrNull(l[k]);if(n===null)unknown++;else total+=n;}result[k]={value:Math.round(total*10)/10,unknown,complete:unknown===0};}return result;}
 return {calculate,totals,numberOrNull,NAMES};
});
