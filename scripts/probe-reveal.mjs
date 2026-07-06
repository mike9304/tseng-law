import { chromium } from '@playwright/test';
const url=process.argv[2];const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1440,height:900}});
const errs=[];p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,140));});
p.on('pageerror',e=>errs.push('PAGEERR: '+String(e).slice(0,140)));
try{await p.goto(url,{waitUntil:'networkidle',timeout:45000});}catch(e){console.error(e.message);}
await p.waitForTimeout(1500);
const h=await p.evaluate(()=>document.body.scrollHeight);
for(let y=0;y<h;y+=600){await p.evaluate(_y=>scrollTo(0,_y),y);await p.waitForTimeout(250);}
await p.waitForTimeout(800);
const r=await p.evaluate(()=>{
  const out=[];
  document.querySelectorAll('.reveal-stagger').forEach((el,i)=>{
    const first=el.querySelector('*');
    out.push({i,cls:el.className,childOpacity:first?getComputedStyle(first).opacity:'none',sectionText:(el.closest('section')?.querySelector('h2,h3')?.textContent||'').slice(0,20)});
  });
  // also count visible article cards
  const cards=document.querySelectorAll('[class*="dynamic-list-card"],.builder-pub-repeater-item');
  const vis=[...cards].filter(c=>getComputedStyle(c).opacity!=='0'&&c.offsetHeight>0).length;
  return {staggers:out,totalCards:cards.length,visibleCards:vis};
});
console.log(JSON.stringify(r,null,1));
console.log('JS_ERRORS:',errs.length?errs.slice(0,5):'none');
await b.close();
