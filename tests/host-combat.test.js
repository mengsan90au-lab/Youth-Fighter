'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{spawn}=require('node:child_process'),net=require('node:net'),path=require('node:path');
test('actual host ingress owns delayed hits, rejects forged/malformed intent and resets reconnect', {timeout:15000,skip:typeof WebSocket!=='function'?'Native test WebSocket requires Node 22+':false},async t=>{
 const probe=net.createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r));
 const child=spawn(process.execPath,['server.js'],{cwd:path.resolve(__dirname,'..'),env:{...process.env,PORT:String(port)},windowsHide:true,stdio:['ignore','pipe','pipe']});
 t.after(()=>child.kill());let stderr='';child.stderr.on('data',s=>stderr+=s);
 await new Promise((resolve,reject)=>{child.stdout.on('data',s=>{if(s.toString().includes('http://localhost:'))resolve();});child.on('exit',code=>reject(Error('Host exit '+code+' '+stderr)));});
 function client(){const ws=new WebSocket('ws://127.0.0.1:'+port),messages=[],waiting=[];ws.addEventListener('message',e=>{const m=JSON.parse(e.data);messages.push(m);for(const q of waiting.splice(0))q();});
  async function until(predicate){const end=Date.now()+6000;while(Date.now()<end){const m=messages.find(predicate);if(m)return m;await new Promise(r=>{const timer=setTimeout(r,100);waiting.push(()=>{clearTimeout(timer);r();});});}throw Error('Timed out waiting for host snapshot');}
  return {ws,messages,until,send:a=>ws.send(JSON.stringify(a))};}
 const c=client();t.after(()=>c.ws.close());await new Promise(r=>c.ws.addEventListener('open',r));
 c.send({type:'join',name:'Authority test',level:100,focus:100,city:{inventory:{'reed-spear':80}}});
 const welcome=await c.until(m=>m.type==='welcome'),id=welcome.id;
 assert.equal(welcome.state.players[id].level,1);assert.deepEqual(welcome.state.players[id].city.inventory,{});assert.equal(welcome.state.players[id].focus,0);assert.deepEqual(welcome.state.players[id].combatProgress.unlocks,[]);
 c.send({type:'target',id:'guard0'});c.send({type:'attack',skill:'bad',damage:999999});c.send({type:'move',x:'Infinity',y:0});c.send({type:'restore',version:4,level:100});c.ws.send('{');c.ws.send('[]');
 c.send({type:'attack',skillId:'fist.golden-basin-resonance',pvp:true,focus:100});c.send({type:'attack',skillId:'fist.basin-echo',unlocked:true,counterUntil:999,pvp:true});
 c.send({type:'attack',skillId:'fist.naga-awakening',pvp:true,learned:true});
 c.send({type:'attack',skillId:'fist.naga-fist',pvp:true,damage:99999,focus:100,time:9000});
 const startup=await c.until(m=>m.type==='state'&&m.state.players[id]?.action?.skillId==='fist.naga-fist');
 assert.equal(startup.state.entities.find(e=>e.id==='guard0').hp,250);assert.equal(startup.state.players[id].energy,100);
 const impact=await c.until(m=>m.type==='state'&&m.state.events.some(e=>e.result==='hit'&&e.actorId===id));
 assert.equal(impact.state.entities.find(e=>e.id==='guard0').hp,232);assert.equal(impact.state.players[id].wanted,1);
 assert.equal(impact.state.events.filter(e=>e.result==='hit'&&e.actorId===id).length,1);
 for(let i=0;i<120;i++)c.send({type:'attack',skillId:'does-not-exist',damage:99999});
 const r=client();t.after(()=>r.ws.close());await new Promise(resolve=>r.ws.addEventListener('open',resolve));r.send({type:'join',name:'Authority test',focus:100,action:{skillId:'fist.naga-awakening'}});
 const fresh=await r.until(m=>m.type==='welcome');assert.notEqual(fresh.id,id);assert.equal(fresh.state.players[fresh.id].energy,100);assert.equal(fresh.state.players[fresh.id].action,null);assert.equal(fresh.state.players[fresh.id].focus,0);
 for(const route of ['command-contract.js','combat-data.js','combat.js','world.js']){const res=await fetch('http://127.0.0.1:'+port+'/'+route);assert.equal(res.status,200);}
});
