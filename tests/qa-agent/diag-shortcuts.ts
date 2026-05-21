import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-sh-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const allMsgs: Array<{ type: string; text: string }> = [];
  page.on('console', m => { allMsgs.push({ type: m.type(), text: m.text() }); });
  page.on('pageerror', e => allMsgs.push({ type: 'pageerror', text: e.message }));

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4500);

  // Press '?' to open shortcuts help modal
  await page.keyboard.press('Shift+/'); // '?' on US layout
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(OUT, 'help-modal.png') });
  const helpModal = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"][aria-label*="단축키"], [role="dialog"][aria-label*="Shortcut"], [data-modal-shell="true"]');
    if (!dialog) return { open: false };
    const text = (dialog.textContent ?? '').slice(0, 300);
    return { open: true, text };
  });
  console.log('HELP_MODAL=', JSON.stringify(helpModal, null, 2));
  console.log('\n=== ALL CONSOLE (filtered) ===');
  for (const m of allMsgs.filter(m => /error|warn|ShortcutsHelp/i.test(m.type) || /ShortcutsHelp|Expected|Failed to compile/i.test(m.text)).slice(0, 12)) {
    console.log(`[${m.type}] ${m.text.slice(0, 250)}`);
  }
  console.log('all msgs total:', allMsgs.length);

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
