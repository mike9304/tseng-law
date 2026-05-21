import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-layer-drag-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log(`[${m.type()}]`, m.text().slice(0, 180)); });
  page.on('pageerror', e => console.log('[pageerror]', e.message.slice(0, 180)));

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4500);

  await page.locator('[class*="iconRail"] [title="Layers"]').click({ force: true });
  await page.waitForTimeout(700);

  // Probe layer rows
  const probe = await page.evaluate(() => {
    const drawer = document.querySelector('[data-builder-drawer="layers"], [aria-hidden="false"][class*="drawer"]');
    if (!drawer) return null;
    const rows = Array.from(drawer.querySelectorAll('[data-layer-node-id], [data-sortable-id], [role="treeitem"], li[class*="layer"], [class*="layerRow"], [class*="layerItem"]'));
    return rows.slice(0, 5).map(r => ({
      tag: r.tagName,
      attrs: Array.from(r.attributes).map(a => `${a.name}=${a.value}`).slice(0, 8).join(' '),
      rect: r.getBoundingClientRect(),
      hasDataset: Object.keys((r as HTMLElement).dataset),
    }));
  });
  console.log('LAYER_ROWS=', JSON.stringify(probe, null, 2));

  // try drag-reorder one row down
  if (probe && probe.length >= 2) {
    const a = probe[0];
    const b = probe[probe.length - 1];
    console.log('DRAG from', a.rect.x.toFixed(0), a.rect.y.toFixed(0), 'to', b.rect.x.toFixed(0), b.rect.y.toFixed(0));
    await page.mouse.move(a.rect.x + a.rect.width / 2, a.rect.y + a.rect.height / 2);
    await page.mouse.down();
    for (let s = 1; s <= 12; s++) {
      const ratio = s / 12;
      await page.mouse.move(
        a.rect.x + a.rect.width / 2 + ratio * (b.rect.x - a.rect.x),
        a.rect.y + a.rect.height / 2 + ratio * (b.rect.y - a.rect.y),
      );
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(400);
    await page.mouse.up();
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(OUT, 'after-layer-drag.png') });
  }

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
