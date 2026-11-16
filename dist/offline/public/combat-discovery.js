/* Original clue-led mentor challenge. Progression is persistent; drills and proof are transient. */
(function(r,f){if(typeof module==='object')module.exports=f(require('./combat-data.js'));else r.YFDiscovery=f(r.YFCombatData);})(typeof globalThis!=='undefined'?globalThis:this,Data=>{
 'use strict';const ids=Data.skills.filter(s=>s.category==='hidden').map(s=>s.id);
 function sanitize(raw){return {version:1,unlocks:raw?.version===1&&Array.isArray(raw.unlocks)?ids.filter(id=>raw.unlocks.includes(id)):[]};}
 function init(p){p.combatProgress=sanitize(null);p.challenge=null;p.drill=null;p.drillReadyAt=0;p.extraCd={};p.hiddenFollowupUntil=0;}
 function say(w,p,h,message,result='study'){h.emit(w,p,null,result,{text:message});}
 function command(w,p,a,h){if(!['combat-study','combat-practice'].includes(a.type))return false;
  if(p.hp<=0||p.jail>0||p.wanted>0||p.action||p.staggerUntil>w.time)return true;
  if(a.type==='combat-study'){
   if(!h.activeNpc(w,p,'temple-trainer'))return true;
   const id=ids.find(id=>Data.get(id).path===p.path);if(p.combatProgress.unlocks.includes(id)){say(w,p,h,Data.get(id).name+': use 4 after a timed dodge or early guard. Energy cost and 8s cooldown apply.');return true;}
   p.challenge={path:p.path,mapId:p.mapId,until:w.time+180,route:false};p.drill=null;
   say(w,p,h,'Dara: land 1 → 2 → 1 or 3 on the Temple dummy. Then use Practice pulse and guard just before the orange strike.');return true;
  }
  const c=p.challenge,t=h.target(w,'temple-dummy');
  if(!c||c.path!==p.path||c.mapId!==p.mapId||c.until<=w.time||!c.route||!t||t.hp<=0||t.mapId!==p.mapId||Math.hypot(t.x-p.x,t.y-p.y)>3||p.drill||w.time<(p.drillReadyAt||0))return true;
  p.drillReadyAt=w.time+2;p.drill={sourceId:t.id,mapId:p.mapId,path:p.path,impactAt:w.time+.6,endAt:w.time+.8,startAt:w.time,resolved:false};
  say(w,p,h,'Practice pulse: Q just before impact, or time Space to evade. This strike is nonlethal.');return true;
 }
 function route(w,p,t,result,h){const c=p.challenge;if(result==='complete'&&t.id==='temple-dummy'&&c&&c.path===p.path&&c.mapId===p.mapId&&c.until>w.time){c.route=true;say(w,p,h,'Dara: route confirmed. Stay near the dummy; choose Practice pulse, then time a defense.');}}
 function tick(w,p,h){const c=p.challenge;if(c&&(c.path!==p.path||c.mapId!==p.mapId||c.until<=w.time||p.wanted>0||p.jail>0)){p.challenge=null;p.drill=null;return;}
  const d=p.drill;if(!d)return;
  if(!c||d.path!==p.path||d.mapId!==p.mapId){p.drill=null;return;}
  if(!d.resolved&&w.time+1e-9>=d.impactAt){d.resolved=true;const source=h.target(w,d.sourceId);
   if(source&&source.hp>0&&source.mapId===p.mapId&&Math.hypot(source.x-p.x,source.y-p.y)<=3.5&&h.lineClear(source,p,h.blocked)){
    const result=h.defenseResult(w,p,source,4);p.hp=Math.max(1,p.hp-result.damage);
    if(result.timed){const id=ids.find(id=>Data.get(id).path===p.path);if(!p.combatProgress.unlocks.includes(id))p.combatProgress.unlocks.push(id);p.challenge=null;p.drill=null;say(w,p,h,'Discovered '+Data.get(id).name+'! Use 4 after a timed dodge or early guard; 8s cooldown.','discovered');return;}
    say(w,p,h,'Dara: timing missed. Guard later, or dodge just before impact. Practice pulse can be retried.');
   }
  }
  if(w.time+1e-9>=d.endAt)p.drill=null;
 }
 return {ids,sanitize,init,command,route,tick};
});
