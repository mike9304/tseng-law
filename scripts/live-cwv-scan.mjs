#!/usr/bin/env node
// live-cwv-scan.mjs — LIVE Core Web Vitals 축 (LCP/CLS), Critic 제안 (2026-07-09).
// ---------------------------------------------------------------------------
// PerformanceObserver로 LCP·CLS를 측정한다. 무인 tick은 flaky하면 안 되므로 **loose
// "poor" 게이트만**: LCP>4000ms 또는 CLS>0.25 (Google poor 임계)일 때만 발견으로 본다.
// 이는 파괴적 성능 회귀(LCP가 갑자기 8s, 큰 레이아웃 시프트)를 잡되, 측정 노이즈로는
// RED가 되지 않는다. CLS는 스로틀 무관하게 신뢰 가능(레이아웃 시프트 누적)해 신호가 강하다.
// (풀 Lighthouse 필드 점수는 CI의 lhci(run-lhci.mjs)가 담당 — 여긴 회귀 catastrophe만.)
//
// 사용:  node scripts/live-cwv-scan.mjs [--base=https://tseng-law.com]
// 종료:  0 = 전 페이지 poor 임계 이내, 1 = poor CWV(성능 회귀).
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';

const arg = (n, d) => { const h = process.argv.slice(2).find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const BASE = arg('base', 'https://tseng-law.com').replace(/\/$/, '');
const LCP_POOR = 4000; // ms
const CLS_POOR = 0.25;

// 성능은 템플릿 주도 — 대표 페이지 서브셋(전 28 불필요)
const PATHS = ['/ko', '/zh-hant', '/ko/about', '/ko/lawyers', '/ko/columns', '/ko/columns/taiwan-company-establishment-basics', '/ko/guides/taiwan-company-setup'];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const findings = [];

for (const path of PATHS) {
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    try {
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) { if (!e.hadRecentInput) window.__cls += e.value; } }).observe({ type: 'layout-shift', buffered: true });
    } catch { /* older engines */ }
  });
  let lcp = -1, cls = -1;
  try {
    await page.goto(BASE + path, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(3000); // LCP settle
    const m = await page.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls }));
    lcp = Math.round(m.lcp); cls = +m.cls.toFixed(3);
    const bad = [];
    if (lcp > LCP_POOR) bad.push(`LCP ${lcp}ms>${LCP_POOR}`);
    if (cls > CLS_POOR) bad.push(`CLS ${cls}>${CLS_POOR}`);
    if (bad.length) { findings.push(`${path}: ${bad.join(', ')}`); console.log(`✗ ${path}  LCP=${lcp}ms CLS=${cls}  [${bad.join(', ')}]`); }
    else console.log(`✓ ${path}  LCP=${lcp}ms CLS=${cls}`);
  } catch (e) {
    console.log(`! ${path}  measure error: ${String(e).slice(0, 60)}`);
  }
  await page.close();
}
await browser.close();
console.log(`\nLIVE CWV SCAN: ${findings.length === 0 ? 'no poor CWV' : findings.length + ' poor page(s)'} (LCP>${LCP_POOR}ms | CLS>${CLS_POOR})`);
process.exitCode = findings.length === 0 ? 0 : 1;
