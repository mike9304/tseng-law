import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-set-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log(`[${m.type()}]`, m.text().slice(0, 180)); });

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // open settings via the title='사이트 설정' button
  await page.locator('button[title="사이트 설정"]').first().click({ force: true });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(OUT, 'settings-open.png'), fullPage: false });

  const probe = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('[data-modal-shell="true"], [role="dialog"], [aria-modal="true"]')) as HTMLElement[];
    const inlineExpansion = Array.from(document.querySelectorAll('[class*="settingsPanel"], [class*="siteSettings"]')) as HTMLElement[];
    return {
      modalCount: candidates.length,
      modals: candidates.map(m => ({
        attrs: Array.from(m.attributes).map(a => `${a.name}=${a.value}`).slice(0, 6).join(' '),
        rect: m.getBoundingClientRect(),
        inputs: m.querySelectorAll('input, textarea, select').length,
        buttons: m.querySelectorAll('button').length,
        text: (m.textContent ?? '').slice(0, 250),
      })),
      inlineCount: inlineExpansion.length,
      inline: inlineExpansion.map(p => ({
        classes: p.className.toString().slice(0, 100),
        inputs: p.querySelectorAll('input, textarea, select').length,
        buttons: p.querySelectorAll('button').length,
      })),
    };
  });
  console.log('SETTINGS_PROBE=', JSON.stringify(probe, null, 2));

  // Try clicking different tabs
  const tabResults: any[] = [];
  for (const tabName of ['General', 'Typography', 'Brand', 'Advanced', '일반', '글꼴', '브랜드']) {
    const tab = page.locator(`button:has-text("${tabName}")`).first();
    if (await tab.count() > 0 && await tab.isVisible()) {
      await tab.click({ force: true }).catch(() => {});
      await page.waitForTimeout(500);
      const inputs = await page.evaluate(() => {
        const dialog = document.querySelector('[data-modal-shell="true"], [role="dialog"]');
        const inputs = dialog?.querySelectorAll('input, textarea') ?? [];
        return Array.from(inputs).map((i: any) => ({ type: i.type, placeholder: i.placeholder, value: i.value, ariaLabel: i.getAttribute('aria-label') })).slice(0, 6);
      });
      tabResults.push({ tab: tabName, inputs });
      await page.screenshot({ path: join(OUT, `settings-tab-${tabName}.png`) });
    }
  }
  console.log('TAB_RESULTS=', JSON.stringify(tabResults, null, 2));

  // Probe DOM near a placeholder to find the firm-name field
  const firmNameField = await page.evaluate(() => {
    const i = document.querySelector('input[placeholder*="호정"], input[placeholder*="법률사무소"], input[placeholder*="firmName"]') as HTMLInputElement | null;
    return i ? { placeholder: i.placeholder, value: i.value } : null;
  });
  console.log('FIRM_NAME_FIELD=', firmNameField);

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
