'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),YF=require('../public/world.js'),Data=require('../public/combat-data.js'),Focus=require('../public/combat-focus.js'),Save=require('../public/progression.js');
const {fixture,advance,attack,finish,pair}=require('./combat-fixture.js');
const ultimate=path=>Data.skills.find(s=>s.path===path&&s.category==='ultimate');
const hitEvents=w=>w.events.filter(e=>e.kind==='combat'&&e.result==='hit');
test('real hostile outcomes award Focus once with finite route/global/source caps and exclusions',()=>{
 const f=fixture();f.t.kind='wolf';attack(f,0);finish(f);assert.equal(f.p.focus,4);attack(f,1);finish(f);assert.equal(f.p.focus,8);attack(f,0);finish(f);assert.equal(f.p.focus,20);assert.ok(f.p.ultimateLink);
 for(let i=0;i<6;i++){advance(f.w,.55);attack(f,0);finish(f);}assert.equal(f.p.focus,20);
 for(const kind of ['training','guard','civilian','player']){const q=fixture();q.t.kind=kind;if(kind==='guard'||kind==='civilian')YF.command(q.w,q.p.id,{type:'attack',skill:0,pvp:true});else attack(q,0);finish(q);assert.equal(q.p.focus,0,kind);}
 const g=fixture();g.t.kind='wolf';assert.equal(Focus.award(g.w,g.p,g.t,20),20);const second={...g.t,id:'second'};assert.equal(Focus.award(g.w,g.p,second,20),10);assert.equal(g.p.focus,30);assert.equal(Focus.award(g.w,g.p,{...g.t,id:'third'},10),0);
 g.w.time=10;assert.equal(Focus.award(g.w,g.p,second,20),10);g.w.time=31;g.p.focus=98;assert.equal(Focus.award(g.w,g.p,g.t,20),2);assert.equal(g.p.focus,100);assert.ok(g.p.focusLedger.length<=64);
});
test('timed hostile defense awards Focus; practice, harmless spam and PvP do not',()=>{
 const f=fixture();Object.assign(f.t,{kind:'wolf',cd:0});YF.step(f.w,.05);advance(f.w,.3);YF.command(f.w,f.p.id,{type:'guard'});advance(f.w,.1);assert.equal(f.p.focus,6);
 const q=pair();YF.command(q.w,q.q.id,{type:'guard'});attack(q,0);advance(q.w,.12);assert.equal(q.q.focus,0);
});
test('standard ultimates spend independent resources and execute exact schedules once at 20/60/10Hz',()=>{
 for(const hz of [20,60,10])for(const path of ['fist','spear']){
  const f=fixture(path),s=ultimate(path);f.p.focus=100;YF.command(f.w,f.p.id,{type:'attack',skillId:s.id});assert.equal(f.p.focus,40);assert.equal(f.p.energy,70);assert.equal(f.p.extraCd[s.id],30);assert.deepEqual(f.p.cd,[0,0,0]);
  advance(f.w,s.startup-.001,hz);assert.equal(f.t.hp,10000);advance(f.w,s.active+s.recovery+.101,hz);
  const hits=hitEvents(f.w);assert.equal(hits.length,s.hits.length);assert.deepEqual(hits.map(e=>e.hitOrdinal),s.hits.map((_,i)=>i));assert.ok(Math.abs(f.t.hp-(10000-s.damage))<1e-8);assert.equal(f.p.focus,40);
  for(const [i,e]of hits.entries())assert.ok(Math.abs(e.time-s.hits[i].at)<1e-8);advance(f.w,1,hz);assert.equal(hitEvents(f.w).length,s.hits.length);
 }
});
test('enhancement requires a recent same-target hostile route and increases only the last strike',()=>{
 for(const path of ['fist','spear']){
  const f=fixture(path),s=ultimate(path);f.t.kind='wolf';f.p.focus=100;
  YF.command(f.w,f.p.id,{type:'attack',skillId:s.id,enhanced:true,comboComplete:true});assert.equal(f.p.action,null);
  attack(f,0);finish(f);attack(f,1);finish(f);attack(f,0);finish(f);f.p.focus=100;
  const energy=f.p.energy;YF.command(f.w,f.p.id,{type:'attack',skillId:s.id,enhanced:true});assert.equal(f.p.action.enhanced,true);assert.equal(f.p.focus,30);assert.equal(f.p.energy,energy-35);assert.equal(f.p.ultimateLink,null);
  finish(f);const hits=hitEvents(f.w).filter(e=>e.skillId===s.id);for(let i=0;i<hits.length;i++){const expected=s.damage*s.hits[i].scale*(i===hits.length-1?1.15:1);assert.ok(Math.abs(hits[i].damage-expected)<1e-8);}
 }
});
test('expired/wrong-target enhancement, insufficient Focus/energy and active cooldown fail without spending',()=>{
 for(const mode of ['expired','target','focus','energy','cooldown']){const f=fixture(),s=ultimate('fist');f.p.focus=100;f.p.ultimateLink={path:'fist',targetId:mode==='target'?'other':f.t.id,until:mode==='expired'?0:2};if(mode==='focus')f.p.focus=69;if(mode==='energy')f.p.energy=34;if(mode==='cooldown')f.p.extraCd[s.id]=1;const before=[f.p.focus,f.p.energy];YF.command(f.w,f.p.id,{type:'attack',skillId:s.id,enhanced:true});assert.equal(f.p.action,null);assert.deepEqual([f.p.focus,f.p.energy],before);}
});
test('expanding pulse and spear finish respect each hit geometry and behind/wall targets',()=>{
 const f=fixture();f.t.x=27.5;f.p.focus=100;const s=ultimate('fist');YF.command(f.w,f.p.id,{type:'attack',skillId:s.id});advance(f.w,.7);assert.equal(f.t.hp,10000);advance(f.w,.2);assert.ok(Math.abs(f.t.hp-(10000-54*.55))<1e-8);
 const q=fixture('spear');q.p.focus=100;const flank={...q.t,id:'flank',kind:'wolf',x:27,y:13.5},back={...q.t,id:'back',kind:'wolf',x:22};q.w.entities.push(flank,back);YF.command(q.w,q.p.id,{type:'attack',skillId:ultimate('spear').id});finish(q);assert.equal(hitEvents(q.w).filter(e=>e.targetId==='flank').length,1);assert.equal(back.hp,10000);
});
test('defeat/return and sparring completion cannot be hit again by later ordinals',()=>{
 for(const duel of [false,true]){
  const f=pair();Object.assign(f.p,{mapId:'sovann-temple-ward',x:20,y:20});Object.assign(f.q,{mapId:f.p.mapId,x:21,y:20,hp:10,gold:100});
  if(duel){YF.command(f.w,f.p.id,{type:'city-duel-request',target:f.q.id});YF.command(f.w,f.q.id,{type:'city-duel-accept'});}
  f.p.focus=100;YF.command(f.w,f.p.id,{type:'attack',skillId:ultimate('fist').id,pvp:!duel});finish(f);
  assert.equal(hitEvents(f.w).filter(e=>e.targetId===f.q.id).length,1);assert.equal(f.p.wanted,duel?0:3);assert.equal(f.q.gold,duel?100:90);
 }
});
test('Focus and enhancement reset on travel/path/defeat/load; interruption never refunds ultimate',()=>{
 for(const mode of ['travel','path','load','defeat']){
  const f=fixture();f.p.focus=80;f.p.ultimateLink={path:'fist',targetId:f.t.id,until:2};
  if(mode==='travel')YF.enterMap(f.w,f.p,'sovann-city',12,12);
  if(mode==='path'){Object.assign(f.p,{mapId:'sovann-city',x:12,y:12});YF.command(f.w,f.p.id,{type:'equip',path:'spear'});}
  if(mode==='load')Save.restore(f.p,{...Save.snapshot(f.p),focus:100,ultimateLink:{until:999}});
  if(mode==='defeat'){f.p.hp=1;f.t.kind='wolf';f.t.cd=0;advance(f.w,.5);}
  assert.equal(f.p.focus,0,mode);assert.equal(f.p.ultimateLink,null,mode);
 }
 const f=fixture(),s=ultimate('fist');f.p.focus=100;YF.command(f.w,f.p.id,{type:'attack',skillId:s.id});YF.enterMap(f.w,f.p,'sovann-city',12,12);advance(f.w,1);assert.equal(hitEvents(f.w).length,0);assert.ok(f.p.energy<100);assert.ok(f.p.extraCd[s.id]>28);
});
