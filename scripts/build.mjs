import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Bundle in the same order as the source stylesheets; no package install is needed.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
const styles=['style.css','refinement.css','lower-sections.css','footer.css','playful.css','widgets.css','navigation.css','hover.css','text-motion.css','masbaha.css','polish.css','layout.css','cursor.css'];
const css=styles.map(name=>`/* Source: ${name} */\n${fs.readFileSync(path.join(dist,name),'utf8').trim()}`).join('\n\n')+'\n';
fs.writeFileSync(path.join(dist,'site.css'),css);
const hash=text=>createHash('sha256').update(text).digest('hex').slice(0,10);
const cssHref=`site.css?v=${hash(css)}`;
const scriptHref=`app.js?v=${hash(fs.readFileSync(path.join(dist,'app.js')))}`;
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
let added=false;
html=html.replace(/<link rel="stylesheet" href="[^"]+">/g,()=>{if(added)return '';added=true;return `<link rel="stylesheet" href="${cssHref}">`;});
html=html.replace(/<script src="app\.js(?:\?[^\"]*)?" defer><\/script>/,`<script src="${scriptHref}" defer></script>`);
html=html.replace(/[ \t]+$/gm,'').replace(/\n{3,}/g,'\n\n');
fs.writeFileSync(path.join(dist,'index.html'),html);
console.log(`Bundled ${styles.length} stylesheets (${Math.round(Buffer.byteLength(css)/1024)} KiB)`);
