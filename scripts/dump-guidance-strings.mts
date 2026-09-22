// Dump every guidance-pack string of a locale as "path → text" for native review input.
// usage: npx tsx scripts/dump-guidance-strings.mts <loc>[,<loc>...]
import { writeFileSync } from 'node:fs';
import { guidanceContent } from '../src/data/international-guidance-content';
import { guidanceLanguageNames, guidanceTeamBios, guidanceTeamCopy, guidancePracticeAreaNames } from '../src/data/international-guidance-team';
import { guidanceOfficeCopy, guidanceFooterCopy } from '../src/data/international-guidance-offices';
import { internationalInquiryCopy } from '../src/data/international-inquiry-copy';
import { guidanceAnswers } from '../src/data/international-guidance-answers';
import { GUIDANCE_LLMS_NOTICES } from '../src/lib/llms-txt';
const srcs: Record<string, any> = { guidanceContent, guidanceTeamCopy, guidanceTeamBios, guidanceLanguageNames, guidancePracticeAreaNames, guidanceOfficeCopy, guidanceFooterCopy, internationalInquiryCopy, guidanceAnswers, GUIDANCE_LLMS_NOTICES };
const walk = (v: any, p: string, out: [string, string][]) => { if (typeof v === 'string') out.push([p, v]); else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, out)); else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${p}.${k}`, out)); };
const today = new Date().toISOString().slice(0, 10);
for (const loc of process.argv[2].split(',')) {
  const out: [string, string][] = [];
  for (const [name, src] of Object.entries(srcs)) if (src && src[loc]) walk(src[loc], `${name}.${loc}`, out);
  const body = out.map(([p, s]) => `${p}\n    ${s.replace(/\n/g, '\n    ')}\n`).join('\n');
  writeFileSync(`docs/i18n/global-plan/reviews/native/input/${loc}-guidance.txt`, `# ${loc} guidance pack strings (path → text). Generated ${today}\n\n${body}`);
  console.log(loc, out.length);
}
