import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-rot-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  page.on('console', msg => {
    const t = msg.text();
    if (t.includes('[rot]')) console.log(t);
  });

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  await page.locator(`[data-node-id="home-hero-label"]`).first().click({ force: true });
  await page.waitForTimeout(500);

  // Inject a window-level listener to confirm pointermove events arrive
  await page.evaluate(() => {
    let pmCount = 0;
    (window as any).__pmCount = 0;
    const f = (e: PointerEvent) => { (window as any).__pmCount = ++pmCount; if (pmCount < 3) console.log('[rot] pm', pmCount, e.clientX, e.clientY); };
    window.addEventListener('pointermove', f);
  });

  // Get rotation handle box
  const rotHandle = await page.locator('[class*="rotationHandle"]').first();
  const box = await rotHandle.boundingBox();
  if (!box) throw new Error('No rotation handle box');
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  console.log('handle center:', cx, cy);

  // Strategy A: real Playwright mouse drag
  console.log('=== A: page.mouse with sleep ===');
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let s = 1; s <= 10; s += 1) {
    await page.mouse.move(cx + (s * 8), cy + (s * 8));
    await page.waitForTimeout(30);
  }
  await page.mouse.up();
  await page.waitForTimeout(500);
  const afterA = await page.locator(`[data-node-id="home-hero-label"]`).first().evaluate((el) => window.getComputedStyle(el as HTMLElement).transform);
  const pmA = await page.evaluate(() => (window as any).__pmCount);
  console.log('after A:', afterA, 'pmCount:', pmA);

  // Reset selection and try Strategy B: manual PointerEvent dispatch
  console.log('=== B: manual PointerEvent dispatch ===');
  await page.locator(`[data-node-id="home-hero-label"]`).first().click({ force: true });
  await page.waitForTimeout(300);
  const result = await page.evaluate(({ cx, cy }) => {
    const handle = document.querySelector('[class*="rotationHandle"]') as HTMLElement | null;
    if (!handle) return { ok: false, reason: 'no handle' };
    const pointerInit = (x: number, y: number) => ({
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
      button: 0,
      buttons: 1,
      clientX: x,
      clientY: y,
      view: window,
    });
    handle.dispatchEvent(new PointerEvent('pointerdown', pointerInit(cx, cy)));
    for (let s = 1; s <= 12; s++) {
      const nx = cx + s * 8;
      const ny = cy + s * 8;
      window.dispatchEvent(new PointerEvent('pointermove', pointerInit(nx, ny)));
    }
    window.dispatchEvent(new PointerEvent('pointerup', pointerInit(cx + 96, cy + 96)));
    return { ok: true };
  }, { cx, cy });
  console.log('B dispatch:', result);
  await page.waitForTimeout(400);
  const afterB = await page.locator(`[data-node-id="home-hero-label"]`).first().evaluate((el) => window.getComputedStyle(el as HTMLElement).transform);
  console.log('after B:', afterB);

  // Check the box after either attempt
  await page.screenshot({ path: join(OUT, 'after-rot.png') });

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
