import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const R='/Users/son7/Projects/tseng-law-all-locales-20261025';
const B='/Users/son7/tseng-all-language-columns-20261025/batch08';
const require=createRequire(path.join(R,'package.json')),matter=require('gray-matter');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const proof=JSON.parse(fs.readFileSync(path.join(B,'checks/mn-independent-proof.json'),'utf8'));
const audited=new Map();
for(const name of ['mn-content-audit-r1.json','mn-content-audit-faq-final.json']){
 const p=path.join(B,'checks',name),j=JSON.parse(fs.readFileSync(p,'utf8'));
 for(const g of j.groups)for(const f of g.files)audited.set(path.basename(f.file),{...f,evidence:p,publicationReady:g.publicationReady});
}
const rows=[];
for(const r of proof.rows){
 const text=fs.readFileSync(r.file,'utf8');assert.equal(sha(text),r.sha256);
 const {data,content}=matter(text),id=path.basename(r.file).slice(0,3);
 const canonical=proof.canonical.find(c=>path.basename(c.R)===path.basename(r.file));
 const sourceText=fs.readFileSync(canonical.snapshot,'utf8'),source=matter(sourceText);
 assert.equal(sha(sourceText),canonical.sha256);
 const urls=t=>[...new Set([...t.matchAll(/https?:\/\/[^\s)<>"\]]+/g)].map(m=>m[0]))].sort();
 assert.deepEqual(urls(text),urls(sourceText));
 assert.equal(data.published,'2026-10-26');assert.equal(data.lastmod,'2026-10-26');
 assert.equal(data.date_display,'2026 оны 10 дугаар сарын 26');assert.deepEqual(data.audience,['mn']);
 assert.equal(data.author,'legal-ai-assistant');assert.equal(data.featured_image_caption,'Зохиомол дүр зураг');
 assert.equal(data.topic,source.data.topic);assert.equal(data.featured_image,source.data.featured_image);
 assert.equal(data.faq.length,id==='915'?2:3);assert(data.faq.every(q=>typeof q.q==='string'&&typeof q.a==='string'&&q.q&&q.a));
 assert(!/\*\*|__|<\/?(?:strong|b)(?:\s|>)/i.test(text));assert(!/^# /m.test(content));
 assert(!/[\u202a-\u202e\u2066-\u2069]/u.test(text));
 const a=audited.get(path.basename(r.file));assert.equal(a.sha256,r.sha256);assert.equal(a.errors.length,0);assert.equal(a.publicationReady,false);
 rows.push({file:r.file,sha256:r.sha256,topic:data.topic,FAQ:data.faq,metadata:data,sourceSHA:canonical.sha256,officialURLs:urls(text),sameCanonicalURLSet:true,bodyH1:0,decorativeBold:false,bidiControls:0,auditEvidence:a.evidence,auditErrors:0,requiredItems:a.reviews.filter(x=>x.status==='REQUIRED').length,publicOutputInspected:false});
}
const result={at:new Date().toISOString(),scope:'Independent current-file metadata/source-URL verification; retained exact-SHA content-audit receipts reused without publication approval',rows,totalFAQ:rows.reduce((n,r)=>n+r.FAQ.length,0),officialPerFileTotal:rows.reduce((n,r)=>n+r.officialURLs.length,0),uniqueOfficialURLs:new Set(rows.flatMap(r=>r.officialURLs)).size,errors:0,requiredItems:rows.reduce((n,r)=>n+r.requiredItems,0),newAuditCLIRerun:false};
assert.equal(result.totalFAQ,17);assert.equal(result.officialPerFileTotal,23);assert.equal(result.uniqueOfficialURLs,22);assert.equal(result.requiredItems,33);
const out=path.join(B,'checks/mn-independent-metadata.json');assert(!fs.existsSync(out));fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({files:rows.length,FAQ:result.totalFAQ,officialReferences:result.officialPerFileTotal,uniqueOfficialURLs:result.uniqueOfficialURLs,errors:0,requiredItems:result.requiredItems}));
