import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-vis-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const allConsole: Array<{ type: string; text: string }> = [];
  page.on('console', msg => {
    allConsole.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', err => {
    allConsole.push({ type: 'pageerror', text: err.message });
  });

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: join(OUT, '01-loaded.png'), fullPage: false });

  // Test 1: click each rail button and screenshot
  const railTitles = ['Pages', 'Add', 'Design', 'Layers', 'Navigation', 'History'];
  const railResults: Array<{ title: string; clicked: boolean; openedPanel: boolean; visibleAt: { x: number; y: number; w: number; h: number } | null }> = [];
  for (const title of railTitles) {
    try {
      const btn = page.locator(`[class*="iconRail"] [title="${title}"]`).first();
      const visible = await btn.isVisible().catch(() => false);
      if (!visible) {
        railResults.push({ title, clicked: false, openedPanel: false, visibleAt: null });
        continue;
      }
      await btn.click({ force: true });
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(OUT, `rail-${title.toLowerCase()}.png`), fullPage: false });
      const panelInfo = await page.evaluate(() => {
        const panel = document.querySelector('[aria-hidden="false"][class*="drawer"], [class*="leftPanel"][aria-hidden="false"], [class*="leftDrawer"]:not([aria-hidden="true"])');
        const all = Array.from(document.querySelectorAll('[aria-hidden]'))
          .filter(el => el.getAttribute('aria-hidden') === 'false')
          .map(el => ({
            tag: el.tagName,
            classes: el.className.toString().slice(0, 80),
            rect: el.getBoundingClientRect(),
          }));
        return { firstPanel: Boolean(panel), allOpenAria: all.slice(0, 8) };
      });
      const r = await btn.boundingBox();
      railResults.push({
        title,
        clicked: true,
        openedPanel: panelInfo.firstPanel,
        visibleAt: r ? { x: r.x, y: r.y, w: r.width, h: r.height } : null,
      });
      // close
      await btn.click({ force: true }).catch(() => {});
      await page.waitForTimeout(300);
    } catch (e) {
      railResults.push({ title, clicked: false, openedPanel: false, visibleAt: null });
    }
  }

  // Test 2: select a node and see if selection handles render
  const nodeId = 'home-hero-label';
  await page.locator(`[data-node-id="${nodeId}"]`).first().click({ force: true });
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(OUT, 'selected.png'), fullPage: false });
  const selHandles = await page.evaluate(() => {
    const sel = document.querySelector('[class*="nodeSelected"][data-node-id]');
    if (!sel) return { selected: false };
    const rh = sel.querySelectorAll('[class*="resizeHandle"]').length;
    const rotate = sel.querySelectorAll('[class*="rotationHandle"]').length;
    const outline = window.getComputedStyle(sel).outline;
    return { selected: true, resizeHandles: rh, rotationHandles: rotate, outline };
  });

  // Test 3: rotation drag
  let rotResult: any = null;
  const rotHandle = await page.locator('[class*="rotationHandle"]').first();
  const hasRot = await rotHandle.count();
  if (hasRot > 0) {
    const before = await page.locator(`[data-node-id="${nodeId}"]`).first().evaluate((el) => window.getComputedStyle(el as HTMLElement).transform);
    const box = await rotHandle.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 80, cy + 80, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(400);
      const after = await page.locator(`[data-node-id="${nodeId}"]`).first().evaluate((el) => window.getComputedStyle(el as HTMLElement).transform);
      const rotChip = await page.locator('[class*="rotationReadout"], [data-rotation-chip], [class*="rotationChip"]').count();
      rotResult = { before, after, changed: before !== after, rotChipCount: rotChip };
      await page.screenshot({ path: join(OUT, 'after-rotation.png'), fullPage: false });
    }
  }

  // Test 4: resize drag (SE corner)
  let resResult: any = null;
  await page.locator(`[data-node-id="${nodeId}"]`).first().click({ force: true });
  await page.waitForTimeout(300);
  const handles = await page.evaluate(() => {
    const sel = document.querySelector('[class*="nodeSelected"][data-node-id]');
    if (!sel) return [];
    return Array.from(sel.querySelectorAll('[class*="resizeHandle"]')).map((h, i) => {
      const r = h.getBoundingClientRect();
      return { index: i, classes: (h as HTMLElement).className.toString().slice(0, 200), cx: r.x + r.width / 2, cy: r.y + r.height / 2, w: r.width, h: r.height };
    });
  });
  // pick the SE one (bottom-right corner)
  const seHandle = handles.length > 0 ? handles.reduce((acc, h) => (h.cx + h.cy > acc.cx + acc.cy ? h : acc), handles[0]) : null;
  if (seHandle) {
    const beforeRect = await page.locator(`[data-node-id="${nodeId}"]`).first().boundingBox();
    await page.mouse.move(seHandle.cx, seHandle.cy);
    await page.mouse.down();
    await page.mouse.move(seHandle.cx + 50, seHandle.cy + 50, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    const afterRect = await page.locator(`[data-node-id="${nodeId}"]`).first().boundingBox();
    resResult = {
      handleClasses: seHandle.classes,
      handlePos: { cx: seHandle.cx, cy: seHandle.cy },
      before: beforeRect,
      after: afterRect,
      dw: afterRect && beforeRect ? afterRect.width - beforeRect.width : null,
      dh: afterRect && beforeRect ? afterRect.height - beforeRect.height : null,
    };
    await page.screenshot({ path: join(OUT, 'after-resize.png'), fullPage: false });
  }

  // Test 5: alignment quality — outline / handles / panels visually overlapping?
  const visualAlign = await page.evaluate(() => {
    const issues: string[] = [];
    const railRect = document.querySelector('[class*="iconRail"]')?.getBoundingClientRect();
    const canvasRect = document.querySelector('[role="application"][aria-label="Canvas editor"]')?.getBoundingClientRect();
    if (railRect && canvasRect && railRect.right > canvasRect.left + 4) {
      issues.push(`iconRail overlaps canvas by ${(railRect.right - canvasRect.left).toFixed(1)}px`);
    }
    return { railRect, canvasRect, issues };
  });

  // Save all console events for later review of tiptap/lcp warnings
  writeFileSync(join(OUT, 'all-console.json'), JSON.stringify(allConsole, null, 2));
  writeFileSync(join(OUT, 'summary.json'), JSON.stringify({ railResults, selHandles, rotResult, resResult, visualAlign }, null, 2));

  console.log('TIPTAP_WARN=', allConsole.filter(e => e.text.includes('tiptap')).length);
  console.log('LCP_WARN=', allConsole.filter(e => e.text.includes('LCP') || e.text.includes('Largest Contentful Paint')).length);
  console.log('CSP_VIOLATIONS=', allConsole.filter(e => e.text.includes('Content Security Policy')).length);
  console.log('ALL_ERRORS=', allConsole.filter(e => e.type === 'error' || e.type === 'pageerror').length);
  console.log('SUSPICIOUS_WARNS=', allConsole.filter(e => /warning|warn/i.test(e.type) && !/Fast Refresh|Hydration|Image with src|tiptap warn/.test(e.text)).slice(0, 5));
  console.log('RAIL_RESULTS=', JSON.stringify(railResults, null, 2));
  console.log('SEL_HANDLES=', JSON.stringify(selHandles, null, 2));
  console.log('ROT_RESULT=', JSON.stringify(rotResult, null, 2));
  console.log('RES_RESULT=', JSON.stringify(resResult, null, 2));
  console.log('VISUAL_ALIGN_ISSUES=', visualAlign.issues);
  console.log('DIAG_OUT=', OUT);

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
