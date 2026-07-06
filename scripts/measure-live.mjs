import { chromium } from 'playwright';
// Generic live-site measurement (live is old/different design — no builder nodes)
const url = process.argv[2] || 'https://tseng-law.com/ko';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:1000}})).newPage();
const errs=[]; page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await page.goto(url,{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(1500);
const data = await page.evaluate(() => {
  const top=(el)=>{if(!el)return null;const r=el.getBoundingClientRect();return Math.round(r.top+window.scrollY);};
  const docH=Math.round(document.documentElement.scrollHeight);
  // try to find insights/최근/information section by text
  const all=[...document.querySelectorAll('h1,h2,h3,section,div')];
  const findHeading=(texts)=>{
    for(const el of all){
      const t=(el.textContent||'').trim();
      if(texts.some(tx=>t===tx||t.includes(tx))){
        if(['H1','H2','H3'].includes(el.tagName)) return {tag:el.tagName,text:t.slice(0,40),y:top(el)};
      }
    }
    return null;
  };
  // hero area: first large heading
  const h1=document.querySelector('h1');
  const hero={tag:'H1',text:(h1&&h1.textContent||'').trim().slice(0,50),y:h1?top(h1):null};
  // insights: 최근 인사이트 / 자료 / information
  const insights=findHeading(['인사이트','자료','Insight','최근']);
  // find element at very top y=0 (hero bg)
  const atTop=document.elementFromPoint(720,50);
  return {docH, hero, insights, atTopTag: atTop?atTop.tagName:null};
});
console.log(JSON.stringify({label:url,...data,errors:errs.slice(0,3)},null,2));
await browser.close();
