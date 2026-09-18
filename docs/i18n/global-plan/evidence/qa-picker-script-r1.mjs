import { chromium } from '/Users/son7/Projects/tseng-law-sea-seo-20260909/node_modules/playwright/index.mjs';
const base='http://localhost:4353'; const out='/Users/son7/Projects/tseng-law-global-picker-20260918/docs/i18n/global-plan/evidence';
const b=await chromium.launch(); const r=[];
for (const l of ['en','ar']) { const p=await b.newPage({viewport:{width:1440,height:900}}); await p.goto(`${base}/${l}/services`,{waitUntil:'networkidle'});
 await p.locator('button[aria-haspopup="dialog"]').first().click(); const d=p.locator('[role="dialog"][aria-modal="true"]'); await d.waitFor(); await p.waitForTimeout(400);
 const h=await p.locator('h1').count(); const dh=await d.locator('h1,h2,h3').evaluateAll(e=>e.map(x=>x.tagName)); const links=await d.locator('a[href]').count();
 await p.keyboard.press('Escape'); await p.waitForTimeout(100); const closed=(await p.locator('[role="dialog"]').count())===0; const ret=await p.evaluate(()=>document.activeElement?.getAttribute('aria-haspopup')==='dialog');
 r.push({l,w:1440,h1Total:h,dialogHeadings:[...new Set(dh)],links,closed,focusReturned:ret}); await p.close(); }
for (const l of ['vi','ko']) { const p=await b.newPage({viewport:{width:390,height:844}}); await p.goto(`${base}/${l}/services`,{waitUntil:'networkidle'});
 await p.locator('button.mobile-toggle').click(); await p.waitForTimeout(400); const drawer=p.locator('#public-mobile-nav-drawer'); const trig=drawer.locator('button[aria-haspopup="dialog"]'); const tv=await trig.isVisible().catch(()=>false);
 let info={}; if(tv){ await trig.click(); const d=p.locator('[role="dialog"][aria-modal="true"]'); await d.waitFor(); await p.waitForTimeout(400);
  const drawerOpen=await drawer.evaluate(e=>e.getAttribute('aria-hidden')!=='true' && getComputedStyle(e).visibility!=='hidden' && getComputedStyle(e).display!=='none').catch(()=>null);
  const box=await d.locator('button[aria-label]').first().boundingBox(); const panel=await d.locator('> div').first().boundingBox(); const links=await d.locator('a[href]').count();
  await p.screenshot({path:`${out}/picker-${l}-390.png`}); info={links,closeBox:box&&{w:Math.round(box.width),h:Math.round(box.height)},panel:panel&&{w:Math.round(panel.width),h:Math.round(panel.height)},drawerStillOpen:drawerOpen}; }
 r.push({l,w:390,drawerTrigger:tv,...info}); await p.close(); }
await b.close(); console.log(JSON.stringify(r,null,1));
