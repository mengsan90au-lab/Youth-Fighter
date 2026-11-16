'use strict';
const Maps=require('../public/map-catalog.js');
async function walk(c,x,y){
 c.send({type:'goto',mapId:c.player().mapId,x,y});
 await c.until(()=>Math.hypot(c.player().x-x,c.player().y-y)<.12&&!c.player().aim,'walk to '+x+','+y,20000);
}
async function travel(c,mapId){
 for(const exit of Maps.travelRoute(c.player().mapId,mapId)){
  await c.until(()=>c.player().travelLock===0,'travel lock');
  c.send({type:'goto',mapId:exit.mapId,x:exit.x,y:exit.y});
  await c.until(()=>c.player().mapId===exit.toMap,'travel to '+exit.toMap,20000);
 }
 await c.until(()=>c.player().travelLock===0,'arrive');
}
async function strike(c,intent){
 const after=c.state.seq;
 c.send({type:'attack',...intent});
 await c.event(e=>e.id>after&&e.actorId===c.id&&e.result==='startup','attack startup');
 const start=[...c.events.values()].find(e=>e.id>after&&e.actorId===c.id&&e.result==='startup');
 await c.event(e=>e.actionId===start.actionId&&e.result==='complete','attack completion');
 return [...c.events.values()].filter(e=>e.actionId===start.actionId);
}
module.exports={walk,travel,strike};
