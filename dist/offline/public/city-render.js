/* Original procedural isometric architecture: real objects with matching footprints. */
(function(r){'use strict';r.YFCityRender={
 road(area,x,y){return Math.abs(x-20)<3&&Math.abs(y-20)<3||area.roads.some(line=>line.slice(1).some((b,i)=>{const a=line[i],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-a.x-t*dx,y-a.y-t*dy)<1.25;}));},
 building(o,view){if(o.residentialSkin&&r.YFResidentialRender?.building(o,view))return;const {box,project,poly,text,ellipse,ctx,scale,p}=view,{x,y,w,h}=o;
  const stall=o.style==='stall',tower=o.style==='tower',temple=o.style==='temple',high=stall?19:tower?75:temple?58:38;
  const near=p.x>x-1&&p.x<x+w+1&&p.y>y-3&&p.y<y+h;
  ctx.save();if(near)ctx.globalAlpha=.48;
  box(x-.12,y-.12,w+.24,h+.24,4,'#aaa086','#746b56','#928369');
  if(stall){box(x+.2,y+.2,w-.4,h-.4,13,'#927b55','#5b5a42','#847354');for(const a of [[x,y],[x+w,y+h]])box(a[0],a[1],.1,.1,27,'#bba273');}
  else{box(x+.1,y+.1,w-.2,h-.2,high,o.color||'#ae9577','#625f50',o.style==='warehouse'?'#7f765f':'#a18b6e');const doorX=x+w*.42;box(doorX,y+h-.18,w*.25,.2,high*.7,'#303c35','#26372f','#344238');
   for(let q=.7;q<w-.4;q+=1.6){box(x+q,y+h-.16,.45,.2,high*.65,'#d6bc82','#474d3e','#574f3f');}
  }
  const roof=high+8,peak=project(x+w*.5,y+h*.5,roof+(temple?38:tower?24:stall?5:24));
  const a=project(x-.35,y-.35,roof),b=project(x+w+.35,y-.35,roof),c=project(x+w+.35,y+h+.35,roof),d=project(x-.35,y+h+.35,roof);
  const colors=stall?[o.color||'#bb8761','#94684e','#c69e6f']:temple?['#b29b57','#78683d','#c6aa66']:['#aa785a','#674f42','#bd9370'];
  poly([a,b,peak],colors[0],'#dec29a');poly([b,c,peak],colors[1],'#d4b187');poly([c,d,peak],colors[2],'#cfa67c');poly([d,a,peak],colors[0],'#d9b48a');
  if(temple||tower){const tip=project(x+w*.5,y+h*.5,roof+(temple?55:38));ctx.strokeStyle='#dbc47e';ctx.lineWidth=2*scale;ctx.beginPath();ctx.moveTo(peak.x,peak.y);ctx.lineTo(tip.x,tip.y);ctx.stroke();ellipse(tip.x,tip.y,2*scale,4*scale,'#e0c98a');}
  if(o.style==='shop'){const awn=[project(x-.1,y+h,24),project(x+w+.1,y+h,24),project(x+w+.1,y+h+1,17),project(x-.1,y+h+1,17)];poly(awn,o.color||'#a76553','#d4ae7a');}
  ctx.restore();const sign=project(x+w/2,y+h,stall?35:high+47);text(o.name,sign.x,sign.y,'#eddbb2',stall?8:9);
 },
 prop(o,view){if(o.residential&&r.YFResidentialRender?.prop(o,view))return;const {box,project,poly,ellipse,text,tree}=view;const q=project(o.x,o.y);if(o.kind==='palm'){tree(o.x,o.y,.65);return;}if(o.kind==='well'){box(o.x-.5,o.y-.5,1,1,10,'#9c9a7a');ellipse(q.x,q.y-11,8,4,'#305e5c');return;}if(o.kind==='boat'){poly([project(o.x-1,o.y),project(o.x,o.y-2),project(o.x+1,o.y),project(o.x,o.y+2)],'#8b7051','#c4ad7b');return;}if(o.kind==='garden'){for(let i=0;i<4;i++)ellipse(q.x+i*5,q.y-i*2,7,4,'#5a8050');return;}if(o.kind==='dock'){box(o.x,o.y,1.6,4,3,'#8a795c');return;}if(o.kind==='cart'){box(o.x,o.y,2,1.2,12,'#8a7054');return;}box(o.x,o.y,.12,.12,34,'#a99667');const top=project(o.x,o.y,34);poly([top,{x:top.x+15,y:top.y+3},{x:top.x+12,y:top.y+14},{x:top.x,y:top.y+11}],o.kind==='banner'?'#b87c59':'#d2ad68');},
 point(id){const points={'sovann-market-ward':[500,310],'sovann-temple-ward':[500,110],'sovann-canal-ward':[800,310],'sovann-residential-ward':[200,310],'sovann-south-gate-ward':[500,535]};const p=points[id];return p?{x:p[0]/1000,y:p[1]/660}:null;},overview(current,selected){const esc=r.YFMapRender.esc,places=[['sovann-market-ward',500,310],['sovann-temple-ward',500,110],['sovann-canal-ward',800,310],['sovann-residential-ward',200,310],['sovann-south-gate-ward',500,535]];let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 660" class="atlas-svg"><rect width="1000" height="660" fill="#c4c4a3"/><path d="M880 10Q690 190 890 340T740 650" fill="none" stroke="#659994" stroke-width="65"/><path d="M500 110V535M200 310H800M200 310L500 110M800 310L500 535" stroke="#efe0b1" stroke-width="26" fill="none"/>';
  for(const [id,x,y]of places){const m=r.YFMaps.map(id);s+='<g data-location="'+id+'" role="button" tabindex="0" aria-label="'+esc(m.name)+'"><rect x="'+(x-125)+'" y="'+(y-47)+'" width="250" height="94" rx="16" fill="'+(selected===id?'#8a7949':current===id?'#3a6752':'#6b785b')+'" stroke="#e8d6a2" stroke-width="3"/><text x="'+x+'" y="'+y+'" text-anchor="middle" fill="#fff2c6" font-size="21">'+esc(m.name)+'</text><text x="'+x+'" y="'+(y+27)+'" text-anchor="middle" fill="#ddd8b6" font-size="13">LAWFUL DISTRICT'+(current===id?' - YOU ARE HERE':'')+'</text></g>';}
  return s+'<text x="30" y="630" font-size="16" fill="#3e584a">Schematic district navigation — inspect freely; travel through gateways.</text></svg>';
 }
};})(typeof globalThis!=='undefined'?globalThis:this);
