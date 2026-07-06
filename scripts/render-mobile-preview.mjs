#!/usr/bin/env node
/**
 * render-mobile-preview.mjs — render a template document at the MOBILE viewport (375px),
 * resolving each node's `responsive.mobile` rect + fontSize overrides. Verifies the
 * single-column reflow produced by responsivizeMobile.
 *
 * Usage: node scripts/render-mobile-preview.mjs <docJson> <outPng>
 */
import { chromium } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const [docPath, outPng, vpArg] = process.argv.slice(2);
if (!docPath || !outPng) { console.error('usage: render-mobile-preview.mjs <docJson> <outPng> [mobile|tablet]'); process.exit(1); }
const doc = JSON.parse(await fs.readFile(docPath, 'utf8'));
const VP = vpArg === 'tablet' ? 'tablet' : 'mobile';
const MW = VP === 'tablet' ? 768 : 375;

const children = new Map();
for (const n of doc.nodes) {
  const pid = n.parentId ?? '__root__';
  if (!children.has(pid)) children.set(pid, []);
  children.get(pid).push(n);
}
function mrect(n) {
  const b = n.rect || { x: 0, y: 0, width: 0, height: 0 };
  const m = n.responsive?.[VP]?.rect;
  return m ? { x: m.x ?? b.x, y: m.y ?? b.y, width: m.width ?? b.width, height: m.height ?? b.height } : b;
}
function mfont(n) {
  const m = n.responsive?.[VP]?.fontSize;
  if (m != null) return m;
  const c = n.content || {};
  if (n.kind === 'heading') { const l = c.level || 2; return l === 1 ? 52 : l === 2 ? 36 : l === 3 ? 24 : 19; }
  return c.fontSize || 16;
}
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function renderNode(n) {
  const r = mrect(n);
  const st = n.style || {};
  const c = n.content || {};
  const base = `position:absolute;left:${r.x}px;top:${r.y}px;width:${r.width}px;height:${r.height}px;box-sizing:border-box;`;
  const kids = (children.get(n.id) || []).map(renderNode).join('');
  if (n.kind === 'container') {
    const bg = c.background || st.backgroundColor || 'transparent';
    const cR = (c.borderRadius || st.borderRadius) ? `border-radius:${c.borderRadius || st.borderRadius}px;overflow:hidden;` : '';
    const border = c.borderWidth ? `border:${c.borderWidth}px ${c.borderStyle || 'solid'} ${c.borderColor || 'transparent'};` : '';
    return `<div style="${base}background:${bg};${cR}${border}">${kids}</div>`;
  }
  if (n.kind === 'image') {
    const op = st.opacity != null ? (st.opacity > 1 ? st.opacity / 100 : st.opacity) : 1;
    const rad = st.borderRadius ? `border-radius:${st.borderRadius}px;overflow:hidden;` : '';
    return `<div style="${base}${rad}"><img src="${esc(c.src)}" alt="" style="width:100%;height:100%;object-fit:cover;opacity:${op};"/>${kids}</div>`;
  }
  if (n.kind === 'button') {
    return `<div style="${base}display:flex;align-items:center;justify-content:center;background:${st.backgroundColor || '#111'};color:#fff;${st.borderRadius ? `border-radius:${st.borderRadius}px;` : ''}font-weight:600;font-size:15px;">${esc(c.label)}${kids}</div>`;
  }
  const size = mfont(n);
  const weight = n.kind === 'heading' ? 700 : (c.fontWeight === 'bold' ? 700 : c.fontWeight === 'medium' ? 600 : 400);
  const color = c.color || (n.kind === 'heading' ? '#111' : st.textColor) || '#111';
  const align = c.align || 'left';
  const lh = c.lineHeight || (n.kind === 'heading' ? 1.15 : 1.5);
  const txt = esc(c.text).replace(/\n/g, '<br/>');
  return `<div style="${base}color:${color};font-size:${size}px;font-weight:${weight};text-align:${align};line-height:${lh};font-family:Inter,system-ui,'Apple SD Gothic Neo',sans-serif;white-space:pre-wrap;overflow:hidden;">${txt}${kids}</div>`;
}

const roots = (children.get('__root__') || []).slice().sort((a, b) => (mrect(a).y - mrect(b).y) || ((a.zIndex || 0) - (b.zIndex || 0)));
const height = Math.max(...roots.map((n) => { const r = mrect(n); return r.y + r.height; }), 100);
const body = roots.map(renderNode).join('');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0;}</style></head><body><div style="position:relative;width:${MW}px;height:${height}px;background:${doc.background || '#fff'};">${body}</div></body></html>`;
const htmlPath = outPng.replace(/\.png$/, '.html');
await fs.writeFile(htmlPath, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: MW, height: Math.min(height, 6000) }, deviceScaleFactor: 1 });
await page.goto('file://' + path.resolve(htmlPath), { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: outPng, fullPage: true });
await browser.close();
console.log(`rendered ${VP.toUpperCase()}`, outPng, `(${doc.nodes.length} nodes, ${MW}x${Math.round(height)})`);
