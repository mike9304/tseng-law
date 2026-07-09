#!/usr/bin/env node
// live-a11y-scan.mjs — LIVE 접근성(a11y) 축, baseline+delta (Critic 제안, 2026-07-09).
// ---------------------------------------------------------------------------
// axe-core를 라이브 페이지에 주입해 serious/critical 위반을 수집한다. 기존 사이트에는
// 이미 알려진(인도 비차단으로 수용된, A3/A4) 위반이 있으므로 **baseline + delta** 방식:
//   - baseline 없으면: 현재 위반 전체를 baseline으로 기록하고 통과(exit 0).
//   - baseline 있으면: baseline에 없는 **새 위반만** 발견으로 보고(회귀 게이트). exit 1.
// 즉 tick은 기지 위반으로 RED가 되지 않고, 새로 생긴 a11y 회귀만 잡는다.
//
// 사용:  node scripts/live-a11y-scan.mjs [--base=https://tseng-law.com] [--reset-baseline]
// baseline: scripts/a11y-baseline.json (커밋 대상). key = "<path>::<ruleId>".
// 종료:  0 = 새 위반 없음/baseline 수립, 1 = 새 a11y 위반.
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const arg = (n, d) => { const h = process.argv.slice(2).find((a) => a.startsWith(`--${n}=`)); return h ? h.slice(n.length + 3) : d; };
const flag = (n) => process.argv.slice(2).includes(`--${n}`);
const BASE = arg('base', 'https://tseng-law.com').replace(/\/$/, '');
const BASELINE_FILE = 'scripts/a11y-baseline.json';
const IMPACTS = new Set(['serious', 'critical']);

const LOCALES = ['ko', 'zh-hant'];
const STD = ['', 'about', 'services', 'contact', 'lawyers', 'pricing', 'reviews', 'columns', 'faq', 'videos', 'privacy', 'disclaimer'];
const LANDING = ['guides/taiwan-company-setup', 'korean-lawyer-in-taiwan'];
const paths = [];
for (const loc of LOCALES) { for (const s of STD) paths.push(`/${loc}${s ? '/' + s : ''}`); for (const s of LANDING) paths.push(`/${loc}/${s}`); }

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const current = new Map(); // key -> {path, id, impact, help}

for (const path of paths) {
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + path, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(600);
    const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    for (const v of res.violations) {
      if (!IMPACTS.has(v.impact)) continue;
      const key = `${path}::${v.id}`;
      if (!current.has(key)) current.set(key, { path, id: v.id, impact: v.impact, help: (v.help || '').slice(0, 80) });
    }
    console.log(`· ${path}  serious/critical rules: ${[...current.keys()].filter((k) => k.startsWith(path + '::')).length}`);
  } catch (e) {
    console.log(`! ${path}  scan error: ${String(e).slice(0, 60)}`);
  }
  await page.close();
}
await browser.close();

const curKeys = new Set(current.keys());

if (!existsSync(BASELINE_FILE) || flag('reset-baseline')) {
  writeFileSync(BASELINE_FILE, JSON.stringify({ generatedFor: BASE, known: [...curKeys].sort() }, null, 2) + '\n');
  console.log(`\nA11Y BASELINE ESTABLISHED: ${curKeys.size} known serious/critical rule-instances (scripts/a11y-baseline.json). Future runs flag only NEW ones.`);
  process.exitCode = 0;
} else {
  const baseline = new Set((JSON.parse(readFileSync(BASELINE_FILE, 'utf8')).known) || []);
  const fresh = [...curKeys].filter((k) => !baseline.has(k));
  for (const k of fresh) { const v = current.get(k); console.log(`✗ NEW a11y ${v.impact}: ${v.id} @ ${v.path} — ${v.help}`); }
  console.log(`\nA11Y SCAN: ${fresh.length === 0 ? 'no new violations' : fresh.length + ' NEW violation(s)'} (baseline known=${baseline.size}, current=${curKeys.size})`);
  process.exitCode = fresh.length === 0 ? 0 : 1;
}
