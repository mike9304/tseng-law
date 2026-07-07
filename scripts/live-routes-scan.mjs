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

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
let issues = 0;
for (const loc of locales) {
  for (const slug of pages) {
    const page = await ctx.newPage();
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
    if (status !== 200 || errs.length > 0) {
      issues++;
      console.log(`✗ ${loc}/${slug || '(home)'} status=${status} errors=${errs.length}`, errs.slice(0, 3));
    } else {
      console.log(`✓ ${loc}/${slug || '(home)'}`);
    }
    await page.close();
  }
}
console.log(issues === 0 ? 'ROUTES+CONSOLE: ALL CLEAN' : `ISSUES: ${issues}`);
await ctx.close();
await browser.close();
process.exit(issues === 0 ? 0 : 1);
