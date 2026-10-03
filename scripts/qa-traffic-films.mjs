import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { chromium } from '@playwright/test';

const base = process.env.TRAFFIC_FILM_QA_BASE || 'http://127.0.0.1:4598';
const out = process.env.TRAFFIC_FILM_QA_OUT || '/tmp/traffic-film-qa';
const films = JSON.parse(await fs.readFile(new URL('../src/data/traffic-column-films.json', import.meta.url), 'utf8'));
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
const failures = [];
const jobs = Object.entries(films).flatMap(([key, film]) => [1440, 390].map(width => ({ key, film, width })));
try {
  await Promise.all(jobs.map(async ({ key, film, width }) => {
    const [source, locale, slug] = key.split('/');
    const url = `${base}/${locale}/columns/${source === 'issue' ? 'issues/' : ''}${slug}`;
    const stem = `${film.id}-${width}`;
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 }, reducedMotion: 'no-preference', isMobile: width === 390, hasTouch: width === 390 });
    const page = await context.newPage();
    const pageErrors = [];
    let phase = 'load';
    page.on('pageerror', error => pageErrors.push(String(error)));
    try {
      const response = await page.goto(url, { waitUntil: 'load' });
      assert.equal(response.status(), 200);
      const figure = page.locator(`[data-column-generated-video="${film.id}"]`);
      assert.equal(await figure.count(), 1);
      assert.equal(await figure.locator('video').count(), 1);
      const video = figure.locator('video');
      phase = 'autoplay without gesture';
      await video.scrollIntoViewIfNeeded();
      // No click, focus or keyboard event occurs before this assertion.
      await page.waitForFunction(id => {
        const element = document.querySelector(`[data-column-generated-video="${id}"] video`);
        return element && element.currentTime > 1 && !element.paused;
      }, film.id, { timeout: 25000 });
      const initial = await video.evaluate(v => ({ currentTime: v.currentTime, duration: v.duration, muted: v.muted, autoplay: v.autoplay, controls: v.controls, playsInline: v.playsInline, playbackRate: v.playbackRate, readyState: v.readyState, error: v.error?.code }));
      assert.ok(initial.muted && initial.autoplay && initial.controls && initial.playsInline);
      assert.equal(initial.playbackRate, 1);
      assert.ok(Math.abs(initial.duration - film.durationSeconds) < 0.1);
      assert.ok(!initial.error);
      await figure.screenshot({ path: `${out}/${stem}-autoplay.png` });
      phase = 'native pause';
      await video.focus();
      await video.press('Space');
      await page.waitForFunction(id => document.querySelector(`[data-column-generated-video="${id}"] video`)?.paused, film.id);
      const pausedAt = await video.evaluate(v => v.currentTime);
      await page.mouse.wheel(0, -1000);
      await video.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      const paused = await video.evaluate(v => ({ paused: v.paused, time: v.currentTime }));
      assert.ok(paused.paused && Math.abs(paused.time - pausedAt) < 0.1, 'Scrolling overrode manual pause');
      phase = 'native seek';
      await video.press('ArrowRight');
      // Chromium advances by a fraction of duration, not a fixed five seconds.
      await page.waitForFunction(({ id, start }) => document.querySelector(`[data-column-generated-video="${id}"] video`)?.currentTime > start + 0.1, { id: film.id, start: pausedAt });
      assert.ok(await video.evaluate(v => v.paused), 'Seeking unexpectedly resumed playback');
      await video.press('End');
      await figure.locator(`[data-column-video-chapter="${film.sceneCount}"]`).waitFor();
      // Decoder/end-to-end check from zero at normal speed, after testing native seeking.
      phase = 'full playback';
      await video.press('Home');
      await figure.locator('[data-column-video-chapter="1"]').waitFor();
      await page.waitForFunction(id => !document.querySelector(`[data-column-generated-video="${id}"] video`)?.seeking, film.id);
      await video.press('Space');
      const started = Date.now();
      for (let chapter = 1; chapter <= film.sceneCount; chapter++) {
        await page.waitForFunction(({ id, time }) => document.querySelector(`[data-column-generated-video="${id}"] video`)?.currentTime >= time, { id: film.id, time: (chapter - 1) * 10 + 4 }, { timeout: 20000 });
        const caption = figure.locator(`[data-column-video-chapter="${chapter}"]`);
        assert.ok((await caption.textContent()).includes(film.chapters[chapter - 1].text));
        assert.ok(await caption.evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 16));
        await figure.screenshot({ path: `${out}/${stem}-chapter-${chapter}.png` });
      }
      await page.waitForFunction(id => document.querySelector(`[data-column-generated-video="${id}"] video`)?.ended, film.id, { timeout: 15000 });
      const elapsed = (Date.now() - started) / 1000;
      assert.ok(elapsed >= film.durationSeconds - 1, 'Full playback ran faster than real time');
      const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1, lang: document.documentElement.lang, text: document.querySelector('.blog-body')?.textContent?.length || 0 }));
      assert.ok(!layout.overflow && layout.text > 500);
      assert.equal(layout.lang.toLowerCase(), locale.toLowerCase());
      assert.deepEqual(pageErrors, []);
      results.push({ key, width, url, initial, automaticStartWithoutGesture: true, manualPausePreserved: true, nativeKeyboardSeek: true, playedWholeFilmAtNormalSpeed: true, elapsed, layout, pageErrors });
      console.log(JSON.stringify({ key, width, ok: true, elapsed }));
    } catch (error) {
      const media = await page.locator(`[data-column-generated-video="${film.id}"] video`).evaluate(v => ({ currentTime: v.currentTime, paused: v.paused, ended: v.ended, seeking: v.seeking, readyState: v.readyState, error: v.error?.code })).catch(() => null);
      failures.push({ key, width, phase, error: String(error), stack: error.stack, media, pageErrors });
      await page.screenshot({ path: `${out}/${stem}-failure.png` }).catch(() => {});
      console.log(JSON.stringify(failures.at(-1)));
    } finally { await context.close(); }
  }));
  const assets = [];
  for (const film of Object.values(films)) {
    const response = await fetch(`${base}${film.src}`);
    assert.equal(response.status, 200);
    const bytes = Buffer.from(await response.arrayBuffer());
    const actual = crypto.createHash('sha256').update(bytes).digest('hex');
    const local = await fs.readFile(new URL(`../public${film.src}`, import.meta.url));
    assert.equal(actual, crypto.createHash('sha256').update(local).digest('hex'));
    const range = await fetch(`${base}${film.src}`, { headers: { Range: 'bytes=0-1023' } });
    assert.equal(range.status, 206);
    assert.equal((await range.arrayBuffer()).byteLength, 1024);
    assets.push({ src: film.src, bytes: bytes.length, sha256: actual, rangeStatus: range.status });
  }
  // Reduced-motion readers retain native manual playback.
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`${base}/ko/columns/taiwan-traffic-accident-procedure`, { waitUntil: 'load' });
  const video = page.locator('[data-column-generated-video] video');
  await video.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  assert.ok(await video.evaluate(v => v.paused && v.currentTime === 0));
  await video.focus();
  await video.press('Space');
  await page.waitForFunction(() => document.querySelector('[data-column-generated-video] video')?.currentTime > 0.2);
  await context.close();
  await fs.writeFile(`${out}/report.json`, JSON.stringify({ ok: failures.length === 0, base, checkedAt: new Date().toISOString(), results, failures, assets, reducedMotionManualPlayback: true }, null, 2));
  assert.deepEqual(failures, []);
} finally { await browser.close(); }
