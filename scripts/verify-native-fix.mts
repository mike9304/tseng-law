import { readFileSync, readdirSync } from 'node:fs';
import { guidanceContent } from '../src/data/international-guidance-content';
import { guidanceLanguageNames, guidanceTeamBios, guidanceTeamCopy, guidancePracticeAreaNames } from '../src/data/international-guidance-team';
import { guidanceOfficeCopy, guidanceFooterCopy } from '../src/data/international-guidance-offices';
import { internationalInquiryCopy } from '../src/data/international-inquiry-copy';
import { guidanceAnswers } from '../src/data/international-guidance-answers';
import { GUIDANCE_LLMS_NOTICES } from '../src/lib/llms-txt';
const srcs: Record<string, Record<string, unknown>> = { guidanceContent, guidanceTeamCopy, guidanceTeamBios, guidanceLanguageNames, guidancePracticeAreaNames, guidanceOfficeCopy, guidanceFooterCopy, internationalInquiryCopy, guidanceAnswers, GUIDANCE_LLMS_NOTICES };
const walk = (v: unknown, out: string[]) => { if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach((x) => walk(x, out)); else if (v && typeof v === 'object') Object.values(v).forEach((x) => walk(x, out)); };
const loc = process.argv[2];
const round = process.argv[3]; // optional campaign round number → reviews/native/rounds/r<N>/
const reviewDir = round ? `docs/i18n/global-plan/reviews/native/rounds/r${round}` : 'docs/i18n/global-plan/reviews/native';
const pack: string[] = []; for (const s of Object.values(srcs)) if (s && s[loc]) walk(s[loc], pack);
const packText = pack.join('\n');
const dir = `src/content/columns-${loc}`;
const cols = Object.fromEntries(readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => [f.slice(0, 3), readFileSync(`${dir}/${f}`, 'utf8')]));
const allCols = Object.values(cols).join('\n');
const SKIP = /wei-wei-lawyer\.com\/post|TWD 1\.57M|^https?:/;
const norm = (s: string) => s.replace(/^["“„«»‚‘'`*]+|["”“„«»‘’'`*]+$/g, '').trim();
let total = 0; const left: string[] = [];
for (const part of ['a', 'b']) {
  const md = readFileSync(`${reviewDir}/${loc}-${part}.md`, 'utf8');
  for (const line of md.split('\n')) {
    const m = line.match(/^\|\s*(\d+)\s*\|\s*(P[123])\s*\|\s*([A-G])\s*\|\s*([^|]*)\|\s*([^|]*)\|/);
    if (!m) continue;
    const [, no, sev, , file, quoteRaw] = m;
    if (sev === 'P3') continue;
    const q = norm(quoteRaw); if (q.length < 6 || SKIP.test(q)) continue;
    total++;
    const inPack = file.includes('guidance');
    const hay = inPack ? packText : (cols[(file.match(/\/(\d{3})-/) || [])[1] ?? ''] ?? allCols);
    if (hay.includes(q) || allCols.includes(q) || packText.includes(q)) left.push(`${part}#${no} ${sev} ${file.trim().slice(0, 28)} :: ${q.slice(0, 90)}`);
  }
}
console.log(`${loc}: rows=${total} still-verbatim=${left.length} (${Math.round((100 * (total - left.length)) / Math.max(total, 1))}% addressed)`);
for (const l of left) console.log('  ' + l);
