'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),YF=require('../public/world.js'),Combat=require('../public/combat.js'),Save=require('../public/progression.js'),Timing=require('../public/performance.js');
const {fixture,advance,attack,finish,pair}=require('./combat-fixture.js');
test('30/60/120 simulated render schedules never alter ultimate damage/cooldowns/energy',()=>{
 const outcomes=[];for(const fps of [30,60,120]){
  const f=fixture('spear');f.p.focus=100;YF.command(f.w,f.p.id,{type:'attack',skillId:'spear.river-crown-tempest'});
  const clock=new Timing.Clock(60);clock.reset(0);for(let i=1;i<=fps*2;i++){const now=i*1000/fps;clock.advance(now,dt=>YF.step(f.w,dt));clock.draw(now,fps);}
  outcomes.push([f.t.hp,f.p.energy,f.p.extraCd['spear.river-crown-tempest'],f.p.focus]);
 }for(const row of outcomes.slice(1))row.forEach((n,i)=>assert.ok(Math.abs(n-outcomes[0][i])<1e-8));
});
test('dodge half-open protection and guard break have precise authoritative boundaries',()=>{
 const f=pair();YF.command(f.w,f.q.id,{type:'dodge',x:0,y:1});const source=f.p;
 f.w.time=.039;assert.equal(Combat.defenseResult(f.w,f.q,source,10).result,'hit');f.w.time=.04;assert.equal(Combat.defenseResult(f.w,f.q,source,10).result,'dodged');f.w.time=.22;assert.equal(Combat.defenseResult(f.w,f.q,source,10).result,'hit');
 const g=pair();YF.command(g.w,g.q.id,{type:'guard'});g.q.energy=0;g.w.time=.1;assert.equal(Combat.defenseResult(g.w,g.q,g.p,18).damage,18);assert.equal(g.q.combatState,'stagger');assert.equal(g.q.action,null);
});
test('multihit target removal, map change and obstruction at later strikes fail closed',()=>{
 for(const mode of ['remove','map','wall']){
  const f=fixture();f.p.focus=100;YF.command(f.w,f.p.id,{type:'attack',skillId:'fist.golden-basin-resonance'});advance(f.w,.66);assert.equal(f.w.events.filter(e=>e.result==='hit').length,1);
  const map=require('../public/map-catalog.js').map(f.p.mapId);if(mode==='remove')f.w.entities=[];if(mode==='map')f.t.mapId='sovann-city';const wall={x:24.4,y:11,w:.1,h:2};if(mode==='wall'){map.decorCollision||=[];map.decorCollision.push(wall);}
  try{advance(f.w,1);assert.equal(f.w.events.filter(e=>e.result==='hit').length,1);}finally{if(mode==='wall')map.decorCollision.pop();}
 }
});
test('equipment/path restrictions preserve inventory and durability still affects bonuses',()=>{
 const f=fixture();Object.assign(f.p,{mapId:'sovann-city',x:12,y:12});f.p.city.inventory={wraps:1,'reed-spear':1};YF.command(f.w,f.p.id,{type:'city-equip',item:'wraps',npc:null,target:null,amount:NaN});assert.equal(f.p.city.equipment.weapon,'wraps');
 YF.command(f.w,f.p.id,{type:'equip',path:'spear'});assert.equal(f.p.city.equipment.weapon,undefined);assert.equal(f.p.city.inventory.wraps,1);YF.command(f.w,f.p.id,{type:'city-equip',item:'wraps'});assert.equal(f.p.city.equipment.weapon,undefined);
 YF.command(f.w,f.p.id,{type:'city-equip',item:'reed-spear'});assert.equal(f.p.city.equipment.weapon,'reed-spear');Object.assign(f.p,{mapId:'bamboo-grove',x:24,y:12});f.t.kind='wolf';attack(f,0);YF.command(f.w,f.p.id,{type:'city-unequip',slot:'weapon'});finish(f);assert.equal(f.p.city.durability,99);assert.equal(f.p.city.equipment.weapon,'reed-spear');assert.equal(f.t.hp,9982);
});
test('original Temple training and exactly-once bounty arrest remain command-driven',()=>{
 const w=YF.createWorld(),p=YF.addPlayer(w,'student');YF.enterMap(w,p,'sovann-temple-ward',20,16);advance(w,.81);YF.command(w,p.id,{type:'city-quest-accept',npc:'temple-trainer',quest:'temple-training'});assert.equal(p.city.quests['temple-training'].status,'active');Object.assign(p,{x:23,y:17});YF.command(w,p.id,{type:'target',id:'temple-dummy'});
 for(let i=0;i<3;i++){YF.command(w,p.id,{type:'attack',skill:0});advance(w,.51);}assert.equal(p.city.quests['temple-training'].status,'ready');Object.assign(p,{x:20,y:16});YF.command(w,p.id,{type:'city-quest-claim',npc:'temple-trainer',quest:'temple-training'});assert.equal(p.city.quests['temple-training'].status,'done');assert.equal(p.gold,15);
 const f=fixture();f.t.kind='bandit';f.t.hp=30;f.p.bounty=true;YF.command(f.w,f.p.id,{type:'arrest'});assert.equal(f.p.bountyDone,true);assert.equal(f.p.gold,100);YF.command(f.w,f.p.id,{type:'arrest'});assert.equal(f.p.gold,100);
});
test('actual nullable city UI payloads preserve inventory consumption and bank/save behavior',()=>{
 const f=fixture();f.p.city.inventory.herbs=1;f.p.hp=60;YF.command(f.w,f.p.id,{type:'city-use',item:'herbs',npc:null,target:null,amount:NaN});assert.equal(f.p.hp,90);assert.equal(f.p.city.inventory.herbs,undefined);
 const w=YF.createWorld(),p=YF.addPlayer(w,'banker-test'),npc=YF.target(w,'market-bank');Object.assign(p,{mapId:npc.mapId,x:npc.x,y:npc.y,gold:50});
 YF.command(w,p.id,{type:'city-deposit',npc:npc.id,target:null,amount:10});assert.equal(p.city.bankGold,10);assert.equal(p.gold,40);
 const q=YF.addPlayer(w,'restored-bank');Save.restore(q,Save.snapshot(p));assert.equal(q.city.bankGold,10);assert.equal(q.gold,40);
});
test('travel, arrest and restore clear transient stagger/route locks and invalid intent cannot corrupt time',()=>{
 const f=fixture();f.p.staggerUntil=50;f.p.comboLockUntil=80;YF.enterMap(f.w,f.p,'sovann-city',12,12);assert.equal(f.p.staggerUntil,0);assert.equal(f.p.comboLockUntil,0);
 f.p.comboLockUntil=100;Save.restore(f.p,Save.snapshot(f.p));assert.equal(f.p.comboLockUntil,0);
 const at=f.w.time;YF.step(f.w,NaN);YF.step(f.w,Infinity);YF.step(f.w,-1);assert.equal(f.w.time,at);
});
