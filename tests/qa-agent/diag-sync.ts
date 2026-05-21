import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-sync-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const errs: string[] = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`[${m.type()}] ${m.text().slice(0, 180)}`); });
  page.on('pageerror', e => errs.push(`[pageerror] ${e.message.slice(0, 200)}`));

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // ===== Layers tree → canvas selection sync =====
  console.log('=== Layers → canvas selection sync ===');
  await page.locator('[class*="iconRail"] [title="Layers"]').click({ force: true });
  await page.waitForTimeout(700);
  // Find a layer row with text 'home-hero-title' or similar
  const layerRow = page.locator('[class*="drawer"] [aria-hidden="false"] button, [data-builder-drawer] button').filter({ hasText: /hero/i }).first();
  // alt: try locator strategies — fallback
  const layerCandidates = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('[data-layer-node-id], [data-layer-row], [class*="layerRow"], [class*="layerItem"]')).slice(0, 30);
    return candidates.map(el => ({ tag: el.tagName, attrs: Array.from(el.attributes).map(a => `${a.name}=${a.value}`).slice(0, 4).join(' '), text: (el.textContent ?? '').trim().slice(0, 60) }));
  });
  console.log('LAYER_CANDIDATES first 5:', layerCandidates.slice(0, 5));

  // Pick a non-root visible layer
  const targetLayerInfo = await page.evaluate(() => {
    const drawer = document.querySelector('[data-builder-drawer="layers"], [aria-hidden="false"][class*="drawer"]');
    if (!drawer) return null;
    const buttons = Array.from(drawer.querySelectorAll('button')) as HTMLElement[];
    const target = buttons.find(b => /hero-title|hero-label|hero-subtitle/.test(b.textContent ?? '') || /hero-title|hero-label|hero-subtitle/.test(b.getAttribute('data-layer-node-id') ?? ''));
    if (!target) return null;
    return { text: (target.textContent ?? '').trim().slice(0, 60), id: target.getAttribute('data-layer-node-id'), classes: target.className.toString().slice(0, 80) };
  });
  console.log('TARGET_LAYER=', targetLayerInfo);
  if (targetLayerInfo) {
    await page.evaluate(({ text }) => {
      const drawer = document.querySelector('[data-builder-drawer="layers"], [aria-hidden="false"][class*="drawer"]');
      const buttons = Array.from(drawer?.querySelectorAll('button') ?? []) as HTMLElement[];
      const target = buttons.find(b => (b.textContent ?? '').includes(text.slice(0, 20)));
      target?.click();
    }, targetLayerInfo);
    await page.waitForTimeout(600);
    const selected = await page.evaluate(() => {
      const sel = document.querySelector('[class*="nodeSelected"][data-node-id]');
      return { selected: Boolean(sel), id: sel?.getAttribute('data-node-id') };
    });
    console.log('AFTER LAYER CLICK selected:', selected);
  }

  // ===== Inspector input change → canvas reflection =====
  console.log('\n=== Inspector change → canvas reflection ===');
  await page.locator('[class*="iconRail"] [title="Layers"]').click({ force: true });
  await page.waitForTimeout(300);
  // Select a hero label node directly in canvas
  await page.locator('[data-node-id="home-hero-label"]').first().click({ force: true });
  await page.waitForTimeout(500);

  // Find x position input in inspector
  const inspectorProbe = await page.evaluate(() => {
    const inspectors = Array.from(document.querySelectorAll('aside, [class*="inspector"], [class*="rightPanel"]')) as HTMLElement[];
    const target = inspectors.find(el => {
      const r = el.getBoundingClientRect();
      return r.x > 1000 && r.width > 200;
    });
    if (!target) return null;
    // Look for any number input or a Position/X/Y field
    const inputs = Array.from(target.querySelectorAll('input')) as HTMLInputElement[];
    return inputs.map((i, idx) => ({
      idx, type: i.type, name: i.name, placeholder: i.placeholder, ariaLabel: i.getAttribute('aria-label'),
      value: i.value,
      step: i.step,
      labelNearby: (() => {
        let cur = i.parentElement;
        while (cur && cur.tagName !== 'ASIDE') {
          const lbl = cur.querySelector('label');
          if (lbl && lbl.textContent) return lbl.textContent.trim();
          cur = cur.parentElement;
        }
        return null;
      })(),
    })).slice(0, 20);
  });
  console.log('INSPECTOR_INPUTS (first 8):', JSON.stringify(inspectorProbe?.slice(0, 8), null, 2));

  // Try to find a width/height input — modify and see canvas updates
  const beforeRect = await page.locator('[data-node-id="home-hero-label"]').first().boundingBox();
  console.log('BEFORE_RECT=', beforeRect);
  // Type into the first number input
  const result = await page.evaluate(() => {
    const inspectors = Array.from(document.querySelectorAll('aside, [class*="inspector"], [class*="rightPanel"]')) as HTMLElement[];
    const target = inspectors.find(el => el.getBoundingClientRect().x > 1000);
    if (!target) return { ok: false };
    const numberInputs = Array.from(target.querySelectorAll('input[type="number"]')) as HTMLInputElement[];
    // Find a label that suggests width
    const widthLabelInput = numberInputs.find((i) => {
      const label = i.closest('label')?.textContent ?? i.parentElement?.textContent ?? '';
      return /width|너비|w$/i.test(label);
    }) ?? numberInputs[0];
    if (!widthLabelInput) return { ok: false, reason: 'no number input' };
    const beforeValue = widthLabelInput.value;
    const newValue = String(Number(beforeValue || '100') + 60);
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    if (nativeSetter) nativeSetter.call(widthLabelInput, newValue);
    widthLabelInput.dispatchEvent(new Event('input', { bubbles: true }));
    widthLabelInput.dispatchEvent(new Event('change', { bubbles: true }));
    widthLabelInput.blur();
    return { ok: true, beforeValue, newValue, label: widthLabelInput.getAttribute('aria-label') ?? widthLabelInput.closest('label')?.textContent ?? null };
  });
  console.log('INSPECTOR_CHANGE_RESULT=', result);
  await page.waitForTimeout(700);
  const afterRect = await page.locator('[data-node-id="home-hero-label"]').first().boundingBox();
  console.log('AFTER_RECT=', afterRect);
  await page.screenshot({ path: join(OUT, 'inspector-changed.png') });

  // ===== Confirm mobile nav panel a11y fix applied =====
  console.log('\n=== mobile nav panel a11y verify ===');
  const navA11y = await page.evaluate(() => {
    const p = document.querySelector('.site-mobile-nav-panel');
    if (!p) return { exists: false };
    return {
      exists: true,
      ariaModal: p.getAttribute('aria-modal'),
      ariaHidden: p.getAttribute('aria-hidden'),
      role: p.getAttribute('role'),
    };
  });
  console.log('MOBILE_NAV_A11Y=', navA11y);

  console.log('\n=== console summary ===');
  console.log('total errors/warnings:', errs.length);
  for (const e of errs.slice(0, 8)) console.log(' ', e);

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
