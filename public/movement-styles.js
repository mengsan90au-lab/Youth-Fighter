/* Shared authoritative exploration calibration. Render/mini-map never determine position. */
(function(r,f){if(typeof module==='object')module.exports=f();else r.YFMovement=f();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';const unitsPerMetre=2,combatSpeed=5,accelerationTime=.1;
 const styles=Object.freeze({slow:Object.freeze({id:'slow',name:'Slow Model Walk',stepMetres:.55,strideMetres:1.10,cadence:1,speedMetres:.55,speed:1.10,cycleSeconds:2}),walk:Object.freeze({id:'walk',name:'Normal Walk',stepMetres:.70,strideMetres:1.40,cadence:1.8,speedMetres:1.26,speed:2.52,cycleSeconds:2/1.8}),run:Object.freeze({id:'run',name:'Run',stepMetres:1.20,strideMetres:2.40,cadence:2.7,speedMetres:3.24,speed:6.48,cycleSeconds:2/2.7})});
 const get=id=>Object.hasOwn(styles,id)?styles[id]:styles.walk;
 function combatLocked(w,p){return p.wanted>0||p.jail>0||(p.combatUntil||0)>w.time||p.cd?.some(c=>c>0)||(w.entities||[]).some(e=>e.mapId===p.mapId&&e.hp>0&&['wolf','bandit'].includes(e.kind)&&Math.hypot(e.x-p.x,e.y-p.y)<7);}
 function distanceBudget(v,target,dt){const decay=Math.exp(-dt/accelerationTime);return {distance:target*dt+(v-target)*accelerationTime*(1-decay),speed:target+(v-target)*decay};}
 function tick(w,p,dt,move){const locked=combatLocked(w,p),style=get(locked?'walk':p.movementStyle);p.effectiveMovementStyle=style.id;p.movementLockReason=locked?'Combat footwork':'';const target=locked?combatSpeed:style.speed,oldX=p.x,oldY=p.y;let dx=p.input?.x||0,dy=p.input?.y||0;
  if(!p.aim&&Math.hypot(dx,dy)<.01){p.currentSpeed=0;p.groundSpeed=0;return;}
  const budget=locked?{distance:target*dt,speed:target}:distanceBudget(p.currentSpeed||0,target,dt);p.currentSpeed=budget.speed;let remaining=Math.max(0,budget.distance),iterations=0;
  while(remaining>1e-10&&iterations++<64){if(p.aim){dx=p.aim.x-p.x;dy=p.aim.y-p.y;const d=Math.hypot(dx,dy);if(d<1e-9){p.x=p.aim.x;p.y=p.aim.y;p.aim=p.route?.shift()||null;if(!p.aim){p.currentSpeed=0;break;}continue;}}
   const length=Math.hypot(dx,dy);if(length<1e-10)break;const step=p.aim?Math.min(length,remaining):remaining,ox=p.x,oy=p.y;p.facing=Math.atan2(dy,dx);move(p,p.x+dx/length*step,p.y+dy/length*step);remaining-=step;
   if(Math.hypot(p.x-ox,p.y-oy)<1e-10){p.currentSpeed=0;if(p.aim){p.aim=null;p.route=[];}break;}
   const travelled=Math.hypot(p.x-ox,p.y-oy)/unitsPerMetre;p.movementMetres=(p.movementMetres||0)+travelled;p.gaitCycles=(p.gaitCycles||0)+travelled/style.strideMetres;
   if(p.aim&&Math.hypot(p.x-p.aim.x,p.y-p.aim.y)<1e-9){p.x=p.aim.x;p.y=p.aim.y;p.aim=p.route?.shift()||null;if(!p.aim){p.currentSpeed=0;break;}}
   if(!p.aim)break;
  }
  p.groundSpeed=dt>0?Math.hypot(p.x-oldX,p.y-oldY)/dt:0;
 }
 function reset(p){p.currentSpeed=0;p.groundSpeed=0;p.gaitCycles=0;p.movementMetres=0;}
 return {styles,get,unitsPerMetre,combatSpeed,accelerationTime,combatLocked,distanceBudget,tick,reset};
});
