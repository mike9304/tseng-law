import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import {
  ISSUE_BOARD_LOCALES,
  ISSUE_CONTENT_ROOT,
  getAllColumnPosts,
  getAllIssuePosts,
  getIssuePost,
  issueIdFromFilename,
  issueSlugFromFilename,
  type IssueBoardLocale,
} from '@/lib/columns';
import { PUBLIC_LOCALES_8 } from '@/lib/public-guidance';
import { isAiAuthoredColumn } from '@/lib/ai-authored-columns';
import { isColumnTopic } from '@/lib/column-topics';

// Scope the inventory to this batch so future issues do not change its count.
const EXPECTED: Record<IssueBoardLocale, number[]> = {
  ko: [1, 2, 9],
  ja: [3, 4, 10, 11],
  'zh-hant': [13],
  en: [5, 6, 14],
  vi: [7, 8, 12],
};

function issueFiles(locale: IssueBoardLocale): string[] {
  const dir = path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale);
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => file.startsWith('ISSUE-20261014-') && file.endsWith('.md')).sort()
    : [];
}

const cases = ISSUE_BOARD_LOCALES.flatMap((locale) =>
  issueFiles(locale).map((file) => ({ locale, file, slug: issueSlugFromFilename(file) })),
);

function readIssue(locale: IssueBoardLocale, file: string) {
  const raw = fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale, file), 'utf8');
  return { raw, ...matter(raw) };
}

describe('issue board 2026-10-14', () => {
  it('contains exactly fourteen issue IDs in their assigned markets', () => {
    for (const locale of ISSUE_BOARD_LOCALES) {
      const numbers = issueFiles(locale).map((file) => Number(file.match(/^ISSUE-20261014-(\d{2})-/)?.[1]));
      expect(numbers, locale).toEqual(EXPECTED[locale as keyof typeof EXPECTED] ?? []);
    }
    expect(cases).toHaveLength(14);
    expect(new Set(cases.map(({ file }) => issueIdFromFilename(file))).size).toBe(14);
  });

  it.each(cases)('$locale/$file preserves publication metadata, provenance and three FAQs', ({ locale, file, slug }) => {
    expect(issueIdFromFilename(file)).toMatch(/^ISSUE-20261014-\d{2}$/);
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const { raw, data, content } = readIssue(locale, file);
    for (const field of ['title', 'seoTitle', 'summary', 'date_display', 'read_time', 'featured_image_alt', 'featured_image_caption']) {
      expect(typeof data[field] === 'string' && data[field].trim().length > 0, field).toBe(true);
    }
    expect(data.published).toBe('2026-10-14');
    expect(data.lastmod).toBe('2026-10-14');
    expect(data.audience).toEqual([locale]);
    expect(data.author).toBe('legal-ai-assistant');
    expect(isColumnTopic(data.topic), String(data.topic)).toBe(true);
    expect(Array.isArray(data.categories)).toBe(true);
    expect(data.categories.length).toBeGreaterThan(0);
    for (const category of data.categories) {
      expect(typeof category === 'string' && category.trim().length > 0).toBe(true);
    }
    expect(Array.isArray(data.faq)).toBe(true);
    expect(data.faq).toHaveLength(3);
    for (const faq of data.faq) {
      expect(typeof faq.q === 'string' && faq.q.trim().length > 0).toBe(true);
      expect(typeof faq.a === 'string' && faq.a.trim().length > 0).toBe(true);
    }
    expect(content.trim().length).toBeGreaterThan(0);
    expect(raw).not.toMatch(/\*\*|__[\s\S]+?__|<\/?(?:strong|b)(?:\s|>)/i);
  });

  it.each(cases)('$locale/$file links to reporting and individual MOJ articles', ({ locale, file }) => {
    const { content } = readIssue(locale, file);
    const urls = [...content.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map((match) => new URL(match[1]));
    // Citation presence is mechanical; source accuracy and recency need editorial review.
    expect(urls.some((url) =>
      url.hostname !== 'law.moj.gov.tw'
      && url.hostname !== 'judgment.judicial.gov.tw'
      && url.hostname !== 'tseng-law.com'
      && !url.hostname.endsWith('.tseng-law.com'),
    )).toBe(true);
    expect(urls.some((url) =>
      url.hostname === 'law.moj.gov.tw'
      && /^\/(?:ENG\/)?LawClass\/LawSingle\.aspx$/i.test(url.pathname)
      && /^[a-z]\d{7}$/i.test(url.searchParams.get('pcode') ?? '')
      && /^\d+(?:-\d+)?$/.test(url.searchParams.get('flno') ?? ''),
    )).toBe(true);
  });

  it.each(cases)('$locale/$file has its own WebP hero and JPEG companion', ({ locale, file }) => {
    const { data } = readIssue(locale, file);
    const directory = file.replace(/\.md$/, '');
    expect(data.featured_image).toBe(`../images/${directory}/featured-01.webp`);
    expect(data.social_image).toBe(`../images/${directory}/featured-01.jpg`);
    const assetDir = path.join(process.cwd(), 'public/images/blog', directory);
    for (const asset of ['featured-01.webp', 'featured-01.jpg']) {
      const stat = fs.statSync(path.join(assetDir, asset));
      expect(stat.isFile(), asset).toBe(true);
      expect(stat.size, asset).toBeGreaterThan(0);
    }
    const webp = fs.readFileSync(path.join(assetDir, 'featured-01.webp'));
    const jpeg = fs.readFileSync(path.join(assetDir, 'featured-01.jpg'));
    expect(webp.subarray(0, 4).toString()).toBe('RIFF');
    expect(webp.subarray(8, 12).toString()).toBe('WEBP');
    expect([...jpeg.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
    // Media review separately verifies that the two renditions show the same scene.
  });

  it.each(cases)('$locale/$slug loads with its metadata on the issue board only', ({ locale, file, slug }) => {
    const { data } = readIssue(locale, file);
    const post = getIssuePost(slug, locale);
    const imageDirectory = `/images/blog/${file.replace(/\.md$/, '')}`;
    expect(post).toMatchObject({
      title: data.title,
      seoTitle: data.seoTitle,
      summary: data.summary,
      publicationDate: '2026-10-14',
      date: '2026-10-14',
      readTime: data.read_time,
      topic: data.topic,
      audience: [locale],
      faq: data.faq,
      featuredImage: `${imageDirectory}/featured-01.webp`,
      featuredImageAlt: data.featured_image_alt,
      featuredImageCaption: data.featured_image_caption,
      socialImage: `${imageDirectory}/featured-01.jpg`,
    });
    expect(isAiAuthoredColumn(post)).toBe(true);
    expect(getAllIssuePosts(locale).filter((candidate) => candidate.slug === slug)).toHaveLength(1);
    for (const other of ISSUE_BOARD_LOCALES) {
      if (other !== locale) expect(getIssuePost(slug, other), `${other}/${slug}`).toBeUndefined();
    }
    for (const other of PUBLIC_LOCALES_8) {
      expect(getAllColumnPosts(other).some((candidate) => candidate.slug === slug), `${other}/${slug}`).toBe(false);
    }
  });
});
