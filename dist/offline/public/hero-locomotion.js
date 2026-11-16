/* Pure presentation tracking. No writes to characters, collision, combat or saves. */
(function(r,f){if(typeof module==='object')module.exports=f(require('./hero-motion-data.js'),require('./movement-styles.js'));else r.YFHeroLocomotion=f(r.YFHeroMotionData,r.YFMovement);})(typeof globalThis!=='undefined'?globalThis:this,(Data,Movement)=>{
 'use strict';const names=['E','SE','S','SW','W','NW','N','NE'];
 function direction(angle){const x=Math.cos(angle)-Math.sin(angle),y=(Math.cos(angle)+Math.sin(angle))*.5;return names[(Math.round(Math.atan2(y,x)/(Math.PI/4))+8)%8];}
 class Tracker{
  constructor(){this.tracks=new Map();}
  clear(){this.tracks.clear();}
  update(e,time,key=e.id){let old=this.tracks.get(key);const jump=old?Math.hypot(e.x-old.x,e.y-old.y):0;
   if(!old||time<old.time||e.mapId!==old.mapId||jump>2||old.alive!==(e.hp>0)){old={x:e.x,y:e.y,time,mapId:e.mapId,alive:e.hp>0,distance:0,cycles:0,weight:0,heading:e.facing||0,hp:e.hp,hurtUntil:0};this.tracks.set(key,old);}
   const dt=Math.max(0,time-old.time),distance=Math.hypot(e.x-old.x,e.y-old.y),moving=dt>0&&distance>1e-5;
   const style=Movement?.get(e.effectiveMovementStyle||e.movementStyle)?.id||'walk',stride=(Movement?.get(style)?.strideMetres||1.4)*(Movement?.unitsPerMetre||2);
   if(moving){old.distance+=distance;old.cycles+=distance/stride;}if(Number.isFinite(e.gaitCycles))old.cycles=e.gaitCycles;const target=e.facing||0,age=time-(e.lastStrike??-10);
   old.heading=age>=0&&age<.65?target:old.heading+Math.atan2(Math.sin(target-old.heading),Math.cos(target-old.heading))*(1-Math.exp(-18*Math.min(dt,.1)));
   old.weight=moving?1-(1-old.weight)*Math.exp(-32*dt):old.weight*Math.exp(-40*dt);if(e.hp<old.hp)old.hurtUntil=time+.18;
   const phase=((old.cycles%1)+1)%1*12,index=Math.floor(phase),name=direction(old.heading);if(old.direction&&(old.direction!==name||old.style!==style)){old.fromDirection=old.direction;old.fromStyle=old.style;old.turnAt=time;old.transitionSeconds=old.style!==style?.12:.055;}
   Object.assign(old,{x:e.x,y:e.y,time,hp:e.hp,direction:name,style});if(this.tracks.size>128)for(const [id,t]of this.tracks)if(time-t.time>10)this.tracks.delete(id);
   return {...old,index,next:(index+1)%12,blend:phase-index,speed:dt>0?distance/dt:0,moving};
  }
 }
 function sample(distance,name,style='walk'){const stride=(Movement?.get(style)?.strideMetres||1.4)*(Movement?.unitsPerMetre||2),phase=((distance/stride%1)+1)%1*12,index=Math.floor(phase);return {name,index,next:(index+1)%12,blend:phase-index};}
 return {names,direction,Tracker,sample};
});
