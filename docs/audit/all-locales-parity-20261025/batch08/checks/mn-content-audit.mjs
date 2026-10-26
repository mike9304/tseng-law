import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {auditBatch} from '/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs';
const repo='/Users/son7/Projects/tseng-law-all-locales-20261025';
const batch='/Users/son7/tseng-all-language-columns-20261025/batch08';
const research='/Users/son7/tseng-all-language-columns-20261025/batch06/research';
const stage=process.argv[2];if(!/^[a-z0-9-]+$/.test(stage??''))throw new Error('Explicit stage required');
const ids=process.argv.slice(3);if(ids.some(id=>!/^\d{3}$/.test(id)))throw new Error('Invalid explicit ID');
const checks=path.join(batch,'checks'),content=path.join(checks,'mn-overlay-content'),target=path.join(batch,'src/content/columns-mn');
const names=fs.readdirSync(target).filter(n=>n.endsWith('.md')).sort();if(names.length!==6)throw new Error('Expected 6 MN files');
const out=path.join(checks,`mn-content-audit-${stage}.json`);if(fs.existsSync(out))throw new Error('Existing evidence');
fs.mkdirSync(path.join(content,'columns-mn'),{recursive:true});
for(const dir of fs.readdirSync(path.join(repo,'src/content'))){
 if(!dir.startsWith('columns')||dir==='columns-mn')continue;
 const link=path.join(content,dir);if(!fs.existsSync(link))fs.symlinkSync(path.join(repo,'src/content',dir),link);
}
for(const name of fs.readdirSync(path.join(repo,'src/content/columns-mn'))){
 if(names.includes(name))throw new Error('Existing manuscript collision '+name);
 const link=path.join(content,'columns-mn',name);if(!fs.existsSync(link))fs.symlinkSync(path.join(repo,'src/content/columns-mn',name),link);
}
for(const name of names){const link=path.join(content,'columns-mn',name);if(!fs.existsSync(link))fs.symlinkSync(path.join(target,name),link);}
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const tool=path.join(repo,'docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs');
if(sha(fs.readFileSync(tool))!=='3926a274bf544fed7e34339aa8b2636d41a4be79c0aaff898f46fc65595faf4b')throw new Error('Audit tool changed');
const freeze=JSON.parse(fs.readFileSync(path.join(research,'source-freeze.json'),'utf8')),groups=[];
for(const sourceLocale of ['zh-hant','en']){
 const sourceMap={},files=[];
 for(const row of freeze.canonical_rows.filter(r=>r.current_snapshot.startsWith('canonical-snapshots/'+(sourceLocale==='en'?'en-':'zh-')))){
  const source=path.join(research,row.current_snapshot),name=path.basename(row.canonical_path);
  if(ids.length&&!ids.includes(name.slice(0,3)))continue;
  if(sha(fs.readFileSync(source))!==row.current_sha256)throw new Error('Source SHA mismatch');
  const dir=path.join(checks,'mn-frozen-source-aliases');fs.mkdirSync(dir,{recursive:true});const alias=path.join(dir,name);
  if(!fs.existsSync(alias))fs.symlinkSync(source,alias);
  if(fs.realpathSync(alias)!==fs.realpathSync(source))throw new Error('Wrong source alias');
  sourceMap['mn:'+name.replace(/^\d+-/,'').replace(/\.md$/,'')]=alias;
  files.push(path.join(content,'columns-mn',name));
 }
 groups.push(await auditBatch({repoRoot:repo,contentRoot:content,files,sourceMap,sourceLocale,publicationDate:'2026-10-26'}));
}
const report={atUTC:new Date().toISOString(),node:process.version,auditToolSHA256:sha(fs.readFileSync(tool)),selected:groups.reduce((n,g)=>n+g.selectedFiles,0),errors:groups.reduce((n,g)=>n+g.errors,0),semanticStatus:'REVIEW_REQUIRED',groups};
fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({selected:report.selected,errors:report.errors,groups:groups.map(g=>({sourceLocale:g.sourceLocale,files:g.files.map(f=>({file:f.file,errors:f.errors,required:f.reviewItems?.length}))}))},null,2));
process.exitCode=report.errors?1:0;
