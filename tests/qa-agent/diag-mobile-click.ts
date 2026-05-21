import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-mob-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log(`[${m.type()}]`, m.text().slice(0, 200)); });
  page.on('pageerror', e => console.log(`[pageerror]`, e.message.slice(0, 200)));

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4500);

  // Switch to mobile viewport
  await page.locator('button[title*="Mobile"]').first().click({ force: true });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(OUT, '01-mobile-viewport.png'), fullPage: false });

  // Probe: what does the canvas look like in mobile viewport?
  const probe1 = await page.evaluate(() => {
    const canvas = document.querySelector('[role="application"][aria-label="Canvas editor"]');
    const canvasRect = canvas?.getBoundingClientRect();
    const visibleNodes = Array.from(document.querySelectorAll('[data-node-id]')).filter(n => {
      const r = (n as HTMLElement).getBoundingClientRect();
      return r.width > 4 && r.height > 4 && r.top > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
    }).slice(0, 20).map(n => ({
      id: n.getAttribute('data-node-id'),
      rect: (n as HTMLElement).getBoundingClientRect(),
      transform: window.getComputedStyle(n as HTMLElement).transform,
    }));
    // Check for any scale/zoom wrapper
    const scaleWrapper = document.querySelector('[class*="canvasZoom"], [class*="viewport"], [data-builder-viewport-scale]');
    const sw = scaleWrapper ? {
      classes: scaleWrapper.className.toString().slice(0, 80),
      transform: window.getComputedStyle(scaleWrapper as HTMLElement).transform,
      rect: (scaleWrapper as HTMLElement).getBoundingClientRect(),
    } : null;
    return { canvasRect, visibleNodes: visibleNodes.slice(0, 8), scaleWrapper: sw };
  });
  console.log('CANVAS_RECT=', probe1.canvasRect);
  console.log('VISIBLE_NODES (8):');
  probe1.visibleNodes.forEach(n => console.log(`  ${n.id} rect=${n.rect.x.toFixed(0)},${n.rect.y.toFixed(0)} ${n.rect.width.toFixed(0)}x${n.rect.height.toFixed(0)}`));
  console.log('SCALE_WRAPPER=', probe1.scaleWrapper);

  // Try to click a text node (e.g. home-hero-label) at the actual screen coords
  const target = probe1.visibleNodes.find(n => /label|title|subtitle/.test(n.id ?? '')) ?? probe1.visibleNodes[0];
  if (!target) {
    console.log('NO_TARGET');
    await browser.close();
    return;
  }
  console.log('TARGET_NODE=', target.id, 'at', target.rect);
  // click at center
  const cx = target.rect.x + target.rect.width / 2;
  const cy = target.rect.y + target.rect.height / 2;
  console.log('CLICKING at', cx, cy);
  await page.mouse.click(cx, cy);
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, '02-after-click.png') });

  const after1 = await page.evaluate(() => {
    const sel = document.querySelector('[class*="nodeSelected"][data-node-id]');
    const elAtPoint = document.elementFromPoint(window.innerWidth/2, 400);
    return {
      selectedId: sel?.getAttribute('data-node-id') ?? null,
      elAtCenter: elAtPoint ? { tag: elAtPoint.tagName, classes: (elAtPoint as HTMLElement).className.toString().slice(0, 100), id: (elAtPoint as HTMLElement).id } : null,
    };
  });
  console.log('AFTER click attempt1:', after1);

  // Try clicking via locator (more reliable hit-testing)
  if (target.id) {
    await page.locator(`[data-node-id="${target.id}"]`).first().click({ force: true });
    await page.waitForTimeout(500);
    const after2 = await page.evaluate(() => {
      const sel = document.querySelector('[class*="nodeSelected"][data-node-id]');
      return { selectedId: sel?.getAttribute('data-node-id') ?? null };
    });
    console.log('AFTER locator click:', after2);
    await page.screenshot({ path: join(OUT, '03-after-loc-click.png') });
  }

  // Try clicking a clearly text node — home-hero-title
  await page.locator('[data-node-id="home-hero-title"]').first().click({ force: true }).catch(e => console.log('click err:', e));
  await page.waitForTimeout(500);
  const after3 = await page.evaluate(() => {
    const sel = document.querySelector('[class*="nodeSelected"][data-node-id]');
    return { selectedId: sel?.getAttribute('data-node-id') ?? null };
  });
  console.log('AFTER hero-title click:', after3);

  // Check: maybe in mobile viewport the canvas itself reroutes clicks to a preview iframe
  const finalProbe = await page.evaluate(() => {
    const titleEl = document.querySelector('[data-node-id="home-hero-title"]') as HTMLElement | null;
    if (!titleEl) return null;
    const r = titleEl.getBoundingClientRect();
    return {
      pointerEvents: window.getComputedStyle(titleEl).pointerEvents,
      isInVisualViewport: r.width > 0 && r.height > 0,
      rect: r,
      offsetParent: titleEl.offsetParent?.tagName,
    };
  });
  console.log('TITLE_PROBE=', finalProbe);

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
