/* Original Youth Fighter combat definitions. Seconds and gameplay-space units. */
(function(r,f){if(typeof module==='object')module.exports=f();else r.YFCombatData=f();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 const version=1;
 function skill(id,name,path,index,range,damage,cost,cool,startup,active,recovery,area=false){return {
  version,id,name,path,index,category:'ordinary',weapon:path==='spear'?'path-spear':'unarmed-or-wraps',role:index===0?'quick':index===1?'heavy':'area',
  range,damage,cost,cool,geometry:{shape:path==='spear'?'cone':area?'circle':'selected-circle',halfAngle:path==='spear'?(index===0?.35:index===1?Math.PI*.6:Math.PI*.4):Math.PI,reach:range,targetCap:area?8:1,origin:'actor',facing:'locked-at-start',lineOfSight:true},
  formula:'max(1, damage + (level-1)*3 + equipmentAttack - equipmentDefence)',pvpScale:1,
  startup,active,recovery,hits:[{at:startup,scale:1}],movement:{speed:0,collision:'map'},
  interrupts:['travel','arrest','defeat','disconnect','invalid-owner'],cancels:[],status:[],comboTags:[path,index===0?'opener':'continuation'],
  unlock:{kind:'path'},presentation:{pose:index,animation:'legacy-'+path+'-'+index,vfx:'procedural-impact',audio:'procedural-tone'}
 };}
 const skills=[
  skill('fist.naga-fist','Naga fist','fist',0,2.5,18,0,.5,.12,.06,.22),
  skill('fist.elbow-surge','Elbow surge','fist',1,3,32,22,3,.2,.08,.27),
  skill('fist.naga-awakening','Naga awakening','fist',2,4.5,42,45,9,.4,.1,.35,true),
  skill('spear.thrust','Spear thrust','spear',0,3.6,16,0,.65,.18,.06,.3),
  skill('spear.serpent-sweep','Serpent sweep','spear',1,4,29,22,3,.25,.1,.3,true),
  skill('spear.naga-tempest','Naga tempest','spear',2,5,40,45,9,.45,.1,.4,true)
 ];
 for(const [path,id,name,range,damage,cost,startup]of [['fist','fist.basin-echo','Basin Echo',2.8,26,16,.12],['spear','spear.tide-reversal','Tide-Reversal Spear',4.2,24,20,.22]]){
  const s=skill(id,name,path,1,range,damage,cost,8,startup,.1,.28,path==='spear');
  Object.assign(s,{index:null,category:'hidden',role:'timed-defense-response',unlock:{kind:'discovery',id},counterRequired:true,
   discovery:{clue:'Master Dara: confirm a full route on the Temple dummy, then meet its practice pulse with a timed defense.',method:'mentor-route-and-defense',persistent:true,feedback:'Use 4 after a timed dodge/early guard. Fist opens a brief quick follow-up; spear sweeps its locked front.'}});skills.push(s);
 }
 const byId=new Map(skills.map(s=>[s.id,s]));
 const forPath=path=>skills.filter(s=>s.category==='ordinary'&&s.path===(path==='spear'?'spear':'fist'));
 function resolve(path,intent){const kit=forPath(path);if(typeof intent.skillId==='string'){const s=byId.get(intent.skillId);return s?.path===path&&(intent.skill===undefined||intent.skill===s.index)?s:null;}return Number.isInteger(intent.skill)?kit[intent.skill]||null:null;}
 function validate(data=skills){const errors=[],ids=new Set();for(const s of data){
  if(typeof s.id!=='string'||ids.has(s.id))errors.push('Duplicate or invalid skill ID');ids.add(s.id);
  if(s.version!==version||!['fist','spear'].includes(s.path)||!s.weapon||!s.role||!s.formula||!s.unlock||!s.presentation)errors.push('Incomplete skill '+s.id);
  for(const k of ['range','damage','cost','cool','startup','active','recovery'])if(!Number.isFinite(s[k])||s[k]<0)errors.push('Invalid '+k+' in '+s.id);
  if(!s.geometry||!['circle','selected-circle','cone'].includes(s.geometry.shape)||!Number.isInteger(s.geometry.targetCap)||s.geometry.targetCap<1||s.geometry.targetCap>8)errors.push('Invalid geometry '+s.id);
  if(!Array.isArray(s.hits)||!s.hits.length||s.hits.some((h,i)=>!Number.isFinite(h.at)||h.at<s.startup||h.at>=s.startup+s.active||h.scale<=0||(i>0&&h.at<=s.hits[i-1].at)))errors.push('Invalid hit schedule '+s.id);
 }return {valid:!errors.length,errors};}
 const checked=validate();if(!checked.valid)throw Error(checked.errors.join('; '));
 function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}freeze(skills);
 return {version,skills,forPath,resolve,get:id=>byId.get(id),validate};
});
