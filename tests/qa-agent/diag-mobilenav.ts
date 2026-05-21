import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-mn-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const probe1 = await page.evaluate(() => {
    const mobileNav = document.querySelector('.site-mobile-nav-panel');
    if (!mobileNav) return { exists: false };
    const r = mobileNav.getBoundingClientRect();
    const style = window.getComputedStyle(mobileNav as HTMLElement);
    return {
      exists: true,
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      ariaHidden: mobileNav.getAttribute('aria-hidden'),
      role: mobileNav.getAttribute('role'),
      ariaModal: mobileNav.getAttribute('aria-modal'),
      visible: style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0,
      display: style.display,
      opacity: style.opacity,
      visibility: style.visibility,
      pointerEvents: style.pointerEvents,
      zIndex: style.zIndex,
      transform: style.transform,
    };
  });
  console.log('MOBILENAV_AT_LOAD=', JSON.stringify(probe1, null, 2));
  await page.screenshot({ path: join(OUT, 'at-load.png'), fullPage: false });

  // Click somewhere to see if it disappears
  await page.locator('[data-node-id="home-hero-label"]').first().click({ force: true });
  await page.waitForTimeout(400);
  const probe2 = await page.evaluate(() => {
    const mobileNav = document.querySelector('.site-mobile-nav-panel');
    if (!mobileNav) return { exists: false };
    const r = mobileNav.getBoundingClientRect();
    const style = window.getComputedStyle(mobileNav as HTMLElement);
    return {
      exists: true,
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      visible: style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0,
      display: style.display, opacity: style.opacity, visibility: style.visibility,
    };
  });
  console.log('MOBILENAV_AFTER_CLICK=', JSON.stringify(probe2, null, 2));

  // Check if it's blocking other interactions
  const hitTestAt = await page.evaluate(() => {
    // Test what element is at the top-right area where mobile-nav is
    const x = 1200, y = 100;
    const el = document.elementFromPoint(x, y);
    return { x, y, tag: el?.tagName, classes: (el as HTMLElement | null)?.className?.toString().slice(0, 100), id: el?.id };
  });
  console.log('HITTEST_TOPRIGHT=', JSON.stringify(hitTestAt, null, 2));

  await page.screenshot({ path: join(OUT, 'after-click.png'), fullPage: false });

  // Inspect parents/ancestors of mobile nav to understand context
  const ancestors = await page.evaluate(() => {
    const el = document.querySelector('.site-mobile-nav-panel') as HTMLElement | null;
    if (!el) return [];
    const chain: any[] = [];
    let cur: HTMLElement | null = el;
    while (cur && cur !== document.body && chain.length < 6) {
      chain.push({
        tag: cur.tagName,
        classes: cur.className.toString().slice(0, 100),
        attrs: Array.from(cur.attributes).map(a => `${a.name}=${a.value}`).slice(0, 5).join(' '),
        rect: cur.getBoundingClientRect(),
      });
      cur = cur.parentElement;
    }
    return chain;
  });
  console.log('MOBILENAV_ANCESTORS=', JSON.stringify(ancestors, null, 2));

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
