// Run with Node 24. This writes only km-* audit outputs in this batch.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';

const B=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const R='/Users/son7/Projects/tseng-law-all-locales-20261025';
const C=path.join(B,'checks');
const require=createRequire(path.join(R,'package.json'));
const matter=require('gray-matter');
const {auditBatch}=await import(pathToFileURL(path.join(R,'docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const files=fs.readdirSync(path.join(B,'src/content/columns-km')).filter(n=>/^70[4-6]-.+\.md$/.test(n)).sort();
if(files.length!==3)throw new Error(`Expected precisely 3 KM drafts, got ${files.length}`);
const targetDir=path.join(B,'src/content/columns-km');
const union=fs.mkdtempSync(path.join(C,'km-audit-context-'));
let audit;
try {
  for(const name of fs.readdirSync(path.join(R,'src/content'))){
    if(!name.startsWith('columns'))continue;
    if(name==='columns-km')continue;
    fs.symlinkSync(path.join(R,'src/content',name),path.join(union,name));
  }
  fs.mkdirSync(path.join(union,'columns-km'));
  for(const name of fs.readdirSync(path.join(R,'src/content/columns-km'))){
    if(files.includes(name))continue;
    fs.symlinkSync(path.join(R,'src/content/columns-km',name),path.join(union,'columns-km',name));
  }
  for(const name of files)fs.symlinkSync(path.join(targetDir,name),path.join(union,'columns-km',name));
  audit=await auditBatch({repoRoot:R,contentRoot:union,files:files.map(n=>path.join(union,'columns-km',n)),sourceLocale:'en',publicationDate:'2026-10-26'});
  audit.auditContext={method:'Read-only symlink union of current R content plus the three B5 KM drafts; temporary owned km-* context removed after audit.',targetFiles:files.map(n=>({file:path.join(targetDir,n),sha256:hash(fs.readFileSync(path.join(targetDir,n)))}))};
} finally {
  // Every entry in this newly-created directory is an audit symlink or its parent.
  // rm removes symlinks themselves; it never mutates their source targets.
  fs.rmSync(union,{recursive:true});
}
fs.writeFileSync(path.join(C,'km-content-audit.json'),JSON.stringify(audit,null,2)+'\n');

const urls=s=>new Set([...s.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map(m=>m[1]));
const rows=[];
for(const file of files){
 const absolute=path.join(targetDir,file),raw=fs.readFileSync(absolute),{data,content}=matter(raw.toString(),{});
 const en=matter(fs.readFileSync(path.join(R,'src/content/columns-en',file),'utf8'),{});
 const errors=[];const check=(condition,name)=>{if(!condition)errors.push(name)};
 check(data.published==='2026-10-26'&&data.lastmod==='2026-10-26','publication and lastmod');
 check(data.date_display==='26 តុលា 2026','localized publication date');
 check(JSON.stringify(data.audience)==='["km"]','explicit km audience');
 check(data.author==='legal-ai-assistant','internal author');
 check(data.topic==='visa','visa topic');
 check(JSON.stringify(data.categories)==='["ព័ត៌មានច្បាប់តៃវ៉ាន់"]','localized category');
 check(data.featured_image_caption==='ឈុតឆាកប្រឌិត','exact fictional-scene caption');
 check(data.featured_image===en.data.featured_image&&fs.existsSync(path.join(R,'public',data.featured_image)),'original existing image');
 for(const name of ['title','seoTitle','summary','read_time','featured_image_alt'])check(typeof data[name]==='string'&&/[\u1780-\u17ff]/u.test(data[name]),`localized ${name}`);
 check(data.faq?.length===3&&data.faq.every(x=>typeof x.q==='string'&&typeof x.a==='string'&&/[\u1780-\u17ff]/u.test(x.q)&&/[\u1780-\u17ff]/u.test(x.a)),'3 localized FAQs');
 check(!/[\u200b\u200c\u200d\u202a-\u202e\u2066-\u2069]/u.test(raw.toString()),'no manually inserted invisible word/bidi controls');
 const [prose,footer]=content.split('## ប្រភពផ្លូវការ');
 check(Boolean(footer),'localized source heading');
 const all=urls(content),inline=urls(prose),end=urls(footer??'');
 const missingEn=[...urls(en.content)].filter(u=>!all.has(u));
 const missingFooter=[...inline].filter(u=>!end.has(u));
 check(!missingEn.length,'all EN baseline official URLs retained');
 check(!missingFooter.length,'all inline official URLs in final sources');
 check(content.includes('24–25 តុលា 2026'),'source-check dates remain 24–25');
 rows.push({file:absolute,sha256:hash(raw),bytes:raw.length,officialURLs:all.size,missingEn,missingFooter,errors});
}
const report={checkedAt:new Date().toISOString(),node:process.version,icu:process.versions.icu,scope:'Structural checks only; legal meaning, Khmer naturalness, publication and live rendering are not certified.',auditAutomatedStatus:audit.automatedStatus,auditErrors:audit.errors,auditRequiredSemanticReviewItems:audit.reviewItems,rows,errors:audit.errors+rows.reduce((n,r)=>n+r.errors.length,0)};
fs.writeFileSync(path.join(C,'km-structure.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
for(const row of audit.files)for(const error of row.errors)console.error(row.file,error.code,error.message);
process.exitCode=report.errors?1:0;
