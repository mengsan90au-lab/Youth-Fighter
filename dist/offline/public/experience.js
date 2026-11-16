/* One level/XP policy shared by combat rewards, city quests and schools. */
(function(r,f){if(typeof module==='object')module.exports=f(require('./school-data.js'));else r.YFExperience=f(r.YFSchoolData);})(typeof globalThis!=='undefined'?globalThis:this,Data=>{
 'use strict';
 function cap(p){const s=p.schoolProgress;if(!s)return Data.maxLevel;return Math.min(999,Math.max(10,s.legacyLevel||1,...Object.values(s.records||{}).map(r=>Data.caps[r.rank]||10)));}
 function award(p,amount){if(!Number.isFinite(amount)||amount<0)return 0;let gained=0;p.level=Math.max(1,Math.min(999,p.level||1));p.xp=Math.max(0,p.xp||0)+amount;
  while(p.level<cap(p)&&p.xp>=p.level*100){p.xp-=p.level*100;p.level++;gained++;}
  p.xp=p.level===999?0:Math.min(p.xp,p.level*100);p.maxHp=120+(p.level-1)*15;if(gained)p.hp=p.maxHp;return gained;
 }
 return {cap,award,maxLevel:Data.maxLevel};
});
