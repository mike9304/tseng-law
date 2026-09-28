import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';
import { collectColumnSitemapRecords } from '@/lib/column-locales';

const locales = ['ko', 'ja', 'en', 'vi', 'id', 'th', 'fil', 'zh-hant', 'zh-hans'] as const;
const slugs = [
  'taiwanese-spouse-divorce-agreement-registration',
  'taiwanese-spouse-divorce-from-abroad',
  'taiwanese-spouse-divorce-cross-border-parenting',
];

const UNCHANGED_PASS = new Set([
  'ja/taiwanese-spouse-divorce-cross-border-parenting',
  'th/taiwanese-spouse-divorce-cross-border-parenting',
  'fil/taiwanese-spouse-divorce-from-abroad',
]);

describe('native divorce columns September 2026', () => {
  it.each(locales)('loads three dated, independently authored articles with FAQ and contact in %s', (locale) => {
    const posts = getAllColumnPosts(locale);
    expect(posts.slice(0, 3).map(post => post.slug)).toEqual(slugs);
    for (const slug of slugs) {
      const post = getColumnPost(slug, locale);
      expect(post, `${locale}/${slug}`).toBeDefined();
      expect(post?.publicationDate).toBe('2026-09-27');
      expect(post?.dateDisplay).not.toBe('');
      expect(post?.content.length).toBeGreaterThan(800);
      expect(post?.faq?.length).toBeGreaterThanOrEqual(2);
      expect(post?.content).toContain('mailto:wei@hoveringlaw.com.tw');
      expect(post?.content).toContain('曾雋崴');
      expect(post?.content).not.toContain('02-2992-9304');
      expect(post?.featuredImage).toBe('/images/blog/007-taiwan-divorce-lawsuit-qna/featured-01.jpg');
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
