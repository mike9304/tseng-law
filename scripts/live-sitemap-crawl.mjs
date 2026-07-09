#!/usr/bin/env node
// live-sitemap-crawl.mjs — LIVE sitemap broken-link 축 (자기개선 Critic 제안, 2026-07-09).
// ---------------------------------------------------------------------------
// 기존 스캐너는 고정 12-slug×2-locale + 랜딩 4개만 fetch → 동적 라우트(개별 /columns
// 아티클, /guides 서브페이지)와 sitemap 전 항목이 한 번도 검증되지 않는다. 깨진 아티클
// 라우트나 stale sitemap 항목이 탐지 불가(indexable 손실). 이 스캐너가 sitemap.xml의
// 모든 <loc>를 실제로 fetch해 non-200을 잡는다.
//
// 검사: sitemap.xml 파싱 → 각 <loc> GET → 최종 status 200 아님(3xx redirect 포함) = 발견.
//       + sitemap URL 수가 하한 미만이면 truncated/empty 의심으로 발견.
// 사용:  node scripts/live-sitemap-crawl.mjs [--base=https://tseng-law.com] [--min=50] [--conc=8]
// 종료:  0 = 전 URL 200, 1 = 발견.
// ---------------------------------------------------------------------------
const arg = (n, d) => {
  const h = process.argv.slice(2).find((a) => a.startsWith(`--${n}=`));
  return h ? h.slice(n.length + 3) : d;
};
const BASE = arg('base', 'https://tseng-law.com').replace(/\/$/, '');
const MIN = Number(arg('min', '50'));
const CONC = Number(arg('conc', '8'));

async function fetchStatus(url, method = 'GET') {
  try {
    const c = new AbortController();
    const t = setTimeout(() => c.abort(), 20000);
    const r = await fetch(url, { method, redirect: 'manual', signal: c.signal });
    clearTimeout(t);
    return r.status;
  } catch (e) {
    return `ERR ${String(e.name || e).slice(0, 24)}`;
  }
}

const smText = await (await fetch(`${BASE}/sitemap.xml`)).text().catch(() => '');
const locs = [...smText.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
// sitemapindex면 하위 sitemap도 펼친다
const subSitemaps = locs.filter((u) => /sitemap.*\.xml($|\?)/i.test(u));
let urls = locs.filter((u) => !subSitemaps.includes(u));
for (const sm of subSitemaps) {
  const t = await (await fetch(sm)).text().catch(() => '');
  urls.push(...[...t.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]));
}
urls = [...new Set(urls)];

const findings = [];
if (urls.length < MIN) findings.push(`sitemap only ${urls.length} urls (< ${MIN}) — truncated/empty?`);

let i = 0;
async function worker() {
  while (i < urls.length) {
    const idx = i++;
    const u = urls[idx];
    const st = await fetchStatus(u);
    if (st !== 200) {
      findings.push(`${st}  ${u.replace(BASE, '')}`);
      console.log(`✗ ${st}  ${u.replace(BASE, '')}`);
    }
  }
}
await Promise.all(Array.from({ length: Math.min(CONC, urls.length) }, worker));

console.log(`\nLIVE SITEMAP CRAWL: ${findings.length === 0 ? 'ALL 200' : findings.length + ' issue(s)'} (${urls.length} urls)`);
process.exitCode = findings.length === 0 ? 0 : 1;
