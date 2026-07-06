// Measures the natural rendered height of each composite home section on the
// published home, so the composite seed (seed-home.ts) can use accurate section
// heights → the editor canvas flow matches the public flow. Run with the dev
// server up: `node scripts/measure-home-sections.mjs [url]`.
import { chromium } from 'playwright';

const URL = process.argv[2] || 'http://127.0.0.1:4399/ko';
const IDS = [
  'home-hero', 'home-insights', 'home-services', 'home-attorney',
  'home-case-results', 'home-stats', 'home-faq', 'home-offices', 'home-contact',
];

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });

  // Trigger lazy content (images, map iframes) by scrolling the whole page.
  for (let y = 0; y < 14000; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  // Neutralise the flow minHeight floor so each wrapper collapses to its true
  // content height.
  await page.evaluate((ids) => {
    for (const id of ids) {
      const el = document.querySelector(`[data-node-id="${id}"]`);
      if (el) el.style.minHeight = '0px';
    }
  }, IDS);
  await page.waitForTimeout(400);

  const out = {};
  for (const id of IDS) {
    const box = await page
      .locator(`[data-node-id="${id}"]`)
      .first()
      .boundingBox()
      .catch(() => null);
    out[id] = box ? Math.round(box.height) : null;
  }
  console.log('MEASURED_HEIGHTS=' + JSON.stringify(out));
} finally {
  await browser.close();
}
