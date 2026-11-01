'use strict';
const assert = require('node:assert/strict');
const m=require('../upgrade/motion-core.js');
assert.equal(m.type('Barbell squat'),'knee');
assert.equal(m.type('Dumbbell biceps curl'),'elbow');
assert.equal(m.type('Bankdrukken'),null);
const samples = [];
for(let i=0;i<=200;i++){
  const t=i*.075;
  const a=120 + 40*Math.cos(2*Math.PI*(4*t/15));
  samples.push({t,a});
}
const r=m.analyze(samples);
assert.equal(r.status,'ok');
assert.equal(r.reps,4);
assert.equal(r.coverage,1);
assert.equal(m.compare(r,4).withinOne,true);
assert.equal(m.analyze(samples.map(s=>({...s,a:160}))).status,'insufficient');
assert.equal(m.analyze(samples.map((s,i)=>({...s,a:i%3?null:s.a}))).status,'insufficient');
assert.equal(m.analyze([]).reps,null);
assert.equal(m.angle({x:0,y:0,visibility:0.1},{x:0,y:1},{x:1,y:1},100,100),null);
assert.equal(Math.round(m.angle({x:1,y:0},{x:0,y:0},{x:0,y:1},100,100)),90);
console.log('OK: motion engine — four reps, stationary, occlusion, joint angles, unsupported movements');
