import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'http://127.0.0.1:4317';
const OUT = '/Users/son7/Projects/tseng-law-grok-goal-proxy/out/EN-INTERNATIONAL-v1/screenshots';
mkdirSync(OUT, { recursive: true });

const pages = [
  { id: 'P00-home', path: '/en' },
  { id: 'P01-guide', path: '/en/guides/taiwan-company-setup' },
  { id: 'P02-lawyer', path: '/en/taiwan-company-setup-lawyer' },
  { id: 'P05-litigation', path: '/en/taiwan-litigation-lawyer' },
  { id: 'P06-civil', path: '/en/services/civil' },
  { id: 'P07-debt', path: '/en/taiwan-debt-recovery-lawyer' },
  { id: 'KO-home', path: '/ko' },
];

const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '390x844', width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  locale: 'en-US',
  reducedMotion: 'reduce',
});
await context.route('**/*', async (route) => {
  const url = route.request().url();
  if (url.startsWith('http://127.0.0.1:4317') || url.startsWith('http://localhost:4317')) {
    await route.continue();
    return;
  }
  await route.abort();
});

for (const viewport of viewports) {
  const page = await context.newPage();
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  for (const target of pages) {
    await page.goto(BASE + target.path, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(800);
    const file = join(OUT, `${target.id}-${viewport.name}-first.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log('saved', file);
    if (target.id === 'P00-home') {
      const skip = page.locator('[data-skip="true"]');
      if (await skip.count()) {
        await skip.first().click({ timeout: 3000 }).catch(() => {});
        await page.waitForTimeout(900);
        const after = join(OUT, `${target.id}-${viewport.name}-after-skip.png`);
        await page.screenshot({ path: after, fullPage: false });
        console.log('saved', after);
      }
    }
  }
  await page.close();
}

await browser.close();
console.log('done');
