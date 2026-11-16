'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function verify(){
 const hash=s=>crypto.createHash('sha256').update(s).digest('hex'),read=rel=>fs.readFileSync(path.join(root,rel),'utf8').replace(/\r\n/g,'\n');
 const manifest=JSON.parse(read('dist/offline/build-manifest.json'));let scripts=0;
 for(const [rel,expected]of Object.entries(manifest.sourceHashes)){
  assert.equal(hash(read('public/'+rel)),expected,'Stale source hash: '+rel);
  assert.equal(read('dist/offline/public/'+rel),read('public/'+rel),'Stale packaged source: '+rel);
  if(rel.endsWith('.js')){new vm.Script(read('public/'+rel),{filename:rel});scripts++;}
 }
 const source=read('public/index.html'),names=[...source.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]);
 assert.equal(Object.keys(manifest.sourceHashes).filter(k=>k.endsWith('.js')).length,names.length);
 for(const before of ['command-contract.js','combat-data.js','combat-combos.js','combat-focus.js','combat.js','combat-discovery.js'])assert.ok(names.indexOf(before)>=0&&names.indexOf(before)<names.indexOf('world.js'),'Invalid dependency order: '+before);
 const standalone=read('Youth-Fighter.html');assert.equal(standalone,read('dist/offline/Youth-Fighter.html'),'Stale packaged standalone');assert.doesNotMatch(standalone,/<script src=|<link rel="stylesheet" href=/);
 const bodies=[...standalone.matchAll(/<script(?: data-source="([^"]+)")?>([\s\S]*?)<\/script>/g)];
 for(const [,rel,body]of bodies){new vm.Script(body,{filename:rel||'embedded-assets'});if(rel)assert.equal(body,read('public/'+rel).replace(/<\/script/gi,'<\\/script'),'Stale inline script '+rel);}
 assert.equal(bodies.filter(b=>b[1]).length,names.length);
 for(const rel of ['PLAY-YOUTH-FIGHTER.cmd','Start-Youth-Fighter.cmd','server.js','COMBAT-START-HERE.md','docs/combat/ACCEPTANCE.md'])assert.equal(read(rel),read('dist/offline/'+rel),'Stale launcher/host/guide '+rel);
 return {scripts,inlineScripts:bodies.length,sourceHashes:Object.keys(manifest.sourceHashes).length,artifacts:['public/index.html','Youth-Fighter.html','dist/offline/public/index.html','dist/offline/Youth-Fighter.html'],guiVerified:false};
}
if(require.main===module)console.log(JSON.stringify(verify(),null,2));
module.exports={verify};
