import { chromium } from '@playwright/test';
const [url,out,wArg]=process.argv.slice(2);const W=Number(wArg)||1440;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:900}});
try{await p.goto(url,{waitUntil:'networkidle',timeout:45000});}catch(e){console.error(e.message);}
await p.waitForTimeout(1500);
// scroll down in steps to trigger IntersectionObserver reveals, then back to top
const h=await p.evaluate(()=>document.body.scrollHeight);
for(let y=0;y<h;y+=700){await p.evaluate(_y=>window.scrollTo(0,_y),y);await p.waitForTimeout(180);}
await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(600);
await p.screenshot({path:out,fullPage:true});await b.close();console.log('scrolled-shot',out);
