/* Outcome-driven, finite original routes; no rewards from presentation events. */
(function(r,f){if(typeof module==='object')module.exports=f();else r.YFCombos=f();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';const window=1.3,bufferSeconds=.15;
 const routes=Object.freeze({
  fist:Object.freeze({version:1,id:'fist.basin-current',name:'Basin Current',path:'fist',sequence:[0,1],branches:[0,2],event:'primary-hit',window,targetPolicy:'same-living-target',reset:['miss','wrong-target','wrong-skill','expiry','defense','stagger','travel'],reward:'quick startup or heavy area choice; bounded eligible hostile Focus',limit:'one finish then 1s route lock'}),
  spear:Object.freeze({version:1,id:'spear.reed-current',name:'Reed Current',path:'spear',sequence:[0,1],branches:[0,2],event:'primary-hit',window,targetPolicy:'same-living-target',reset:['miss','wrong-target','wrong-skill','expiry','defense','stagger','travel'],reward:'quick startup or heavy area choice; bounded eligible hostile Focus',limit:'one finish then 1s route lock'}),
  ...Object.fromEntries([['staff','root-and-branch','Root and Branch'],['blade','first-light','First Light'],['darts','lotus-thread','Lotus Thread']].map(([path,id,name])=>[path,Object.freeze({version:1,id:path+'.'+id,name,path,sequence:[0,1],branches:[0,2],event:'primary-hit',window,targetPolicy:'same-living-target',reset:['miss','wrong-target','wrong-skill','expiry','defense','stagger','travel'],reward:'quick startup or heavy commitment',limit:'one finish then 1s route lock'})]))
 });
 const counterRoute=Object.freeze({version:1,id:'fist.river-step-counter',name:'River-Step Counter',path:'fist',sequence:['timed-dodge',1],branches:[0,2],event:'defense-then-primary-hit',window,targetPolicy:'same-living-attacker',reset:['miss','wrong-target','wrong-skill','expiry','stagger','travel'],reward:'quick follow-up or heavy commitment; bounded hostile Focus',limit:'one finish then 1s route lock'});
 function validate(definitions=[...Object.values(routes),counterRoute]){const errors=[],ids=new Set();for(const d of definitions){
  if(!d||d.version!==1||typeof d.id!=='string'||ids.has(d.id)){errors.push('Invalid or duplicate combo');continue;}ids.add(d.id);
  if(!['fist','spear','staff','blade','darts'].includes(d.path)||!Array.isArray(d.sequence)||d.sequence.length!==2||!Array.isArray(d.branches)||d.branches.join(',')!=='0,2'||!Number.isFinite(d.window)||d.window<=0||!d.targetPolicy||!d.reset?.length||!d.reward||!d.limit)errors.push('Incomplete combo '+d.id);
 }return {valid:!errors.length,errors};}
 for(const d of [...Object.values(routes),counterRoute])for(const v of Object.values(d))if(Array.isArray(v))Object.freeze(v);
 if(!validate().valid)throw Error('Invalid combo definitions');
 function clear(p){p.combo=null;}
 function defense(p,source,time){if(p.path!=='fist'||source.kind==='training'||time<(p.comboLockUntil||0))return false;p.combo={id:counterRoute.id,path:p.path,targetId:source.id,stage:1,until:time+window};return true;}
 function prepare(p,s,targetId,time){const c=p.combo;if(c&&(c.path!==p.path||c.targetId!==targetId||c.until<=time))clear(p);
  const current=p.combo;if(current){const expected=current.stage===1?s.index===1:[0,2].includes(s.index);if(!expected||s.category!=='ordinary')clear(p);}
  return p.combo?{id:p.combo.id,stage:p.combo.stage,targetId,path:p.path}:null;
 }
 function hit(p,s,a,targetId,time){if(targetId!==a.targetId||s.category!=='ordinary'||a.comboResolved)return null;a.comboResolved=true;
  const c=p.combo;
  if(a.comboLink&&c&&c.until>time&&c.stage===a.comboLink.stage&&c.targetId===targetId&&c.path===p.path){
   if(c.stage===1&&s.index===1){p.combo={...c,stage:2,until:time+window};return 'branch';}
   if(c.stage===2&&[0,2].includes(s.index)){clear(p);p.comboLockUntil=time+1;return 'complete';}
  }
  clear(p);if(s.index===0&&time>=(p.comboLockUntil||0)){p.combo={id:routes[p.path].id,path:p.path,targetId,stage:1,until:time+window};return 'opportunity';}return null;
 }
 return {routes,counterRoute,validate,window,bufferSeconds,clear,defense,prepare,hit};
});
