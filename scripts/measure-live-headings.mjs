import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:1000}})).newPage();
await page.goto('https://tseng-law.com/ko',{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(1500);
// dismiss any popup/overlay
await page.evaluate(()=>{
  document.querySelectorAll('[class*="popup"],[class*="modal"],[class*="overlay"],[role="dialog"]').forEach(el=>{try{el.style.display='none';}catch(e){}});
  // also click any close button
});
await page.waitForTimeout(300);
const data = await page.evaluate(() => {
  const top=(el)=>{const r=el.getBoundingClientRect();return Math.round(r.top+window.scrollY);};
  const docH=Math.round(document.documentElement.scrollHeight);
  const headings=[...document.querySelectorAll('h1,h2,h3')].map(h=>({tag:h.tagName,text:(h.textContent||'').trim().slice(0,40),y:top(h)})).filter(h=>h.text).sort((a,b)=>a.y-b.y);
  // hero first screen
  const hero=document.querySelector('h1');
  return {docH, heroText:hero?(hero.textContent||'').trim():'', heroY:hero?top(hero):null, headings};
});
console.log(JSON.stringify(data,null,1));
await browser.close();
