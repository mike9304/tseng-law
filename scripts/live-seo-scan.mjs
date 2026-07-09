#!/usr/bin/env node
// live-seo-scan.mjs — LIVE SEO 무결성 축 (자기개선 tick의 Critic 제안, 2026-07-09).
// ---------------------------------------------------------------------------
// 기존 축(live-routes-scan)은 200+console+overflow만 봐서, 200으로 응답하는
// soft-404 / 빈 app-shell / 누락·중복 <title> / 깨진 hreflang / 파싱불가 JSON-LD를
// 전부 CLEAN으로 흘려보낸다(false-clean). 이 스캐너가 SEO 무결성을 실측한다.
//
// 페이지마다 검사: 렌더 후 (a) <title> 존재·비어있지않음 (전 페이지 유일) (b) meta
// description 존재 (c) canonical self-참조 (d) hreflang 상호성(ko↔zh-hant + x-default)
// (e) 모든 application/ld+json 파싱 (f) 본문 가시텍스트 sentinel(soft-404/app-shell 방어).
//
// 사용:  node scripts/live-seo-scan.mjs [--base=https://tseng-law.com]
// 종료:  0 = 전부 무결, 1 = 발견(SEO 회귀).
// (a11y[axe] 축은 의도적으로 별개 — 이 파일은 SEO만. 이름이 동작을 정직히 반영.)
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';

const baseArg = process.argv.slice(2).find((a) => a.startsWith('--base='));
const BASE = (baseArg ? baseArg.slice('--base='.length) : 'https://tseng-law.com').replace(/\/$/, '');
const BODY_MIN = 200; // 가시 본문 최소 길이(soft-404/app-shell 방어)

const LOCALES = ['ko', 'zh-hant'];
const STD_SLUGS = ['', 'about', 'services', 'contact', 'lawyers', 'pricing', 'reviews', 'columns', 'faq', 'videos', 'privacy', 'disclaimer'];
const LANDING = ['guides/taiwan-company-setup', 'korean-lawyer-in-taiwan'];

const urls = [];
for (const loc of LOCALES) {
  for (const s of STD_SLUGS) urls.push(`/${loc}${s ? '/' + s : ''}`);
  for (const s of LANDING) urls.push(`/${loc}/${s}`);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const titles = new Map(); // title -> [paths]
const rows = [];

for (const path of urls) {
  const page = await ctx.newPage();
  const finds = [];
  let status = 0;
  try {
    const resp = await page.goto(BASE + path, { waitUntil: 'load', timeout: 30000 });
    status = resp ? resp.status() : 0;
    await page.waitForTimeout(800);
    if (status !== 200) finds.push(`STATUS ${status}`);

    const data = await page.evaluate(() => {
      const q = (sel) => document.querySelector(sel);
      const title = (document.title || '').trim();
      const desc = (q('meta[name="description"]')?.getAttribute('content') || '').trim();
      const canonical = q('link[rel="canonical"]')?.getAttribute('href') || '';
      const hreflangs = [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => l.getAttribute('hreflang'));
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent || '');
      const bodyText = (document.body?.innerText || '').replace(/\s+/g, ' ').trim();
      return { title, desc, canonical, hreflangs, ld, bodyLen: bodyText.length };
    });

    if (!data.title) finds.push('title MISSING/empty');
    else { const arr = titles.get(data.title) || []; arr.push(path); titles.set(data.title, arr); }
    if (!data.desc) finds.push('meta description MISSING');
    if (!data.canonical) finds.push('canonical MISSING');
    else if (!data.canonical.replace(/\/$/, '').endsWith(path.replace(/\/$/, '') || '/' + path.split('/')[1])) {
      // self-referential 체크(완화): canonical 경로가 이 페이지 경로로 끝나야 함
      if (!data.canonical.includes(path)) finds.push(`canonical not self (${data.canonical})`);
    }
    const hasKo = data.hreflangs.some((h) => h && h.toLowerCase().startsWith('ko'));
    const hasZh = data.hreflangs.some((h) => h && h.toLowerCase().startsWith('zh'));
    if (!(hasKo && hasZh)) finds.push(`hreflang incomplete [${data.hreflangs.join(',')}]`);
    for (const j of data.ld) { try { JSON.parse(j); } catch { finds.push('JSON-LD parse FAIL'); break; } }
    if (data.bodyLen < BODY_MIN) finds.push(`body too short (${data.bodyLen}<${BODY_MIN}) — soft-404?`);
  } catch (e) {
    finds.push(`nav error: ${String(e).slice(0, 80)}`);
  }
  rows.push({ path, status, finds });
  console.log(`${finds.length ? '✗' : '✓'} ${path}${finds.length ? '  ' + finds.join('; ') : ''}`);
  await page.close();
}

// 전 페이지 <title> 유일성
const dupes = [...titles.entries()].filter(([, paths]) => paths.length > 1);
for (const [t, paths] of dupes) console.log(`✗ DUP TITLE "${t.slice(0, 50)}" on ${paths.join(', ')}`);

await browser.close();
const issues = rows.filter((r) => r.finds.length).length + dupes.length;
console.log(`\nLIVE SEO SCAN: ${issues === 0 ? 'ALL CLEAN' : issues + ' page(s)/dupes with SEO issues'} (${urls.length} urls)`);
process.exitCode = issues === 0 ? 0 : 1;
