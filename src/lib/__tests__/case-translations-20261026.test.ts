import { describe, expect, it } from 'vitest';
import { filterMarketBoardColumns } from '@/data/market-column-curation';
import { columnAlternateLocales, publicColumnSwitcherData } from '@/lib/column-language-links';
import { getAllColumnPosts } from '@/lib/columns';
import { columnLanguageLinksFromIndex, type PublicLocale8 } from '@/lib/public-guidance';
import { buildAbsoluteUrl, getLanguageAlternates } from '@/lib/seo';
import { archiveLeadPublicationDate, archiveLeadSlugsFor, expertiseSlugsFor } from './native-locale-columns';

const TRANSLATIONS = ['de', 'it', 'ar', 'pt', 'hi', 'ms', 'ru'] as const;
// Independently pin the release contract, rather than deriving it from the test registry.
const CASES = [
  { slug: 'taiwan-public-contract-mediation-arbitration-same-claim', source: 'en', topic: 'litigation', faqs: 2 },
  { slug: 'taiwan-parent-company-pollution-liability-us-investor', source: 'en', topic: 'company', faqs: 3 },
  { slug: 'taiwan-presale-mortgage-notice-handover-judgment', source: 'zh-hant', topic: 'litigation', faqs: 3 },
  { slug: 'taiwan-workplace-bullying-investigation-hearing-judgment', source: 'zh-hant', topic: 'labor', faqs: 3 },
  { slug: 'taiwan-apartment-ev-charger-common-area-judgment', source: 'zh-hant', topic: 'litigation', faqs: 3 },
  { slug: 'taiwan-online-game-coins-refund-judgment', source: 'zh-hant', topic: 'litigation', faqs: 3 },
] as const;

describe('reviewed case translations published October26', () => {
  it.each(TRANSLATIONS)('%s has all six complete, own-audience cases leading its visible board', (locale) => {
    const posts = getAllColumnPosts(locale);
    const visible = filterMarketBoardColumns(locale, posts);
    const slugs = CASES.map(({ slug }) => slug);
    expect(posts.slice(0, 6).map(({ slug }) => slug)).toEqual(slugs);
    expect(visible.slice(0, 6).map(({ slug }) => slug)).toEqual(slugs);
    expect(archiveLeadSlugsFor(locale).slice(0, 6)).toEqual(slugs);
    expect(expertiseSlugsFor(locale)).toEqual(expect.arrayContaining(slugs));
    for (const item of CASES) {
      const post = posts.find(({ slug }) => slug === item.slug);
      expect(post, item.slug).toMatchObject({ audience: [locale], publicationDate: '2026-10-26', topic: item.topic });
      expect(post?.faq, item.slug).toHaveLength(item.faqs);
      expect(archiveLeadPublicationDate(item.slug, locale)).toBe('2026-10-26');
    }
  });

  it.each(CASES)('$slug retains its original publication date and exactly eight real translations', (item) => {
    const original = getAllColumnPosts(item.source).find(({ slug }) => slug === item.slug);
    expect(original?.publicationDate).toBe('2026-10-25');
    expect(original?.faq).toHaveLength(item.faqs);
    expect(archiveLeadPublicationDate(item.slug, item.source)).toBe('2026-10-25');
    const expected = [item.source, ...TRANSLATIONS].sort();
    const cluster = columnAlternateLocales(item.slug, item.source);
    expect([...cluster].sort()).toEqual(expected);
    const urls = expected.map((locale) => buildAbsoluteUrl(`/${locale}/columns/${item.slug}`));
    const alternates = getLanguageAlternates(`/columns/${item.slug}`, cluster, { xDefaultWithinCluster: true });
    expect(Object.keys(alternates)).toHaveLength(9);
    expect(Object.entries(alternates).filter(([tag]) => tag !== 'x-default').map(([, url]) => url).sort()).toEqual(urls.sort());
    expect(urls).toContain(alternates['x-default']);
    for (const locale of expected as PublicLocale8[]) {
      const pathname = `/${locale}/columns/${item.slug}`;
      const { index } = publicColumnSwitcherData(locale, { staticPathname: pathname });
      const links = columnLanguageLinksFromIndex(pathname, index);
      expect(Object.keys(links ?? {}).sort()).toEqual(expected);
      expect(links).toEqual(Object.fromEntries(expected.map((target) => [target, `/${target}/columns/${item.slug}`])));
    }
  });
});
