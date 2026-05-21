import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-mn-real-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
  });
  const page = await context.newPage();
  page.on('console', m => { if (m.type() === 'error') console.log(`[error]`, m.text().slice(0, 150)); });
  page.on('pageerror', e => console.log('[pageerror]', e.message.slice(0, 150)));

  await page.goto(`${BASE}/ko`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: join(OUT, 'mobile-public-ko.png'), fullPage: false });

  // probe header structure
  const probe = await page.evaluate(() => {
    const header = document.querySelector('header.header, header[data-builder-mobile-hamburger-mode]');
    const allMobileNav = document.querySelectorAll('.site-mobile-nav-panel, .site-mobile-nav-drawer, [data-builder-mobile-drawer]');
    return {
      headerExists: Boolean(header),
      hamburgerMode: header?.getAttribute('data-builder-mobile-hamburger-mode'),
      allMobileNavTags: Array.from(allMobileNav).map(n => ({
        tag: n.tagName,
        className: n.className.toString().slice(0, 80),
        attrs: Array.from(n.attributes).map(a => `${a.name}=${a.value}`).slice(0, 5).join(' '),
        rect: n.getBoundingClientRect(),
      })),
      allDialogs: Array.from(document.querySelectorAll('[role="dialog"]')).map(d => ({
        className: (d as HTMLElement).className.toString().slice(0, 80),
        ariaModal: d.getAttribute('aria-modal'),
        ariaHidden: d.getAttribute('aria-hidden'),
      })),
    };
  });
  console.log('PROBE_BEFORE_OPEN=', JSON.stringify(probe, null, 2));

  // Find hamburger
  const hb = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('[data-builder-mobile-hamburger="true"], button[aria-controls="site-mobile-nav-drawer"], button[aria-label*="menu" i], button[aria-label*="메뉴" i]'));
    if (candidates.length > 0) return { found: true, selector: 'matched' };
    const allBtns = Array.from(document.querySelectorAll('header button')).filter(b => {
      const r = (b as HTMLElement).getBoundingClientRect();
      return r.x > window.innerWidth - 80 && r.width >= 30 && r.height >= 30;
    });
    return { found: false, candidates: allBtns.map(b => ({ ariaLabel: b.getAttribute('aria-label'), title: b.getAttribute('title'), classes: (b as HTMLElement).className.toString().slice(0, 60), rect: (b as HTMLElement).getBoundingClientRect() })) };
  });
  console.log('HAMBURGER_PROBE=', JSON.stringify(hb, null, 2));

  // Try click whatever is in the top-right area
  const clickBtn = page.locator('header button[aria-controls="site-mobile-nav-drawer"], [data-builder-mobile-hamburger="true"], header button[aria-label*="menu" i]').first();
  if (await clickBtn.count() > 0) {
    await clickBtn.click({ force: true });
    await page.waitForTimeout(700);
    await page.screenshot({ path: join(OUT, 'mobile-after-hamburger.png'), fullPage: false });
    const probeOpen = await page.evaluate(() => {
      const p = document.querySelector('.site-mobile-nav-panel');
      const d = document.querySelector('#site-mobile-nav-drawer');
      return {
        panelAriaModal: p?.getAttribute('aria-modal'),
        panelAriaHidden: p?.getAttribute('aria-hidden'),
        panelVisibility: p ? window.getComputedStyle(p as HTMLElement).visibility : null,
        drawerAriaHidden: d?.getAttribute('aria-hidden'),
        drawerOpen: d?.classList.contains('open'),
      };
    });
    console.log('AFTER_OPEN=', JSON.stringify(probeOpen, null, 2));
  }

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
