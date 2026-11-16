'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),YF=require('../public/world.js'),Save=require('../public/progression.js'),Data=require('../public/combat-data.js');
const {fixture,advance,attack,finish}=require('./combat-fixture.js');
function school(path='fist'){
 const w=YF.createWorld(),p=YF.addPlayer(w,'student');require('../public/school-system.js').legacy(p);YF.enterMap(w,p,'sovann-temple-ward',20,16);p.path=path;advance(w,.81);
 YF.command(w,p.id,{type:'combat-study'});assert.ok(p.challenge);Object.assign(p,{x:23,y:17});const t=YF.target(w,'temple-dummy');YF.command(w,p.id,{type:'target',id:t.id});return {w,p,t};
}
function route(f,hz=60){attack(f,0);finish(f,hz);attack(f,1);finish(f,hz);attack(f,0);finish(f,hz);assert.equal(f.p.challenge.route,true);}
test('mentor clue, confirmed route and timed practice defense discover each path at 20/60Hz',()=>{
 for(const hz of [20,60])for(const path of ['fist','spear']){
  const f=school(path);route(f,hz);YF.command(f.w,f.p.id,{type:'combat-practice'});assert.ok(f.p.drill);
  advance(f.w,.5,hz);YF.command(f.w,f.p.id,{type:'guard'});advance(f.w,.1,hz);
  const hidden=Data.skills.find(s=>s.path===path&&s.category==='hidden');assert.deepEqual(f.p.combatProgress.unlocks,[hidden.id]);assert.equal(f.p.challenge,null);assert.equal(f.p.drill,null);
  const loaded=YF.addPlayer(f.w,'loaded');assert.equal(Save.restore(loaded,Save.snapshot(f.p)),true);assert.deepEqual(loaded.combatProgress.unlocks,[hidden.id]);assert.equal(loaded.counterUntil,0);
 }
});
test('missed, late or wrong-path practice cannot silently grant an unlock',()=>{
 for(const mode of ['miss','late','path','travel']){
  const f=school();route(f);YF.command(f.w,f.p.id,{type:'combat-practice'});
  if(mode==='late')YF.command(f.w,f.p.id,{type:'guard'});
  if(mode==='path')f.p.path='spear';if(mode==='travel')YF.enterMap(f.w,f.p,'sovann-city',12,12);
  advance(f.w,.9);assert.deepEqual(f.p.combatProgress.unlocks,[],mode);
 }
});
test('remote, dead, wanted or unproved mentor/drill requests are rejected',()=>{
 const f=fixture();YF.command(f.w,f.p.id,{type:'combat-study',unlocks:['fist.basin-echo']});assert.equal(f.p.challenge,null);
 const q=school();YF.command(q.w,q.p.id,{type:'combat-practice',route:true});assert.equal(q.p.drill,null);
 q.p.challenge=null;q.p.x=20;q.p.y=16;q.p.wanted=1;YF.command(q.w,q.p.id,{type:'combat-study'});assert.equal(q.p.challenge,null);
 q.p.wanted=0;YF.target(q.w,'temple-trainer').hp=0;YF.command(q.w,q.p.id,{type:'combat-study'});assert.equal(q.p.challenge,null);
});
test('hidden activation enforces unlock/path/counter, consumes opportunity and starts its own cooldown',()=>{
 for(const path of ['fist','spear']){
  const f=fixture(path),s=Data.skills.find(s=>s.path===path&&s.category==='hidden'),intent={type:'attack',skillId:s.id,unlocked:true,counterUntil:999};
  YF.command(f.w,f.p.id,intent);assert.equal(f.p.action,null);
  f.p.combatProgress.unlocks.push(s.id);YF.command(f.w,f.p.id,intent);assert.equal(f.p.action,null);
  f.p.counterUntil=f.w.time+.9;YF.command(f.w,f.p.id,intent);assert.equal(f.p.action.skillId,s.id);assert.equal(f.p.counterUntil,0);assert.equal(f.p.extraCd[s.id],8);assert.equal(f.p.energy,100-s.cost);
  finish(f);assert.equal(f.t.hp,10000-s.damage);if(path==='fist')assert.ok(f.p.hiddenFollowupUntil>f.w.time);
  f.p.counterUntil=f.w.time+.9;YF.command(f.w,f.p.id,intent);assert.equal(f.p.action,null);
 }
});
test('save v6 keeps only known unlock IDs/cooldowns and clears all transient proofs',()=>{
 const f=fixture();f.p.combatProgress.unlocks=['fist.basin-echo','invented'];f.p.extraCd={'fist.basin-echo':7,invented:900};f.p.challenge={route:true};f.p.counterUntil=999;f.p.pendingAttack={};
 const save=Save.snapshot(f.p);assert.equal(save.version,6);assert.deepEqual(save.combatProgress.unlocks,['fist.basin-echo']);
 Save.restore(f.p,save);assert.deepEqual(f.p.combatProgress.unlocks,['fist.basin-echo']);assert.equal(f.p.extraCd['fist.basin-echo'],7);assert.equal(f.p.extraCd.invented,undefined);assert.equal(f.p.pendingAttack,null);assert.equal(f.p.challenge,null);assert.equal(f.p.counterUntil,0);
 for(const version of [2,3,4]){Save.restore(f.p,{...save,version});assert.deepEqual(f.p.combatProgress.unlocks,[]);}
});
