import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:1000}})).newPage();
await page.goto('http://127.0.0.1:4643/ko',{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(1000);
const data = await page.evaluate(() => {
  const grab=(id)=>{
    const el=document.querySelector(`[data-node-id='${id}']`);
    if(!el)return null;
    const r=el.getBoundingClientRect();
    const cs=getComputedStyle(el);
    return {id,cls:el.className,flow:el.getAttribute('data-builder-flow-section'),
      inlineMinH:el.style.minHeight,inlineH:el.style.height,inlineMT:el.style.marginTop,
      csMinH:cs.minHeight,csH:cs.height,csDisplay:cs.display,csPos:cs.position,
      y:Math.round(r.top+scrollY),h:Math.round(r.height)};
  };
  const sections=['home-hero-root','home-insights-root','home-services-root','home-attorney-root','home-case-results-root','home-stats-root','home-faq-root','home-offices-root','home-contact-root'];
  // also dump services-container + its children layout
  const svcCont=document.querySelector("[data-node-id='home-services-container']");
  const svcContInfo=svcCont?(()=>{const r=svcCont.getBoundingClientRect();const cs=getComputedStyle(svcCont);return{cls:svcCont.className,pos:cs.position,display:cs.display,h:cs.height,minH:cs.minH,y:Math.round(r.top+scrollY)};})():null;
  const svcKids=svcCont?[...svcCont.children].map(c=>{const r=c.getBoundingClientRect();const cs=getComputedStyle(c);return{nid:c.getAttribute('data-node-id'),pos:cs.position,y:Math.round(r.top+scrollY),h:Math.round(r.height)};}):[];
  return {sections:sections.map(grab), svcContInfo, svcKids};
});
console.log(JSON.stringify(data,null,1));
await browser.close();
