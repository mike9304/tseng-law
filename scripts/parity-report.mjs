#!/usr/bin/env node
// parity-report.mjs — tseng-law 라이브 vs 로컬 시각 패리티 판정기
// ---------------------------------------------------------------------------
// Playwright 로 라이브/로컬 각 페이지·뷰포트 조합의 풀페이지 스크린샷 쌍을 캡처한
// 뒤(팝업 닫기 · document.fonts.ready 대기 · 스크롤 워밍업), PNG 를 pixelmatch /
// PIL 없이 node 내장 zlib 만으로 직접 디코딩해 같은 높이/너비로 크롭한 뒤 픽셀·행
// 단위 diff 율을 계산한다. 페이지별 diff% 와 높이차 테이블을 콘솔 + JSON 으로 출력.
//
// 사용:
//   node scripts/parity-report.mjs \
//     --live=https://tseng-law.com --local=http://127.0.0.1:4643 \
//     --pages=/ko,/ko/about,/ko/columns,/ko/pricing,/ko/services,/ko/lawyers,/ko/videos,/ko/reviews \
//     --viewports=1280x900,375x812
//
// 주의: 이 스크립트는 서버를 기동하지 않는다. 로컬은 이미 --local 포트에서 떠 있어야 한다.
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';
import { inflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

// --- 인자 파싱 --------------------------------------------------------------
function arg(name, def) {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : def;
}
const LIVE = arg('live', 'https://tseng-law.com').replace(/\/$/, '');
const LOCAL = arg('local', 'http://127.0.0.1:4643').replace(/\/$/, '');
const PAGES = arg('pages', '/ko,/ko/about,/ko/columns,/ko/pricing,/ko/services,/ko/lawyers,/ko/videos,/ko/reviews')
  .split(',').map((s) => s.trim()).filter(Boolean);
const VIEWPORTS = arg('viewports', '1280x900,375x812')
  .split(',').map((s) => s.trim()).filter(Boolean)
  .map((s) => { const [w, h] = s.split('x').map(Number); return { w, h, label: s }; });
const OUT_JSON = arg('out', '/private/tmp/claude-501/-Users-son7/c3602988-f51c-449e-b85c-8fb5daea9654/scratchpad/parity-report.json');
// 픽셀이 "다르다"고 판정하는 채널 합산 차이 임계값(안티에일리어싱 노이즈 무시용)
const THRESH = Number(arg('threshold', '48'));
const SAVE_SHOTS = arg('shots', '1') !== '0';
const OUT_DIR = dirname(OUT_JSON);
const SHOTS_DIR = join(OUT_DIR, 'parity-shots');

// --- PNG 디코더 (node zlib 만 사용, 외부 의존 없음) --------------------------
// colorType 0/2/4/6, bitDepth 8, non-interlaced 지원 (Playwright 출력 커버)
const PNG_SIG = [137, 80, 78, 71, 13, 10, 26, 10];
const CHANNELS_BY_TYPE = { 0: 1, 2: 3, 4: 2, 6: 4 };

function decodePng(buffer) {
  for (let i = 0; i < 8; i++) if (buffer[i] !== PNG_SIG[i]) throw new Error('PNG 시그니처 아님');
  let off = 8;
  let width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0;
  const idat = [];
  while (off + 8 <= buffer.length) {
    const len = buffer.readUInt32BE(off); off += 4;
    const type = buffer.toString('ascii', off, off + 4); off += 4;
    const data = buffer.subarray(off, off + len); off += len;
    off += 4; // CRC 스킵
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }
  if (bitDepth !== 8) throw new Error(`미지원 bitDepth ${bitDepth}`);
  if (interlace !== 0) throw new Error('인터레이스 PNG 미지원');
  const channels = CHANNELS_BY_TYPE[colorType];
  if (!channels) throw new Error(`미지원 colorType ${colorType}`);
  const raw = inflateSync(Buffer.concat(idat));
  const bpp = channels; // 8-bit → 채널 수 = 픽셀당 바이트
  const stride = width * bpp;
  const out = Buffer.allocUnsafe(height * stride);
  let pos = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[pos++];
    const rowStart = y * stride;
    const prevStart = rowStart - stride;
    for (let x = 0; x < stride; x++) {
      const rawByte = raw[pos++];
      const a = x >= bpp ? out[rowStart + x - bpp] : 0;
      const b = y > 0 ? out[prevStart + x] : 0;
      const c = (y > 0 && x >= bpp) ? out[prevStart + x - bpp] : 0;
      let val;
      switch (filter) {
        case 0: val = rawByte; break;              // None
        case 1: val = rawByte + a; break;          // Sub
        case 2: val = rawByte + b; break;          // Up
        case 3: val = rawByte + ((a + b) >> 1); break; // Average
        case 4: {                                  // Paeth
          const p = a + b - c;
          const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          val = rawByte + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
          break;
        }
        default: throw new Error(`잘못된 필터 타입 ${filter}`);
      }
      out[rowStart + x] = val & 0xff;
    }
  }
  return { width, height, channels, data: out };
}

// --- 픽셀·행 단위 diff -------------------------------------------------------
function diffImages(A, B, threshold) {
  const w = Math.min(A.width, B.width);
  const h = Math.min(A.height, B.height);
  const chA = A.channels, chB = B.channels;
  const total = w * h || 1;
  let diffPixels = 0;
  let rowsDiffered = 0;
  for (let y = 0; y < h; y++) {
    let rowDiff = 0;
    const baseA = y * A.width * chA;
    const baseB = y * B.width * chB;
    for (let x = 0; x < w; x++) {
      const ia = baseA + x * chA;
      const ib = baseB + x * chB;
      const dr = Math.abs(A.data[ia] - B.data[ib]);
      const dg = Math.abs(A.data[ia + 1] - B.data[ib + 1]);
      const db = Math.abs(A.data[ia + 2] - B.data[ib + 2]);
      if (dr + dg + db > threshold) { diffPixels++; rowDiff++; }
    }
    if (rowDiff / w > 0.02) rowsDiffered++; // 행 픽셀 2% 초과 변화 시 "다른 행"
  }
  return {
    diffPct: +((100 * diffPixels) / total).toFixed(2),
    rowDiffPct: +((100 * rowsDiffered) / h).toFixed(2),
    comparedW: w,
    comparedH: h,
  };
}

// --- 팝업/배너 닫기 (best-effort) -------------------------------------------
async function dismissPopups(page) {
  await page.keyboard.press('Escape').catch(() => {});
  const selectors = [
    '[aria-label="Close"]', '[aria-label="close"]', '[aria-label*="닫기"]',
    'button[class*="close" i]', '[class*="modal" i] button[class*="close" i]',
    '[data-testid*="close" i]', '.popup-close', '.modal-close',
    '[class*="cookie" i] button', '[id*="cookie" i] button',
    'button:has-text("닫기")', 'button:has-text("확인")', 'button:has-text("동의")',
    'button:has-text("×")', 'button:has-text("✕")',
  ];
  for (const sel of selectors) {
    try {
      const loc = page.locator(sel).first();
      if (await loc.count() && await loc.isVisible()) {
        await loc.click({ timeout: 700 }).catch(() => {});
      }
    } catch { /* 무시 */ }
  }
  await page.keyboard.press('Escape').catch(() => {});
}

// --- 단일 페이지 캡처 --------------------------------------------------------
async function capture(context, url) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e && e.message ? e.message : e)));
  let navOk = true;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  } catch {
    navOk = false;
    try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }); } catch { /* 무시 */ }
  }
  await dismissPopups(page);
  // 애니메이션/트랜지션 정지 → 스크린샷 안정화
  await page.addStyleTag({
    content: `*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;` +
      `transition-duration:0s!important;transition-delay:0s!important;caret-color:transparent!important;}` +
      `html{scroll-behavior:auto!important;}`,
  }).catch(() => {});
  // 폰트 로드 대기
  await page.evaluate(() => (document.fonts && document.fonts.ready ? document.fonts.ready.then(() => true) : true)).catch(() => {});
  // 스크롤 워밍업 (lazy-load / reveal 트리거)
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const step = () => {
        window.scrollTo(0, y);
        y += Math.max(400, Math.floor(window.innerHeight * 0.8));
        if (y < document.body.scrollHeight + window.innerHeight) setTimeout(step, 70);
        else { window.scrollTo(0, 0); setTimeout(res, 400); }
      };
      step();
    });
  }).catch(() => {});
  await dismissPopups(page); // 스크롤 후 뜬 팝업 재차 닫기
  await page.waitForTimeout(500);
  const dims = await page.evaluate(() => ({
    w: document.documentElement.scrollWidth,
    h: document.documentElement.scrollHeight,
  })).catch(() => ({ w: 0, h: 0 }));
  let buf = null;
  try { buf = await page.screenshot({ fullPage: true, type: 'png' }); } catch { /* 무시 */ }
  await page.close();
  return { buf, dims, errors, navOk };
}

const slug = (p) => (p === '/' ? 'root' : p.replace(/^\//, '').replace(/\//g, '_')) || 'root';

// --- 메인 -------------------------------------------------------------------
async function main() {
  if (SAVE_SHOTS) mkdirSync(SHOTS_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });
  const t0 = Date.now();
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: 1,
      });
      for (const p of PAGES) {
        const liveUrl = LIVE + p;
        const localUrl = LOCAL + p;
        process.stdout.write(`캡처 중: [${vp.label}] ${p} ... `);
        const live = await capture(context, liveUrl);
        const local = await capture(context, localUrl);
        if (SAVE_SHOTS) {
          if (live.buf) writeFileSync(join(SHOTS_DIR, `${vp.label}-${slug(p)}-live.png`), live.buf);
          if (local.buf) writeFileSync(join(SHOTS_DIR, `${vp.label}-${slug(p)}-local.png`), local.buf);
        }
        let d = { diffPct: null, rowDiffPct: null, comparedW: null, comparedH: null, error: null };
        if (live.buf && local.buf) {
          try {
            d = { ...diffImages(decodePng(live.buf), decodePng(local.buf), THRESH), error: null };
          } catch (e) {
            d = { diffPct: null, rowDiffPct: null, comparedW: null, comparedH: null, error: e.message };
          }
        } else {
          d.error = '스크린샷 캡처 실패';
        }
        const row = {
          page: p,
          viewport: vp.label,
          liveH: live.dims.h,
          localH: local.dims.h,
          heightDiff: local.dims.h - live.dims.h,
          diffPct: d.diffPct,
          rowDiffPct: d.rowDiffPct,
          comparedH: d.comparedH,
          liveErrors: live.errors.length,
          localErrors: local.errors.length,
          note: d.error || (!live.navOk ? 'live nav 경고' : !local.navOk ? 'local nav 경고' : ''),
        };
        results.push(row);
        console.log(d.diffPct != null ? `diff ${d.diffPct}% (Δh ${row.heightDiff}px)` : `실패: ${d.error}`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  const elapsedSec = +((Date.now() - t0) / 1000).toFixed(1);

  // 페이지별 diff% 순위 (뷰포트별로 정렬)
  const byViewport = {};
  for (const vp of VIEWPORTS) {
    byViewport[vp.label] = results
      .filter((r) => r.viewport === vp.label)
      .slice()
      .sort((a, b) => (b.diffPct ?? -1) - (a.diffPct ?? -1));
  }
  const valid = results.filter((r) => r.diffPct != null);
  const avgDiff = valid.length ? +(valid.reduce((s, r) => s + r.diffPct, 0) / valid.length).toFixed(2) : null;

  const report = {
    generatedAt: new Date().toISOString(),
    live: LIVE,
    local: LOCAL,
    threshold: THRESH,
    viewports: VIEWPORTS.map((v) => v.label),
    pages: PAGES,
    elapsedSec,
    avgDiffPct: avgDiff,
    shotsDir: SAVE_SHOTS ? SHOTS_DIR : null,
    results,
    rankingByViewport: byViewport,
  };
  writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));

  // 콘솔 테이블
  console.log('\n===== 패리티 리포트 =====');
  console.log(`live=${LIVE}  local=${LOCAL}  threshold=${THRESH}  경과=${elapsedSec}s  평균 diff=${avgDiff}%`);
  console.table(results.map((r) => ({
    page: r.page,
    vp: r.viewport,
    'diff%': r.diffPct,
    'rowDiff%': r.rowDiffPct,
    liveH: r.liveH,
    localH: r.localH,
    'Δh': r.heightDiff,
    note: r.note,
  })));
  for (const vp of VIEWPORTS) {
    console.log(`\n[${vp.label}] diff% 높은 순:`);
    byViewport[vp.label].forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.page.padEnd(16)} ${r.diffPct != null ? r.diffPct + '%' : '(실패)'}  Δh=${r.heightDiff}px`);
    });
  }
  console.log(`\nJSON 저장: ${OUT_JSON}`);
  if (SAVE_SHOTS) console.log(`스크린샷: ${SHOTS_DIR}`);
}

main().catch((e) => { console.error('치명적 오류:', e); process.exit(1); });
