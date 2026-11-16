/* Shared simulation actions. Rendering and client timers never resolve hits. */
(function(r,f){if(typeof module==='object')module.exports=f(require('./combat-data.js'),require('./combat-combos.js'),require('./combat-focus.js'));else r.YFCombat=f(r.YFCombatData,r.YFCombos,r.YFFocus);})(typeof globalThis!=='undefined'?globalThis:this,(Data,Combos,Focus)=>{
 'use strict';const EPS=1e-9;const Schools=typeof module==='object'?require('./school-system.js'):globalThis.YFSchools;
 function init(p){p.combatVersion=1;p.action=null;p.combatState='ready';p.combo=null;p.comboLockUntil=0;p.pendingAttack=null;p.defenseReadyAt=0;p.staggerUntil=0;p.staggerResistUntil=0;p.counterUntil=0;Focus.reset(p);}
 function emit(w,p,a,result,extra={}){
  const e={id:++w.seq,version:1,kind:'combat',text:'',actionId:a?.id||null,skillId:a?.skillId||null,actorId:p.id,targetId:a?.targetId||null,mapId:p.mapId,time:w.time,tick:w.tick||0,result,x:p.x,y:p.y,...extra};
  e.eventId='combat:'+e.id;w.events.push(e);if(w.events.length>128)w.events.shift();return e;
 }
 function clear(w,p,reason='interrupted'){if(p.action)emit(w,p,p.action,'interrupted',{reason});p.action=null;p.pendingAttack=null;p.ultimateLink=null;Combos.clear(p);p.counterUntil=0;if(['travel','arrest','defeat','path-change','invalid-owner'].includes(reason)){p.challenge=null;p.drill=null;p.hiddenFollowupUntil=0;p.comboLockUntil=0;p.staggerUntil=0;p.staggerResistUntil=0;Focus.reset(p);}p.combatState=p.hp>0?'ready':'defeated';}
 function state(a,time){if(time+EPS<a.startAt+a.startup)return 'startup';if(time+EPS<a.startAt+a.startup+a.active)return 'active';return 'recovery';}
 function equipmentValid(p){const id=p.city?.equipment?.weapon;return !id||id===Schools.data.get(p.path)?.equipment;}
 function lineClear(p,t,blocked){const d=Math.hypot(t.x-p.x,t.y-p.y),n=Math.max(1,Math.ceil(d/.08));for(let i=0;i<=n;i++)if(blocked(p.x+(t.x-p.x)*i/n,p.y+(t.y-p.y)*i/n,p.mapId))return false;return true;}
 function inShape(p,t,s,a,blocked){const d=Math.hypot(t.x-p.x,t.y-p.y);if(d>s.range+EPS||!lineClear(p,t,blocked))return false;
  if(s.geometry.shape==='cone'&&d>EPS){const dot=((t.x-p.x)*Math.cos(a.facing)+(t.y-p.y)*Math.sin(a.facing))/d;if(dot<Math.cos(s.geometry.halfAngle))return false;}return true;}
 function start(w,p,intent,hooks){const s=Data.resolve(p.path,intent),t=hooks.target(w,p.target);
  if(!s||!Schools.canUse(p,s)||p.hp<=0||p.jail>0||p.travelLock>0||!equipmentValid(p)||p.staggerUntil>w.time+EPS)return false;
  if(s.unlock.kind==='discovery'&&!p.combatProgress?.unlocks.includes(s.id)||s.counterRequired&&!(p.counterUntil>w.time))return false;
  const enhanced=s.category==='ultimate'&&intent.enhanced===true,linkEligible=p.ultimateLink&&p.ultimateLink.path===p.path&&p.ultimateLink.targetId===p.target&&p.ultimateLink.until>w.time;
  if(enhanced&&!linkEligible)return false;const energyCost=enhanced?s.enhancement.energyCost:s.cost,focusCost=enhanced?s.enhancement.focusCost:s.focusCost||0;
  if((p.focus||0)<focusCost)return false;
  if(p.action){if(p.action.kind!=='defense'&&!p.pendingAttack&&p.action.endAt-w.time<=Combos.bufferSeconds+EPS){p.pendingAttack={intent:{type:'attack',skillId:s.id,pvp:!!intent.pvp,enhanced:!!intent.enhanced},targetId:p.target,until:w.time+Combos.bufferSeconds};emit(w,p,p.action,'buffered');}return false;}
  if(((s.index===null?p.extraCd?.[s.id]:p.cd[s.index])||0)>EPS||p.energy<energyCost)return false;
  if(!hooks.eligible(w,p,t,!!intent.pvp)||!inShape(p,t,s,{facing:Math.atan2(t.y-p.y,t.x-p.x)},hooks.blocked))return false;
  const link=Combos.prepare(p,s,t.id,w.time),quick=s.index===0&&(link?.stage===2||p.hiddenFollowupUntil>w.time),startup=quick?s.startup*.65:s.startup;
  const a={id:p.id+':'+(++w.actionSeq),skillId:s.id,targetId:t.id,path:p.path,mapId:p.mapId,weapon:p.city?.equipment?.weapon||null,comboLink:link,enhanced,finishedTargets:[],hitCounts:[],
   startAt:w.time,startup,active:s.active,endAt:w.time+startup+s.active+s.recovery,nextHit:0,victims:[],pvp:!!intent.pvp,facing:Math.atan2(t.y-p.y,t.x-p.x)};
  p.energy-=energyCost;p.focus=Math.max(0,(p.focus||0)-focusCost);if(s.category==='ultimate')p.ultimateLink=null;if(s.index===null){p.extraCd||={};p.extraCd[s.id]=s.cool;}else p.cd[s.index]=s.cool;if(s.counterRequired)p.counterUntil=0;if(s.index===0)p.hiddenFollowupUntil=0;p.facing=a.facing;p.lastStrike=w.time;p.strike=s.presentation.pose;p.action=a;p.combatState='startup';p.combatUntil=w.time+5;
  if(t.kind==='player')t.combatUntil=w.time+5;emit(w,p,a,'startup');return true;
 }
 function update(w,p,hooks){
  if(p.combo&&p.combo.until<=w.time+EPS){Combos.clear(p);emit(w,p,null,'combo-expired');}
  if(p.pendingAttack&&p.pendingAttack.until<w.time-EPS)p.pendingAttack=null;
  if(!p.action){p.combatState=p.staggerUntil>w.time+EPS?'stagger':'ready';return;}
  const a=p.action;
  if(p.hp<=0||p.jail>0||p.mapId!==a.mapId||p.path!==a.path||!equipmentValid(p)||(p.city?.equipment?.weapon||null)!==a.weapon){clear(w,p,'invalid-owner');return;}
  if(a.kind==='defense'){if(w.time+EPS>=a.endAt){emit(w,p,a,'complete');p.action=null;p.combatState='ready';}else {const phase=state(a,w.time);p.combatState=phase==='active'?a.defense:phase;}return;}
  const s=Data.get(a.skillId),hitAt=h=>a.startAt+a.startup+h.at-s.startup;
  while(p.action===a&&a.nextHit<s.hits.length&&w.time+EPS>=hitAt(s.hits[a.nextHit])){
   const ordinal=a.nextHit++,hit=s.hits[ordinal],primary=hooks.target(w,a.targetId),hitSkill={...s,range:hit.geometry?.reach||s.range,geometry:{...s.geometry,...hit.geometry}};
   // Invalid primary invalidates this scheduled strike; the intended target is never silently replaced.
   const victims=!a.finishedTargets.includes(primary?.id)&&hooks.eligible(w,p,primary,a.pvp)&&inShape(p,primary,hitSkill,a,hooks.blocked)?
    (s.geometry.shape==='selected-circle'?[primary]:hooks.entities(w,p.mapId).filter(t=>t.id===primary.id||['wolf','bandit'].includes(t.kind)).sort((x,y)=>Number(y.id===primary.id)-Number(x.id===primary.id))):[];
   let count=0;for(const t of victims){if(count>=hitSkill.geometry.targetCap)break;const key=ordinal+':'+t.id;
    const previous=a.hitCounts.find(x=>x.id===t.id);
    if(a.finishedTargets.includes(t.id)||(previous?.count||0)>=s.maxHitsPerTarget||a.victims.includes(key)||!hooks.eligible(w,p,t,a.pvp)||!inShape(p,t,hitSkill,a,hooks.blocked))continue;
    a.victims.push(key);if(previous)previous.count++;else a.hitCounts.push({id:t.id,count:1});count++;hooks.hit(w,p,t,s,a,ordinal,hit.scale*(a.enhanced&&ordinal===s.hits.length-1?s.enhancement.lastHitScale:1));
   }
   if(!count){Combos.clear(p);emit(w,p,a,'miss',{hitOrdinal:ordinal});}
  }
  if(p.action!==a)return;
  if(w.time+EPS>=a.endAt){emit(w,p,a,'complete');p.action=null;p.combatState='ready';const pending=p.pendingAttack;p.pendingAttack=null;if(pending&&pending.until>=w.time-EPS&&pending.targetId===p.target)start(w,p,pending.intent,hooks);return;}
  const phase=state(a,w.time);if(p.combatState!==phase){p.combatState=phase;emit(w,p,a,phase);}
 }
 function boundary(w){let next=Infinity;for(const p of Object.values(w.players)){const a=p.action,points=[p.staggerUntil,p.combo?.until,p.drill?.impactAt,p.drill?.endAt];if(a){const s=Data.get(a.skillId);points.push(a.startAt+a.startup,a.startAt+a.startup+a.active,a.endAt,...(s?s.hits.slice(a.nextHit).map(h=>a.startAt+a.startup+h.at-s.startup):[]));}for(const at of points)if(at>w.time+EPS)next=Math.min(next,at);}for(const e of w.entities)if(e.telegraph)for(const at of [e.telegraph.impactAt,e.telegraph.endAt])if(at>w.time+EPS)next=Math.min(next,at);return next;}
 function confirm(w,p,t,s,a,ordinal){if(ordinal!==0)return;if(s.followup){p.hiddenFollowupUntil=w.time+s.followup.window;emit(w,p,a,'hidden-followup',{until:p.hiddenFollowupUntil});}const result=Combos.hit(p,s,a,t.id,w.time);if(result)emit(w,p,a,'combo-'+result,{comboId:a.comboLink?.id||p.combo?.id||Combos.routes[p.path].id,until:p.combo?.until||null});return result;}
 function defend(w,p,type,intent,hooks){
  if(p.action||p.hp<=0||p.jail>0||p.travelLock>0||p.staggerUntil>w.time+EPS||w.time+EPS<(p.defenseReadyAt||0))return false;
  const dodge=type==='dodge',cost=dodge?18:8;if(p.energy<cost)return false;
  clear(w,p,'defense');p.energy-=cost;p.defenseReadyAt=w.time+(dodge?1.1:.9);p.combatUntil=w.time+5;
  const t=hooks.target(w,p.target),facing=t&&t.mapId===p.mapId?Math.atan2(t.y-p.y,t.x-p.x):p.facing||0;
  let dx=intent.x||0,dy=intent.y||0,d=Math.hypot(dx,dy);if(d<.01){dx=-Math.cos(facing);dy=-Math.sin(facing);d=1;}
  const startup=dodge?.04:.06,active=dodge?.18:.45,recovery=dodge?.24:.18;
  p.action={id:p.id+':'+(++w.actionSeq),kind:'defense',defense:type,skillId:null,targetId:t?.id||null,path:p.path,mapId:p.mapId,weapon:p.city?.equipment?.weapon||null,startAt:w.time,startup,active,endAt:w.time+startup+active+recovery,facing,dx:dx/d,dy:dy/d};
  p.facing=facing;p.combatState='startup';emit(w,p,p.action,'defense-start',{defense:type});return true;
 }
 function defenseResult(w,v,source,damage){const a=v.action;if(!a||a.kind!=='defense'||state(a,w.time)!=='active')return {result:'hit',damage};
  if(a.defense==='dodge'){v.counterUntil=w.time+.9;if(Combos.defense(v,source,w.time))emit(w,v,a,'counter-opportunity',{comboId:Combos.counterRoute.id,until:v.combo.until,targetId:source.id});const gain=Focus.defense(w,v,source,a);if(gain)emit(w,v,a,'focus',{gain,focus:v.focus});emit(w,v,a,'dodged',{targetId:source.id});return {result:'dodged',damage:0,timed:true};}
  const bearing=Math.atan2(source.y-v.y,source.x-v.x),angle=Math.atan2(Math.sin(bearing-a.facing),Math.cos(bearing-a.facing));
  if(Math.abs(angle)>Math.PI*70/180)return {result:'hit',damage};
  if(v.energy<10){clear(w,v,'guard-break');stagger(w,v,.2);return {result:'hit',damage};}
  v.energy-=10;const timed=w.time<=a.startAt+a.startup+.12+EPS;if(timed){v.counterUntil=w.time+.9;const gain=Focus.defense(w,v,source,a);if(gain)emit(w,v,a,'focus',{gain,focus:v.focus});}
  emit(w,v,a,'guarded',{targetId:source.id});return {result:'guarded',damage:Math.max(1,Math.round(damage*.4)),timed};
 }
 function stagger(w,p,duration=.12,resistance=1.2){if(w.time<(p.staggerResistUntil||0)||p.hp<=0)return false;clear(w,p,'stagger');p.staggerUntil=w.time+duration;p.staggerResistUntil=w.time+resistance;p.combatState='stagger';emit(w,p,null,'stagger',{until:p.staggerUntil});return true;}
 function motion(w,p,dt,move){const a=p.action;if(!a)return false;p.currentSpeed=0;p.groundSpeed=0;p.movementLockReason='Combat commitment';
  if(a.kind==='defense'&&a.defense==='dodge'&&w.time-dt<a.startAt+a.startup+a.active-EPS){const begin=Math.max(w.time-dt,a.startAt),end=Math.min(w.time,a.startAt+a.startup+a.active),distance=Math.max(0,end-begin)*5;move(p,p.x+a.dx*distance,p.y+a.dy*distance);}return true;
 }
 return {EPS,init,emit,clear,state,equipmentValid,lineClear,inShape,start,update,boundary,confirm,defend,defenseResult,stagger,motion};
});
