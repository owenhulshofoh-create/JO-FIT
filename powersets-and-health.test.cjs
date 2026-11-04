const {test}=require('node:test');
const assert=require('node:assert/strict');
const W=require('../jofit-workout-core.js');
const H=require('../jofit-health.js');
const T=require('../jofit-tech.js');
const ex={equipment:'Dumbbells + schuine bank',name:'Incline Dumbbell Press',steps:['bank','druk','rustig'],avoid:'zwaaien',id:'incline-press'};
test('free weights use 2.5 kg; cable and machines 5 kg',()=>{
 assert.equal(W.weightStep(ex),2.5);
 assert.equal(W.weightStep({equipment:'Kabelstation',name:'Triceps pushdown'}),5);
 assert.equal(W.weightStep({equipment:'Leg-curl machine',name:'Hamstring curl'}),5);
 assert.equal(W.recommended(17.5,ex),20);
 assert.equal(W.recommended(25,{equipment:'Cable station',name:'Row'}),30);
 assert.equal(W.recommended(0,{equipment:'Lichaamsgewicht',name:'Push Up'}),null);
});
test('rest starts only after powerset A and B complete',()=>{
 const items=[{sets:3,done:1},{sets:3,done:0},{sets:3,done:0},{sets:3,done:0}];
 assert.equal(W.restAfterSingle(items,0,0,{enabled:true,restSeconds:120}),null);
 items[1].done=1;
 assert.equal(W.restAfterSingle(items,1,0,{enabled:true,restSeconds:120}),120);
 assert.equal(W.restAfterSingle(items,1,0,{enabled:false,restSeconds:120}),null);
});
test('odd final exercise and pair labels',()=>{
 assert.equal(W.pairLabel(0,true),'1A');
 assert.equal(W.pairLabel(1,true),'1B');
 assert.equal(W.pairLabel(2,true),'2A');
 assert.equal(W.restAfterSingle([{sets:3,done:1}],0,0,{enabled:true}),null);
});
test('technique guidance has five specific incline cues',()=>{
 const g=T.guide(ex);assert.equal(g.lines.length,5);assert.ok(g.lines.some(x=>x.includes('30–60°')));
 assert.ok(T.panel(ex,'').includes('Geen gecontroleerde oefenfoto'));
});
test('health page covers alcohol, cannabis, stimulants, sedatives and steroids',()=>{
 assert.equal(H.content.length,5);
 const texts=H.content.map(x=>x.title).join('|');
 for(const term of ['Alcohol','Cannabis','cocaïne','Verdovende','Anabole'])assert.ok(texts.includes(term));
});
