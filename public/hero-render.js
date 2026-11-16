/* Directional pre-rendered hero, frame animation, subtle cloth motion and owned equipment layers. */
(function(r){'use strict';const Data=r.YFHeroData,Animation=r.YFHeroAnimation,tracks=new Map();let sheet=null;
 if(typeof r.Image==='function'){sheet=new r.Image();sheet.src=r.YFHeroImage||Data.asset.path;}
 const ready=()=>!!(sheet&&sheet.complete&&sheet.naturalWidth===Data.asset.width&&sheet.naturalHeight===Data.asset.height);
 function motion(e,t,key){let old=tracks.get(key);if(!old||t<old.t||old.mapId!==e.mapId){old={x:e.x,y:e.y,hp:e.hp,t,mapId:e.mapId,walkUntil:0,hurtUntil:0};tracks.set(key,old);}
  if(Math.hypot(e.x-old.x,e.y-old.y)>.006)old.walkUntil=t+.07;if(e.hp<old.hp)old.hurtUntil=t+.18;
  const delta=Math.max(0,Math.min(.1,t-old.t)),walking=t<old.walkUntil;Object.assign(old,{x:e.x,y:e.y,hp:e.hp,t});if(tracks.size>128)for(const [id,state]of tracks)if(t-state.t>10)tracks.delete(id);return {walking,hurt:t<old.hurtUntil,cache:old,delta};
 }
 function gear(ctx,e,p,scale,time){const c=e.city,dir=p.direction,side=p.row===2?.58:1;if(!c)return;
  // These simple overlays correspond to actual owned/equipped slots; no stats are changed here.
  if(c.equipment?.armour==='vest'){ctx.save();ctx.globalAlpha=.62;ctx.fillStyle='#8d8063';ctx.beginPath();ctx.moveTo(-9*scale*side,-52*scale);ctx.lineTo(9*scale*side,-52*scale);ctx.lineTo(8*scale*side,-34*scale);ctx.lineTo(-8*scale*side,-34*scale);ctx.closePath();ctx.fill();ctx.strokeStyle='#d0bc86';ctx.lineWidth=.7*scale;ctx.beginPath();ctx.moveTo(-7*scale*side,-44*scale);ctx.lineTo(7*scale*side,-44*scale);ctx.moveTo(0,-51*scale);ctx.lineTo(0,-35*scale);ctx.stroke();ctx.restore();}
  if(c.equipment?.accessory==='charm'){ctx.strokeStyle='#d1ae54';ctx.lineWidth=scale;ctx.beginPath();ctx.moveTo(5*scale*side,-50*scale);ctx.lineTo(5*scale*side,-41*scale);ctx.stroke();ctx.fillStyle='#edcf76';ctx.beginPath();ctx.arc(5*scale*side,-40*scale,2*scale,0,Math.PI*2);ctx.fill();}
  if(c.equipment?.costume==='krama'){ctx.strokeStyle='#bc625b';ctx.lineWidth=4*scale;ctx.beginPath();ctx.moveTo(-3*scale,-32*scale);ctx.quadraticCurveTo(-10*scale,-24*scale,-8*scale+Math.sin(time*7)*2*scale,-16*scale);ctx.stroke();}
  if(c.equipment?.weapon==='wraps'&&e.path!=='spear'){ctx.strokeStyle='#e0c693';ctx.lineWidth=2*scale;const punch=p.column===3?1:0;ctx.beginPath();ctx.moveTo((-14+punch*dir.x*10)*scale,(-37+punch*dir.y*10)*scale);ctx.lineTo((-9+punch*dir.x*10)*scale,(-36+punch*dir.y*10)*scale);ctx.moveTo(9*scale,-37*scale);ctx.lineTo(14*scale,-36*scale);ctx.stroke();}
 }
 function spear(ctx,p,scale){const d=p.direction,hand={x:d.x*9*scale,y:-36*scale+d.y*6*scale},reach=(p.state==='attack'?47:36)*scale;ctx.strokeStyle='#c2a568';ctx.lineWidth=2.4*scale;ctx.beginPath();ctx.moveTo(hand.x-d.x*22*scale,hand.y-d.y*22*scale);ctx.lineTo(hand.x+d.x*reach,hand.y+d.y*reach);ctx.stroke();const tip={x:hand.x+d.x*(reach+7*scale),y:hand.y+d.y*(reach+7*scale)};ctx.fillStyle='#dce3ce';ctx.beginPath();ctx.moveTo(tip.x,tip.y);ctx.lineTo(hand.x+d.x*reach-d.y*3*scale,hand.y+d.y*reach+d.x*3*scale);ctx.lineTo(hand.x+d.x*reach+d.y*3*scale,hand.y+d.y*reach-d.x*3*scale);ctx.closePath();ctx.fill();}
 function heading(e,track,t,blend){const target=e.facing||0,cache=track.cache;if(!blend)return target;if(cache.heading===undefined)cache.heading=target;const attackAge=t-(e.lastStrike??-10);if(attackAge>=0&&attackAge<.65)cache.heading=target;else cache.heading+=Math.atan2(Math.sin(target-cache.heading),Math.cos(target-cache.heading))*(1-Math.exp(-18*track.delta));return cache.heading;}
 r.YFHeroRender={ready,drawEquipment:gear,drawSpear:spear,draw(ctx,e,options){if(!ready()||e.kind!=='player')return false;const t=options.time||0,scale=options.scale||1,track=motion(e,t,options.key||e.id),p=Animation.pose(e,t,options.previewMoving??track.walking,heading(e,track,t,options.blend)),f=p.frame,unit=Data.worldHeight/Data.standingSourceHeight*scale;
   ctx.save();ctx.translate(options.x+p.direction.x*p.lunge*scale,options.y+p.direction.y*p.lunge*scale-p.bob*scale);if(track.hurt)ctx.globalAlpha=.65+Math.sin(t*70)*.2;
   const paint=(pose,alpha)=>{const f=pose.frame;ctx.save();ctx.globalAlpha*=alpha;if(pose.flip)ctx.scale(-1,1);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';if(!r.YFRenderCache?.draw(ctx,sheet,f,-f.pivotX*unit,-f.pivotY*unit,f.w*unit,f.h*unit))ctx.drawImage(sheet,f.x,f.y,f.w,f.h,-f.pivotX*unit,-f.pivotY*unit,f.w*unit,f.h*unit);ctx.restore();};
   const cache=track.cache;if(options.blend){const poseKey=p.row+':'+p.column+':'+p.flip;if(cache.poseKey!==poseKey){cache.from=cache.pose;cache.changed=t;cache.poseKey=poseKey;}const blend=Math.max(0,Math.min(1,(t-(cache.changed??t))/.045));if(cache.from&&blend<1){paint(cache.from,1-blend);paint(p,blend);}else paint(p,1);cache.pose=p;}else paint(p,1);
   gear(ctx,e,p,scale,t);if(e.path==='spear')spear(ctx,p,scale);ctx.restore();return true;
  },state:e=>tracks.get(e.id)||null,clear(){tracks.clear();}
 };
})(typeof globalThis!=='undefined'?globalThis:this);
