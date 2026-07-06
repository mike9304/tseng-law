import { chromium } from 'playwright';
const url = process.argv[2] || 'http://127.0.0.1:4643/ko';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:1000}})).newPage();
await page.goto(url,{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(1200);
const data = await page.evaluate(() => {
  const top = (el)=>{if(!el)return null;const r=el.getBoundingClientRect();return Math.round(r.top+window.scrollY);};
  const main = document.querySelector('.builder-pub-main');
  const out = {docH: Math.round(document.documentElement.scrollHeight), sections: []};
  if(main){
    const cs=(el)=>{const s=getComputedStyle(el);return {mt:s.marginTop,mb:s.marginBottom,pt:s.paddingTop,pb:s.paddingBottom,h:s.height};};
    for(const ch of main.children){
      const r=ch.getBoundingClientRect();
      out.sections.push({
        nid: ch.getAttribute('data-node-id')||ch.tagName,
        y: Math.round(r.top+window.scrollY),
        h: Math.round(r.height),
        flow: ch.getAttribute('data-builder-flow-section'),
        ...cs(ch),
      });
    }
  }
  return out;
});
console.log(JSON.stringify(data,null,1));
await browser.close();
