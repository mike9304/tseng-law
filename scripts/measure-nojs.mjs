import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({viewport:{width:1440,height:1000}, javaScriptEnabled:false});
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:4643/ko',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(500);
const data = await page.evaluate(() => {
  const top=(el)=>{if(!el)return null;const r=el.getBoundingClientRect();return Math.round(r.top+window.scrollY);};
  const grab=(id)=>{const el=document.querySelector(`[data-node-id='${id}']`);if(!el)return null;const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return{y:Math.round(r.top+scrollY),h:Math.round(r.height),minH:cs.minHeight,inlineMinH:el.style.minHeight};};
  const sections=['home-hero-root','home-insights-root','home-services-root','home-attorney-root','home-case-results-root','home-stats-root','home-faq-root','home-offices-root','home-contact-root'];
  return {docH:Math.round(document.documentElement.scrollHeight), sections:sections.map(grab)};
});
console.log("NO-JS (pure SSR):");
console.log(JSON.stringify(data,null,1));
await browser.close();
