'use strict';
const assert = require('node:assert/strict');
const c = require('../upgrade/coach-engine.js');
const exercise = {id:'bench',name:'Bankdrukken',equipment:'Barbell'};
const plan = [{id:'bench',kg:40,sets:3,reps:'8-12'}];
const sets = [
 ...[0,1,2].map(i=>({exact:true,exerciseId:'bench',date:'2026-10-28',kg:40,reps:12,rir:2,id:i})),
 ...[0,1,2].map(i=>({exact:true,exerciseId:'bench',date:'2026-10-31',kg:40,reps:12,rir:2,id:i+3}))
];
const input={prefs:c.DEFAULTS, sets,plan, exercises:{bench:exercise},today:'2026-11-01'};
assert.equal(c.analyze({prefs:c.DEFAULTS,sets:[],plan,exercises:{bench:exercise}}).status,'beginnen');
const ok=c.analyze(input);
assert.equal(ok.actions.length,1);
assert.equal(ok.actions[0].to,42.5);
assert.equal(c.analyze({...input,checkin:{date:'2026-11-01',pain:true}}).actions.length,0);
assert.equal(c.analyze({...input,checkin:{date:'2026-11-01',energy:1}}).actions.length,0);
assert.equal(c.analyze({...input,checkin:{date:'2026-11-01',sleep:5}}).actions.length,0);
assert.equal(c.analyze({...input,prefs:{...c.DEFAULTS,exclude:'Bankdrukken'}}).actions.length,0);
assert.equal(c.analyze({...input,sets:sets.slice(0,3)}).actions.length,0);
assert.equal(c.analyze({...input,prefs:{...c.DEFAULTS,goal:'fatloss'}}).actions.length,1);
assert.equal(c.normalize({days:99,minutes:-20}).days,7);
assert.equal(c.normalize({days:99,minutes:-20}).minutes,20);
const low=sets.map(s=>({...s,reps:5,rir:0}));
assert.equal(c.analyze({...input,sets:low}).actions[0].to,38);
console.log('OK: adaptive coach — beginner, progress, fatigue, pain, exclusions, no data, low reps');
