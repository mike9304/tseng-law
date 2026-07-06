/**
 * font-subpages.mjs — inject the serif heading font (Noto Serif KR, matching migrated homes)
 * into every subpage's local heading() helper content. Idempotent. Headings are the dominant
 * typography tone signal; body stays the canvas sans default. Run: node scripts/font-subpages.mjs
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = 'src/lib/builder/templates';
const SKIP = new Set(['_shared', '__tests__']);
const HEAD = "'Noto Serif KR'";
const dirs = (await fs.readdir(ROOT, { withFileTypes: true })).filter((d) => d.isDirectory() && !SKIP.has(d.name)).map((d) => d.name);
let files = 0, inj = 0;
for (const ind of dirs) {
  for (const f of (await fs.readdir(path.join(ROOT, ind))).filter((x) => x.endsWith('.ts') && !x.endsWith('-home.ts'))) {
    const fp = path.join(ROOT, ind, f);
    let src = await fs.readFile(fp, 'utf8');
    if (src.includes('fontFamily')) continue; // idempotent
    let n = 0;
    src = src.replace(/content: \{ text, level, color, align, className \}/g, () => { n++; return `content: { text, level, color, align, className, fontFamily: ${HEAD} }`; });
    src = src.replace(/content: \{ text, level, color, align \}/g, () => { n++; return `content: { text, level, color, align, fontFamily: ${HEAD} }`; });
    if (n > 0) { await fs.writeFile(fp, src); files++; inj += n; }
  }
}
console.log(`serif heading font injected into ${files} subpages (${inj} heading helpers)`);
