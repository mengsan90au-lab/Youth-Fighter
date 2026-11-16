'use strict';
// Real host and native clients. No world mutation, debug endpoint, or injected saves.
const {spawn}=require('node:child_process');
const net=require('node:net');
const path=require('node:path');

async function host(t){
 const probe=net.createServer();
 await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));
 const port=probe.address().port;
 await new Promise(resolve=>probe.close(resolve));
 const child=spawn(process.execPath,['server.js'],{
  cwd:path.resolve(__dirname,'..'),env:{...process.env,PORT:String(port)},
  windowsHide:true,stdio:['ignore','pipe','pipe']
 });
 t.after(()=>child.kill());
 let stderr='';child.stderr.on('data',data=>stderr+=data);
 await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(Error('Host startup timeout: '+stderr)),5000);
  child.stdout.on('data',data=>{if(data.toString().includes('http://localhost:')){clearTimeout(timer);resolve();}});
  child.once('error',error=>{clearTimeout(timer);reject(error);});
  child.once('exit',code=>{clearTimeout(timer);reject(Error('Host exit '+code+': '+stderr));});
 });
 async function connect(name){
  const ws=new WebSocket('ws://127.0.0.1:'+port),waiters=new Set(),events=new Map();
  const c={ws,id:null,state:null,events,send:intent=>ws.send(JSON.stringify(intent))};
  ws.addEventListener('message',message=>{
   const data=JSON.parse(message.data);
   if(data.type==='welcome')c.id=data.id;
   if(data.state){c.state=data.state;for(const e of data.state.events)events.set(e.id,e);}
   for(const wake of [...waiters])wake();
  });
  t.after(()=>ws.close());
  c.until=(predicate,label,timeout=6000)=>new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>{waiters.delete(check);reject(Error('Timed out: '+label+'; player='+JSON.stringify(c.player())));},timeout);
   function check(){try{if(c.state&&predicate(c.state)){clearTimeout(timer);waiters.delete(check);resolve(c.state);}}catch(error){clearTimeout(timer);waiters.delete(check);reject(error);}}
   waiters.add(check);check();
  });
  c.player=()=>c.state?.players[c.id];
  c.event=(predicate,label)=>c.until(()=>[...events.values()].some(predicate),label);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  c.send({type:'join',name});await c.until(()=>c.id,'join');return c;
 }
 return {connect,port};
}
module.exports={host};
