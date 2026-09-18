import { chromium } from '/Users/son7/Projects/tseng-law-sea-seo-20260909/node_modules/playwright/index.mjs';
const base = 'http://localhost:4353';
const out = '/Users/son7/Projects/tseng-law-global-picker-20260918/docs/i18n/global-plan/evidence';
const browser = await chromium.launch();
const results = [];
for (const [locale, width] of [['en', 1440], ['ko', 1440], ['ar', 1440], ['vi', 390]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`${base}/${locale}/services`, { waitUntil: 'networkidle' });
  const trigger = page.locator('button[aria-haspopup="dialog"][aria-label]').first();
  const visible = await trigger.isVisible().catch(() => false);
  let dialogInfo = null;
  if (visible) {
    await trigger.click();
    const dialog = page.locator('[role="dialog"][aria-modal="true"]');
    await dialog.waitFor({ timeout: 3000 });
    const links = await dialog.locator('a[href]').count();
    const current = await dialog.locator('a[aria-current="true"]').getAttribute('href');
    const headings = await dialog.locator('h1,h2,h3').evaluateAll((els) => els.map((e) => `${e.tagName}:${e.textContent?.trim().slice(0, 30)}`));
    const dir = await dialog.locator('[dir]').first().getAttribute('dir').catch(() => null);
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.tagName);
    const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
    await page.screenshot({ path: `${out}/picker-${locale}-${width}.png` });
    await page.keyboard.press('Escape');
    const closed = (await page.locator('[role="dialog"]').count()) === 0;
    const refocus = await page.evaluate(() => document.activeElement?.getAttribute('aria-haspopup'));
    dialogInfo = { links, current, headings, dir, focusedOnOpen: focused, bodyOverflow, closedOnEsc: closed, focusReturned: refocus === 'dialog' };
  } else {
    await page.screenshot({ path: `${out}/picker-${locale}-${width}-notrigger.png` });
  }
  results.push({ locale, width, triggerVisible: visible, ...dialogInfo });
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
