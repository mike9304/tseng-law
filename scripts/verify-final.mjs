import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({viewport:{width:1440,height:1000}});
const page = await ctx.newPage();
const errs=[]; page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await page.goto('http://127.0.0.1:4643/ko',{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(1500);
const data = await page.evaluate(() => {
  const top=(el)=>{if(!el)return null;const r=el.getBoundingClientRect();return Math.round(r.top+window.scrollY);};
  const hero=document.querySelector("[data-node-id='home-hero-root']");
  const ins=document.querySelector("[data-node-id='home-insights-root']");
  const insH=ins?ins.querySelector('h2,h3'):null;
  const svc=document.querySelector("[data-node-id='home-services-root']");
  // count visible service headings inside services
  const svcHeads=svc?[...svc.querySelectorAll('h3')].filter(h=>h.offsetHeight>0).length:0;
  const faq=document.querySelector("[data-node-id='home-faq-root']");
  const faqHeads=faq?[...faq.querySelectorAll('h3')].filter(h=>h.offsetHeight>0).length:0;
  return {
    heroY: hero?top(hero):null,
    docH: Math.round(document.documentElement.scrollHeight),
    insightsHeadingY: insH?top(insH):null,
    servicesH: svc?Math.round(svc.getBoundingClientRect().height):null,
    servicesVisibleH3: svcHeads,
    faqH: faq?Math.round(faq.getBoundingClientRect().height):null,
    faqVisibleH3: faqHeads,
  };
});
console.log("FINAL VERIFY:",JSON.stringify(data,null,1));
console.log("consoleErrors:",errs.length, errs.slice(0,3));
await page.screenshot({path:'/tmp/tseng-home-round2-top.png', clip:{x:0,y:0,width:1440,height:1000}});
await page.evaluate(()=>window.scrollTo(0,2094));
await page.waitForTimeout(300);
await page.screenshot({path:'/tmp/tseng-home-round2-services.png', clip:{x:0,y:0,width:1440,height:1000}});
await browser.close();
console.log("screenshots: /tmp/tseng-home-round2-top.png, /tmp/tseng-home-round2-services.png");
