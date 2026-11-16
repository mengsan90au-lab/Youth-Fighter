/* Deterministic A* navigation shared by the browser and authoritative host. */
(function(root,factory){if(typeof module==='object')module.exports=factory();else root.YFNav=factory();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';
 function findPath(start,end,blocked,size=48){
  if(!Number.isFinite(end.x)||!Number.isFinite(end.y))return [];
  const sx=Math.round(start.x),sy=Math.round(start.y),gx=Math.round(end.x),gy=Math.round(end.y);
  const valid=(x,y)=>x>=1&&y>=1&&x<size&&y<size&&!blocked(x,y);
  if(!valid(gx,gy))return [];
  const key=(x,y)=>x+','+y,goal=key(gx,gy),first={x:sx,y:sy,g:0,f:Math.hypot(gx-sx,gy-sy),parent:null};
  const open=[first],best=new Map([[key(sx,sy),0]]),closed=new Set();
  const directions=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  while(open.length){open.sort((a,b)=>a.f-b.f);const n=open.shift(),nk=key(n.x,n.y);if(closed.has(nk))continue;closed.add(nk);
   if(nk===goal){const path=[];for(let c=n;c.parent;c=c.parent)path.push({x:c.x,y:c.y});path.reverse();if(path.length===0||Math.hypot(path.at(-1).x-end.x,path.at(-1).y-end.y)>.05){if(!blocked(end.x,end.y))path.push({x:end.x,y:end.y});}return path;}
   for(const [dx,dy]of directions){const x=n.x+dx,y=n.y+dy;if(!valid(x,y)||closed.has(key(x,y)))continue;if(dx&&dy&&(!valid(n.x+dx,n.y)||!valid(n.x,n.y+dy)))continue;
    const g=n.g+(dx&&dy?Math.SQRT2:1),k=key(x,y);if(g>=(best.get(k)??Infinity))continue;best.set(k,g);open.push({x,y,g,f:g+Math.hypot(gx-x,gy-y),parent:n});}
  }
  return [];
 }
 return {findPath};
});
