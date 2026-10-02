import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.COLUMN_VIDEO_QA_BASE || 'http://127.0.0.1:4548';
const out = process.env.COLUMN_VIDEO_QA_OUT || '/tmp/column-generated-video-qa';
const article = '/ko/columns/taiwan-traffic-accident-procedure';
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
    const response = await page.goto(`${base}${article}`, { waitUntil: 'load' });
    assert.equal(response?.status(), 200);
    const figure = page.locator('[data-column-generated-video="rear-end-simulation-v2-ko"]');
    const video = figure.locator('video');
    await figure.scrollIntoViewIfNeeded();
    // Let the browser's native controls finish their initial loading animation.
    await page.waitForTimeout(5000);
    assert.equal(await figure.count(), 1);
    const initial = await video.evaluate(element => ({
      paused: element.paused, currentTime: element.currentTime, controls: element.controls,
      autoplay: element.autoplay, loop: element.loop, preload: element.preload,
      playsInline: element.playsInline, poster: element.poster, src: element.src,
    }));
    assert.equal(initial.paused, true);
    assert.equal(initial.currentTime, 0);
    assert.equal(initial.controls, true);
    assert.equal(initial.autoplay, false);
    assert.equal(initial.loop, false);
    assert.equal(initial.preload, 'none');
    assert.equal(initial.playsInline, true);
    assert.equal(new URL(initial.src).origin, new URL(base).origin);
    assert.match(await figure.innerText(), /AI로 만든 가상 장면/);
    const poster = await page.request.get(initial.poster);
    assert.equal(poster.status(), 200);
    assert.match(poster.headers()['content-type'], /image\/jpeg/);
    await page.screenshot({ path: `${out}/poster-${viewport.width}.png` });

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
    assert.ok(playing.duration > 7 && playing.duration < 7.2);
    await video.press('Space');
    assert.equal(await video.evaluate(element => element.paused), true);
    await video.evaluate(element => { element.currentTime = 4.6; });
    await page.waitForFunction(() => {
      const element = document.querySelector('[data-column-generated-video] video');
      return element && !element.seeking && element.readyState >= 2 && element.currentTime >= 4.5;
    });
    await page.screenshot({ path: `${out}/contact-${viewport.width}.png` });
    const layout = await page.evaluate(() => ({
      width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      frameWidth: document.querySelector('[data-column-generated-video]').getBoundingClientRect().width,
      bodyTextLength: document.querySelector('.blog-body')?.innerText.length || 0,
      diagramCount: document.querySelectorAll('[data-traffic-diagram]').length,
    }));
    assert.ok(layout.scrollWidth <= layout.width + 1, `Horizontal overflow: ${JSON.stringify(layout)}`);
    assert.ok(layout.frameWidth <= layout.width);
    assert.ok(layout.bodyTextLength > 500);
    assert.ok(layout.diagramCount >= 1);
    await video.evaluate(element => { element.currentTime = element.duration - 0.4; });
    await video.press('Space');
    await page.waitForFunction(() => document.querySelector('[data-column-generated-video] video')?.ended);

    if (process.env.COLUMN_VIDEO_QA_SKIP_BOARD !== '1') {
      await page.goto(`${base}/ko/traffic-accidents?video=1`, { waitUntil: 'load' });
      assert.ok(await page.locator(`a[href="${article}"]`).count() > 0, 'Video filter omitted the new native video');
    }
    await page.goto(`${base}/en/columns/taiwan-traffic-accident-procedure`, { waitUntil: 'load' });
    assert.equal(await page.locator('[data-column-generated-video]').count(), 0, 'Unreviewed locale inherited video');
    results.push({ viewport, initial, playing, layout, nativeKeyboardControls: true, reachedEnd: true, localeScoped: true });
    await context.close();
  }
  const mp4 = await fetch(`${base}/videos/columns/rear-end-simulation-v2-ko.mp4`, { headers: { Range: 'bytes=0-1023' } });
  assert.equal(mp4.status, 206);
  assert.match(mp4.headers.get('content-type') || '', /video\/mp4/);
  assert.equal((await mp4.arrayBuffer()).byteLength, 1024);
  assert.equal(findings.length, 0, findings.join('\n'));
  await fs.writeFile(`${out}/report.json`, JSON.stringify({ ok: true, base, checkedAt: new Date().toISOString(), findings, results, rangeStatus: 206 }, null, 2));
  console.log(JSON.stringify({ ok: true, base, out, viewports: results.length }));
} catch (error) {
  await fs.writeFile(`${out}/report.json`, JSON.stringify({ ok: false, base, error: String(error), findings, results }, null, 2));
  throw error;
} finally {
  await browser.close();
}
