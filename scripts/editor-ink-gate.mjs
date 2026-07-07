// ---------------------------------------------------------------------------
// editor-ink-gate — 에디터 캔버스에서 어토니 카드 섹션 라벨('소개/학력/경력')의
// 실제 텍스트 잉크가 이웃 행과 겹치지 않는지 측정하는 게이트.
//
// 왜 전용 도구인가 (SELF-IMPROVE-LOOP.md L11):
//   에디터는 노드마다 CanvasNodeBadge('text· 806×32')를 DOM에 포함하므로
//   bbox/range 기반 스윕은 가짜 충돌을 만든다. 이 게이트는
//   [data-builder-node-body] 내부의 텍스트 노드 잉크만 측정한다.
//
// 측정: 각 라벨에 대해
//   above = 라벨 잉크 top − 위쪽(이전 섹션) 행들의 최대 잉크 bottom
//   below = 자기 리스트 item-0 잉크 top − 라벨 잉크 bottom
// 둘 다 ≥ 1px 이면 PASS. 라벨이 하나도 없으면 VOID(공허 PASS 방지).
//
// 사용:
//   BUILDER_GATE_USER=... BUILDER_GATE_PASS=... \
//   node scripts/editor-ink-gate.mjs --url='https://tseng-law.com/ko/admin-builder?pageId=<pageId>'
//   (localhost URL이면 기본 admin/local-review-2026! 사용)
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';

const urlArg = process.argv.slice(2).find((a) => a.startsWith('--url='));
if (!urlArg) {
  console.error("usage: node scripts/editor-ink-gate.mjs --url='<admin-builder editor URL with pageId>'");
  process.exit(2);
}
const url = urlArg.slice(6);
const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
const username = process.env.BUILDER_GATE_USER ?? (isLocal ? 'admin' : '');
const password = process.env.BUILDER_GATE_PASS ?? (isLocal ? 'local-review-2026!' : '');
if (!username || !password) {
  console.error('set BUILDER_GATE_USER / BUILDER_GATE_PASS for non-local targets');
  process.exit(2);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, httpCredentials: { username, password } });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 180000 });
await page.waitForTimeout(4000);

const result = await page.evaluate(() => {
  const textInk = (el) => {
    const rects = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const parent = n.parentElement;
      if (!parent) continue;
      // 에디터 크롬(배지/오버레이/핸들) 제외 — 노드 본문 내부 텍스트만.
      if (parent.closest("[class*='Badge'],[class*='badge'],[class*='Overlay'],[class*='overlay'],[class*='Handle'],[class*='nodeMeta']")) continue;
      if (!parent.closest('[data-builder-node-body]')) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) if (r.width > 2 && r.height > 2) rects.push(r);
    }
    return rects;
  };
  const out = [];
  for (const label of document.querySelectorAll("[data-node-id*='-intro-label'],[data-node-id*='-education-label'],[data-node-id*='-experience-label']")) {
    const labelId = label.getAttribute('data-node-id');
    if (!/-card(-\d+)?-(intro|education|experience)-label$/.test(labelId)) continue;
    const cardPrefix = labelId.replace(/-(intro|education|experience)-label$/, '');
    const sectionKey = labelId.match(/-(intro|education|experience)-label$/)[1];
    const labelInk = textInk(label);
    if (!labelInk.length) { out.push({ label: labelId, above: null, below: null }); continue; }
    const labelTop = Math.min(...labelInk.map((r) => r.top));
    const labelBottom = Math.max(...labelInk.map((r) => r.bottom));

    let above = null;
    for (const row of document.querySelectorAll(`[data-node-id^='${cardPrefix}-'][data-node-id*='-item-']`)) {
      const ink = textInk(row);
      if (!ink.length) continue;
      const top = Math.min(...ink.map((r) => r.top));
      if (top >= labelTop) continue;
      const bottom = Math.max(...ink.map((r) => r.bottom));
      const c = labelTop - bottom;
      if (above === null || c < above) above = c;
    }

    let below = null;
    const firstRow = document.querySelector(`[data-node-id='${cardPrefix}-${sectionKey}-item-0']`);
    if (firstRow) {
      const ink = textInk(firstRow);
      if (ink.length) below = Math.min(...ink.map((r) => r.top)) - labelBottom;
    }

    const round = (v) => (v === null ? null : Math.round(v * 10) / 10);
    out.push({ label: labelId, above: round(above), below: round(below) });
  }
  return out;
});

let fail = 0;
for (const r of result) {
  const bad = (r.above !== null && r.above < 1) || (r.below !== null && r.below < 1);
  if (bad) fail++;
  console.log(JSON.stringify(r));
}
const verdict = result.length === 0
  ? 'VOID(no attorney-card labels found — wrong pageId or composite draft)'
  : fail === 0 ? 'PASS' : `FAIL(${fail})`;
console.log(`INK GATE: ${verdict}`);
await ctx.close();
await browser.close();
process.exit(result.length === 0 || fail > 0 ? 1 : 0);
