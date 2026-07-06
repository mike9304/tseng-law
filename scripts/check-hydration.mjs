import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:1000}})).newPage();
const logs=[];
page.on('console',m=>logs.push(`${m.type()}: ${m.text()}`));
page.on('pageerror',e=>logs.push(`PAGEERROR: ${e.message}`));
await page.goto('http://127.0.0.1:4643/ko',{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(1500);
// check if services minHeight present right after load, then after a tick
const check = await page.evaluate(()=>{
  const s=document.querySelector("[data-node-id='home-services-root']");
  return s?{inlineMinH:s.style.minHeight,csMinH:getComputedStyle(s).minHeight,h:Math.round(s.getBoundingClientRect().height),dataAttrs:s.getAttribute('data-builder-section-template')}:null;
});
console.log("services after hydration:",JSON.stringify(check));
console.log("=== relevant console logs (hydration/dynamic/repeater/dataset) ===");
console.log(logs.filter(l=>/hydrat|did not match|repeat|dataset|dynamic|min-height|services|faq|insights/i.test(l)).slice(0,20).join("\n") || "(none matching)");
console.log("=== total logs:",logs.length,"===");
console.log(logs.slice(0,15).join("\n"));
await browser.close();
