import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  ISSUE_BOARD_LOCALES,
  ISSUE_CONTENT_ROOT,
  getAllColumnPosts,
  getIssuePost,
  issueIdFromFilename,
  issueSlugFromFilename,
  type IssueBoardLocale,
} from '@/lib/columns';
import { PUBLIC_LOCALES_8, type PublicLocale8 } from '@/lib/public-guidance';
import { isAiAuthoredColumn } from '@/lib/ai-authored-columns';

/** ISSUE-20261017 content fixtures; publication remains subject to the lane's review. */
const EXPECTED: Record<IssueBoardLocale, number[]> = {
  ko: [1, 2],
  ja: [3, 4],
  'zh-hant': [],
  en: [5, 6],
  vi: [7, 8],
};

function issueFiles(locale: IssueBoardLocale): string[] {
  const dir = path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale);
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => file.startsWith('ISSUE-20261017-') && file.endsWith('.md')).sort()
    : [];
}

const cases = ISSUE_BOARD_LOCALES.flatMap((locale) =>
  issueFiles(locale).map((file) => ({ locale, file, slug: issueSlugFromFilename(file) })),
);

describe('issue board 2026-10-17', () => {
  const expertiseSlugsByLocale = {} as Record<PublicLocale8, Set<string>>;

  beforeAll(() => {
    for (const locale of PUBLIC_LOCALES_8) {
      expertiseSlugsByLocale[locale] = new Set(getAllColumnPosts(locale).map((post) => post.slug));
    }
  }, 30_000);

  it('contains two pieces for each requested market, scoped to this batch', () => {
    for (const locale of ISSUE_BOARD_LOCALES) {
      const numbers = issueFiles(locale).map((file) => Number(file.match(/^ISSUE-\d{8}-(\d{2})-/)?.[1]));
      expect(numbers, locale).toEqual(EXPECTED[locale]);
    }
    expect(cases).toHaveLength(8);
  });

  it.each(cases)('$locale/$file has complete frontmatter, a disclosed image and source links', ({ locale, file, slug }) => {
    expect(issueIdFromFilename(file)).toMatch(/^ISSUE-20261017-\d{2}$/);
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const raw = fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale, file), 'utf8');
    const { data, content } = matter(raw);
    for (const key of ['title', 'seoTitle', 'summary', 'date_display', 'read_time', 'topic', 'featured_image_alt', 'featured_image_caption']) {
      expect(typeof data[key], `${file}: ${key}`).toBe('string');
      expect(data[key].trim().length, `${file}: ${key}`).toBeGreaterThan(0);
    }
    expect(data.published).toBe('2026-10-17');
    expect(data.lastmod).toBe('2026-10-17');
    expect(data.audience).toEqual([locale]);
    expect(data.author).toBe('legal-ai-assistant');
    expect(Array.isArray(data.categories) && data.categories.length > 0).toBe(true);
    expect(Array.isArray(data.faq) && data.faq.length).toBe(3);
    for (const faq of data.faq) {
      expect(faq.q.trim().length).toBeGreaterThan(0);
      expect(faq.a.trim().length).toBeGreaterThan(0);
    }
    expect(raw).not.toMatch(/\*\*|__[^\n]+__|<strong\b|<b\b/i);
    expect(data.featured_image).toBe(`../images/${file.replace(/\.md$/, '')}/featured-01.webp`);
    const image = String(data.featured_image).replace(/^\.\.\/images\//, 'public/images/blog/');
    expect(fs.existsSync(path.join(process.cwd(), image)), image).toBe(true);
    expect(data.social_image).toBe(`../images/${file.replace(/\.md$/, '')}/featured-01.jpg`);
    const socialImage = String(data.social_image).replace(/^\.\.\/images\//, 'public/images/blog/');
    expect(fs.existsSync(path.join(process.cwd(), socialImage)), socialImage).toBe(true);
    // The issue page currently renders the frontmatter caption only for Vietnamese.
    // The other locales therefore retain a public image disclosure in the body.
    if (locale !== 'vi') expect(content).toMatch(/AI/);
    const urls = [...content.matchAll(/\]\((https:\/\/[^\s)]+)\)/g)].map((match) => new URL(match[1]));
    expect(urls.some((url) => url.hostname === 'law.moj.gov.tw'
      && url.pathname === '/LawClass/LawSingle.aspx'
      && url.searchParams.has('pcode') && url.searchParams.has('flno'))).toBe(true);
    expect(urls.some((url) => url.hostname !== 'law.moj.gov.tw' && url.hostname !== 'tseng-law.com')).toBe(true);
  });

  it.each(cases)('$locale/$slug loads with its image and stays off the expertise board', ({ locale, file, slug }) => {
    const post = getIssuePost(slug, locale);
    expect(post).toBeDefined();
    expect(post?.publicationDate).toBe('2026-10-17');
    expect(post?.featuredImage).toBe(`/images/blog/${file.replace(/\.md$/, '')}/featured-01.webp`);
    expect(isAiAuthoredColumn(post)).toBe(true);
    for (const other of PUBLIC_LOCALES_8) {
      expect(expertiseSlugsByLocale[other].has(slug), `${other}/${slug}`).toBe(false);
    }
  });
});
