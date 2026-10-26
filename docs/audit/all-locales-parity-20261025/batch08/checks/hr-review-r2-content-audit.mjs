import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {auditBatch} from '/Users/son7/Projects/tseng-law-all-locales-20261025/docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs';
const root='/Users/son7/Projects/tseng-law-all-locales-20261025';
const batch='/Users/son7/tseng-all-language-columns-20261025/batch08';
const contentRoot=path.join(batch,'checks/hr-overlay');
const frozen=JSON.parse(fs.readFileSync(path.join(batch,'checks/hr-input-freeze.json'),'utf8')).files;
const files=fs.readdirSync(path.join(batch,'src/content/columns-hr')).filter(x=>/^(915|920|921)-.*\.md$/.test(x)).sort();
const reports=[];
for (const sourceLocale of ['en','zh-hant']) {
  const sourceDir=sourceLocale==='en'?'columns-en':'columns-zh';
  const prefix=sourceLocale==='en'?'en-':'zh-';
  const selected=files.filter(x=>sourceLocale==='en'?/^(915|916)-/.test(x):! /^(915|916)-/.test(x));
  if (!selected.length) continue;
  const sourceMap={};
  for (const filename of selected) {
    const source=path.join(root,'src/content',sourceDir,filename);
    const snapshot='/Users/son7/tseng-all-language-columns-20261025/batch06/research/canonical-snapshots/'+prefix+filename;
    const digest=crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex');
    if (digest!==frozen[snapshot]) throw new Error('Canonical source changed: '+source);
    sourceMap['hr:'+filename.replace(/^\d+-/,'').replace(/\.md$/,'')]=source;
  }
  reports.push(await auditBatch({repoRoot:root,contentRoot,files:selected.map(x=>path.join(contentRoot,'columns-hr',x)),sourceLocale,sourceMap,publicationDate:'2026-10-26'}));
}
const output={generatedAt:new Date().toISOString(),errors:reports.reduce((n,r)=>n+r.errors,0),reviewItems:reports.reduce((n,r)=>n+r.reviewItems,0),reports};
fs.writeFileSync(path.join(batch,'checks/hr-review-r2-content-audit.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({errors:output.errors,reviewItems:output.reviewItems,files:reports.flatMap(r=>r.files.map(f=>({file:f.file,sha256:f.sha256,source:f.source,errors:f.errors})))} ,null,2));
process.exitCode=output.errors?1:0;
