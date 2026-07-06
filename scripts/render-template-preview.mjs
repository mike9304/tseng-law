#!/usr/bin/env node
/**
 * render-template-preview.mjs — faithful standalone preview of a builder template document.
 *
 * Renders a template's canvas nodes (absolute-positioned, parent-relative) to HTML and
 * screenshots it with Playwright, so template design work can be visually verified WITHOUT
 * the full app/auth/gallery flow. Mirrors the canvas model: container/text/heading/button/image
 * nodes with rect (x,y,w,h relative to parent), style (bg/textColor/opacity/radius), content.
 *
 * Usage: node scripts/render-template-preview.mjs <docJsonPath> <outPng>
 * docJson = { nodes, width, height, background }
 */
import { chromium } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const [docPath, outPng] = process.argv.slice(2);
if (!docPath || !outPng) { console.error('usage: render-template-preview.mjs <docJson> <outPng>'); process.exit(1); }

const rawDoc = JSON.parse(await fs.readFile(docPath, 'utf8'));
// Template documents use stageWidth/stageHeight; normalize to width/height.
const doc = {
  ...rawDoc,
  width: rawDoc.width ?? rawDoc.stageWidth ?? 1280,
  height: rawDoc.height ?? rawDoc.stageHeight ?? 2000,
};
const byId = new Map(doc.nodes.map((n) => [n.id, n]));
const children = new Map();
for (const n of doc.nodes) {
  const pid = n.parentId ?? '__root__';
  if (!children.has(pid)) children.set(pid, []);
  children.get(pid).push(n);
}

function esc(s) { return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function renderNode(n) {
  const r = n.rect || { x: 0, y: 0, width: 0, height: 0 };
  const st = n.style || {};
  const c = n.content || {};
  const base = `position:absolute;left:${r.x}px;top:${r.y}px;width:${r.width}px;height:${r.height}px;box-sizing:border-box;`;
  const radius = st.borderRadius ? `border-radius:${st.borderRadius}px;overflow:hidden;` : '';
  const kids = (children.get(n.id) || []).map(renderNode).join('');
  if (n.kind === 'container') {
    // Container visuals live in content.* (background/borderRadius/padding/border), matching the real canvas renderer.
    const bg = c.background || st.backgroundColor || 'transparent';
    const cRadius = (c.borderRadius || st.borderRadius) ? `border-radius:${c.borderRadius || st.borderRadius}px;` : '';
    const border = c.borderWidth ? `border:${c.borderWidth}px ${c.borderStyle || 'solid'} ${c.borderColor || 'transparent'};` : '';
    const pad = c.padding ? `padding:${c.padding}px;` : (st.padding ? `padding:${st.padding}px;` : '');
    const hasShadow = (st.shadowBlur || st.shadowX || st.shadowY || st.shadowSpread);
    const shadow = hasShadow ? `box-shadow:${st.shadowX || 0}px ${st.shadowY || 0}px ${st.shadowBlur || 0}px ${st.shadowSpread || 0}px ${st.shadowColor || 'rgba(15,23,42,0.12)'};` : '';
    return `<div style="${base}background:${bg};${cRadius}${border}${pad}${shadow}">${kids}</div>`;
  }
  if (n.kind === 'image') {
    const op = st.opacity != null ? (st.opacity > 1 ? st.opacity / 100 : st.opacity) : 1;
    const hasShadow = (st.shadowBlur || st.shadowX || st.shadowY || st.shadowSpread);
    const shadow = hasShadow ? `box-shadow:${st.shadowX || 0}px ${st.shadowY || 0}px ${st.shadowBlur || 0}px ${st.shadowSpread || 0}px ${st.shadowColor || 'rgba(15,23,42,0.12)'};` : '';
    return `<div style="${base}${radius}${shadow}"><img src="${esc(c.src)}" alt="${esc(c.alt)}" style="width:100%;height:100%;object-fit:cover;opacity:${op};"/>${kids}</div>`;
  }
  if (n.kind === 'button') {
    return `<div style="${base}display:flex;align-items:center;justify-content:center;background:${st.backgroundColor || '#111'};color:${st.textColor || '#fff'};${st.borderRadius ? `border-radius:${st.borderRadius}px;` : ''}font-weight:600;font-size:16px;">${esc(c.label)}${kids}</div>`;
  }
  // text / heading
  const isHeading = n.kind === 'heading';
  const level = c.level || 2;
  const size = isHeading ? (level === 1 ? 52 : level === 2 ? 36 : level === 3 ? 24 : 19) : (c.fontSize || 16);
  const weight = isHeading ? 700 : (c.fontWeight === 'bold' ? 700 : c.fontWeight === 'medium' ? 600 : 400);
  const color = (isHeading ? c.color : st.textColor) || c.color || '#111';
  const align = c.align || 'left';
  const lh = c.lineHeight || (isHeading ? 1.12 : 1.5);
  const txt = esc(c.text).replace(/\n/g, '<br/>');
  return `<div style="${base}color:${color};font-size:${size}px;font-weight:${weight};text-align:${align};line-height:${lh};font-family:Inter,system-ui,'Apple SD Gothic Neo',sans-serif;white-space:pre-wrap;">${txt}${kids}</div>`;
}

const roots = (children.get('__root__') || []).slice().sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
const body = roots.map(renderNode).join('');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0;}body{background:${doc.background || '#fff'};}</style></head>
<body><div style="position:relative;width:${doc.width}px;height:${doc.height}px;background:${doc.background || '#fff'};">${body}</div></body></html>`;

const htmlPath = outPng.replace(/\.png$/, '.html');
await fs.writeFile(htmlPath, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: doc.width, height: Math.min(doc.height, 4000) }, deviceScaleFactor: 1 });
await page.goto('file://' + path.resolve(htmlPath), { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: outPng, fullPage: true });
await browser.close();
console.log('rendered', outPng, `(${doc.nodes.length} nodes, ${doc.width}x${doc.height})`);
