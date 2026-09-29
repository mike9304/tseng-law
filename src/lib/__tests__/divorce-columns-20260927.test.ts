import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';
import { collectColumnSitemapRecords } from '@/lib/column-locales';

const locales = ['ko', 'ja', 'en', 'vi', 'id', 'th', 'fil', 'zh-hant', 'zh-hans'] as const;
const slugs = [
  'taiwanese-spouse-divorce-agreement-registration',
  'taiwanese-spouse-divorce-from-abroad',
  'taiwanese-spouse-divorce-cross-border-parenting',
];

const FEATURED_NUMBER: Record<string, string> = {
  'taiwanese-spouse-divorce-agreement-registration': '019',
  'taiwanese-spouse-divorce-from-abroad': '020',
  'taiwanese-spouse-divorce-cross-border-parenting': '021',
  'marrying-taiwanese-national-registration-checklist': '022',
  'baby-taiwan-nationality-birth-registration': '023',
};

const UNCHANGED_PASS = new Set([
  'ja/taiwanese-spouse-divorce-cross-border-parenting',
  'th/taiwanese-spouse-divorce-cross-border-parenting',
  'fil/taiwanese-spouse-divorce-from-abroad',
]);

// Revised columns in locales without a separate `published` field were re-dated to
// 2026-09-28 (user decision 2026-09-28); locales with `published` keep 2026-09-27.
const REDATED_PUBLICATION = new Set([
  ...['ko', 'en', 'zh-hant', 'zh-hans'].flatMap((locale) => slugs.map((slug) => `${locale}/${slug}`)),
  'ja/taiwanese-spouse-divorce-agreement-registration',
  'ja/taiwanese-spouse-divorce-from-abroad',
]);

// The eight 2026-09-29 gap columns (024-031) sit ahead of these in the newest-first
// archive of the four locales that received them.
const GAP_COLUMN_LOCALES = new Set(['ko', 'ja', 'en', 'zh-hant']);
const GAP_COLUMN_COUNT = 8;

describe('native divorce columns September 2026', () => {
  it.each(locales)('loads three dated, independently authored articles with FAQ and contact in %s', (locale) => {
    const posts = getAllColumnPosts(locale);
    const offset = GAP_COLUMN_LOCALES.has(locale) ? GAP_COLUMN_COUNT : 0;
    expect(posts.slice(offset, offset + 3).map(post => post.slug)).toEqual(slugs);
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
      expect(post?.summary).toBeTruthy();
      expect(post?.category).toBe('legal');
    }
  });

  it('includes exactly the nine authored locales in sitemap alternates for each new article', () => {
    const records = collectColumnSitemapRecords({
      postsForLocale: locale => getAllColumnPosts(locale).filter(post => slugs.includes(post.slug)),
    });
    expect(records).toHaveLength(27);
    for (const record of records) {
      expect(record.alternateLocales.slice().sort()).toEqual([...locales].sort());
      // Columns revised after the 2026-09-28 Fable review carry the revision date;
      // the review's unchanged PASS files keep the original date.
      const slug = record.path.replace('/columns/', '');
      expect(record.lastModified).toBe(UNCHANGED_PASS.has(`${record.locale}/${slug}`) ? '2026-09-27' : '2026-09-28');
    }
  });
});
