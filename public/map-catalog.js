/* Queryable atlas data; no DOM or simulation side effects. */
(function(r,f){if(typeof module==='object')module.exports=f(require('./map-data.js'),require('./city-data.js'));else r.YFMaps=f(r.YFMapData,r.YFCityData);})(typeof globalThis!=='undefined'?globalThis:this,(data,City)=>{
 'use strict';
 const golden=data.regions.find(r=>r.realmId==='golden-naga');
 for(const definition of City.maps){const m=JSON.parse(JSON.stringify(definition));m.regionId=golden.id;data.locations.push(m);golden.locationIds.push(m.id);}
 const legacy=data.locations.find(m=>m.id==='sovann-city'),grove=data.locations.find(m=>m.id==='bamboo-grove'),market=data.locations.find(m=>m.id==='sovann-market-ward'),south=data.locations.find(m=>m.id==='sovann-south-gate-ward');
 legacy.exits.push({id:'sovann-market-entry',name:'Market Ward',x:12,y:26,radius:1.15,toMap:market.id,toExit:'market-old-square',spawnX:5,spawnY:35,minLevel:1});
 market.exits.push({id:'market-old-square',name:'Old Sovann Square',x:2,y:35,radius:1.15,toMap:legacy.id,toExit:'sovann-market-entry',spawnX:12,spawnY:23,minLevel:1});
 south.exits.push({id:'south-grove-entry',name:'Bamboo Grove - OPEN COMBAT',x:20,y:41,radius:1.15,toMap:grove.id,toExit:'grove-south-city',spawnX:25,spawnY:40,minLevel:1});
 grove.exits.push({id:'grove-south-city',name:'Sovann South Gate',x:25,y:43,radius:1.15,toMap:south.id,toExit:'south-grove-entry',spawnX:20,spawnY:38,minLevel:1});
 const byId=new Map(data.locations.map(m=>[m.id,m])),byRealm=new Map(data.realms.map(r=>[r.id,r]));
 const map=id=>byId.get(id),realm=id=>byRealm.get(id),region=id=>data.regions.find(r=>r.id===id||r.realmId===id);
 function contains(id,x,y){const b=map(id)?.bounds;return !!b&&x>=b.minX&&x<=b.maxX&&y>=b.minY&&y<=b.maxY;}
 function blocked(id,x,y){const m=map(id);return !m?.playable||!contains(id,x,y)||((m.water||[]).some(o=>x>o.x-.2&&x<o.x+o.w+.2&&y>o.y-.2&&y<o.y+o.h+.2)&&!(m.bridges||[]).some(o=>x>=o.x+.2&&x<=o.x+o.w-.2&&y>=o.y+.2&&y<=o.y+o.h-.2))||[...m.buildings,...(m.decorCollision||[])].some(o=>x>o.x-.35&&x<o.x+o.w+.35&&y>o.y-.35&&y<o.y+o.h+.35);}
 function travelRoute(from,to){if(from===to)return [];const seen=new Set([from]),queue=[{id:from,path:[]}];while(queue.length){const n=queue.shift();for(const exit of map(n.id)?.exits||[]){if(!map(exit.toMap)?.playable||seen.has(exit.toMap))continue;const path=[...n.path,{mapId:n.id,exitId:exit.id,toMap:exit.toMap,name:exit.name,x:exit.x,y:exit.y}];if(exit.toMap===to)return path;seen.add(exit.toMap);queue.push({id:exit.toMap,path});}}return null;}
 function points(id){const m=map(id);return m?[...m.pois,...m.exits.map(e=>({...e,category:'Map exit',available:true}))]:[];}
 function find(id,query=''){const q=query.trim().toLowerCase();return points(id).filter(n=>(n.name+' '+n.category).toLowerCase().includes(q));}
 function validateMapEntry(id,entry,errors,sourceData=data){
  if(!entry||typeof entry!=='object'){errors.push(`Map entry ${id} must be an object.`);return;}
  if(!id||!String(id).trim()){errors.push('Encountered a map without a valid ID.');}
  if(!entry.name||typeof entry.name!=='string'){errors.push(`Map ${id} is missing a valid name.`);}
  if(!entry.bounds||typeof entry.bounds!=='object'){errors.push(`Map ${id} is missing bounds.`);return;}
  const locationMap=new Map(Array.isArray(sourceData.locations)?sourceData.locations.map(m=>[m.id,m]):[]);
  const resolveKnownMap=(mapId)=>locationMap.get(mapId) || map(mapId);
  const containsLocal=(mapId,x,y)=>{const b=resolveKnownMap(mapId)?.bounds;if(!b)return false;return x>=b.minX&&x<=b.maxX&&y>=b.minY&&y<=b.maxY;};
  const {minX,maxX,minY,maxY}=entry.bounds;
  if(!Number.isFinite(minX)||!Number.isFinite(maxX)||!Number.isFinite(minY)||!Number.isFinite(maxY)){errors.push(`Map ${id} has invalid numeric bounds.`);}
  else if(maxX<minX||maxY<minY){errors.push(`Map ${id} has inverted bounds.`);}
  if(entry.spawn && (!Number.isFinite(entry.spawn.x)||!Number.isFinite(entry.spawn.y))){errors.push(`Map ${id} has an invalid spawn.`);}
  else if(entry.spawn && !containsLocal(id,entry.spawn.x,entry.spawn.y)){errors.push(`Map ${id} spawn is outside the valid bounds.`);}
  if(Array.isArray(entry.exits)){
    for(const exit of entry.exits){
      if(!exit||typeof exit!=='object'){errors.push(`Map ${id} contains an invalid exit definition.`);continue;}
      if(!exit.id||!exit.toMap){errors.push(`Map ${id} exit ${exit.id||'unknown'} is missing a stable identifier or destination.`);continue;}
      if(!resolveKnownMap(exit.toMap)){errors.push(`Map ${id} exit ${exit.id} points to an unknown map: ${exit.toMap}.`);continue;}
      if(!Number.isFinite(exit.x)||!Number.isFinite(exit.y)){errors.push(`Map ${id} exit ${exit.id} has invalid coordinates.`);continue;}
      if(!containsLocal(id,exit.x,exit.y)){errors.push(`Map ${id} exit ${exit.id} is outside bounds.`);}
      if(entry.spawn && exit.toMap===id){errors.push(`Map ${id} exit ${exit.id} loops back to the same map without a destination change.`);}
    }
  }
 }
 function validateWorldData(customData=data){
  const errors=[]; const locations=Array.isArray(customData.locations)?customData.locations:[];
  const seen=new Set();
  for(const [idx,entry] of locations.entries()){const id=entry&&typeof entry.id==='string'?entry.id:String(idx);if(seen.has(id)){errors.push(`Duplicate map ID detected: ${id}.`);continue;}seen.add(id);validateMapEntry(id,entry,errors,customData);}
  if(Array.isArray(customData.realms)){for(const realm of customData.realms){if(!realm||typeof realm!=='object'){errors.push('A realm definition is invalid.');continue;}if(!realm.id){errors.push('Realm missing an ID.');continue;}if(!realm.name){errors.push(`Realm ${realm.id} is missing a name.`);} if(realm.locationIds && Array.isArray(realm.locationIds)){for(const id of realm.locationIds){if(!locations.some(m=>m.id===id)){errors.push(`Realm ${realm.id} references unknown map ID ${id}.`);}}}}}
  return {valid:errors.length===0,errors};
 }
 return {data,map,realm,region,districts:id=>data.locations.filter(m=>m.cityId===id),contains,blocked,travelRoute,points,find,validateMapEntry,validateWorldData};
});
