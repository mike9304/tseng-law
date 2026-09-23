// Sync ColumnsGrid's local GUIDANCE_CARD_READ_MORE_LABEL copy with the guidance pack's columnsReadMoreLabel for one locale.
// usage: npx tsx scripts/sync-grid-read-more.mts <loc>   (prints "synced"/"unchanged")
import { readFileSync, writeFileSync } from 'node:fs';
import { guidanceContent } from '../src/data/international-guidance-content';
const loc = process.argv[2];
const find = (v: unknown): string | null => { if (!v || typeof v !== 'object') return null; const o = v as Record<string, unknown>; if (typeof o.columnsReadMoreLabel === 'string') return o.columnsReadMoreLabel; for (const x of Object.values(o)) { const r = find(x); if (r) return r; } return null; };
const label = find((guidanceContent as Record<string, unknown>)[loc]);
if (!label) { console.log('no columnsReadMoreLabel'); process.exit(0); }
const p = 'src/components/ColumnsGrid.tsx'; const src = readFileSync(p, 'utf8');
const a = src.indexOf('GUIDANCE_CARD_READ_MORE_LABEL'); if (a < 0) { console.log('table not found'); process.exit(0); }
const re = new RegExp(`^(  ${loc.replace('-', '\\-')}: ')([^']*)(',)$`, 'm');
const tail = src.slice(a); const m = tail.match(re);
if (!m) { console.log('entry not found'); process.exit(0); }
if (m[2] === label) { console.log('unchanged'); process.exit(0); }
writeFileSync(p, src.slice(0, a) + tail.replace(re, `$1${label.replace(/'/g, "\\'")}$3`));
console.log(`synced ${m[2]} -> ${label}`);
