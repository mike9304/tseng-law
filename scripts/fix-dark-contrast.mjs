/**
 * fix-dark-contrast.mjs — deterministic fix for the recolor's dark-on-dark regressions.
 * For every text/heading node whose color fails WCAG on a DARK (lum<0.18) resolved background,
 * rewrite that node's color to #ffffff (safe on dark) in source — targeted by unique node id, so
 * only the flagged node changes (node ids/counts preserved). Re-runnable. Run via:
 *   node_modules/.bin/vite-node -c vitest.config.ts scripts/fix-dark-contrast.mjs
 */
import { promises as fs } from 'node:fs';
import { getAllTemplates } from '../src/lib/builder/templates/registry.ts';

const rgb = (h) => { const s = h.replace('#', ''); const n = s.length === 3 ? s.replace(/./g, '$&$&') : s; return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)]; };
const lin = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (h) => { const [r, g, b] = rgb(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const contrast = (a, b) => { const L = [lum(a), lum(b)].sort((x, y) => y - x); return (L[0] + 0.05) / (L[1] + 0.05); };
const firstHex = (v) => { if (typeof v !== 'string') return null; const m = v.match(/#[0-9a-fA-F]{6}/); return m ? m[0].toLowerCase() : null; };

const fixes = {};
for (const t of getAllTemplates()) {
  const nodes = t.document.nodes; const byId = new Map(nodes.map((n) => [n.id, n]));
  const ownBg = (n) => firstHex(n.content?.backgroundColor) || (n.kind === 'container' || n.kind === 'section' ? firstHex(n.content?.background) || firstHex(n.style?.backgroundColor) : null);
  const resolveBg = (n) => { let cur = n, hops = 0; while (cur && hops++ < 12) { const bg = ownBg(cur); if (bg) return bg; cur = cur.parentId ? byId.get(cur.parentId) : null; } return '#ffffff'; };
  for (const n of nodes) {
    if (n.kind !== 'heading' && n.kind !== 'text') continue;
    const color = firstHex(n.content?.color); if (!color) continue;
    const bg = n.content?.backgroundColor ? firstHex(n.content.backgroundColor) : resolveBg(n.parentId ? byId.get(n.parentId) : null);
    if (!bg || lum(bg) >= 0.18) continue;
    const min = n.kind === 'heading' && (n.content?.level ?? 3) <= 2 ? 3 : 4.5;
    if (contrast(color, bg) >= min) continue;
    if (color === '#ffffff') continue;
    const file = `src/lib/builder/templates/${t.id.split('-')[0]}/${t.id}.ts`;
    (fixes[file] ??= []).push({ nodeId: n.id, oldColor: color });
  }
}
let changed = 0, miss = 0;
for (const [file, list] of Object.entries(fixes)) {
  let src; try { src = await fs.readFile(file, 'utf8'); } catch { console.log('MISSING FILE', file); miss += list.length; continue; }
  for (const { nodeId, oldColor } of list) {
    const idIdx = src.indexOf(`'${nodeId}'`);
    if (idIdx < 0) { miss++; continue; }
    const rel = src.slice(idIdx, idIdx + 700).indexOf(`'${oldColor}'`);
    if (rel < 0) { miss++; continue; }
    const at = idIdx + rel;
    src = src.slice(0, at) + `'#ffffff'` + src.slice(at + `'${oldColor}'`.length);
    changed++;
  }
  await fs.writeFile(file, src);
}
console.log(`fixed ${changed} dark-on-dark text colors → #ffffff across ${Object.keys(fixes).length} files (${miss} unmatched)`);
