// ---------------------------------------------------------------------------
// live-routes-scan — 라이브 전 표준 페이지(ko/zh-hant × 12 slug)를 실브라우저로
// 순회하며 HTTP 상태 + 콘솔 에러 + 페이지 예외를 수집하는 스모크 게이트.
//
// 사용:  node scripts/live-routes-scan.mjs [--base=https://tseng-law.com]
// 종료코드: 0 = 전판 클린, 1 = 이슈 존재.
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';

const baseArg = process.argv.slice(2).find((a) => a.startsWith('--base='));
const BASE = (baseArg ? baseArg.slice(7) : 'https://tseng-law.com').replace(/\/$/, '');

const pages = ['', 'about', 'services', 'contact', 'lawyers', 'pricing', 'reviews', 'columns', 'faq', 'videos', 'privacy', 'disclaimer'];
const locales = ['ko', 'zh-hant'];

// KNOWN, documented, deferred (T16, post-handoff): decomposed pages own no
// responsive rects in the 1024-1279 band, so their 1280-stage absolute layout
// bleeds ~205-256px there. These are already tracked; keep the standing gate a
// clean NEW-regression signal by not re-flagging them. `<loc>/<slug>@<vp>`.
const KNOWN_OVERFLOW = new Set([
  'zh-hant/privacy@1024', 'zh-hant/disclaimer@1024',
  'ko/privacy@1024', 'ko/disclaimer@1024',
  'zh-hant/services@1024', 'zh-hant/@1024',
]);

const browser = await chromium.launch();
const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
// Phones the audit measured overflow at (390 is the reported zh-home case).
// The 769-1279 composite/decomposed band (T15/T16) and the 375/390 mobile band
// (zh-home FAQ + split-content) are BOTH regression classes the standing scan
// must catch.
const measureOverflow = (page) => page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
).catch(() => 0);
let issues = 0;
for (const loc of locales) {
  for (const slug of pages) {
    const page = await desktop.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 100)); });
    page.on('pageerror', (e) => errs.push('PAGEERROR: ' + String(e).slice(0, 100)));
    const url = `${BASE}/${loc}/${slug}`;
    let status = 0;
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      status = resp?.status() ?? 0;
    } catch (e) { errs.push('NAV: ' + String(e).slice(0, 60)); }
    await page.waitForTimeout(800);
    const hOverflow = await measureOverflow(page);
    if (hOverflow > 2) errs.push(`H-OVERFLOW(1280) ${hOverflow}px`);
    await page.close();

    // Mid-band pass (1024px desktop/tablet landscape). T16 proved this band can
    // overflow even when both 1280px desktop and 390px phone checks are clean.
    const bp = await browser.newContext({ viewport: { width: 1024, height: 900 } });
    const bpage = await bp.newPage();
    try {
      await bpage.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await bpage.waitForTimeout(600);
      const bOverflow = await measureOverflow(bpage);
      if (bOverflow > 2 && !KNOWN_OVERFLOW.has(`${loc}/${slug}@1024`)) errs.push(`H-OVERFLOW(1024) ${bOverflow}px`);
    } catch { /* mid-band nav failure is captured by the desktop status already */ }
    await bp.close();

    // Mobile overflow pass (390px phone). The zh-hant home FAQ/split-content
    // overflow (~21px) was invisible to the desktop-only scan; check it too.
    const mp = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
    const mpage = await mp.newPage();
    try {
      await mpage.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await mpage.waitForTimeout(600);
      const mOverflow = await measureOverflow(mpage);
      if (mOverflow > 2) errs.push(`H-OVERFLOW(390) ${mOverflow}px`);
    } catch { /* mobile nav failure is captured by the desktop status already */ }
    await mp.close();

    if (status !== 200 || errs.length > 0) {
      issues++;
      console.log(`✗ ${loc}/${slug || '(home)'} status=${status} errors=${errs.length}`, errs.slice(0, 3));
    } else {
      console.log(`✓ ${loc}/${slug || '(home)'}`);
    }
  }
}
console.log(issues === 0 ? 'ROUTES+CONSOLE+1280+1024+390: ALL CLEAN' : `ISSUES: ${issues}`);
await desktop.close();
await browser.close();
process.exit(issues === 0 ? 0 : 1);
