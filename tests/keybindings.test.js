'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),Keys=require('../public/keybindings.js');
test('bindings reject conflicts/modifier shortcuts, persist safely and preserve skill-by-skill combo input',()=>{
 let bindings={...Keys.defaults};assert.equal(Keys.validate(bindings),true);assert.equal(Keys.validate({...bindings,attack0:['z']}),false);assert.equal(Keys.validate({...bindings,attack0:1}),false);assert.equal(Keys.bind(bindings,'guard','1').ok,false);assert.equal(Keys.bind(bindings,'attack0','Escape').ok,false);
 const result=Keys.bind(bindings,'attack0','Z');assert.equal(result.ok,true);bindings=result.bindings;assert.equal(Keys.action(bindings,{key:'z'}),'attack0');assert.equal(Keys.action(bindings,{key:'z',repeat:true}),null);assert.equal(Keys.action(bindings,{key:'z',ctrlKey:true}),null);assert.equal(Keys.route(bindings),'Z → 2 → Z');
 const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};assert.equal(Keys.save(storage,bindings),true);assert.deepEqual(Keys.load(storage),bindings);storage.setItem(Keys.KEY,'{"attack0":"z"}');assert.deepEqual(Keys.load(storage),Keys.defaults);assert.equal(Keys.save(null,bindings),false);assert.deepEqual(Keys.load({getItem(){throw Error();}}),Keys.defaults);
});
