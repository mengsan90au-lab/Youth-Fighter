/* Original school catalogue. Stable paths remain independent of display names. */
(function(r,f){if(typeof module==='object')module.exports=f();else r.YFSchoolData=f();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const schools=[
  {id:'fist',name:'Golden Naga',weapon:'Bare hands / wraps',identity:'Close pressure and timed counters.',route:'Basin Current',skills:['fist.naga-fist','fist.elbow-surge','fist.naga-awakening'],equipment:'wraps'},
  {id:'spear',name:'River Reed',weapon:'Spear',identity:'Long thrusts and directional sweeps.',route:'Reed Current',skills:['spear.thrust','spear.serpent-sweep','spear.naga-tempest'],equipment:'reed-spear'},
  {id:'staff',name:'Stone Banyan',weapon:'Staff',identity:'Broad control, deliberate impact and recovery.',route:'Root and Branch',skills:['staff.root-tap','staff.branch-turn','staff.banyan-circle'],equipment:null},
  {id:'blade',name:'Dawn Heron',weapon:'Single blade',identity:'Narrow cuts, quick links and a committed finish.',route:'First Light',skills:['blade.dawn-cut','blade.heron-cross','blade.sunrise-arc'],equipment:null},
  {id:'darts',name:'Veiled Lotus',weapon:'Concealed throwing darts',identity:'Ranged precision and a narrow fan; walls stop throws.',route:'Lotus Thread',skills:['darts.thread','darts.double-petal','darts.lotus-fan'],equipment:null}
 ];
 const caps=[10,50,150,400,999],requirements=[{level:1,reputation:0,quest:null},{level:3,reputation:10,quest:'discipline'},{level:5,reputation:25,quest:'fieldwork'}];
 function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
 freeze(schools);freeze(caps);freeze(requirements);
 return {version:1,schools,caps,requirements,maxLevel:999,get:id=>schools.find(s=>s.id===id)};
});
