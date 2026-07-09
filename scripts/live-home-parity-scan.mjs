#!/usr/bin/env node
// live-home-parity-scan.mjs — 홈 히어로 디컴포즈-드리프트 가드 (2026-07-09).
// ---------------------------------------------------------------------------
// 실버그 근거: zh 홈이 디컴포즈 상태로 발행 드리프트해 이미지 4.3MB(ko 1.1MB의 ~4x)였는데
// 기존 6축(routes/seo/sitemap/a11y/cwv)이 전부 통과시켰다(커버리지 갭). 홈은 컴포지트
// (seed-home v7)여야 하고 로케일 간 무게가 비슷해야 한다. 이 가드가 그 클래스를 잡는다.
//
// 검사(로케일 홈 이미지 총바이트): (a) 로케일 간 비율 max/min > RATIO(기본 2.0) = 한쪽 드리프트,
//   (b) 어느 홈이든 > ABS_KB(기본 2500) = 과대. 둘 중 하나면 발견.
// 사용:  node scripts/live-home-parity-scan.mjs [--base=..] [--ratio=2.0] [--abs-kb=2500]
// 종료:  0 = 파리티 OK, 1 = 드리프트/과대.
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';

const arg = (n, d) => { const h = process.argv.slice(2).find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const BASE = arg('base', 'https://tseng-law.com').replace(/\/$/, '');
const RATIO = Number(arg('ratio', '2.0'));
const ABS_KB = Number(arg('abs-kb', '2500'));
const LOCALES = ['ko', 'zh-hant'];

const browser = await chromium.launch();
const weights = {};
for (const loc of LOCALES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  let bytes = 0, n = 0;
  p.on('response', async (r) => {
    try {
      if (!/image/.test(r.headers()['content-type'] || '')) return;
      let s = Number(r.headers()['content-length'] || 0);
      if (!s) { try { s = (await r.body()).length; } catch {} }
      bytes += s; n += 1;
    } catch {}
  });
  await p.goto(`${BASE}/${loc}`, { waitUntil: 'load', timeout: 30000 });
  await p.waitForTimeout(2800);
  weights[loc] = { kb: Math.round(bytes / 1024), imgs: n };
  await ctx.close();
}
await browser.close();

const kbs = LOCALES.map((l) => weights[l].kb);
const ratio = Math.max(...kbs) / Math.max(1, Math.min(...kbs));
const findings = [];
if (ratio > RATIO) findings.push(`locale image-weight divergence ${ratio.toFixed(1)}x > ${RATIO}x (한쪽 홈 드리프트 의심)`);
for (const l of LOCALES) if (weights[l].kb > ABS_KB) findings.push(`${l} home ${weights[l].kb}KB > ${ABS_KB}KB (과대 — 디컴포즈 드리프트?)`);

for (const l of LOCALES) console.log(`${l} home: ${weights[l].kb}KB (${weights[l].imgs} imgs)`);
console.log(`ratio: ${ratio.toFixed(2)}x`);
findings.forEach((f) => console.log(`✗ ${f}`));
console.log(`\nLIVE HOME PARITY: ${findings.length === 0 ? 'OK (홈 로케일 무게 균형)' : findings.length + ' issue(s)'}`);
process.exitCode = findings.length === 0 ? 0 : 1;
