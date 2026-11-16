'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),Data=require('../public/combat-data.js'),Combos=require('../public/combat-combos.js');
test('content contracts reject malformed schedules, duplicate IDs and unknown presentation/category',()=>{
 for(const bad of [null,{...Data.skills[0],hits:[]},{...Data.skills[0],hits:[{at:0,scale:1}]},{...Data.skills[0],presentation:{pose:8}},{...Data.skills[0],category:'invented'}])assert.equal(Data.validate([bad]).valid,false);
 assert.equal(Data.validate([Data.skills[0],Data.skills[0]]).valid,false);assert.equal(Combos.validate().valid,true);assert.equal(Combos.validate([{...Combos.counterRoute,window:-1}]).valid,false);assert.ok(Object.isFrozen(Combos.counterRoute.sequence));
});
