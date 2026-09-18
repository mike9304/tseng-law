import { chromium } from '/Users/son7/Projects/tseng-law-en-international-20260917/node_modules/playwright/index.mjs';
const BASE='http://127.0.0.1:3046'; const OUT='/Users/son7/Projects/tseng-law-en-international-20260917/ops/MULTILINGUAL-INTERNATIONAL-v2/fable/MULTILINGUAL-INTERNATIONAL-v2-20260918-c3/screens';
const b=await chromium.launch({headless:true}); const res=[];
for (const l of ['en','ja','ko','zh-hant']) for (const vp of [{n:'1440x900',w:1440,h:900},{n:'390x844',w:390,h:844,m:true}]) {
  const c=await b.newContext({viewport:{width:vp.w,height:vp.h},isMobile:!!vp.m}); let ext=0; await c.route('**/*',r=>{if(new URL(r.request().url()).hostname!=='127.0.0.1'){ext++;return r.abort();}return r.continue();});
  const p=await c.newPage(); const rec={l,vp:vp.n};
  await p.goto(`${BASE}/${l}/taiwan-litigation-lawyer`,{waitUntil:'networkidle',timeout:120000});
  const nav=p.locator('nav.intent-situation-nav'); rec.nav=await nav.count();
  rec.links=await nav.locator('a').evaluateAll(as=>as.map(a=>({t:a.innerText.trim(),h:a.getAttribute('href')})));
  const u=nav.locator('a[data-ml-path="unpaid-invoices"]'); const box=await u.boundingBox(); rec.unpaidY=box&&Math.round(box.y); rec.unpaidInView=!!box&&box.y+box.height<=vp.h;
  if(vp.n==='390x844') await p.screenshot({path:`${OUT}/p05-${l}-390x844.png`});
  await u.click({timeout:10000}); rec.afterClick=await p.waitForURL(/taiwan-debt-recovery-lawyer/,{timeout:15000}).then(()=>new URL(p.url()).pathname).catch(()=>'NO-NAV '+p.url());
  rec.p07h1=await p.locator('h1').first().innerText(); rec.p07h3=(await p.locator('article h3').allInnerTexts()).slice(0,5); rec.p07title=await p.title();
  rec.draftNote=await p.locator('text=/未公開|미공개|unpublished|未公開律師/').count();
  rec.mailto=(await p.locator('a[href^="mailto:"]').count());
  // walk back to civil via P07 link
  const civ=p.locator(`a[href="/${l}/services/civil"]:visible`).first(); await civ.click({timeout:10000}); rec.toCivil=await p.waitForURL(/services\/civil/,{timeout:15000}).then(()=>new URL(p.url()).pathname).catch(()=>'NO-NAV');
  rec.civilReviewBadge=await p.locator('.svc-review-note').count(); rec.civilCommercial=await p.locator('[data-ml-civil-commercial]').count();
  rec.ext=ext; res.push(rec); await c.close();
}
await b.close(); console.log(JSON.stringify(res,null,1));
