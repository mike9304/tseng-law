#!/usr/bin/env node
// Supplemental screenshot evidence only; reads the completed local artifact and cached public HTML.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { startStaticServer } from '../../../../scripts/static-site/serve-out.mjs';
const ROOT=fileURLToPath(new URL('../../../../',import.meta.url));
const require=createRequire(path.join(ROOT,'package.json'));
const {chromium}=require('@playwright/test');
const checks=path.join(ROOT,'docs/audit/all-locales-parity-20261025/checks');
const shots=path.join(checks,'browser-screenshots');
const server=await startStaticServer({root:path.join(ROOT,'out-all-locales'),port:0});
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:chromium.executablePath().replace('chromium-1217','chromium-1248')});
const result={startedAt:new Date().toISOString(),rows:[],previousPublic:[]};
try {
  const prior=JSON.parse(fs.readFileSync('/private/tmp/tseng-packer-experiment-20261025/manifest.json','utf8'));
  for(const locale of ['ms','fil','tr','zh-hans','nl']) {
    const sample=prior.find(row=>row.locale===locale);
    const bytes=fs.readFileSync(sample.path),html=bytes.toString('utf8');
    if(createHash('sha256').update(bytes).digest('hex')!==sample.sha256)throw Error('Public cached sample hash changed');
    result.previousPublic.push({locale,url:sample.url,sha256:sample.sha256,englishConsultation:html.includes('>Book Consultation<'),englishAttorney:html.includes('>Consulting Attorney<'),image:html.match(/class="authority-card-photo"><img src="([^"]+)"/)?.[1]??null,englishTableHint:html.includes('If the table extends beyond the screen, scroll horizontally to see the rest.')});
  }
  for(const slug of ['taiwan-visa-residence-work-study-family','taiwan-company-establishment-advanced-1']) {
    const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'nl-NL',reducedMotion:'reduce'});
    const page=await context.newPage(),row={kind:'authority',slug,requests:[]};result.rows.push(row);
    page.on('response',response=>{if(response.url().includes('wei-tseng-official'))row.requests.push({url:response.url(),status:response.status()});});
    await page.goto(`${base}/nl/columns/${slug}`,{waitUntil:'load'});
    const photo=page.locator('.authority-card-photo img');await photo.scrollIntoViewIfNeeded();
    await photo.evaluate(img=>new Promise(resolve=>{if(img.complete&&img.naturalWidth>0)return resolve();const timeout=setTimeout(resolve,20000);img.addEventListener('load',()=>{clearTimeout(timeout);resolve();},{once:true});img.addEventListener('error',()=>{clearTimeout(timeout);resolve();},{once:true});}));
    await photo.evaluate(img=>img.decode());
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    row.image=await photo.evaluate(img=>({src:img.currentSrc,complete:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,display:getComputedStyle(img).display,opacity:getComputedStyle(img).opacity,visibility:getComputedStyle(img).visibility,bounds:img.getBoundingClientRect().toJSON(),parentBounds:img.parentElement.getBoundingClientRect().toJSON()}));
    row.screenshot=`browser-screenshots/desktop-nl-${slug.includes('visa-')?'705':'013'}-authority-loaded.png`;
    await page.screenshot({path:path.join(checks,row.screenshot)});await context.close();
  }
  const views=[
    {path:'/zh-hans/columns/taiwan-arc-renewal-changes-reentry',width:390,name:'mobile-zh-hans-706'},
    {path:'/sv/columns/taiwan-arc-first-application',width:1440,name:'desktop-sv-704'},
    {path:'/en',width:1440,name:'desktop-home'},
    {path:'/ko/columns/taiwan-left-turn-vs-straight-motorcycle',width:390,name:'mobile-ko051'},
  ];
  for(const view of views) {
    const context=await browser.newContext({viewport:{width:view.width,height:900},reducedMotion:'reduce'});
    const page=await context.newPage();await page.goto(`${base}${view.path}`,{waitUntil:'load'});
    const desktop=page.locator('.utility-lang button[aria-haspopup="dialog"]');
    if(await desktop.isVisible())await desktop.click();
    else {await page.locator('header[data-public-site-header] button.mobile-toggle').click();await page.locator('.global-language-picker--mobile button[aria-haspopup="dialog"]').click();}
    const dialog=page.locator('[role="dialog"][aria-modal="true"]').last();await dialog.waitFor({state:'visible'});
    const row={kind:'menu',path:view.path,links:await dialog.locator('a[href]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href'))),screenshot:`browser-screenshots/${view.name}-picker.png`};result.rows.push(row);
    await page.screenshot({path:path.join(checks,row.screenshot)});await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});
    if(await page.locator('.column-faq').count()) {
      await page.locator('.column-faq').scrollIntoViewIfNeeded();
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      row.faq=await page.locator('.column-faq').evaluate(el=>({text:el.textContent,bounds:el.getBoundingClientRect().toJSON(),scrollY,bodyHeight:document.documentElement.scrollHeight,ancestors:[el,el.parentElement,el.parentElement.parentElement].map(e=>({tag:e.tagName,className:e.className,visibility:getComputedStyle(e).visibility,opacity:getComputedStyle(e).opacity,display:getComputedStyle(e).display}))}));
      row.faqScreenshot=`browser-screenshots/${view.name}-faq.png`;await page.screenshot({path:path.join(checks,row.faqScreenshot)});
    }
    await context.close();
  }
} catch(error) { result.error=error.stack; process.exitCode=1; }
finally {await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));result.finishedAt=new Date().toISOString();fs.writeFileSync(path.join(checks,'browser-detail-views.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));}
