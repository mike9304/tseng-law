import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-r6-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const errs: Array<{ type: string; text: string }> = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push({ type: m.type(), text: m.text() }); });
  page.on('pageerror', e => errs.push({ type: 'pageerror', text: e.message }));

  const findings: Array<{ area: string; status: 'ok' | 'issue' | 'note'; detail: string }> = [];
  const record = (area: string, status: 'ok' | 'issue' | 'note', detail: string) => {
    findings.push({ area, status, detail });
    console.log(`[${status.toUpperCase()}] ${area}: ${detail}`);
  };

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4500);

  // ===== 1) Asset library — image node double-click =====
  console.log('\n=== Asset library (dblclick image) ===');
  const imgNode = page.locator('[data-node-id="home-hero-media-image"]').first();
  await imgNode.click({ force: true });
  await page.waitForTimeout(400);
  // Asset library opens via ImageElement.tsx click handler when selected + image + not locked
  await imgNode.click({ force: true });
  await page.waitForTimeout(1000);
  const alOpen = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]:not(.site-mobile-nav-panel), [data-modal-shell="true"]'));
    const al = candidates.find(d => /asset|이미지|library|미디어|선택/i.test((d as HTMLElement).getAttribute('aria-label') ?? '') || /Asset Library|미디어 라이브러리|이미지 선택/i.test((d as HTMLElement).textContent ?? ''));
    return al ? { aria: (al as HTMLElement).getAttribute('aria-label'), textSample: ((al as HTMLElement).textContent ?? '').slice(0, 150) } : null;
  });
  if (alOpen) record('Asset library', 'ok', `노출 aria=${alOpen.aria} text="${alOpen.textSample.slice(0, 80)}..."`);
  else record('Asset library', 'note', '이미지 노드 클릭 2회로 모달 안 뜸 — 동작 다를 수 있음');
  await page.screenshot({ path: join(OUT, '01-asset-lib.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // ===== 2) Color picker open from Inspector =====
  console.log('\n=== Color picker advanced ===');
  await page.locator('[data-node-id="home-hero-label"]').first().click({ force: true });
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, '02-inspector-with-text.png') });
  const cpResult = await page.evaluate(() => {
    const insps = Array.from(document.querySelectorAll('aside, [class*="inspector"], [class*="rightPanel"]')) as HTMLElement[];
    const right = insps.find(e => e.getBoundingClientRect().x > 1000);
    if (!right) return { ok: false, reason: 'no inspector' };
    // Find a color swatch button — small button with explicit bg color, NOT panel header
    const swatches = Array.from(right.querySelectorAll('button')).filter((b) => {
      const el = b as HTMLElement;
      const r = el.getBoundingClientRect();
      const bg = window.getComputedStyle(el).backgroundColor;
      const hasColorClass = /color|swatch|chip|fill/i.test(el.className.toString());
      const inToolbar = el.closest('[class*="panelHeader"]') !== null;
      const isPlausibleSwatch = r.width >= 16 && r.width <= 60 && r.height >= 16 && r.height <= 60 && !inToolbar && /rgb/.test(bg) && bg !== 'rgba(0, 0, 0, 0)';
      return isPlausibleSwatch || hasColorClass;
    });
    if (swatches.length === 0) return { ok: false, reason: 'no swatches', allBtns: right.querySelectorAll('button').length };
    const target = swatches[0] as HTMLElement;
    target.click();
    return { ok: true, count: swatches.length, label: target.getAttribute('aria-label') ?? target.title ?? null, classes: target.className.toString().slice(0, 80) };
  });
  console.log('cp click:', cpResult);
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(OUT, '03-after-color-click.png') });
  const cpModal = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]:not(.site-mobile-nav-panel), [data-color-picker], [class*="ColorPicker"]'));
    const cp = candidates.find(d => /color|색상/i.test((d as HTMLElement).getAttribute('aria-label') ?? '') || /color picker|색상 선택|HEX/i.test((d as HTMLElement).textContent ?? ''));
    return cp ? { aria: (cp as HTMLElement).getAttribute('aria-label'), text: ((cp as HTMLElement).textContent ?? '').slice(0, 120) } : null;
  });
  if (cpModal) record('Color picker advanced', 'ok', `노출 aria=${cpModal.aria} text="${cpModal.text.slice(0, 60)}"`);
  else record('Color picker advanced', 'note', cpResult.ok ? '스와치 클릭 후 모달 안 뜸' : 'swatch 못 찾음');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // ===== 3) Multi-select via Shift+click =====
  console.log('\n=== Multi-select Shift+click ===');
  await page.locator('[data-node-id="home-hero-label"]').first().click({ force: true });
  await page.waitForTimeout(400);
  await page.locator('[data-node-id="home-hero-title"]').first().click({ force: true, modifiers: ['Shift'] });
  await page.waitForTimeout(400);
  const multiSel = await page.evaluate(() => {
    const selected = Array.from(document.querySelectorAll('[class*="nodeSelected"][data-node-id]')).map(n => n.getAttribute('data-node-id'));
    return { count: selected.length, ids: selected };
  });
  record('Multi-select Shift+click', multiSel.count >= 2 ? 'ok' : 'issue', `selected count=${multiSel.count} ids=${multiSel.ids.join(',')}`);
  await page.screenshot({ path: join(OUT, '04-multi-select.png') });

  // ===== 4) Group with Cmd+G =====
  console.log('\n=== Cmd+G group ===');
  await page.keyboard.press('Meta+g');
  await page.waitForTimeout(500);
  const afterGroup = await page.evaluate(() => {
    const selected = Array.from(document.querySelectorAll('[class*="nodeSelected"][data-node-id]')).map(n => n.getAttribute('data-node-id'));
    return { selectedIds: selected, totalNodes: document.querySelectorAll('[data-node-id]').length };
  });
  console.log('after Cmd+G:', afterGroup);
  // Undo
  await page.keyboard.press('Meta+z');
  await page.waitForTimeout(400);

  // ===== 5) Layers tree drag-reorder =====
  console.log('\n=== Layers drag reorder ===');
  await page.locator('[class*="iconRail"] [title="Layers"]').click({ force: true });
  await page.waitForTimeout(700);
  // Find draggable layer rows
  const layerInfo = await page.evaluate(() => {
    const drawer = document.querySelector('[data-builder-drawer="layers"], [aria-hidden="false"][class*="drawer"]');
    if (!drawer) return null;
    const draggable = drawer.querySelectorAll('[draggable="true"], [data-layer-row][draggable], [data-layer-handle]');
    const allRows = drawer.querySelectorAll('[data-layer-node-id], [class*="layerRow"], [class*="layerItem"]');
    return {
      draggableCount: draggable.length,
      rowCount: allRows.length,
      sampleDraggable: Array.from(draggable).slice(0, 3).map(d => ({ tag: d.tagName, classes: (d as HTMLElement).className.toString().slice(0, 60), attrs: Array.from(d.attributes).map(a => `${a.name}=${a.value}`).slice(0, 4).join(' ') })),
    };
  });
  console.log('layer info:', layerInfo);
  if (layerInfo) record('Layers drag-reorder', layerInfo.draggableCount > 0 ? 'ok' : 'note', `draggable=${layerInfo.draggableCount} rows=${layerInfo.rowCount}`);
  await page.locator('[class*="iconRail"] [title="Layers"]').click({ force: true });
  await page.waitForTimeout(300);

  // ===== 6) Z-index / overlap visual checks =====
  console.log('\n=== Z-index / overlap visual checks ===');
  const visualChecks = await page.evaluate(() => {
    const issues: string[] = [];
    const rail = document.querySelector('[class*="iconRail"]')?.getBoundingClientRect();
    const canvas = document.querySelector('[role="application"][aria-label="Canvas editor"]')?.getBoundingClientRect();
    const inspector = (Array.from(document.querySelectorAll('aside, [class*="inspector"]')) as HTMLElement[])
      .find(e => e.getBoundingClientRect().x > 1000)?.getBoundingClientRect();
    const topbar = document.querySelector('[class*="topBar"], [class*="TopBar"]')?.getBoundingClientRect();
    const statusbar = document.querySelector('[class*="statusBar"], [class*="StatusBar"]')?.getBoundingClientRect();

    if (rail && canvas && rail.right > canvas.left + 1) issues.push(`rail overlaps canvas: rail.right=${rail.right} canvas.left=${canvas.left}`);
    if (inspector && canvas && inspector.left < canvas.right - 1) issues.push(`inspector overlaps canvas: inspector.left=${inspector.left} canvas.right=${canvas.right}`);
    if (topbar && canvas && topbar.bottom > canvas.top + 1) issues.push(`topbar overlaps canvas: topbar.bottom=${topbar.bottom} canvas.top=${canvas.top}`);
    if (statusbar && canvas && statusbar.top < canvas.bottom - 1) issues.push(`statusbar overlaps canvas: statusbar.top=${statusbar.top} canvas.bottom=${canvas.bottom}`);

    // body overflow
    const bodyStyle = window.getComputedStyle(document.body);
    const htmlStyle = window.getComputedStyle(document.documentElement);
    const hasUnexpectedXScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth + 4;
    if (hasUnexpectedXScroll) issues.push(`horizontal scroll on body: scrollWidth=${document.documentElement.scrollWidth} clientWidth=${document.documentElement.clientWidth}`);

    // z-index sanity — modal backdrop should be above main canvas
    return {
      rail, canvas, inspector, topbar, statusbar,
      bodyOverflow: bodyStyle.overflow,
      htmlOverflow: htmlStyle.overflow,
      hasUnexpectedXScroll,
      issues,
    };
  });
  console.log('VISUAL_CHECKS=', JSON.stringify(visualChecks, null, 2));
  if (visualChecks.issues.length === 0) record('Visual layout overlap', 'ok', `rail/canvas/inspector/topbar 정렬 정상, x-scroll=${visualChecks.hasUnexpectedXScroll}`);
  else for (const issue of visualChecks.issues) record('Visual layout', 'issue', issue);

  // ===== 7) Tooltip visibility — hover toolbar buttons =====
  console.log('\n=== Tooltip visibility ===');
  await page.locator('button[title="Publish"]').first().hover();
  await page.waitForTimeout(700);
  const tooltipInfo = await page.evaluate(() => {
    const tooltip = document.querySelector('[role="tooltip"], [data-tooltip]');
    if (!tooltip) return null;
    const r = tooltip.getBoundingClientRect();
    return { rect: { x: r.x, y: r.y, w: r.width, h: r.height }, text: (tooltip.textContent ?? '').slice(0, 60) };
  });
  console.log('tooltip:', tooltipInfo);

  // ===== 8) Console errors during all interactions =====
  console.log('\n=== Console errors total ===', errs.length);
  for (const e of errs.slice(0, 8)) console.log(` [${e.type}] ${e.text.slice(0, 180)}`);

  writeFileSync(join(OUT, 'findings.json'), JSON.stringify({ findings, errs, visualChecks }, null, 2));
  console.log('DIAG_OUT=', OUT);

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
