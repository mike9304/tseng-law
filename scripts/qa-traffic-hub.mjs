import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const base = process.env.TRAFFIC_QA_BASE || 'http://127.0.0.1:43172';
const out = process.env.TRAFFIC_QA_OUT || '/tmp/traffic-browser-qa';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
// Local-only escape hatch: some dev machines stall on first AVIF encodes in the
// Next image optimizer; TRAFFIC_QA_NO_AVIF=1 asks for WebP instead.
const newContext = async (options) => {
  const context = await browser.newContext(options);
  if (process.env.TRAFFIC_QA_NO_AVIF === '1') {
    await context.route('**/_next/image**', route => route.continue({ headers: { ...route.request().headers(), accept: 'image/webp,image/*;q=0.8' } }));
  }
  return context;
};
const findings = [];
const results = [];
const contentChecks = {
  ko: { qa: ['다음 날부터 30일 안에', '직접 위임하고 비용을 부담', '0을 누르면 경찰 110', '다시 고소할 수 없습니다'], case: '원래 칼럼의 사례 설명에 따르면' },
  'zh-hant': { qa: ['翌日起30日內', '費用由委任者負擔', '按0轉接警察110', '不得再行告訴'], case: '依原文的案例敘述' },
  en: { qa: ['30 days starting the day after receipt', "at that party's expense", 'press 0 for police', 'cannot complain again'], case: 'According to the original case account' },
  ja: { qa: ['翌日から30日以内', '直接委任し、その費用を負担', '0を押すと警察の110', '再び告訴できません', '第三者賠償責任保険（対人・対物）'], case: '元の事例紹介によると' },
};
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const context = await newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => findings.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && /hydration|unique.*key|React|Minified/i.test(message.text())) findings.push(message.text());
    });
    for (const locale of ['ko', 'zh-hant', 'en', 'ja']) {
      const response = await page.goto(`${base}/${locale}/traffic-accidents`, { waitUntil: 'networkidle' });
      if (response?.status() !== 200) throw new Error(`${locale} HTTP ${response?.status()}`);
      if (await page.locator('h1').count() !== 1 || await page.locator('main').count() !== 1) throw new Error(`${locale} headings/landmarks`);
      const metrics = await page.evaluate(() => ({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        withdrawn: /overtaking-012|overtaking-diagram|data-traffic-diagram/.test(document.documentElement.outerHTML),
        media: document.querySelectorAll('video,canvas,model-viewer').length,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        alternates: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(link => link.getAttribute('hreflang')),
        headingColor: getComputedStyle(document.querySelector('h1')).color,
      }));
      if (metrics.scrollWidth > metrics.width + 1) throw new Error(`${locale} horizontal overflow`);
      // The overtaking-012 reconstruction was withdrawn (no consent): nothing of it may render.
      if (metrics.withdrawn || metrics.media) throw new Error(`${locale} withdrawn case visual still present`);
      if (!metrics.canonical?.endsWith(`/${locale}/traffic-accidents`)) throw new Error(`${locale} canonical`);
      if (metrics.headingColor !== 'rgb(255, 255, 255)') throw new Error(`${locale} hero heading contrast`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator('h1').waitFor({ state: 'visible' });
      await page.screenshot({ path: `${out}/${locale}-${viewport.width}-top.png` });
      await page.screenshot({ path: `${out}/${locale}-${viewport.width}.png`, fullPage: true });
      if (viewport.width === 390) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.locator('button.mobile-toggle').click();
        await page.locator(`.drawer-nav a[href="/${locale}/traffic-accidents"]`).click();
        await page.waitForURL(`**/${locale}/traffic-accidents`);
      }
      await page.locator('#articles a[href$="/taiwan-accident-police-records"]').click();
      await page.waitForURL('**/columns/taiwan-accident-police-records');
      await page.locator('[data-column-byline="ai"]').waitFor();
      if (await page.locator('[data-column-updated]').count()) throw new Error(`${locale}: new article must not show a same-day update`);
      const [deadlinePage] = await Promise.all([
        page.waitForEvent('popup'),
        page.locator(`.blog-body a[href="/${locale}/columns/taiwan-traffic-accident-procedure#sec-3"]`).click(),
      ]);
      deadlinePage.on('pageerror', error => findings.push(error.message));
      await deadlinePage.waitForURL('**/columns/taiwan-traffic-accident-procedure#sec-3');
      if (!(await deadlinePage.locator('#sec-3').innerText()).startsWith('Q3.')) throw new Error(`${locale} deadline anchor`);
      await deadlinePage.close();
      await page.locator(`a.blog-back-link[href="/${locale}/traffic-accidents"]`).click();
      await page.waitForURL(`**/${locale}/traffic-accidents`);
      for (const [slug, expected] of [
        ['taiwan-traffic-accident-procedure', contentChecks[locale].qa],
        ['taiwan-overtaking-accident-liability', [contentChecks[locale].case]],
      ]) {
        await page.locator(`#articles a[href$="/${slug}"]`).click();
        await page.waitForURL(`**/columns/${slug}`);
        const articleText = await page.locator('main').innerText();
        if (slug === 'taiwan-overtaking-accident-liability') {
          if (await page.locator('figure[data-traffic-diagram], video').count()) throw new Error(`${locale}/${slug}: withdrawn diagram present`);
        }
        for (const fragment of expected) {
          if (!articleText.includes(fragment)) throw new Error(`${locale}/${slug}: missing ${fragment}`);
        }
        if (await page.locator('[data-column-updated]').getAttribute('datetime') !== '2026-09-30') throw new Error(`${locale}/${slug}: updated date`);
        await page.locator(`a.blog-back-link[href="/${locale}/traffic-accidents"]`).click();
        await page.waitForURL(`**/${locale}/traffic-accidents`);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      if (viewport.width === 390) await page.locator('button.mobile-toggle').click();
      await page.locator('button[aria-haspopup="dialog"]:visible').first().click();
      const nextLocale = locale === 'ja' ? 'ko' : 'ja';
      await page.locator(`[role="dialog"] a[href="/${nextLocale}/traffic-accidents"]`).click();
      await page.waitForURL(`**/${nextLocale}/traffic-accidents`);
      results.push({ locale, viewport: viewport.width, ...metrics, articleRoundTrip: true, correctedArticles: true, languageSwitch: nextLocale });
    }
    await context.close();
  }
  // Withdrawal check with motion allowed: no figure/video/poster of the removed
  // overtaking-012 scene on the hubs, column 012 or column 050, and every former
  // asset URL answers 404 (cache-busted).
  const withdrawal = [];
  const context = await newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  page.on('pageerror', error => findings.push(error.message));
  for (const locale of ['ko', 'zh-hant', 'en', 'ja']) {
    for (const path of [`/${locale}/traffic-accidents`, `/${locale}/columns/taiwan-overtaking-accident-liability`, `/${locale}/columns/taiwan-accident-police-records`]) {
      const response = await page.goto(`${base}${path}`, { waitUntil: 'load' });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(600);
      const state = await page.evaluate(() => ({
        figures: document.querySelectorAll('figure[data-traffic-diagram]').length,
        videos: document.querySelectorAll('video').length,
        html: /overtaking-012|overtaking-diagram|\/videos\/traffic\/|\/images\/traffic\//.test(document.documentElement.outerHTML),
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
      }));
      if (response?.status() !== 200 || state.figures || state.videos || state.html || /overtaking-012|overtaking-diagram|\/images\/traffic\//.test(state.ogImage)) throw new Error(`${path}: withdrawn visual ${JSON.stringify(state)}`);
      withdrawal.push({ path, status: response.status(), ...state });
    }
  }
  await context.close();
  const assets = [];
  for (const asset of ['/videos/traffic/overtaking-012.mp4', '/videos/traffic/overtaking-012.webm', '/videos/traffic/overtaking-012-mobile.mp4', '/videos/traffic/overtaking-012-mobile.webm', '/images/traffic/overtaking-012-poster.webp', '/images/traffic/overtaking-012-poster-mobile.webp', '/images/traffic/overtaking-diagram.webp', '/images/blog/012-taiwan-overtaking-accident-liability/img-01.jpg', '/images/012-taiwan-overtaking-accident-liability/img-01.jpg']) {
    const response = await fetch(`${base}${asset}?cb=${Date.now()}`, { redirect: 'manual' });
    if (response.status !== 404) throw new Error(`${asset}: HTTP ${response.status}, expected 404`);
    assets.push({ asset, status: response.status });
  }
  results.push({ withdrawal, assets });
  if (findings.length) throw new Error(findings.join('\n'));
  await fs.writeFile(`${out}/report.json`, JSON.stringify({ ok: true, findings, results }, null, 2));
  console.log(JSON.stringify({ ok: true, journeys: results.length, out }));
} catch (error) {
  await fs.writeFile(`${out}/report.json`, JSON.stringify({ ok: false, error: String(error), findings, results }, null, 2));
  throw error;
} finally {
  await browser.close();
}
