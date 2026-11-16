/* Timing and presentation only. No client authority over collision, speed or damage. */
(function(r,f){if(typeof module==='object')module.exports=f();else r.YFPerformance=f();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';const KEY='youth-fighter-graphics-v1',defaults={fps:120,reduced:false,camera:true,monitor:false};
 function settings(value){return {fps:[0,30,60,120].includes(Number(value?.fps))?Number(value.fps):120,reduced:!!value?.reduced,camera:value?.camera!==false,monitor:!!value?.monitor};}
 function load(storage){try{return settings(JSON.parse(storage?.getItem(KEY)||'null'));}catch{return {...defaults};}}
 function save(storage,value){try{storage?.setItem(KEY,JSON.stringify(settings(value)));return !!storage;}catch{return false;}}
 const angle=(a,b,t)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*t;
 const damp=(a,b,rate,dt)=>b+(a-b)*Math.exp(-rate*Math.max(0,dt));
 class Clock{
  constructor(hz=60){this.step=1/hz;this.accumulator=0;this.previous=null;this.nextRender=null;this.lost=0;}
  reset(now=null){this.previous=now;this.accumulator=0;this.nextRender=null;}
  advance(now,update){if(this.previous===null){this.previous=now;return {dt:0,steps:0,alpha:0};}const elapsed=Math.max(0,(now-this.previous)/1000);this.previous=now;const dt=Math.min(.1,elapsed);this.lost+=Math.max(0,elapsed-dt);this.accumulator+=dt;let steps=0;while(this.accumulator+1e-10>=this.step&&steps<6){update(this.step);this.accumulator-=this.step;steps++;}return {dt,steps,alpha:Math.max(0,Math.min(1,this.accumulator/this.step))};}
  draw(now,fps){if(!fps){this.nextRender=null;return true;}const period=1000/fps;if(this.nextRender===null){this.nextRender=now+period;return true;}if(now+.15<this.nextRender)return false;this.nextRender+=period;if(this.nextRender<=now-.15)this.nextRender=now+period;return true;}
 }
 // Retain only visual fields. Sampling never writes to authoritative entities or saves.
 class Positions{
  constructor(delay=0){this.delay=delay;this.frames=[];this.views=new Map();}
  clear(){this.frames.length=0;this.views.clear();}
  push(at,entities,time){if(this.frames.length&&at<=this.frames.at(-1).at)return;const positions=new Map();for(const e of entities)positions.set(e.id,{x:e.x,y:e.y,facing:e.facing||0,mapId:e.mapId,alive:e.hp>0,gaitCycles:e.gaitCycles,movementMetres:e.movementMetres,groundSpeed:e.groundSpeed,effectiveMovementStyle:e.effectiveMovementStyle,movementLockReason:e.movementLockReason});this.frames.push({at,time,positions});if(this.frames.length>(this.delay?32:2))this.frames.shift();}
  sample(at,entities,alpha=null){const target=at-this.delay,frames=this.frames;let a=frames[0],b=a,t=1;if(alpha!==null){a=frames.at(-2)||a;b=frames.at(-1)||a;t=alpha;}else{for(const f of frames){if(f.at<=target)a=f;if(f.at>=target){b=f;break;}b=f;}if(a&&b)t=b.at===a.at?1:Math.max(0,Math.min(1,(target-a.at)/(b.at-a.at)));}
   const out=[];for(const e of entities){let v=this.views.get(e.id);if(!v){v={};this.views.set(e.id,v);}Object.assign(v,e);const x=a?.positions.get(e.id),y=b?.positions.get(e.id);if(x&&y&&x.mapId===e.mapId&&y.mapId===e.mapId&&x.alive===y.alive&&Math.hypot(y.x-x.x,y.y-x.y)<2&&Math.hypot(e.x-y.x,e.y-y.y)<2){v.x=x.x+(y.x-x.x)*t;v.y=x.y+(y.y-x.y)*t;v.facing=angle(x.facing,y.facing,t);for(const key of ['gaitCycles','movementMetres','groundSpeed'])if(Number.isFinite(x[key])&&Number.isFinite(y[key]))v[key]=x[key]+(y[key]-x[key])*t;v.effectiveMovementStyle=y.effectiveMovementStyle;v.movementLockReason=y.movementLockReason;}out.push(v);}const live=new Set(entities.map(e=>e.id));for(const id of this.views.keys())if(!live.has(id))this.views.delete(id);return {entities:out,time:a&&b?a.time+(b.time-a.time)*t:0};
  }
 }
 class Meter{
  constructor(){this.frames=[];this.updates=[];this.raf=[];this.rtt=null;this.snapshots=[];this.serverTicks=[];}
  record(now,steps,drew){this.raf.push(now);if(steps)this.updates.push({at:now,count:steps});if(drew)this.frames.push(now);for(const list of [this.raf,this.frames,this.snapshots])while(list.length&&list[0]<now-2000)list.shift();while(this.updates.length&&this.updates[0].at<now-2000)this.updates.shift();}
  snapshot(now,tick){this.snapshots.push(now);if(Number.isSafeInteger(tick))this.serverTicks.push({at:now,tick});while(this.serverTicks.length&&this.serverTicks[0].at<now-2000)this.serverTicks.shift();}
  read(){const a=this.frames,n=a.length,span=n>1?(a.at(-1)-a[0])/1000:0,deltas=[];for(let i=1;i<n;i++)deltas.push(a[i]-a[i-1]);const mean=deltas.length?deltas.reduce((s,x)=>s+x,0)/deltas.length:0,variation=deltas.length?Math.sqrt(deltas.reduce((s,x)=>s+(x-mean)**2,0)/deltas.length):0,rafSpan=this.raf.length>1?(this.raf.at(-1)-this.raf[0])/1000:0;return {fps:span?(n-1)/span:0,frameMs:mean,variationMs:variation,simulationHz:rafSpan?this.updates.reduce((s,x)=>s+x.count,0)/rafSpan:0,rafHz:rafSpan?(this.raf.length-1)/rafSpan:0,snapshotHz:this.snapshots.length>1?(this.snapshots.length-1)/((this.snapshots.at(-1)-this.snapshots[0])/1000):0,serverHz:this.serverTicks.length>1?(this.serverTicks.at(-1).tick-this.serverTicks[0].tick)/((this.serverTicks.at(-1).at-this.serverTicks[0].at)/1000):null,rtt:this.rtt};}
 }
 return {KEY,defaults,settings,load,save,angle,damp,Clock,Positions,Meter};
});
