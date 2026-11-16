/* Host-owned membership, school reputation, lessons and bounded quest progress. */
(function(r,f){if(typeof module==='object')module.exports=f(require('./school-data.js'),require('./experience.js'));else r.YFSchools=f(r.YFSchoolData,r.YFExperience);})(typeof globalThis!=='undefined'?globalThis:this,(Data,XP)=>{
 'use strict';const integer=(v,max)=>Number.isInteger(v)?Math.max(0,Math.min(max,v)):0;
 const blank=()=>({reputation:0,learned:[],completed:[],rank:0,quest:null});
 function init(p){p.schoolProgress={version:1,active:null,legacyLevel:1,legacySkills:[],records:{}};}
 function legacy(p){init(p);p.schoolProgress.legacyLevel=Math.min(999,p.level||1);p.schoolProgress.legacySkills=Data.schools.filter(s=>['fist','spear'].includes(s.id)).flatMap(s=>s.skills);}
 function record(p){return p.schoolProgress?.records[p.path]||null;}
 function definition(p,id){const r=record(p);if(!r)return null;
  if(id==='discipline')return {id,name:'Discipline at the dummy',kind:'training',goal:3,level:1,xp:300,rep:10,once:true};
  if(id==='fieldwork')return {id,name:'Protect the grove',kind:'kill',goal:3,level:3,xp:700,rep:15,once:true,requires:'discipline'};
  if(id==='service')return {id,name:'School service',kind:'kill',goal:5,level:1,xp:Math.max(100,p.level*40),rep:5,once:false};
  if(id==='advancement'&&r.rank<4)return {id,name:'Advancement trial '+(r.rank+1),kind:'trial',goal:8+r.rank*4,level:Data.caps[r.rank],xp:p.level*100,rep:25,once:false,requires:'fieldwork'};
  return null;
 }
 function sanitize(raw){const result={version:1,active:null,legacyLevel:1,legacySkills:[],records:{}};if(raw?.version!==1)return result;
  result.active=Data.get(raw.active)?.id||null;result.legacyLevel=Math.max(1,integer(raw.legacyLevel,999));
  result.legacySkills=Data.schools.filter(s=>['fist','spear'].includes(s.id)).flatMap(s=>s.skills).filter(id=>Array.isArray(raw.legacySkills)&&raw.legacySkills.includes(id));
  for(const s of Data.schools){const source=raw.records?.[s.id];if(!source||typeof source!=='object')continue;const r=blank();r.reputation=integer(source.reputation,99999);r.rank=integer(source.rank,4);r.learned=s.skills.filter(id=>Array.isArray(source.learned)&&source.learned.includes(id));r.completed=['discipline','fieldwork'].filter(id=>Array.isArray(source.completed)&&source.completed.includes(id));
   if(['discipline','fieldwork','service','advancement'].includes(source.quest?.id)&&!r.completed.includes(source.quest.id)&&!(source.quest.id==='advancement'&&r.rank===4))r.quest={id:source.quest.id,count:integer(source.quest.count,24),combo:source.quest.combo===true};result.records[s.id]=r;
  }return result;
 }
 function canUse(p,s){if(s.category!=='ordinary')return true;return s.index===0||!!p.schoolProgress?.legacySkills.includes(s.id)||!!record(p)?.learned.includes(s.id);}
 function canLearn(p,s){const r=record(p),req=Data.requirements[s.index];return !!(r&&s.path===p.path&&req&&p.level>=req.level&&r.reputation>=req.reputation&&(!req.quest||r.completed.includes(req.quest)));}
 function join(p,path){const s=Data.get(path);if(!s)return false;if(!p.schoolProgress)init(p);p.schoolProgress.active=path;p.schoolProgress.records[path]||=blank();const r=p.schoolProgress.records[path];if(!r.learned.includes(s.skills[0]))r.learned.push(s.skills[0]);return true;}
 function outcome(p,kind,target){const r=record(p),q=r?.quest,d=q&&definition(p,q.id);if(!d)return;
  if(kind==='training'&&d.kind==='training'&&target.id==='temple-dummy')q.count=Math.min(d.goal,q.count+1);
  if(kind==='kill'&&['kill','trial'].includes(d.kind)&&['wolf','bandit'].includes(target.kind))q.count=Math.min(d.goal,q.count+1);
  if(kind==='combo'&&d.kind==='trial'&&target.id==='temple-dummy')q.combo=true;
 }
 function ready(p){const q=record(p)?.quest,d=q&&definition(p,q.id);return !!(d&&q.count>=d.goal&&(d.kind!=='trial'||q.combo));}
 function command(w,p,a,h){if(!a.type.startsWith('school-'))return false;
  const say=text=>h.emit(w,p,null,'school',{text});
  if(p.hp<=0||p.jail>0||p.wanted>0||p.action||p.staggerUntil>w.time||!h.activeNpc(w,p,'temple-trainer')){say('Approach Master Dara in Temple Ward while lawful and ready.');return true;}
  const r=record(p);if(!r){say('Choose a school first [I].');return true;}
  if(a.type==='school-learn'){const s=h.skill(a.skillId);if(!s||s.category!=='ordinary'||s.path!==p.path||!canLearn(p,s)){say('Complete the required school quest, level and reputation before learning.');return true;}if(!r.learned.includes(s.id))r.learned.push(s.id);say('Learned '+s.name+'.');return true;}
  if(a.type==='school-quest-accept'){const d=definition(p,a.quest);if(!d||r.quest||p.level<d.level||d.requires&&!r.completed.includes(d.requires)||d.once&&r.completed.includes(d.id)){say('This quest needs its prerequisites, or another quest is already active.');return true;}r.quest={id:d.id,count:0,combo:false};say(d.name+' accepted. Return to Dara when complete.');return true;}
  if(a.type==='school-quest-claim'){const q=r.quest,d=q&&definition(p,q.id);if(!ready(p)){say('Finish your active school quest first.');return true;}r.quest=null;if(d.once)r.completed.push(d.id);if(d.id==='advancement')r.rank=Math.min(4,r.rank+1);r.reputation=Math.min(99999,r.reputation+d.rep);XP.award(p,d.xp);say(d.name+' complete: +'+d.rep+' school reputation, +'+d.xp+' XP. Level ceiling '+XP.cap(p)+'.');return true;}
  return true;
 }
 return {init,legacy,record,definition,sanitize,canUse,canLearn,join,outcome,ready,command,data:Data};
});
