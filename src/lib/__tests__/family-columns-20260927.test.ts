import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';
import { collectColumnSitemapRecords } from '@/lib/column-locales';

const locales = ['ko', 'ja', 'en', 'vi', 'id', 'th', 'fil', 'zh-hant', 'zh-hans'] as const;
const slugs = [
  'marrying-taiwanese-national-registration-checklist',
  'baby-taiwan-nationality-birth-registration',
];

const UNCHANGED_PASS = new Set([
  'ja/marrying-taiwanese-national-registration-checklist',
  'ja/baby-taiwan-nationality-birth-registration',
  'fil/marrying-taiwanese-national-registration-checklist',
]);

// Revised columns in locales without a separate `published` field were re-dated to
// 2026-09-28 (user decision 2026-09-28); locales with `published` keep 2026-09-27.
const REDATED_PUBLICATION = new Set([
  ...['ko', 'en', 'zh-hant'].flatMap((locale) => slugs.map((slug) => `${locale}/${slug}`)),
]);

describe('native marriage and birth columns September 2026', () => {
  it.each(locales)('loads two dated, independently authored articles with FAQ and contact in %s', (locale) => {
    const posts = getAllColumnPosts(locale);
    expect(posts.slice(3, 5).map(post => post.slug)).toEqual(slugs);
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
      expect(post?.featuredImage).toBe('/images/blog/007-taiwan-divorce-lawsuit-qna/featured-01.jpg');
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
      expect(record.lastModified).toBe(UNCHANGED_PASS.has(`${record.locale}/${slug}`) ? '2026-09-27' : '2026-09-28');
    }
  });
});
