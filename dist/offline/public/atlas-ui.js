/* Image-backed atlas. All navigation is read-only; only explicit walk sends gameplay input. */
(function(root){'use strict';
 const el=s=>document.querySelector(s),esc=s=>YFMapRender.esc(s);
 root.YouthAtlasUI=class{
  constructor(options){
   Object.assign(this,options);this.state=new YFAtlas.Controller();this.dialog=el('#atlas');this.viewport=el('#atlasViewport');this.drag=null;this.highlight=null;
   this.dialog.addEventListener('click',e=>{
    const b=e.target.closest('[data-realm],[data-location],[data-poi],[data-atlas]');if(!b)return;const d=b.dataset;this.highlight=null;
    if(d.realm)this.state.region(d.realm);
    if(d.location)this.state.location(d.location);
    if(d.poi)this.state.select(d.poi);
    const action=d.atlas;
    if(action==='test-enable'){if(this.enableTesting?.())this.render();return;}
    if(action==='test-enter'){if(this.testEnter?.(this.state.mapId))this.close();return;}
    if(action==='close'){this.close();return;}
    if(action==='back'){this.back();return;}
    if(action==='home')this.state.home();
    if(action==='local'){this.state.local();this.state.resetView();}
    if(action==='city'){this.state.city(YFMaps.map(this.state.mapId)?.cityId||this.state.mapId);}
    if(action==='details'){this.state.details();this.state.resetView();}
    if(action==='zoom-in'||action==='zoom-out'){this.zoomBy(action==='zoom-in'?.2:-.2);return;}
    if(action==='reset')this.state.resetView();
    if(action==='walk'){this.walk();return;}
    this.render();if(d.location||d.poi)this.centerMarker(d.location||d.poi);
   });
   this.dialog.addEventListener('keydown',e=>{
    if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-realm],[data-location],[data-poi]')){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}
   });
   this.dialog.addEventListener('cancel',e=>{e.preventDefault();if(YFAtlas.typing(document.activeElement)){document.activeElement.blur();return;}this.back();});
   this.dialog.addEventListener('input',e=>{
    if(e.target.id!=='atlasSearch')return;this.state.query=e.target.value;this.renderResults();
    const first=this.matches()[0];this.highlight=this.state.query.trim()&&first?first.id:null;this.renderArt();
    if(this.highlight)this.centerMarker(this.highlight,false);
   });
   this.dialog.addEventListener('pointerdown',e=>{
    if(e.target.closest('[role="button"],button,input'))return;
    if(e.target.closest('#atlasViewport')){this.drag={x:e.clientX,y:e.clientY,pan:{...this.state.pan}};this.viewport.setPointerCapture?.(e.pointerId);}
   });
   this.dialog.addEventListener('pointermove',e=>{if(!this.drag)return;this.state.pan={x:this.drag.pan.x+e.clientX-this.drag.x,y:this.drag.pan.y+e.clientY-this.drag.y};this.transform();});
   for(const event of ['pointerup','pointercancel'])this.dialog.addEventListener(event,()=>this.drag=null);
   this.dialog.addEventListener('wheel',e=>{
    if(!e.target.closest('#atlasViewport'))return;e.preventDefault();const box=this.viewport.getBoundingClientRect();this.zoomBy(e.deltaY<0?.15:-.15,{x:e.clientX-box.left,y:e.clientY-box.top});
   },{passive:false});
  }
  open(){this.stop();this.state.home();this.highlight=null;if(!this.dialog.open)this.dialog.showModal();this.render();}
  toggle(){if(this.dialog.open)this.close();else this.open();}
  close(){this.drag=null;this.state.close();this.dialog.close();}
  back(){this.state.back();this.highlight=null;if(!this.state.open)this.close();else this.render();}
  inspect(id){this.stop();this.state.location(id);this.state.local();this.highlight=null;if(!this.dialog.open)this.dialog.showModal();this.render();}
  asset(){return ['local','city'].includes(this.state.level)?{id:'local',width:1000,height:660}:YFArt.asset(this.state.level==='world'?'world':this.state.realmId);}
  matches(){const s=this.state,q=s.query.trim().toLowerCase();
   if(s.level==='world')return YFMaps.data.realms.filter(r=>(r.name+' '+r.tradition).toLowerCase().includes(q));
   if(s.level==='city')return YFMaps.districts(s.mapId).filter(m=>m.name.toLowerCase().includes(q));
   if(s.level==='region')return YFMaps.region(s.realmId).locationIds.map(YFMaps.map).filter(m=>(m.name+' '+m.kind+' '+(m.aliases||[]).join(' ')).toLowerCase().includes(q));
   if(s.level==='location')return YFMaps.region(s.realmId).locationIds.map(YFMaps.map).filter(m=>(m.name+' '+m.kind).toLowerCase().includes(q));
   return YFMaps.find(s.mapId,q).map(n=>this.livePoint(n));
  }
  renderArt(){const s=this.state,p=this.player(),m=YFMaps.map(s.mapId);el('#atlasArt').innerHTML=s.level==='city'?YFCityRender.overview(p.mapId,this.highlight):s.level==='world'?YFMapRender.world(p.mapId,this.highlight):s.level==='local'?YFMapRender.local(m.id,this.highlight||s.poiId):YFMapRender.region(s.realmId,p.mapId,this.highlight||s.mapId);}
  render(){if(!this.state.open){this.close();return;}const s=this.state,m=YFMaps.map(s.mapId),realm=YFMaps.realm(s.realmId);
   el('#atlasTitle').textContent=m?m.name:realm?realm.name:'The Eight Realms';
   el('#atlasSubtitle').textContent=s.level==='world'?'Choose a country pin to open its atlas.':m?(m.testArea?'TEST AREA - unfinished content':m.playable?(m.danger?'OPEN PvP - recommended level '+m.minLevel+'-'+m.maxLevel:'LAWFUL CITY - city law applies'):'LOCKED / COMING SOON'):realm.description;
   el('#atlasBreadcrumb').textContent='World'+(realm?' / '+realm.name:'')+(m?' / '+m.name:'')+(s.level==='city'?' / Districts':s.level==='local'?' / Local Mini-Map':m?' / Location details':'');
   el('#atlasSearch').value=s.query;this.renderArt();this.renderResults();this.renderInfo();this.transform();this.update();
  }
  renderResults(){const s=this.state;let html='';
   for(const item of this.matches()){
    if(s.level==='world')html+='<button data-realm="'+item.id+'"><i style="background:'+item.color+'"></i><span>'+esc(item.name)+'<small>'+esc(item.tradition)+' - '+(item.playable?'Playable region':'Atlas only')+'</small></span></button>';
    else if(s.level==='local')html+='<button data-poi="'+item.id+'" class="'+(item.id===s.poiId?'selected':'')+'"><span>'+esc(item.name)+'<small>'+esc(item.category)+' - '+item.x+', '+item.y+'</small></span></button>';
    else{const placed=!!YFArt.marker(s.realmId,item.id);html+='<button data-location="'+item.id+'" class="'+(item.id===s.mapId?'selected':'')+'"><span>'+esc(item.name)+'<small>'+esc(item.settlementRank||item.kind)+' - '+(item.playable?'Playable':placed?'Coming soon':'Future location - list only')+'</small></span></button>';}
   }
   el('#atlasResults').innerHTML=html||'<p class="atlas-empty">No matching locations or services.</p>';
  }
  renderInfo(){const s=this.state,p=this.player(),m=YFMaps.map(s.mapId),realm=YFMaps.realm(s.realmId);
   let html='<div class="atlas-kicker">YOUR LOCATION</div><h3>'+esc(YFMaps.map(p.mapId).name)+'</h3><p>Inspecting the atlas does not move your fighter. Travel uses real gateways.</p>';
   if(m){const point=this.livePoint(YFMaps.points(m.id).find(n=>n.id===s.poiId));html='<div class="atlas-kicker">'+(m.playable?'LOCATION DETAILS':'LOCKED LOCATION')+'</div><h3>'+esc(m.name)+'</h3><p>'+esc(m.description)+'</p><p class="atlas-status '+(m.danger?'danger':'')+'">'+(m.playable?(m.danger?'Open PvP - enter at your own risk.':'City law applies. Unlawful combat has consequences.'):esc(m.lockReason))+'</p>';
    html+='<p>'+esc(m.settlementRank||m.kind)+' - recommended level '+m.minLevel+'-'+m.maxLevel+'</p>';
    if(m.id==='sovann-city'||m.cityId)html+='<button data-atlas="city">Explore Sovann City districts</button>';
    if(m.playable)html+='<div class="atlas-tabs"><button data-atlas="details">Location details</button><button data-atlas="local">Open Local Mini-Map</button></div>';
    if(point){const plan=s.plan(p,point);html+='<h3>'+esc(point.name)+'</h3><p>'+esc(point.category)+' - X '+point.x+' / Y '+point.y+'</p>';
     if(point.available===false)html+='<p class="atlas-status">Coming soon - this service is not active.</p>';
     else if(plan.kind==='walk')html+='<button class="atlas-primary" data-atlas="walk">Walk to selected location</button>';
     else if(plan.kind==='exit')html+='<p class="atlas-route">'+esc(plan.message)+'. Continue to your destination after entering that map.</p><button class="atlas-primary" data-atlas="walk">Walk to the connecting exit</button>';
    }else if(m.playable&&m.id!==p.mapId){const route=YFMaps.travelRoute(p.mapId,m.id);html+='<p class="atlas-route">'+(route?.length?'Travel route: '+route.map(e=>esc(e.name)).join(' -> '):'No playable connection is available.')+'</p>';}
    if(!m.cityDistrict&&!YFArt.marker(s.realmId,m.id))html+='<p class="atlas-note">This future location has no surveyed position on the approved country artwork.</p>';
   }else if(realm)html+='<h3>'+esc(realm.name)+'</h3><p>'+esc(realm.description)+'</p><p>'+(realm.id==='golden-naga'?'Five Sovann City wards connect through Old Sovann Square. South Gate Ward also leads to Bamboo Grove.':YFTestMaps.active?'Solo test layouts are available through explicit test travel.':'Country artwork is inspectable; gameplay here is coming soon.')+'</p>';
   if(this.canTest?.()){html+='<hr><p class="atlas-status">'+(YFTestMaps.active?'TEST MODE ACTIVE - separate test save. Reload to return to normal mode.':'SOLO MAP TESTING - unlock all locations for this session.')+'</p>';if(!YFTestMaps.active)html+='<button data-atlas="test-enable">Unlock ALL maps for testing</button>';else if(m)html+='<p>'+(m.testArea?'Generated test terrain: final scenery, NPC services and quests are unfinished.':'Original playable gameplay area.')+'</p><button data-atlas="test-enter">TEST: Travel here</button>'; }
   el('#atlasInfo').innerHTML=html;
  }
  livePoint(n){if(!n)return n;const e=this.world().entities.find(e=>e.id===n.id&&e.mapId===this.state.mapId&&e.hp>0);return e?{...n,x:e.x,y:e.y}:n;}
  centerMarker(id,increase=true){const s=this.state,a=this.asset();if(!a)return;let point;
   if(s.level==='local'){const n=this.livePoint(YFMaps.points(s.mapId).find(p=>p.id===id));if(n){const q=YFMapRender.projection(YFMaps.map(s.mapId)).point(n);point={x:q.x/1000,y:q.y/660};}}
   else if(s.level==='city')point=YFCityRender.point(id);else point=YFArt.marker(s.level==='world'?'world':s.realmId,id);
   if(!point)return;if(increase)s.zoom=Math.max(1.35,s.zoom);const box=this.viewport.getBoundingClientRect();s.pan=YFArt.centerPan(a,box.width,box.height,point,s.zoom);this.transform();
  }
  zoomBy(delta,anchor){const s=this.state,a=this.asset(),box=this.viewport.getBoundingClientRect();if(!a)return;const at=anchor||{x:box.width/2,y:box.height/2};const point=YFArt.inverse(a,box.width,box.height,at.x,at.y,s);s.zoom=Math.max(.7,Math.min(3.5,s.zoom+delta));
   if(point){const projected=YFArt.project(a,box.width,box.height,point,s);s.pan.x+=at.x-projected.x;s.pan.y+=at.y-projected.y;}this.transform();
  }
  walk(){const s=this.state,n=this.livePoint(YFMaps.points(s.mapId).find(n=>n.id===s.poiId)),plan=s.plan(this.player(),n);if(plan.kind==='walk'||plan.kind==='exit'){this.send({type:'goto',x:plan.x,y:plan.y,mapId:this.player().mapId});this.announce(plan.kind==='exit'?plan.message:'Following a route to '+n.name);this.close();}else this.announce(plan.message);}
  transform(){const s=this.state;el('#atlasArt').style.transform='translate('+s.pan.x+'px,'+s.pan.y+'px) scale('+s.zoom+')';el('#atlasZoom').textContent=Math.round(s.zoom*100)+'%';}
  update(){if(!this.dialog.open)return;const p=this.player(),s=this.state,m=YFMaps.map(s.mapId);el('#atlasPlayerLocation').textContent=YFMaps.map(p.mapId).name+' - X '+p.x.toFixed(1)+' / Y '+p.y.toFixed(1);
   const live=el('#atlasLive');if(live&&m&&s.level==='local')live.innerHTML=YFMapRender.live(m.id,p,this.world(),s.poiId);
   el('#atlasLocalCoords').textContent=s.level==='local'?(p.mapId===m.id?'YOU ARE HERE - X '+p.x.toFixed(1)+' / Y '+p.y.toFixed(1):'Distant local map - fighter remains in '+YFMaps.map(p.mapId).name):'Illustrated navigation view - select a location for details. Browsing never teleports.';
  }
 };
})(typeof globalThis!=='undefined'?globalThis:this);
