import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-r3-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const consoleEvents: Array<{ type: string; text: string }> = [];
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) consoleEvents.push({ type: m.type(), text: m.text() }); });
  page.on('pageerror', e => consoleEvents.push({ type: 'pageerror', text: e.message }));

  const findings: Array<{ area: string; status: 'ok' | 'issue' | 'note'; detail: string }> = [];
  const record = (area: string, status: 'ok' | 'issue' | 'note', detail: string) => {
    findings.push({ area, status, detail });
    console.log(`[${status.toUpperCase()}] ${area}: ${detail}`);
  };

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4500);

  // ===== 1) Right-click context menu =====
  console.log('\n=== Context Menu ===');
  await page.locator('[data-node-id="home-hero-label"]').first().click({ force: true });
  await page.waitForTimeout(400);
  await page.locator('[data-node-id="home-hero-label"]').first().click({ button: 'right', force: true });
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(OUT, '01-context-menu.png') });
  const ctx = await page.evaluate(() => {
    const m = document.querySelector('[role="menu"], [class*="contextMenu"], [class*="context-menu"]');
    if (!m) return null;
    return {
      tag: m.tagName,
      classes: m.className.toString().slice(0, 80),
      items: Array.from(m.querySelectorAll('[role="menuitem"], button, li')).slice(0, 15).map(b => (b.textContent ?? '').trim().slice(0, 50)).filter(t => t.length > 0),
      rect: m.getBoundingClientRect(),
    };
  });
  if (ctx) record('Context menu', 'ok', `items=${ctx.items.length}: ${ctx.items.slice(0, 6).join(', ')}`);
  else record('Context menu', 'issue', '우클릭 컨텍스트 메뉴가 노출되지 않음');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // ===== 2) Selection toolbar (above selected node) =====
  console.log('\n=== Selection Toolbar ===');
  await page.locator('[data-node-id="home-hero-label"]').first().click({ force: true });
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(OUT, '02-selection.png') });
  const selToolbar = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('[class*="selectionToolbar"], [class*="SelectionToolbar"], [data-builder-selection-toolbar]')) as HTMLElement[];
    return candidates.map(t => ({
      classes: t.className.toString().slice(0, 80),
      buttons: t.querySelectorAll('button').length,
      visible: t.getBoundingClientRect().width > 0 && t.getBoundingClientRect().height > 0,
      rect: t.getBoundingClientRect(),
    }));
  });
  if (selToolbar.length > 0) {
    const visible = selToolbar.find(t => t.visible);
    if (visible) record('Selection toolbar', 'ok', `${visible.buttons} buttons visible at (${visible.rect.x.toFixed(0)},${visible.rect.y.toFixed(0)})`);
    else record('Selection toolbar', 'note', `${selToolbar.length}개 요소 있으나 모두 visible=false`);
  } else {
    record('Selection toolbar', 'note', '선택된 노드 위 selectionToolbar 셀렉터 매치 안 됨');
  }

  // ===== 3) + Add panel → click first widget to insert =====
  console.log('\n=== + Add → insert node ===');
  const nodeCountBefore = await page.evaluate(() => document.querySelectorAll('[data-node-id]').length);
  await page.locator('[class*="iconRail"] [title="Add"]').click({ force: true });
  await page.waitForTimeout(700);
  // pick first quick widget button
  const beforeRect = await page.locator('[data-node-id="home-hero-label"]').first().boundingBox();
  const result = await page.evaluate(() => {
    const drawer = document.querySelector('[data-builder-drawer="add"], [aria-hidden="false"][class*="drawer"]');
    if (!drawer) return { ok: false, reason: 'drawer not found' };
    const quickBtns = Array.from(drawer.querySelectorAll('button')).filter((b) => {
      const t = (b.textContent ?? '').trim();
      return /^(T텍스트|텍스트|버튼|이미지|아이콘)/.test(t) || /^T텍스트/.test(t);
    }) as HTMLElement[];
    if (quickBtns.length === 0) {
      // fallback: any button with non-empty text
      const allBtns = Array.from(drawer.querySelectorAll('button')).filter(b => (b.textContent ?? '').trim().length > 0) as HTMLElement[];
      return { ok: false, reason: 'quick btns not found', sample: allBtns.slice(0, 6).map(b => (b.textContent ?? '').trim().slice(0, 30)) };
    }
    const target = quickBtns[0];
    target.click();
    return { ok: true, label: (target.textContent ?? '').trim().slice(0, 30) };
  });
  console.log('insert result:', result);
  await page.waitForTimeout(1200);
  const nodeCountAfter = await page.evaluate(() => document.querySelectorAll('[data-node-id]').length);
  record('+ Add insert', nodeCountAfter > nodeCountBefore ? 'ok' : 'issue', `${nodeCountBefore} → ${nodeCountAfter} (delta=${nodeCountAfter - nodeCountBefore})`);
  await page.screenshot({ path: join(OUT, '03-after-insert.png') });

  // Undo the insertion
  await page.keyboard.press('Meta+z');
  await page.waitForTimeout(500);
  const nodeCountAfterUndo = await page.evaluate(() => document.querySelectorAll('[data-node-id]').length);
  record('+ Add undo', nodeCountAfterUndo === nodeCountBefore ? 'ok' : 'note', `after undo=${nodeCountAfterUndo} (expected ${nodeCountBefore})`);
  // close add drawer
  await page.locator('[class*="iconRail"] [title="Add"]').click({ force: true });
  await page.waitForTimeout(300);

  // ===== 4) Color picker — open it via Design or Inspector =====
  console.log('\n=== Color picker open ===');
  await page.locator('[data-node-id="home-hero-label"]').first().click({ force: true });
  await page.waitForTimeout(500);
  const colorBtn = await page.evaluate(() => {
    const insps = Array.from(document.querySelectorAll('aside, [class*="inspector"], [class*="rightPanel"]')) as HTMLElement[];
    const target = insps.find(i => i.getBoundingClientRect().x > 1000);
    if (!target) return null;
    // Find a colored chip / swatch / "Color" button
    const btn = target.querySelector('button[data-builder-color-picker], [aria-label*="color" i], button[class*="colorSwatch" i], button[class*="colorChip" i]');
    if (!btn) return null;
    (btn as HTMLElement).click();
    return { label: (btn.textContent ?? '').trim().slice(0, 30), ariaLabel: btn.getAttribute('aria-label') };
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(OUT, '04-color-picker.png') });
  const colorPickerOpen = await page.evaluate(() => {
    const cp = document.querySelector('[data-color-picker-advanced], [class*="ColorPickerAdvanced"], [class*="colorPickerAdvanced"], [role="dialog"][aria-label*="color" i]');
    return cp ? { found: true, classes: cp.className.toString().slice(0, 80) } : null;
  });
  if (colorPickerOpen) record('Color picker', 'ok', `노출 ${colorPickerOpen.classes}`);
  else record('Color picker', colorBtn ? 'note' : 'note', colorBtn ? `버튼 클릭은 했으나 모달 안 뜸 (${colorBtn.label})` : '색상 버튼을 인스펙터에서 못 찾음');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // ===== 5) Font picker — Site Settings → Typography =====
  console.log('\n=== Font picker open ===');
  await page.locator('button[title="사이트 설정"]').first().click({ force: true });
  await page.waitForTimeout(800);
  // Click Typography tab (with leading "T" char)
  const tt = page.locator('[data-modal-shell="true"] button:has-text("Typography"), [role="dialog"] button:has-text("Typography")').first();
  if (await tt.count() > 0) {
    await tt.click({ force: true });
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: join(OUT, '05-typography.png') });
  // Find font picker entry
  const fontResult = await page.evaluate(() => {
    const fp = document.querySelector('[data-font-picker]');
    if (!fp) return { ok: false, reason: 'no [data-font-picker]' };
    const btn = fp.querySelector('button');
    if (!btn) return { ok: false, reason: 'no button in font picker' };
    (btn as HTMLElement).click();
    return { ok: true };
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(OUT, '05b-font-dialog.png') });
  const fontDialog = await page.evaluate(() => {
    const fd = document.querySelector('[role="dialog"][aria-label*="font" i], [class*="FontPicker"]');
    return fd ? { found: true, classes: fd.className.toString().slice(0, 80), rect: fd.getBoundingClientRect() } : null;
  });
  if (fontDialog) record('Font picker dialog', 'ok', `노출 ${fontDialog.classes}`);
  else record('Font picker dialog', 'note', `fontResult=${JSON.stringify(fontResult)} — dialog not found via selector`);
  // close font dialog and settings
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // ===== 6) Mobile viewport — interact inside =====
  console.log('\n=== Mobile viewport interaction ===');
  await page.locator('button[title*="Mobile"]').first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(OUT, '06-mobile.png') });
  // Click a visible node in mobile viewport
  const mobileNodeClick = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('[data-node-id]')) as HTMLElement[];
    const visible = nodes.find(n => {
      const r = n.getBoundingClientRect();
      return r.width > 30 && r.height > 20 && r.top > 100 && r.top < 800 && r.left > 0;
    });
    if (!visible) return null;
    visible.click();
    return { id: visible.getAttribute('data-node-id'), rect: visible.getBoundingClientRect() };
  });
  await page.waitForTimeout(500);
  const selectedInMobile = await page.evaluate(() => {
    const sel = document.querySelector('[class*="nodeSelected"][data-node-id]');
    return sel ? sel.getAttribute('data-node-id') : null;
  });
  if (mobileNodeClick) record('Mobile viewport click', selectedInMobile ? 'ok' : 'issue', `clicked ${mobileNodeClick.id}, selected=${selectedInMobile}`);
  // back to desktop
  await page.locator('button[title*="Desktop"]').first().click({ force: true }).catch(() => {});
  await page.waitForTimeout(800);

  // ===== 7) Hydration mismatch / SSR check =====
  console.log('\n=== Hydration / SSR mismatch check ===');
  const hydErr = consoleEvents.filter(e => /hydration|server html|did not match|content does not match server/i.test(e.text));
  record('Hydration', hydErr.length === 0 ? 'ok' : 'issue', hydErr.length === 0 ? '0건' : `${hydErr.length}건: ${hydErr[0].text.slice(0, 120)}`);

  // ===== 8) Zoom dock =====
  console.log('\n=== Zoom dock ===');
  const zoomBefore = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('[class*="zoomDock"], [data-builder-zoom-dock]')) as HTMLElement[];
    return els.map(e => ({ classes: e.className.toString().slice(0, 60), buttons: e.querySelectorAll('button').length, text: (e.textContent ?? '').slice(0, 60) }));
  });
  console.log('zoom dock:', zoomBefore);
  // Try zoom in via shortcut
  await page.keyboard.press('Meta+=');
  await page.waitForTimeout(300);
  await page.keyboard.press('Meta+=');
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, '07-zoomed.png') });
  // Reset
  await page.keyboard.press('Meta+0');
  await page.waitForTimeout(400);

  console.log('\n=== Errors/warnings summary ===');
  console.log('total:', consoleEvents.length);
  for (const e of consoleEvents.slice(0, 12)) console.log(` [${e.type}] ${e.text.slice(0, 200)}`);

  writeFileSync(join(OUT, 'findings.json'), JSON.stringify({ findings, consoleEvents }, null, 2));
  console.log('DIAG_OUT=', OUT);

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
