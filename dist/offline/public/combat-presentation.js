/* Read-only combat HUD and gameplay telegraphs. Decorative reduction never hides anticipation. */
(function(r,f){if(typeof module==='object')module.exports=f(require('./combat-data.js'));else r.YFCombatView=f(r.YFCombatData);})(typeof globalThis!=='undefined'?globalThis:this,Data=>{
 'use strict';
 function status(p,time){const c=p.combo;return (p.combatState||'ready').toUpperCase()+(p.pendingAttack?' | buffered':'')+(c?' | '+(c.stage===1?(c.id==='fist.river-step-counter'?'Dodge confirmed: 2':'Hit confirmed: 2'):'Branch: 1 quick / 3 heavy')+' ('+Math.max(0,c.until-time).toFixed(1)+'s)':' | Route: hit 1, then 2, then 1 or 3');}
 function feedback(e,id){if(e.actorId!==id)return '';return e.text||({'counter-opportunity':'River-Step Counter: link 2 on the attacker','combo-opportunity':'Hit confirmed: link 2','combo-branch':'Choose 1 quick or 3 heavy','hidden-followup':'Basin Echo: quick 1 follow-up available','combo-complete':'Route complete','combo-expired':'Combo window expired',interrupted:'Interrupted: '+e.reason,miss:'Miss',dodged:'Timed dodge',guarded:'Guard confirmed',blocked:'Target guarded'})[e.result]||'';}
 function draw(ctx,entities,{project,time,scale}){for(const e of entities){if(e.hp<=0)continue;const a=e.action,t=e.telegraph;let reach=0,angle=Math.PI,color='#edc77a',facing=e.facing||0;
  if(t&&!t.resolved){reach=1.8;angle=Math.PI/3;facing=t.facing;color='#f29f78';}
  else if(a?.kind==='defense'){reach=.8;color=a.defense==='guard'?'#9edbd0':'#bfdcfa';angle=a.defense==='guard'?Math.PI*70/180:Math.PI;facing=a.facing;}
  else if(a&&(e.combatState==='startup'||Data.get(a.skillId)?.category==='ultimate'&&e.combatState==='active')){const s=Data.get(a.skillId);if(!s)continue;reach=s.range;angle=s.geometry.halfAngle||Math.PI;facing=a.facing;}
  if(e.drill&&!e.drill.resolved){reach=1.1;angle=Math.PI;color='#f29f78';}if(!reach)continue;const points=[];if(angle<Math.PI)points.push(project(e.x,e.y));const steps=32;for(let i=0;i<=steps;i++){const b=facing-angle+2*angle*i/steps;points.push(project(e.x+Math.cos(b)*reach,e.y+Math.sin(b)*reach));}
  ctx.save();ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.strokeStyle=color;ctx.fillStyle=color+'20';ctx.lineWidth=1.5*scale;ctx.fill();ctx.stroke();ctx.restore();
 }}
 return {status,feedback,draw};
});
