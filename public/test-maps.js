/* Explicit solo sandbox. Canonical map files and production locks stay unchanged. */
(function(r,f){if(typeof module==='object')module.exports=f(require('./map-catalog.js'),require('./world.js'));else r.YFTestMaps=f(r.YFMaps,r.YF);})(typeof globalThis!=='undefined'?globalThis:this,(Maps,World)=>{
 'use strict';let active=false;
 function enable(p){if(active){p.testSession=true;return;}active=true;p.testSession=true;
  for(const realm of Maps.data.realms)realm.playable=true;
  for(const m of Maps.data.locations){if(m.playable)continue;
   const seed=[...m.id].reduce((s,c)=>s+c.charCodeAt(0),0),wild=['monster','dungeon'].includes(m.kind);
   Object.assign(m,{playable:true,testArea:true,danger:wild,lockReason:'',bounds:{minX:1,minY:1,maxX:19,maxY:27},minLevel:1,roads:[[{x:2,y:12},{x:18,y:12}],[{x:12,y:3},{x:12,y:25}]],rivers:[],buildings:wild?[{name:'Test ruins',x:4,y:5,w:3,h:3}]:[{name:'Test hall',x:4,y:4,w:4,h:3},{name:'Test market',x:14,y:17,w:3,h:3}],pois:[{id:m.id+'-guide',name:'Testing guide',category:'Test waypoint',x:12,y:12,available:true}],exits:[{id:m.id+'-return',name:'Return to Sovann City',x:3,y:12,radius:1.2,toMap:'sovann-city',spawnX:12,spawnY:12,minLevel:1}],testSeed:seed});
   }
  // A connected two-way test circuit gives every location physical entrances.
  const all=Maps.data.locations;
  for(let i=0;i<all.length;i++){
   const m=all[i],b=m.bounds;
   for(const [step,label] of [[1,'Next map'],[-1,'Previous map']]){
    const target=all[(i+step+all.length)%all.length];let spot;
    for(let y=b.maxY-2;y>b.minY+1&&!spot;y--)for(let x=step>0?b.maxX-2:b.minX+2;step>0?x>b.minX+1:x<b.maxX-1;x-=step){if(!Maps.blocked(m.id,x,y)&&!m.exits.some(e=>Math.hypot(e.x-x,e.y-y)<3)){spot={x,y};break;}}
    if(!spot)throw Error('No safe test gateway: '+m.id);
    m.exits.push({id:m.id+'-test-'+step,name:label+': '+target.name,x:spot.x,y:spot.y,radius:1.1,toMap:target.id,spawnX:target.spawn?.x||(target.id==='bamboo-grove'?21:12),spawnY:target.spawn?.y||12,minLevel:1,testGateway:true});
    m.roads.push([{x:m.id==='bamboo-grove'?21:12,y:12},spot]);
   }
  }
 }
 function populate(w,id){const m=Maps.map(id);if(m?.testArea&&!w.entities.some(e=>e.mapId===id)){
   const wild=m.danger,points=wild?[[6,18],[15,7],[15,22]]:[[12,12]];
   points.forEach(([x,y],i)=>w.entities.push({id:'test-'+id+'-'+i,kind:wild?'wolf':'civilian',name:wild?'Test sparring beast':'Testing guide',mapId:id,x,y,homeX:x,homeY:y,hp:wild?65:60,maxHp:wild?65:60,cd:0,respawn:0}));
  }}
 const step=World.step;World.step=function(w,dt){if(active)for(const p of Object.values(w.players))if(p.testSession)populate(w,p.mapId);step(w,dt);if(active)for(const p of Object.values(w.players))if(p.testSession)populate(w,p.mapId);};
 function enter(w,p,id){const m=Maps.map(id);if(!active||!p.testSession||!m?.playable||p.jail>0)return false;
  populate(w,id);
  const x=m.spawn?.x||(id==='bamboo-grove'?21:12),y=m.spawn?.y||12;
  if(Maps.blocked(id,x,y))return false;
  World.enterMap(w,p,id,x,y);return true;
 }
 return {enable,enter,get active(){return active;}};
});
