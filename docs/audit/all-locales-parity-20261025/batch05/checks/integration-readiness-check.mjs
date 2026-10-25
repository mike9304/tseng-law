// Read-only B5 readiness snapshot. Existing content-audit and board policy are not changed.
// Writes only integration-readiness* evidence and a private temporary overlay.
import {readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, mkdtempSync, symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {auditBatch} from '/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs';

const R='/Users/son7/Projects/tseng-law-all-locales-20261025';
const B='/Users/son7/tseng-all-language-columns-20261025/batch05';
const C=path.join(B,'checks');
const require=createRequire(path.join(R,'package.json'));
const matter=require('gray-matter');
const langs=['lt','mn','sr','et','lv','sl','km'];
const hash=b=>createHash('sha256').update(b).digest('hex');
const save=(name,obj)=>{
  const file=path.join(C,name);
  if(existsSync(file)) throw new Error(`Refusing to overwrite ${file}`);
  writeFileSync(file,JSON.stringify(obj,null,2)+'\n');
};
const output='integration-readiness-content-audit.json';
if(existsSync(path.join(C,output)))throw new Error('Snapshot already exists; use a separately named follow-up run, do not overwrite it.');
const startedAt=new Date().toISOString();
const overlay=path.join(mkdtempSync(path.join(tmpdir(),'integration-readiness-')),'content');
mkdirSync(overlay);
const localDirs=new Set(langs.map(l=>`columns-${l}`));
for(const entry of readdirSync(path.join(R,'src/content'),{withFileTypes:true})){
  if(localDirs.has(entry.name))continue;
  symlinkSync(path.join(R,'src/content',entry.name),path.join(overlay,entry.name));
}
const files=[];
const rows=[];
for(const lang of langs){
  const dir=`columns-${lang}`; const targetDir=path.join(overlay,dir);mkdirSync(targetDir);
  for(const entry of readdirSync(path.join(R,'src/content',dir))){
    symlinkSync(path.join(R,'src/content',dir,entry),path.join(targetDir,entry));
  }
  const names=readdirSync(path.join(B,'src/content',dir)).filter(n=>/^70[4-6]-.*\.md$/.test(n)).sort();
  if(names.length!==3)throw new Error(`Expected exactly 3 ${lang} articles`);
  for(const name of names){
    const original=path.join(B,'src/content',dir,name);
    const raw=readFileSync(original); const dest=path.join(targetDir,name);
    if(existsSync(dest))throw new Error(`Collision already present in R: ${dir}/${name}`);
    writeFileSync(dest,raw);files.push(dest);
    const {data,content}=matter(raw.toString('utf8'));
    const heads=[...content.matchAll(/^##\s+(.+)$/gm)];const last=heads.at(-1);
    if(!last)throw new Error(`Missing section heading: ${name}`);
    const before=content.slice(0,last.index),tail=content.slice(last.index);
    const urls=t=>[...t.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m=>m[1]);
    const bu=[...new Set(urls(before))],tu=[...new Set(urls(tail))];
    const source=path.join(R,'src/content/columns-en',name);
    const enURLs=[...new Set(urls(readFileSync(source,'utf8')))];
    const allURLs=[...new Set(urls(content))];
    rows.push({locale:lang,number:name.slice(0,3),file:original,snapshotFile:dest,sha256:hash(raw),bytes:raw.length,
      metadata:{published:data.published,lastmod:data.lastmod,date_display:data.date_display,audience:data.audience,topic:data.topic,author:data.author,caption:data.featured_image_caption,image:data.featured_image,faqCount:data.faq?.length},
      lastSectionHeading:last[1],source:{file:source,sha256:hash(readFileSync(source))},
      urls:{uniqueExternal:allURLs.length,missingEN:enURLs.filter(u=>!allURLs.includes(u)),bodyMissingTail:bu.filter(u=>!tu.includes(u)),body:bu,tail:tu},
      internalLinks:[...content.matchAll(/\]\((\/[^)]+)\)/g)].map(m=>m[1])});
  }
}
const audit=await auditBatch({repoRoot:R,contentRoot:overlay,files,sourceLocale:'en',publicationDate:'2026-10-26'});
save(output,audit);
for(const row of rows){
  const result=audit.files.find(a=>a.sha256===row.sha256 && a.locale===row.locale && a.slug===path.basename(row.file).replace(/^\d{3}-/,'').replace(/\.md$/,''));
  if(!result)throw new Error('Audit row cannot be linked to snapshot');
  row.automatedErrors=result.errors;
  row.board=result.board;
  row.reviewItems=result.reviews.map(r=>({code:r.code,status:r.status,...(r.href?{href:r.href,text:r.text}:{}),...(r.url?{url:r.url}:{})}));
  row.currentUnchangedAtEnd=hash(readFileSync(row.file))===row.sha256;
}
save('integration-readiness-snapshot.json',{startedAt,finishedAt:new Date().toISOString(),overlay,rows,
  audit:{errors:audit.errors,automatedStatus:audit.automatedStatus,semanticStatus:audit.semanticStatus,publicationReady:audit.publicationReady},
  method:'B5 bytes copied once to a private temporary overlay; unselected R corpus is read-only symlinks. Existing content-audit.mjs and current runtime policy run unchanged. No semantic review or public deployment is inferred from automated checks.'});
console.log(JSON.stringify({articles:rows.length,errors:audit.errors,changedWhileChecking:rows.filter(r=>!r.currentUnchangedAtEnd).map(r=>r.file),rows:rows.map(r=>({locale:r.locale,number:r.number,sha256:r.sha256,date:r.metadata.date_display,visible:r.board.visible,errors:r.automatedErrors.map(e=>e.code),missingEN:r.urls.missingEN.length,bodyMissingTail:r.urls.bodyMissingTail.length,lastSection:r.lastSectionHeading}))},null,2));
