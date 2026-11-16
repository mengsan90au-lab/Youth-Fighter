/* Solo-only persistence. Network clients never upload this data to the host. */
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.YFSave=factory();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';const Maps=typeof module==='object'?require('./map-catalog.js'):globalThis.YFMaps;const City=typeof module==='object'?require('./city-system.js'):globalThis.YFCity;const Discovery=typeof module==='object'?require('./combat-discovery.js'):globalThis.YFDiscovery;const Data=typeof module==='object'?require('./combat-data.js'):globalThis.YFCombatData;const KEY='youth-fighter-solo-v2';
 function snapshot(p){return {version:5,combatProgress:Discovery.sanitize(p.combatProgress),extraCd:{...p.extraCd},city:City.sanitize(p.city),energy:p.energy,cd:p.cd,mapId:p.mapId,x:p.x,y:p.y,name:p.name,level:p.level,xp:p.xp,gold:p.gold,potions:p.potions,kills:p.kills,quest:p.quest,questDone:p.questDone,bounty:p.bounty,bountyDone:p.bountyDone,path:p.path,wanted:p.wanted,jail:p.jail,hp:p.hp};}
 function restore(p,data){if(!data||![2,3,4,5].includes(data.version))return false;
  const bounded=(k,min,max,fallback)=>Number.isFinite(data[k])?Math.max(min,Math.min(max,Math.floor(data[k]))):fallback;
  p.energy=Number.isFinite(data.energy)?Math.max(0,Math.min(100,data.energy)):100;if(Array.isArray(data.cd)&&data.cd.length===3)p.cd=data.cd.map(c=>Number.isFinite(c)?Math.max(0,Math.min(9,c)):0);
  p.name=typeof data.name==='string'?data.name.replace(/[<>\u0000-\u001f]/g,'').slice(0,20)||p.name:p.name;
  p.level=bounded('level',1,100,1);p.maxHp=120+(p.level-1)*15;p.xp=bounded('xp',0,p.level*100-1,0);p.gold=bounded('gold',0,999999,0);p.potions=bounded('potions',0,9,3);p.kills=bounded('kills',0,999999,0);
  for(const key of ['quest','questDone','bounty','bountyDone'])p[key]=data[key]===true;
  if(p.questDone)p.quest=false;if(p.bountyDone)p.bounty=false;p.path=data.path==='spear'?'spear':'fist';p.wanted=bounded('wanted',0,999,0);p.jail=Number.isFinite(data.jail)?Math.max(0,Math.min(12,data.jail)):0;p.hp=Number.isFinite(data.hp)?Math.max(1,Math.min(p.maxHp,data.hp)):p.maxHp;p.mapId=data.version>=3&&Maps.map(data.mapId)?.playable?data.mapId:'sovann-city';p.x=Maps.map(p.mapId).spawn?.x||12;p.y=Maps.map(p.mapId).spawn?.y||12;if(data.version>=3&&Number.isFinite(data.x)&&Number.isFinite(data.y)&&!Maps.blocked(p.mapId,data.x,data.y)){p.x=data.x;p.y=data.y;}else if(p.mapId==='bamboo-grove'){p.x=21;p.y=12;}if(p.jail>0){p.mapId='sovann-city';p.x=4;p.y=24;}
  p.city=City.sanitize(data.city);const weapon=City.data.items.find(i=>i.id===p.city.equipment.weapon);if(weapon&&weapon.path!==p.path)delete p.city.equipment.weapon;
  // Action IDs, pending hits and presentation/combo state never survive a load.
  p.combatProgress=Discovery.sanitize(data.version>=5?data.combatProgress:null);p.extraCd={};for(const s of Data.skills)if(s.index===null&&Number.isFinite(data.extraCd?.[s.id]))p.extraCd[s.id]=Math.max(0,Math.min(s.cool,data.extraCd[s.id]));p.challenge=null;p.drill=null;p.drillReadyAt=0;p.hiddenFollowupUntil=0;p.combo=null;p.pendingAttack=null;p.counterUntil=0;p.defenseReadyAt=0;p.staggerUntil=0;p.staggerResistUntil=0;p.action=null;p.combatVersion=1;p.combatState='ready';p.lastStrike=-10;p.combatUntil=0;p.target=null;p.aim=null;p.route=[];p.input={x:0,y:0};p.duel=null;return true;
 }
 function load(storage){try{return JSON.parse(storage.getItem(KEY));}catch{return null;}}
 function save(storage,p){try{storage.setItem(p.testSession?'youth-fighter-map-testing-v1':KEY,JSON.stringify(snapshot(p)));return true;}catch{return false;}}
 function clear(storage){try{storage.removeItem(KEY);return true;}catch{return false;}}
 return {KEY,snapshot,restore,load,save,clear};
});
