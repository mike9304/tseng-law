import {createRequire} from 'node:module';import fs from 'node:fs';import path from 'node:path';const require=createRequire(new URL('../package.json',import.meta.url));const {chromium}=require('@playwright/test');
const base=process.env.ENTRY_BASE||'http://127.0.0.1:3000',phase=process.env.ENTRY_PHASE||'final-local';const out=path.resolve(process.env.TRAFFIC_VIDEO_EVIDENCE_DIR||'.omo/evidence/traffic-manual-video');fs.mkdirSync(out,{recursive:true});const url=`${base}/zh-hant/columns/taiwan-roadside-starting-parking-exit-liability`;const rows=[];const check=(v,s)=>{if(!v)throw Error(s)};const b=await chromium.launch();
for(const mode of ['loop-and-seek','mp4-fallback','all-sources-fail','no-js']){
 const c=await b.newContext({viewport:{width:390,height:900},reducedMotion:'reduce',javaScriptEnabled:mode!=='no-js'});if(mode==='mp4-fallback')await c.route('**/tw-starting-entry*.webm',r=>r.abort());if(mode==='all-sources-fail')await c.route('**/videos/traffic/tw-starting-entry*',r=>r.abort());const p=await c.newPage();const row={mode};
 try{
  await p.goto(url,{waitUntil:mode==='no-js'?'domcontentloaded':'networkidle',timeout:90000});const fig=p.locator('[data-traffic-diagram="starting-entry-hypothetical"]');if(mode==='no-js'){
   check(await fig.locator('video').count()===0,'nojs initial');await fig.locator('summary').click();check(await fig.locator('details').getAttribute('open')!==null,'native details');check(await fig.locator('details img').count()===4,'four nojs stages');
  }else{
   await fig.getByRole('button',{name:'播放影片',exact:true}).click();if(mode==='all-sources-fail'){await p.waitForFunction(()=>document.querySelector('[data-traffic-diagram="starting-entry-hypothetical"] [data-video-mounted]')?.getAttribute('data-video-mounted')==='false');check(await fig.locator('video').count()===0,'failed sources return to poster');row.pass=true;rows.push(row);console.log(JSON.stringify(row));await c.close();continue;}await p.waitForFunction(()=>document.querySelector('[data-traffic-diagram="starting-entry-hypothetical"] video')?.currentTime>.3,null,{timeout:20000});const v=fig.locator('video');
   if(mode==='mp4-fallback'){row.src=await v.evaluate(v=>v.currentSrc);check(row.src.endsWith('-mobile.mp4'),'MP4 source fallback');}
   else{
    await fig.getByRole('checkbox',{name:'重複播放'}).check();check(await v.evaluate(v=>v.loop),'loop selected');await fig.getByRole('button',{name:'從頭播放',exact:true}).click();
    await v.evaluate(v=>{let prev=v.currentTime;window.__entryLoops=0;v.addEventListener('timeupdate',()=>{if(prev>10&&v.currentTime<2)window.__entryLoops++;prev=v.currentTime})});await p.waitForFunction(()=>window.__entryLoops>=1,null,{timeout:25000});row.completedLoop=true;
    await fig.getByRole('button',{name:'暫停影片',exact:true}).click();const seek=fig.getByRole('slider',{name:'影片時間'});await seek.focus();await seek.press('Home');await seek.press('ArrowRight');await seek.press('ArrowRight');row.seek=await v.evaluate(v=>v.currentTime);check(row.seek>0&&row.seek<1,'keyboard seek');
   }
  }
  row.pass=true;
 }catch(e){row.error=String(e)}rows.push(row);console.log(JSON.stringify(row));await c.close();
}
await b.close();fs.writeFileSync(path.join(out,`${phase}-playback-extra.json`),JSON.stringify(rows,null,2));if(rows.some(r=>!r.pass))process.exitCode=1;
