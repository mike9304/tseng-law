import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const USER = process.env.BUILDER_SMOKE_USERNAME ?? 'admin';
const PASS = process.env.BUILDER_SMOKE_PASSWORD ?? 'local-review-2026!';
const OUT = process.env.DIAG_OUT ?? join(process.cwd(), 'qa-reports', `diag-dbl-${new Date().toISOString().replace(/[:.]/g, '-')}`);

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    httpCredentials: { username: USER, password: PASS },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[${msg.type()}]`, msg.text().slice(0, 200));
    }
  });

  await page.goto(`${BASE}/ko/admin-builder`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);

  const nodeData = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('[data-node-id]')) as HTMLElement[];
    return all
      .map(n => {
        const r = n.getBoundingClientRect();
        return {
          id: n.getAttribute('data-node-id'),
          kind: n.getAttribute('data-node-kind') ?? n.getAttribute('data-kind') ?? null,
          locked: n.getAttribute('data-locked'),
          parentNodeId: n.parentElement?.closest('[data-node-id]')?.getAttribute('data-node-id') ?? null,
          x: r.x, y: r.y, w: r.width, h: r.height,
          visible: r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < window.innerHeight,
          inViewport: r.top > 50 && r.top < 800 && r.left > 0,
          classes: n.className.toString().slice(0, 100),
        };
      })
      .filter(n => n.visible && n.inViewport);
  });

  const textNodes = nodeData.filter(n => {
    const id = (n.id ?? '').toLowerCase();
    return /text|title|subtitle|heading|copy|paragraph|hero/i.test(id);
  });

  writeFileSync(join(OUT, 'all-visible-nodes.json'), JSON.stringify(nodeData.slice(0, 60), null, 2));
  writeFileSync(join(OUT, 'text-like-nodes.json'), JSON.stringify(textNodes.slice(0, 30), null, 2));

  console.log('TOTAL_VISIBLE=', nodeData.length, 'TEXT_LIKE=', textNodes.length);
  console.log('SAMPLE_TEXT_LIKE=');
  for (const n of textNodes.slice(0, 8)) {
    console.log(`  id=${n.id} parent=${n.parentNodeId} kind=${n.kind} rect=${n.x},${n.y} ${n.w}x${n.h}`);
  }

  // try to read store state from window if exposed
  const storeProbe = await page.evaluate(() => {
    const win = window as any;
    const keys = Object.keys(win).filter(k => /builder|canvas|store/i.test(k));
    return keys.slice(0, 30);
  });
  console.log('WINDOW_KEYS=', storeProbe);

  // double-click prefer the actual text leaf nodes
  const candidates = textNodes.filter(n => /^home-hero-(title|subtitle|label)$/i.test(n.id ?? ''));
  const target = candidates[0] ?? textNodes[0];
  if (!target) {
    console.log('NO_TARGET');
    await browser.close();
    return;
  }
  console.log('DBL_TARGET=', target.id, 'kind=', target.kind);

  // first select to ensure node entered focus, then dblclick
  const selectorId = target.id ?? '';
  // get node kind via store property: read data-node-kind  attribute is null per attrs — let's just check the canvas store via React fiber if possible
  const kindProbe = await page.evaluate((id: string) => {
    const el = document.querySelector(`[data-node-id="${id}"]`);
    if (!el) return null;
    const allAttrs: Record<string, string> = {};
    Array.from(el.attributes).forEach(a => allAttrs[a.name] = a.value);
    return {
      tag: el.tagName,
      attrs: allAttrs,
      childrenTags: Array.from(el.children).slice(0, 8).map(c => `${c.tagName}.${(c as HTMLElement).className?.toString().slice(0, 40)}`),
    };
  }, selectorId);
  console.log('TARGET_ATTRS=', JSON.stringify(kindProbe, null, 2));

  // try real user dblclick via playwright at center
  await page.locator(`[data-node-id="${selectorId}"]`).first().dblclick({ force: true });
  await page.waitForTimeout(700);

  const after = await page.evaluate(() => ({
    inlineEditors: document.querySelectorAll('[data-builder-inline-text-editor="true"]').length,
    inlineActive: document.querySelectorAll('[data-builder-inline-text-active]').length,
    inlineContent: document.querySelectorAll('[data-builder-inline-text-content]').length,
    proseMirror: document.querySelectorAll('.ProseMirror').length,
    contentEditable: document.querySelectorAll('[contenteditable="true"]').length,
    focusedTag: document.activeElement?.tagName,
    focusedClass: (document.activeElement as HTMLElement | null)?.className?.toString().slice(0, 100),
  }));
  console.log('AFTER_DBL=', JSON.stringify(after, null, 2));
  await page.screenshot({ path: join(OUT, 'after-dbl.png') });

  // Try dispatching the builder:start-text-edit event explicitly
  await page.evaluate((id: string) => {
    document.dispatchEvent(new CustomEvent('builder:start-text-edit', { detail: { nodeId: id } }));
  }, selectorId);
  await page.waitForTimeout(500);
  const afterEvent = await page.evaluate(() => ({
    inlineEditors: document.querySelectorAll('[data-builder-inline-text-editor="true"]').length,
    proseMirror: document.querySelectorAll('.ProseMirror').length,
    contentEditable: document.querySelectorAll('[contenteditable="true"]').length,
  }));
  console.log('AFTER_EVENT=', JSON.stringify(afterEvent, null, 2));
  await page.screenshot({ path: join(OUT, 'after-event.png') });

  // also try clicking once then dblclick (some apps require selection first)
  await page.locator(`[data-node-id="${selectorId}"]`).first().click({ force: true });
  await page.waitForTimeout(300);
  await page.locator(`[data-node-id="${selectorId}"]`).first().dblclick({ force: true });
  await page.waitForTimeout(800);
  const afterClickDbl = await page.evaluate(() => ({
    inlineEditors: document.querySelectorAll('[data-builder-inline-text-editor="true"]').length,
    proseMirror: document.querySelectorAll('.ProseMirror').length,
    contentEditable: document.querySelectorAll('[contenteditable="true"]').length,
    selectedNodes: Array.from(document.querySelectorAll('[class*="nodeSelected"][data-node-id]')).map(n => n.getAttribute('data-node-id')),
  }));
  console.log('AFTER_CLICK_DBL=', JSON.stringify(afterClickDbl, null, 2));
  await page.screenshot({ path: join(OUT, 'after-click-dbl.png') });

  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
