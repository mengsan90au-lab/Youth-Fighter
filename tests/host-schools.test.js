'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),Data=require('../public/combat-data.js');
const {host}=require('./host-fixture.js'),{firstLesson,strike}=require('./host-gameplay.js');
test('three new schools earn lessons over the actual host and reject forged level/reputation/learning',{
 timeout:60000,skip:typeof WebSocket!=='function'?'Native test WebSocket requires Node 22+':false
},async t=>{
 const server=await host(t);
 await Promise.all(['staff','blade','darts'].map(async path=>{
  const c=await server.connect(path+' pupil'),kit=Data.forPath(path);await firstLesson(c,path);
  const p=c.player(),rec=p.schoolProgress.records[path];assert.equal(p.level,3);assert.equal(rec.reputation,10);assert.deepEqual(rec.completed,['discipline']);assert.ok(rec.learned.includes(kit[1].id));
  c.send({type:'school-learn',skillId:kit[2].id,level:999,reputation:99999,completed:['fieldwork']});
  c.send({type:'school-quest-claim',levelCap:999,rank:4});c.send({type:'attack',skill:2,learned:true});
  const at=c.state.time;await c.until(w=>w.time>at+.2,'rejected forged progression');
  assert.equal(c.player().level,3);assert.equal(c.player().schoolProgress.records[path].reputation,10);assert.equal(c.player().action,null);
  const events=await strike(c,{skill:1});assert.equal(events.filter(e=>e.result==='hit').length,kit[1].hits.length);assert.equal(c.player().focus,0);
  for(const route of ['school-data.js','school-system.js','experience.js','keybindings.js','school-ui.js','school.css'])assert.equal((await fetch('http://127.0.0.1:'+server.port+'/'+route)).status,200);
 }));
});
