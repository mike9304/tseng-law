import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(new URL('../package.json', import.meta.url));
const { chromium, webkit, firefox } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const base = process.env.BOARD_BASE || 'http://127.0.0.1:3000';
const phase = process.env.BOARD_PHASE || 'local';
const out = path.resolve(process.env.TRAFFIC_BOARD_EVIDENCE_DIR || '.omo/evidence/traffic-board');
fs.mkdirSync(out, { recursive: true });
const expected = { 'zh-hant': 8, ko: 4, en: 4, ja: 3 };
const results = [];
function check(ok, msg) { if (!ok) throw new Error(msg); }
for (const [engine, launcher] of [['chromium',chromium], ['webkit',webkit], ['firefox',firefox]]) {
  let browser;
  try { browser = await launcher.launch({headless:true}); }
  catch(e) { results.push({engine,unavailable:String(e)}); continue; }
  const sizes = engine === 'chromium' ? [1440,390,320] : engine === 'webkit' ? [390] : [1440];
  for (const width of sizes) for (const locale of Object.keys(expected)) {
    if ((width === 320 || engine === 'firefox') && locale !== 'zh-hant') continue;
    const context = await browser.newContext({ viewport:{width,height:900}, reducedMotion:'reduce' });
    const page = await context.newPage();
    const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
    const row = {engine,width,locale};
    try {
      const r=await page.goto(`${base}/${locale}/traffic-accidents`,{waitUntil:'networkidle',timeout:90000});
      check(r.status()===200,`HTTP ${r.status()}`);
      const board=page.locator('[data-traffic-board]');
      await board.waitFor();
      const n=await page.locator('[data-traffic-board-row]').count(); check(n===expected[locale],`rows ${n}`); row.rows=n;
      row.hrefs=await page.locator('[data-traffic-board-row] h3 a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
      check(row.hrefs.every(h=>h.startsWith(`/${locale}/columns/`)), 'cross-locale link');
      check(new Set(row.hrefs).size===n,'duplicate');
      row.overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1); check(!row.overflow,'horizontal overflow');
      row.canonical=await page.locator('link[rel="canonical"]').getAttribute('href');
      check(row.canonical===`https://tseng-law.com/${locale}/traffic-accidents`,'canonical');
      const schema=await page.locator('script[type="application/ld+json"]').evaluateAll(nodes=>nodes.map(n=>JSON.parse(n.textContent)).find(n=>n['@type']==='CollectionPage'));
      check(schema?.mainEntity?.itemListElement?.length===n,'collection schema count');
      const ax=await new AxeBuilder({page}).include('#articles').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      row.violations=ax.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
      check(row.violations.length===0,'accessibility violations');
      row.brokenImages=await board.locator('img').evaluateAll(nodes=>nodes.filter(n=>n.complete&&n.naturalWidth===0).map(n=>n.src));
      check(row.brokenImages.length===0,'broken thumbnail');
      if (await page.locator('[data-locale-suggestion] button').isVisible()) await page.locator('[data-locale-suggestion] button').click();
      if(engine==='chromium') await page.locator('#articles').screenshot({path:path.join(out,`${phase}-${locale}-${width}.png`)});
      if(engine==='chromium'&&width===390&&locale==='zh-hant') {
        await page.locator('[data-traffic-board-row] h3 a').first().click(); await page.waitForLoadState('networkidle');
        check(page.url().includes('/columns/taiwan-car-door-opening-motorcycle-liability'),'article click');
        check(await page.locator('[data-traffic-diagram="dooring-hypothetical"]').count()===1,'article video figure');
        check(await page.locator('.blog-hero a[href="/zh-hant/traffic-accidents#articles"]').count()===1,'return to traffic collection');
        const related=await page.locator('[data-recommended-for-you="column"] a[href*="/columns/"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
        check(related.length>0&&related.every(h=>row.hrefs.includes(h)),'related articles stay in traffic collection');
        await page.goBack({waitUntil:'networkidle'}); check(await page.locator('[data-traffic-board-row]').count()===8,'back to collection');
        await page.locator('[data-traffic-board] a[href*="subject=evidence"]').click(); await page.waitForLoadState('networkidle');
        check(await page.locator('[data-traffic-board-row]').count()===2,'subject count');
        await page.locator('[data-traffic-board] a[href*="video=1"]').click(); await page.waitForLoadState('networkidle');
        check(await page.locator('[data-traffic-board-row]').count()===1,'combined video count');
        await page.locator('#traffic-board-q').fill('zzzz-no-match'); await page.locator('[data-traffic-board] button[type=submit]').click(); await page.waitForLoadState('networkidle');
        check(await page.locator('[data-traffic-board-empty]').count()===1,'empty');
        check(page.url().includes('subject=evidence')&&page.url().includes('video=1'),'search preserves filters');
        await page.reload({waitUntil:'networkidle'}); check(await page.locator('#traffic-board-q').inputValue()==='zzzz-no-match','query refresh');
        await page.goBack({waitUntil:'networkidle'}); check(await page.locator('[data-traffic-board-row]').count()===1,'back filter');
        await page.locator('[data-traffic-board-clear]').first().click(); await page.waitForLoadState('networkidle');
        check(await page.locator('[data-traffic-board-row]').count()===8,'reset');
        await page.locator('#traffic-board-q').fill('方向燈'); await page.locator('[data-traffic-board] button[type=submit]').click(); await page.waitForLoadState('networkidle');
        check(await page.locator('[data-traffic-board-row]').count()>0,'positive search');
        row.flows='article click, back, subject, video, combined, empty, reload, back filter, clear, positive search';
      }
      check(errors.length===0,`page errors ${errors.join(';')}`);row.pass=true;
    } catch(e) {row.error=String(e);row.errors=errors; try{await page.screenshot({path:path.join(out,`${phase}-FAIL-${engine}-${locale}-${width}.png`),fullPage:true});}catch{}}
    results.push(row); console.log(JSON.stringify({engine,width,locale,pass:row.pass,error:row.error}));
    await context.close();
  }
  await browser.close();
}
// Progressive enhancement: all controls also work with JavaScript disabled.
const browser=await chromium.launch({headless:true}); const context=await browser.newContext({javaScriptEnabled:false,reducedMotion:'reduce',viewport:{width:390,height:844}});const page=await context.newPage();
try {
 await page.goto(`${base}/zh-hant/traffic-accidents`,{waitUntil:'load'});
 check(await page.locator('[data-traffic-board-row]').count()===8,'no-js initial');
 await page.locator('#traffic-board-q').fill('警方'); await Promise.all([page.waitForURL(/q=/), page.locator('[data-traffic-board] button[type=submit]').click()]); await page.waitForLoadState('networkidle');
 check(await page.locator('[data-traffic-board-row]').count()>0,'no-js search');
 await Promise.all([page.waitForURL(u=>!u.searchParams.has('q')),page.locator('[data-traffic-board-clear]').first().click()]); await page.waitForLoadState('networkidle');
 check(await page.locator('[data-traffic-board-row]').count()===8,'no-js reset');results.push({noJs:true,pass:true});
}catch(e){results.push({noJs:true,error:String(e)});}finally{await browser.close();}
fs.writeFileSync(path.join(out,`${phase}-browser-results.json`),JSON.stringify(results,null,2));
console.log('Passed',results.filter(r=>r.pass).length,'/',results.length);
if(results.some(r=>r.error))process.exitCode=1;
