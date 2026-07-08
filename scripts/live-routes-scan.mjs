// ---------------------------------------------------------------------------
// live-routes-scan — 라이브 전 표준 페이지(ko/zh-hant × 12 slug)를 실브라우저로
// 순회하며 HTTP 상태 + 콘솔 에러 + 페이지 예외 + 가로 오버플로를 수집하는 스모크 게이트.
//
// 사용:  node scripts/live-routes-scan.mjs [--base=https://tseng-law.com]
// 종료코드: 0 = 전판 클린, 1 = 이슈 존재.
//
// 신뢰성: 한 페이지가 플래그되면(status≠200 또는 err>0) 즉시 이슈로 세지 않고
// 1회 재검증한다. 부하 하 단일 페이지 로드의 일시적 글리치(느린 로드·렌더 중
// 측정)는 재현되지 않아 걸러지고, 진짜 결함(오버플로·콘솔에러)은 재현되어 남는다
// (L3 red 재현 의무화). navigation wait는 `load`(networkidle은 zh-hant home에서
// 장주기 컨텍스트 false timeout 유발 — L18).
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';

const baseArg = process.argv.slice(2).find((a) => a.startsWith('--base='));
const BASE = (baseArg ? baseArg.slice(7) : 'https://tseng-law.com').replace(/\/$/, '');

const pages = ['', 'about', 'services', 'contact', 'lawyers', 'pricing', 'reviews', 'columns', 'faq', 'videos', 'privacy', 'disclaimer'];
const locales = ['ko', 'zh-hant'];

const browser = await chromium.launch();

const measureOverflow = (page) => page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
);

function shortError(error) {
  return String(error).slice(0, 80);
}

// 한 페이지의 전 뷰포트 검사(1280 데스크톱 + 1024 태블릿/소형노트북 + 390 모바일).
// The 769-1279 composite/decomposed band (T15/T16) and the 375/390 mobile band
// (zh-home FAQ + split-content) are BOTH regression classes the standing scan
// must catch.
async function scanOne(loc, slug) {
  const url = `${BASE}/${loc}/${slug}`;
  const errs = [];
  let status = 0;

  // 1280 desktop pass — also owns the HTTP status + console/pageerror capture.
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await desktop.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 100)); });
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + String(e).slice(0, 100)));
  try {
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    status = resp?.status() ?? 0;
    if (status !== 200) errs.push(`STATUS(1280) ${status}`);
    await page.waitForTimeout(800);
    const hOverflow = await measureOverflow(page);
    if (hOverflow > 2) errs.push(`H-OVERFLOW(1280) ${hOverflow}px`);
  } catch (e) { errs.push('CHECK-FAIL(1280): ' + shortError(e)); }
  await desktop.close();

  // Mid-band pass (1024px desktop/tablet landscape). T16 proved this band can
  // overflow even when both 1280px desktop and 390px phone checks are clean.
  const bp = await browser.newContext({ viewport: { width: 1024, height: 900 } });
  const bpage = await bp.newPage();
  try {
    const resp = await bpage.goto(url, { waitUntil: 'load', timeout: 45000 });
    const bStatus = resp?.status() ?? 0;
    if (bStatus !== 200) errs.push(`STATUS(1024) ${bStatus}`);
    await bpage.waitForTimeout(600);
    const bOverflow = await measureOverflow(bpage);
    if (bOverflow > 2) errs.push(`H-OVERFLOW(1024) ${bOverflow}px`);
  } catch (e) { errs.push('CHECK-FAIL(1024): ' + shortError(e)); }
  await bp.close();

  // Mobile overflow pass (390px phone). The zh-hant home FAQ/split-content
  // overflow (~21px) was invisible to the desktop-only scan; check it too.
  const mp = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  const mpage = await mp.newPage();
  try {
    const resp = await mpage.goto(url, { waitUntil: 'load', timeout: 45000 });
    const mStatus = resp?.status() ?? 0;
    if (mStatus !== 200) errs.push(`STATUS(390) ${mStatus}`);
    await mpage.waitForTimeout(600);
    const mOverflow = await measureOverflow(mpage);
    if (mOverflow > 2) errs.push(`H-OVERFLOW(390) ${mOverflow}px`);
  } catch (e) { errs.push('CHECK-FAIL(390): ' + shortError(e)); }
  await mp.close();

  return { status, errs };
}

let issues = 0;
for (const loc of locales) {
  for (const slug of pages) {
    let { status, errs } = await scanOne(loc, slug);
    // Flagged → 1회 재검증. 재현될 때만 진짜 이슈로 카운트(일시적 글리치 제거).
    if (status !== 200 || errs.length > 0) {
      const retry = await scanOne(loc, slug);
      status = retry.status;
      errs = retry.errs;
    }
    if (status !== 200 || errs.length > 0) {
      issues++;
      console.log(`✗ ${loc}/${slug || '(home)'} status=${status} errors=${errs.length}`, errs.slice(0, 3));
    } else {
      console.log(`✓ ${loc}/${slug || '(home)'}`);
    }
  }
}
console.log(issues === 0 ? 'ROUTES+CONSOLE+1280+1024+390: ALL CLEAN' : `ISSUES: ${issues}`);
await browser.close();
process.exit(issues === 0 ? 0 : 1);
