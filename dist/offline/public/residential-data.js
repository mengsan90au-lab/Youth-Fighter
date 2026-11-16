/* Reusable residential building kit. Original district routes and existing footprints stay intact. */
(function(r,f){if(typeof module==='object')module.exports=f();else r.YFResidentialData=f();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 const asset={path:'assets/residential/khmer-building-kit.webp',width:1536,height:1024,columns:3,rows:2,inset:4,frames:{elder:0,clinic:1,home:2,goods:3,food:4,well:5}};
 function upgrade(m,npc){
  m.skinTheme='khmer-residential';m.description='A warm Khmer-inspired neighbourhood of terracotta-roofed timber homes, a clinic, local provisions and a public well. Existing roads and gates are preserved.';m.groundPalette={stone:['#b1a681','#bcae89','#c7b994','#b8ad8a'],grass:['#527448','#567b49','#5b7c49','#4f7245']};
  // Courtyard paving is a visual surface, not a change to the existing road/travel graph.
  m.pavingAreas=[{x:12,y:12,w:18,h:18},{x:3,y:35.5,w:10,h:3},{x:28,y:35.5,w:11,h:3},{x:3,y:10.5,w:10,h:3},{x:28,y:10.5,w:11,h:3},{x:13,y:11,w:2,h:26},{x:26,y:11,w:2,h:26}];
  const skins={home1:['Resident House','home'],home2:['Residence House','home'],home3:["Elder’s House",'elder'],home4:['Village Clinic','clinic'],shrine2:['Neighbourhood Shrine','shrine']};
  for(const b of m.buildings){const [name,skin]=skins[b.id];b.name=name;b.residentialSkin=skin;}
  m.buildings.push({id:'residential-goods-building',name:'Local Goods Shop',x:4,y:14,w:6,h:3,style:'shop',residentialSkin:'goods'},
   {id:'residential-food-building',name:'Food Stall',x:13,y:23,w:4,h:2.5,style:'stall',residentialSkin:'food'});
  m.props=m.props.map(o=>({...o,residential:true,...(o.kind==='palm'?{kind:'banana'}:{})}));
  m.props.push(...[
   ['banana',3,12],['banana',40,11],['banana',3,36],['banana',39,37],['banana',16,12],['banana',25,13],['banana',11,24],['banana',28,15],['flower',14,7],['flower',27,8],['flower',14,34],['flower',27,34],
   ['flower',17,16],['flower',24,17],['flower',26,24],['flower',21,27],['flower',7,22],['flower',33,25],['flower',11,37],
   ['lantern',18,16],['lantern',24,16],['lantern',18,27],['lantern',25,27],['banner',2.5,17],['banner',39.5,18],['bench',25,25]
  ].map(([kind,x,y])=>({kind,x,y,residential:true})));
  // The well's solid rim and the new solid bench avoid the existing road corridors.
  m.decorCollision=[{name:'Community Well rim',x:22.35,y:23.35,w:1.3,h:1.3},{name:'Neighbourhood bench',x:25,y:25,w:1.4,h:.45}];
  npc(m,'residential-clinic','Healer Pich','healer',33,37,{shop:'herbal',service:'clinic',dialogue:'The clinic sells healing herbs. Care costs 5 silver and restores health and energy; wait ten seconds between visits.'});
  npc(m,'residential-goods','Neighbourhood goods keeper','merchant',7,18,{shop:'goods',dialogue:'Our small local shop carries woven cloth, iron scraps and healing herbs.'});
  npc(m,'residential-well','Community Well keeper','meditation',24.5,26,{service:'well',dialogue:'Rest by the well and drink clean water. This restores health and energy, with ten seconds between rests.'});
 }
 return {asset,upgrade};
});
