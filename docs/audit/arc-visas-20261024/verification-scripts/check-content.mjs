import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const root = '/Users/son7/tseng-arc-visas-20261024';
const repo = path.join(root, 'repo');
const require = createRequire(path.join(repo, 'package.json'));
const matter = require('gray-matter');
const ranges = Object.fromEntries(['ko','en','ja','vi','zh-hant','th','id','hi','fr','de','it','es','pt','ar'].map(l=>[l,[704,706]]));
const folder = locale => ({ko:'columns','zh-hant':'columns-zh'}[locale] || `columns-${locale}`);
const sourceHeading = /^(출처|참고|공식 자료|参考|参照|出典|公式|參考|官方|資料來源|法源|來源|Nguồn|Tài liệu|official sources?|sources?|references?|referensi|références?|fontes|fonti|fuentes|lecturas relacionadas y fuentes|(?:amtliche\s+)?quellen|rechtsquellen|verwendete amtliche texte|(?:(?:gesetzliche|amtliche)\s+)?grundlagen|sumber|rujukan|dasar hukum|ketentuan|แหล่ง|เอกสารอ้างอิง|स्रोत|आधिकारिक स्रोत|المصادر|مصادر)/iu;
const articles = [], errors = [], sourceURLs = new Set();
const allSlugs = {};
for (const locale of Object.keys(ranges)) {
  const dir = path.join(repo,'src/content',folder(locale));
  allSlugs[locale] = new Set(fs.readdirSync(dir).filter(x=>x.endsWith('.md')).map(x=>x.replace(/^\d+-/,'').replace(/\.md$/,'')));
}

function plain(s) {return s.replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[*_`]/g,'');}
function styleDiagnostics(content,locale) {
  const prose=[]; let current=[];
  const flush=()=>{if(current.length)prose.push(plain(current.join(' ')));current=[];};
  for(const line of content.split('\n')) {
    const text=line.trim();
    if(/^#{1,6}\s/.test(text)){flush();if(sourceHeading.test(text.replace(/^#+\s*/,'')))break;continue;}
    if(!text){flush();continue;}
    if(/^(?:[-*+] |\d+[.)] |\||<|!\[)/.test(text)){flush();continue;}
    current.push(text);
  }
  flush();
  const sentenceSegmenter=new Intl.Segmenter(locale,{granularity:'sentence'});
  const wordSegmenter=new Intl.Segmenter(locale,{granularity:'word'});
  const words=s=>[...wordSegmenter.segment(s)].filter(x=>x.isWordLike).map(x=>x.segment.toLocaleLowerCase(locale));
  const sentences=prose.flatMap(p=>[...sentenceSegmenter.segment(p)].map(x=>x.segment.trim()).filter(Boolean));
  const lengths=sentences.map(s=>words(s).length).filter(Boolean);
  const mean=lengths.reduce((a,b)=>a+b,0)/Math.max(1,lengths.length);
  const cv=Math.sqrt(lengths.reduce((sum,n)=>sum+(n-mean)**2,0)/Math.max(1,lengths.length))/Math.max(1,mean);
  const openers=prose.map(p=>words(p)[0]).filter(Boolean);
  const count={};for(const word of openers)count[word]=(count[word]??0)+1;
  const starts=sentences.map(s=>words(s).slice(0,2).join(' '));
  const consecutive=starts.filter((s,i)=>i>0&&s===starts[i-1]).length;
  let runs=0;for(let i=0;i<lengths.length-2;i++){const a=lengths.slice(i,i+3);if(Math.max(...a)<=1.25*Math.min(...a))runs++;}
  return {method:'ICU Intl.Segmenter; diagnostic only, independent locale review required',
    limitation:locale==='th'?'Thai prose without sentence punctuation has ambiguous automated sentence boundaries; paragraph rhythm must be read independently.':null,
    paragraphs:prose.length,sentences:lengths.length,words:words(prose.join(' ')).length,
    meanWords:+mean.toFixed(2),lengthCV:+cv.toFixed(3),shortSentenceShare:+(lengths.filter(x=>x<=8).length/Math.max(1,lengths.length)).toFixed(3),
    similarLengthRunsShare:+(runs/Math.max(1,lengths.length-2)).toFixed(3),consecutiveSameTwoWordStart:consecutive,
    repeatedParagraphOpeners:Object.entries(count).filter(([,n])=>n>2).sort((a,b)=>b[1]-a[1]),
    firstParagraphs:prose.slice(0,2),lastParagraph:prose.at(-1)};
}

for (const [locale,[low,high]] of Object.entries(ranges)) {
  const dir=path.join(repo,'src/content',folder(locale));
  const files=fs.readdirSync(dir).filter(f=>/^\d+-.*\.md$/.test(f)&&+f.split('-')[0]>=low&&+f.split('-')[0]<=high).sort();
  if(files.length!==3)errors.push(`${locale}: expected 3 new articles, found ${files.length}`);
  for(const file of files){
    const relative=`src/content/${folder(locale)}/${file}`, absolute=path.join(repo,relative);
    const raw=fs.readFileSync(absolute,'utf8'); let data,content;
    try{({data,content}=matter(raw));}catch(e){errors.push(`${relative}: YAML ${e.message}`);continue;}
    const bad=message=>errors.push(`${relative}: ${message}`);
    for(const key of ['title','seoTitle','summary','published','lastmod','date_display','read_time','topic'])if(typeof data[key]!=='string'||!data[key].trim())bad(`missing string ${key}`);
    if(data.published!=='2026-10-24'||data.lastmod!=='2026-10-24')bad('publication dates differ from current batch date');
    if(data.author!=='legal-ai-assistant')bad('internal provenance missing');
    if(!Array.isArray(data.audience)||!data.audience.includes(locale))bad('locale audience missing');
    if(!Array.isArray(data.categories)||!data.categories.length)bad('categories missing');
    if(!Array.isArray(data.faq)||data.faq.length!==3||data.faq.some(x=>typeof x.q!=='string'||typeof x.a!=='string'))bad('expected three complete FAQs');
    if(/\*\*|__|<\s*(?:strong|b)(?:\s|>)/i.test(raw.replace(/https?:\/\/[^\s)"']+/g,'')))bad('bold markup');
    if(/^#\s/m.test(content))bad('body H1 duplicates page title');
    if(/\bTBD\b|TODO|FIXME/.test(raw))bad('unfinished placeholder');
    if(data.topic==='criminal'&&!(data.tags??[]).includes('criminal-litigation'))bad('criminal-litigation tag missing');
    const images=[data.featured_image,data.social_image].filter(Boolean);
    for(const src of images){
      if(/^https?:/.test(src)){bad(`external image needs local provenance check: ${src}`);continue;}
      const asset=src.startsWith('../images/')?`/images/blog/${src.slice(10)}`:src;
      if(!fs.existsSync(path.join(repo,'public',asset)))bad(`missing image ${src}`);
    }
    const links=[...content.matchAll(/\[[^\]]+\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)].map(x=>x[1]);
    for(const href of links){
      if(/^https?:/.test(href)){sourceURLs.add(href);continue;}
      if(href.startsWith('mailto:')||href.startsWith('#'))continue;
      const clean=href.split(/[?#]/)[0];
      const col=clean.match(/^\/([^/]+)\/columns\/([^/]+)$/);
      if(col&&!allSlugs[col[1]]?.has(col[2]))bad(`unresolved column ${href}`);
      else if(!col&&!new RegExp(`^/${locale}/(?:contact|services|columns|pricing)/?$`).test(clean))bad(`internal route requires review ${href}`);
    }
    if(!links.some(x=>x.startsWith(`/${locale}/columns/`)))bad('existing related column link missing');
    if(!/^##\s+.+/m.test(content))bad('no meaningful sections');
    if(!content.split('\n').some(s=>/^#{2,3}\s/.test(s)&&sourceHeading.test(s.replace(/^#+\s*/,''))))bad('localized sources heading missing');
    articles.push({locale,file,path:relative,sha256:crypto.createHash('sha256').update(raw).digest('hex'),slug:file.replace(/^\d+-/,'').replace(/\.md$/,''),title:data.title,seoTitle:data.seoTitle,summary:data.summary,faq:data.faq,topic:data.topic,route:`/${locale}/columns/${file.replace(/^\d+-/,'').replace(/\.md$/,'')}`,images,links,style:styleDiagnostics(content,locale)});
  }
}
const output={checkedAt:new Date().toISOString(),base:'048d9c619c31feebfd6d1ffdce2f3304e1b57081',expected:42,actual:articles.length,errors,articles,uniqueSourceURLs:[...sourceURLs].sort()};
fs.mkdirSync(path.join(root,'work/checks'),{recursive:true});
fs.writeFileSync(path.join(root,'work/checks/content-audit.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({articles:articles.length,errors:errors.length,sourceURLs:sourceURLs.size}));
for(const error of errors)console.log(error);
process.exitCode=errors.length?1:0;
