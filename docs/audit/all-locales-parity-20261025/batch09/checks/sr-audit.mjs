import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {auditBatch} from '/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs';
const repo='/Users/son7/Projects/tseng-law-all-locales-20261025';
const batch='/Users/son7/tseng-all-language-columns-20261025/batch09';
const stage=process.argv[2];if(!/^[a-z0-9-]+$/.test(stage??''))throw new Error('An explicit evidence stage is required');
const chosen=new Set(process.argv.slice(3).map(Number));
const checks=path.join(batch,'checks'),content=path.join(checks,'sr-overlay-content'),target=path.join(batch,'src/content/columns-sr');
const names=fs.readdirSync(target).filter(n=>n.endsWith('.md')).sort();if(names.length!==6)throw new Error('Expected six SR manuscripts');
const output=path.join(checks,`sr-content-audit-${stage}.json`);if(fs.existsSync(output))throw new Error('Evidence already exists');
fs.mkdirSync(path.join(content,'columns-sr'),{recursive:true});
for(const dir of fs.readdirSync(path.join(repo,'src/content'))){
 if(!dir.startsWith('columns')||dir==='columns-sr')continue;
 const to=path.join(content,dir);if(!fs.existsSync(to))fs.symlinkSync(path.join(repo,'src/content',dir),to);
}
for(const name of fs.readdirSync(path.join(repo,'src/content/columns-sr'))){
 if(names.includes(name))throw new Error('Existing SR article collision: '+name);
 const to=path.join(content,'columns-sr',name);if(!fs.existsSync(to))fs.symlinkSync(path.join(repo,'src/content/columns-sr',name),to);
}
for(const name of names){const to=path.join(content,'columns-sr',name);if(!fs.existsSync(to))fs.symlinkSync(path.join(target,name),to);}
const freeze=JSON.parse(fs.readFileSync('/Users/son7/tseng-all-language-columns-20261025/batch06/research/source-freeze.json','utf8'));
const groups=[];
for(const sourceLocale of ['zh-hant','en']){
 const accepted=freeze.canonical_rows.filter(row=>row.current_snapshot.startsWith('canonical-snapshots/'+(sourceLocale==='en'?'en-':'zh-')));
 const sourceMap={};const files=[];
 for(const row of accepted){
  const file=path.join('/Users/son7/tseng-all-language-columns-20261025/batch06/research',row.current_snapshot),name=path.basename(row.canonical_path);
  if(chosen.size && !chosen.has(Number(name.split('-')[0])))continue;
  const hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');if(hash!==row.current_sha256)throw new Error('Canonical hash differs');
  const aliasDir=path.join(checks,'sr-frozen-source-aliases');fs.mkdirSync(aliasDir,{recursive:true});
  const alias=path.join(aliasDir,name);
  if(!fs.existsSync(alias))fs.symlinkSync(file,alias);
  if(fs.realpathSync(alias)!==fs.realpathSync(file))throw new Error('Frozen source alias mismatch');
  sourceMap['sr:'+name.replace(/^\d+-/,'').replace(/\.md$/,'')]=alias;
  files.push(path.join(content,'columns-sr',name));
 }
 if(!files.length)continue;
 groups.push(await auditBatch({repoRoot:repo,contentRoot:content,files,sourceMap,sourceLocale,publicationDate:'2026-10-26'}));
}
const result={atUTC:new Date().toISOString(),selected:groups.reduce((n,g)=>n+g.selectedFiles,0),errors:groups.reduce((n,g)=>n+g.errors,0),semanticStatus:'REVIEW_REQUIRED',groups};
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({selected:result.selected,errors:result.errors,semanticStatus:result.semanticStatus,findings:groups.flatMap(g=>g.files.filter(f=>f.errors.length).map(f=>({file:f.file,errors:f.errors})))},null,2));
if(result.errors)process.exitCode=1;
