import { chromium } from '/Users/son7/Projects/tseng-law-en-international-20260917/node_modules/playwright/index.mjs';
const BASE='http://127.0.0.1:3044';
const OUT='/Users/son7/Projects/tseng-law-en-international-20260917/ops/MULTILINGUAL-INTERNATIONAL-v2/fable/MULTILINGUAL-INTERNATIONAL-v2-20260917-c2/screens';
const LOCALES=['en','ja','ko','zh-hant','vi','id','th','fil','ar'];
const VPS=[{n:'1440x900',w:1440,h:900},{n:'390x844',w:390,h:844,m:true},{n:'320x568',w:320,h:568,m:true},{n:'720x450-zoom200',w:720,h:450}];
const browser=await chromium.launch({headless:true}); const out=[];
for (const l of LOCALES) for (const vp of VPS) {
  const ctx=await browser.newContext({viewport:{width:vp.w,height:vp.h},isMobile:!!vp.m,hasTouch:!!vp.m,locale:l});
  let external=0; await ctx.route('**/*',r=>{const u=new URL(r.request().url()); if(u.hostname!=='127.0.0.1'){external++; return r.abort();} return r.continue();});
  const p=await ctx.newPage(); const rec={locale:l,vp:vp.n};
  try{
    await p.goto(`${BASE}/${l}`,{waitUntil:'networkidle',timeout:120000}); await p.waitForTimeout(1200);
    const btns=p.locator('nav.locale-home-paths a:visible');
    const n=await btns.count(); rec.visibleLinks=n; rec.items=[];
    for(let i=0;i<Math.min(n,3);i++){const b=btns.nth(i); const box=await b.boundingBox(); rec.items.push({text:(await b.innerText()).trim().slice(0,40),href:await b.getAttribute('href'),y:box&&Math.round(box.y),h:box&&Math.round(box.height),inView:!!box&&box.y>=0&&box.y+box.height<=vp.h&&box.x>=0&&box.x+box.width<=vp.w});}
    rec.hOverflow=await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
    rec.dir=await p.evaluate(()=>document.documentElement.dir);
    if(vp.n==='1440x900'||vp.n==='390x844'){ await p.screenshot({path:`${OUT}/home-${l}-${vp.n}.png`}); }
    if(vp.n==='390x844'){
      const first=btns.nth(0); const href=await first.getAttribute('href');
      await first.click({timeout:10000}); rec.click1=await p.waitForURL(u=>u.pathname===href,{timeout:15000}).then(()=>p.url()).catch(()=>'NO-NAV '+p.url());
      await p.goto(`${BASE}/${l}`,{waitUntil:'networkidle',timeout:120000}); await p.waitForTimeout(1000);
      let reached=null; for(let i=0;i<40;i++){await p.keyboard.press('Tab'); const f=await p.evaluate(()=>document.activeElement&&document.activeElement.closest('nav.locale-home-paths')?document.activeElement.getAttribute('href'):null); if(f){reached={tabs:i+1,href:f};break;}}
      rec.keyboard=reached;
      if(reached){ await p.keyboard.press('Enter'); rec.enterNav=await p.waitForURL(u=>u.pathname===reached.href,{timeout:15000}).then(()=>p.url()).catch(()=>'NO-NAV '+p.url()); }
    }
  }catch(e){rec.error=String(e.message).slice(0,160);}
  rec.externalAborted=external; out.push(rec); await ctx.close();
}
// P07 ja / ko / zh-hant screenshots 390
for (const l of ['ja','ko','zh-hant']) { const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true}); await ctx.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort()); const p=await ctx.newPage(); await p.goto(`${BASE}/${l}/taiwan-debt-recovery-lawyer`,{waitUntil:'networkidle',timeout:120000}); await p.screenshot({path:`${OUT}/p07-${l}-390x844.png`}); await ctx.close(); }
await browser.close(); console.log(JSON.stringify(out));
