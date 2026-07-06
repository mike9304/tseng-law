import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:1000}})).newPage();
await page.goto('http://127.0.0.1:4643/ko',{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(1200);
const data = await page.evaluate(() => {
  const main=document.querySelector('#main');
  const mainBottom=Math.round(main.getBoundingClientRect().bottom+scrollY);
  const docH=Math.round(document.documentElement.scrollHeight);
  // walk .site children after #main
  const site=document.querySelector('.site');
  const after=[];
  let seen=false;
  for(const ch of [...document.body.querySelectorAll('*')]){
    const r=ch.getBoundingClientRect();
    const top=Math.round(r.top+scrollY);
    if(r.height>0 && top>=mainBottom-2){
      after.push({tag:ch.tagName,id:ch.id||ch.getAttribute('data-node-id')||'',cls:(ch.className&&ch.className.toString)?ch.className.toString().slice(0,40):'',top,h:Math.round(r.height),pos:getComputedStyle(ch).position});
    }
  }
  // dedupe-ish: just the direct meaningful ones near bottom
  return {mainBottom,docH,belowMain:docH-mainBottom, bigTail:after.filter(a=>a.h>20 && a.pos!=='fixed').slice(0,25)};
});
console.log(JSON.stringify(data,null,1));
await browser.close();
