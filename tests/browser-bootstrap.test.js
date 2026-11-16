'use strict';
// Script/DOM-double smoke test only. This does not measure or verify a real browser.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
test('public browser script order boots, binds combat controls and saves v5 with DOM/Canvas doubles',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8'),ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1])),elements=new Map(),storage=new Map();let raf;
 const ctx=new Proxy({measureText:s=>({width:String(s).length*6}),createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>(o[k]=v,true)});
 function element(key){if(elements.has(key))return elements.get(key);const e={value:key==='#name'?'Smoke test':'',dataset:{},style:{},open:false,hidden:false,width:200,height:150,clientWidth:1000,clientHeight:660,classList:{add(){},remove(){},toggle(){}},getContext:()=>ctx,addEventListener(){},setAttribute(){},getAttribute:()=>null,replaceChildren(){},append(){},appendChild(){},getBoundingClientRect:()=>({left:0,top:0,width:1000,height:660}),querySelector:s=>element(key+' '+s),querySelectorAll:()=>[],showModal(){this.open=true;},close(){this.open=false;},click(){if(!this.disabled)this.onclick?.();}};elements.set(key,e);return e;}
 const buttons=[0,1,2].map(i=>{const e=element('[data-skill="'+i+'"]');e.dataset.skill=String(i);return e;});
 const document={hidden:false,querySelector:s=>{if(/^#[\w-]+$/.test(s))assert.ok(ids.has(s.slice(1)),'Missing HTML control '+s);return element(s);},querySelectorAll:s=>s==='[data-skill]'?buttons:[],createElement:tag=>element('created-'+tag),createTextNode:s=>({textContent:s}),addEventListener(){}};
 const context={document,console,performance:{now:()=>0},innerWidth:1280,innerHeight:900,devicePixelRatio:1,location:{protocol:'file:',search:'',host:''},URLSearchParams,Image:class{constructor(){this.complete=false;}},setInterval(){},setTimeout(){},addEventListener(){},requestAnimationFrame:cb=>raf=cb,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}};context.window=context;
 vm.createContext(context);for(const [,file]of html.matchAll(/<script src="([^"]+)"><\/script>/g))new vm.Script(fs.readFileSync(path.join(__dirname,'../public',file),'utf8'),{filename:file}).runInContext(context);
 assert.ok(context.YouthFighter);element('#begin').click();assert.equal(context.YouthFighter.getState().started,true);
 // Run a full mocked presentation frame so new HUD bindings execute.
 raf(100);assert.match(element('#combatStatus').textContent,/READY/);assert.match(element('#ultimateHint').textContent,/60 Focus/);
 element('#equipSpear').click();assert.equal(context.YouthFighter.getState().world.players.solo.path,'spear');element('#equipFist').click();
 const state=context.YouthFighter.getState(),p=state.world.players.solo;assert.equal(p.focus,0);element('#guard').click();assert.equal(p.action.defense,'guard');
 const saved=context.YFSave.snapshot(p);assert.equal(saved.version,5);assert.equal(saved.action,undefined);
});
