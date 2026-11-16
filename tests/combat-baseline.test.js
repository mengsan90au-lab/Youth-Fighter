'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const YF=require('../public/world.js'),Save=require('../public/progression.js');
function fixture(path='fist') {
 const w=YF.createWorld();w.entities=[];const p=YF.addPlayer(w,'hero');require('../public/school-system.js').legacy(p); // Existing trained-character regression fixture.

 Object.assign(p,{mapId:'bamboo-grove',x:24,y:12,path});
 const t={id:'practice',kind:'training',mapId:p.mapId,x:25,y:12,hp:10000,maxHp:10000};
 w.entities.push(t);YF.command(w,p.id,{type:'target',id:t.id});return {w,p,t};
}
function advance(w,seconds,hz=60){for(let t=0;t<seconds-1e-9;t+=1/hz)YF.step(w,Math.min(1/hz,seconds-t));}
test('real commands preserve both paths and ordinary third-skill costs/rewards',()=>{
 for(const path of ['fist','spear'])for(let i=0;i<3;i++){
  const {w,p,t}=fixture(path),s=YF.skillsFor(p)[i];
  YF.command(w,p.id,{type:'attack',skill:i});
  assert.equal(p.energy,100-s.cost);assert.equal(p.cd[i],s.cool);
  advance(w,.8);assert.equal(t.hp,t.maxHp-s.damage);assert.equal(p.kills,0);
 }
});
test('real command rejects range/map/dead targets without spending',()=>{
 for(const change of [{x:40},{mapId:'sovann-city'},{hp:0}]){
  const {w,p,t}=fixture();Object.assign(t,change);
  YF.command(w,p.id,{type:'attack',skill:1});advance(w,.8);
  assert.equal(p.energy,100);assert.equal(p.cd[1],0);
 }
});
test('actual snapshot/restore preserves v2/v3/v4 progress and sanitizes unsafe positions',()=>{
 for(const version of [2,3,4]){
  const {w,p}=fixture('spear');Object.assign(p,{gold:73,kills:4,quest:true,xp:21});
  Object.assign(p.city,{inventory:{'reed-spear':1,vest:1},equipment:{weapon:'reed-spear',armour:'vest'},durability:75});
  const data={...Save.snapshot(p),version};const q=YF.addPlayer(w,'restored');
  assert.equal(Save.restore(q,data),true);assert.equal(q.gold,73);assert.equal(q.kills,4);assert.equal(q.xp,21);assert.equal(q.path,'spear');
  assert.equal(q.city.equipment.weapon,'reed-spear');assert.equal(q.city.durability,75);
  assert.equal(q.mapId,version===2?'sovann-city':'bamboo-grove');
  Save.restore(q,{...data,x:9999,y:9999});assert.equal(YF.blocked(q.x,q.y,q.mapId),false);
 }
});
module.exports={fixture,advance};
