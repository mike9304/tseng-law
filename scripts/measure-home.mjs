#!/usr/bin/env node
// Single-shot home geometry measurement.
// Usage: node scripts/measure-home.mjs <url> [label]
import { chromium } from 'playwright';

const url = process.argv[2] || 'http://127.0.0.1:4643/ko';
const label = process.argv[3] || url;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1200);

const data = await page.evaluate(() => {
  const top = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return Math.round(r.top + window.scrollY);
  };
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      y: Math.round(r.top + window.scrollY),
      x: Math.round(r.left + window.scrollX),
      w: Math.round(r.width),
      h: Math.round(r.height),
      mt: el.style.marginTop || '',
    };
  };
  const pick = (sel) => document.querySelector(sel);
  const heroRoot = pick("[data-node-id='home-hero-root']") || pick("[data-node-id='home-hero']");
  const hero = pick("[data-node-id='home-hero']");
  const main = pick('.builder-pub-main');
  const body = document.body;
  const docH = Math.round(document.documentElement.scrollHeight);
  const heroRootR = rect(heroRoot);
  const heroR = rect(hero);
  const mainR = rect(main);
  // computed styles
  const cs = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      marginTop: s.marginTop,
      paddingTop: s.paddingTop,
      position: s.position,
      top: s.top,
      height: s.height,
    };
  };
  // insights first heading
  const insights = pick("[data-node-id='home-insights-root']") ||
    [...document.querySelectorAll('.builder-pub-node')].find((n) =>
      (n.getAttribute('data-node-id') || '').includes('insight'));
  let insightsHeadingTop = null;
  let insightsTop = null;
  if (insights) {
    insightsTop = top(insights);
    const h = insights.querySelector('h1,h2,h3,h4,[data-node-id*="heading"],[data-node-id*="title"]');
    insightsHeadingTop = h ? top(h) : null;
  }
  // header offset var
  const off = getComputedStyle(document.documentElement).getPropertyValue('--header-offset-desktop').trim();
  const skyline = getComputedStyle(document.documentElement).getPropertyValue('--header-skyline-height').trim();
  return {
    docH,
    heroRootR,
    heroR,
    mainR,
    heroRootCS: cs(heroRoot),
    heroCS: cs(hero),
    mainCS: cs(main),
    headerOffsetDesktop: off,
    headerSkylineHeight: skyline,
    insightsTop,
    insightsHeadingTop,
    bodyTop: top(body),
    scrollY: Math.round(window.scrollY),
  };
});

console.log(JSON.stringify({ label, ...data, consoleErrors: errs.length, errors: errs.slice(0, 5) }, null, 2));
await browser.close();
