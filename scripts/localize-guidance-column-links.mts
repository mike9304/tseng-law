/**
 * Rewrites Korean landing/detail links inside guidance-locale columns onto the
 * locale's own core pages (same map as GUIDANCE_HREF_TRANSFORMS in the checker)
 * and relabels them with that page's title from the guidance pack.
 *
 *   npx tsx scripts/localize-guidance-column-links.mts [--dry-run]
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { guidanceContent } from '../src/data/international-guidance-content';
import { GUIDANCE_LOCALES_4, type GuidancePageKey } from '../src/lib/public-guidance';

const MAP: ReadonlyArray<readonly [RegExp, GuidancePageKey]> = [
  [/^\/ko\/korean-lawyer-in-taiwan$/, 'lawyers'],
  [/^\/ko\/lawyers\/wei-tseng$/, 'lawyers'],
  [/^\/ko\/taiwan-lawyer$/, 'about'],
  [/^\/ko\/taiwan-litigation-lawyer$/, 'pricing'],
  [/^\/ko\/services\/[a-z-]+$/, 'services'],
  [/^\/ko\/guides\/taiwan-company-setup$/, 'services'],
  [/^\/ko\/taiwan-company-setup-lawyer$/, 'contact'],
];

const dryRun = process.argv.includes('--dry-run');
const BLOG_BASICS = 'https://www.wei-wei-lawyer.com/post/%EB%8C%80%EB%A7%8C-%ED%9A%8C%EC%82%AC%EC%84%A4%EB%A6%BD-%EA%B8%B0%EC%B4%88%ED%8E%B8';
const LINK_RE = /\[([^\]\n]+)\]\(((?:\/ko\/[^)\s]+)|https:\/\/www\.wei-wei-lawyer\.com\/post\/[^)\s]+)\)/g;
let total = 0;
const perLocale: Record<string, number> = {};
const leftovers: string[] = [];

for (const locale of GUIDANCE_LOCALES_4) {
  const dir = path.join('src/content', `columns-${locale}`);
  const pack = guidanceContent[locale];
  for (const name of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const file = path.join(dir, name);
    const before = readFileSync(file, 'utf8');
    let count = 0;
    const after = before.replace(LINK_RE, (whole, label: string, href: string) => {
      if (href === BLOG_BASICS) {
        count += 1;
        return `[${label}](/${locale}/columns/taiwan-company-establishment-basics)`;
      }
      if (href.startsWith('https://')) return whole; // other blog links: leave (reported by the checker if unexpected)
      const columnMatch = href.match(/^\/ko\/columns\/(.+)$/);
      if (columnMatch) {
        count += 1;
        return `[${label}](/${locale}/columns/${columnMatch[1]})`;
      }
      const rule = MAP.find(([re]) => re.test(href));
      if (!rule) {
        leftovers.push(`${file}: ${href}`);
        return whole;
      }
      const pageKey = rule[1];
      const title = pack.pages[pageKey].title.trim();
      count += 1;
      return `[${title}](/${locale}/${pageKey})`;
    });
    if (count && !dryRun) writeFileSync(file, after, 'utf8');
    total += count;
    perLocale[locale] = (perLocale[locale] ?? 0) + count;
  }
}
console.log(`${dryRun ? '[dry-run] ' : ''}rewritten links: ${total}`, JSON.stringify(perLocale));
if (leftovers.length) console.log('unmapped /ko/ links:', leftovers);
