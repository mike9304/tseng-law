import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {auditBatch} from '/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs';
const repo='/Users/son7/Projects/tseng-law-all-locales-20261025';
const batch='/Users/son7/tseng-all-language-columns-20261025/batch04';
const checks=path.join(batch,'checks');
const content=path.join(checks,'my-overlay-content');
const target=path.join(batch,'src/content/columns-my');
const require=createRequire(path.join(repo,'package.json'));
const matter=require('gray-matter');
const sha=(p)=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const names=fs.readdirSync(target).filter(x=>/^70[4-6]-.*\.md$/.test(x)).sort();
fs.mkdirSync(path.join(content,'columns-my'),{recursive:true});
for(const dir of fs.readdirSync(path.join(repo,'src/content'))){
 if(!dir.startsWith('columns'))continue;
 if(dir==='columns-my')continue;
 const to=path.join(content,dir); if(!fs.existsSync(to))fs.symlinkSync(path.join(repo,'src/content',dir),to);
}
for(const name of fs.readdirSync(path.join(repo,'src/content/columns-my'))){
 if(names.includes(name))continue;
 const to=path.join(content,'columns-my',name); if(!fs.existsSync(to))fs.symlinkSync(path.join(repo,'src/content/columns-my',name),to);
}
for(const name of names){const to=path.join(content,'columns-my',name);if(!fs.existsSync(to))fs.symlinkSync(path.join(target,name),to);}
const files=names.map(x=>path.join(content,'columns-my',x));
const sourceMap=Object.fromEntries(names.map(name=>['my:'+name.replace(/^\d+-/,'').replace(/\.md$/,''),path.join(repo,'src/content/columns-en',name)]));
const result=await auditBatch({repoRoot:repo,contentRoot:content,files,sourceMap,sourceLocale:'en',publicationDate:'2026-10-25'});
fs.writeFileSync(path.join(checks,'my-content-audit.json'),JSON.stringify(result,null,2)+'\n');
const sourceFiles=['columns','columns-en','columns-zh'].flatMap(dir=>names.map(n=>path.join(repo,'src/content',dir,n)));
const recent=fs.readdirSync(path.join(repo,'src/content/columns-my')).filter(n=>n.endsWith('.md')).map(name=>{const file=path.join(repo,'src/content/columns-my',name);const d=matter(fs.readFileSync(file,'utf8'),{}).data;return {file,date:String(d.published||d.date||d.lastmod||''),prefix:parseInt(name),title:d.title};}).sort((a,b)=>b.date.localeCompare(a.date)||b.prefix-a.prefix).slice(0,3);
const inputs={atUTC:new Date().toISOString(),files:names.map(name=>({file:path.join(target,name),sha256:sha(path.join(target,name))})),sources:sourceFiles.map(file=>({file,sha256:sha(file)})),recent:recent.map(x=>({...x,sha256:sha(x.file)})),facts:{file:path.join(repo,'docs/audit/all-locales-parity-20261025/research/arc-source-facts.md')},tool:{file:path.join(repo,'docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs')}};
for(const field of ['facts','tool'])inputs[field].sha256=sha(inputs[field].file);
fs.writeFileSync(path.join(checks,'my-inputs.json'),JSON.stringify(inputs,null,2)+'\n');
console.log(JSON.stringify({selected:result.selectedFiles,errors:result.errors,semanticStatus:result.semanticStatus,findings:result.files.filter(f=>f.errors.length).map(f=>({file:f.file,errors:f.errors})),recent:inputs.recent},null,2));
if(result.errors)process.exitCode=1;
