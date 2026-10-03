import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.COLUMN_VIDEO_QA_BASE || 'http://127.0.0.1:4548';
const out = process.env.COLUMN_VIDEO_QA_OUT || '/tmp/column-generated-video-qa';
const allCases = [
  ...['ko', 'en', 'zh-hant', 'ja'].map(locale => ({
    locale, slug: 'taiwan-traffic-accident-procedure', id: `rear-end-simulation-v3-${locale}`,
    duration: 4, contactTime: 1.1,
    disclosure: { ko: 'AI로 만든 가상 장면', en: 'fictional AI-generated scene', 'zh-hant': 'AI生成的假想場景', ja: 'AIで作成した架空の場面' }[locale],
  })),
  { locale: 'zh-hant', slug: 'taiwan-lane-change-side-rear-collision-liability', id: 'lane-change-v3-zh-hant', duration: 4, contactTime: 0.85, disclosure: '非真實事故或本文判決的重建' },
  { locale: 'zh-hant', slug: 'taiwan-chain-rear-end-first-impact-evidence', id: 'chain-rear-end-v2-zh-hant', duration: 4, contactTime: 1.2, disclosure: '這只是「後車先碰中間車」的一種設定' },
  { locale: 'zh-hant', slug: 'taiwan-roadside-starting-parking-exit-liability', id: 'roadside-start-v3-zh-hant', duration: 4, contactTime: 0.6, disclosure: '非本文判決或真實事故的重建' },
  { locale: 'zh-hant', slug: 'taiwan-right-turn-car-straight-motorcycle-evidence', id: 'right-turn-scooter-v2-zh-hant', duration: 4, contactTime: 1.5, disclosure: '非真實事故或本文案件的重建' },
  { locale: 'zh-hant', slug: 'taiwan-car-repair-cost-estimate-parts-depreciation', id: 'repair-workshop-v1-zh-hant', evidenceStem: 'repair-cost-zh-hant', duration: 6, contactTime: 3, expectedDiagrams: 0, disclosure: '非本文判決車輛或真實受損紀錄' },
  { locale: 'zh-hant', slug: 'taiwan-car-repair-rental-cost-repair-period-evidence', id: 'repair-workshop-v1-zh-hant', evidenceStem: 'repair-period-zh-hant', duration: 6, contactTime: 3, expectedDiagrams: 0, disclosure: '非本文案件的車輛或維修紀錄' },
  { locale: 'zh-hant', slug: 'taiwan-truck-blocking-multiple-dashcam-evidence', id: 'truck-blocking-v2-zh-hant', duration: 4, contactTime: 0.6, expectedDiagrams: 0, disclosure: '非本文判決或四組原始影像的重建' },
  { locale: 'zh-hant', slug: 'taiwan-car-door-opening-motorcycle-liability', id: 'car-door-v2-zh-hant', duration: 4, contactTime: 1.6, disclosure: '非本文兩件判決的重建' },
  ...['ko', 'en', 'zh-hant', 'ja'].map(locale => ({
    locale, slug: 'taiwan-company-setup-pitch-location', id: `business-premises-v1-${locale}`,
    duration: 6, contactTime: 4.2, traffic: false,
    disclosure: { ko: '실제 임대 매물이 아닙니다', en: 'not an actual rental listing', 'zh-hant': '非實際出租物件', ja: '実際の賃貸物件ではありません' }[locale],
  })),
];
const selectedIds = new Set((process.env.COLUMN_VIDEO_QA_IDS || '').split(',').filter(Boolean));
for (const id of selectedIds) assert.ok(allCases.some(item => item.id === id), `Unknown video QA id: ${id}`);
const cases = selectedIds.size ? allCases.filter(item => selectedIds.has(item.id)) : allCases;
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
const findings = [];

try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => findings.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && /hydration|Minified React|unique.*key/i.test(message.text())) findings.push(message.text());
    });
    for (const item of cases) {
      const evidenceStem = item.evidenceStem || item.id;
      const article = `/${item.locale}/columns/${item.slug}`;
      const response = await page.goto(`${base}${article}`, { waitUntil: 'load' });
      assert.equal(response?.status(), 200);
      const heading = await page.locator('h1').innerText();
      const figure = page.locator(`[data-column-generated-video="${item.id}"]`);
      const video = figure.locator('video');
      await figure.scrollIntoViewIfNeeded();
      // Let the browser's native controls finish their initial loading animation.
      await page.waitForTimeout(5000);
      assert.equal(await figure.count(), 1);
      const initial = await video.evaluate(element => ({
        paused: element.paused, currentTime: element.currentTime, controls: element.controls,
        autoplay: element.autoplay, loop: element.loop, preload: element.preload,
        playsInline: element.playsInline, poster: element.poster, src: element.src,
        playbackRate: element.playbackRate,
      }));
      assert.equal(initial.paused, true);
      assert.equal(initial.currentTime, 0);
      assert.equal(initial.controls, true);
      assert.equal(initial.autoplay, false);
      assert.equal(initial.loop, false);
      assert.equal(initial.preload, 'none');
      assert.equal(initial.playsInline, true);
      assert.equal(initial.playbackRate, 1);
      assert.equal(new URL(initial.src).origin, new URL(base).origin);
      assert.equal(new URL(initial.src).pathname, `/videos/columns/${item.id}.mp4`);
      assert.ok((await figure.innerText()).includes(item.disclosure));
      const poster = await page.request.get(initial.poster);
      assert.equal(poster.status(), 200);
      assert.match(poster.headers()['content-type'], /image\/jpeg/);
      await page.screenshot({ path: `${out}/${evidenceStem}-poster-${viewport.width}.png` });

      // Exercise the browser's native keyboard control, including reduced-motion mode.
      await video.focus();
      await video.press('Space');
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-column-generated-video] video');
        return element && !element.paused && element.currentTime > 0.7;
      }, undefined, { timeout: 20000 });
      const playing = await video.evaluate(element => ({
        currentTime: element.currentTime, duration: element.duration, paused: element.paused,
        width: element.videoWidth, height: element.videoHeight, error: element.error?.message || null,
      }));
      assert.equal(playing.error, null);
      assert.equal(playing.width, 1280);
      assert.equal(playing.height, 720);
      assert.ok(playing.duration >= item.duration && playing.duration < item.duration + 0.2);
      await video.press('Space');
      assert.equal(await video.evaluate(element => element.paused), true);
      await video.evaluate((element, seconds) => { element.currentTime = seconds; }, item.contactTime);
      await page.waitForFunction(seconds => {
        const element = document.querySelector('[data-column-generated-video] video');
        return element && !element.seeking && element.readyState >= 2 && element.currentTime >= seconds - 0.1;
      }, item.contactTime);
      await page.screenshot({ path: `${out}/${evidenceStem}-contact-${viewport.width}.png` });
      const layout = await page.evaluate(() => ({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        frameWidth: document.querySelector('[data-column-generated-video]').getBoundingClientRect().width,
        bodyTextLength: document.querySelector('.blog-body')?.innerText.length || 0,
        diagramCount: document.querySelectorAll('[data-traffic-diagram]').length,
        bodyImageCount: document.querySelectorAll('.blog-body img').length,
      }));
      assert.ok(layout.scrollWidth <= layout.width + 1, `Horizontal overflow: ${JSON.stringify(layout)}`);
      assert.ok(layout.frameWidth <= layout.width);
      assert.ok(layout.bodyTextLength > 500);
      if (item.traffic === false) {
        assert.equal(layout.diagramCount, 0);
        assert.ok(layout.bodyImageCount >= 3, 'Existing premises article images were removed');
      } else if (item.expectedDiagrams !== undefined) {
        assert.equal(layout.diagramCount, item.expectedDiagrams);
      } else {
        assert.ok(layout.diagramCount >= 1);
      }
      // Replay the entire clip at its native rate so motion revisions are exercised in real time.
      await video.evaluate(element => { element.currentTime = 0; });
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-column-generated-video] video');
        return element && !element.seeking && element.currentTime < 0.1;
      });
      const replayStartedAt = performance.now();
      await video.press('Space');
      await page.waitForFunction(() => document.querySelector('[data-column-generated-video] video')?.ended, undefined, { timeout: 20000 });
      const replaySeconds = (performance.now() - replayStartedAt) / 1000;
      assert.ok(replaySeconds >= item.duration - 0.2, 'The clip did not play through at its native rate');
      assert.equal(await video.evaluate(element => element.playbackRate), 1);

      if (process.env.COLUMN_VIDEO_QA_SKIP_BOARD !== '1') {
        const board = await page.goto(`${base}/${item.locale}/traffic-accidents?video=1&q=${encodeURIComponent(heading.slice(0, 60))}`, { waitUntil: 'load' });
        assert.equal(board?.status(), 200);
        const count = await page.locator(`a[href="${article}"]`).count();
        if (item.traffic === false) assert.equal(count, 0, 'Non-traffic video entered the traffic collection');
        else assert.ok(count > 0, 'Video filter omitted the new native video');
      }
      results.push({ viewport, article, id: item.id, initial, playing, layout, nativeKeyboardControls: true, reachedEnd: true, fullReplayAtNativeRate: true, replaySeconds });
    }
    const unreviewed = await page.goto(`${base}/fr/columns/taiwan-traffic-accident-procedure`, { waitUntil: 'load' });
    assert.equal(unreviewed?.status(), 200);
    assert.equal(await page.locator('[data-column-generated-video]').count(), 0, 'Unreviewed locale inherited video');
    await context.close();
  }
  const ranges = [];
  for (const item of new Map(cases.map(item => [item.id, item])).values()) {
    const mp4 = await fetch(`${base}/videos/columns/${item.id}.mp4`, { headers: { Range: 'bytes=0-1023' } });
    assert.equal(mp4.status, 206);
    assert.match(mp4.headers.get('content-type') || '', /video\/mp4/);
    assert.equal((await mp4.arrayBuffer()).byteLength, 1024);
    ranges.push({ id: item.id, status: mp4.status });
  }
  assert.equal(findings.length, 0, findings.join('\n'));
  await fs.writeFile(`${out}/report.json`, JSON.stringify({ ok: true, base, checkedAt: new Date().toISOString(), findings, results, ranges, unreviewedLocaleExcluded: true }, null, 2));
  console.log(JSON.stringify({ ok: true, base, out, journeys: results.length, assets: ranges.length }));
} catch (error) {
  await fs.writeFile(`${out}/report.json`, JSON.stringify({ ok: false, base, error: String(error), findings, results }, null, 2));
  throw error;
} finally {
  await browser.close();
}
