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
import { COLUMN_TOPICS } from '@/lib/column-topics';

/** Pieces may land separately after review; validate every batch file present. */
const ALLOWED_NUMBERS: Partial<Record<IssueBoardLocale, number[]>> = {
  ko: [1],
  ja: [3],
  'zh-hant': [5],
  en: [6],
  vi: [8, 9],
};

function issueFiles(locale: IssueBoardLocale): string[] {
  const dir = path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale);
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => file.startsWith('ISSUE-20261026-') && file.endsWith('.md')).sort()
    : [];
}

const cases = ISSUE_BOARD_LOCALES.flatMap((locale) =>
  issueFiles(locale).map((file) => ({ locale, file, slug: issueSlugFromFilename(file) })),
);

describe('issue board 2026-10-26', () => {
  const expertiseSlugsByLocale = {} as Record<PublicLocale8, Set<string>>;

  beforeAll(() => {
    for (const locale of PUBLIC_LOCALES_8) {
      expertiseSlugsByLocale[locale] = new Set(getAllColumnPosts(locale).map((post) => post.slug));
    }
  }, 30_000);

  it('validates batch IDs without requiring unshipped pieces', () => {
    for (const locale of ISSUE_BOARD_LOCALES) {
      const numbers = issueFiles(locale).map((file) => Number(file.match(/^ISSUE-\d{8}-(\d{2})-/)?.[1]));
      expect(new Set(numbers).size, `${locale}: duplicate batch IDs`).toBe(numbers.length);
      for (const number of numbers) {
        expect(ALLOWED_NUMBERS[locale] ?? [], `${locale}: unexpected batch ID ${number}`).toContain(number);
      }
    }
  });

  it.each(cases)('$locale/$file has complete metadata, valid images and source links', ({ locale, file, slug }) => {
    expect(issueIdFromFilename(file)).toMatch(/^ISSUE-20261026-\d{2}$/);
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const raw = fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale, file), 'utf8');
    const { data, content } = matter(raw);
    for (const key of ['title', 'seoTitle', 'summary', 'date_display', 'read_time', 'featured_image_alt', 'featured_image_caption']) {
      expect(typeof data[key], `${file}: ${key}`).toBe('string');
      expect(data[key].trim().length, `${file}: ${key}`).toBeGreaterThan(0);
    }
    expect(data.published).toBe('2026-10-26');
    expect(data.lastmod).toBe('2026-10-26');
    expect(data.audience).toEqual([locale]);
    expect(data.author).toBe('legal-ai-assistant');
    expect(COLUMN_TOPICS).toContain(data.topic);
    expect(Array.isArray(data.categories) && data.categories.length > 0).toBe(true);
    expect(Array.isArray(data.faq) && data.faq.length).toBe(3);
    for (const faq of data.faq) {
      expect(faq.q.trim().length).toBeGreaterThan(0);
      expect(faq.a.trim().length).toBeGreaterThan(0);
    }
    expect(raw).not.toMatch(/\*\*|__[^\n]+__|<strong\b|<b\b/i);
    expect(content).not.toMatch(/\/Users\/|\bTODO\b|\bFIXME\b/);

    const imageDir = file.replace(/\.md$/, '');
    expect(data.featured_image).toBe(`../images/${imageDir}/featured-01.webp`);
    expect(data.social_image).toBe(`../images/${imageDir}/featured-01.jpg`);
    const webp = fs.readFileSync(path.join(process.cwd(), 'public/images/blog', imageDir, 'featured-01.webp'));
    const jpeg = fs.readFileSync(path.join(process.cwd(), 'public/images/blog', imageDir, 'featured-01.jpg'));
    expect(webp.subarray(0, 4).toString()).toBe('RIFF');
    expect(webp.subarray(8, 12).toString()).toBe('WEBP');
    expect([...jpeg.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);

    const urls = [...content.matchAll(/\]\((https:\/\/[^\s)]+)\)/g)].map((match) => new URL(match[1]));
    expect(urls.some((url) => url.hostname === 'law.moj.gov.tw'
      && url.pathname === '/LawClass/LawSingle.aspx'
      && url.searchParams.has('pcode') && url.searchParams.has('flno'))).toBe(true);
    expect(urls.some((url) => url.hostname !== 'law.moj.gov.tw' && url.hostname !== 'tseng-law.com')).toBe(true);
  });

  it.each(cases)('$locale/$slug loads only on the issue board with its media metadata', ({ locale, file, slug }) => {
    const post = getIssuePost(slug, locale);
    const { data } = matter(fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale, file), 'utf8'));
    const imageDir = file.replace(/\.md$/, '');
    expect(post).toBeDefined();
    expect(post?.publicationDate).toBe('2026-10-26');
    expect(post?.featuredImage).toBe(`/images/blog/${imageDir}/featured-01.webp`);
    expect(post?.socialImage).toBe(`/images/blog/${imageDir}/featured-01.jpg`);
    expect(post?.featuredImageAlt).toBe(data.featured_image_alt);
    expect(post?.featuredImageCaption).toBe(data.featured_image_caption);
    expect(isAiAuthoredColumn(post)).toBe(true);
    // KO, JA, EN and ZH-HANT layouts do not render the frontmatter caption above the body.
    if (locale !== 'vi') expect(post?.content).toContain(data.featured_image_caption);
    for (const other of PUBLIC_LOCALES_8) {
      expect(expertiseSlugsByLocale[other].has(slug), `${other}/${slug}`).toBe(false);
    }
  });
});
