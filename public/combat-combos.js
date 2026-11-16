/* Outcome-driven, finite original routes; no rewards from presentation events. */
(function(r,f){if(typeof module==='object')module.exports=f();else r.YFCombos=f();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';const window=1.3,bufferSeconds=.15;
 const routes=Object.freeze({
  fist:Object.freeze({version:1,id:'fist.basin-current',name:'Basin Current',path:'fist',sequence:[0,1],branches:[0,2],event:'primary-hit',window,targetPolicy:'same-living-target',reset:['miss','wrong-target','wrong-skill','expiry','defense','stagger','travel'],reward:'quick startup or heavy area choice; eligible Focus in later stage',limit:'one finish then 1s route lock'}),
  spear:Object.freeze({version:1,id:'spear.reed-current',name:'Reed Current',path:'spear',sequence:[0,1],branches:[0,2],event:'primary-hit',window,targetPolicy:'same-living-target',reset:['miss','wrong-target','wrong-skill','expiry','defense','stagger','travel'],reward:'quick startup or heavy area choice; eligible Focus in later stage',limit:'one finish then 1s route lock'})
 });
 function clear(p){p.combo=null;}
 function prepare(p,s,targetId,time){const c=p.combo;if(c&&(c.path!==p.path||c.targetId!==targetId||c.until<=time))clear(p);
  const current=p.combo;if(current){const expected=current.stage===1?s.index===1:[0,2].includes(s.index);if(!expected||s.category!=='ordinary')clear(p);}
  return p.combo?{stage:p.combo.stage,targetId,path:p.path}:null;
 }
 function hit(p,s,a,targetId,time){if(targetId!==a.targetId||s.category!=='ordinary'||a.comboResolved)return null;a.comboResolved=true;
  const c=p.combo;
  if(a.comboLink&&c&&c.until>time&&c.stage===a.comboLink.stage&&c.targetId===targetId&&c.path===p.path){
   if(c.stage===1&&s.index===1){p.combo={...c,stage:2,until:time+window};return 'branch';}
   if(c.stage===2&&[0,2].includes(s.index)){clear(p);p.comboLockUntil=time+1;return 'complete';}
  }
  clear(p);if(s.index===0&&time>=(p.comboLockUntil||0)){p.combo={id:routes[p.path].id,path:p.path,targetId,stage:1,until:time+window};return 'opportunity';}return null;
 }
 return {routes,window,bufferSeconds,clear,prepare,hit};
});
