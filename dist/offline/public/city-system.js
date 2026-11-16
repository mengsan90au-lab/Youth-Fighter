/* Authoritative city services: commands contain intents, never prices or rewards. */
(function(r,f){if(typeof module==='object')module.exports=f(require('./city-data.js'),require('./map-catalog.js'));else r.YFCity=f(r.YFCityData,r.YFMaps);})(typeof globalThis!=='undefined'?globalThis:this,(Data,Maps)=>{
 'use strict';const items=new Map(Data.items.map(i=>[i.id,i])),npcs=new Map(Data.npcs.map(n=>[n.id,n])),quests=new Map(Data.quests.map(q=>[q.id,q]));
 const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),integer=(v,max=999999)=>Number.isInteger(v)&&v>=0&&v<=max;
 const blank=()=>({inventory:{},storage:{},bankGold:0,equipment:{},quests:{},upgrade:0,durability:100,restUntil:0,conversation:null,receipt:'',reputation:0});
 function init(p){p.city=blank();return p.city;}
 function sanitize(raw){const c=blank();if(!raw||typeof raw!=='object')return c;
  for(const key of ['inventory','storage']){let remaining=80;if(raw[key]&&typeof raw[key]==='object')for(const id of items.keys()){const n=raw[key][id];if(integer(n,80)&&n>0&&remaining>0){c[key][id]=Math.min(n,remaining);remaining-=c[key][id];}}}
  if(integer(raw.bankGold))c.bankGold=raw.bankGold;if(integer(raw.upgrade,3))c.upgrade=raw.upgrade;if(integer(raw.durability,100))c.durability=raw.durability;
  if(raw.equipment&&typeof raw.equipment==='object')for(const slot of ['weapon','armour','accessory','costume']){const id=raw.equipment[slot];if(items.get(id)?.type===slot&&c.inventory[id]>0)c.equipment[slot]=id;}
  if(raw.quests&&typeof raw.quests==='object')for(const q of quests.values()){const state=raw.quests[q.id];if(state&&['active','ready','done'].includes(state.status))c.quests[q.id]={status:state.status,count:integer(state.count,100)?state.count:0};}
  c.reputation=Object.values(c.quests).filter(q=>q.status==='done').length;return c;
 }
 function inventoryCount(c,store='inventory'){return Object.values(c[store]).reduce((a,b)=>a+b,0);}
 function equipped(c,id){return Object.values(c.equipment).includes(id);}
 function change(c,id,amount,store='inventory'){c[store][id]=(c[store][id]||0)+amount;if(!c[store][id])delete c[store][id];}
 function activeNpc(w,p,id){const n=npcs.get(id),entity=w.entities.find(e=>e.id===id&&e.mapId===p.mapId);return n&&entity?.hp>0&&n.mapId===p.mapId&&distance(p,entity)<=2.8&&p.hp>0&&p.jail<=0?n:null;}
 function say(w,p,message){p.city.receipt=message;w.events.push({id:++w.seq,text:message,x:p.x,y:p.y,mapId:p.mapId,kind:'city'});if(w.events.length>40)w.events.shift();}
 function reward(p,q){p.gold+=q.gold;p.xp+=q.xp;while(p.xp>=p.level*100){p.xp-=p.level*100;p.level++;p.maxHp=120+(p.level-1)*15;p.hp=p.maxHp;}p.city.reputation++;}
 function command(w,p,a){if(typeof a.type!=='string')return false;if(!p.city)init(p);const c=p.city;
  if(a.type==='city-use'){const item=items.get(a.item);if(!item||item.type!=='consumable'||!(c.inventory[item.id]>0)||p.jail>0||p.hp<=0)return true;if(p.hp>=p.maxHp&&p.energy>=100){say(w,p,'Health and energy are already full.');return true;}change(c,item.id,-1);p.hp=Math.min(p.maxHp,p.hp+(item.heal||0));p.energy=Math.min(100,p.energy+(item.energy||0));say(w,p,'Used '+item.name+'.');return true;}
  if(a.type==='city-equip'){const item=items.get(a.item);if(!item||!['weapon','armour','accessory','costume'].includes(item.type)||!(c.inventory[item.id]>0)||p.wanted>0||p.jail>0||Maps.map(p.mapId)?.danger!==false||p.cd.some(t=>t>0))return true;
   if(item.path&&item.path!==p.path){say(w,p,'Choose the matching Naga '+item.path+' path before equipping this weapon.');return true;}c.equipment[item.type]=item.id;say(w,p,'Equipped '+item.name+'.');return true;}
  if(a.type==='city-unequip'){if(['weapon','armour','accessory','costume'].includes(a.slot)&&p.wanted===0&&p.jail<=0&&Maps.map(p.mapId)?.danger===false&&p.cd.every(t=>t===0))delete c.equipment[a.slot];return true;}
  if(a.type==='city-duel-request'){const q=w.players[a.target];if(q&&q.id!==p.id&&q.mapId===p.mapId&&distance(p,q)<=3&&p.wanted===0&&q.wanted===0&&p.jail<=0&&q.jail<=0&&p.hp>0&&q.hp>0&&Maps.map(p.mapId)?.cityDistrict){q.city||init(q);q.city.duelOffer={from:p.id,until:w.time+20};say(w,p,'Duel invitation sent to '+q.name+'.');}return true;}
  if(a.type==='city-duel-accept'){const offer=c.duelOffer,q=offer&&w.players[offer.from];if(q&&offer.until>w.time&&q.mapId===p.mapId&&distance(p,q)<=3&&p.wanted===0&&q.wanted===0&&p.jail<=0&&q.jail<=0&&p.hp>0&&q.hp>0&&!p.duel&&!q.duel){p.duel={other:q.id,mapId:p.mapId,until:w.time+90};q.duel={other:p.id,mapId:p.mapId,until:w.time+90};say(w,p,'Consensual sparring started. Defeat stops at 1 HP.');}c.duelOffer=null;return true;}
  if(!a.type?.startsWith('city-'))return false;
  const n=activeNpc(w,p,a.npc);if(!n){say(w,p,'Approach the living NPC in your current district first.');return true;}
  if(a.type==='city-interact'){c.conversation=n.id;c.receipt='';for(const q of quests.values()){const state=c.quests[q.id];if(q.target===n.id&&q.mode!=='training'&&state?.status==='active'){state.status='ready';state.count=1;say(w,p,'Objective complete: '+q.name+'. Return to '+npcs.get(q.giver).name+'.');}}return true;}
  if(p.wanted>0){say(w,p,'Resolve your wanted status before using city services.');return true;}
  if(a.type==='city-quest-accept'){const q=quests.get(a.quest);if(q&&q.giver===n.id&&!c.quests[q.id]){c.quests[q.id]={status:'active',count:0};say(w,p,'Accepted: '+q.name+'. '+q.description);}return true;}
  if(a.type==='city-quest-claim'){const q=quests.get(a.quest);if(q&&q.giver===n.id&&c.quests[q.id]?.status==='ready'){c.quests[q.id].status='done';reward(p,q);say(w,p,q.name+' complete: +'+q.gold+' silver / +'+q.xp+' XP.');}return true;}
  if(a.type==='city-buy'){const item=items.get(a.item),stock=Data.shops[n.shop];if(!item||!stock?.includes(item.id))return true;if(p.gold<item.price||inventoryCount(c)>=80){say(w,p,'Not enough silver or inventory space (80 items).');return true;}p.gold-=item.price;change(c,item.id,1);say(w,p,'Purchased '+item.name+' for '+item.price+' silver.');return true;}
  if(a.type==='city-sell'){const item=items.get(a.item);if(!n.shop||!item||!(c.inventory[item.id]>0)||equipped(c,item.id))return true;if(p.gold+item.sell>999999)return true;change(c,item.id,-1);p.gold+=item.sell;say(w,p,'Sold '+item.name+' for '+item.sell+' silver.');return true;}
  if(a.type==='city-store'||a.type==='city-retrieve'){if(n.role!=='banker')return true;const item=items.get(a.item),from=a.type==='city-store'?'inventory':'storage',to=from==='inventory'?'storage':'inventory';if(!item||!(c[from][item.id]>0)||inventoryCount(c,to)>=80||(from==='inventory'&&equipped(c,item.id)))return true;change(c,item.id,-1,from);change(c,item.id,1,to);say(w,p,item.name+(to==='storage'?' stored.':' retrieved.'));return true;}
  if(a.type==='city-deposit'||a.type==='city-withdraw'){if(n.role!=='banker'||!integer(a.amount)||a.amount<1)return true;const deposit=a.type==='city-deposit',source=deposit?p.gold:c.bankGold,dest=deposit?c.bankGold:p.gold;if(source<a.amount||dest+a.amount>999999)return true;if(deposit){p.gold-=a.amount;c.bankGold+=a.amount;}else{p.gold+=a.amount;c.bankGold-=a.amount;}say(w,p,(deposit?'Deposited ':'Withdrew ')+a.amount+' silver.');return true;}
  if(a.type==='city-repair'){if(n.role!=='blacksmith'||!c.equipment.weapon||c.durability>=100||p.gold<4)return true;p.gold-=4;c.durability=100;say(w,p,'Weapon repaired for 4 silver.');return true;}
  if(a.type==='city-upgrade'){const price=25*(c.upgrade+1);if(n.role!=='blacksmith'||!c.equipment.weapon||c.upgrade>=3||p.gold<price)return true;p.gold-=price;c.upgrade++;say(w,p,'Weapon training upgrade '+c.upgrade+'/3. Bonus +1 damage per tier.');return true;}
  if(a.type==='city-rest'){const free=n.role==='meditation';if(!free&&!['innkeeper','healer'].includes(n.role)||w.time<c.restUntil||(!free&&p.gold<5))return true;if(!free)p.gold-=5;p.hp=p.maxHp;p.energy=100;c.restUntil=w.time+10;say(w,p,free?'Meditation restored health and energy.':n.role==='healer'?'Clinic care restored health and energy for 5 silver.':'Rested at the inn for 5 silver.');return true;}
  return true;
 }
 function bonus(p,type){const c=p.city;if(!c)return 0;if(type==='attack'){const item=items.get(c.equipment.weapon);return item&&item.path===p.path&&c.durability>0?(item.attack||0)+c.upgrade:0;}return ['armour','accessory'].reduce((s,slot)=>s+(items.get(c.equipment[slot])?.defence||0),0);}
 function hit(p,target){const c=p.city;if(!c)return;if(target.kind==='training'){const q=quests.get('temple-training'),s=c.quests[q.id];if(s?.status==='active'){s.count++;if(s.count>=q.count)s.status='ready';}}else if(c.equipment.weapon&&c.durability>0)c.durability--;}
 function duel(a,b,time){return !!(a.duel&&b.duel&&a.duel.other===b.id&&b.duel.other===a.id&&a.mapId===b.mapId&&a.duel.mapId===a.mapId&&a.duel.until>time&&b.duel.until>time&&a.wanted===0&&b.wanted===0);}
 function spawn(w){for(const n of Data.npcs)w.entities.push({id:n.id,name:n.name,kind:n.role==='guard'?'guard':n.role==='training'?'training':'civilian',service:n.role,cityNpc:true,mapId:n.mapId,x:n.x,y:n.y,homeX:n.x,homeY:n.y,hp:n.role==='guard'?250:n.role==='training'?10000:60,maxHp:n.role==='guard'?250:n.role==='training'?10000:60,cd:0,respawn:0});}
 function tick(w,dt,move){for(const p of Object.values(w.players)){if(!p.city)init(p);if(p.duel&&(p.duel.mapId!==p.mapId||p.duel.until<=w.time||p.jail>0))p.duel=null;}
  const occupied=new Set(Object.values(w.players).map(p=>p.mapId));for(const e of w.entities){if(!e.cityNpc||!occupied.has(e.mapId)||e.hp<=0)continue;const n=npcs.get(e.id);if(e.kind==='training'){e.hp=e.maxHp;continue;}if(n.patrol&&!Object.values(w.players).some(p=>p.mapId===e.mapId&&p.wanted>0)){const point=n.patrol[Math.floor(w.time/9)%n.patrol.length];e.homeX=point.x;e.homeY=point.y;}if(n.wander){const goal={x:n.x+Math.sin(w.time/8)*.7,y:n.y};const d=distance(e,goal);if(d>.1)move(e,e.x+(goal.x-e.x)/d*dt*.5,e.y);}}
 }
 return {data:Data,init,sanitize,command,bonus,hit,duel,spawn,tick,activeNpc,inventoryCount};
});
