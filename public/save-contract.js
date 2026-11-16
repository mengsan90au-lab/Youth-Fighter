/* Shared validation contract for saves and network commands. */
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.YFSaveContract=factory();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const allowedVersions=new Set([2,3,4,5]);
 const clampNumber=(value,min,max)=>Number.isFinite(value)?Math.min(Math.max(value,min),max):null;
 function validateSaveData(data, options={}){
  const errors=[];
  const mapLookup=options.maps||{};
  const mapId=(value)=>typeof value==='string'&&!!value.trim();
  if(!data||typeof data!=='object'||Array.isArray(data)){errors.push('Save payload must be an object.');return {valid:false,errors,normalized:null};}
  const version=Number(data.version);
  if(!allowedVersions.has(version)){errors.push(`Unsupported save schema version: ${version ?? 'missing'}.`);}
  if(!mapId(data.mapId)){errors.push('Save payload is missing a valid mapId.');}
  else if(mapLookup.map && typeof mapLookup.map==='function' && !mapLookup.map(data.mapId)){
    errors.push(`Save payload references an unknown mapId: ${data.mapId}.`);
  }
  if(data.level!==undefined && !(Number.isFinite(data.level)&&data.level>=1&&data.level<=100)){errors.push('Player level is out of range.');}
  if(data.xp!==undefined && !(Number.isFinite(data.xp)&&data.xp>=0)){errors.push('Player xp is invalid.');}
  if(data.gold!==undefined && !(Number.isFinite(data.gold)&&data.gold>=0&&data.gold<=999999)){errors.push('Player gold is invalid.');}
  if(data.hp!==undefined && !(Number.isFinite(data.hp)&&data.hp>=0)){errors.push('Player hp is invalid.');}
  if(data.energy!==undefined && !(Number.isFinite(data.energy)&&data.energy>=0&&data.energy<=100)){errors.push('Player energy is invalid.');}
  if(data.wanted!==undefined && !(Number.isFinite(data.wanted)&&data.wanted>=0&&data.wanted<=999)){errors.push('Wanted status is invalid.');}
  if(data.jail!==undefined && !(Number.isFinite(data.jail)&&data.jail>=0&&data.jail<=12)){errors.push('Jail value is invalid.');}
  if(data.potions!==undefined && !(Number.isFinite(data.potions)&&data.potions>=0&&data.potions<=9)){errors.push('Potion count is invalid.');}
  if(data.kills!==undefined && !(Number.isFinite(data.kills)&&data.kills>=0)){errors.push('Kills value is invalid.');}
  if(data.cd !== undefined){
   if(!Array.isArray(data.cd)||data.cd.length!==3||data.cd.some(v=>!Number.isFinite(v)||v<0||v>9)){errors.push('Cooldown array must contain three finite numeric values between 0 and 9.');}
  }
  if(data.city && typeof data.city==='object'){const city=data.city; if(city.inventory && typeof city.inventory==='object'){for(const [key,val] of Object.entries(city.inventory)){if(!Number.isFinite(val)||val<0||val>80){errors.push(`City inventory entry ${key} is invalid.`);}} } if(city.equipment && typeof city.equipment==='object'){for(const [slot,itemId] of Object.entries(city.equipment)){if(typeof slot!=='string'||typeof itemId!=='string'){errors.push(`City equipment slot ${slot} is invalid.`);}}}} 
  const normalized={
   version:Number.parseInt(data.version,10),
   mapId:data.mapId,
   level:clampNumber(data.level,1,100),
   xp:clampNumber(data.xp,0,999999),
   gold:clampNumber(data.gold,0,999999),
   hp:clampNumber(data.hp,0,999999),
   energy:clampNumber(data.energy,0,100),
   wanted:clampNumber(data.wanted,0,999),
   jail:clampNumber(data.jail,0,12),
   potions:clampNumber(data.potions,0,9),
   kills:clampNumber(data.kills,0,999999),
   cd:Array.isArray(data.cd)?data.cd.map(v=>clampNumber(v,0,9)).filter(v=>v!==null):[]
  };
  return {valid:errors.length===0,errors,normalized};
 }
 function validateCommand(command, options={}){
  const errors=[];
  if(!command||typeof command!=='object'||Array.isArray(command)){errors.push('Command payload must be an object.');return {valid:false,errors};}
  const type=command.type;
  if(typeof type!=='string' || !type.trim()){errors.push('Command type is required.');return {valid:false,errors};}
  if(type==='move'){const x=Number(command.x),y=Number(command.y);if(!Number.isFinite(x)||!Number.isFinite(y)){errors.push('Movement command requires finite x and y values.');}else if(Math.abs(x)>1||Math.abs(y)>1){errors.push('Movement command values must be clamped to [-1,1].');}}
  if(type==='goto'){const x=Number(command.x),y=Number(command.y);if(!Number.isFinite(x)||!Number.isFinite(y)){errors.push('Goto command requires finite x and y values.');}else if(options.map && typeof options.map==='function' && command.mapId && !options.map(command.mapId)){errors.push(`Goto target map ${command.mapId} is unknown.`);} }
  if(type==='attack'){const skill=Number(command.skill); if(!Number.isInteger(skill)||skill<0||skill>2){errors.push('Attack skill index must be an integer between 0 and 2.');} }
  if(type==='buy' || type==='sell' || type==='city-buy' || type==='city-sell'){if(command.item!==undefined && typeof command.item!=='string'){errors.push('Item identifier must be a string.');}}
  return {valid:errors.length===0,errors};
 }
 return {validateSaveData,validateCommand};
});
