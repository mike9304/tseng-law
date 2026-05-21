import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const consoleEvents: Array<{ type: string; text: string; location?: string }> = [];
  page.on('console', msg => {
    const loc = msg.location?.();
    consoleEvents.push({
      type: msg.type(),
      text: msg.text(),
      location: loc ? `${loc.url}:${loc.lineNumber}` : undefined,
    });
  });
  const failedReqs: Array<{ url: string; failure?: string; resource: string }> = [];
  page.on('requestfailed', req => {
    failedReqs.push({ url: req.url(), failure: req.failure()?.errorText, resource: req.resourceType() });
  });
  const allReqs: Array<{ url: string; status?: number; resource: string }> = [];
  page.on('response', async res => {
    const u = res.url();
    if (u.includes('example.com') || res.status() >= 400) {
      allReqs.push({ url: u, status: res.status(), resource: res.request().resourceType() });
    }
  });

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);

  await page.screenshot({ path: join(OUT, '01-builder-loaded.png'), fullPage: false });

  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('[role="application"][aria-label="Canvas editor"]');
    const nodes = Array.from(document.querySelectorAll('[data-node-id]'));
    const imgs = Array.from(document.querySelectorAll('img'));
    const exampleImgs = imgs
      .filter(i => i.src.includes('example.com'))
      .map(i => ({ src: i.src, classes: i.className, parent: i.parentElement?.outerHTML?.slice(0, 300) ?? '' }));
    const allLogoSelectors = Array.from(document.querySelectorAll('[data-builder-site-brand="true"], .site-header-logo-light, .site-header-logo-dark, [data-site-logo]'))
      .map(el => ({ tag: el.tagName, attrs: Array.from(el.attributes).map(a => `${a.name}=${a.value}`).join(' '), html: el.outerHTML.slice(0, 400) }));
    return {
      canvasFound: Boolean(canvas),
      nodeCount: nodes.length,
      firstNodeIds: nodes.slice(0, 10).map(n => n.getAttribute('data-node-id')),
      exampleImgs,
      logoEls: allLogoSelectors,
      pageTitle: document.title,
    };
  });

  const railInfo = await page.evaluate(() => {
    const iconRails = Array.from(document.querySelectorAll('[class*="iconRail"]'));
    const allRailButtons: Array<{ aria: string | null; title: string | null; text: string; classes: string }> = [];
    iconRails.forEach(rail => {
      rail.querySelectorAll('button, [role="button"]').forEach(btn => {
        allRailButtons.push({
          aria: btn.getAttribute('aria-label'),
          title: btn.getAttribute('title'),
          text: (btn.textContent ?? '').trim().slice(0, 50),
          classes: btn.className.toString().slice(0, 120),
        });
      });
    });
    const sidebars = Array.from(document.querySelectorAll('aside, [class*="sidebar"], [class*="leftRail"], [class*="iconRail"]'));
    return {
      iconRailCount: iconRails.length,
      railButtons: allRailButtons,
      sidebarSummary: sidebars.slice(0, 8).map(s => ({ tag: s.tagName, classes: s.className.toString().slice(0, 120), rect: s.getBoundingClientRect() })),
    };
  });

  const dblClickInfo = await page.evaluate(async () => {
    const candidates = Array.from(document.querySelectorAll('[data-node-id]:not([data-node-id=""])'))
      .filter(n => {
        const r = n.getBoundingClientRect();
        return r.width > 20 && r.height > 10 && r.top > 100 && r.top < 800;
      })
      .filter(n => {
        const id = n.getAttribute('data-node-id') ?? '';
        return /text|title|subtitle|heading|copy|paragraph/i.test(id);
      });
    return candidates.slice(0, 8).map(n => ({
      id: n.getAttribute('data-node-id'),
      tag: n.tagName,
      classes: n.className.toString().slice(0, 200),
      rect: n.getBoundingClientRect(),
      hasContentEditable: n.querySelector('[contenteditable]') !== null,
      childTags: Array.from(n.children).slice(0, 4).map(c => c.tagName),
    }));
  });

  let dblResult: any = null;
  if (dblClickInfo.length > 0) {
    const target = dblClickInfo[0];
    const box = { x: target.rect.x + target.rect.width / 2, y: target.rect.y + target.rect.height / 2 };
    await page.mouse.dblclick(box.x, box.y);
    await page.waitForTimeout(800);
    await page.screenshot({ path: join(OUT, '02-after-dblclick.png'), fullPage: false });
    dblResult = await page.evaluate(() => ({
      contentEditableCount: document.querySelectorAll('[contenteditable="true"]').length,
      inlineActiveAttr: document.querySelectorAll('[data-builder-inline-text-active]').length,
      tiptapEditors: document.querySelectorAll('.ProseMirror').length,
      focusedTag: document.activeElement?.tagName,
      focusedContentEditable: (document.activeElement as HTMLElement | null)?.isContentEditable ?? false,
      anyEditableQuery: ['[contenteditable="true"]', '[contenteditable=""]', '[data-builder-inline-text-active]', '.ProseMirror', '[data-tiptap-editor]'].map(q => ({
        q, count: document.querySelectorAll(q).length,
      })),
    }));
  }

  await page.screenshot({ path: join(OUT, '03-final.png'), fullPage: false });

  const result = { BASE, canvasInfo, railInfo, dblClickInfo, dblResult, consoleEvents: consoleEvents.slice(-80), failedReqs: failedReqs.slice(-40), allReqs: allReqs.slice(-40) };
  writeFileSync(join(OUT, 'diag.json'), JSON.stringify(result, null, 2));
  console.log('DIAG_OUT=', OUT);
  console.log('CANVAS_FOUND=', canvasInfo.canvasFound, 'NODES=', canvasInfo.nodeCount);
  console.log('EXAMPLE_IMGS=', JSON.stringify(canvasInfo.exampleImgs, null, 2));
  console.log('RAIL_BTNS=', railInfo.iconRailCount, 'BUTTONS=', railInfo.railButtons.length);
  console.log('RAIL_BUTTONS_SAMPLE=', JSON.stringify(railInfo.railButtons.slice(0, 12), null, 2));
  console.log('DBL_RESULT=', JSON.stringify(dblResult, null, 2));
  console.log('CSP_VIOLATIONS=', consoleEvents.filter(e => e.text.includes('Content Security Policy')).length);
  console.log('FAILED_REQS=', failedReqs.length);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
