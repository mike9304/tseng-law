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

/** Draft batch contract; publication remains subject to the lane's Claude Code review. */
const EXPECTED: Partial<Record<IssueBoardLocale, number[]>> = {
  ko: [1, 2],
  ja: [3, 4],
  en: [5, 6],
  vi: [7, 8],
};

function issueFiles(locale: IssueBoardLocale): string[] {
  const dir = path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale);
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => file.startsWith('ISSUE-20261122-') && file.endsWith('.md')).sort()
    : [];
}

const cases = ISSUE_BOARD_LOCALES.flatMap((locale) =>
  issueFiles(locale).map((file) => ({ locale, file, slug: issueSlugFromFilename(file) })),
);

describe('issue board 2026-11-22', () => {
  const expertiseSlugsByLocale = {} as Record<PublicLocale8, Set<string>>;

  beforeAll(() => {
    for (const locale of PUBLIC_LOCALES_8) {
      expertiseSlugsByLocale[locale] = new Set(getAllColumnPosts(locale).map((post) => post.slug));
    }
  }, 30_000);

  it('contains exactly two pieces for each of the four assigned markets', () => {
    for (const locale of ISSUE_BOARD_LOCALES) {
      const numbers = issueFiles(locale).map((file) => Number(file.match(/^ISSUE-\d{8}-(\d{2})-/)?.[1]));
      expect(numbers, locale).toEqual(EXPECTED[locale] ?? []);
    }
    expect(cases).toHaveLength(8);
  });

  it.each(cases)('$locale/$file has complete frontmatter, source links and image renditions', ({ locale, file, slug }) => {
    expect(issueIdFromFilename(file)).toMatch(/^ISSUE-20261122-\d{2}$/);
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const raw = fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale, file), 'utf8');
    const { data, content } = matter(raw);
    expect(data.published).toBe('2026-11-22');
    expect(data.lastmod).toBe('2026-11-22');
    expect(data.audience).toEqual([locale]);
    expect(data.author).toBe('legal-ai-assistant');
    for (const field of ['title', 'seoTitle', 'summary', 'date_display', 'read_time', 'topic', 'featured_image_alt', 'featured_image_caption']) {
      expect(typeof data[field], field).toBe('string');
      expect(data[field].trim().length, field).toBeGreaterThan(0);
    }
    expect(Array.isArray(data.categories) && data.categories.length > 0).toBe(true);
    expect(Array.isArray(data.faq) && data.faq.length).toBe(3);
    for (const faq of data.faq) {
      expect(faq.q.trim().length).toBeGreaterThan(0);
      expect(faq.a.trim().length).toBeGreaterThan(0);
    }
    expect(raw).not.toMatch(/\*\*|__|<strong\b|<b(?:\s|>)/i);
    expect(content).toMatch(/https:\/\/law\.moj\.gov\.tw\/LawClass\/LawSingle\.aspx\?pcode=[A-Z]\d+&flno=\d/);
    const imageDirectory = `../images/${file.replace(/\.md$/, '')}/`;
    expect(data.featured_image).toBe(`${imageDirectory}featured-01.webp`);
    expect(data.social_image).toBe(`${imageDirectory}featured-01.jpg`);
    for (const reference of [data.featured_image, data.social_image]) {
      const image = reference.replace(/^\.\.\/images\//, 'public/images/blog/');
      expect(fs.existsSync(path.join(process.cwd(), image)), image).toBe(true);
    }
  });

  it.each(cases)('$locale/$slug loads on the issue board with its media and no expertise-board leakage', ({ locale, file, slug }) => {
    const post = getIssuePost(slug, locale);
    const { data } = matter(fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale, file), 'utf8'));
    expect(post).toBeDefined();
    expect(post?.publicationDate).toBe('2026-11-22');
    expect(isAiAuthoredColumn(post)).toBe(true);
    expect(post?.featuredImage).toBe(data.featured_image.replace('../images/', '/images/blog/'));
    expect(post?.featuredImageAlt).toBe(data.featured_image_alt);
    expect(post?.featuredImageCaption).toBe(data.featured_image_caption);
    expect(post?.socialImage).toBe(data.social_image.replace('../images/', '/images/blog/'));
    for (const other of PUBLIC_LOCALES_8) {
      expect(expertiseSlugsByLocale[other].has(slug), `${other}/${slug}`).toBe(false);
    }
  });
});
