#!/usr/bin/env node
/** Checks a completed static artifact in an actual, isolated Chromium browser. Never builds or deploys. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createHash, randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { startStaticServer } from '/Users/son7/Projects/tseng-law-all-locales-20261025/scripts/static-site/serve-out.mjs';

const ROOT = '/Users/son7/Projects/tseng-law-all-locales-20261025';
const require = createRequire(path.join(ROOT, 'package.json'));
const { chromium } = require('@playwright/test');
const matter = require('gray-matter');
const [{ unified }, { default: remarkParse }, { default: remarkGfm }] = await Promise.all([
  import(pathToFileURL(require.resolve('unified')).href), import(pathToFileURL(require.resolve('remark-parse')).href), import(pathToFileURL(require.resolve('remark-gfm')).href),
]);
const parser = unified().use(remarkParse).use(remarkGfm);
const LOCALES = ['he', 'bn', 'ur', 'fa', 'my', 'ta', 'ne'];
const RTL_LOCALES = new Set(['he', 'ur', 'fa']);
const ARC_LOCALES = ['ko', 'zh-hant', 'en', 'ja', 'vi', 'id', 'th', 'ar', 'de', 'es', 'fr', 'pt', 'it', 'hi', 'ru', 'ms', 'fil', 'tr', 'nl', 'zh-hans', 'sv', 'da', 'nb', 'fi', 'pl', 'cs', 'ro', 'uk', 'bg', 'ca', 'el', 'hr', 'hu', 'is', 'sk', ...LOCALES];
const ALL_LOCALES = ['ko','zh-hant','en','ja','vi','id','th','fil','ar','de','es','fr','pt','zh-hans','ms','ru','tr','it','nl','pl','hi','sv','da','nb','fi','cs','hu','ro','uk','el','he','bn','ur','fa','my','ta','ne','km','mn','sk','bg','hr','sr','sl','lt','lv','et','ca','is'];
const SLUGS = ['taiwan-arc-first-application', 'taiwan-visa-residence-work-study-family', 'taiwan-arc-renewal-changes-reentry'];
const BROWSER_LANGUAGES = { he:'he-IL', bn:'bn-BD', ur:'ur-PK', fa:'fa-IR', my:'my-MM', ta:'ta-IN', ne:'ne-NP', ko:'ko-KR', en:'en-US' }; // Browser language tags are rendering settings, not nationality assumptions.
const LANG_ATTRIBUTES = { 'zh-hans':'zh-Hans', 'zh-hant':'zh-Hant' };
const args = { out:'out-all-locales-batch04-release26-final', report:'/Users/son7/tseng-all-language-columns-20261025/batch04/final-release26/checks/browser-arc-results.json', concurrency:2, phase:'all', commit:'', focus:'' };
for (const option of process.argv.slice(2)) {
  const [key, ...value] = option.replace(/^--/, '').split('=');
  if (!Object.hasOwn(args,key)) throw new Error(`Unknown argument ${option}`);
  args[key] = key==='concurrency' ? Number(value.join('=')) : value.join('=');
}
if (!['all','desktop','mobile','slow','nojs','navigation'].includes(args.phase)) throw new Error('Unknown phase');
if (!['','rtl705'].includes(args.focus)) throw new Error('Unknown focus');
const out = path.resolve(ROOT,args.out);
const reportFile = path.resolve(ROOT,args.report);
if (fs.existsSync(reportFile)) throw new Error('Refusing to overwrite browser evidence');
const screenshots = path.join(path.dirname(reportFile),'browser-screenshots');
fs.mkdirSync(screenshots,{recursive:true});
const clean = (value) => value.replace(/\s+/g,' ').trim();
const sameSet = (actual,expected) => JSON.stringify([...actual].sort())===JSON.stringify([...expected].sort());
const plain = (node) => node.type==='text'||node.type==='inlineCode' ? node.value : (node.children??[]).map(plain).join('');
const countNodes = (node,type) => Number(node.type===type)+(node.children??[]).reduce((total,child)=>total+countNodes(child,type),0);
const sha = (value) => createHash('sha256').update(value).digest('hex');
function bodySegments(node) {
  if(['paragraph','heading','tableCell'].includes(node.type)) return [clean(plain(node))].filter(Boolean);
  return (node.children??[]).flatMap(bodySegments);
}
const manifest = new Map();
const MANUSCRIPTS = LOCALES.flatMap(locale=>SLUGS.map((slug,index)=>({locale,slug,index})));
for (const {locale,slug,index} of MANUSCRIPTS) {
  const file = path.join(ROOT,`src/content/columns-${locale}/${704+index}-${slug}.md`);
  const raw = fs.readFileSync(file,'utf8');
  const {data,content} = matter(raw,{});
  const tree=parser.parse(content);
  const paragraphs = tree.children.filter((node)=>node.type==='paragraph').map((node)=>clean(plain(node))).filter(Boolean);
  manifest.set(`${locale}/${slug}`,{ locale,slug,title:data.title,seoTitle:data.seoTitle??data.title,summary:data.summary,published:data.published,lastmod:data.lastmod,dateDisplay:data.date_display,faq:data.faq,image:data.featured_image,alt:data.featured_image_alt,caption:data.featured_image_caption,sha256:sha(raw),file:path.relative(ROOT,file),bodySamples:[paragraphs[0],paragraphs[Math.floor(paragraphs.length/2)],paragraphs.at(-1)],bodySegments:bodySegments(tree),tableCount:countNodes(tree,'table') });
}
const artifactFiles = [...manifest.values()].map((item)=>path.join(out,item.locale,'columns',`${item.slug}.html`));
for (const file of artifactFiles) if (!fs.existsSync(file)) throw new Error(`Complete artifact required; missing ${file}`);
const artifactManifest=artifactFiles.map(file=>{const data=fs.readFileSync(file);return{file:path.relative(ROOT,file),bytes:data.length,sha256:sha(data)};});
const buildInfo = JSON.parse(fs.readFileSync(path.join(out,'build-info.json'),'utf8'));
if (!/^[a-f0-9]{40}$/.test(args.commit) || buildInfo.commit!==args.commit) throw new Error('Explicit final content commit must match artifact build-info');
const rows = [];
const result = { startedAt:new Date().toISOString(), artifact:out, buildInfo, artifactManifest, frozenProdMirror:null, selectedFocus:args.focus||'all62', scopeNote:'Local unpublished artifact identified by its build-info commit, HTML SHA and manuscript SHA. The 21 new B4 articles are file-backed; HE/UR/FA direction, identifiers, numbers and tables are checked in the actual page. Core CMS mirror parity is outside this verification scope.', browserExecution:{existingArtifact:true,isolatedHeadlessChromium:true,userBrowserProfileUsed:false}, sourceManifest:[...manifest.values()], rows };
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

async function waitReady(page) {
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForLoadState('networkidle',{timeout:30000});
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
  await waitReady(page);
  return dialog;
}

async function inspectArticle(page,row,expected) {
  const content=page.locator('.column-markdown');
  await content.waitFor({state:'visible'});
  const snapshot=await page.evaluate(()=>({
    lang:document.documentElement.lang,title:document.querySelector('h1')?.textContent,
    documentTitle:document.title,description:document.querySelector('meta[name="description"]')?.content,
    ogTitle:document.querySelector('meta[property="og:title"]')?.content,ogDescription:document.querySelector('meta[property="og:description"]')?.content,
    metaAuthor:document.querySelector('meta[name="author"]')?.content??null,
    dateDisplay:document.querySelector('main time:not([data-column-updated])')?.textContent,
    visibleInternalAuthor:(document.body.innerText??'').includes('legal-ai-assistant'),
    structured:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>JSON.parse(s.textContent)),
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
  check(row,clean(snapshot.documentTitle??'')===clean(expected.seoTitle),'document title differs from localized SEO title');
  check(row,clean(snapshot.description??'')===clean(expected.summary),'description differs from localized summary');
  check(row,clean(snapshot.dateDisplay??'')===clean(expected.dateDisplay??''),'visible localized publication date differs from manuscript');
  check(row,clean(snapshot.ogTitle??'')===clean(expected.seoTitle),'Open Graph title differs from localized SEO title');
  check(row,clean(snapshot.ogDescription??'')===clean(expected.summary),'Open Graph description differs from localized summary');
  check(row,!snapshot.metaAuthor&&!snapshot.visibleInternalAuthor,'public author metadata or internal author text leaked');
  const article=snapshot.structured.find(x=>x['@type']==='Article');
  const faqSchema=snapshot.structured.find(x=>x['@type']==='FAQPage');
  check(row,!!article&&clean(article.headline??'')===clean(expected.title)&&clean(article.description??'')===clean(expected.summary),'Article JSON-LD title/summary differs');
  check(row,article?.datePublished===expected.published&&article?.dateModified===expected.lastmod,'Article JSON-LD dates differ');
  check(row,article?.inLanguage?.toLowerCase()===(LANG_ATTRIBUTES[expected.locale]??expected.locale).toLowerCase(),'Article JSON-LD language differs');
  check(row,article&&!Object.hasOwn(article,'author'),'Article JSON-LD public author leaked');
  check(row,faqSchema?.mainEntity?.length===expected.faq.length&&faqSchema.mainEntity.every((x,i)=>clean(x.name??'')===clean(expected.faq[i].q)&&clean(x.acceptedAnswer?.text??'')===clean(expected.faq[i].a)),'FAQ JSON-LD differs from manuscript');
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
  check(row,sameSet(snapshot.footerLinks,paths),'footer must list exactly the 42 published ARC versions');
  check(row,sameSet(snapshot.alternates.filter(a=>a.lang!=='x-default').map(a=>new URL(a.href).pathname),paths),'hreflang cluster differs from the 42 published ARC versions');
  check(row,snapshot.canonical===`https://tseng-law.com/${expected.locale}/columns/${expected.slug}`,'canonical URL differs from current locale and full slug');
  if(snapshot.scrollWidth>snapshot.viewport+1) row.overflowElements=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.right>innerWidth+1&&s.visibility!=='hidden'&&s.display!=='none'&&!el.closest('[aria-hidden="true"]');}).slice(0,12).map(el=>({tag:el.tagName,className:el.className,text:el.textContent.slice(0,100),right:el.getBoundingClientRect().right})));
  return snapshot;
}


/** Read real DOM direction and Range geometry; never inject markup, CSS or bidi characters. */
async function inspectRTL(page,row,expected) {
  if(!RTL_LOCALES.has(expected.locale)) return;
  const rtl=await page.evaluate(()=>{
    const content=document.querySelector('.column-markdown');
    const describe=el=>{const style=getComputedStyle(el),r=el.getBoundingClientRect();return{direction:style.direction,textAlign:style.textAlign,fontFamily:style.fontFamily,left:r.left,right:r.right,width:r.width};};
    const elements={html:describe(document.documentElement),body:describe(document.body),title:describe(document.querySelector('h1')),content:describe(content),paragraph:describe(content.querySelector('p')),faq:describe(document.querySelector('.column-faq-item'))};
    const tokens=[];
    const walker=document.createTreeWalker(content,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()) {
      const node=walker.currentNode;
      const pattern=/23-1|NT\$\s?[0-9][0-9,]*|\b(?:APRC|ARC|NIA|BOCA)\b|[0-9]{2,}(?:,[0-9]{3})*/g;
      for(const match of node.textContent.matchAll(pattern)) {
        const chars=[...match[0]].map((char,index)=>{
          const range=document.createRange();range.setStart(node,match.index+index);range.setEnd(node,match.index+index+1);
          const rect=range.getBoundingClientRect();return{char,x:(rect.left+rect.right)/2,y:(rect.top+rect.bottom)/2,width:rect.width,height:rect.height};
        });
        const visible=chars.every(char=>char.width>0&&char.height>0);
        const sameLine=chars.every(char=>Math.abs(char.y-chars[0].y)<2);
        const leftToRight=chars.every((char,index)=>index===0||char.x>chars[index-1].x);
        tokens.push({text:match[0],context:node.textContent.slice(Math.max(0,match.index-35),match.index+match[0].length+35),tag:node.parentElement.tagName,visible,sameLine,leftToRight,chars});
      }
    }
    const tables=[...content.querySelectorAll('table')].map(table=>{
      const wrap=table.closest('.column-table-wrap'),cells=[...table.rows[0].cells];
      const positions=cells.map(cell=>{const r=cell.getBoundingClientRect();return{text:cell.textContent.trim(),left:r.left,right:r.right,center:(r.left+r.right)/2};});
      const before=wrap?.scrollLeft;
      let extremes=null;
      if(wrap){wrap.scrollLeft=-1e7;const minimum=wrap.scrollLeft;wrap.scrollLeft=1e7;const maximum=wrap.scrollLeft;wrap.scrollLeft=before;extremes={minimum,maximum};}
      return{...describe(table),rowCount:table.rows.length,columns:positions.length,firstRow:positions,domColumnsRightToLeft:positions.every((cell,index)=>index===0||cell.center<positions[index-1].center),wrapper:wrap?{...describe(wrap),scrollWidth:wrap.scrollWidth,clientWidth:wrap.clientWidth,overflowX:getComputedStyle(wrap).overflowX,scrollLeft:before,extremes}:null};
    });
    return{htmlDir:document.documentElement.dir,elements,tokens,tables,identifier231Count:tokens.filter(x=>x.text==='23-1').length};
  });
  row.rtl=rtl;
  check(row,rtl.htmlDir==='rtl'&&Object.values(rtl.elements).every(x=>x.direction==='rtl'),'HE/UR/FA DOM does not inherit genuine RTL direction');
  check(row,rtl.tokens.length>0,'No RTL mixed-script number/identifier samples were measured');
  check(row,rtl.tokens.every(x=>x.visible&&x.sameLine&&x.leftToRight),'Mixed-script number or identifier has hidden, wrapped or reversed character geometry');
  if(expected.slug===SLUGS[2])check(row,rtl.identifier231Count>0,'Article 23-1 was not measured on the renewal page');
  rtl.sourceTableCount=expected.tableCount;
  check(row,rtl.tables.length===expected.tableCount&&rtl.tables.every(table=>table.direction==='rtl'&&table.domColumnsRightToLeft),'Rendered RTL table count or right-to-left column order differs from the source');
  for(const table of rtl.tables) {
    check(row,table.wrapper&&table.wrapper.left>=-1&&table.wrapper.right<=row.viewport.width+1,'RTL table scroll wrapper extends outside viewport');
    if(table.wrapper&&table.wrapper.scrollWidth>table.wrapper.clientWidth+1)check(row,['auto','scroll'].includes(table.wrapper.overflowX)&&table.wrapper.extremes.minimum<table.wrapper.extremes.maximum,'Wide RTL table cannot be scrolled horizontally');
  }
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
    row.imageDecode=await page.locator('.blog-hero-img').evaluate(async(img)=>{await img.decode();return{complete:img.complete,width:img.naturalWidth,height:img.naturalHeight};});
    await waitReady(page);
    await page.waitForTimeout(350);
    await inspectArticle(page,row,item);
    await inspectRTL(page,row,item);
    const prefix=`${mode}-${item.locale}-${SLUGS.indexOf(item.slug)+704}`;
    if(mode==='desktop'||mode==='mobile') {
      row.heroScreenshot=path.relative(ROOT,path.join(screenshots,`${prefix}-hero.png`));
      await page.screenshot({path:path.join(ROOT,row.heroScreenshot)});
      await page.locator('.column-markdown p').first().scrollIntoViewIfNeeded();
      row.bodyScreenshot=path.relative(ROOT,path.join(screenshots,`${prefix}-body.png`));
      await page.screenshot({path:path.join(ROOT,row.bodyScreenshot)});
      if(RTL_LOCALES.has(item.locale)) {
        if(item.tableCount>0) {
          await page.locator('.column-markdown table').first().scrollIntoViewIfNeeded();
          row.rtlTableScreenshot=path.relative(ROOT,path.join(screenshots,`${prefix}-rtl-table.png`));
          await page.screenshot({path:path.join(ROOT,row.rtlTableScreenshot)});
        }
        if(item.slug===SLUGS[2]) {
          await page.locator('.column-markdown p').filter({hasText:'23-1'}).first().scrollIntoViewIfNeeded();
          row.rtlIdentifierScreenshot=path.relative(ROOT,path.join(screenshots,`${prefix}-rtl-identifier.png`));
          await page.screenshot({path:path.join(ROOT,row.rtlIdentifierScreenshot)});
        }
      }
    }
    if(mode!=='nojs') {
      await page.evaluate(()=>scrollTo(0,0));
      const dialog=await openPicker(page);
      const links=await dialog.locator('a[href]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
      row.pickerLinks=links;
      check(row,sameSet(links,ARC_LOCALES.map(locale=>`/${locale}/columns/${item.slug}`)),'opened language picker does not contain exactly the 42 same-slug translations');
      if(mode==='desktop'||mode==='mobile') {
        const destination=LOCALES[(LOCALES.indexOf(item.locale)+1)%LOCALES.length];
        const targetPath=`/${destination}/columns/${item.slug}`;
        const before=await page.evaluate(token=>{window.__arcAuditNavigationToken=token;return performance.timeOrigin;},randomUUID());
        const [navigation]=await Promise.all([page.waitForNavigation({waitUntil:'load',timeout:60000}),dialog.locator(`a[href="${targetPath}"]`).click()]);
        await waitReady(page);
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
    check(row,response?.status()===200,`HTTP ${response?.status()}`);await waitReady(page);await page.waitForTimeout(350);
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
  const executablePath='/Users/son7/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
  if(!fs.existsSync(executablePath))throw new Error('Expected isolated Chromium 1248 not found');
  browser=await chromium.launch({executablePath,headless:true});
  result.browser={engine:'Chromium',version:browser.version(),playwright:require('@playwright/test/package.json').version,executablePath,headless:true,isolatedTemporaryProfiles:true};
  result.base=base;result.slowBase=slowBase;save();
  const tasks=[];
  for(const mode of ['desktop','mobile'])if(args.phase==='all'||args.phase===mode)for(const item of manifest.values())if(!args.focus||(RTL_LOCALES.has(item.locale)&&item.slug===SLUGS[1]))tasks.push(()=>runArticle(browser,base,item,mode));
  if(!args.focus&&(args.phase==='all'||args.phase==='slow'))for(const locale of LOCALES)tasks.push(()=>runArticle(browser,slowBase,manifest.get(`${locale}/${SLUGS[0]}`),'slow'));
  if(!args.focus&&(args.phase==='all'||args.phase==='nojs'))for(const locale of LOCALES)tasks.push(()=>runArticle(browser,base,manifest.get(`${locale}/${SLUGS[0]}`),'nojs'));
  if(!args.focus&&(args.phase==='all'||args.phase==='navigation'))for(const mode of ['desktop','mobile','slow']) {
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
  const expectedCases=args.focus==='rtl705'?6:62;
  if(args.phase==='all'&&rows.length!==expectedCases){result.fatalError=`Expected ${expectedCases} cases, observed ${rows.length}`;result.summary.fatal=true;save();}
  if(result.fatalError||rows.some(row=>!row.pass))process.exitCode=1;
}
