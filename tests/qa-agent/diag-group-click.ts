import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-grp-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4500);

  // Click home-hero-inner (group container) on desktop
  console.log('=== desktop: click group container (home-hero-inner) ===');
  await page.locator('[data-node-id="home-hero-inner"]').first().click({ force: true });
  await page.waitForTimeout(500);
  const sel1 = await page.evaluate(() => {
    const sel = document.querySelector('[class*="nodeSelected"][data-node-id]');
    return sel?.getAttribute('data-node-id') ?? null;
  });
  console.log('Selected after group click:', sel1);

  // Try home-hero-root
  console.log('\n=== desktop: click root container (home-hero-root) ===');
  await page.locator('[data-node-id="home-hero-root"]').first().click({ force: true });
  await page.waitForTimeout(500);
  const sel2 = await page.evaluate(() => {
    const sel = document.querySelector('[class*="nodeSelected"][data-node-id]');
    return sel?.getAttribute('data-node-id') ?? null;
  });
  console.log('Selected after root click:', sel2);

  // Try home-hero-copy
  console.log('\n=== desktop: click home-hero-copy ===');
  await page.locator('[data-node-id="home-hero-copy"]').first().click({ force: true });
  await page.waitForTimeout(500);
  const sel3 = await page.evaluate(() => {
    const sel = document.querySelector('[class*="nodeSelected"][data-node-id]');
    return sel?.getAttribute('data-node-id') ?? null;
  });
  console.log('Selected after copy click:', sel3);

  await page.screenshot({ path: join(OUT, 'after-group-clicks.png') });

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
