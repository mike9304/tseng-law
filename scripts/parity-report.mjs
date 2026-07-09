#!/usr/bin/env node
// parity-report.mjs — tseng-law 라이브 vs 로컬 시각 패리티 판정기
// ---------------------------------------------------------------------------
// Playwright 로 라이브/로컬 각 페이지·뷰포트 조합을 실제 뷰포트 단위로 스크롤 캡처해
// 한 장으로 스티칭한 뒤(팝업 닫기 · 애니메이션/로테이터 freeze · lazy 이미지 대기),
// PNG 를 pixelmatch / PIL 없이 node 내장 zlib 만으로 직접 디코딩해 같은 높이/너비로
// 크롭한 뒤 픽셀·행 단위 diff 율을 계산한다. 페이지별 diff% 와 높이차 테이블을 콘솔
// + JSON 으로 출력.
//
// 사용:
//   node scripts/parity-report.mjs \
//     --live=https://tseng-law.com --local=http://127.0.0.1:4643 \
//     --pages=/ko,/ko/about,/ko/columns,/ko/pricing,/ko/services,/ko/lawyers,/ko/videos,/ko/reviews \
//     --viewports=1280x900,375x812
//
// 옵션:
//   --fast       기존 Playwright fullPage 캡처 경로 사용
//   --no-freeze  prefers-reduced-motion/freeze CSS/known rotator 고정을 끔
//
// 주의: 이 스크립트는 서버를 기동하지 않는다. 로컬은 이미 --local 포트에서 떠 있어야 한다.
// ---------------------------------------------------------------------------
import { chromium } from 'playwright';
import { deflateSync, inflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

// --- 인자 파싱 --------------------------------------------------------------
function arg(name, def) {
  const hit = process.argv.slice(2).find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : def;
}
function flag(name) {
  return process.argv.slice(2).includes(`--${name}`);
}
const LIVE = arg('live', 'https://tseng-law.com').replace(/\/$/, '');
const LOCAL = arg('local', 'http://127.0.0.1:4643').replace(/\/$/, '');
const PAGES = arg('pages', '/ko,/ko/about,/ko/columns,/ko/pricing,/ko/services,/ko/lawyers,/ko/videos,/ko/reviews')
  .split(',').map((s) => s.trim()).filter(Boolean);
const VIEWPORTS = arg('viewports', '1280x900,375x812')
  .split(',').map((s) => s.trim()).filter(Boolean)
  .map((s) => { const [w, h] = s.split('x').map(Number); return { w, h, label: s }; });
const OUT_JSON = arg('out', join(process.cwd(), 'tmp', 'parity-report.json'));
// 픽셀이 "다르다"고 판정하는 채널 합산 차이 임계값(안티에일리어싱 노이즈 무시용)
const THRESH = Number(arg('threshold', '48'));
const SAVE_SHOTS = arg('shots', '1') !== '0';
const FAST_CAPTURE = flag('fast');
const FREEZE_CAPTURE = !flag('no-freeze');
// 높이 드리프트 게이트: diff%는 공통 최소높이로 크롭해 계산하므로 stageHeight 높이차(Δh)에
// 눈이 먼다. |Δh|가 이 임계(px)를 넘으면 heightGate failure로 집계한다(기본 16px).
const MAX_HEIGHT_DIFF = Number(arg('max-height-diff', '16'));
// --gate-height가 있을 때만 height failure를 종료코드(2)로 승격한다(하위호환: 기본 off).
const GATE_HEIGHT = flag('gate-height');
const OUT_DIR = dirname(OUT_JSON);
const SHOTS_DIR = join(OUT_DIR, 'parity-shots');

// --- PNG 디코더 (node zlib 만 사용, 외부 의존 없음) --------------------------
// colorType 0/2/4/6, bitDepth 8, non-interlaced 지원 (Playwright 출력 커버)
const PNG_SIG = [137, 80, 78, 71, 13, 10, 26, 10];
const CHANNELS_BY_TYPE = { 0: 1, 2: 3, 4: 2, 6: 4 };
let CRC_TABLE = null;

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

function crcTable() {
  if (CRC_TABLE) return CRC_TABLE;
  CRC_TABLE = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    CRC_TABLE[n] = c >>> 0;
  }
  return CRC_TABLE;
}

function crc32(buffer) {
  const table = crcTable();
  let c = 0xffffffff;
  for (const byte of buffer) c = table[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data = Buffer.alloc(0)) {
  const typeBuf = Buffer.from(type, 'ascii');
  const out = Buffer.allocUnsafe(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  typeBuf.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 8 + data.length);
  return out;
}

function encodePngRgba(width, height, rgba) {
  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const stride = width * 4;
  const raw = Buffer.allocUnsafe((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const rawStart = y * (stride + 1);
    raw[rawStart] = 0;
    rgba.copy(raw, rawStart + 1, y * stride, y * stride + stride);
  }
  return Buffer.concat([
    Buffer.from(PNG_SIG),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw)),
    pngChunk('IEND'),
  ]);
}

function rgbAt(image, offset) {
  if (image.channels === 1 || image.channels === 2) {
    const gray = image.data[offset];
    return [gray, gray, gray];
  }
  return [image.data[offset], image.data[offset + 1], image.data[offset + 2]];
}

function toRgba(image) {
  if (image.channels === 4) return image.data;
  const out = Buffer.allocUnsafe(image.width * image.height * 4);
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const src = (y * image.width + x) * image.channels;
      const dest = (y * image.width + x) * 4;
      if (image.channels === 1 || image.channels === 2) {
        out[dest] = image.data[src];
        out[dest + 1] = image.data[src];
        out[dest + 2] = image.data[src];
        out[dest + 3] = image.channels === 2 ? image.data[src + 1] : 255;
      } else {
        out[dest] = image.data[src];
        out[dest + 1] = image.data[src + 1];
        out[dest + 2] = image.data[src + 2];
        out[dest + 3] = 255;
      }
    }
  }
  return out;
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
      const [ar, ag, ab] = rgbAt(A, ia);
      const [br, bg, bb] = rgbAt(B, ib);
      const dr = Math.abs(ar - br);
      const dg = Math.abs(ag - bg);
      const db = Math.abs(ab - bb);
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

// --- 캡처 안정화 -------------------------------------------------------------
const FREEZE_CSS = [
  '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;}',
  'html{scroll-behavior:auto!important;}',
  '.hero-media-item{transition:none!important;}',
].join('');

async function installEarlyFreeze(page) {
  await page.addInitScript((css) => {
    const install = () => {
      if (document.getElementById('parity-freeze-style')) return;
      const parent = document.head || document.documentElement;
      if (!parent) return;
      const style = document.createElement('style');
      style.id = 'parity-freeze-style';
      style.textContent = css;
      parent.appendChild(style);
    };
    install();
    document.addEventListener('DOMContentLoaded', install, { once: true });
  }, FREEZE_CSS).catch(() => {});
}

async function applyFreeze(page) {
  await page.addStyleTag({ content: FREEZE_CSS }).catch(() => {});
  await page.evaluate(() => {
    document.querySelectorAll('video').forEach((video) => {
      try {
        video.pause();
        video.currentTime = 0;
      } catch { /* 무시 */ }
    });
    const heroSlides = Array.from(document.querySelectorAll('.hero-media-item[data-active]'));
    heroSlides.forEach((slide, index) => {
      slide.setAttribute('data-active', index === 0 ? 'true' : 'false');
    });
    document.querySelectorAll('.hero-highlights-track').forEach((track) => {
      track.style.transition = 'none';
      track.style.transform = 'translate3d(0, 0, 0)';
    });
    document.querySelectorAll('.hero-highlights-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === 0);
      dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    });
    document.querySelectorAll('.hero-typing').forEach((typing) => {
      typing.querySelectorAll('.hero-typing-cursor').forEach((cursor) => cursor.remove());
    });
  }).catch(() => {});
}

async function waitForFonts(page) {
  await page.evaluate(() => (
    document.fonts && document.fonts.ready ? document.fonts.ready.then(() => true) : true
  )).catch(() => {});
}

async function waitForViewportImages(page, timeout = 2000) {
  await page.waitForFunction(() => {
    const viewportW = window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;
    const images = Array.from(document.images).filter((img) => {
      const rect = img.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 &&
        rect.right >= 0 && rect.left <= viewportW &&
        rect.bottom >= 0 && rect.top <= viewportH;
    });
    return images.every((img) => {
      if (!img.currentSrc && !img.src) return true;
      return img.complete && img.naturalWidth > 0;
    });
  }, undefined, { timeout }).catch(() => {});
}

async function pageDims(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const w = Math.max(
      doc.scrollWidth,
      body ? body.scrollWidth : 0,
      doc.clientWidth,
      window.innerWidth,
    );
    const h = Math.max(
      doc.scrollHeight,
      body ? body.scrollHeight : 0,
      doc.offsetHeight,
      body ? body.offsetHeight : 0,
      doc.clientHeight,
      window.innerHeight,
    );
    return { w: Math.ceil(w), h: Math.ceil(h) };
  }).catch(() => ({ w: 0, h: 0 }));
}

async function settleViewport(page, y, freeze) {
  await page.evaluate((nextY) => window.scrollTo(0, nextY), y).catch(() => {});
  await page.waitForTimeout(120);
  await page.waitForLoadState('networkidle', { timeout: 700 }).catch(() => {});
  await waitForViewportImages(page, 2000);
  await page.waitForTimeout(220);
  if (freeze) await applyFreeze(page);
}

async function setViewportChromeHidden(page, hidden) {
  await page.evaluate((shouldHide) => {
    const attr = 'data-parity-hidden-chrome';
    const empty = '__parity_empty__';
    if (!shouldHide) {
      document.querySelectorAll(`[${attr}]`).forEach((element) => {
        const previous = element.getAttribute(attr);
        if (previous === empty) element.style.removeProperty('visibility');
        else element.style.visibility = previous || '';
        element.removeAttribute(attr);
      });
      return;
    }

    const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;
    Array.from(document.body ? document.body.querySelectorAll('*') : []).forEach((element) => {
      if (!(element instanceof HTMLElement)) return;
      if (element.closest(`[${attr}]`)) return;
      const style = window.getComputedStyle(element);
      if (style.position !== 'fixed' && style.position !== 'sticky') return;
      const rect = element.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const stuckToViewportEdge = rect.top <= 2 || rect.bottom >= viewportH - 2;
      if (style.position !== 'fixed' && !stuckToViewportEdge) return;
      element.setAttribute(attr, element.style.visibility || empty);
      element.style.visibility = 'hidden';
    });
  }, hidden).catch(() => {});
}

async function warmPageForLazyLoad(page, freeze) {
  let dims = await pageDims(page);
  const viewport = page.viewportSize() || { width: dims.w || 1280, height: 900 };
  const step = Math.max(1, viewport.height);
  const totalH = Math.max(1, dims.h);
  for (let y = 0; y < totalH; y += step) {
    const maxScrollY = Math.max(0, (await pageDims(page)).h - viewport.height);
    await settleViewport(page, Math.min(y, maxScrollY), freeze);
  }
  await settleViewport(page, 0, freeze);
}

async function captureFastFullPage(page, freeze) {
  await warmPageForLazyLoad(page, freeze);
  await dismissPopups(page);
  await settleViewport(page, 0, freeze);
  return page.screenshot({
    fullPage: true,
    type: 'png',
    animations: freeze ? 'disabled' : 'allow',
  });
}

async function captureStitched(page, freeze) {
  await warmPageForLazyLoad(page, freeze);
  await dismissPopups(page);
  const dims = await pageDims(page);
  const viewport = page.viewportSize() || { width: dims.w || 1280, height: 900 };
  const width = Math.max(1, viewport.width);
  const height = Math.max(1, dims.h || viewport.height);
  const viewportH = Math.max(1, viewport.height);
  const out = Buffer.alloc(width * height * 4, 255);

  for (let y = 0; y < height; y += viewportH) {
    const rows = Math.min(viewportH, height - y);
    const maxScrollY = Math.max(0, height - viewportH);
    const requestedScrollY = Math.min(y, maxScrollY);
    await settleViewport(page, requestedScrollY, freeze);
    await setViewportChromeHidden(page, y > 0);
    const actualScrollY = await page.evaluate(() => Math.round(window.scrollY || 0)).catch(() => requestedScrollY);
    const clipY = Math.max(0, Math.min(viewportH - rows, y - actualScrollY));
    const pieceBuf = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: clipY, width, height: rows },
      animations: freeze ? 'disabled' : 'allow',
    });
    const piece = decodePng(pieceBuf);
    const rgba = toRgba(piece);
    const copyWidth = Math.min(width, piece.width);
    const copyRows = Math.min(rows, piece.height);
    for (let row = 0; row < copyRows; row++) {
      rgba.copy(
        out,
        ((y + row) * width) * 4,
        (row * piece.width) * 4,
        (row * piece.width + copyWidth) * 4,
      );
    }
  }
  await setViewportChromeHidden(page, false);
  await settleViewport(page, 0, freeze);
  return encodePngRgba(width, height, out);
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
  if (FREEZE_CAPTURE) {
    await page.emulateMedia({ reducedMotion: 'reduce' }).catch(() => {});
    await installEarlyFreeze(page);
  }
  let navOk = true;
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  } catch {
    navOk = false;
    try { await page.goto(url, { waitUntil: 'load', timeout: 30000 }); } catch { /* 무시 */ }
  }
  if (FREEZE_CAPTURE) await applyFreeze(page);
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await dismissPopups(page);
  await waitForFonts(page);
  let buf = null;
  try {
    buf = FAST_CAPTURE
      ? await captureFastFullPage(page, FREEZE_CAPTURE)
      : await captureStitched(page, FREEZE_CAPTURE);
  } catch { /* 무시 */ }
  const dims = await pageDims(page);
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
        reducedMotion: FREEZE_CAPTURE ? 'reduce' : 'no-preference',
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

  // 높이 드리프트 실패(미시딩 샌드박스/height 회귀가 diff%만으로 false-clean되는 것을 잡음)
  const heightFailures = results
    .filter((r) => r.heightDiff != null && Math.abs(r.heightDiff) > MAX_HEIGHT_DIFF)
    .map((r) => ({ page: r.page, viewport: r.viewport, heightDiff: r.heightDiff }));

  const report = {
    generatedAt: new Date().toISOString(),
    live: LIVE,
    local: LOCAL,
    threshold: THRESH,
    viewports: VIEWPORTS.map((v) => v.label),
    pages: PAGES,
    elapsedSec,
    avgDiffPct: avgDiff,
    heightGate: {
      thresholdPx: MAX_HEIGHT_DIFF,
      count: heightFailures.length,
      failures: heightFailures,
    },
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
  // 높이 드리프트 섹션 (diff%가 못 보는 stageHeight 불일치)
  if (heightFailures.length) {
    console.log(`\n[HEIGHT DRIFT] |Δh| > ${MAX_HEIGHT_DIFF}px (${heightFailures.length}):`);
    for (const f of heightFailures) {
      console.log(`  ${f.page.padEnd(20)} ${f.viewport}  Δh=${f.heightDiff}px`);
    }
  } else {
    console.log(`\n[HEIGHT DRIFT] none (≤${MAX_HEIGHT_DIFF}px)`);
  }
  console.log(`\nJSON 저장: ${OUT_JSON}`);
  if (SAVE_SHOTS) console.log(`스크린샷: ${SHOTS_DIR}`);

  // --gate-height일 때만 height failure를 종료코드로 승격(기본 동작 불변)
  if (GATE_HEIGHT && heightFailures.length) {
    console.log(`HEIGHT GATE FAIL: ${heightFailures.length} page(s) exceed ${MAX_HEIGHT_DIFF}px`);
    process.exitCode = 2;
  }
}

main().catch((e) => { console.error('치명적 오류:', e); process.exit(1); });
