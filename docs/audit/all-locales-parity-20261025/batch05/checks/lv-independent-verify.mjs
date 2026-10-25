// Read-only independent LV structure/source/link check. Node 24 required.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
const B=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const R='/Users/son7/Projects/tseng-law-all-locales-20261025';
const C=path.join(B,'checks');
const hash=b=>createHash('sha256').update(b).digest('hex');
const require=createRequire(path.join(R,'package.json'));
const matter=require('gray-matter');
const {auditBatch}=await import(pathToFileURL(path.join(R,'docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs')));
const expected={704:'f47d6be694c2e9601fa457d64598379b5065fa48a94937d5ff11a76d3637c810',705:'de24030f670164d376227740b49a16a3e1883fa29def34a483fda0672a529102',706:'e5b600ba790cdbcd9f225c1703c81e28e7ab49974d504b4ba77b1070d48e700d'};
const target=path.join(B,'src/content/columns-lv');
const names=fs.readdirSync(target).filter(n=>/^70[4-6]-.+\.md$/.test(n)).sort();
if(names.length!==3)throw new Error('Expected exactly three selected LV articles');
for(const n of names)if(hash(fs.readFileSync(path.join(target,n)))!==expected[n.slice(0,3)])throw new Error(`Frozen SHA mismatch: ${n}`);
const context=fs.mkdtempSync(path.join(C,'lv-independent-context-'));
let audit;
try{
 for(const n of fs.readdirSync(path.join(R,'src/content'))){
  if(!n.startsWith('columns')||n==='columns-lv')continue;
  fs.symlinkSync(path.join(R,'src/content',n),path.join(context,n));
 }
 fs.mkdirSync(path.join(context,'columns-lv'));
 for(const n of fs.readdirSync(path.join(R,'src/content/columns-lv'))){
  if(names.includes(n))continue;
  fs.symlinkSync(path.join(R,'src/content/columns-lv',n),path.join(context,'columns-lv',n));
 }
 for(const n of names)fs.symlinkSync(path.join(target,n),path.join(context,'columns-lv',n));
 audit=await auditBatch({repoRoot:R,contentRoot:context,files:names.map(n=>path.join(context,'columns-lv',n)),sourceLocale:'en',publicationDate:'2026-10-26'});
}finally{fs.rmSync(context,{recursive:true});}
const urls=s=>new Set([...s.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map(x=>x[1]));
const rows=names.map(n=>{
 const file=path.join(target,n),raw=fs.readFileSync(file),{data,content}=matter(raw.toString(),{});
 const sourceFile=path.join(R,'src/content/columns-en',n),source=fs.readFileSync(sourceFile),sourceData=matter(source.toString(),{});
 const errors=[];
 const check=(b,msg)=>{if(!b)errors.push(msg)};
 check(data.published==='2026-10-26'&&data.lastmod==='2026-10-26','metadata date');
 check(data.date_display==='2026. gada 26. oktobris','localized date');
 check(data.author==='legal-ai-assistant','internal author');
 check(JSON.stringify(data.audience)==='["lv"]','explicit local audience');
 check(data.featured_image_caption==='Izdomāta aina','exact caption');
 check(data.featured_image===sourceData.data.featured_image,'original image path');
 check(fs.existsSync(path.join(R,'public',data.featured_image)),'image exists');
 check(!/[\u200b\u200c\u200d\u202a-\u202e\u2066-\u2069]/u.test(raw.toString()),'no artificial invisible word/bidi controls');
 const [body,footer]=content.split('## Oficiālie avoti');
 check(Boolean(footer),'official-source footer');
 const missingEN=[...urls(sourceData.content)].filter(u=>!urls(content).has(u));
 const missingFooter=[...urls(body)].filter(u=>!urls(footer??'').has(u));
 check(!missingEN.length,'baseline official URL omitted');
 check(!missingFooter.length,'inline official URL absent from footer');
 const row=audit.files.find(r=>r.slug===n.replace(/^\d+-/,'').replace(/\.md$/,''));
 return{file,sha256:hash(raw),expectedSHA256:expected[n.slice(0,3)],sourceFile,sourceSHA256:hash(source),officialURLCount:urls(content).size,missingEN,missingFooter,board:row.board,auditorErrors:row.errors,additionalErrors:errors,requiredReviewItems:row.reviews.map(r=>r.code)};
});
const report={checkedAt:new Date().toISOString(),node:process.version,scope:'Independent structure and source retention; semantic review is separate.',rows,errors:rows.reduce((n,r)=>n+r.auditorErrors.length+r.additionalErrors.length,0)};
fs.writeFileSync(path.join(C,'lv-independent-content-audit.json'),JSON.stringify(audit,null,2)+'\n');
fs.writeFileSync(path.join(C,'lv-independent-structure.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
process.exitCode=report.errors?1:0;
