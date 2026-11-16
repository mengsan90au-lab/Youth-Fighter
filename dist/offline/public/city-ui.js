/* NPC dialogue, services, inventory and journal. Commands validated by shared host rules. */
(function(r){'use strict';const esc=s=>r.YFMapRender.esc(s),$=s=>document.querySelector(s);
 r.YouthCityUI=class{
  constructor(options){Object.assign(this,options);this.dialog=$('#cityService');this.mode='inventory';this.npcId=null;this.peer=null;this.signature='';
   this.dialog.addEventListener('click',e=>{const b=e.target.closest('[data-city]');if(!b)return;const d=b.dataset;
    if(d.city==='close'){this.close();return;}if(d.city==='tab'){this.mode=d.tab;this.signature='';this.render();return;}
    if(d.city==='walk'){const n=r.YFCityData.npcs.find(n=>n.id===d.target);if(n){this.send({type:'goto',mapId:n.mapId,x:n.x,y:n.y});this.close();}return;}
    this.send({type:d.city,npc:this.npcId,item:d.item,quest:d.quest,slot:d.slot,amount:Number(d.amount),target:this.peer,path:d.path});this.signature='';this.render();
   });this.dialog.addEventListener('cancel',e=>{e.preventDefault();this.close();});
  }
  close(){this.dialog.close();this.peer=null;}
  openInventory(){this.mode='inventory';this.npcId=null;this.peer=null;this.stop();if(!this.dialog.open)this.dialog.showModal();this.signature='';this.render();}
  openJournal(){this.openInventory();this.mode='journal';this.render();}
  openNpc(id){const {world,player:p}=this.state(),n=r.YFCity.activeNpc(world,p,id);if(!n){this.announce('Move within 3 steps of the NPC, then press E.');return;}this.send({type:'city-interact',npc:id});this.npcId=id;this.peer=null;this.mode='service';this.stop();if(!this.dialog.open)this.dialog.showModal();this.signature='';this.render();}
  interact(){const {world,player:p}=this.state();if(p.city?.duelOffer?.until>world.time){this.send({type:'city-duel-accept'});return;}const candidates=world.entities.filter(e=>e.cityNpc&&e.hp>0&&e.mapId===p.mapId&&r.YF.dist(p,e)<=2.8).sort((a,b)=>r.YF.dist(p,a)-r.YF.dist(p,b));if(candidates[0]){this.openNpc(candidates[0].id);return;}const peer=world.players[p.target];if(peer&&peer.id!==p.id&&peer.mapId===p.mapId&&r.YF.dist(p,peer)<=3){this.openInventory();this.peer=peer.id;this.render();return;}this.announce('Approach a named city NPC and press E.');}
  hint(){const {world,player:p}=this.state();if(p.city?.duelOffer?.until>world.time)return 'Press E to accept the sparring invitation';const n=world.entities.filter(e=>e.cityNpc&&e.kind!=='training'&&e.hp>0&&e.mapId===p.mapId&&r.YF.dist(p,e)<=2.8).sort((a,b)=>r.YF.dist(p,a)-r.YF.dist(p,b))[0];return n?'E — Talk to '+n.name:'E: interact nearby · J: city journal';}
  button(cmd,label,fields={},disabled=false){return '<button data-city="'+cmd+'" '+Object.entries(fields).map(([k,v])=>'data-'+k+'="'+esc(v)+'"').join(' ')+(disabled?' disabled':'')+'>'+esc(label)+'</button>';}
  stats(i){return [i.attack?'Attack +'+i.attack:'',i.defence?'Defence +'+i.defence:'',i.heal?'Health +'+i.heal:'',i.energy?'Energy +'+i.energy:'',i.path?'Naga '+i.path+' only':''].filter(Boolean).join(' · ')||'Ordinary supplies / appearance';}
  render(){if(!this.dialog.open)return;const {world,player:p}=this.state(),c=p.city||{},n=r.YFCityData.npcs.find(n=>n.id===this.npcId);if(n&&!r.YFCity.activeNpc(world,p,n.id)){this.close();return;}
   const signature=JSON.stringify([c,p.gold,p.hp,p.energy,p.path,p.cd.map(t=>t>0),p.wanted,this.mode,this.npcId,this.peer]);if(signature===this.signature)return;this.signature=signature;
   $('#cityServiceTitle').textContent=n?n.name:this.mode==='journal'?'Sovann City journal':'Inventory & equipment';$('#cityServiceSubtitle').textContent=p.gold+' silver · '+r.YFCity.inventoryCount(c)+' / 80 items · '+(p.wanted?'WANTED — services restricted':'City reputation '+(c.reputation||0));
   const b=(...a)=>this.button(...a);let html='<nav class="city-tabs">'+(n?b('tab','Conversation & services',{tab:'service'}):'')+b('tab','Inventory',{tab:'inventory'})+b('tab','City journal',{tab:'journal'})+'</nav>';
   if(c.receipt)html+='<p class="city-receipt" role="status">'+esc(c.receipt)+'</p>';
   if(this.mode==='journal'){for(const q of r.YFCityData.quests){const s=c.quests?.[q.id];html+='<article><h3>'+esc(q.name)+' <small>'+(s?.status||'Not accepted')+'</small></h3><p>'+esc(q.description)+'</p><p>'+q.gold+' silver / '+q.xp+' XP · '+esc(r.YFCityData.npcs.find(n=>n.id===q.giver).name)+(q.mode==='training'&&s?' · '+(s.count||0)+' / 3 strikes':'')+'</p></article>';}}
   else if(this.mode==='inventory'){
    html+='<p>Choose among five paths in Schools or at the trainer. Equipment bonuses apply only to a compatible owned weapon. Staff, Blade and Darts currently use innate practice weapons. Durability '+(c.durability??100)+'% · upgrade '+(c.upgrade||0)+'/3.</p>';
    for(const [slot,id]of Object.entries(c.equipment||{})){const i=r.YFCityData.items.find(i=>i.id===id);html+='<p>'+esc(slot)+': '+esc(i?.name)+b('city-unequip','Unequip',{slot})+'</p>';}
    for(const i of r.YFCityData.items.filter(i=>c.inventory?.[i.id]>0))html+='<article><h3>'+esc(i.name)+' × '+c.inventory[i.id]+'</h3><p>'+esc(this.stats(i))+'</p>'+(['weapon','armour','accessory','costume'].includes(i.type)?b('city-equip','Equip',{item:i.id}):i.type==='consumable'?b('city-use','Use',{item:i.id}):'')+'</article>';
    if(!r.YFCity.inventoryCount(c))html+='<p>Your inventory is empty. Quartermaster Kiri in Market Ward offers a delivery that earns enough silver for your first weapon.</p>';
    if(this.peer)html+=b('city-duel-request','Invite selected player to consensual sparring');if(c.duelOffer?.until>world.time)html+=b('city-duel-accept','Accept sparring invitation');
   }else if(n){
    html+='<p class="city-dialogue">'+esc(n.dialogue)+'</p><p>'+esc(r.YFMaps.map(n.mapId).name)+' · '+esc(n.role)+' · E to interact when nearby.</p>';
    for(const q of r.YFCityData.quests.filter(q=>q.giver===n.id)){const s=c.quests?.[q.id];html+='<article><h3>'+esc(q.name)+'</h3><p>'+esc(q.description)+'</p><p>'+q.gold+' silver / '+q.xp+' XP</p>'+(s?.status==='done'?'<p>Completed — reward already collected.</p>':s?.status==='ready'?b('city-quest-claim','Complete mission',{quest:q.id}):s?'<p>In progress'+(q.mode==='training'?' · '+s.count+' / 3':'')+'</p>':b('city-quest-accept','Accept mission',{quest:q.id}))+'</article>';}
    if(n.shop){html+='<h3>Shop stock — buy one</h3>';for(const id of r.YFCityData.shops[n.shop]){const i=r.YFCityData.items.find(i=>i.id===id);html+='<article><h3>'+esc(i.name)+'</h3><p>'+esc(this.stats(i))+'</p>'+b('city-buy','Buy · '+i.price+' silver',{item:id},p.gold<i.price)+'</article>';}html+='<h3>Sell owned items</h3>';for(const i of r.YFCityData.items.filter(i=>c.inventory?.[i.id]>0))html+=b('city-sell','Sell '+i.name+' · '+i.sell+' silver',{item:i.id},Object.values(c.equipment||{}).includes(i.id));}
    if(n.role==='banker'){html+='<h3>Bank balance: '+(c.bankGold||0)+' silver</h3>'+b('city-deposit','Deposit 10 silver',{amount:10},p.gold<10)+b('city-withdraw','Withdraw 10 silver',{amount:10},c.bankGold<10);for(const i of r.YFCityData.items){if(c.inventory?.[i.id])html+=b('city-store','Store '+i.name,{item:i.id},Object.values(c.equipment||{}).includes(i.id));if(c.storage?.[i.id])html+=b('city-retrieve','Retrieve '+i.name+' × '+c.storage[i.id],{item:i.id});}}
    if(n.role==='blacksmith')html+='<p>Upgrade caps at +3, one damage per tier. Maximum gear bonus remains small. Selling or storing an equipped item is blocked.</p>'+b('city-repair','Repair weapon · 4 silver',{},c.durability>=100||!c.equipment?.weapon)+b('city-upgrade','Upgrade · '+25*((c.upgrade||0)+1)+' silver',{},c.upgrade>=3||!c.equipment?.weapon);
    if(['innkeeper','meditation','healer'].includes(n.role))html+=b('city-rest',n.role==='healer'?'Clinic care - 5 silver':n.service==='well'?'Rest by the well - free':n.role==='meditation'?'Meditate · free':'Rest · 5 silver',{},world.time<(c.restUntil||0));
    if(n.role==='trainer')html+='<p>Open Schools for school quests, reputation and skill lessons.</p>'+r.YFSchoolData.schools.map(s=>b('equip','Choose '+s.name,{path:s.id})).join('')+b('walk','Walk to practice dummy',{target:'temple-dummy'});
   }
   $('#cityServiceBody').innerHTML=html;
  }
 };
})(typeof globalThis!=='undefined'?globalThis:this);
