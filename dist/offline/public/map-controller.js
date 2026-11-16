/* Pure navigation state. Inspecting locations never issues a gameplay command. */
(function(r,f){if(typeof module==='object')module.exports=f(require('./map-catalog.js'));else r.YFAtlas=f(r.YFMaps);})(typeof globalThis!=='undefined'?globalThis:this,Maps=>{
 class Controller{
  constructor(){this.open=false;this.level='world';this.realmId=null;this.mapId=null;this.poiId=null;this.query='';this.zoom=1;this.pan={x:0,y:0};}
  home(){this.open=true;this.level='world';this.realmId=null;this.mapId=null;this.poiId=null;this.query='';this.resetView();}
  toggle(){if(this.open)this.close();else this.home();}
  close(){this.open=false;}
  region(id){if(!Maps.realm(id))return;this.open=true;this.level='region';this.realmId=id;this.mapId=null;this.poiId=null;this.query='';this.resetView();}
  location(id){const m=Maps.map(id);if(!m)return;this.open=true;this.level='location';this.realmId=m.realmId;this.mapId=id;this.poiId=null;this.query='';this.resetView();}
  city(id='sovann-city'){if(!Maps.districts(id).length)return;this.open=true;this.level='city';this.mapId=id;this.realmId=Maps.map(id).realmId;this.poiId=null;this.query='';this.resetView();}
  details(){if(this.mapId)this.level='location';}
  local(){if(Maps.map(this.mapId)?.playable)this.level='local';}
  back(){if(this.level==='local'){this.details();this.poiId=null;this.query='';this.resetView();}else if(this.level==='location'&&Maps.map(this.mapId)?.cityId)this.city(Maps.map(this.mapId).cityId);else if(this.level==='city')this.location(this.mapId);else if(this.level==='location')this.region(this.realmId);else if(this.level==='region')this.home();else this.close();}
  resetView(){this.zoom=1;this.pan={x:0,y:0};}
  select(id){if(Maps.points(this.mapId).some(p=>p.id===id))this.poiId=id;}
  plan(player,point){const m=Maps.map(this.mapId);if(!m?.playable)return {kind:'locked',message:m?.lockReason||'Map unavailable'};if(!point||point.available===false)return {kind:'locked',message:'This service is coming soon.'};if(player.mapId===m.id)return {kind:'walk',mapId:m.id,x:point.x,y:point.y};const route=Maps.travelRoute(player.mapId,m.id);return route?.length?{kind:'exit',...route[0],message:'First use '+route[0].name}:{kind:'locked',message:'No playable travel connection yet.'};}
 }
 function typing(target){return !!target&&(target.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(target.tagName));}
 return {Controller,typing};
});
