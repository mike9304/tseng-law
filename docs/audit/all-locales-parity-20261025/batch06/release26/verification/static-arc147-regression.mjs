#!/usr/bin/env node
// Parse the completed artifact and compare every ARC version to its own source.
// No HTTP, DOM mutation, build, source edit, native-language or legal approval.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';

const R='/Users/son7/Projects/tseng-law-all-locales-20261025';
const D='/Users/son7/tseng-all-language-columns-20261025/batch06/release26';
const O=path.join(R,'out-all-locales-batch06-release26');
const EXPECTED='5a2931d5afb21ace98b52a7ade1dc0db07d19c5a';
const reportFile=path.join(D,'checks/static-arc147-regression.json');
if(fs.existsSync(reportFile))throw Error('Refusing to overwrite first-run evidence');
const require=createRequire(path.join(R,'package.json'));
const matter=require('gray-matter');
const {parseDocument}=require('htmlparser2');
const {selectAll,selectOne}=require('css-select');
const {textContent}=require('domutils');
const [{unified},{default:remarkParse},{default:remarkGfm}]=await Promise.all([
 import(pathToFileURL(require.resolve('unified')).href),
 import(pathToFileURL(require.resolve('remark-parse')).href),
 import(pathToFileURL(require.resolve('remark-gfm')).href),
]);
const parser=unified().use(remarkParse).use(remarkGfm);
const clean=x=>String(x??'').replace(/\s+/g,' ').trim();
const sha=x=>createHash('sha256').update(x).digest('hex');
const sameSet=(a,b)=>JSON.stringify([...a].sort())===JSON.stringify([...b].sort());
const text=(selector,root)=>textContent(selectOne(selector,root)??{});
const attr=(selector,name,root)=>selectOne(selector,root)?.attribs?.[name]??null;
const plain=node=>node.type==='text'||node.type==='inlineCode'?node.value:(node.children??[]).map(plain).join('');
const segments=node=>['paragraph','heading','tableCell'].includes(node.type)?[clean(plain(node))].filter(Boolean):(node.children??[]).flatMap(segments);
const count=(node,type)=>Number(node.type===type)+(node.children??[]).reduce((n,child)=>n+count(child,type),0);
const inputs=new Map();
const read=p=>{const raw=fs.readFileSync(p);inputs.set(p,sha(raw));return raw;};
const locales=['ko','zh-hant','en','ja','vi','id','th','fil','ar','de','es','fr','pt','zh-hans','ms','ru','tr','it','nl','pl','hi','sv','da','nb','fi','cs','hu','ro','uk','el','he','bn','ur','fa','my','ta','ne','km','mn','sk','bg','hr','sr','sl','lt','lv','et','ca','is'];
const slugs=['taiwan-arc-first-application','taiwan-visa-residence-work-study-family','taiwan-arc-renewal-changes-reentry'];
const tags={'zh-hant':'zh-Hant','zh-hans':'zh-Hans'};
const brands={ko:'법무법인 호정','zh-hant':'昊鼎國際法律事務所',en:'Hovering Law',ja:'昊鼎国際法律事務所'};
const isoModified=new Set(['ko','zh-hant','en']);
// Existing source contracts: core layout title template; builder-backed core date normalization.
for(const file of ['src/lib/seo.ts','src/app/[locale]/layout.tsx','src/app/[locale]/columns/[slug]/page.tsx','src/lib/columns.ts','src/lib/builder/columns/storage.ts','src/lib/consultation/columns-blob-reader.ts','src/lib/column-locales.ts'])read(path.join(R,file));
const buildInfo=JSON.parse(read(path.join(O,'build-info.json')));
if(buildInfo.commit!==EXPECTED)throw Error('Unexpected content commit');
const site=parseDocument(read(path.join(O,'sitemap.xml')).toString(),{xmlMode:true});
const sitemap=new Map(selectAll('url',site).map(node=>[text('loc',node),node]));
const media=JSON.parse(read('/Users/son7/tseng-all-language-columns-20261025/batch06/checks/static-build-release26-media.json'));
if(media.mediaOrigin!=='https://media.tseng-law.com'||media.missingReferences.length)throw Error('Unexpected build media-origin contract');
const mediaByKey=new Map(media.files.map(row=>[row.key,row]));
const heroSourceHashes=new Map();
read(path.join(R,'scripts/static-site/assemble.mjs'));read(path.join(R,'src/app/sitemap.ts'));
const rows=[];
for(const locale of locales)for(const [index,slug]of slugs.entries()){
 const directory=locale==='ko'?'columns':locale==='zh-hant'?'columns-zh':`columns-${locale}`;
 const sourceFile=path.join(R,'src/content',directory,`${704+index}-${slug}.md`);
 const raw=read(sourceFile);const{data,content}=matter(raw.toString());const tree=parser.parse(content);
 const htmlFile=path.join(O,locale,'columns',slug+'.html');const html=read(htmlFile);const doc=parseDocument(html.toString());
 const pathname=`/${locale}/columns/${slug}`,canonical='https://tseng-law.com'+pathname;
 const row={locale,slug,source:{file:path.relative(R,sourceFile),sha256:sha(raw)},artifact:{file:path.relative(O,htmlFile),bytes:html.length,sha256:sha(html)},failures:[]};rows.push(row);
 const check=(ok,message)=>{if(!ok)row.failures.push(message);};
 const alternateNodes=selectAll('link[rel="alternate"][hreflang]',doc);
 const alternates=alternateNodes.map(n=>({lang:n.attribs.hreflang,href:n.attribs.href}));
 const expectedLinks=locales.map(l=>`/${l}/columns/${slug}`);
 const footer=selectAll('.footer-locale-switch a[href]',doc).map(n=>n.attribs.href);
 const structured=selectAll('script[type="application/ld+json"]',doc).map(n=>JSON.parse(textContent(n)));
 const article=structured.find(n=>n['@type']==='Article'),faqSchema=structured.find(n=>n['@type']==='FAQPage');
 const body=clean(text('.column-markdown',doc));const expectedSegments=segments(tree);let cursor=0;const missing=[];
 for(const [i,segment]of expectedSegments.entries()){const at=body.indexOf(segment,cursor);if(at<0)missing.push({index:i,text:segment});else cursor=at+segment.length;}
 const faq=selectAll('.column-faq-item',doc).map(n=>({q:clean(text('.column-faq-question',n)),a:clean(text('.column-faq-answer',n))}));
 const actualImage=attr('.blog-hero-img','src',doc);const imagePath=actualImage?new URL(actualImage,'https://tseng-law.com').pathname:null;
 const sourceTableCount=count(tree,'table'),renderedTableCount=selectAll('.column-markdown table',doc).length;
 const seoTitle=data.seoTitle||data.title;
 const expectedTitle=brands[locale]?`${seoTitle} | ${brands[locale]}`:seoTitle;
 const expectedModified=isoModified.has(locale)?`${data.lastmod}T00:00:00.000Z`:data.lastmod;
 const sitemapNode=sitemap.get(canonical);
 const sitemapLastmod=sitemapNode?text('lastmod',sitemapNode):null;
 const sitemapLinks=sitemapNode?selectAll('[hreflang]',sitemapNode).map(n=>({lang:n.attribs.hreflang,href:n.attribs.href})):[];
 check(attr('html','lang',doc)?.toLowerCase()===(tags[locale]??locale).toLowerCase(),'html language mismatch');
 check(clean(text('h1',doc))===clean(data.title),'visible title differs from own source');
 check(clean(text('title',doc))===clean(expectedTitle),'document SEO title/core brand contract mismatch');
 check(clean(attr('meta[name="description"]','content',doc))===clean(data.summary),'description differs from own source');
 check(clean(attr('meta[property="og:title"]','content',doc))===clean(seoTitle),'OpenGraph title differs');
 check(clean(attr('meta[property="og:description"]','content',doc))===clean(data.summary),'OpenGraph summary differs');
 check(attr('link[rel="canonical"]','href',doc)===canonical,'canonical mismatch');
 check(alternates.length===50&&sameSet(alternates.filter(a=>a.lang!=='x-default').map(a=>new URL(a.href).pathname),expectedLinks),'hreflang exact49 routes mismatch');
 check(sameSet(alternates.filter(a=>a.lang!=='x-default').map(a=>a.lang.toLowerCase()),locales.map(l=>(tags[l]??l).toLowerCase())),'hreflang49 language tags mismatch');
 check(alternates.find(a=>a.lang==='x-default')?.href===`https://tseng-law.com/en/columns/${slug}`,'x-default must point to existing English version');
 check(footer.length===49&&sameSet(footer,expectedLinks),'footer exact49 routes mismatch');
 check(article&&clean(article.headline)===clean(data.title)&&clean(article.description)===clean(data.summary),'Article title/summary mismatch');
 check(article?.datePublished===data.published&&article?.dateModified===expectedModified,'Article publication/modification dates mismatch');
 check(article?.inLanguage?.toLowerCase()===(tags[locale]??locale).toLowerCase(),'Article language mismatch');
 check(article&&!Object.hasOwn(article,'author')&&!attr('meta[name="author"]','content',doc),'public author leakage');
 check(faq.length===data.faq.length&&faq.every((q,i)=>q.q===clean(data.faq[i].q)&&q.a===clean(data.faq[i].a)),'rendered FAQ differs from source');
 check(faqSchema?.mainEntity?.length===data.faq.length&&faqSchema.mainEntity.every((q,i)=>clean(q.name)===clean(data.faq[i].q)&&clean(q.acceptedAnswer?.text)===clean(data.faq[i].a)),'FAQ schema differs from source');
 check(missing.length===0&&expectedSegments.length>0,'source paragraph/heading/table/list text missing or out of order');
 check(sourceTableCount===renderedTableCount,'table count differs from source AST');
 check(imagePath===data.featured_image&&attr('.blog-hero-img','alt',doc)===data.featured_image_alt,'hero identity/alt differs from own source');
 const mediaAsset=mediaByKey.get(data.featured_image.replace(/^\//,''));
 check(mediaAsset&&actualImage===`${media.mediaOrigin}${data.featured_image}`&&fs.existsSync(mediaAsset.source)&&fs.statSync(mediaAsset.source).size===mediaAsset.bytes&&!fs.existsSync(path.join(O,data.featured_image)),'hero media-origin URL/manifest/source/intentional local exclusion mismatch');
 if(mediaAsset&&!heroSourceHashes.has(mediaAsset.key))heroSourceHashes.set(mediaAsset.key,sha(read(mediaAsset.source)));
 check(clean(text('[data-column-image-caption]',doc))===clean(data.featured_image_caption),'image caption differs from source');
 check(!/noindex/i.test(attr('meta[name="robots"]','content',doc)??''),'unexpected noindex');
 check(!!sitemapNode&&sitemapLastmod?.slice(0,10)===data.lastmod,'sitemap URL/lastmod missing or mismatched');
 check(sitemapLinks.length===50&&sameSet(sitemapLinks.filter(a=>a.lang!=='x-default').map(a=>new URL(a.href).pathname),expectedLinks),'sitemap reciprocal49 cluster mismatch');
 check(sitemapLinks.find(a=>a.lang==='x-default')?.href===`https://tseng-law.com/en/columns/${slug}`,'sitemap x-default must point to existing English version');
 row.observed={documentTitle:text('title',doc),canonical:attr('link[rel="canonical"]','href',doc),alternateCount:alternates.length,footerCount:footer.length,articleDates:{published:article?.datePublished,modified:article?.dateModified},bodySegmentCount:expectedSegments.length,bodySegmentSHA256:sha(JSON.stringify(expectedSegments)),missingBodySegments:missing,sourceTableCount,renderedTableCount,faqCount:faq.length,imagePath,sitemapLastmod,sitemapAlternateCount:sitemapLinks.length};
 row.pass=!row.failures.length;
}
const inputsUnchanged=[...inputs].every(([file,hash])=>sha(fs.readFileSync(file))===hash);
const report={startedFromCommit:EXPECTED,finishedAt:new Date().toISOString(),scope:'All147 file-backed ARC versions: metadata/FAQ, ordered source-body blocks, hero identity, table count, exact49 HTML/footer/sitemap reciprocal cluster. Static parsing is not a browser, legal or native-language review. Core title/date expectations follow unchanged existing layout/builder contracts.',parser:{htmlparser2:require('htmlparser2/package.json').version,cssSelect:require('css-select/package.json').version},buildInfo,mediaContract:{origin:media.mediaOrigin,mediaFiles:media.files.length,missingReferences:media.missingReferences,heroSourceHashes:Object.fromEntries(heroSourceHashes)},inputHashes:Object.fromEntries(inputs),inputsUnchanged,rows,summary:{total:rows.length,passed:rows.filter(r=>r.pass).length,failed:rows.filter(r=>!r.pass).length,bodySegments:rows.reduce((n,r)=>n+r.observed.bodySegmentCount,0)}};
fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({summary:report.summary,inputsUnchanged,failures:rows.filter(r=>!r.pass).map(r=>({locale:r.locale,slug:r.slug,failures:r.failures,missing:r.observed.missingBodySegments}))},null,2));
if(rows.length!==147||!inputsUnchanged||rows.some(r=>!r.pass))process.exitCode=1;
