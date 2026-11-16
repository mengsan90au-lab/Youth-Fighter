'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const Data=require('../public/combat-data.js');
const {host}=require('./host-fixture.js');
const {walk,travel,strike,firstLesson}=require('./host-gameplay.js');
async function learn(c,path){
 await firstLesson(c,path);
 c.send({type:'equip',path});c.send({type:'movement-style',style:'run'});
 await c.until(()=>c.player().path===path,'choose '+path);
 await travel(c,'sovann-temple-ward');await walk(c,20,16);
 c.send({type:'combat-study'});await c.until(()=>c.player().challenge?.path===path,'mentor challenge');
 await walk(c,23,17);c.send({type:'target',id:'temple-dummy'});
 await strike(c,{skill:0});await strike(c,{skill:1});await strike(c,{skill:0});
 assert.equal(c.player().challenge.route,true);
 assert.equal(c.player().focus,0,'training cannot award Focus');
 const hidden=Data.skills.find(s=>s.path===path&&s.category==='hidden');
 // The UI receives 10Hz snapshots, while a timed guard has a 120ms window.
 // Schedule intent from anticipation and allow the same retry available to players.
 for(let attempt=0;attempt<3&&!c.player().combatProgress.unlocks.includes(hidden.id);attempt++){
  await c.until(w=>!c.player().drill&&!c.player().action&&w.time>=c.player().drillReadyAt&&w.time>=c.player().defenseReadyAt,'practice ready');
  c.send({type:'combat-practice'});await c.until(()=>!!c.player().drill,'practice anticipation');
  const impact=c.player().drill.impactAt,delay=Math.max(0,(impact-c.state.time-.15)*1000);
  await new Promise(resolve=>setTimeout(resolve,delay));c.send({type:'guard'});
  await c.until(w=>w.time>=impact+.1,'practice result');
 }
 assert.ok(c.player().combatProgress.unlocks.includes(hidden.id),'earned hidden unlock');
 await c.until(()=>!c.player().action,'guard recovery');
 const hits=(await strike(c,{skillId:hidden.id})).filter(e=>e.result==='hit');
 assert.equal(hits.length,1);assert.equal(hits[0].damage,hidden.damage+(c.player().level-1)*3);
 assert.ok(c.player().extraCd[hidden.id]>7);
 assert.equal(c.player().counterUntil,0);assert.equal(c.player().focus,0);
 return hidden.id;
}

test('two real clients earn both hidden techniques, confirm sparring defense/counter, and retain unlocks through travel',{
 timeout:100000,skip:typeof WebSocket!=='function'?'Native test WebSocket requires Node 22+':false
},async t=>{
 const server=await host(t),a=await server.connect('Fist journey'),b=await server.connect('Spear journey');
 const [fistHidden,spearHidden]=await Promise.all([learn(a,'fist'),learn(b,'spear')]);
 t.diagnostic('Both fresh clients navigated city exits, completed mentor routes, timed practice guards and used earned hidden skills.');
 // Both observers must receive the same authoritative unlock state.
 await a.until(w=>w.players[b.id].combatProgress.unlocks.includes(spearHidden),'peer spear unlock');
 await b.until(w=>w.players[a.id].combatProgress.unlocks.includes(fistHidden),'peer fist unlock');
 await walk(a,22,17);await walk(b,23,17);
 a.send({type:'city-duel-request',target:b.id});await b.until(()=>b.player().city.duelOffer?.from===a.id,'spar invite');
 b.send({type:'city-duel-accept'});await a.until(()=>a.player().duel?.other===b.id,'spar acceptance');
 a.send({type:'target',id:b.id});b.send({type:'target',id:a.id});
 a.send({type:'guard'});
 const blocked=await strike(b,{skill:0});
 assert.equal(blocked.filter(e=>e.result==='blocked').length,1);
 assert.equal(a.player().wanted,0);assert.equal(b.player().focus,0);
 await b.until(()=>b.player().cd[0]===0,'thrust cooldown');
 await a.until(w=>!a.player().action&&w.time>=a.player().defenseReadyAt,'defense recovery');
 const before=b.state.seq;b.send({type:'attack',skill:0});
 await a.until(w=>w.players[b.id].action?.skillId==='spear.thrust','peer thrust anticipation');
 a.send({type:'dodge',x:-1,y:0});
 await a.until(()=>a.player().combo?.id==='fist.river-step-counter','verified dodge counter');
 await a.until(()=>!a.player().action,'dodge recovery');
 const elbow=await strike(a,{skill:1});assert.ok(elbow.some(e=>e.result==='combo-branch'&&e.comboId==='fist.river-step-counter'));
 const followup=await strike(a,{skill:0});assert.ok(followup.some(e=>e.result==='combo-complete'&&e.comboId==='fist.river-step-counter'));
 assert.ok([...b.events.values()].some(e=>e.id>before&&e.result==='dodged'&&e.actorId===a.id));
 for(const c of [a,b]){assert.equal(c.player().wanted,0);assert.equal(c.player().focus,0);}
 t.diagnostic('Both observers received guarded/dodged outcomes and the same-attacker River-Step Counter; sparring awarded no Focus or crime.');
 await Promise.all([travel(a,'sovann-market-ward'),travel(b,'sovann-market-ward')]);
 for(const [c,hidden]of [[a,fistHidden],[b,spearHidden]]){
  assert.deepEqual(c.player().combatProgress.unlocks,[hidden]);assert.equal(c.player().action,null);
  assert.equal(c.player().combo,null);assert.equal(c.player().counterUntil,0);assert.equal(c.player().focus,0);assert.equal(c.player().duel,null);
 }
 const oldId=a.id;a.ws.close();await b.until(w=>!w.players[oldId],'disconnect removal');
 const fresh=await server.connect('Fist journey');
 assert.notEqual(fresh.id,oldId);assert.deepEqual(fresh.player().combatProgress.unlocks,[]);assert.equal(fresh.player().focus,0);
 t.diagnostic('Travel preserved earned unlocks and cleared transient combat; disconnect removed the actor and reconnect created a fresh character. Loopback only.');
});
