/* Shared, authoritative game rules. Runs in Node and in the offline browser. */
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.YF=factory();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const nav=typeof module==='object'?require('./navigation.js'):globalThis.YFNav;
 const maps=typeof module==='object'?require('./map-catalog.js'):globalThis.YFMaps;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 const city=typeof module==='object'?require('./city-system.js'):globalThis.YFCity;
 const movement=typeof module==='object'?require('./movement-styles.js'):globalThis.YFMovement;
 const combatData=typeof module==='object'?require('./combat-data.js'):globalThis.YFCombatData;
 const combat=typeof module==='object'?require('./combat.js'):globalThis.YFCombat;
 const commands=typeof module==='object'?require('./command-contract.js'):globalThis.YFCommands;
 const CITY=18, SIZE=48;
 const obstacles=[{x:5,y:5,w:6,h:5},{x:5,y:14,w:5,h:4},{x:14,y:5,w:4,h:5},{x:2,y:22,w:5,h:4}];
 const skills=combatData.forPath('fist'),spearSkills=combatData.forPath('spear');
 function skillsFor(p){return p.path==='spear'?spearSkills:skills;}
 function insideCity(e){return e.mapId?maps.map(e.mapId)?.danger===false:e.x<CITY&&e.y<20;}
 function blocked(x,y,mapId='sovann-city'){return maps.blocked(mapId,x,y);}
 function move(e,x,y){const m=maps.map(e.mapId||'sovann-city'),b=m.bounds;x=clamp(x,b.minX,b.maxX);y=clamp(y,b.minY,b.maxY);const steps=Math.max(1,Math.ceil(Math.hypot(x-e.x,y-e.y)/.08)),dx=(x-e.x)/steps,dy=(y-e.y)/steps;for(let i=0;i<steps;i++){if(!blocked(e.x+dx,e.y,m.id))e.x+=dx;if(!blocked(e.x,e.y+dy,m.id))e.y+=dy;}}
 function sameMap(a,b){return a.mapId===b.mapId;}
 function enterMap(w,p,mapId,x,y){if(!maps.map(mapId)?.playable||blocked(x,y,mapId))return false;combat.clear(w,p,'travel');p.mapId=mapId;p.x=x;p.y=y;p.aim=null;p.route=[];p.input={x:0,y:0};p.target=null;p.travelLock=.8;movement.reset(p);event(w,maps.map(mapId).danger?'Entered '+maps.map(mapId).name+' • OPEN PvP / no city protection':'Entered '+maps.map(mapId).name+' • city law applies',x,y,'travel',mapId);}
 function useExit(w,p,exitId){if(p.jail>0||p.travelLock>0)return false;const exit=maps.map(p.mapId)?.exits.find(e=>e.id===exitId);if(!exit||dist(p,exit)>exit.radius||p.level<exit.minLevel||!maps.map(exit.toMap)?.playable)return false;enterMap(w,p,exit.toMap,exit.spawnX,exit.spawnY);return true;}
 function createWorld(){const w={time:0,tick:0,actionSeq:0,players:Object.create(null),entities:[],events:[],seq:0};
  for(let i=0;i<12;i++)w.entities.push({id:'wolf'+i,kind:'wolf',name:i>8?'Ancient prowler':'Forest prowler',x:24+(i%4)*5,y:8+Math.floor(i/4)*11,hp:i>8?95:65,maxHp:i>8?95:65,homeX:24+(i%4)*5,homeY:8+Math.floor(i/4)*11,cd:0,respawn:0});
  w.entities.push({id:'bandit',kind:'bandit',name:'Sok • wanted outlaw',x:29,y:27,hp:150,maxHp:150,homeX:29,homeY:27,cd:0,respawn:0});
  for(let i=0;i<3;i++)w.entities.push({id:'guard'+i,kind:'guard',name:'Royal guard',x:12+i*2,y:12,hp:250,maxHp:250,homeX:12+i*2,homeY:12,cd:0});
  w.entities.push({id:'civilian',kind:'civilian',name:'City resident',x:13,y:16,hp:60,maxHp:60,homeX:13,homeY:16,respawn:0});
  for(const e of w.entities)e.mapId=['wolf','bandit'].includes(e.kind)?'bamboo-grove':'sovann-city';
  for(const n of maps.map('sovann-city').pois.filter(n=>['tonic-vendor','naga-trainer','government-office','bank','trade-guild'].includes(n.id)))w.entities.push({id:n.id,kind:'civilian',name:n.name,service:n.category,x:n.x,y:n.y,homeX:n.x,homeY:n.y,hp:60,maxHp:60,respawn:0,mapId:'sovann-city'});
  city.spawn(w);return w;
 }
 function event(w,text,x,y,kind='info',mapId=null){w.events.push({id:++w.seq,text,x,y,kind,mapId});if(w.events.length>40)w.events.shift();}
 function addPlayer(w,id,name='Young fighter'){const p={id,kind:'player',name:String(name).replace(/[<>\u0000-\u001f]/g,'').slice(0,20)||'Young fighter',x:12,y:12,hp:120,maxHp:120,energy:100,gold:0,xp:0,level:1,kills:0,quest:false,questDone:false,bounty:false,bountyDone:false,wanted:0,jail:0,cd:[0,0,0],potions:3,path:'fist',route:[],lastStrike:-10,strike:0,target:null,aim:null,input:{x:0,y:0},facing:0,mapId:'sovann-city',travelLock:0};combat.init(p);p.movementStyle='walk';p.effectiveMovementStyle='walk';movement.reset(p);city.init(p);w.players[id]=p;event(w,p.name+' entered Golden Naga Basin',p.x,p.y);return p;}
 function entities(w,mapId=null){return [...Object.values(w.players),...w.entities].filter(e=>!mapId||e.mapId===mapId);}
 function target(w,id){return Object.hasOwn(w.players,id)?w.players[id]:w.entities.find(e=>e.id===id);}
 function reward(w,p,xp,gold){p.xp+=xp;p.gold+=gold;while(p.xp>=p.level*100){p.xp-=p.level*100;p.level++;p.maxHp+=15;p.hp=p.maxHp;event(w,'Level '+p.level+' • strength awakened',p.x,p.y,'gold');}}
 function jail(w,p){combat.clear(w,p,'arrest');p.mapId='sovann-city';p.jail=12;p.wanted=0;p.hp=p.maxHp;p.x=4;p.y=24;p.aim=null;p.route=[];p.input={x:0,y:0};movement.reset(p);event(w,'Arrested • 12 seconds in custody',p.x,p.y,'crime');}
 function command(w,id,a){const p=Object.hasOwn(w.players,id)?w.players[id]:null;if(!p||!commands.validate(a)||p.hp<=0)return;
  if(a.type==='movement-style'){if(Object.hasOwn(movement.styles,a.style))p.movementStyle=a.style;return;}
  if(a.type==='move'){p.input={x:clamp(Number(a.x)||0,-1,1),y:clamp(Number(a.y)||0,-1,1)};p.aim=null;p.route=[];return;}
  if(p.jail>0)return;
  if(p.action&&['city-equip','city-unequip','city-rest','city-upgrade','city-repair','arrest'].includes(a.type))return;
  if(city.command(w,p,a))return;
  if(a.type==='exit'){useExit(w,p,a.id);return;}
  if(a.type==='goto'&&Number.isFinite(a.x)&&Number.isFinite(a.y)){if(a.mapId&&a.mapId!==p.mapId)return;const end={x:a.x,y:a.y};if(maps.blocked(p.mapId,end.x,end.y)){event(w,'Choose open ground on your current map.',p.x,p.y);return;}const exits=maps.map(p.mapId).exits,intended=exits.find(e=>dist(e,end)<=e.radius);p.route=nav.findPath(p,end,(x,y)=>blocked(x,y,p.mapId)||exits.some(e=>e!==intended&&Math.hypot(e.x-x,e.y-y)<e.radius+.2));p.aim=p.route.shift()||null;p.input={x:0,y:0};if(!p.aim)event(w,'Destination is blocked. Choose a road or open ground.',p.x,p.y);}
  if(a.type==='equip'&&!p.action&&['fist','spear'].includes(a.path)&&insideCity(p)&&p.wanted===0&&p.cd.every(c=>c===0)){p.path=a.path;const item=city.data.items.find(i=>i.id===p.city.equipment.weapon);if(item&&item.path!==p.path)delete p.city.equipment.weapon;combat.clear(w,p,'path-change');event(w,a.path==='spear'?'Naga Spear equipped • extended reach':'Naga Fist equipped • unarmed combat',p.x,p.y,'gold');}
  if(a.type==='buy'&&p.mapId==='sovann-city'&&insideCity(p)&&dist(p,{x:12,y:11})<5&&p.wanted===0&&p.gold>=12&&p.potions<9){p.gold-=12;p.potions++;event(w,'Tonic purchased • −12 silver',p.x,p.y,'heal');}
  if(a.type==='target'){const t=target(w,a.id);p.target=t&&sameMap(p,t)?t.id:null;}
  if(a.type==='quest'&&p.mapId==='sovann-city'&&insideCity(p)&&dist(p,{x:12,y:11})<5&&!p.questDone){p.quest=true;event(w,'Contract accepted • defeat 3 prowlers',p.x,p.y,'gold');}
  if(a.type==='bounty'&&p.mapId==='sovann-city'&&insideCity(p)&&dist(p,{x:12,y:11})<5&&!p.bountyDone){p.bounty=true;event(w,'Warrant accepted • subdue Sok, then arrest',p.x,p.y,'gold');}
  if(a.type==='claim'&&p.mapId==='sovann-city'&&insideCity(p)&&p.quest&&p.kills>=3&&dist(p,{x:12,y:11})<5){p.quest=false;p.questDone=true;reward(w,p,100,60);event(w,'Contract complete • +60 silver / +100 XP',p.x,p.y,'gold');}
  if(a.type==='heal'&&p.potions>0&&p.hp<p.maxHp){p.potions--;p.hp=Math.min(p.maxHp,p.hp+65);event(w,'+65 health',p.x,p.y,'heal');}
  if(a.type==='arrest'){const t=target(w,p.target);if(!t||!sameMap(p,t)||dist(p,t)>3)return;
   if(t.kind==='bandit'&&p.bounty&&t.hp>0&&t.hp<=35){t.hp=0;t.respawn=45;p.bounty=false;p.bountyDone=true;reward(w,p,150,100);event(w,'Outlaw arrested • +100 silver',p.x,p.y,'gold');}
   else if(t.kind==='player'&&t.id!==id&&t.wanted>0&&t.hp<=t.maxHp*.3){jail(w,t);reward(w,p,70,50);event(w,'Wanted fighter arrested • +50 silver',p.x,p.y,'gold');}
  }
  if(a.type==='attack')combat.start(w,p,a,combatHooks);
 }
 function eligible(w,p,t,pvp){return !!(t&&t.id!==p.id&&t.hp>0&&sameMap(p,t)&&!(t.jail>0)&&
  (!['civilian','guard','player'].includes(t.kind)||t.kind==='player'&&!insideCity(t)||pvp||t.wanted>0||city.duel(p,t,w.time)));}
 function resolveHit(w,p,v,s,a,ordinal,scale){
  combat.emit(w,p,a,'hit',{targetId:v.id,hitOrdinal:ordinal});
  const sparring=city.duel(p,v,w.time),damage=Math.max(1,s.damage*scale+(p.level-1)*3+city.bonus(p,'attack')-city.bonus(v,'defence'));city.hit(p,v);v.hp=Math.max(sparring?1:0,v.hp-damage);if(sparring&&v.hp<=1){p.duel=null;v.duel=null;event(w,'Sparring complete - no crime or death penalty',p.x,p.y,'city',p.mapId);}event(w,'−'+damage,v.x,v.y,s.index===2?'burst':'hit');
   if(insideCity(v)&&['civilian','guard','player'].includes(v.kind)&&!(v.wanted>0)&&!sparring){p.wanted+=v.hp===0?3:1;event(w,v.hp===0?'City killing • murder warrant issued':'City assault • guards alerted',p.x,p.y,'crime');}
   if(v.hp===0){if(v.kind==='wolf'){p.kills++;reward(w,p,25,8);v.respawn=18;}if(v.kind==='bandit'){reward(w,p,40,15);v.respawn=25;event(w,'Outlaw defeated • arrest requires a living target',p.x,p.y);}
    if(v.kind==='civilian'||v.kind==='guard')v.respawn=20;if(v.kind==='player'){combat.clear(w,v,'defeat');if(v.wanted>0)jail(w,v);else{v.mapId='sovann-city';v.hp=v.maxHp;v.x=12;v.y=12;v.aim=null;v.route=[];v.input={x:0,y:0};movement.reset(v);v.gold=Math.max(0,v.gold-10);event(w,'Defeated • returned to the city',v.x,v.y);}}
   }
 }
 const combatHooks={target,entities,blocked,eligible,hit:resolveHit};
 function step(w,dt){if(!Number.isFinite(dt)||dt<=0)return;dt=clamp(dt,0,.1);w.tick=(w.tick||0)+1;const end=w.time+dt;
  while(w.time<end-combat.EPS){const next=Math.min(end,combat.boundary(w)),slice=next-w.time;stepSlice(w,slice);}
 }
 function stepSlice(w,dt){w.time+=dt;city.tick(w,dt,move);
  for(const p of Object.values(w.players)){
   p.travelLock=Math.max(0,(p.travelLock||0)-dt);
   p.cd=p.cd.map(c=>Math.max(0,c-dt));p.energy=Math.min(100,p.energy+dt*12);
   if(p.jail>0){p.jail=Math.max(0,p.jail-dt);if(p.jail===0){p.x=12;p.y=12;p.mapId='sovann-city';event(w,'Released from custody',p.x,p.y);}continue;}
   if(p.action){p.currentSpeed=0;p.groundSpeed=0;p.movementLockReason='Combat commitment';}else movement.tick(w,p,dt,move);
   if(insideCity(p)&&p.wanted===0)p.hp=Math.min(p.maxHp,p.hp+dt*3);
   for(const exit of maps.map(p.mapId).exits)if(useExit(w,p,exit.id))break;
  }
  for(const p of Object.values(w.players))combat.update(w,p,combatHooks);
  for(const e of w.entities){if(e.hp<=0){e.respawn-=dt;if(e.respawn<=0){e.hp=e.maxHp;e.x=e.homeX;e.y=e.homeY;}continue;}e.cd=Math.max(0,e.cd-dt);if(e.kind==='civilian'||e.kind==='training')continue;
   const candidates=Object.values(w.players).filter(p=>sameMap(p,e)&&p.jail<=0&&(e.kind==='guard'?p.wanted>0&&insideCity(p):!insideCity(p)));
   candidates.sort((a,b)=>dist(a,e)-dist(b,e));const p=candidates[0],range=e.kind==='guard'?20:7;
   if(p&&dist(p,e)<range){if(dist(p,e)>1.5){const d=dist(p,e);if(e.cityNpc&&e.kind==='guard'){
     if(!e.pursuit||w.time>=(e.repathAt||0)){e.pursuit=nav.findPath(e,p,(x,y)=>blocked(x,y,e.mapId));e.repathAt=w.time+.7;}
     if(e.pursuit[0]&&dist(e,e.pursuit[0])<.2)e.pursuit.shift();const goal=e.pursuit[0]||p,dd=dist(e,goal);if(dd>.01){const stride=Math.min(dd,dt*5.8);move(e,e.x+(goal.x-e.x)/dd*stride,e.y+(goal.y-e.y)/dd*stride);}
    }else move(e,e.x+(p.x-e.x)/d*dt*(e.kind==='guard'?5.8:2.7),e.y+(p.y-e.y)/d*dt*(e.kind==='guard'?5.8:2.7));}
    else if(e.cd===0){e.cd=1.2;p.hp-=Math.max(1,(e.kind==='guard'?24:9)-city.bonus(p,'defence'));event(w,'−'+(e.kind==='guard'?24:9),p.x,p.y,'hurt');if(p.hp<=0){combat.clear(w,p,'defeat');if(p.wanted>0)jail(w,p);else{p.mapId='sovann-city';p.hp=p.maxHp;p.x=12;p.y=12;p.aim=null;p.input={x:0,y:0};p.route=[];movement.reset(p);p.gold=Math.max(0,p.gold-10);event(w,'Defeated • returned to city (−10 silver)',p.x,p.y,'crime');}}}
   }else if(dist(e,{x:e.homeX,y:e.homeY})>.5){const d=dist(e,{x:e.homeX,y:e.homeY});move(e,e.x+(e.homeX-e.x)/d*dt,e.y+(e.homeY-e.y)/d*dt);}
  }
 }
 return {createWorld,addPlayer,command,step,insideCity,blocked,obstacles,skills,spearSkills,skillsFor,entities,target,dist,enterMap,useExit,CITY,SIZE};
});
