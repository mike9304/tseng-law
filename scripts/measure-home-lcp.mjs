// measure-home-lcp.mjs — 홈 LCP 병목 분해(측정 전용, 비파괴). T20/A2 히어로 최적화 근거.
import { chromium } from 'playwright';

const BASE = 'https://tseng-law.com';
const PAGES = ['/ko', '/zh-hant'];

const browser = await chromium.launch();
for (const path of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const resources = [];
  page.on('response', async (r) => {
    try {
      const ct = (r.headers()['content-type'] || '').split(';')[0];
      if (!/image|font|video/.test(ct)) return;
      let size = Number(r.headers()['content-length'] || 0);
      if (!size) { try { size = (await r.body()).length; } catch {} }
      resources.push({ url: r.url().replace(BASE, '').slice(0, 90), ct, size });
    } catch {}
  });
  await page.addInitScript(() => {
    window.__lcp = null;
    new PerformanceObserver((l) => {
      const e = l.getEntries().at(-1);
      window.__lcp = { time: Math.round(e.startTime), url: e.url || '', tag: e.element?.tagName || '', id: e.element?.id || '', cls: (e.element?.className || '').toString().slice(0, 60), size: e.size };
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.goto(BASE + path, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3500);
  const lcp = await page.evaluate(() => window.__lcp);
  // preload 힌트 + 히어로 중복(CSS bg + <img>) 탐지
  const hints = await page.evaluate(() => {
    const preloads = [...document.querySelectorAll('link[rel="preload"][as="image"]')].map((l) => l.getAttribute('href'));
    const bgEls = [...document.querySelectorAll('*')].filter((el) => {
      const b = getComputedStyle(el).backgroundImage;
      return b && b !== 'none' && b.includes('url(') && el.getBoundingClientRect().top < 900 && el.getBoundingClientRect().width > 400;
    }).map((el) => ({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 50), bg: getComputedStyle(el).backgroundImage.slice(0, 80) }));
    return { preloads, bgEls: bgEls.slice(0, 4) };
  });
  await ctx.close();

  const imgs = resources.filter((r) => /image/.test(r.ct)).sort((a, b) => b.size - a.size);
  const totalImg = imgs.reduce((s, r) => s + r.size, 0);
  console.log(`\n===== ${path} =====`);
  console.log(`LCP: ${lcp?.time}ms | element <${lcp?.tag}> id=${lcp?.id} cls="${lcp?.cls}"`);
  console.log(`LCP url: ${lcp?.url ? lcp.url.replace(BASE, '') : '(text/none)'}`);
  console.log(`preload as=image: ${hints.preloads.length ? hints.preloads.join(', ') : 'NONE (히어로 이미지 미리로드 안 함)'}`);
  console.log(`above-fold CSS background els (히어로 중복 후보): ${hints.bgEls.length}`);
  hints.bgEls.forEach((b) => console.log(`   <${b.tag} class="${b.cls}"> bg=${b.bg}`));
  console.log(`top image resources (size desc):`);
  imgs.slice(0, 6).forEach((r) => console.log(`   ${(r.size / 1024).toFixed(0).padStart(5)}KB  ${r.ct.padEnd(11)} ${r.url}`));
  console.log(`total image bytes: ${(totalImg / 1024).toFixed(0)}KB across ${imgs.length} imgs`);
}
await browser.close();
