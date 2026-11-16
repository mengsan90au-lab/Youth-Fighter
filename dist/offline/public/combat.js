/* Shared simulation actions. Rendering and client timers never resolve hits. */
(function(r,f){if(typeof module==='object')module.exports=f(require('./combat-data.js'));else r.YFCombat=f(r.YFCombatData);})(typeof globalThis!=='undefined'?globalThis:this,Data=>{
 'use strict';const EPS=1e-9;
 function init(p){p.combatVersion=1;p.action=null;p.combatState='ready';}
 function emit(w,p,a,result,extra={}){
  const e={id:++w.seq,version:1,kind:'combat',text:'',actionId:a?.id||null,skillId:a?.skillId||null,actorId:p.id,targetId:a?.targetId||null,mapId:p.mapId,time:w.time,tick:w.tick||0,result,x:p.x,y:p.y,...extra};
  e.eventId='combat:'+e.id;w.events.push(e);if(w.events.length>128)w.events.shift();return e;
 }
 function clear(w,p,reason='interrupted'){if(p.action)emit(w,p,p.action,'interrupted',{reason});p.action=null;p.combatState=p.hp>0?'ready':'defeated';}
 function state(a,time){if(time+EPS<a.startAt+a.startup)return 'startup';if(time+EPS<a.startAt+a.startup+a.active)return 'active';return 'recovery';}
 function equipmentValid(p){const id=p.city?.equipment?.weapon;return !id||(p.path==='fist'?id==='wraps':id==='reed-spear');}
 function permitted(w,p,t,pvp,duel){return !!(t&&t.id!==p.id&&t.hp>0&&t.mapId===p.mapId&&!(t.jail>0)&&
  (!['civilian','guard','player'].includes(t.kind)||t.kind==='player'&&!w.insideCity(t)||pvp||t.wanted>0||duel(p,t,w.time)));}
 function lineClear(p,t,blocked){const d=Math.hypot(t.x-p.x,t.y-p.y),n=Math.max(1,Math.ceil(d/.08));for(let i=0;i<=n;i++)if(blocked(p.x+(t.x-p.x)*i/n,p.y+(t.y-p.y)*i/n,p.mapId))return false;return true;}
 function inShape(p,t,s,a,blocked){const d=Math.hypot(t.x-p.x,t.y-p.y);if(d>s.range+EPS||!lineClear(p,t,blocked))return false;
  if(s.geometry.shape==='cone'&&d>EPS){const dot=((t.x-p.x)*Math.cos(a.facing)+(t.y-p.y)*Math.sin(a.facing))/d;if(dot<Math.cos(s.geometry.halfAngle))return false;}return true;}
 function start(w,p,intent,hooks){const s=Data.resolve(p.path,intent),t=hooks.target(w,p.target);
  if(!s||p.action||p.hp<=0||p.jail>0||p.travelLock>0||!equipmentValid(p)||p.cd[s.index]>EPS||p.energy<s.cost)return false;
  if(!hooks.eligible(w,p,t,!!intent.pvp)||!inShape(p,t,s,{facing:Math.atan2(t.y-p.y,t.x-p.x)},hooks.blocked))return false;
  const a={id:p.id+':'+(++w.actionSeq),skillId:s.id,targetId:t.id,path:p.path,mapId:p.mapId,weapon:p.city?.equipment?.weapon||null,
   startAt:w.time,startup:s.startup,active:s.active,endAt:w.time+s.startup+s.active+s.recovery,nextHit:0,victims:[],pvp:!!intent.pvp,facing:Math.atan2(t.y-p.y,t.x-p.x)};
  p.energy-=s.cost;p.cd[s.index]=s.cool;p.facing=a.facing;p.lastStrike=w.time;p.strike=s.presentation.pose;p.action=a;p.combatState='startup';p.combatUntil=w.time+5;
  if(t.kind==='player')t.combatUntil=w.time+5;emit(w,p,a,'startup');return true;
 }
 function update(w,p,hooks){const a=p.action;if(!a)return;
  if(p.hp<=0||p.jail>0||p.mapId!==a.mapId||p.path!==a.path||!equipmentValid(p)||(p.city?.equipment?.weapon||null)!==a.weapon){clear(w,p,'invalid-owner');return;}
  const s=Data.get(a.skillId);
  while(p.action===a&&a.nextHit<s.hits.length&&w.time+EPS>=a.startAt+s.hits[a.nextHit].at){
   const ordinal=a.nextHit++,hit=s.hits[ordinal],primary=hooks.target(w,a.targetId);
   // Invalid primary invalidates this scheduled strike; the intended target is never silently replaced.
   const victims=hooks.eligible(w,p,primary,a.pvp)&&inShape(p,primary,s,a,hooks.blocked)?
    (s.geometry.shape==='selected-circle'?[primary]:hooks.entities(w,p.mapId).filter(t=>t.id===primary.id||['wolf','bandit'].includes(t.kind))):[];
   let count=0;for(const t of victims){if(count>=s.geometry.targetCap)break;const key=ordinal+':'+t.id;
    if(a.victims.includes(key)||!hooks.eligible(w,p,t,a.pvp)||!inShape(p,t,s,a,hooks.blocked))continue;
    a.victims.push(key);count++;hooks.hit(w,p,t,s,a,ordinal,hit.scale);
   }
   if(!count)emit(w,p,a,'miss',{hitOrdinal:ordinal});
  }
  if(p.action!==a)return;
  if(w.time+EPS>=a.endAt){emit(w,p,a,'complete');p.action=null;p.combatState='ready';return;}
  const phase=state(a,w.time);if(p.combatState!==phase){p.combatState=phase;emit(w,p,a,phase);}
 }
 function boundary(w){let next=Infinity;for(const p of Object.values(w.players)){const a=p.action;if(!a)continue;const s=Data.get(a.skillId);for(const at of [a.startAt+a.startup,a.startAt+a.startup+a.active,a.endAt,...s.hits.slice(a.nextHit).map(h=>a.startAt+h.at)])if(at>w.time+EPS)next=Math.min(next,at);}return next;}
 return {EPS,init,emit,clear,state,equipmentValid,permitted,lineClear,inShape,start,update,boundary};
});
