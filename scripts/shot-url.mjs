import { chromium } from '@playwright/test';
const [url, out, wArg, fullArg] = process.argv.slice(2);
const W = Number(wArg) || 1440;
const full = fullArg !== 'fold'; // default full page; 'fold' = just viewport
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: 900 }, deviceScaleFactor: 1 });
try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
} catch (e) { console.error('nav warn:', e.message); }
await page.waitForTimeout(2500);
await page.screenshot({ path: out, fullPage: full });
await browser.close();
console.log('shot', out, url, W);
