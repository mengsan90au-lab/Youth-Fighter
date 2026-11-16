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
async function firstLesson(c,path){
 c.send({type:'equip',path});c.send({type:'movement-style',style:'run'});
 await c.until(()=>c.player().schoolProgress.active===path,'enroll school');
 await travel(c,'sovann-temple-ward');await walk(c,21.5,17);
 c.send({type:'target',id:'temple-dummy'});c.send({type:'school-quest-accept',quest:'discipline'});
 await c.until(()=>c.player().schoolProgress.records[path].quest?.id==='discipline','discipline quest');
 for(let i=0;i<3;i++){await c.until(()=>c.player().cd[0]===0,'practice cooldown');await strike(c,{skill:0});}
 c.send({type:'school-quest-claim'});await c.until(()=>c.player().schoolProgress.records[path].completed.includes('discipline'),'quest reward');
 const heavy=require('../public/combat-data.js').forPath(path)[1];c.send({type:'school-learn',skillId:heavy.id});
 await c.until(()=>c.player().schoolProgress.records[path].learned.includes(heavy.id),'earned second skill');
}
module.exports={walk,travel,strike,firstLesson};
