/* Approved image layers and shared normalized transforms. Never changes gameplay state. */
(function(root,factory){if(typeof module==='object')module.exports=factory(require('./artwork-data.js'),require('./map-catalog.js'),require('./map-renderer.js'),root);else root.YFArt=factory(root.YFArtworkData,root.YFMaps,root.YFMapRender,root);})(typeof globalThis!=='undefined'?globalThis:this,(data,Maps,Render,root)=>{
 'use strict';
 const asset=id=>data.assets.find(a=>a.id===id),region=id=>data.regions.find(a=>a.realmId===id);
 const markers=id=>id==='world'?data.world.markers:region(id)?.markers||[];
 const marker=(assetId,id)=>markers(assetId).find(m=>m.id===id);
 const url=id=>root.YFAtlasImages?.[id]||asset(id)?.path||'';
 function fit(a,w,h){const scale=Math.min(w/a.width,h/a.height);return {x:(w-a.width*scale)/2,y:(h-a.height*scale)/2,width:a.width*scale,height:a.height*scale,scale};}
 function project(a,w,h,p,view={}){const f=fit(a,w,h),z=view.zoom||1,pan=view.pan||{x:0,y:0};return {x:(f.x+p.x*f.width-w/2)*z+w/2+pan.x,y:(f.y+p.y*f.height-h/2)*z+h/2+pan.y};}
 function inverse(a,w,h,x,y,view={}){const f=fit(a,w,h),z=view.zoom||1,pan=view.pan||{x:0,y:0};const p={x:((x-w/2-pan.x)/z+w/2-f.x)/f.width,y:((y-h/2-pan.y)/z+h/2-f.y)/f.height};return p.x>=0&&p.x<=1&&p.y>=0&&p.y<=1?p:null;}
 function centerPan(a,w,h,p,zoom=1){const f=fit(a,w,h);return {x:zoom*(w/2-f.x-p.x*f.width),y:zoom*(h/2-f.y-p.y*f.height)};}
 function hit(assetId,p){if(!p)return null;return markers(assetId).find(m=>p.x>=m.hit.x&&p.x<=m.hit.x+m.hit.w&&p.y>=m.hit.y&&p.y<=m.hit.y+m.hit.h)||null;}
 function render(assetId,current,selected){const a=asset(assetId),esc=Render.esc;if(!a)return '';let body='<image href="'+esc(url(assetId))+'" width="'+a.width+'" height="'+a.height+'" preserveAspectRatio="xMidYMid meet"/>';
  for(const m of markers(assetId)){const currentHere=assetId==='world'?Maps.map(current)?.realmId===m.id:(Maps.map(current)?.cityId||current)===m.id;const active=m.id===selected;const attr=assetId==='world'?'data-realm':'data-location';const availability=assetId==='world'?'Open country map':Maps.map(m.id)?.playable?'Playable location':'Coming soon';
   body+='<g class="image-hotspot'+(active?' selected':'')+(currentHere?' current':'')+'" '+attr+'="'+esc(m.id)+'" role="button" tabindex="0" aria-label="'+esc(m.name+' - '+availability)+'"><title>'+esc(m.name+' - '+availability)+'</title><rect x="'+m.hit.x*a.width+'" y="'+m.hit.y*a.height+'" width="'+m.hit.w*a.width+'" height="'+m.hit.h*a.height+'" rx="6" class="image-hitbox"/>';
   if(currentHere||active)body+='<circle cx="'+m.x*a.width+'" cy="'+m.y*a.height+'" r="'+a.width*.012+'" class="image-locator"/>';
   if(!m.baked)body+='<circle cx="'+m.x*a.width+'" cy="'+m.y*a.height+'" r="'+a.width*.006+'" fill="#c88c63" stroke="#f0dba8" stroke-width="2"/><text x="'+(m.x+.012)*a.width+'" y="'+(m.y+.009)*a.height+'" class="added-map-label" style="font-size:'+a.width*.012+'px">'+esc(m.name)+'</text>';
   body+='</g>';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+a.width+' '+a.height+'" preserveAspectRatio="xMidYMid meet" class="atlas-svg approved-map" aria-label="'+esc(assetId==='world'?'Youth Fighter world map':Maps.realm(assetId).name+' country map')+'">'+body+'</svg>';
 }
 // Keep accurate local-map and compact-map renderers intact.
 Render.world=(current,selected)=>render('world',current,selected);
 Render.region=(id,current,selected)=>render(id,current,selected);
 return {data,asset,region,markers,marker,url,fit,project,inverse,centerPan,hit,render};
});
