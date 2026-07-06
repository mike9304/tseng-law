// Verifies the composite home flow: measures each section's actual rendered
// height + top offset on the PUBLIC page and the EDITOR canvas, so we can confirm
// the editor now stacks sections at the same positions as the published page.
import { chromium } from 'playwright';

const IDS = [
  'home-hero', 'home-insights', 'home-services', 'home-attorney',
  'home-case-results', 'home-stats', 'home-faq', 'home-offices', 'home-contact',
];

async function measure(ctx, url) {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  for (let y = 0; y < 14000; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(100);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
  const res = await page.evaluate((ids) => {
    const first = document.querySelector(`[data-node-id="${ids[0]}"]`);
    const base = first ? first.getBoundingClientRect().top + window.scrollY : 0;
    const out = {};
    for (const id of ids) {
      const el = document.querySelector(`[data-node-id="${id}"]`);
      if (!el) { out[id] = null; continue; }
      const r = el.getBoundingClientRect();
      out[id] = { top: Math.round(r.top + window.scrollY - base), h: Math.round(el.offsetHeight) };
    }
    return out;
  }, IDS);
  await page.close();
  return res;
}

const browser = await chromium.launch();
try {
  const pub = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const pubM = await measure(pub, 'http://127.0.0.1:4399/ko');

  const adm = await browser.newContext({
    viewport: { width: 1280, height: 1000 },
    httpCredentials: { username: process.env.AU || '', password: process.env.AP || '' },
  });
  let admM = {};
  try {
    admM = await measure(adm, 'http://127.0.0.1:4399/ko/admin-builder');
  } catch (e) {
    admM = { error: String(e).slice(0, 120) };
  }

  console.log('PUBLIC=' + JSON.stringify(pubM));
  console.log('EDITOR=' + JSON.stringify(admM));
} finally {
  await browser.close();
}
