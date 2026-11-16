/* Runtime intent gate used by offline and host YF.command. Extra authority fields are ignored. */
(function(r,f){if(typeof module==='object')module.exports=f();else r.YFCommands=f();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const known=new Set(['school-learn','school-quest-accept','school-quest-claim','combat-study','combat-practice','dodge','guard','move','goto','movement-style','target','attack','equip','exit','buy','quest','bounty','claim','heal','arrest',
 'city-use','city-equip','city-unequip','city-duel-request','city-duel-accept','city-interact','city-quest-accept','city-quest-claim','city-buy','city-sell','city-store','city-retrieve','city-deposit','city-withdraw','city-repair','city-upgrade','city-rest']);
 function validate(a){
  if(!a||typeof a!=='object'||Array.isArray(a)||!known.has(a.type))return false;
  // Existing city UI includes null npc/peer fields even on inventory-only intents.
  for(const k of ['id','target','npc','item','slot','quest','mapId','skillId','path','style'])if(a[k]!==undefined&&!(a[k]===null&&['target','npc'].includes(k))&&(typeof a[k]!=='string'||a[k].length>80))return false;
  if(a.enhanced!==undefined&&typeof a.enhanced!=='boolean')return false;
  if(a.pvp!==undefined&&typeof a.pvp!=='boolean')return false;
  if(a.type==='dodge')return (a.x===undefined&&a.y===undefined)||(Number.isFinite(a.x)&&Number.isFinite(a.y)&&Math.abs(a.x)<=1&&Math.abs(a.y)<=1);
  if(a.type==='attack')return (a.skillId!==undefined||a.skill!==undefined)&&(a.skill===undefined||Number.isInteger(a.skill)&&a.skill>=0&&a.skill<=2);
  if(a.type==='move')return Number.isFinite(a.x)&&Number.isFinite(a.y)&&Math.abs(a.x)<=1&&Math.abs(a.y)<=1;
  if(a.type==='goto')return Number.isFinite(a.x)&&Number.isFinite(a.y)&&Math.abs(a.x)<=10000&&Math.abs(a.y)<=10000;
  if(a.type==='city-deposit'||a.type==='city-withdraw')return Number.isInteger(a.amount)&&a.amount>0&&a.amount<=999999;
  return true;
 }
 return {validate};
});
