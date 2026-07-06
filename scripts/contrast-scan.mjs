/**
 * contrast-scan.mjs — verify recolor readability across ALL templates.
 * For every heading/text node, resolve its effective background (own content.backgroundColor,
 * else nearest ancestor container/section background, else page white) and compute WCAG contrast.
 * Flags large text (heading lvl≤2) < 3:1 and body/small < 4.5:1. Run:
 *   node_modules/.bin/vite-node -c vitest.config.ts scripts/contrast-scan.mjs
 */
import { getAllTemplates } from '../src/lib/builder/templates/registry.ts';

const rgb = (h) => { const s = h.replace('#', ''); const n = s.length === 3 ? s.replace(/./g, '$&$&') : s; return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)]; };
const lin = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (h) => { const [r, g, b] = rgb(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const contrast = (a, b) => { const L = [lum(a), lum(b)].sort((x, y) => y - x); return (L[0] + 0.05) / (L[1] + 0.05); };
const firstHex = (v) => { if (typeof v !== 'string') return null; const m = v.match(/#[0-9a-fA-F]{6}/); return m ? m[0].toLowerCase() : null; };

const flags = []; let textTotal = 0;
for (const t of getAllTemplates()) {
  const nodes = t.document.nodes; const byId = new Map(nodes.map((n) => [n.id, n]));
  const ownBg = (n) => firstHex(n.content?.backgroundColor) || (n.kind === 'container' || n.kind === 'section' ? firstHex(n.content?.background) || firstHex(n.style?.backgroundColor) : null);
  const resolveBg = (n) => { let cur = n; let hops = 0; while (cur && hops++ < 12) { const bg = ownBg(cur); if (bg && bg !== '#transparent') return bg; cur = cur.parentId ? byId.get(cur.parentId) : null; } return '#ffffff'; };
  for (const n of nodes) {
    if (n.kind !== 'heading' && n.kind !== 'text') continue;
    textTotal++;
    const color = firstHex(n.content?.color); if (!color) continue;
    const bg = n.content?.backgroundColor ? firstHex(n.content.backgroundColor) : resolveBg(n.parentId ? byId.get(n.parentId) : null);
    if (!bg) continue;
    const cr = contrast(color, bg);
    const large = n.kind === 'heading' && (n.content?.level ?? 3) <= 2;
    const min = large ? 3 : 4.5;
    if (cr < min) flags.push({ id: t.id, node: n.id.replace(t.id + '-', ''), color, bg, cr: Math.round(cr * 100) / 100, min });
  }
}
flags.sort((a, b) => a.cr - b.cr);
console.log(`FLAGGED ${flags.length} low-contrast text nodes / ${textTotal} total text nodes across ${getAllTemplates().length} templates`);
// Categorize: dark-on-dark (recolor regression we must fix) vs pre-existing light-bg patterns.
const darkBg = flags.filter((f) => lum(f.bg) < 0.18);
const whiteOnLight = flags.filter((f) => f.color === '#ffffff' && lum(f.bg) >= 0.18);
const otherLight = flags.filter((f) => f.color !== '#ffffff' && lum(f.bg) >= 0.18);
console.log(`  DARK-on-dark (real regressions to fix): ${darkBg.length}`);
console.log(`  white-fg on light bg (button-bg false positives): ${whiteOnLight.length}`);
console.log(`  other light-bg (accent/muted on light tint): ${otherLight.length}`);
const lt2 = otherLight.filter((f) => f.cr < 2).length, lt3 = otherLight.filter((f) => f.cr >= 2 && f.cr < 3).length, lt45 = otherLight.filter((f) => f.cr >= 3).length;
console.log(`    └ light-bg severity: <2:1=${lt2} (bad)  2-3:1=${lt3} (weak)  3-4.5:1=${lt45} (borderline/large-ok)`);
console.log('\n-- DARK-on-dark detail (fix these): --');
for (const f of darkBg.slice(0, 40)) console.log(`  ${f.cr}:1 (need ${f.min}) ${f.id} :: ${f.node}  fg=${f.color} bg=${f.bg}`);
const byTpl = {}; for (const f of darkBg) byTpl[f.id] = (byTpl[f.id] || 0) + 1;
const sorted = Object.entries(byTpl).sort((a, b) => b[1] - a[1]);
if (sorted.length) { console.log('\nDARK-on-dark BY TEMPLATE:'); for (const [id, c] of sorted.slice(0, 30)) console.log(`  ${id}: ${c}`); }
