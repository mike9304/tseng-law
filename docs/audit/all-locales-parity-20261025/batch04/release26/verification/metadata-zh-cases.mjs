#!/usr/bin/env node
/** Three ZH metadata cases, kept separate from the 62 ARC browser cases. Existing artifact only. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire, Module } from 'node:module';
import { pathToFileURL } from 'node:url';
import { startStaticServer } from '/Users/son7/Projects/tseng-law-all-locales-20261025/scripts/static-site/serve-out.mjs';

const ROOT = '/Users/son7/Projects/tseng-law-all-locales-20261025';
const B4 = '/Users/son7/tseng-all-language-columns-20261025/batch04';
const require = createRequire(path.join(ROOT, 'package.json'));
const { chromium } = require('@playwright/test');
const matter = require('gray-matter');
const esbuild = require('esbuild');
const [{ unified }, { default: remarkParse }, { default: remarkGfm }] = await Promise.all([
  import(pathToFileURL(require.resolve('unified')).href),
  import(pathToFileURL(require.resolve('remark-parse')).href),
  import(pathToFileURL(require.resolve('remark-gfm')).href),
]);
const parser = unified().use(remarkParse).use(remarkGfm);
const args = { out:'out-all-locales-batch04-release26', report:path.join(B4,'release26/checks/metadata-zh-results.json'), commit:'' };
for(const option of process.argv.slice(2)) {
  const [key,...value]=option.replace(/^--/,'').split('=');
  if(!Object.hasOwn(args,key))throw new Error(`Unknown option ${key}`);
  args[key]=value.join('=');
}
const out=path.resolve(ROOT,args.out), reportFile=path.resolve(args.report);
if(fs.existsSync(reportFile))throw new Error('Refusing to overwrite metadata evidence');
const screenshots=path.join(path.dirname(reportFile),'metadata-zh-screenshots');
const sha=data=>createHash('sha256').update(data).digest('hex');
const clean=value=>String(value??'').replace(/\s+/g,' ').trim();
const inputHashes=new Map();
const read=file=>{const data=fs.readFileSync(file);inputHashes.set(file,sha(data));return data;};
const sameSet=(a,b)=>JSON.stringify([...a].sort())===JSON.stringify([...b].sort());
const check=(row,ok,message)=>{if(!ok)row.failures.push(message);};
const plain=node=>node.type==='text'||node.type==='inlineCode'?node.value:(node.children??[]).map(plain).join('');
const segments=node=>['paragraph','heading','tableCell'].includes(node.type)?[clean(plain(node))].filter(Boolean):(node.children??[]).flatMap(segments);
const buildInfo=JSON.parse(read(path.join(out,'build-info.json')));
if(!/^[a-f0-9]{40}$/.test(args.commit)||buildInfo.commit!==args.commit)throw new Error('Final commit must match artifact build-info');
const receipt=JSON.parse(read(path.join(B4,'checks/case-topic-normalization.json')));
if(receipt.rows.length!==3)throw new Error('Expected three metadata corrections');

// Compile the unchanged, actual file loader in memory. No tsconfig/code/cache output is written to R.
// This invokes only the local file-backed loader, never the builder/Blob network reader.
const compiled=esbuild.buildSync({entryPoints:[path.join(ROOT,'src/lib/columns.ts')],absWorkingDir:ROOT,tsconfig:path.join(ROOT,'tsconfig.json'),bundle:true,write:false,platform:'node',format:'cjs',target:'node24',packages:'external',metafile:true});
for(const file of Object.keys(compiled.metafile.inputs))read(path.resolve(ROOT,file));
const moduleFilename=path.join(ROOT,'src/lib/__audit_in_memory_column_loader.cjs');
const loaderModule=new Module(moduleFilename);
loaderModule.filename=moduleFilename;
loaderModule.paths=Module._nodeModulePaths(path.dirname(moduleFilename));
loaderModule._compile(compiled.outputFiles[0].text,moduleFilename);
const { getAllColumnPosts, fileBackedColumnAlternateLocales }=loaderModule.exports;
const loaded=getAllColumnPosts('zh-hant',{cwd:ROOT});
const sourceManifest=[];
for(const item of receipt.rows) {
  const current=read(path.join(ROOT,item.file));
  const original=read(item.before_backup);
  if(sha(current)!==item.after_sha256||sha(original)!==item.before_sha256)throw new Error('Reviewed manuscript SHA changed');
  let reverse=current.toString();
  for(const change of [...item.changes].reverse()) {
    if(reverse.split(change.new).length!==2)throw new Error('Expected exactly one reviewed replacement');
    reverse=reverse.replace(change.new,change.old);
  }
  if(reverse!==original.toString())throw new Error('Two-field reverse proof failed');
  const currentParsed=matter(current.toString()), originalParsed=matter(original.toString());
  if(currentParsed.content!==originalParsed.content||JSON.stringify(currentParsed.data.faq)!==JSON.stringify(originalParsed.data.faq))throw new Error('Body or FAQ changed');
  const slug=path.basename(item.file).replace(/^\d+-/,'').replace(/\.md$/,'');
  const post=loaded.find(post=>post.slug===slug);
  if(!post)throw new Error('Actual file loader did not return '+slug);
  const cluster=fileBackedColumnAlternateLocales(slug);
  if(!sameSet(cluster,['zh-hant']))throw new Error('Expected actual single-locale cluster, not ARC cluster');
  const htmlFile=path.join(out,'zh-hant/columns',slug+'.html');
  const html=read(htmlFile);
  sourceManifest.push({file:item.file,sha256:sha(current),originalSha256:sha(original),exactTwoFieldReverse:true,bodyAndFaqUnchanged:true,slug,originalPublication:currentParsed.data.published,lastmod:currentParsed.data.lastmod,dateDisplay:currentParsed.data.date_display,topic:currentParsed.data.topic,cluster,sourceFaq:currentParsed.data.faq,loader:{slug:post.slug,title:post.title,summary:post.summary,seoTitle:post.seoTitle,topic:post.topic,publicationDate:post.publicationDate,date:post.date,dateDisplay:post.dateDisplay,faq:post.faq,contentSha256:sha(post.content),bodySegments:segments(parser.parse(post.content)),featuredImage:post.featuredImage,featuredImageAlt:post.featuredImageAlt,featuredImageCaption:post.featuredImageCaption},artifact:{file:path.relative(out,htmlFile),sha256:sha(html),bytes:html.length}});
}
read(path.join(out,'zh-hant/columns.html'));
const result={startedAt:new Date().toISOString(),artifact:out,buildInfo,scope:'Three ZH918/920/921 metadata cases. Separate from 62 ARC cases; each actual cluster is zh-hant only. Existing artifact and file-backed loader compared; no builder/Blob request or full legal review.',sourceManifest,loaderExecution:{actualSourceBundledInMemory:true,writtenToR:false,bundleSha256:sha(compiled.outputFiles[0].text)},rows:[]};
fs.mkdirSync(screenshots,{recursive:true});
const save=()=>fs.writeFileSync(reportFile,JSON.stringify(result,null,2)+'\n');
const waitReady=async page=>{await page.evaluate(()=>document.fonts.ready);await page.waitForLoadState('networkidle',{timeout:30000});};
let server,browser;
try {
  server=await startStaticServer({root:out,port:0});
  const base=`http://127.0.0.1:${server.address().port}`;
  const executablePath='/Users/son7/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
  browser=await chromium.launch({executablePath,headless:true});
  result.browser={version:browser.version(),executablePath,isolatedTemporaryProfiles:true,userBrowserProfileUsed:false};
  for(const expected of sourceManifest) {
    const row={kind:'metadata',locale:'zh-hant',slug:expected.slug,failures:[],consoleErrors:[],pageErrors:[],requestFailures:[],rscRequests:[]};
    result.rows.push(row);
    const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'zh-TW',reducedMotion:'reduce'});
    const page=await context.newPage();
    page.on('pageerror',error=>row.pageErrors.push(error.message));
    page.on('console',msg=>{if(msg.type()==='error')row.consoleErrors.push(msg.text());});
    page.on('requestfailed',request=>row.requestFailures.push({url:request.url(),failure:request.failure()}));
    page.on('response',response=>{if(response.status()>=400)row.requestFailures.push({url:response.url(),status:response.status()});});
    page.on('request',request=>{const url=new URL(request.url());if(url.searchParams.has('_rsc')||request.headers().rsc)row.rscRequests.push(request.url());});
    try {
      const articlePath=`/zh-hant/columns/${expected.slug}`;
      const response=await page.goto(base+articlePath,{waitUntil:'load',timeout:60000});
      check(row,response?.status()===200,'Article HTTP status is not 200');
      await page.locator('.column-markdown').waitFor({state:'visible'});
      await page.locator('.blog-hero-img').evaluate(img=>img.decode());
      await waitReady(page);
      row.article=await page.evaluate(()=>({
        pathname:location.pathname,lang:document.documentElement.lang,title:document.querySelector('h1')?.textContent,documentTitle:document.title,
        description:document.querySelector('meta[name="description"]')?.content,canonical:document.querySelector('link[rel="canonical"]')?.href,
        alternates:[...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(link=>({lang:link.hreflang,href:link.href})),
        footerLinks:[...document.querySelectorAll('.footer-locale-switch a[href]')].map(link=>link.getAttribute('href')),
        structured:[...document.querySelectorAll('script[type="application/ld+json"]')].map(node=>JSON.parse(node.textContent)),
        body:document.querySelector('.column-markdown')?.textContent,
        faq:[...document.querySelectorAll('.column-faq-item')].map(node=>({q:node.querySelector('.column-faq-question')?.textContent,a:node.querySelector('.column-faq-answer')?.textContent})),
        displayDate:document.querySelector('main time:not([data-column-updated])')?.textContent,
        image:(()=>{const image=document.querySelector('.blog-hero-img');return{src:image.currentSrc||image.src,alt:image.alt,width:image.naturalWidth,height:image.naturalHeight,complete:image.complete};})(),
      }));
      const article=row.article.structured.find(item=>item['@type']==='Article');
      const faq=row.article.structured.find(item=>item['@type']==='FAQPage');
      check(row,row.article.pathname===articlePath&&row.article.canonical==='https://tseng-law.com'+articlePath,'Canonical or full slug differs');
      check(row,row.article.lang.toLowerCase()==='zh-hant','Document language differs');
      check(row,clean(row.article.title)===clean(expected.loader.title)&&clean(row.article.documentTitle)===clean(expected.loader.seoTitle),'Rendered title differs from actual loader');
      check(row,clean(row.article.description)===clean(expected.loader.summary),'Rendered summary differs from actual loader');
      check(row,article?.datePublished==='2026-10-25'&&article?.dateModified==='2026-10-26','Article publication/modification dates differ');
      check(row,expected.loader.publicationDate==='2026-10-25'&&expected.loader.date==='2026-10-26'&&expected.topic==='litigation'&&expected.loader.topic==='litigation','Actual loader dates or topic differ');
      check(row,clean(row.article.displayDate)===clean(expected.loader.dateDisplay),'Visible original publication date differs');
      row.missingBodySegments=expected.loader.bodySegments.filter(segment=>!clean(row.article.body).includes(segment));
      check(row,row.missingBodySegments.length===0,'Source body block missing in rendered article');
      check(row,row.article.faq.length===expected.sourceFaq.length&&row.article.faq.every((item,index)=>clean(item.q)===clean(expected.sourceFaq[index].q)&&clean(item.a)===clean(expected.sourceFaq[index].a)),'Rendered FAQ differs from unchanged source');
      check(row,faq?.mainEntity?.length===expected.sourceFaq.length&&faq.mainEntity.every((item,index)=>clean(item.name)===clean(expected.sourceFaq[index].q)&&clean(item.acceptedAnswer?.text)===clean(expected.sourceFaq[index].a)),'FAQ JSON-LD differs from unchanged source');
      check(row,sameSet(row.article.alternates.filter(item=>item.lang!=='x-default').map(item=>new URL(item.href).pathname),[articlePath]),'hreflang is not the actual single-locale cluster');
      check(row,row.article.alternates.filter(item=>item.lang==='x-default').every(item=>new URL(item.href).pathname===articlePath),'x-default points outside actual cluster');
      check(row,sameSet(row.article.footerLinks,[articlePath]),'Footer cluster is not zh-hant only');
      check(row,new URL(row.article.image.src).pathname===expected.loader.featuredImage&&row.article.image.alt===expected.loader.featuredImageAlt&&row.article.image.complete&&row.article.image.width>0,'Hero identity, alt or decode differs');
      row.articleScreenshot=path.join(screenshots,`${expected.slug}-article.png`);
      await page.screenshot({path:row.articleScreenshot});

      // Use the real board filter so the observed data-column-topic follows hydration and loader data.
      await page.goto(base+'/zh-hant/columns',{waitUntil:'load',timeout:60000});
      await waitReady(page);
      const chip=page.locator('[data-columns-topic-chip="litigation"]');
      await chip.click();
      await page.waitForFunction(()=>document.querySelector('[data-columns-topic-chip="litigation"]')?.getAttribute('aria-pressed')==='true');
      await waitReady(page);
      const card=page.locator(`a.columns-card[href="${articlePath}"]`);
      await card.waitFor({state:'visible'});
      row.board=await card.evaluate(node=>({href:node.getAttribute('href'),topic:node.getAttribute('data-column-topic'),title:node.querySelector('.columns-card-title')?.textContent??node.querySelector('h3')?.textContent,badge:node.querySelector('.columns-category-badge')?.textContent,activeFilter:document.querySelector('[data-columns-topic-chip="litigation"]')?.getAttribute('aria-pressed'),url:location.href}));
      check(row,row.board.topic==='litigation'&&clean(row.board.badge)==='訴訟與糾紛'&&row.board.href===articlePath&&row.board.activeFilter==='true','Real board does not render the corrected litigation classification');
      check(row,clean(row.board.title)===clean(expected.loader.title),'Board card title differs');
      row.boardScreenshot=path.join(screenshots,`${expected.slug}-litigation-card.png`);
      await card.screenshot({path:row.boardScreenshot});
    }catch(error){row.failures.push(error.stack??error.message);}
    finally {
      check(row,!row.consoleErrors.length&&!row.pageErrors.length&&!row.requestFailures.length,'Runtime, console or request failure occurred');
      check(row,!row.rscRequests.length,'Static metadata case requested Flight');
      if(row.article){row.article.bodyLength=row.article.body?.length;delete row.article.body;}
      row.pass=row.failures.length===0;
      await context.close();save();console.log(`${row.pass?'PASS':'FAIL'} metadata ${expected.slug}`);
    }
  }
}catch(error){result.fatalError=error.stack;}
finally {
  await browser?.close();
  if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
  result.inputSha256=Object.fromEntries(inputHashes);
  result.changedInputs=[...inputHashes].filter(([file,hash])=>sha(fs.readFileSync(file))!==hash).map(([file])=>file);
  if(result.changedInputs.length)result.fatalError='Inputs changed during metadata verification';
  result.finishedAt=new Date().toISOString();
  result.summary={total:result.rows.length,passed:result.rows.filter(row=>row.pass).length,failed:result.rows.filter(row=>!row.pass).length,fatal:!!result.fatalError};
  if(result.rows.length!==3){result.fatalError??='Expected three metadata cases';result.summary.fatal=true;}
  save();console.log(JSON.stringify(result.summary));
  if(result.fatalError||result.rows.some(row=>!row.pass))process.exitCode=1;
}
