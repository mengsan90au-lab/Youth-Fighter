/* Layered isometric sprite kit, soft foliage, and a detailed fallback while art loads. */
(function(r){'use strict';const kit=r.YFResidentialData.asset;let sheet=null;
 if(typeof r.Image==='function'){sheet=new r.Image();sheet.src=r.YFResidentialImage||kit.path;}
 const ready=()=>!!(sheet&&sheet.complete&&sheet.naturalWidth===kit.width&&sheet.naturalHeight===kit.height);
 function frame(name){const index=kit.frames[name];if(index===undefined)return null;const w=kit.width/kit.columns,h=kit.height/kit.rows;return {x:(index%kit.columns)*w+kit.inset,y:Math.floor(index/kit.columns)*h+kit.inset,w:w-2*kit.inset,h:h-2*kit.inset};}
 function sprite(name,x,y,w,h,v){const crop=frame(name);if(!crop||!ready())return false;const q=v.project(x+w/2,y+h/2),bottom=v.project(x+w,y+h),width=(w+h)*24*v.scale*1.08,height=width*1.08;
  v.ctx.imageSmoothingEnabled=true;v.ctx.imageSmoothingQuality='high';if(!r.YFRenderCache?.draw(v.ctx,sheet,crop,q.x-width/2,bottom.y-height*.962,width,height))v.ctx.drawImage(sheet,crop.x,crop.y,crop.w,crop.h,q.x-width/2,bottom.y-height*.962,width,height);return true;
 }
 function roof(o,v){const {ctx,project,poly}=v,{x,y,w,h}=o,z=48;
  for(let tier=0;tier<2;tier++){const inset=tier*.65,zz=z+tier*18,a=project(x-.3+inset,y-.3+inset,zz),b=project(x+w+.3-inset,y-.3+inset,zz),c=project(x+w+.3-inset,y+h+.3-inset,zz),d=project(x-.3+inset,y+h+.3-inset,zz),ridge=project(x+w*.5,y+h*.5,zz+27);
   poly([a,b,ridge],'#c66835','#e5b976');poly([b,c,ridge],'#9b472b','#dfa268');poly([d,c,ridge],'#d07b3b','#ebbd7b');poly([a,d,ridge],'#b55b31','#d9a56c');
   for(let t=.08;t<1;t+=.08){const left={x:d.x+(ridge.x-d.x)*t,y:d.y+(ridge.y-d.y)*t},right={x:c.x+(ridge.x-c.x)*t,y:c.y+(ridge.y-c.y)*t};ctx.beginPath();ctx.moveTo(left.x,left.y);ctx.lineTo(right.x,right.y);ctx.strokeStyle='#75412699';ctx.lineWidth=.7*v.scale;ctx.stroke();}
   for(const p of [a,b,c,d]){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.quadraticCurveTo(p.x+7*v.scale,p.y-3*v.scale,p.x+8*v.scale,p.y-15*v.scale);ctx.strokeStyle='#e8c47c';ctx.lineWidth=2*v.scale;ctx.stroke();}
  }
 }
 function fallback(o,v){const {x,y,w,h}=o,{box,project,poly}=v;box(x,y,w,h,5,'#b5aa8b','#827b64','#a49a80');box(x+.3,y+.3,w-.6,h-.6,37,'#946944','#514332','#806044');for(let k=.5;k<w;k+=1)box(x+k,y+h-.22,.13,.16,40,'#bd9862','#5e4931','#b08b57');box(x+w*.4,y+h-.23,w*.22,.25,27,'#302b25');roof(o,v);
  if(o.residentialSkin==='food'){box(x+.25,y+.25,w-.5,h-.5,16,'#a67f4e');const a=project(x,y,34),b=project(x+w,y,34),c=project(x+w,y+h,28),d=project(x,y+h,28);poly([a,b,c,d],'#d5a07d','#f4dfad');}
 }
 function plant(o,v){const q=v.project(o.x,o.y),{ctx,scale:s,ellipse}=v;
  if(o.kind==='banana'){ctx.strokeStyle='#6d8550';ctx.lineWidth=4*s;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x,q.y-42*s);ctx.stroke();for(let i=0;i<6;i++){const dir=i%2?1:-1,yy=q.y-(28+i*3)*s;ctx.beginPath();ctx.moveTo(q.x,yy);ctx.quadraticCurveTo(q.x+dir*22*s,yy-23*s,q.x+dir*37*s,yy-5*s);ctx.quadraticCurveTo(q.x+dir*17*s,yy-9*s,q.x,yy);ctx.fillStyle=['#7d9b49','#4e803f','#629147'][i%3];ctx.fill();}return;}
  for(let i=0;i<11;i++){const xx=q.x+Math.cos(i*2.4)*15*s,yy=q.y+Math.sin(i*2.4)*7*s-9*s;ellipse(xx,yy,9*s,7*s,i%2?'#588e42':'#729b48');if(i%2){for(let k=0;k<4;k++)ellipse(xx+Math.cos(k*1.57)*3*s,yy-6*s+Math.sin(k*1.57)*3*s,3*s,3*s,i%3?'#e6a3bb':'#ebd270');ellipse(xx,yy-6*s,1.5*s,1.5*s,'#f5df98');}}
 }
 r.YFResidentialRender={frame,ready,
  building(o,v){if(!o.residentialSkin)return false;const {ctx,p,project,text}=v;ctx.save();const width=(o.w+o.h)*24*v.scale*1.08,height=width*1.08,center=project(o.x+o.w/2,o.y+o.h/2),bottom=project(o.x+o.w,o.y+o.h),hero=project(p.x,p.y,25);const occluded=(p.x>o.x-1&&p.x<o.x+o.w+1&&p.y>o.y-4&&p.y<o.y+o.h)||(p.x+p.y<o.x+o.y+o.w+o.h&&hero.x>center.x-width/2&&hero.x<center.x+width/2&&hero.y>bottom.y-height*.962&&hero.y<bottom.y);if(occluded)ctx.globalAlpha=.42;
   if(!sprite(o.residentialSkin,o.x,o.y,o.w,o.h,v))fallback(o,v);ctx.restore();const q=project(o.x+o.w/2,o.y+o.h/2,125),labelWidth=o.name.length*5.7+18;ctx.fillStyle='#142e28df';ctx.fillRect(q.x-labelWidth/2,q.y-12,labelWidth,18);ctx.strokeStyle='#bd9e62';ctx.lineWidth=.6;ctx.strokeRect(q.x-labelWidth/2,q.y-12,labelWidth,18);text(o.name,q.x,q.y,'#ffe8b5',11);return true;
  },
  pavement(x,y,v){const a=v.project(x,y),b=v.project(x+1,y),c=v.project(x+1,y+1),d=v.project(x,y+1),{ctx,scale}=v;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.strokeStyle='#736d4a55';ctx.lineWidth=.7*scale;ctx.stroke();const mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};ctx.beginPath();ctx.moveTo(mid.x,mid.y);ctx.lineTo((c.x+d.x)/2,(c.y+d.y)/2);ctx.strokeStyle='#dfd4aa55';ctx.stroke();},
  prop(o,v){if(!o.residential)return false;const {box,project,poly,ctx,scale:s,ellipse,text}=v;
   if(o.kind==='well'){if(!sprite('well',o.x-1.5,o.y-1.5,3,3,v)){box(o.x-.7,o.y-.7,1.4,1.4,12,'#c0b38c');ellipse(project(o.x,o.y,14).x,project(o.x,o.y,14).y,10*s,5*s,'#365c59');roof({x:o.x-1,y:o.y-1,w:2,h:2},v);}const q=project(o.x,o.y,110);text('Community Well',q.x,q.y,'#f1db9c',10);return true;}
   if(['banana','flower','garden'].includes(o.kind)){plant(o,v);return true;}
   if(o.kind==='bench'){box(o.x,o.y,1.4,.45,10,'#9e7f50','#625138','#987b4d');return true;}
   const q=project(o.x,o.y,52);box(o.x,o.y,.12,.12,52,'#a88c56');if(o.kind==='banner'){poly([q,{x:q.x+17*s,y:q.y+3*s},{x:q.x+14*s,y:q.y+23*s},{x:q.x,y:q.y+19*s}],'#b35f45','#e2be75');}else{ctx.save();ctx.strokeStyle='#a88c56';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x+14*s,q.y);ctx.lineTo(q.x+14*s,q.y+7*s);ctx.stroke();ctx.globalAlpha=.16;ellipse(q.x+14*s,q.y+18*s,19*s,16*s,'#f4c363');ctx.globalAlpha=1;ellipse(q.x+14*s,q.y+18*s,6*s,9*s,'#edb763');poly([{x:q.x+7*s,y:q.y+10*s},{x:q.x+14*s,y:q.y+7*s},{x:q.x+21*s,y:q.y+10*s}],'#b28446');ctx.beginPath();ctx.moveTo(q.x+14*s,q.y+27*s);ctx.lineTo(q.x+14*s,q.y+33*s);ctx.strokeStyle='#d49c5a';ctx.stroke();ctx.restore();}return true;
  }
 };
})(typeof globalThis!=='undefined'?globalThis:this);
