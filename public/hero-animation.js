/* Read-only visual states. Simulation remains authoritative for movement, attacks and gear. */
(function(r,f){if(typeof module==='object')module.exports=f(require('./hero-data.js'));else r.YFHeroAnimation=f(r.YFHeroData);})(typeof globalThis!=='undefined'?globalThis:this,Data=>{
 'use strict';const facing=[{row:2,flip:false,name:'E'},{row:1,flip:false,name:'SE'},{row:0,flip:false,name:'S'},{row:1,flip:true,name:'SW'},{row:2,flip:true,name:'W'},{row:3,flip:true,name:'NW'},{row:4,flip:false,name:'N'},{row:3,flip:false,name:'NE'}];
 function direction(angle=0){const x=Math.cos(angle)-Math.sin(angle),y=(Math.cos(angle)+Math.sin(angle))*.5,index=(Math.round(Math.atan2(y,x)/(Math.PI/4))+8)%8;return {...facing[index],index,x:x/Math.hypot(x,y),y:y/Math.hypot(x,y)};}
 function pose(e,time,moving=false,facing=e.facing){const dir=direction(Number.isFinite(facing)?facing:0),skill=Number.isInteger(e.strike)&&e.strike>=0&&e.strike<=2?e.strike:0,age=time-(e.lastStrike??-10),duration=[.43,.49,.62][skill];let column=0,state='idle',lunge=0;
  if(e.combatVersion){const a=e.action;if(a){state=e.combatState==='startup'?'windup':e.combatState==='active'?'attack':'recover';column=state==='attack'?3+skill:0;}}
  else if(age>=0&&age<duration){const phase=age/duration;state=phase<.16?'windup':phase<.77?'attack':'recover';column=state==='attack'?3+skill:0;lunge=Math.sin(phase*Math.PI)*1.5;}
  if(state==='idle'&&moving){state='walk';column=[1,0,2,0][Math.floor(time*7.5)%4];}
  return {state,column,row:dir.row,flip:dir.flip,direction:dir,frame:Data.frames[dir.row*6+column],lunge,bob:state==='idle'?Math.sin(time*2.8)*.45:state==='walk'?Math.sin(time*15)*.6:0};
 }
 return {direction,pose};
});
