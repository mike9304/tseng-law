// Captures full-page + hero screenshots of the live site and the local builder
// home so they can be compared visually.
import { chromium } from 'playwright';

const TARGETS = [
  { name: 'live', url: process.argv[2] || 'https://tseng-law.com/ko' },
  { name: 'local', url: process.argv[3] || 'http://127.0.0.1:4399/ko' },
];

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  for (const t of TARGETS) {
    const page = await ctx.newPage();
    await page.goto(t.url, { waitUntil: 'networkidle', timeout: 60000 });
    for (let y = 0; y < 14000; y += 700) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(130);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(900);
    // hero / top viewport
    await page.screenshot({ path: `/tmp/cmp-${t.name}-top.png` });
    // full page
    await page.screenshot({ path: `/tmp/cmp-${t.name}-full.png`, fullPage: true });
    const dims = await page.evaluate(() => ({ w: document.body.scrollWidth, h: document.body.scrollHeight }));
    console.log(`${t.name}: ${t.url} -> ${dims.w}x${dims.h}`);
    await page.close();
  }
} finally {
  await browser.close();
}
