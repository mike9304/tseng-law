#!/usr/bin/env node
/**
 * generate-template-images.mjs
 *
 * Generates real raster assets for every `/images/placeholder-*.{jpg,png}` path
 * referenced by the 261 page templates. Before this, all 84 referenced raster
 * paths 404'd (only placeholder-image.svg existed), so every template rendered
 * broken-image icons in the gallery — the #1 visual gap to "perfect Wix"
 * (see WIX-PERFECT-PLAN-2026-05-29.md, backlog #1).
 *
 * Approach: each asset is a tasteful, industry-themed mesh-gradient composition
 * (layered radial blobs + soft geometry + grain) rasterized via sharp. Themed by
 * the filename keyword, varied by a deterministic hash so heroes/cards/galleries
 * don't look identical. No copyright/API/network dependency; fully reproducible.
 *
 * Usage: node scripts/generate-template-images.mjs [--force]
 * Reads referenced paths live from src/lib/builder/templates (so it stays in sync).
 */
import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT_DIR = path.join(ROOT, 'public', 'images');
const FORCE = process.argv.includes('--force');

/* ── Industry palettes (calm, modern, Wix-grade duotones) ─────────────── */
const PALETTES = {
  law:        ['#0f2a43', '#1c4a6e', '#c8a96a'],
  consulting: ['#13263f', '#2a4d73', '#d9b574'],
  realestate: ['#26313d', '#4a5f73', '#b89a78'],
  property:   ['#26313d', '#4a5f73', '#b89a78'],
  interior:   ['#2b2622', '#5a4f45', '#c9a77f'],
  architecture:['#1e2a33','#3f5a6b', '#cdd6db'],
  health:     ['#123c32', '#2f8f75', '#bfe6d8'],
  dental:     ['#0e3a4a', '#2f7f9f', '#cfeaf2'],
  doctor:     ['#123c32', '#2f8f75', '#bfe6d8'],
  restaurant: ['#3a1410', '#8a3324', '#e0a86a'],
  food:       ['#3a1410', '#9a3a26', '#e8b87a'],
  cafe:       ['#2c1c12', '#6b4a2f', '#caa06a'],
  bakery:     ['#3a2415', '#7a4a28', '#e2b97e'],
  smoothie:   ['#7a1f3a', '#c0395f', '#f3b9a0'],
  beauty:     ['#2b1c18', '#7a4a52', '#d9b78a'],
  salon:      ['#241820', '#6e4658', '#d8a9b4'],
  wedding:    ['#2e2630', '#6e5a6a', '#dcc7cf'],
  fashion:    ['#1a1a1f', '#3a3a44', '#c9b070'],
  fitness:    ['#10161f', '#27323f', '#d8ea20'],
  gym:        ['#10161f', '#27323f', '#d8ea20'],
  trainers:   ['#141b24', '#2c3a4a', '#e2ee4a'],
  yoga:       ['#2a2438', '#5a4f73', '#cdb8e0'],
  travel:     ['#0e2233', '#236084', '#e8c27a'],
  hotel:      ['#10243a', '#2a5f86', '#dcb878'],
  bali:       ['#0c3a32', '#1f7a64', '#e8c87a'],
  hawaii:     ['#0a3550', '#1f7fa0', '#f0c878'],
  japan:      ['#2a1418', '#7a2430', '#e8d2c0'],
  tokyo:      ['#15131f', '#3a3358', '#d05a7a'],
  europe:     ['#1a2238', '#3f4f7a', '#cdb088'],
  creative:   ['#141416', '#33333a', '#d8ea20'],
  portfolio:  ['#161618', '#3a3a40', '#c8b27a'],
  photo:      ['#121214', '#34343c', '#cccccc'],
  music:      ['#1a1024', '#4a1f5a', '#e05a9a'],
  podcast:    ['#15131f', '#3a2f58', '#c08adf'],
  conference: ['#101a2f', '#27406b', '#7da0d8'],
  event:      ['#1a1230', '#432a6e', '#c89adf'],
  product:    ['#0d1a2f', '#1f4d7a', '#7fb0e8'],
  shop:       ['#1a1410', '#5a4030', '#d8a86a'],
  pet:        ['#1f2a18', '#4a5f30', '#c8d88a'],
  startup:    ['#0c1424', '#1f3d6b', '#5f9fff'],
  speaker:    ['#101a2f', '#27406b', '#9db8e0'],
  artist:     ['#1a1024', '#4a1f5a', '#e05a9a'],
  hero:       ['#12263f', '#2a4d73', '#c8a96a'],
  default:    ['#16202e', '#33455c', '#b9c4d0'],
};

function pickPalette(name) {
  const keys = Object.keys(PALETTES);
  // longest-matching keyword wins (e.g. "travel-bali" -> bali over travel handled by order; use scan)
  let best = 'default';
  let bestLen = 0;
  for (const k of keys) {
    if (k !== 'default' && name.includes(k) && k.length > bestLen) { best = k; bestLen = k.length; }
  }
  return PALETTES[best];
}

/* deterministic hash from string */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0);
}

function lighten(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 255) + amt);
  const g = Math.min(255, ((n >> 8) & 255) + amt);
  const b = Math.min(255, (n & 255) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/* Build a layered mesh-gradient SVG, varied by hash seed */
function buildSvg(name, w, h) {
  const [c0, c1, c2] = pickPalette(name);
  const seed = hash(name);
  const r = (n) => ((seed >> (n * 3)) & 7); // small pseudo-random 0-7
  const angle = 90 + (r(1) * 30);
  // blob positions
  const bx1 = 15 + r(2) * 6, by1 = 20 + r(3) * 5;
  const bx2 = 70 + r(4) * 4, by2 = 65 + r(5) * 4;
  const bx3 = 50 + r(6) * 8, by3 = 30 + r(7) * 6;
  const variant = r(0) % 4;
  const accent = c2;
  // optional geometric overlay by variant
  let overlay = '';
  if (variant === 0) {
    overlay = `<g opacity="0.10" stroke="${accent}" stroke-width="1.5" fill="none">
      ${Array.from({ length: 6 }, (_, i) => `<circle cx="${w * 0.78}" cy="${h * 0.28}" r="${40 + i * 46}"/>`).join('')}
    </g>`;
  } else if (variant === 1) {
    overlay = `<g opacity="0.08" stroke="${accent}" stroke-width="2" fill="none">
      ${Array.from({ length: 14 }, (_, i) => `<line x1="${i * (w / 13)}" y1="0" x2="${i * (w / 13) - h * 0.4}" y2="${h}"/>`).join('')}
    </g>`;
  } else if (variant === 2) {
    overlay = `<g opacity="0.12" fill="${accent}">
      ${Array.from({ length: 5 }, (_, i) => `<rect x="${w * (0.12 + i * 0.17)}" y="${h * 0.7}" width="${w * 0.05}" height="${h * 0.22 - i * 14}" rx="3"/>`).join('')}
    </g>`;
  } else {
    overlay = `<g opacity="0.10" fill="none" stroke="${accent}" stroke-width="2">
      <path d="M0,${h * 0.75} Q ${w * 0.3},${h * 0.55} ${w * 0.55},${h * 0.7} T ${w},${h * 0.6}"/>
      <path d="M0,${h * 0.85} Q ${w * 0.35},${h * 0.68} ${w * 0.6},${h * 0.82} T ${w},${h * 0.72}"/>
    </g>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" gradientTransform="rotate(${angle} 0.5 0.5)">
      <stop offset="0" stop-color="${c0}"/>
      <stop offset="0.55" stop-color="${c1}"/>
      <stop offset="1" stop-color="${lighten(c1, 18)}"/>
    </linearGradient>
    <radialGradient id="b1" cx="${bx1}%" cy="${by1}%" r="60%">
      <stop offset="0" stop-color="${lighten(c1, 40)}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b2" cx="${bx2}%" cy="${by2}%" r="55%">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.40"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b3" cx="${bx3}%" cy="${by3}%" r="50%">
      <stop offset="0" stop-color="${lighten(c0, 30)}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${c0}" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.05"/></feComponentTransfer><feComposite operator="over" in2="SourceGraphic"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#b1)"/>
  <rect width="${w}" height="${h}" fill="url(#b2)"/>
  <rect width="${w}" height="${h}" fill="url(#b3)"/>
  ${overlay}
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.5"/>
</svg>`;
}

function dimsFor(name) {
  if (name.includes('hero')) return [1600, 900];
  if (name.includes('cover') || name.includes('screenshot')) return [1200, 900];
  if (name.includes('portrait') || name.includes('artist') || name.includes('speaker') || name.includes('doctor') || name.includes('-1') && name.includes('photo')) return [800, 1000];
  return [1200, 900];
}

async function collectReferencedPaths() {
  // grep the templates for /images/...{jpg,jpeg,png,webp}
  const out = execSync(
    `grep -rhoE "/images/[a-zA-Z0-9_./-]+\\.(jpg|jpeg|png|webp)" "${path.join(ROOT, 'src/lib/builder/templates')}" | sort -u`,
    { encoding: 'utf8' },
  );
  return out.split('\n').map((s) => s.trim()).filter(Boolean);
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const refs = await collectReferencedPaths();
  let made = 0, skipped = 0, failed = 0;
  for (const ref of refs) {
    const rel = ref.replace(/^\/images\//, '');
    const abs = path.join(OUT_DIR, rel);
    const ext = path.extname(abs).toLowerCase().replace('.', '');
    const name = path.basename(rel, path.extname(rel)).toLowerCase();
    if (!FORCE) {
      try { await fs.access(abs); skipped++; continue; } catch { /* generate */ }
    }
    const [w, h] = dimsFor(name);
    const svg = buildSvg(name, w, h);
    try {
      await fs.mkdir(path.dirname(abs), { recursive: true });
      let pipe = sharp(Buffer.from(svg));
      if (ext === 'png') pipe = pipe.png({ quality: 90, compressionLevel: 9 });
      else if (ext === 'webp') pipe = pipe.webp({ quality: 82 });
      else pipe = pipe.jpeg({ quality: 82, mozjpeg: true });
      await pipe.toFile(abs);
      made++;
    } catch (e) {
      console.error(`FAIL ${ref}: ${e.message}`);
      failed++;
    }
  }
  console.log(`\nGenerated ${made}, skipped(existing) ${skipped}, failed ${failed}, total referenced ${refs.length}`);
  // verify none missing
  let missing = 0;
  for (const ref of refs) {
    try { await fs.access(path.join(OUT_DIR, ref.replace(/^\/images\//, ''))); } catch { missing++; console.error(`STILL MISSING ${ref}`); }
  }
  console.log(missing === 0 ? 'ALL referenced raster paths now resolve ✓' : `${missing} STILL MISSING ✗`);
  process.exit(missing === 0 ? 0 : 1);
}

main();
