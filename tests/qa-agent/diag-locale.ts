import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-loc-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });

  for (const locale of ['ko', 'zh-hant', 'en']) {
    const page = await context.newPage();
    const errs: string[] = [];
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`[${m.type()}] ${m.text().slice(0, 180)}`); });
    page.on('pageerror', e => errs.push(`[pageerror] ${e.message.slice(0, 180)}`));

    await page.goto(`${BASE}/${locale}/admin-builder`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    const probe = await page.evaluate(() => ({
      canvasFound: Boolean(document.querySelector('[role="application"][aria-label="Canvas editor"]')),
      nodeCount: document.querySelectorAll('[data-node-id]').length,
      pageTitle: document.title,
      bodyTextSample: (document.body.textContent ?? '').slice(0, 200),
      iconRailButtons: document.querySelectorAll('[class*="iconRail"] button').length,
      inspectorInputs: document.querySelectorAll('aside input, [class*="inspector"] input').length,
    }));

    console.log(`\n=== ${locale} ===`);
    console.log('canvas:', probe.canvasFound, 'nodes:', probe.nodeCount, 'rails:', probe.iconRailButtons);
    console.log('title:', probe.pageTitle);
    console.log('body sample:', probe.bodyTextSample.slice(0, 120));
    console.log('errors+warnings:', errs.length);
    for (const e of errs.slice(0, 3)) console.log(`  ${e.slice(0, 150)}`);

    await page.screenshot({ path: join(OUT, `${locale}.png`), fullPage: false });
    await page.close();
  }

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
