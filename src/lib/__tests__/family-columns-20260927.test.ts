import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';
import { collectColumnSitemapRecords } from '@/lib/column-locales';
import { NATIVE_LOCALE_COLUMN_FILES, expertiseSlugsFor, type NativeColumnLocale } from './native-locale-columns';

const locales = ['ko', 'ja', 'en', 'vi', 'id', 'th', 'fil', 'zh-hant', 'zh-hans'] as const;
const slugs = [
  'marrying-taiwanese-national-registration-checklist',
  'baby-taiwan-nationality-birth-registration',
];

const FEATURED_NUMBER: Record<string, string> = {
  'taiwanese-spouse-divorce-agreement-registration': '019',
  'taiwanese-spouse-divorce-from-abroad': '020',
  'taiwanese-spouse-divorce-cross-border-parenting': '021',
  'marrying-taiwanese-national-registration-checklist': '022',
  'baby-taiwan-nationality-birth-registration': '023',
};

const UNCHANGED_PASS = new Set([
  'ja/baby-taiwan-nationality-birth-registration',
  'fil/marrying-taiwanese-national-registration-checklist',
]);

// Columns rewritten after the 2026-09-28 review carry their own later revision date.
const REWRITTEN_LASTMOD: Record<string, string> = {
  // ja 022 was rewritten for natural style on 2026-10-06.
  'ja/marrying-taiwanese-national-registration-checklist': '2026-10-06',
};

// Revised columns in locales without a separate `published` field were re-dated to
// 2026-09-28 (user decision 2026-09-28); locales with `published` keep 2026-09-27.
const REDATED_PUBLICATION = new Set([
  ...['ko', 'en', 'zh-hant'].flatMap((locale) => slugs.map((slug) => `${locale}/${slug}`)),
]);

// The eight 2026-09-29 gap columns (024-031) sit ahead of the divorce columns in the
// newest-first archive of the four locales that received them.
const GAP_COLUMN_LOCALES = new Set(['ko', 'ja', 'en', 'zh-hant']);
const GAP_COLUMN_COUNT = 8;

describe('native marriage and birth columns September 2026', () => {
  it.each(locales)('loads two dated, independently authored articles with FAQ and contact in %s', (locale) => {
    // The 2026-09-30 expertise columns (041-048) lead; the gap columns (024-031, ko/ja/en/zh-hant)
    // and the single-locale native columns (032-040) share the 2026-09-29 date, so equal-date
    // source order puts them ahead of the September 27-28 batches.
    const posts = getAllColumnPosts(locale);
    const nativeCount = locale in NATIVE_LOCALE_COLUMN_FILES
      ? NATIVE_LOCALE_COLUMN_FILES[locale as NativeColumnLocale].length
      : 0;
    const offset =
      expertiseSlugsFor(locale).length + (GAP_COLUMN_LOCALES.has(locale) ? GAP_COLUMN_COUNT : 0) + nativeCount + 3;
    expect(posts.slice(offset, offset + 2).map(post => post.slug)).toEqual(slugs);
    for (const slug of slugs) {
      const post = getColumnPost(slug, locale);
      expect(post, `${locale}/${slug}`).toBeDefined();
      expect(post?.publicationDate).toBe(REDATED_PUBLICATION.has(`${locale}/${slug}`) ? '2026-09-28' : '2026-09-27');
      expect(post?.dateDisplay).not.toBe('');
      expect(post?.content.length).toBeGreaterThan(800);
      expect(post?.faq?.length).toBeGreaterThanOrEqual(2);
      expect(post?.content).toContain('mailto:wei@hoveringlaw.com.tw');
      expect(post?.content).toContain('曾雋崴');
      expect(post?.content).not.toContain('02-2992-9304');
      // Each column has its own topic-appropriate hero image (no shared wedding-ring photo).
      const number = post?.slug ? FEATURED_NUMBER[post.slug] : undefined;
      expect(post?.featuredImage).toBe(`/images/blog/${number}-${slug}/featured-01.webp`);
      expect(post?.summary.length).toBeGreaterThanOrEqual(150);
      expect(post?.summary.length).toBeLessThanOrEqual(160);
      const sources = [...(post?.content ?? '').matchAll(/\]\((https:\/\/[^)]+)\)/g)];
      expect(sources.length).toBeGreaterThanOrEqual(2);
      expect(post?.category).toBe('legal');
    }
  });

  it('includes exactly the nine authored locales in sitemap alternates for each new article', () => {
    const records = collectColumnSitemapRecords({
      postsForLocale: locale => getAllColumnPosts(locale).filter(post => slugs.includes(post.slug)),
    });
    expect(records).toHaveLength(18);
    for (const record of records) {
      expect(record.alternateLocales.slice().sort()).toEqual([...locales].sort());
      // Columns revised after the 2026-09-28 Fable review carry the revision date;
      // the review's unchanged PASS files keep the original date.
      const slug = record.path.replace('/columns/', '');
      const key = `${record.locale}/${slug}`;
      const expectedLastModified = REWRITTEN_LASTMOD[key] ?? (UNCHANGED_PASS.has(key) ? '2026-09-27' : '2026-09-28');
      expect(record.lastModified).toBe(expectedLastModified);
    }
  });
});
