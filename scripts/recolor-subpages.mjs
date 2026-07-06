/**
 * recolor-subpages.mjs — remap the legacy law-navy palette in industry SUBPAGES to each
 * industry's own home palette (tone match). Deterministic + idempotent + re-runnable.
 * Target palette per industry is extracted (regex, not eval) from that industry's <ind>-home.ts.
 * `law` is skipped (navy is correct for a law firm). Usage: node scripts/recolor-subpages.mjs [--dry]
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = 'src/lib/builder/templates';
const SKIP = new Set(['_shared', '__tests__', 'law', 'fashion', 'tech', 'business', 'layout', 'events']);
const DRY = process.argv.includes('--dry');

// Legacy hex → palette ROLE. Bucketed by LUMINANCE CLASS so foreground/background contrast survives.
const ROLE = {
  // dark brand / dark sections / dark category accents → ink (dark)
  ink: ['#123b63','#0f172a','#111827','#1f2937','#1e293b','#18181b','#172554','#312e81','#164e63',
        '#14532d','#4c1d95','#7f1d1d','#365314','#0c4a6e','#581c87','#1e1b4b','#422006','#334155',
        '#374151','#0f2d4d','#1e3a8a','#0b3b2e','#082f49','#3f1d1d','#1c1917','#0f766e'],
  // mid grays (muted/caption/body-secondary) → mutedInk
  mutedInk: ['#475569','#64748b','#6b7280','#94a3b8','#9ca3af','#71717a','#78716c','#52525b'],
  // accents (blue + amber + brights) → accent
  accent: ['#1e5a96','#2563eb','#e8a838','#3b82f6','#0ea5e9','#f59e0b','#d97706','#0891b2'],
  // hairlines / borders → line
  line: ['#dbe4ee','#e5e7eb','#e2e8f0','#cbd5e1','#bfdbfe','#bae6fd','#bfd3f2','#d1d5db','#e4e4e7'],
  // light tinted surfaces → surfaceAlt
  surfaceAlt: ['#f8fafc','#f3f4f6','#f1f5f9','#eff6ff','#e0f2fe','#ecfdf5','#fef3c7','#fff7ed','#fffbeb',
               '#f0f9ff','#fdf4ff','#fef2f2','#f0fdf4','#fed7aa','#fde68a','#f9fafb','#fafaf9','#faf5ff'],
};
const LEGACY = {};
for (const [role, hexes] of Object.entries(ROLE)) for (const h of hexes) LEGACY[h] = role;

function extractPalette(src) {
  const keys = ['base','surface','surfaceAlt','ink','mutedInk','accent','onAccent','line'];
  const p = {};
  for (const k of keys) {
    const m = src.match(new RegExp(`(?:^|[^a-zA-Z])${k}:\\s*['"](#[0-9a-fA-F]{6})['"]`));
    if (m) p[k] = m[1].toLowerCase();
  }
  return keys.every((k) => p[k]) ? p : null;
}

const dirs = (await fs.readdir(ROOT, { withFileTypes: true }))
  .filter((d) => d.isDirectory() && !SKIP.has(d.name)).map((d) => d.name).sort();
let totalFiles = 0, totalRepl = 0; const report = [], skipped = [];
for (const ind of dirs) {
  let homeSrc;
  try { homeSrc = await fs.readFile(path.join(ROOT, ind, `${ind}-home.ts`), 'utf8'); }
  catch { skipped.push(`${ind} (no home)`); continue; }
  const pal = extractPalette(homeSrc);
  if (!pal) { skipped.push(`${ind} (no palette obj — uses builder default; subpages left as-is)`); continue; }
  const hexMap = {};
  for (const [legacy, role] of Object.entries(LEGACY)) hexMap[legacy] = pal[role];
  const files = (await fs.readdir(path.join(ROOT, ind))).filter((f) => f.endsWith('.ts') && !f.endsWith('-home.ts'));
  let indRepl = 0, indFiles = 0;
  for (const f of files) {
    const fp = path.join(ROOT, ind, f);
    let src = await fs.readFile(fp, 'utf8'); let n = 0;
    src = src.replace(/#[0-9a-fA-F]{6}/g, (h) => { const lo = h.toLowerCase(); if (hexMap[lo]) { n++; return hexMap[lo]; } return h; });
    if (n > 0) { indRepl += n; indFiles++; if (!DRY) await fs.writeFile(fp, src); }
  }
  totalFiles += indFiles; totalRepl += indRepl;
  report.push(`${ind.padEnd(13)} ${indFiles} files, ${indRepl} swaps  (ink ${pal.ink} · accent ${pal.accent} · surfaceAlt ${pal.surfaceAlt})`);
}
console.log(report.join('\n'));
if (skipped.length) console.log('\nSKIPPED: ' + skipped.join(', '));
console.log(`\n${DRY ? '[DRY] ' : ''}TOTAL: ${totalFiles} files, ${totalRepl} color swaps`);
