'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const YF=require('../public/world.js'),Schools=require('../public/school-system.js'),Data=require('../public/combat-data.js'),XP=require('../public/experience.js'),Save=require('../public/progression.js');
const {advance}=require('./combat-fixture.js');
function student(path='fist'){const w=YF.createWorld(),p=YF.addPlayer(w,'student');YF.command(w,p.id,{type:'equip',path});YF.enterMap(w,p,'sovann-temple-ward',21.5,17);advance(w,.81);YF.command(w,p.id,{type:'target',id:'temple-dummy'});return {w,p};}
function cmd(f,a){YF.command(f.w,f.p.id,a);}
function hit(f,skill=0){if(f.p.cd[skill]>0)advance(f.w,f.p.cd[skill]+.01);cmd(f,{type:'attack',skill});assert.ok(f.p.action,'eligible trained action');advance(f.w,f.p.action.endAt-f.w.time+.01);}
function discipline(f){cmd(f,{type:'school-quest-accept',quest:'discipline'});for(let i=0;i<3;i++)hit(f);assert.equal(Schools.ready(f.p),true);cmd(f,{type:'school-quest-claim'});cmd(f,{type:'school-learn',skillId:Data.forPath(f.p.path)[1].id});}
function kills(f,n){YF.enterMap(f.w,f.p,'bamboo-grove',24,12);advance(f.w,.81);f.w.entities=f.w.entities.filter(e=>!['wolf','bandit'].includes(e.kind));for(let i=0;i<n;i++){const t={id:'wolf'+i,kind:'wolf',mapId:f.p.mapId,x:25,y:12,homeX:25,homeY:12,hp:1,maxHp:1,cd:99};f.w.entities.push(t);cmd(f,{type:'target',id:t.id});hit(f);}}
function returnMentor(f){YF.enterMap(f.w,f.p,'sovann-temple-ward',21.5,17);advance(f.w,.81);}

test('five schools have distinct validated kits; fresh characters cannot forge learned skills',()=>{
 assert.equal(Schools.data.schools.length,5);assert.equal(Data.validate().valid,true);
 for(const s of Schools.data.schools){const f=student(s.id),kit=Data.forPath(s.id);assert.equal(kit.length,3);assert.equal(f.p.schoolProgress.active,s.id);assert.deepEqual(Schools.record(f.p).learned,[kit[0].id]);
  cmd(f,{type:'attack',skill:1,learned:true,reputation:99999,level:999});assert.equal(f.p.action,null);assert.equal(f.p.energy,100);
  cmd(f,{type:'school-learn',skillId:kit[1].id,reputation:99999,level:999});assert.equal(Schools.canUse(f.p,kit[1]),false);
 }
});
test('all five schools earn lessons through real quest outcomes, XP and reputation; rewards cannot replay',()=>{
 for(const school of Schools.data.schools){const f=student(school.id),kit=Data.forPath(school.id);discipline(f);assert.equal(f.p.level,3);assert.equal(Schools.record(f.p).reputation,10);assert.ok(Schools.canUse(f.p,kit[1]));
  const xp=f.p.xp;cmd(f,{type:'school-quest-claim'});assert.equal(f.p.xp,xp);assert.equal(Schools.record(f.p).reputation,10);
  cmd(f,{type:'school-learn',skillId:kit[2].id});assert.equal(Schools.canUse(f.p,kit[2]),false);
  cmd(f,{type:'school-quest-accept',quest:'fieldwork'});kills(f,3);assert.equal(Schools.ready(f.p),true);returnMentor(f);cmd(f,{type:'school-quest-claim'});
  assert.equal(f.p.level,5);assert.equal(Schools.record(f.p).reputation,25);cmd(f,{type:'school-learn',skillId:kit[2].id});assert.ok(Schools.canUse(f.p,kit[2]));
 }
});
test('learning requires each prerequisite and a living nearby mentor, and rejects wrong-school lessons',()=>{
 for(const mode of ['level','rep','quest','far','wanted','dead-mentor','wrong-path']){const f=student();discipline(f);const r=Schools.record(f.p),s=Data.forPath('fist')[1];r.learned=[Data.forPath('fist')[0].id];
  if(mode==='level')f.p.level=2;if(mode==='rep')r.reputation=9;if(mode==='quest')r.completed=[];if(mode==='far')f.p.x=40;if(mode==='wanted')f.p.wanted=1;if(mode==='dead-mentor')YF.target(f.w,'temple-trainer').hp=0;
  cmd(f,{type:'school-learn',skillId:mode==='wrong-path'?'spear.serpent-sweep':s.id});assert.equal(r.learned.length,1,mode);
 }
});
test('level ceilings require advancement trials and every XP route stops at maximum 999',()=>{
 const f=student();discipline(f);const r=Schools.record(f.p);r.completed.push('fieldwork');r.reputation=25;
 for(let rank=0;rank<4;rank++){f.p.level=Schools.data.caps[rank];f.p.xp=0;XP.award(f.p,1e8);assert.equal(f.p.level,Schools.data.caps[rank]);
  cmd(f,{type:'school-quest-accept',quest:'advancement'});cmd(f,{type:'school-quest-claim',rank:4,level:999});assert.equal(r.rank,rank);
  // Outcome integration is checked separately below; the level boundary test
  // supplies completed server-owned counters at each tier, not client fields.
  r.quest.count=8+rank*4;r.quest.combo=true;cmd(f,{type:'school-quest-claim'});assert.equal(r.rank,rank+1);assert.equal(XP.cap(f.p),Schools.data.caps[rank+1]);
 }
 f.p.level=998;f.p.xp=99800;XP.award(f.p,100000);assert.equal(f.p.level,999);assert.equal(f.p.xp,0);XP.award(f.p,1e12);assert.equal(f.p.level,999);assert.equal(f.p.xp,0);
 f.p.city.quests['temple-training']={status:'ready',count:3};cmd(f,{type:'city-quest-claim',npc:'temple-trainer',quest:'temple-training'});assert.equal(f.p.level,999);assert.equal(f.p.xp,0);
});
test('advancement counts real defeats and a confirmed dummy route, never client combo claims',()=>{
 const f=student();discipline(f);const r=Schools.record(f.p);r.completed.push('fieldwork');f.p.level=10;cmd(f,{type:'school-quest-accept',quest:'advancement'});
 cmd(f,{type:'school-quest-claim',combo:true,count:20});assert.equal(r.quest.count,0);hit(f,0);hit(f,1);hit(f,0);assert.equal(r.quest.combo,true);
 kills(f,8);assert.equal(r.quest.count,8);returnMentor(f);cmd(f,{type:'school-quest-claim'});assert.equal(r.rank,1);assert.equal(XP.cap(f.p),50);
});
test('school switches preserve independent lessons/reputation, quests and character level without giving new skills',()=>{
 const f=student();discipline(f);advance(f.w,4);const saved=JSON.stringify(Schools.record(f.p));cmd(f,{type:'equip',path:'darts'});assert.equal(f.p.path,'darts');assert.equal(f.p.level,3);assert.equal(Schools.record(f.p).reputation,0);assert.equal(Schools.canUse(f.p,Data.forPath('darts')[1]),false);
 cmd(f,{type:'equip',path:'fist'});assert.equal(JSON.stringify(Schools.record(f.p)),saved);
});
test('v6 persists school progression and level 999; v2-v5 keep all six legacy attacks and hidden unlocks',()=>{
 for(const version of [2,3,4,5]){const f=student();const old={...Save.snapshot(f.p),version,level:80,path:'spear',combatProgress:{version:1,unlocks:['spear.tide-reversal']}};assert.equal(Save.restore(f.p,old),true);assert.equal(f.p.level,80);for(const path of ['fist','spear'])for(const skill of Data.forPath(path))assert.ok(Schools.canUse(f.p,skill));assert.deepEqual(f.p.combatProgress.unlocks,version===5?['spear.tide-reversal']:[]);}
 const f=student('staff');discipline(f);Schools.record(f.p).rank=4;f.p.level=999;f.p.xp=0;const saved=Save.snapshot(f.p);assert.equal(saved.version,6);saved.schoolProgress.records.staff.learned.push('invented');saved.schoolProgress.records.staff.quest={id:'advancement',count:Infinity};saved.focus=100;saved.action={};assert.equal(Save.restore(f.p,saved),true);assert.equal(f.p.path,'staff');assert.equal(f.p.level,999);assert.equal(Schools.record(f.p).quest,null);assert.equal(Schools.record(f.p).learned.includes('invented'),false);assert.equal(f.p.focus,0);assert.equal(f.p.action,null);
});
test('new school skills obey timing/geometry and complete both combo branches at 20 and 60 Hz',()=>{
 for(const hz of [20,60])for(const path of ['staff','blade','darts'])for(const branch of [0,2]){
  const f=student(path);Schools.record(f.p).learned=Data.forPath(path).map(s=>s.id);YF.command(f.w,f.p.id,{type:'target',id:'temple-dummy'});
  for(const index of [0,1,branch]){if(f.p.cd[index]>0)advance(f.w,f.p.cd[index]+.001,hz);cmd(f,{type:'attack',skill:index});assert.ok(f.p.action);advance(f.w,f.p.action.endAt-f.w.time+.001,hz);}
  assert.ok(f.w.events.some(e=>e.result==='combo-complete'),'route '+path+' '+branch+' '+hz);
  if(path==='darts')assert.equal(f.w.events.filter(e=>e.skillId==='darts.double-petal'&&e.result==='hit').length,2);
 }
});
