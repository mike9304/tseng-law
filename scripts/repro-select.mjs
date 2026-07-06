import { chromium } from '@playwright/test';
const url=process.argv[2];const out=process.argv[3];
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
const errs=[];p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,160));});
p.on('pageerror',e=>errs.push('PAGEERR:'+String(e).slice(0,160)));
try{await p.goto(url,{waitUntil:'networkidle',timeout:50000});}catch(e){console.error('nav:',e.message);}
await p.waitForTimeout(3500);
const info=await p.evaluate(()=>{
  const nodes=[...document.querySelectorAll('[data-node-id]')];
  return {nodeCount:nodes.length, firstId:nodes[1]?.getAttribute('data-node-id')||nodes[0]?.getAttribute('data-node-id')||null};
});
let clickResult='no-node';
if(info.firstId){
  // click the node element
  const sel=`[data-node-id="${info.firstId}"]`;
  try{ await p.locator(sel).first().click({timeout:3000,force:true}); }catch(e){ clickResult='click-err:'+e.message.slice(0,60); }
  await p.waitForTimeout(800);
  clickResult=await p.evaluate((id)=>{
    // did a selection overlay appear / is the node marked selected?
    const selOverlay=document.querySelector('[class*="selection" i],[data-selected="true"],[class*="selected" i]');
    const nodeEl=document.querySelector(`[data-node-id="${id}"]`);
    return {clickedId:id, selectionOverlayPresent:!!selOverlay, nodeAriaSelected:nodeEl?.getAttribute('aria-selected'), overlayClass:selOverlay?selOverlay.className.toString().slice(0,80):null};
  }, info.firstId);
}
await p.screenshot({path:out,fullPage:false});
console.log(JSON.stringify({...info, clickResult, errs:errs.slice(0,6)},null,1));
await b.close();
