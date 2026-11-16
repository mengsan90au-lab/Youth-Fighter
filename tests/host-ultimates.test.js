'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const YF=require('../public/world.js'),Combat=require('../public/combat.js'),Data=require('../public/combat-data.js');
const {host}=require('./host-fixture.js'),{travel,strike}=require('./host-gameplay.js');

// Intent-only player driver. All observations come from broadcast snapshots.
async function earnFocus(c,needed){
 const deadline=c.state.time+75;
 while(c.player().focus<needed){
  const w=c.state,p=c.player();
  assert.equal(p.mapId,'bamboo-grove','fighter must survive in the grove');
  assert.ok(w.time<deadline,'Focus earning deadline');
  if(p.hp<75&&p.potions>0)c.send({type:'heal'});
  if(!p.action){
   const enemies=w.entities.filter(e=>e.kind==='wolf'&&e.hp>0).sort((a,b)=>YF.dist(a,p)-YF.dist(b,p));
   const target=enemies[0];assert.ok(target,'living prowler');
   c.send({type:'target',id:target.id});
   const basic=Data.forPath(p.path)[0];
   if(YF.dist(p,target)>basic.range-.15||!Combat.lineClear(p,target,YF.blocked))c.send({type:'goto',x:target.x,y:target.y});
   else{c.send({type:'move',x:0,y:0});if(p.cd[0]===0)c.send({type:'attack',skill:0});}
  }
  await c.until(next=>next.time>w.time,'next hunting snapshot');
 }
 c.send({type:'move',x:0,y:0});await c.until(()=>!c.player().action,'last basic recovery');
}
async function approach(c,id){
 const deadline=c.state.time+20;
 while(true){
  const w=c.state,p=c.player(),target=w.entities.find(e=>e.id===id);
  assert.ok(target?.hp>0,'living ultimate target');assert.ok(w.time<deadline,'approach deadline');
  if(p.hp<75&&p.potions>0)c.send({type:'heal'});
  if(YF.dist(p,target)<2&&Combat.lineClear(p,target,YF.blocked))break;
  c.send({type:'goto',x:target.x,y:target.y});await c.until(next=>next.time>w.time,'approach snapshot');
 }
 c.send({type:'move',x:0,y:0});c.send({type:'target',id});await c.until(()=>c.player().target===id,'ultimate target');
}

test('actual host accepts earned standard and enhanced ultimates for each path',{
 concurrency:true,timeout:100000,skip:typeof WebSocket!=='function'?'Native test WebSocket requires Node 22+':false
},async t=>{
 await Promise.all(['fist','spear'].flatMap(path=>[false,true].map(enhanced=>t.test(path+' '+(enhanced?'enhanced':'standard'),async t=>{
  const server=await host(t),c=await server.connect(path+' ultimate'),observer=await server.connect('Observer');
  c.send({type:'equip',path});c.send({type:'movement-style',style:'run'});await c.until(()=>c.player().path===path,'choose path');
  await travel(c,'bamboo-grove');await earnFocus(c,enhanced?70:60);
  const earned=c.player().focus;assert.ok(earned<=100);assert.ok(c.player().kills>0);
  await approach(c,'bandit');
  if(enhanced){
   await c.until(()=>c.player().cd[0]===0&&c.player().cd[1]===0,'route cooldowns');
   await strike(c,{skill:0});await strike(c,{skill:1});await strike(c,{skill:0});
   assert.equal(c.player().ultimateLink?.targetId,'bandit');
  }
  await c.until(()=>c.player().energy>=(enhanced?35:30),'ultimate energy');
  const skill=Data.skills.find(s=>s.path===path&&s.category==='ultimate'),focus=c.player().focus,level=c.player().level;
  const events=await strike(c,{skillId:skill.id,enhanced}),start=events.find(e=>e.result==='startup'),allHits=events.filter(e=>e.result==='hit'),hits=allHits.filter(e=>e.targetId==='bandit');
  assert.equal(c.player().focus,focus-(enhanced?70:60));assert.ok(c.player().extraCd[skill.id]>28);
  assert.equal(hits.length,skill.hits.length,'all scheduled hits against the living bandit');
  assert.deepEqual(hits.map(e=>e.hitOrdinal),skill.hits.map((_,i)=>i));
  for(const [i,hit]of hits.entries()){
   assert.equal(hit.targetId,'bandit');assert.ok(Math.abs(hit.time-start.time-skill.hits[i].at)<1e-8);
   // Collateral kills can level the actor between ordinals. Exact isolated
   // formulas are covered by combat-ultimates; bound legitimate gains here.
   const scale=skill.hits[i].scale*(enhanced&&i===hits.length-1?1.15:1);
   assert.ok(hit.damage>=(skill.damage+(level-1)*3)*scale-1e-8);
   assert.ok(hit.damage<=(skill.damage+(c.player().level-1)*3)*scale+1e-8);
  }
  assert.equal(new Set(allHits.map(e=>e.targetId+':'+e.hitOrdinal)).size,allHits.length);
  for(const targetId of new Set(allHits.map(e=>e.targetId)))assert.ok(allHits.filter(e=>e.targetId===targetId).length<=skill.maxHitsPerTarget);
  for(const hit of allHits){
   await observer.event(e=>e.eventId===hit.eventId,'peer ultimate impact');
   assert.deepEqual(observer.events.get(hit.id),hit,'both clients receive identical hit identity and result');
  }
  const again=c.state.seq;c.send({type:'attack',skillId:skill.id,enhanced,focus:100,cooldown:0});
  const time=c.state.time;await c.until(w=>w.time>=time+.2,'duplicate activation rejection');
  assert.equal(c.player().action,null);
  // Live collateral attackers can defeat the fighter after the completed
  // ultimate. That legitimately resets Focus; it is not a second activation.
  assert.ok(['bamboo-grove','sovann-city'].includes(c.player().mapId));
  assert.equal(c.player().focus,c.player().mapId==='sovann-city'?0:focus-(enhanced?70:60));
  assert.ok(![...c.events.values()].some(e=>e.id>again&&e.actorId===c.id&&e.skillId===skill.id&&e.result==='startup'));
  t.diagnostic('Earned '+earned+' Focus from live prowlers; '+hits.length+' scheduled '+(enhanced?'enhanced':'standard')+' hits agreed across both clients.');
 }))));
});
