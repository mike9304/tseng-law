import { chromium } from '@playwright/test';
const [url, out, wArg, fullArg] = process.argv.slice(2);
const W = Number(wArg) || 1440;
const full = fullArg === 'full';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: 900 }, deviceScaleFactor: 1 });
try { await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }); } catch (e) { console.error('nav warn:', e.message); }
await page.waitForTimeout(2000);
// dismiss common modals/popups
try { await page.keyboard.press('Escape'); } catch {}
for (const sel of ['button[aria-label*="close" i]', 'button[aria-label*="닫기"]', '[class*="close" i]', 'text=닫기', 'text=오늘 하루', 'text=오늘 그만', 'text=확인']) {
  try { const el = page.locator(sel).first(); if (await el.isVisible({ timeout: 300 })) { await el.click({ timeout: 800 }); await page.waitForTimeout(300); } } catch {}
}
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: full });
await browser.close();
console.log('shot', out);
