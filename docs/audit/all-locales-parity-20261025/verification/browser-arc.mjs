#!/usr/bin/env node
/** Checks a completed static artifact in an actual, isolated Chromium browser. Never builds or deploys. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createHash, randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { startStaticServer } from '../../../../scripts/static-site/serve-out.mjs';

const ROOT = fileURLToPath(new URL('../../../../', import.meta.url));
const require = createRequire(path.join(ROOT, 'package.json'));
const { chromium } = require('@playwright/test');
const matter = require('gray-matter');
const [{ unified }, { default: remarkParse }, { default: remarkGfm }] = await Promise.all([
  import('unified'), import('remark-parse'), import('remark-gfm'),
]);
const parser = unified().use(remarkParse).use(remarkGfm);
const LOCALES = ['ru', 'ms', 'fil', 'tr', 'nl', 'zh-hans', 'sv'];
const ARC_LOCALES = ['ko', 'zh-hant', 'en', 'ja', 'vi', 'id', 'th', 'ar', 'de', 'es', 'fr', 'pt', 'it', 'hi', ...LOCALES];
const ALL_LOCALES = ['ko','zh-hant','en','ja','vi','id','th','fil','ar','de','es','fr','pt','zh-hans','ms','ru','tr','it','nl','pl','hi','sv','da','nb','fi','cs','hu','ro','uk','el','he','bn','ur','fa','my','ta','ne','km','mn','sk','bg','hr','sr','sl','lt','lv','et','ca','is'];
const SLUGS = ['taiwan-arc-first-application', 'taiwan-visa-residence-work-study-family', 'taiwan-arc-renewal-changes-reentry'];
const BROWSER_LANGUAGES = { ru:'ru-RU', ms:'ms-MY', fil:'fil-PH', tr:'tr-TR', nl:'nl-NL', 'zh-hans':'zh-CN', sv:'sv-SE', ko:'ko-KR', en:'en-US' };
const LANG_ATTRIBUTES = { 'zh-hans':'zh-Hans', 'zh-hant':'zh-Hant' };
const args = { out:'out-all-locales', report:'docs/audit/all-locales-parity-20261025/checks/browser-arc-results.json', concurrency:2, phase:'all' };
for (const option of process.argv.slice(2)) {
  const [key, ...value] = option.replace(/^--/, '').split('=');
  if (!Object.hasOwn(args,key)) throw new Error(`Unknown argument ${option}`);
  args[key] = key==='concurrency' ? Number(value.join('=')) : value.join('=');
}
if (!['all','desktop','mobile','slow','nojs','navigation'].includes(args.phase)) throw new Error('Unknown phase');
const out = path.resolve(ROOT,args.out);
const reportFile = path.resolve(ROOT,args.report);
const screenshots = path.join(path.dirname(reportFile),'browser-screenshots');
fs.mkdirSync(screenshots,{recursive:true});
const clean = (value) => value.replace(/\s+/g,' ').trim();
const sameSet = (actual,expected) => JSON.stringify([...actual].sort())===JSON.stringify([...expected].sort());
const plain = (node) => node.type==='text'||node.type==='inlineCode' ? node.value : (node.children??[]).map(plain).join('');
const sha = (value) => createHash('sha256').update(value).digest('hex');
function bodySegments(node) {
  if(['paragraph','heading','tableCell'].includes(node.type)) return [clean(plain(node))].filter(Boolean);
  return (node.children??[]).flatMap(bodySegments);
}
const manifest = new Map();
for (const locale of LOCALES) for (const [index,slug] of SLUGS.entries()) {
  const file = path.join(ROOT,`src/content/columns-${locale}/${704+index}-${slug}.md`);
  const raw = fs.readFileSync(file,'utf8');
  const {data,content} = matter(raw,{});
  const tree=parser.parse(content);
  const paragraphs = tree.children.filter((node)=>node.type==='paragraph').map((node)=>clean(plain(node))).filter(Boolean);
  manifest.set(`${locale}/${slug}`,{ locale,slug,title:data.title,faq:data.faq,image:data.featured_image,alt:data.featured_image_alt,caption:data.featured_image_caption,sha256:sha(raw),file:path.relative(ROOT,file),bodySamples:[paragraphs[0],paragraphs[Math.floor(paragraphs.length/2)],paragraphs.at(-1)],bodySegments:bodySegments(tree) });
}
const artifactFiles = [...manifest.values()].map((item)=>path.join(out,item.locale,'columns',`${item.slug}.html`));
for (const file of artifactFiles) if (!fs.existsSync(file)) throw new Error(`Complete artifact required; missing ${file}`);
const artifactManifest=artifactFiles.map(file=>{const data=fs.readFileSync(file);return{file:path.relative(ROOT,file),bytes:data.length,sha256:sha(data)};});
const buildInfo = JSON.parse(fs.readFileSync(path.join(out,'build-info.json'),'utf8'));
const rows = [];
const result = { startedAt:new Date().toISOString(), artifact:out, buildInfo, artifactManifest, frozenProdMirror:null, scopeNote:'Local unpublished artifact, traced by HTML SHA and current manuscript SHA because build-info identifies the uncommitted base. No frozen prod-mirror is available on this machine (data:null). The 21 new articles are file-backed. This does not certify core CMS mirror parity.', browserSkill:{connectedBrowserAvailable:false,standaloneFallback:true}, sourceManifest:[...manifest.values()], rows };
const save = () => fs.writeFileSync(reportFile,`${JSON.stringify(result,null,2)}\n`);
const check = (row,ok,message) => { if(!ok) row.failures.push(message); };

function slowProxy(upstream) {
  const server = http.createServer((request,response) => {
    const incoming = http.request(new URL(request.url,upstream),{method:request.method,headers:{...request.headers,host:new URL(upstream).host,'accept-encoding':'identity'}},(received)=>{
      const headers={...received.headers}; delete headers['content-length']; delete headers['transfer-encoding'];
      response.writeHead(received.statusCode,headers);
      if (!(headers['content-type']??'').includes('text/html')) { received.pipe(response); return; }
      const chunks=[];
      received.on('data',(chunk)=>chunks.push(chunk));
      received.on('end',async()=>{
        const html=Buffer.concat(chunks);
        for(let offset=0;offset<html.length&&!response.destroyed;offset+=1024) {
          response.write(html.subarray(offset,offset+1024));
          await new Promise(resolve=>setTimeout(resolve,12));
        }
        response.end();
      });
      received.on('error',()=>response.destroy());
    });
    response.on('close',()=>incoming.destroy());
    incoming.on('error',(error)=>{if(!response.destroyed){if(!response.headersSent)response.writeHead(502);response.end(error.message);}});
    request.pipe(incoming);
  });
  return new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(server)));
}

async function openPicker(page) {
  const desktop=page.locator('.utility-lang button[aria-haspopup="dialog"]');
  if(await desktop.isVisible()) await desktop.click();
  else {
    await page.locator('header[data-public-site-header] button.mobile-toggle').click();
    await page.locator('#public-mobile-nav-drawer[data-open="true"]').waitFor({state:'visible'});
    await page.locator('.global-language-picker--mobile button[aria-haspopup="dialog"]').click();
  }
  const dialog=page.locator('[role="dialog"][aria-modal="true"]').last();
  await dialog.waitFor({state:'visible'});
  return dialog;
}

async function inspectArticle(page,row,expected) {
  const content=page.locator('.column-markdown');
  await content.waitFor({state:'visible'});
  const snapshot=await page.evaluate(()=>({
    lang:document.documentElement.lang,title:document.querySelector('h1')?.textContent,
    body:document.querySelector('.column-markdown')?.textContent,
    faq:[...document.querySelectorAll('.column-faq-item')].map(item=>({q:item.querySelector('.column-faq-question')?.textContent,a:item.querySelector('.column-faq-answer')?.textContent})),
    image:(()=>{const img=document.querySelector('.blog-hero-img');return img?{src:img.currentSrc||img.src,alt:img.alt,complete:img.complete,width:img.naturalWidth,height:img.naturalHeight}:null;})(),
    caption:document.querySelector('[data-column-image-caption]')?.textContent,
    canonical:document.querySelector('link[rel="canonical"]')?.href,
    alternates:[...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(link=>({lang:link.hreflang,href:link.href})),
    footerLinks:[...document.querySelectorAll('.footer-locale-switch a[href]')].map(a=>a.getAttribute('href')),
    scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,
  }));
  row.observed={...snapshot,body:undefined,bodyLength:snapshot.body?.length,bodySamplesPresent:expected.bodySamples.map(sample=>clean(snapshot.body??'').includes(sample)),bodySegmentCount:expected.bodySegments.length,missingBodySegments:expected.bodySegments.filter(segment=>!clean(snapshot.body??'').includes(segment))};
  check(row,snapshot.lang.toLowerCase()===(LANG_ATTRIBUTES[expected.locale]??expected.locale).toLowerCase(),'document language differs from manuscript locale');
  check(row,clean(snapshot.title??'')===clean(expected.title),'visible title differs from the localized manuscript');
  check(row,row.observed.bodySamplesPresent.every(Boolean),'first/middle/final localized source passages not all present');
  check(row,row.observed.missingBodySegments.length===0,'current manuscript paragraph/heading/table/list text is missing from the rendered body');
  check(row,(snapshot.body?.length??0)>500,'substantive rendered body missing');
  check(row,snapshot.faq.length===expected.faq.length,'FAQ count differs from manuscript');
  check(row,snapshot.faq.every((faq,i)=>clean(faq.q??'')===clean(expected.faq[i]?.q??'')&&clean(faq.a??'')===clean(expected.faq[i]?.a??'')),'FAQ text differs from localized manuscript');
  check(row,!!snapshot.image&&new URL(snapshot.image.src).pathname===expected.image,'hero image identity differs');
  check(row,snapshot.image?.alt===expected.alt,'hero alt text differs from localized manuscript');
  check(row,snapshot.image?.complete&&snapshot.image.width>0,'hero photo did not load');
  check(row,clean(snapshot.caption??'')===clean(expected.caption??''),'image caption differs');
  check(row,snapshot.scrollWidth<=snapshot.viewport+1,`horizontal overflow: ${snapshot.scrollWidth} > ${snapshot.viewport}`);
  const paths=ARC_LOCALES.map(locale=>`/${locale}/columns/${expected.slug}`);
  check(row,sameSet(snapshot.footerLinks,paths),'footer must list exactly the 21 published ARC versions');
  check(row,sameSet(snapshot.alternates.filter(a=>a.lang!=='x-default').map(a=>new URL(a.href).pathname),paths),'hreflang cluster differs from the 21 published ARC versions');
  check(row,snapshot.canonical===`https://tseng-law.com/${expected.locale}/columns/${expected.slug}`,'canonical URL differs from current locale and full slug');
  if(snapshot.scrollWidth>snapshot.viewport+1) row.overflowElements=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.right>innerWidth+1&&s.visibility!=='hidden'&&s.display!=='none'&&!el.closest('[aria-hidden="true"]');}).slice(0,12).map(el=>({tag:el.tagName,className:el.className,text:el.textContent.slice(0,100),right:el.getBoundingClientRect().right})));
  return snapshot;
}

async function runArticle(browser,base,item,mode) {
  const mobile=mode!=='desktop';
  const row={kind:'article',mode,locale:item.locale,slug:item.slug,viewport:{width:mobile?390:1440,height:mobile?900:1000},failures:[],consoleErrors:[],pageErrors:[],failedRequests:[],expectedDisabledScriptBlocks:[],rscRequests:[],documentRequests:[]};
  rows.push(row);
  const context=await browser.newContext({viewport:row.viewport,locale:BROWSER_LANGUAGES[item.locale],reducedMotion:'reduce',javaScriptEnabled:mode!=='nojs'});
  const page=await context.newPage();
  if(mode==='slow')await page.addInitScript(()=>{
    const audit={firstBodyAt:null,bodySeen:false,bodyDisappearances:0,bodyNodeReplacements:0,lastBody:null};
    window.__arcSlowHydrationAudit=audit;
    const observe=()=>{
      const body=document.querySelector('.column-markdown');
      if(body&&(body.textContent??'').trim().length>500){
        if(!audit.bodySeen)audit.firstBodyAt=performance.now();
        if(audit.lastBody&&body!==audit.lastBody)audit.bodyNodeReplacements++;
        audit.lastBody=body;audit.bodySeen=true;
      }else if(audit.bodySeen)audit.bodyDisappearances++;
    };
    new MutationObserver(observe).observe(document,{childList:true,subtree:true,characterData:true});
  });
  page.on('pageerror',error=>row.pageErrors.push(error.message));
  page.on('console',msg=>{if(msg.type()==='error')row.consoleErrors.push(msg.text());});
  page.on('request',request=>{const url=new URL(request.url());if(request.resourceType()==='document')row.documentRequests.push(url.pathname);if(url.searchParams.has('_rsc')||request.headers().rsc)row.rscRequests.push(request.url());if(url.pathname.startsWith('/api/'))row.failures.push(`static page requested API: ${url.pathname}`);});
  page.on('response',response=>{if(response.status()>=400)row.failedRequests.push({url:response.url(),status:response.status()});});
  page.on('requestfailed',request=>{
    const failure={url:request.url(),resourceType:request.resourceType(),error:request.failure()?.errorText};
    // Chromium reports a script preload as `csp` when this test disables JavaScript.
    // Preserve that evidence separately; HTTP errors and every other request failure still fail.
    const expectedBlock=mode==='nojs'&&failure.resourceType==='script'&&failure.error==='csp'&&new URL(failure.url).origin===new URL(base).origin&&new URL(failure.url).pathname.startsWith('/_next/static/chunks/');
    (expectedBlock?row.expectedDisabledScriptBlocks:row.failedRequests).push(failure);
  });
  try {
    const response=await page.goto(`${base}/${item.locale}/columns/${item.slug}`,{waitUntil:'load',timeout:60000});
    check(row,response?.status()===200,`HTTP ${response?.status()}`);
    await page.locator('.blog-hero-img').evaluate(async(img)=>{if(!img.complete)await new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});setTimeout(resolve,15000);});});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(350);
    await inspectArticle(page,row,item);
    const prefix=`${mode}-${item.locale}-${SLUGS.indexOf(item.slug)+704}`;
    if(mode==='desktop'||mode==='mobile') {
      row.heroScreenshot=path.relative(ROOT,path.join(screenshots,`${prefix}-hero.png`));
      await page.screenshot({path:path.join(ROOT,row.heroScreenshot)});
      await page.locator('.column-markdown p').first().scrollIntoViewIfNeeded();
      row.bodyScreenshot=path.relative(ROOT,path.join(screenshots,`${prefix}-body.png`));
      await page.screenshot({path:path.join(ROOT,row.bodyScreenshot)});
    }
    if(mode!=='nojs') {
      await page.evaluate(()=>scrollTo(0,0));
      const dialog=await openPicker(page);
      const links=await dialog.locator('a[href]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
      row.pickerLinks=links;
      check(row,sameSet(links,ARC_LOCALES.map(locale=>`/${locale}/columns/${item.slug}`)),'opened language picker does not contain exactly the 21 same-slug translations');
      if(mode==='desktop'||mode==='mobile') {
        const destination=LOCALES[(LOCALES.indexOf(item.locale)+1)%LOCALES.length];
        const targetPath=`/${destination}/columns/${item.slug}`;
        const before=await page.evaluate(token=>{window.__arcAuditNavigationToken=token;return performance.timeOrigin;},randomUUID());
        const [navigation]=await Promise.all([page.waitForNavigation({waitUntil:'load',timeout:60000}),dialog.locator(`a[href="${targetPath}"]`).click()]);
        const after=await page.evaluate(()=>({timeOrigin:performance.timeOrigin,oldTokenStillPresent:typeof window.__arcAuditNavigationToken!=='undefined',navigationType:performance.getEntriesByType('navigation')[0]?.type}));
        row.switching={destination,targetPath,status:navigation?.status()??null,beforeTimeOrigin:before,...after,url:page.url()};
        check(row,new URL(page.url()).pathname===targetPath,'language click did not keep the current full slug');
        check(row,navigation?.request().resourceType()==='document'&&!after.oldTokenStillPresent&&after.timeOrigin!==before,'language click did not perform a fresh document navigation');
        check(row,clean(await page.locator('h1').innerText())===clean(manifest.get(`${destination}/${item.slug}`).title),'destination title is not in the selected language');
      } else {
        await page.keyboard.press('Escape');
        check(row,await page.locator('.column-markdown').isVisible(),'body disappeared after slow-stream hydration/menu close');
        row.slowHtml={chunkBytes:1024,delayMs:12,hydration:await page.evaluate(()=>{const {lastBody,...audit}=window.__arcSlowHydrationAudit;return audit;})};
        check(row,row.slowHtml.hydration.bodySeen&&row.slowHtml.hydration.bodyDisappearances===0&&row.slowHtml.hydration.bodyNodeReplacements===0,'slow-stream hydration removed or replaced the rendered article body');
      }
    } else {
      await page.locator('.footer-locale-switch summary').click();
      check(row,await page.locator(`.footer-locale-switch a[href="/en/columns/${item.slug}"]`).isVisible(),'native language dropdown unavailable without JavaScript');
    }
  } catch(error) { row.failures.push(error.message); row.exceptionStack=error.stack; }
  finally {
    check(row,row.pageErrors.length===0,'browser page errors occurred');
    check(row,row.consoleErrors.length===0,'browser console errors occurred');
    check(row,row.failedRequests.length===0,'failed HTTP/asset requests occurred');
    check(row,row.rscRequests.length===0,'static navigation requested an RSC endpoint');
    row.pass=row.failures.length===0;
    if(!row.pass) {row.failureScreenshot=path.relative(ROOT,path.join(screenshots,`${mode}-${item.locale}-${SLUGS.indexOf(item.slug)+704}-failure.png`));await page.screenshot({path:path.join(ROOT,row.failureScreenshot)}).catch(()=>{});}
    await context.close(); save(); console.log(`${row.pass?'PASS':'FAIL'} ${mode} ${item.locale}/${item.slug}${row.failures.length?` ${row.failures.join('; ')}`:''}`);
  }
}

async function runNavigation(browser,base,pathname,expectedLanguages,mode) {
  const row={kind:'navigation',mode,pathname,failures:[],pageErrors:[],consoleErrors:[]};rows.push(row);
  const context=await browser.newContext({viewport:{width:mode==='desktop'?1440:390,height:900},locale:pathname.startsWith('/ko')?'ko-KR':'en-US',reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>row.pageErrors.push(e.message));page.on('console',m=>{if(m.type()==='error')row.consoleErrors.push(m.text());});
  try {
    const response=await page.goto(`${base}${pathname}`,{waitUntil:'load',timeout:60000});
    check(row,response?.status()===200,`HTTP ${response?.status()}`);await page.waitForTimeout(350);
    const dialog=await openPicker(page);row.links=await dialog.locator('a[href]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
    check(row,row.links.length===expectedLanguages.length,'language choice count differs');
    check(row,sameSet(row.links.map(href=>href.split('/')[1]),expectedLanguages),'language choice set differs');
    if(pathname.includes('/columns/'))check(row,row.links.every(href=>href.endsWith(pathname.slice(pathname.indexOf('/columns/')))),'legacy column language links changed the full slug');
    await page.keyboard.press('Escape');check(row,await page.locator('main').isVisible(),'main content disappeared after menu use');
    row.screenshot=path.relative(ROOT,path.join(screenshots,`${mode}-${pathname.includes('/columns/')?'ko051':'home'}-navigation.png`));await page.screenshot({path:path.join(ROOT,row.screenshot)});
  }catch(error){row.failures.push(error.message);}
  finally{check(row,!row.pageErrors.length&&!row.consoleErrors.length,'hydration/runtime errors occurred');row.pass=!row.failures.length;await context.close();save();console.log(`${row.pass?'PASS':'FAIL'} ${mode} ${pathname}`);}
}

let server,proxy,browser;
try {
  server=await startStaticServer({root:out,port:0});
  const base=`http://127.0.0.1:${server.address().port}`;
  proxy=await slowProxy(base);const slowBase=`http://127.0.0.1:${proxy.address().port}`;
  const expectedExecutable=chromium.executablePath();
  const executablePath=fs.existsSync(expectedExecutable)?expectedExecutable:expectedExecutable.replace('chromium-1217','chromium-1248');
  browser=await chromium.launch({executablePath,headless:true});
  result.browser={engine:'Chromium',version:browser.version(),playwright:require('@playwright/test/package.json').version,executablePath,headless:true,isolatedTemporaryProfiles:true};
  result.base=base;result.slowBase=slowBase;save();
  const tasks=[];
  for(const mode of ['desktop','mobile'])if(args.phase==='all'||args.phase===mode)for(const item of manifest.values())tasks.push(()=>runArticle(browser,base,item,mode));
  if(args.phase==='all'||args.phase==='slow')for(const locale of LOCALES)tasks.push(()=>runArticle(browser,slowBase,manifest.get(`${locale}/${SLUGS[0]}`),'slow'));
  if(args.phase==='all'||args.phase==='nojs')for(const locale of LOCALES)tasks.push(()=>runArticle(browser,base,manifest.get(`${locale}/${SLUGS[0]}`),'nojs'));
  if(args.phase==='all'||args.phase==='navigation')for(const mode of ['desktop','mobile','slow']) {
    tasks.push(()=>runNavigation(browser,mode==='slow'?slowBase:base,'/en',ALL_LOCALES,mode));
    tasks.push(()=>runNavigation(browser,mode==='slow'?slowBase:base,'/ko/columns/taiwan-left-turn-vs-straight-motorcycle',['ko','zh-hant','en'],mode));
  }
  let next=0;
  await Promise.all(Array.from({length:Math.min(args.concurrency,tasks.length)},async()=>{while(next<tasks.length)await tasks[next++]();}));
} catch(error) { result.fatalError=error.stack; }
finally {
  await browser?.close();
  for(const owned of [proxy,server])if(owned){owned.closeAllConnections();await new Promise(resolve=>owned.close(resolve));}
  result.finishedAt=new Date().toISOString();result.summary={total:rows.length,passed:rows.filter(row=>row.pass).length,failed:rows.filter(row=>!row.pass).length,fatal:!!result.fatalError};save();
  console.log(JSON.stringify(result.summary));
  if(result.fatalError||rows.some(row=>!row.pass))process.exitCode=1;
}
