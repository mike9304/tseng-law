import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-r5-${new Date().toISOString().replace(/[:.]/g, '-')}`);

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

  // ===== 1) SEO panel =====
  console.log('\n=== SEO panel ===');
  const seoBtn = page.locator('button[title="현재 페이지 SEO"], button:has-text("SEO")').first();
  if (await seoBtn.count() > 0) {
    await seoBtn.click({ force: true });
    await page.waitForTimeout(900);
    await page.screenshot({ path: join(OUT, '01-seo.png'), fullPage: false });
    const seoInfo = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"][aria-modal="true"]:not(.site-mobile-nav-panel), [data-modal-shell="true"]');
      if (!modal) return null;
      return {
        rect: modal.getBoundingClientRect(),
        inputs: modal.querySelectorAll('input, textarea').length,
        buttons: modal.querySelectorAll('button').length,
        tabs: Array.from(modal.querySelectorAll('button')).filter(b => /basics|advanced|robots|sitemap|기본|고급/i.test(b.textContent ?? '')).length,
        text: (modal.textContent ?? '').slice(0, 250),
      };
    });
    if (seoInfo) record('SEO modal', 'ok', `inputs=${seoInfo.inputs} buttons=${seoInfo.buttons} tabs=${seoInfo.tabs}`);
    else record('SEO modal', 'issue', 'SEO 클릭 후 모달 안 뜸');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  } else {
    record('SEO modal', 'note', 'SEO 버튼 못 찾음');
  }

  // ===== 2) Version history =====
  console.log('\n=== Version history ===');
  const histBtn = page.locator('button[title="버전 히스토리"], button:has-text("히스토리"), button:has-text("History")').first();
  if (await histBtn.count() > 0) {
    await histBtn.click({ force: true });
    await page.waitForTimeout(900);
    await page.screenshot({ path: join(OUT, '02-history.png') });
    const histInfo = await page.evaluate(() => {
      const m = document.querySelector('[role="dialog"][aria-modal="true"]:not(.site-mobile-nav-panel), [data-modal-shell="true"]');
      if (!m) return null;
      return {
        rect: m.getBoundingClientRect(),
        buttons: m.querySelectorAll('button').length,
        listItems: m.querySelectorAll('li, [data-version-entry], [class*="entry"]').length,
        text: (m.textContent ?? '').slice(0, 200),
      };
    });
    if (histInfo) record('Version history modal', 'ok', `buttons=${histInfo.buttons} listItems=${histInfo.listItems}`);
    else record('Version history modal', 'issue', '히스토리 클릭 후 모달 안 뜸');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  } else {
    record('Version history modal', 'note', '히스토리 버튼 못 찾음');
  }

  // ===== 3) Preview modal =====
  console.log('\n=== Preview modal ===');
  const previewBtn = page.locator('button[title="Preview"], button:has-text("Preview"), button:has-text("미리보기")').first();
  if (await previewBtn.count() > 0) {
    await previewBtn.click({ force: true });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: join(OUT, '03-preview.png') });
    const prevInfo = await page.evaluate(() => {
      const m = document.querySelector('[role="dialog"][aria-modal="true"]:not(.site-mobile-nav-panel), [data-modal-shell="true"], [data-builder-preview-modal]');
      if (!m) return null;
      const iframe = m.querySelector('iframe');
      return {
        rect: m.getBoundingClientRect(),
        hasIframe: Boolean(iframe),
        iframeSrc: iframe?.getAttribute('src')?.slice(0, 100) ?? null,
        buttons: m.querySelectorAll('button').length,
      };
    });
    if (prevInfo) record('Preview modal', 'ok', `iframe=${prevInfo.hasIframe} buttons=${prevInfo.buttons} src=${prevInfo.iframeSrc}`);
    else record('Preview modal', 'issue', 'Preview 클릭 후 모달 안 뜸');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  } else {
    record('Preview modal', 'note', 'Preview 버튼 못 찾음');
  }

  // ===== 4) Drag move a node =====
  console.log('\n=== Drag move ===');
  // Pick a non-locked, easy-to-drag node — home-hero-label
  const target = page.locator('[data-node-id="home-hero-label"]').first();
  const beforeBox = await target.boundingBox();
  if (beforeBox) {
    const startX = beforeBox.x + beforeBox.width / 2;
    const startY = beforeBox.y + beforeBox.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    for (let s = 1; s <= 10; s++) {
      await page.mouse.move(startX + s * 6, startY + s * 4);
      await page.waitForTimeout(30);
    }
    await page.mouse.up();
    await page.waitForTimeout(700);
    const afterBox = await target.boundingBox();
    if (afterBox && beforeBox) {
      const dx = Math.round(afterBox.x - beforeBox.x);
      const dy = Math.round(afterBox.y - beforeBox.y);
      record('Drag move', dx !== 0 || dy !== 0 ? 'ok' : 'note', `dx=${dx} dy=${dy} (expected ~60,40)`);
    }
    await page.screenshot({ path: join(OUT, '04-drag-move.png') });
    // Undo to restore
    await page.keyboard.press('Meta+z');
    await page.waitForTimeout(400);
  }

  // ===== 5) Brand kit tab in Site Settings =====
  console.log('\n=== Brand kit tab ===');
  await page.locator('button[title="사이트 설정"]').first().click({ force: true });
  await page.waitForTimeout(900);
  const brandTab = page.locator('[data-modal-shell="true"] button:has-text("Brand kit"), [role="dialog"] button:has-text("Brand kit")').first();
  if (await brandTab.count() > 0) {
    await brandTab.click({ force: true });
    await page.waitForTimeout(700);
    await page.screenshot({ path: join(OUT, '05-brand-kit.png') });
    const brandInfo = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"][aria-modal="true"]:not(.site-mobile-nav-panel), [data-modal-shell="true"]');
      if (!dialog) return null;
      const colorSwatches = Array.from(dialog.querySelectorAll('button')).filter(b => {
        const r = (b as HTMLElement).getBoundingClientRect();
        const bg = window.getComputedStyle(b as HTMLElement).backgroundColor;
        return r.width >= 14 && r.width <= 80 && r.height >= 14 && r.height <= 80 && /rgb/.test(bg) && bg !== 'rgba(0, 0, 0, 0)';
      });
      return {
        inputs: dialog.querySelectorAll('input').length,
        colorSwatches: colorSwatches.length,
        buttons: dialog.querySelectorAll('button').length,
        text: (dialog.textContent ?? '').slice(0, 200),
      };
    });
    if (brandInfo) record('Brand kit tab', 'ok', `inputs=${brandInfo.inputs} swatches=${brandInfo.colorSwatches}`);
    else record('Brand kit tab', 'issue', 'Brand kit 클릭 후 dialog 못 찾음');
  } else {
    record('Brand kit tab', 'note', 'Brand kit 탭 버튼 못 찾음');
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // ===== 6) zh-hant builder =====
  console.log('\n=== zh-hant builder ===');
  const zhErrs = errs.length;
  await page.goto(`${BASE}/zh-hant/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  const zhInfo = await page.evaluate(() => ({
    canvas: Boolean(document.querySelector('[role="application"][aria-label="Canvas editor"]')),
    nodes: document.querySelectorAll('[data-node-id]').length,
    rails: document.querySelectorAll('[class*="iconRail"] button').length,
    url: window.location.href,
    bodyText: (document.body.textContent ?? '').slice(0, 200),
  }));
  const zhNewErrs = errs.length - zhErrs;
  console.log('zh info:', zhInfo);
  record('zh-hant builder', zhInfo.canvas && zhInfo.nodes > 5 && zhNewErrs === 0 ? 'ok' : 'issue',
    `canvas=${zhInfo.canvas} nodes=${zhInfo.nodes} rails=${zhInfo.rails} errors+${zhNewErrs}`);
  await page.screenshot({ path: join(OUT, '06-zhhant.png'), fullPage: false });

  // ===== 7) en builder =====
  console.log('\n=== en builder ===');
  const enErrs = errs.length;
  await page.goto(`${BASE}/en/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  const enInfo = await page.evaluate(() => ({
    canvas: Boolean(document.querySelector('[role="application"][aria-label="Canvas editor"]')),
    nodes: document.querySelectorAll('[data-node-id]').length,
    url: window.location.href,
  }));
  const enNewErrs = errs.length - enErrs;
  record('en builder', enInfo.canvas && enInfo.nodes > 5 && enNewErrs === 0 ? 'ok' : 'issue', `canvas=${enInfo.canvas} nodes=${enInfo.nodes} errors+${enNewErrs}`);
  await page.screenshot({ path: join(OUT, '07-en.png'), fullPage: false });

  // ===== 8) Visual hero rect at mobile viewport vs desktop (in ko) =====
  console.log('\n=== Mobile preview canvas geometry ===');
  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  const sizes: any = {};
  for (const vp of ['Desktop', 'Tablet', 'Mobile']) {
    const btn = page.locator(`button[title*="${vp}"]`).first();
    await btn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(800);
    const canvasRect = await page.evaluate(() => {
      const c = document.querySelector('[role="application"][aria-label="Canvas editor"]');
      const stage = document.querySelector('[class*="stage__"], [class*="canvasStage"]');
      const viewport = document.querySelector('[data-builder-viewport-scale], [data-viewport]');
      const rectOf = (el: Element | null) => el ? el.getBoundingClientRect() : null;
      return {
        canvas: rectOf(c) ? { w: c!.getBoundingClientRect().width, h: c!.getBoundingClientRect().height } : null,
        stage: rectOf(stage) ? { w: stage!.getBoundingClientRect().width } : null,
        viewport: rectOf(viewport) ? { w: viewport!.getBoundingClientRect().width, h: viewport!.getBoundingClientRect().height } : null,
        zoomLevel: document.querySelector('[class*="zoomDock"]')?.textContent?.slice(0, 30),
      };
    });
    sizes[vp] = canvasRect;
  }
  console.log('VIEWPORT_SIZES=', JSON.stringify(sizes, null, 2));
  // Mobile preview should be ~375px wide if no zoom, or scaled
  const mobileExpected = sizes.Mobile?.viewport?.w ?? sizes.Mobile?.canvas?.w ?? 0;
  if (mobileExpected > 0 && mobileExpected < 200) {
    record('Mobile preview width', 'note', `mobile viewport width=${mobileExpected}px — fits in canvas but very small. Check zoom auto-fit logic.`);
  } else {
    record('Mobile preview width', 'ok', `mobile width=${mobileExpected}px`);
  }

  // ===== Console summary =====
  console.log('\n=== ALL errs/warns ===');
  console.log('total:', errs.length);
  for (const e of errs.slice(0, 15)) console.log(` [${e.type}] ${e.text.slice(0, 180)}`);

  writeFileSync(join(OUT, 'findings.json'), JSON.stringify({ findings, errs, sizes }, null, 2));
  console.log('DIAG_OUT=', OUT);

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
