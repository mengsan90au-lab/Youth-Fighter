'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const YF=require('../public/world.js'),Data=require('../public/combat-data.js'),Save=require('../public/progression.js'),Animation=require('../public/hero-animation.js');
function fixture(path='fist',kind='training'){
 const w=YF.createWorld();w.entities=[];const p=YF.addPlayer(w,'hero');Object.assign(p,{mapId:'bamboo-grove',x:24,y:12,path});
 const t={id:'target',kind,mapId:p.mapId,x:25,y:12,hp:10000,maxHp:10000,homeX:25,homeY:12,cd:99};w.entities.push(t);
 YF.command(w,p.id,{type:'target',id:t.id});return {w,p,t};
}
function advance(w,seconds,hz=60){for(let t=0;t<seconds-1e-9;t+=1/hz)YF.step(w,Math.min(1/hz,seconds-t));}
const hits=w=>w.events.filter(e=>e.kind==='combat'&&e.result==='hit');
test('validated immutable registry resolves only known matching legacy/stable selectors',()=>{
 assert.equal(Data.validate().valid,true);assert.ok(Object.isFrozen(Data.skills[0].hits[0]));
 for(const bad of [null,[],{type:'attack'},{type:'attack',skill:'0'},{type:'attack',skill:NaN},{type:'attack',skill:3},{type:'attack',skillId:'spear.thrust'},{type:'attack',skillId:'fist.naga-fist',skill:1},{type:'attack',skill:0,pvp:'yes'},{type:'attack',skillId:'__proto__'}]){
  const {w,p,t}=fixture();YF.command(w,p.id,bad);advance(w,.8);assert.equal(t.hp,10000);assert.equal(p.energy,100);assert.equal(p.action,null);
 }
 const {w,p,t}=fixture();YF.command(w,p.id,{type:'attack',skillId:'fist.naga-fist',damage:999999,time:1000,focus:100});advance(w,.8);assert.equal(t.hp,9982);
 YF.command(w,p.id,{type:'move',x:Infinity,y:0});assert.deepEqual(p.input,{x:0,y:0});
 YF.command(w,p.id,{type:'target',id:'__proto__'});assert.equal(p.target,null);
});
test('startup, exact impact, recovery, cooldown and once-only hit are authoritative at 20/60 Hz',()=>{
 for(const hz of [20,60])for(const path of ['fist','spear'])for(let i=0;i<3;i++){
  const {w,p,t}=fixture(path),s=YF.skillsFor(p)[i];YF.command(w,p.id,{type:'attack',skill:i});
  assert.equal(t.hp,10000);assert.equal(p.combatState,'startup');assert.equal(p.energy,100-s.cost);
  advance(w,s.startup-.001,hz);assert.equal(t.hp,10000);YF.step(w,.001);assert.equal(t.hp,10000-s.damage);assert.equal(p.combatState,'active');
  assert.equal(hits(w).length,1);assert.ok(Math.abs(hits(w)[0].time-s.startup)<1e-8);
  YF.command(w,p.id,{type:'attack',skill:i});advance(w,1,hz);assert.equal(hits(w).length,1);assert.equal(p.action,null);
  assert.ok(Math.abs(p.energy-Math.min(100,100-s.cost+12*(s.startup+1)))<1e-7);
 }
});
test('one step crossing active and recovery boundaries never repeats a hit',()=>{
 const {w,p,t}=fixture();YF.command(w,p.id,{type:'attack',skill:0});YF.step(w,.1);YF.step(w,.1);
 assert.equal(t.hp,9982);assert.equal(p.combatState,'recovery');advance(w,1);assert.equal(hits(w).length,1);
});
test('impact revalidates removed, dead, distant, cross-map and newly protected targets',()=>{
 for(const change of [({w})=>w.entities=[],({t})=>t.hp=0,({t})=>t.x=40,({t})=>t.mapId='sovann-city',({p,t})=>{p.mapId=t.mapId='sovann-city';t.kind='civilian';}]){
  const f=fixture();YF.command(f.w,f.p.id,{type:'attack',skill:1});change(f);advance(f.w,.3);assert.equal(hits(f.w).length,0);assert.ok(f.p.energy<100);
 }
});
test('wall obstruction fails before spending and again at impact',()=>{
 const {w,p,t}=fixture();Object.assign(p,{mapId:'sovann-city',x:4,y:12});Object.assign(t,{mapId:p.mapId,x:4,y:14});
 // Put a temporary wall across the segment; restore fixture content after assertion.
 const map=require('../public/map-catalog.js').map(p.mapId),wall={x:3,y:12.7,w:2,h:.2};map.decorCollision||=[];map.decorCollision.push(wall);
 try{YF.command(w,p.id,{type:'attack',skill:1});assert.equal(p.action,null);assert.equal(p.energy,100);}finally{map.decorCollision.pop();}
 YF.command(w,p.id,{type:'attack',skill:1});assert.ok(p.action);map.decorCollision.push(wall);
 try{advance(w,.3);assert.equal(hits(w).length,0);}finally{map.decorCollision.pop();}
});
test('travel, arrest, restore and equipment identity cannot leave pending damage',()=>{
 for(const mode of ['travel','restore','arrest','equipment']){
  const {w,p,t}=fixture();YF.command(w,p.id,{type:'attack',skill:1});
  if(mode==='travel')YF.enterMap(w,p,'sovann-city',12,12);
  if(mode==='restore')Save.restore(p,Save.snapshot(p));
  if(mode==='arrest')p.jail=2;
  if(mode==='equipment')p.city.equipment.weapon='reed-spear';
  advance(w,.8);assert.equal(hits(w).length,0,mode);assert.equal(p.action,null);assert.equal(t.hp,10000);
 }
});
test('movement intent is held during commitment and resumes through existing footwork',()=>{
 const {w,p}=fixture();YF.command(w,p.id,{type:'attack',skill:1});YF.command(w,p.id,{type:'move',x:0,y:1});advance(w,.3);assert.equal(p.y,12);advance(w,.6);assert.ok(p.y>12);
});
test('area victims have independent map, eligibility and exactly-once kill checks',()=>{
 const {w,p,t}=fixture('spear');Object.assign(t,{kind:'wolf',hp:20,maxHp:20});
 const civilian={...t,id:'civilian',kind:'civilian',hp:100,maxHp:100,x:26},remote={...t,id:'remote',mapId:'sovann-city'};w.entities.push(civilian,remote);
 YF.command(w,p.id,{type:'attack',skill:2});advance(w,1);assert.equal(p.kills,1);assert.equal(p.gold,8);assert.equal(p.xp,25);assert.equal(civilian.hp,100);assert.equal(remote.hp,20);assert.equal(hits(w).length,1);
 advance(w,1);assert.equal(p.kills,1);
});
test('peaceful city attack requires explicit consent and sparring remains nonlethal',()=>{
 for(const duel of [false,true]){
  const {w,p}=fixture();w.entities=[];Object.assign(p,{mapId:'sovann-temple-ward',x:20,y:20});
  const q=YF.addPlayer(w,'other');Object.assign(q,{mapId:p.mapId,x:21,y:20,hp:5,gold:100});YF.command(w,p.id,{type:'target',id:q.id});
  YF.command(w,p.id,{type:'attack',skill:1});assert.equal(p.action,null);
  if(duel){YF.command(w,p.id,{type:'city-duel-request',target:q.id});YF.command(w,q.id,{type:'city-duel-accept'});}
  YF.command(w,p.id,{type:'attack',skill:1,...(!duel?{pvp:true}:{})});advance(w,.3);
  if(duel){assert.ok(q.hp>=1);assert.equal(p.wanted,0);assert.equal(q.gold,100);assert.equal(q.duel,null);}
  else {assert.equal(p.wanted,3);assert.equal(q.gold,90);assert.equal(q.mapId,'sovann-city');}
 }
});
test('presentation poses consume action state without changing world or reviving legacy swings',()=>{
 const {w,p}=fixture();YF.command(w,p.id,{type:'attack',skill:0});const before=JSON.stringify(w);
 assert.equal(Animation.pose(p,w.time).state,'windup');assert.equal(JSON.stringify(w),before);
 advance(w,.5);assert.equal(Animation.pose(p,w.time).state,'idle');
});
