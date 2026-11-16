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
 return {data,map,realm,region,districts:id=>data.locations.filter(m=>m.cityId===id),contains,blocked,travelRoute,points,find};
});
