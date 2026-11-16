/* Browser-local action bindings. One key sends one intent; no combo macros. */
(function(r,f){if(typeof module==='object')module.exports=f();else r.YFKeys=f();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 'use strict';const KEY='youth-fighter-keys-v1';
 const defaults=Object.freeze({attack0:'1',attack1:'2',attack2:'3',hidden:'4',ultimate:'5',enhanced:'v',guard:'q',dodge:' ',map:'m',school:'i',appearance:'h',interact:'e',journal:'j',potion:'r',arrest:'f',target:'tab',graphics:'g',motion:'l',bindings:'k'});
 const labels=Object.freeze({attack0:'Skill 1 / combo opener',attack1:'Skill 2 / combo link',attack2:'Skill 3 / heavy finish',hidden:'Hidden technique',ultimate:'Ultimate',enhanced:'Enhanced ultimate',guard:'Guard',dodge:'Dodge toward cursor',map:'World map',school:'Schools and skills',appearance:'Appearance',interact:'Interact',journal:'City journal',potion:'Tonic',arrest:'Arrest',target:'Nearest target',graphics:'Graphics',motion:'Motion studio',bindings:'Key settings'});
 const normalize=key=>typeof key==='string'?key.toLowerCase():'';
 const allowed=key=>typeof key==='string'&&(/^[a-z0-9]$/.test(key)||[' ','tab'].includes(key));
 function validate(raw){return !!raw&&Object.keys(defaults).every(a=>allowed(raw[a]))&&new Set(Object.keys(defaults).map(a=>raw[a])).size===Object.keys(defaults).length;}
 function load(storage){try{const raw=JSON.parse(storage?.getItem(KEY));return validate(raw)?Object.fromEntries(Object.keys(defaults).map(a=>[a,raw[a]])):{...defaults};}catch{return {...defaults};}}
 function bind(current,action,key){key=normalize(key);if(!Object.hasOwn(defaults,action)||!allowed(key))return {ok:false,message:'Use a letter, number, Space or Tab. Escape cancels.'};const conflict=Object.keys(current).find(a=>a!==action&&current[a]===key);if(conflict)return {ok:false,message:display(key)+' is assigned to '+labels[conflict]+'. Choose another key.'};return {ok:true,bindings:{...current,[action]:key}};}
 function save(storage,bindings){try{if(!validate(bindings)||!storage)return false;storage.setItem(KEY,JSON.stringify(bindings));return true;}catch{return false;}}
 function action(bindings,event){if(event.ctrlKey||event.metaKey||event.altKey||event.repeat)return null;return Object.keys(defaults).find(a=>bindings[a]===normalize(event.key))||null;}
 function display(key){return key===' '?'Space':key==='tab'?'Tab':String(key).toUpperCase();}
 function route(bindings,heavy=false){return [bindings.attack0,bindings.attack1,heavy?bindings.attack2:bindings.attack0].map(display).join(' → ');}
 return {KEY,defaults,labels,validate,load,bind,save,action,display,route};
});
