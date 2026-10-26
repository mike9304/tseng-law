import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const B='/Users/son7/tseng-all-language-columns-20261025/batch09';
const req=createRequire('/Users/son7/Projects/tseng-law-all-locales-20261025/package.json');
const matter=req('gray-matter');
const before=JSON.parse(fs.readFileSync(path.join(B,'checks/ro-review-r2-before.json'),'utf8'));
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function diff(a,b,at=''){
 if(JSON.stringify(a)===JSON.stringify(b))return [];
 if(a&&b&&typeof a==='object'&&typeof b==='object')return [...new Set([...Object.keys(a),...Object.keys(b)])].flatMap(k=>diff(a[k],b[k],at?at+'.'+k:k));
 return [{field:at,before:a,after:b}];
}
const rows=before.files.map(r=>{
 const text=fs.readFileSync(r.path,'utf8'),old=matter(r.text),now=matter(text);
 const changes=diff(old.data,now.data),id=path.basename(r.path).slice(0,3);
 if(id==='920'){
  if(changes.length!==1||changes[0].field!=='faq.1.a'||old.content!==now.content)throw Error('FAQ-only contract violated');
 }else if(changes.length)throw Error('Unexpected metadata edit');
 return {path:r.path,sha256:hash(text),beforeSHA256:r.sha256,metadataChanges:changes,faqBefore:old.data.faq,faqAfter:now.data.faq,bodyBytesIdentical:old.content===now.content,beforeBodySHA256:hash(old.content),afterBodySHA256:hash(now.content),dates:{published:now.data.published,lastmod:now.data.lastmod,date_display:now.data.date_display},author:now.data.author,caption:now.data.featured_image_caption};
});
if(rows.reduce((n,r)=>n+r.faqAfter.length,0)!==17)throw Error('FAQ count');
const out=path.join(B,'checks/ro-review-r2-metadata.json');if(fs.existsSync(out))throw Error('Preserve old evidence');
fs.writeFileSync(out,JSON.stringify({atUTC:new Date().toISOString(),rows,totalFAQ:17,exactMetadataChangedFields:1},null,2)+'\n');
console.log(JSON.stringify({files:rows.length,FAQ:17,metadataChanges:rows.flatMap(r=>r.metadataChanges.map(d=>({id:path.basename(r.path).slice(0,3),...d}))),sha256:hash(fs.readFileSync(out))}));
