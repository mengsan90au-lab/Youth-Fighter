'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),YF=require('../public/world.js'),Combat=require('../public/combat.js'),View=require('../public/combat-presentation.js');
const {fixture,advance,attack,finish,pair}=require('./combat-fixture.js');
test('both hit-confirm routes finish through quick/heavy branches at 20/60Hz without loops',()=>{
 for(const hz of [20,60])for(const path of ['fist','spear'])for(const branch of [0,2]){
  const f=fixture(path);attack(f,0);finish(f,hz);assert.equal(f.p.combo.stage,1);
  attack(f,1);finish(f,hz);assert.equal(f.p.combo.stage,2);
  const a=attack(f,branch);assert.equal(a.comboLink.stage,2);if(branch===0)assert.ok(a.startup<YF.skillsFor(f.p)[0].startup);
  finish(f,hz);assert.equal(f.p.combo,null);assert.ok(f.p.comboLockUntil>f.w.time);
  assert.equal(f.w.events.filter(e=>e.result==='combo-complete').length,1);
 }
});
test('expiry, wrong target/path/action, miss and defense cannot advance a route',()=>{
 for(const mode of ['expiry','target','path','skill','miss','defense']){
  const f=fixture();attack(f,0);finish(f);assert.equal(f.p.combo.stage,1);
  if(mode==='expiry')advance(f.w,1.4);
  if(mode==='target'){const t={...f.t,id:'other'};f.w.entities.push(t);YF.command(f.w,f.p.id,{type:'target',id:t.id});attack(f,1);}
  if(mode==='path'){f.p.path='spear';attack(f,1);}
  if(mode==='skill')attack(f,2);
  if(mode==='miss'){attack(f,1);f.t.x=40;advance(f.w,.3);}
  if(mode==='defense')YF.command(f.w,f.p.id,{type:'guard'});
  assert.equal(f.p.combo,null,mode);
 }
});
test('150ms first-wins buffer is bounded, revalidates target/resources/cooldown and expires',()=>{
 for(const mode of ['success','target','resource','cooldown','expired']){
  const f=fixture();attack(f,0);advance(f.w,.3);const spent=f.p.energy;
  YF.command(f.w,f.p.id,{type:'attack',skill:1});for(let i=0;i<20;i++)YF.command(f.w,f.p.id,{type:'attack',skill:2});
  assert.equal(f.p.pendingAttack.intent.skillId,'fist.elbow-surge');assert.equal(f.p.energy,spent);
  if(mode==='target')f.p.target=null;if(mode==='resource')f.p.energy=0;if(mode==='cooldown')f.p.cd[1]=2;if(mode==='expired')f.p.pendingAttack.until=f.w.time+.01;
  advance(f.w,.1);if(mode==='success'){assert.equal(f.p.action.skillId,'fist.elbow-surge');assert.ok(f.p.energy<90);}else assert.equal(f.p.action,null,mode);
  assert.equal(f.p.pendingAttack,null);
 }
});
test('guard protects its front, spends impact energy, and exposes a bounded timed response',()=>{
 for(const front of [true,false]){
  const f=pair();if(!front){f.q.target=null;f.q.facing=0;}
  YF.command(f.w,f.q.id,{type:'guard'});assert.equal(f.q.energy,92);attack(f,0);advance(f.w,.12);
  assert.equal(f.q.hp,front?113:102);if(front){assert.ok(f.q.energy<85);assert.ok(f.q.counterUntil>f.w.time);}else assert.equal(f.q.counterUntil,0);
 }
});
test('dodge protection boundaries, energy/cooldown and collision use simulation space',()=>{
 for(const hz of [20,60]){
  const f=pair();YF.command(f.w,f.q.id,{type:'dodge',x:0,y:1});assert.equal(f.q.energy,82);attack(f,0);advance(f.w,.12,hz);assert.equal(f.q.hp,120);assert.ok(f.q.counterUntil>f.w.time);
  assert.ok(Math.abs(f.q.y-12.6)<1e-8);advance(f.w,.4,hz);const energy=f.q.energy;YF.command(f.w,f.q.id,{type:'dodge'});assert.equal(f.q.action,null);assert.equal(f.q.energy,energy);
 }
 const f=fixture(),Maps=require('../public/map-catalog.js'),m=Maps.map(f.p.mapId),wall={x:24.4,y:11,w:.4,h:2};m.decorCollision||=[];m.decorCollision.push(wall);
 try{YF.command(f.w,f.p.id,{type:'dodge',x:1,y:0});advance(f.w,.5);assert.ok(f.p.x<24.4);assert.equal(YF.blocked(f.p.x,f.p.y,f.p.mapId),false);}finally{m.decorCollision.pop();}
});
test('heavy stagger interrupts once with resistance and permits escape after recovery',()=>{
 const f=pair();attack(f,1);advance(f.w,.2);assert.equal(f.q.combatState,'stagger');const until=f.q.staggerUntil;
 Combat.stagger(f.w,f.q,.5);assert.equal(f.q.staggerUntil,until);YF.command(f.w,f.q.id,{type:'dodge'});assert.equal(f.q.action,null);
 advance(f.w,.13);YF.command(f.w,f.q.id,{type:'dodge',x:0,y:1});assert.equal(f.q.action.defense,'dodge');
});
test('prowler telegraphs, revalidates range at impact and holds recovery',()=>{
 for(const avoid of [false,true]){
  const f=fixture();Object.assign(f.t,{kind:'wolf',hp:500,maxHp:500,cd:0});YF.step(f.w,.05);assert.equal(f.t.aiState,'startup');const impact=f.t.telegraph.impactAt;
  assert.equal(f.p.hp,120);if(avoid)YF.command(f.w,f.p.id,{type:'move',x:0,y:1});advance(f.w,impact-f.w.time);
  assert.equal(f.p.hp,avoid?120:111);assert.equal(f.t.aiState,'recovery');assert.ok(f.t.telegraph);advance(f.w,.41);assert.equal(f.t.telegraph,null);
 }
});
test('spear locked cone excludes targets moving behind the committed attack',()=>{
 const f=fixture('spear');attack(f,0);f.t.x=23;advance(f.w,.3);assert.equal(f.t.hp,10000);assert.equal(f.p.combo,null);
});
test('reduced-effects telegraphs and HUD consume snapshots without mutation',()=>{
 const f=fixture('spear');attack(f,0);const before=JSON.stringify(f.w),calls=[];
 const ctx=new Proxy({}, {get:(_,k)=>()=>calls.push(k),set:()=>true});View.draw(ctx,[f.p],{project:(x,y)=>({x,y}),time:0,scale:1,reduced:true});
 assert.ok(calls.includes('stroke'));assert.match(View.status(f.p,0),/STARTUP/);assert.equal(JSON.stringify(f.w),before);
});
test('River-Step Counter requires an actual timed dodge and continues against that attacker only',()=>{
 for(const branch of [0,2])for(const hz of [20,60]){
  const f=pair();YF.command(f.w,f.q.id,{type:'dodge',x:0,y:1});attack(f,0);advance(f.w,.12,hz);assert.equal(f.q.combo.id,'fist.river-step-counter');assert.equal(f.q.combo.targetId,f.p.id);
  advance(f.w,.34,hz);YF.command(f.w,f.q.id,{type:'attack',skill:1});assert.equal(f.q.action.comboLink.id,'fist.river-step-counter');advance(f.w,f.q.action.endAt-f.w.time,hz);assert.equal(f.q.combo.stage,2);
  YF.command(f.w,f.q.id,{type:'attack',skill:branch});advance(f.w,f.q.action.endAt-f.w.time,hz);assert.equal(f.q.combo,null);assert.ok(f.w.events.some(e=>e.result==='combo-complete'&&e.comboId==='fist.river-step-counter'));
 }
 const f=pair();YF.command(f.w,f.q.id,{type:'dodge',x:0,y:1});advance(f.w,.5);assert.equal(f.q.combo,null);
});
