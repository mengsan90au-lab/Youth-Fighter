'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),pub=path.join(root,'public');
function generate(){
 const uri=rel=>{const ext=path.extname(rel).slice(1);return 'data:image/'+(ext==='svg'?'svg+xml':ext)+';base64,'+fs.readFileSync(path.join(pub,rel)).toString('base64');};
 const motion=require('../public/hero-motion-data.js'),art=require('../public/artwork-data.js');
 const images={idle:uri(motion.idle.path)};
 for(const [name,a]of Object.entries(motion.directions))images[name]=uri(a.path);
 for(const style of ['slow','run'])for(const [name,a]of Object.entries(motion.styles[style].directions))images[style+':'+name]=uri(a.path);
 const reviews={};for(const [scene,map]of Object.entries({residential:'sovann-residential-ward',market:'sovann-market-ward',temple:'sovann-temple-ward',bamboo:'bamboo-grove'}))for(const style of ['slow','walk','run'])reviews[scene+'-'+style]=uri('assets/style-review/'+map+'-'+style+'.webp');
 for(const style of ['slow','walk','run'])for(const type of ['journey','views'])reviews[style+'-'+type]=uri('assets/style-review/'+style+'-'+type+'.png');
 const globals={YFHeroMotionImages:images,YFStyleReviewAssets:reviews,YFMotionReviewAssets:Object.fromEntries(['turnaround','journey'].map(k=>[k,uri('assets/motion-review/'+k+'.png')])),YFHeroImage:uri(require('../public/hero-data.js').asset.path),YFResidentialImage:uri(require('../public/residential-data.js').asset.path),YFAtlasImages:Object.fromEntries(art.assets.map(a=>[a.id,uri(a.path)]))};
 const hashes={};const read=rel=>{const s=fs.readFileSync(path.join(pub,rel),'utf8');hashes[rel]=crypto.createHash('sha256').update(s).digest('hex');return s;};
 let html=read('index.html');html=html.replace(/<link rel="stylesheet" href="([^"]+)"\s*\/?\s*>/g,(_,rel)=>'<style>'+read(rel)+'</style>');
 html=html.replace(/<script src="([^"]+)"><\/script>/g,(_,rel)=>'<script data-source="'+rel+'">'+read(rel).replace(/<\/script/gi,'<\\/script')+'</script>');
 const header='<script>'+Object.entries(globals).map(([k,v])=>'window.'+k+'='+JSON.stringify(v)+';').join('\n')+'</script>';
 html=html.replace('</head>',header+'</head>');
 fs.writeFileSync(path.join(root,'Youth-Fighter.html'),html);
 return hashes;
}
if(require.main===module){generate();console.log('Regenerated Youth-Fighter.html from public source and existing assets.');}
module.exports={generate};
