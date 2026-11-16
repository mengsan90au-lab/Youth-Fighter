'use strict';
// Script/DOM-double smoke test only. This does not measure or verify a real browser.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
test('public browser script order boots, binds combat controls and saves v6 with DOM/Canvas doubles',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8'),ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1])),elements=new Map(),storage=new Map(),listeners=new Map();let raf;
 const ctx=new Proxy({measureText:s=>({width:String(s).length*6}),createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>(o[k]=v,true)});
 function element(key){if(elements.has(key))return elements.get(key);const e={value:key==='#name'?'Smoke test':'',dataset:{},style:{},open:false,hidden:false,width:200,height:150,clientWidth:1000,clientHeight:660,classList:{add(){},remove(){},toggle(){}},getContext:()=>ctx,listeners:{},addEventListener(type,fn){this.listeners[type]=fn;},setAttribute(){},getAttribute:()=>null,replaceChildren(){},append(){},appendChild(){},getBoundingClientRect:()=>({left:0,top:0,width:1000,height:660}),querySelector:s=>element(key+' '+s),querySelectorAll:()=>[],showModal(){this.open=true;},close(){this.open=false;},click(){if(!this.disabled)this.onclick?.();}};elements.set(key,e);return e;}
 const buttons=[0,1,2].map(i=>{const e=element('[data-skill="'+i+'"]');e.dataset.skill=String(i);return e;});
 const document={hidden:false,querySelector:s=>{if(/^#[\w-]+$/.test(s))assert.ok(ids.has(s.slice(1)),'Missing HTML control '+s);return element(s);},querySelectorAll:s=>s==='[data-skill]'?buttons:[],createElement:tag=>element('created-'+tag),createTextNode:s=>({textContent:s}),addEventListener(){}};
 const context={document,console,performance:{now:()=>0},innerWidth:1280,innerHeight:900,devicePixelRatio:1,location:{protocol:'file:',search:'',host:''},URLSearchParams,Image:class{constructor(){this.complete=false;}},setInterval(){},setTimeout(){},addEventListener:(name,fn)=>{if(!listeners.has(name))listeners.set(name,[]);listeners.get(name).push(fn);},requestAnimationFrame:cb=>raf=cb,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}};context.window=context;
 vm.createContext(context);for(const [,file]of html.matchAll(/<script src="([^"]+)"><\/script>/g))new vm.Script(fs.readFileSync(path.join(__dirname,'../public',file),'utf8'),{filename:file}).runInContext(context);
 assert.ok(context.YouthFighter);element('#begin').click();assert.equal(context.YouthFighter.getState().started,true);
 // Run a full mocked presentation frame so new HUD bindings execute.
 raf(100);assert.match(element('#combatStatus').textContent,/READY/);assert.match(element('#ultimateHint').textContent,/60 Focus/);
 element('#schoolChoice').onchange({target:{value:'spear'}});assert.equal(context.YouthFighter.getState().world.players.solo.path,'spear');element('#schoolChoice').onchange({target:{value:'fist'}});
 const state=context.YouthFighter.getState(),p=state.world.players.solo;assert.equal(p.focus,0);element('#guard').click();assert.equal(p.action.defense,'guard');
 const saved=context.YFSave.snapshot(p);assert.equal(saved.version,6);assert.equal(saved.action,undefined);
 function key(type,key){for(const fn of listeners.get(type)||[])fn({key,target:{tagName:'CANVAS'},preventDefault(){}});}
 for(let i=0;i<20;i++)context.YF.step(state.world,.05);
 // WASD/arrows no longer move; mouse clicks use real navigation.
 for(const k of ['w','a','s','d','ArrowUp','ArrowRight'])key('keydown',k);
 assert.equal(p.input.x,0);assert.equal(p.input.y,0);assert.equal(p.aim,null);
 const at=context.YouthFighter.project(12,19);
 element('#world').listeners.pointerdown({clientX:at.x,clientY:at.y,button:0});
 assert.ok(p.aim,'ground click creates a route');
 const oldY=p.y;for(let i=0;i<10;i++)context.YF.step(state.world,.05);assert.ok(p.y>oldY);
 element('#world').listeners.pointermove({clientX:at.x,clientY:at.y});key('keydown',' ');assert.equal(p.action?.defense,'dodge');assert.ok(p.action.dy>0);
 for(let i=0;i<25;i++)context.YF.step(state.world,.05);
 key('keydown','k');assert.equal(element('#keySettings').open,true);
 element('#keyRows').listeners.click({target:{closest:()=>({dataset:{bind:'attack0'}})}});key('keydown','z');
 assert.equal(JSON.parse(storage.get(context.YFKeys.KEY)).attack0,'z');key('keydown','Escape');
 context.YF.enterMap(state.world,p,'sovann-temple-ward',23,17);for(let i=0;i<20;i++)context.YF.step(state.world,.05);context.YF.command(state.world,p.id,{type:'target',id:'temple-dummy'});
 key('keydown','1');assert.equal(p.action,null,'old key stops activating the rebound skill');key('keydown','z');assert.equal(p.action.skillId,'fist.naga-fist');for(let i=0;i<20;i++)context.YF.step(state.world,.05);
 key('keydown','i');assert.equal(element('#schoolPanel').open,true);key('keydown','Escape');
 for(const path of ['staff','blade','darts']){context.YF.command(state.world,p.id,{type:'equip',path});raf(200+['staff','blade','darts'].indexOf(path)*200);assert.equal(p.path,path);assert.equal(element('#ultimateCombat').disabled,true);}
});
