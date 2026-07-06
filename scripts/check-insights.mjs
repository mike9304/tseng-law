import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:1000}})).newPage();
await page.goto('http://127.0.0.1:4643/ko',{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(1200);
const data = await page.evaluate(() => {
  const top=(el)=>{if(!el)return null;const r=el.getBoundingClientRect();return Math.round(r.top+window.scrollY);};
  const ins=document.querySelector("[data-node-id='home-insights-root']");
  const heads=ins?[...ins.querySelectorAll('h1,h2,h3,h4')].map(h=>({tag:h.tagName,text:(h.textContent||'').trim().slice(0,30),y:top(h)})):[];
  const firstHead=heads[0]||null;
  const insTop=ins?top(ins):null;
  // what's between section top and first heading
  return {insTop, firstHead, allHeads:heads.slice(0,4)};
});
console.log("LOCAL insights:",JSON.stringify(data,null,1));
await browser.close();
