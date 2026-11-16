/* Outcome-earned transient Mastery Focus. No presentation/replay consumer awards resources. */
(function(r,f){if(typeof module==='object')module.exports=f();else r.YFFocus=f();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';const max=100;
 function reset(p){p.focus=0;p.focusLedger=[];p.ultimateLink=null;}
 function eligible(p,t){return !!(t&&['wolf','bandit'].includes(t.kind)&&t.mapId===p.mapId&&t.hp>0&&p.hp>0&&p.jail<=0);}
 function award(w,p,t,amount){if(!eligible(p,t))return 0;const ledger=(p.focusLedger||[]).filter(e=>e.time>w.time-30);
  const global=ledger.filter(e=>e.time>w.time-10).reduce((n,e)=>n+e.gain,0),source=ledger.filter(e=>e.sourceId===t.id).reduce((n,e)=>n+e.gain,0);
  const gain=Math.max(0,Math.min(amount,30-global,20-source,max-(p.focus||0)));if(gain){p.focus=(p.focus||0)+gain;ledger.push({sourceId:t.id,time:w.time,gain});}p.focusLedger=ledger.slice(-64);return gain;
 }
 function hit(w,p,t,s,a,combo){if(s.category==='ultimate'||a.focusAwarded||!eligible(p,t))return 0;a.focusAwarded=true;
  if(combo==='complete')p.ultimateLink={path:p.path,targetId:t.id,until:w.time+2};return award(w,p,t,4+(combo==='complete'?8:0));}
 function defense(w,p,source,a){if(a.focusDefenseAwarded||!eligible(p,source))return 0;a.focusDefenseAwarded=true;return award(w,p,source,6);}
 return {max,reset,eligible,award,hit,defense};
});
