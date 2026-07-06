import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({viewport:{width:1440,height:1000}})).newPage();
await page.goto('http://127.0.0.1:4643/ko',{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(1000);
const info = await page.evaluate(() => {
  const main = document.querySelector('.builder-pub-main');
  if(!main) return {err:'no main'};
  const mainRect = main.getBoundingClientRect();
  const parent = main.parentElement;
  const bodyChildren = [...document.body.children].map(c=>{
    const r=c.getBoundingClientRect(); const cs=getComputedStyle(c);
    return {tag:c.tagName, id:c.id||'', cls:(c.className&&c.className.toString)?c.className.toString().slice(0,60):'', y:Math.round(r.top+scrollY), h:Math.round(r.height), pos:cs.position, mt:cs.marginTop, pt:cs.paddingTop};
  });
  const mainParent = parent ? {tag:parent.tagName,id:parent.id,cls:(parent.className&&parent.className.toString)?parent.className.toString().slice(0,60):'', y:Math.round(parent.getBoundingClientRect().top+scrollY), pos:getComputedStyle(parent).position, mt:getComputedStyle(parent).marginTop, pt:getComputedStyle(parent).paddingTop} : null;
  const hero = document.querySelector("[data-node-id='home-hero-root']");
  const chain=[];
  let el=hero;
  for(let i=0;i<6&&el;i++){const r=el.getBoundingClientRect();const cs=getComputedStyle(el);chain.push({tag:el.tagName,nid:el.getAttribute('data-node-id')||el.id,cls:(el.className&&el.className.toString)?el.className.toString().slice(0,40):'',y:Math.round(r.top+scrollY),h:Math.round(r.height),pos:cs.position,mt:cs.marginTop,pt:cs.paddingTop,display:cs.display});el=el.parentElement;}
  const header=document.querySelector('header,[class*="eader"]');
  const headerInfo=header?{y:Math.round(header.getBoundingClientRect().top+scrollY),h:Math.round(header.getBoundingClientRect().height),pos:getComputedStyle(header).position}:null;
  return {mainTop:Math.round(mainRect.top+scrollY), mainParent, bodyChildren, heroChain:chain, headerInfo};
});
console.log(JSON.stringify(info,null,2));
await browser.close();
