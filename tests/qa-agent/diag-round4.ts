import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-r4-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const errs: Array<{ type: string; text: string; url?: string }> = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push({ type: m.type(), text: m.text(), url: page.url() }); });
  page.on('pageerror', e => errs.push({ type: 'pageerror', text: e.message, url: page.url() }));

  const findings: Array<{ area: string; status: 'ok' | 'issue' | 'note'; detail: string }> = [];
  const record = (area: string, status: 'ok' | 'issue' | 'note', detail: string) => {
    findings.push({ area, status, detail });
    console.log(`[${status.toUpperCase()}] ${area}: ${detail}`);
  };

  // ===== 1) admin routes outside the canvas builder =====
  console.log('\n=== Other admin routes ===');
  const adminRoutes = ['/ko/admin-builder/users', '/ko/admin-builder/audit', '/ko/admin-builder/cases', '/ko/admin-builder/forms', '/ko/admin-builder/bookings/services', '/ko/admin-builder/crm', '/ko/admin-builder/analytics'];
  for (const route of adminRoutes) {
    const before = errs.length;
    const res = await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' }).catch((e) => ({ status: () => 0, ok: () => false, statusText: () => e.message }));
    await page.waitForTimeout(800);
    const status = res?.status?.() ?? 0;
    const newErrs = errs.length - before;
    const hadContent = await page.evaluate(() => document.body.textContent ?? '');
    const has500 = hadContent.includes('500') || hadContent.includes('Application error') || hadContent.includes('Error: ');
    record(`Route ${route}`, status >= 400 || has500 || newErrs > 0 ? 'issue' : 'ok',
      `status=${status} errors+${newErrs} ${has500 ? '500-page' : ''}`);
    await page.screenshot({ path: join(OUT, `route-${route.replace(/\//g, '_')}.png`) });
  }

  // back to builder
  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // ===== 2) Inspector text content editing — change text in inspector textarea =====
  console.log('\n=== Inspector text content edit ===');
  await page.locator('[data-node-id="home-hero-label"]').first().click({ force: true });
  await page.waitForTimeout(600);
  // Look for any textarea or input with text content
  const inspectorTextEdit = await page.evaluate(() => {
    const insps = Array.from(document.querySelectorAll('aside, [class*="inspector"], [class*="rightPanel"]')) as HTMLElement[];
    const right = insps.find(e => e.getBoundingClientRect().x > 1000);
    if (!right) return { found: false };
    // Find textarea or text input that contains content
    const allInputs = Array.from(right.querySelectorAll('input, textarea')) as Array<HTMLInputElement | HTMLTextAreaElement>;
    const textInput = allInputs.find(i => i.value && i.value.length > 5);
    if (!textInput) return { found: false, sample: allInputs.slice(0, 6).map(i => ({ type: i.type ?? i.tagName, val: i.value.slice(0, 30) })) };
    const originalVal = textInput.value;
    const setter = Object.getOwnPropertyDescriptor((textInput.constructor as any).prototype, 'value')?.set;
    if (!setter) return { found: false, reason: 'no value setter' };
    const newVal = originalVal + ' (edited)';
    setter.call(textInput, newVal);
    textInput.dispatchEvent(new Event('input', { bubbles: true }));
    textInput.dispatchEvent(new Event('change', { bubbles: true }));
    textInput.blur();
    return { found: true, originalVal: originalVal.slice(0, 50), newVal: newVal.slice(0, 60), tag: textInput.tagName };
  });
  console.log('inspector edit result:', inspectorTextEdit);
  await page.waitForTimeout(800);
  const afterInspectorEdit = await page.evaluate(() => {
    const labelEl = document.querySelector('[data-node-id="home-hero-label"]');
    return { text: (labelEl?.textContent ?? '').slice(0, 100) };
  });
  console.log('canvas after edit:', afterInspectorEdit);
  await page.screenshot({ path: join(OUT, 'inspector-edit.png') });

  // Undo to restore
  await page.keyboard.press('Meta+z');
  await page.waitForTimeout(400);
  await page.keyboard.press('Meta+z');
  await page.waitForTimeout(400);

  // ===== 3) Selection toolbar buttons — click each =====
  console.log('\n=== Selection toolbar button clicks ===');
  await page.locator('[data-node-id="home-hero-label"]').first().click({ force: true });
  await page.waitForTimeout(500);
  const toolbarBtns = await page.evaluate(() => {
    const tb = document.querySelector('[class*="selectionToolbar"], [class*="SelectionToolbar"], [data-builder-selection-toolbar]') as HTMLElement | null;
    if (!tb) return null;
    return Array.from(tb.querySelectorAll('button')).map((b, i) => ({
      idx: i,
      title: b.getAttribute('title'),
      ariaLabel: b.getAttribute('aria-label'),
      text: (b.textContent ?? '').trim().slice(0, 20),
      disabled: (b as HTMLButtonElement).disabled,
    }));
  });
  console.log('selection toolbar btns:', toolbarBtns);
  if (toolbarBtns && toolbarBtns.length >= 1) {
    record('Selection toolbar btns', 'ok', `${toolbarBtns.length} buttons (${toolbarBtns.map(b => b.title ?? b.ariaLabel ?? b.text).slice(0, 6).join(' | ')})`);
  }

  // ===== 4) Asset Library modal open (via image node) =====
  console.log('\n=== Asset Library ===');
  // Need to click an image node — home-hero-media-image
  const imgClick = await page.locator('[data-node-id="home-hero-media-image"]').first();
  if (await imgClick.count() > 0) {
    await imgClick.click({ force: true });
    await page.waitForTimeout(400);
    await imgClick.click({ force: true }); // second click to trigger asset library per ImageElement.tsx
    await page.waitForTimeout(900);
    await page.screenshot({ path: join(OUT, 'asset-lib.png') });
    const assetLib = await page.evaluate(() => {
      const al = document.querySelector('[data-asset-library-modal], [aria-label*="asset" i], [aria-label*="이미지" i][role="dialog"]');
      return al ? { found: true, classes: al.className.toString().slice(0, 80) } : null;
    });
    if (assetLib) record('Asset library', 'ok', `노출 ${assetLib.classes}`);
    else record('Asset library', 'note', '두 번 클릭해도 모달 안 뜸 (이미지 노드 클릭 동작 다름)');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  } else {
    record('Asset library', 'note', '이미지 노드(home-hero-media-image)를 찾지 못함');
  }

  // ===== 5) Layer search input (codex new) =====
  console.log('\n=== Layer search input ===');
  await page.locator('[class*="iconRail"] [title="Layers"]').click({ force: true });
  await page.waitForTimeout(700);
  const layerSearchInfo = await page.evaluate(() => {
    const drawer = document.querySelector('[data-builder-drawer="layers"], [aria-hidden="false"][class*="drawer"]');
    if (!drawer) return null;
    const search = drawer.querySelector('input[type="text"], input[type="search"], input[placeholder*="search" i], input[placeholder*="검색" i]');
    return search ? {
      found: true,
      tag: search.tagName,
      type: (search as HTMLInputElement).type,
      placeholder: (search as HTMLInputElement).placeholder,
    } : null;
  });
  console.log('layer search:', layerSearchInfo);
  if (layerSearchInfo) {
    // Type into it
    const input = page.locator('[data-builder-drawer="layers"] input, [aria-hidden="false"][class*="drawer"] input').first();
    if (await input.count() > 0) {
      await input.fill('hero-title');
      await page.waitForTimeout(700);
      const matched = await page.evaluate(() => {
        const drawer = document.querySelector('[data-builder-drawer="layers"], [aria-hidden="false"][class*="drawer"]');
        const rows = drawer?.querySelectorAll('[data-layer-node-id], [class*="layerRow"], button') ?? [];
        let visibleCount = 0;
        rows.forEach(r => {
          const rect = (r as HTMLElement).getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) visibleCount++;
        });
        return visibleCount;
      });
      record('Layer search filter', 'ok', `'hero-title' 입력 후 visible rows≈${matched}`);
      await input.fill('');
    }
  } else {
    record('Layer search', 'note', '검색 input 못 찾음');
  }
  await page.locator('[class*="iconRail"] [title="Layers"]').click({ force: true });
  await page.waitForTimeout(300);

  // ===== 6) Color picker — try via inspector "Color" label  =====
  console.log('\n=== Color picker via inspector label ===');
  await page.locator('[data-node-id="home-hero-label"]').first().click({ force: true });
  await page.waitForTimeout(500);
  const colorBtnResult = await page.evaluate(() => {
    const insps = Array.from(document.querySelectorAll('aside, [class*="inspector"], [class*="rightPanel"]')) as HTMLElement[];
    const right = insps.find(e => e.getBoundingClientRect().x > 1000);
    if (!right) return { ok: false };
    // Look for color swatches (commonly small square buttons with bg-color)
    const swatchCandidates = Array.from(right.querySelectorAll('button')).filter(b => {
      const style = window.getComputedStyle(b as HTMLElement);
      const bg = style.backgroundColor;
      const r = (b as HTMLElement).getBoundingClientRect();
      return /rgb/.test(bg) && bg !== 'rgba(0, 0, 0, 0)' && r.width >= 14 && r.width <= 60 && r.height >= 14 && r.height <= 60;
    });
    return { ok: true, count: swatchCandidates.length, sample: swatchCandidates.slice(0, 5).map(b => ({ classes: (b as HTMLElement).className.toString().slice(0, 50), bg: window.getComputedStyle(b as HTMLElement).backgroundColor })) };
  });
  console.log('color swatches:', colorBtnResult);

  // ===== Summary =====
  console.log('\n=== Errors/Warnings ===');
  console.log('total:', errs.length);
  for (const e of errs.slice(0, 10)) console.log(` [${e.type}] @ ${e.url?.slice(-40)}: ${e.text.slice(0, 180)}`);

  writeFileSync(join(OUT, 'findings.json'), JSON.stringify({ findings, errs }, null, 2));
  console.log('DIAG_OUT=', OUT);

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
