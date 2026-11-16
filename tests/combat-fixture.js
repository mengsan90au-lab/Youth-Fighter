'use strict';
const YF=require('../public/world.js');
function fixture(path='fist'){
 const w=YF.createWorld();w.entities=[];const p=YF.addPlayer(w,'hero');Object.assign(p,{mapId:'bamboo-grove',x:24,y:12,path});
 const t={id:'target',kind:'training',mapId:p.mapId,x:25,y:12,hp:10000,maxHp:10000,homeX:25,homeY:12,cd:99};w.entities.push(t);YF.command(w,p.id,{type:'target',id:t.id});return {w,p,t};
}
function advance(w,seconds,hz=60){for(let t=0;t<seconds-1e-9;t+=1/hz)YF.step(w,Math.min(1/hz,seconds-t));}
function attack(f,i){YF.command(f.w,f.p.id,{type:'attack',skill:i});return f.p.action;}
function finish(f,hz=60){const seconds=f.p.action.endAt-f.w.time;advance(f.w,seconds,hz);}
function pair(){const f=fixture();f.w.entities=[];const q=YF.addPlayer(f.w,'other');Object.assign(q,{mapId:f.p.mapId,x:25,y:12});YF.command(f.w,f.p.id,{type:'target',id:q.id});YF.command(f.w,q.id,{type:'target',id:f.p.id});return {...f,q};}
module.exports={fixture,advance,attack,finish,pair};
