import { chromium } from '@playwright/test';
import { join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-r7-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const allErrs: Array<{ route: string; type: string; text: string }> = [];
  let currentRoute = '';
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') allErrs.push({ route: currentRoute, type: m.type(), text: m.text() }); });
  page.on('pageerror', e => allErrs.push({ route: currentRoute, type: 'pageerror', text: e.message }));

  const findings: Array<{ area: string; status: 'ok' | 'issue' | 'note'; detail: string }> = [];
  const record = (area: string, status: 'ok' | 'issue' | 'note', detail: string) => {
    findings.push({ area, status, detail });
    console.log(`[${status.toUpperCase()}] ${area}: ${detail}`);
  };

  // ===== 1) Published pages — ko/zh-hant/en + about/services/contact =====
  console.log('\n=== Published pages ===');
  const publishedRoutes = [
    '/ko', '/zh-hant', '/en',
    '/ko/about', '/ko/services', '/ko/contact', '/ko/lawyers',
    '/zh-hant/about', '/en/about',
  ];
  for (const route of publishedRoutes) {
    currentRoute = route;
    const before = allErrs.length;
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    const probe = await page.evaluate(() => ({
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      mainContent: document.querySelector('main, [role="main"]')?.getBoundingClientRect() ?? null,
      visible: document.body?.getBoundingClientRect() ?? null,
      hydrated: !document.documentElement.hasAttribute('data-error'),
    }));
    const newErrs = allErrs.length - before;
    const hydErr = allErrs.slice(before).filter(e => /hydration|did not match|content does not match/i.test(e.text)).length;
    const lcpWarn = allErrs.slice(before).filter(e => /LCP|Largest Contentful Paint/i.test(e.text)).length;
    record(`Published ${route}`,
      newErrs === 0 ? 'ok' : (hydErr > 0 ? 'issue' : 'note'),
      `errs+${newErrs}${hydErr ? ` (hydration ${hydErr})` : ''}${lcpWarn ? ` (LCP ${lcpWarn})` : ''} title="${probe.title.slice(0, 50)}" h1=${probe.h1Count}`);
    await page.screenshot({ path: join(OUT, `pub-${route.replace(/\//g, '_')}.png`), fullPage: false });
  }

  // ===== 2) Mobile hamburger menu — verify a11y fix on actual site =====
  console.log('\n=== Mobile hamburger toggle ===');
  currentRoute = '/ko (mobile)';
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/ko`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: join(OUT, 'mobile-closed.png'), fullPage: false });
  const closedState = await page.evaluate(() => {
    const panel = document.querySelector('.site-mobile-nav-panel');
    if (!panel) return null;
    return {
      ariaModal: panel.getAttribute('aria-modal'),
      ariaHidden: panel.getAttribute('aria-hidden'),
      role: panel.getAttribute('role'),
      visibility: window.getComputedStyle(panel as HTMLElement).visibility,
    };
  });
  record('Mobile nav closed a11y',
    closedState && closedState.ariaModal === null && closedState.ariaHidden === 'true' ? 'ok' : 'issue',
    `ariaModal=${closedState?.ariaModal} ariaHidden=${closedState?.ariaHidden} visibility=${closedState?.visibility}`);

  // Try opening it
  const hamburgerBtn = page.locator('[data-builder-mobile-hamburger="true"], button[aria-controls="site-mobile-nav-drawer"], button:has-text("☰"), button[aria-label*="menu" i]').first();
  if (await hamburgerBtn.count() > 0) {
    await hamburgerBtn.click({ force: true });
    await page.waitForTimeout(700);
    await page.screenshot({ path: join(OUT, 'mobile-open.png'), fullPage: false });
    const openState = await page.evaluate(() => {
      const panel = document.querySelector('.site-mobile-nav-panel');
      if (!panel) return null;
      return {
        ariaModal: panel.getAttribute('aria-modal'),
        ariaHidden: panel.getAttribute('aria-hidden'),
        visibility: window.getComputedStyle(panel as HTMLElement).visibility,
      };
    });
    record('Mobile nav open a11y',
      openState && openState.ariaModal === 'true' && openState.ariaHidden === null ? 'ok' : 'issue',
      `ariaModal=${openState?.ariaModal} ariaHidden=${openState?.ariaHidden} visibility=${openState?.visibility}`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  } else {
    record('Mobile nav hamburger', 'note', 'hamburger 버튼 못 찾음 (셀렉터 미스)');
  }

  // ===== 3) Builder preview routes =====
  console.log('\n=== Builder preview routes ===');
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of ['/ko/builder-preview/about', '/ko/builder-preview/contact']) {
    currentRoute = route;
    const before = allErrs.length;
    const res = await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' }).catch(() => null);
    const status = res?.status() ?? 0;
    await page.waitForTimeout(2000);
    const probe = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      title: document.title,
    }));
    const newErrs = allErrs.length - before;
    record(`Preview ${route}`,
      status === 200 && newErrs === 0 ? 'ok' : (status !== 200 ? 'issue' : 'note'),
      `status=${status} errs+${newErrs} h1=${probe.h1}`);
  }

  // ===== 4) Booking page if exists =====
  console.log('\n=== Booking page ===');
  currentRoute = '/ko/booking';
  const before = allErrs.length;
  const res = await page.goto(`${BASE}/ko/booking`, { waitUntil: 'domcontentloaded' }).catch(() => null);
  const status = res?.status() ?? 0;
  await page.waitForTimeout(2500);
  await page.screenshot({ path: join(OUT, 'booking.png'), fullPage: false });
  const newErrs = allErrs.length - before;
  record(`Booking ${currentRoute}`, status === 200 && newErrs === 0 ? 'ok' : (status !== 200 ? 'note' : 'note'), `status=${status} errs+${newErrs}`);

  // ===== 5) Translations admin — Codex changed it =====
  console.log('\n=== Translations admin ===');
  currentRoute = '/ko/admin-builder/translations';
  const tBefore = allErrs.length;
  const tRes = await page.goto(`${BASE}/ko/admin-builder/translations`, { waitUntil: 'domcontentloaded' }).catch(() => null);
  const tStatus = tRes?.status() ?? 0;
  await page.waitForTimeout(3000);
  await page.screenshot({ path: join(OUT, 'translations.png'), fullPage: false });
  const tInfo = await page.evaluate(() => ({
    tables: document.querySelectorAll('table').length,
    inputs: document.querySelectorAll('input, textarea').length,
    rows: document.querySelectorAll('tr, [class*="row"]').length,
    pagination: document.querySelectorAll('button:has-text("Next"), button:has-text("Prev"), [class*="pagination"]').length,
  }));
  const tNewErrs = allErrs.length - tBefore;
  record('Translations admin', tStatus === 200 && tNewErrs === 0 ? 'ok' : 'note', `status=${tStatus} rows=${tInfo.rows} inputs=${tInfo.inputs} errs+${tNewErrs}`);

  // ===== Summary =====
  console.log('\n=== Errors total ===', allErrs.length);
  const counts: Record<string, number> = {};
  for (const e of allErrs) counts[`${e.route}:${e.type}`] = (counts[`${e.route}:${e.type}`] ?? 0) + 1;
  for (const k of Object.keys(counts)) console.log(`  ${k}: ${counts[k]}`);
  console.log('\nfirst 5 unique error texts:');
  const uniqTexts = Array.from(new Set(allErrs.map(e => e.text.slice(0, 120))));
  uniqTexts.slice(0, 8).forEach(t => console.log(`  - ${t}`));

  writeFileSync(join(OUT, 'findings.json'), JSON.stringify({ findings, allErrs }, null, 2));
  console.log('DIAG_OUT=', OUT);
  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
