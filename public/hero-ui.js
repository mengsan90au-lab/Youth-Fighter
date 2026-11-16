/* Live appearance preview. Turning the preview never changes the gameplay fighter. */
(function(r){'use strict';const $=s=>document.querySelector(s);
 r.YouthHeroUI=class{
  constructor(options){Object.assign(this,options);this.dialog=$('#heroAppearance');this.angle=Math.PI/4;this.dialog.addEventListener('click',e=>{const b=e.target.closest('[data-hero]');if(!b)return;if(b.dataset.hero==='close'){this.close();return;}this.angle+=b.dataset.hero==='left'?Math.PI/4:-Math.PI/4;this.update();});this.dialog.addEventListener('cancel',e=>{e.preventDefault();this.close();});}
  open(){this.stop();if(!this.dialog.open)this.dialog.showModal();this.update();}
  close(){this.dialog.close();}
  update(){if(!this.dialog.open)return;const {player:p,world}=this.state(),ctx=$('#heroPreview').getContext('2d');ctx.clearRect(0,0,260,320);ctx.fillStyle='#192e2a';ctx.fillRect(0,0,260,320);ctx.fillStyle='#071a17';ctx.beginPath();ctx.ellipse(130,285,44,12,0,0,Math.PI*2);ctx.fill();
   if(!r.YFHeroRender.draw(ctx,{...p,facing:this.angle,lastStrike:-10},{x:130,y:285,scale:3,time:world.time,key:'appearance:'+p.id,previewMoving:false})){ctx.fillStyle='#d4c69c';ctx.font='14px sans-serif';ctx.fillText('Appearance artwork is loading...',25,160);}
   $('#heroAppearanceName').textContent=p.name+' · '+(p.path==='spear'?'Naga Spear':'Naga Fist');$('#heroAppearanceEquipment').textContent=Object.entries(p.city?.equipment||{}).map(([slot,id])=>slot+': '+(r.YFCityData.items.find(i=>i.id===id)?.name||id)).join(' · ')||'Golden Naga sect outfit · no optional equipment equipped';
  }
 };
})(typeof globalThis!=='undefined'?globalThis:this);
