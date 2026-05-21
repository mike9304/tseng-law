import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-extra-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const errs: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errs.push(`[${msg.type()}] ${msg.text().slice(0, 200)}`);
    }
  });
  page.on('pageerror', e => errs.push(`[pageerror] ${e.message.slice(0, 200)}`));

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // 1) Test viewport switcher
  console.log('=== viewport switcher ===');
  for (const vp of ['tablet', 'mobile', 'desktop']) {
    const btn = page.locator(`[title*="${vp.charAt(0).toUpperCase() + vp.slice(1)}"], [aria-label*="${vp}" i]`).first();
    const found = await btn.count();
    if (found > 0) {
      await btn.click({ force: true }).catch(() => {});
      await page.waitForTimeout(600);
      const canvasW = await page.evaluate(() => {
        const c = document.querySelector('[role="application"][aria-label="Canvas editor"]');
        const inner = c?.querySelector('[data-viewport]') ?? c;
        const r = inner?.getBoundingClientRect();
        return r ? { w: r.width, h: r.height } : null;
      });
      console.log(`viewport=${vp} canvas=${JSON.stringify(canvasW)}`);
      await page.screenshot({ path: join(OUT, `viewport-${vp}.png`), fullPage: false });
    } else {
      console.log(`viewport ${vp}: btn not found`);
    }
  }

  // 2) Hover on text node — outline appears?
  console.log('=== hover outline ===');
  // First, click anywhere else to deselect
  await page.mouse.click(700, 870);
  await page.waitForTimeout(300);
  const target = page.locator(`[data-node-id="home-hero-label"]`).first();
  const before = await target.evaluate((el) => window.getComputedStyle(el).outline);
  await target.hover({ force: true });
  await page.waitForTimeout(400);
  const after = await target.evaluate((el) => window.getComputedStyle(el).outline);
  await page.screenshot({ path: join(OUT, 'hover.png') });
  console.log('outline before hover:', before, '/ after:', after);

  // 3) Open + Add panel and click first item
  console.log('=== add panel item click ===');
  await page.locator(`[class*="iconRail"] [title="Add"]`).click({ force: true });
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, 'add-panel-open.png') });
  const addPanelItems = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('button, [role="button"], [data-add-item], [class*="addItem"]'))
      .filter(b => {
        const r = b.getBoundingClientRect();
        return r.x < 500 && r.x > 20 && r.width > 30 && r.height > 20;
      })
      .slice(0, 30);
    return items.map(b => ({
      text: (b.textContent ?? '').trim().slice(0, 60),
      classes: (b as HTMLElement).className.toString().slice(0, 80),
      rect: b.getBoundingClientRect(),
    }));
  });
  console.log('add panel items (first 6):');
  addPanelItems.slice(0, 6).forEach(i => console.log(' -', i.text, '|', i.classes));

  // 4) Pages panel — page list visible?
  console.log('=== Pages panel ===');
  await page.locator(`[class*="iconRail"] [title="Add"]`).click({ force: true }); // close add
  await page.waitForTimeout(300);
  await page.locator(`[class*="iconRail"] [title="Pages"]`).click({ force: true });
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(OUT, 'pages-panel.png') });
  const pageList = await page.evaluate(() => {
    // Search for elements in the open drawer
    const openDrawers = Array.from(document.querySelectorAll('[aria-hidden="false"]')) as HTMLElement[];
    const candidates = openDrawers.flatMap(d => Array.from(d.querySelectorAll('[data-builder-page-item], [class*="pageItem"], [class*="pageRow"], li, button')));
    return candidates.slice(0, 16).map(el => ({ tag: el.tagName, text: (el.textContent ?? '').trim().slice(0, 60), classes: el.className.toString().slice(0, 80) }));
  });
  console.log('pages panel items:', JSON.stringify(pageList.slice(0, 8), null, 2));

  console.log('=== ERRORS/WARNS captured ===');
  for (const e of errs) console.log(e);

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
