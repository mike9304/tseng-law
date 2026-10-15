import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { beforeAll, describe, expect, it } from 'vitest';
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
import { PUBLIC_LOCALES_8, type PublicLocale8 } from '@/lib/public-guidance';
import { isAiAuthoredColumn } from '@/lib/ai-authored-columns';
import { isColumnTopic } from '@/lib/column-topics';

// The batch still requires the operator's Claude Code editorial review.
const EXPECTED: Record<IssueBoardLocale, number[]> = {
  ko: [1, 2],
  ja: [3, 4],
  'zh-hant': [],
  en: [5, 6],
  vi: [7, 8],
};

function issueFiles(locale: IssueBoardLocale, prefix = 'ISSUE-20261015-'): string[] {
  const dir = path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale);
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => file.startsWith(prefix) && file.endsWith('.md')).sort()
    : [];
}

const cases = ISSUE_BOARD_LOCALES.flatMap((locale) =>
  issueFiles(locale).map((file) => ({ locale, file, slug: issueSlugFromFilename(file) })),
);

function readIssue(locale: IssueBoardLocale, file: string) {
  const raw = fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale, file), 'utf8');
  return { raw, ...matter(raw) };
}

describe('issue board 2026-10-15', () => {
  const expertiseSlugsByLocale = {} as Record<PublicLocale8, Set<string>>;

  // Reuse real loader results for immutable content fixtures; allow 30s for a cold filesystem.
  beforeAll(() => {
    for (const locale of PUBLIC_LOCALES_8) {
      expertiseSlugsByLocale[locale] = new Set(getAllColumnPosts(locale).map((post) => post.slug));
    }
  }, 30_000);

  it('contains exactly eight issue IDs in their assigned markets', () => {
    for (const locale of ISSUE_BOARD_LOCALES) {
      const numbers = issueFiles(locale).map((file) => Number(file.match(/^ISSUE-20261015-(\d{2})-/)?.[1]));
      expect(numbers, locale).toEqual(EXPECTED[locale]);
    }
    expect(cases).toHaveLength(8);
    expect(new Set(cases.map(({ file }) => issueIdFromFilename(file))).size).toBe(8);
  });

  it('does not reuse an issue slug from any market or batch', () => {
    const allIssueFiles = ISSUE_BOARD_LOCALES.flatMap((locale) =>
      issueFiles(locale, '').map((file) => ({ locale, file, slug: issueSlugFromFilename(file) })),
    );
    for (const { locale, file, slug } of cases) {
      expect(allIssueFiles.filter((candidate) => candidate.slug === slug), `${locale}/${file}`)
        .toEqual([{ locale, file, slug }]);
    }
  });

  it.each(cases)('$locale/$file preserves publication metadata, provenance and three FAQs', ({ locale, file, slug }) => {
    expect(issueIdFromFilename(file)).toMatch(/^ISSUE-20261015-\d{2}$/);
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const { raw, data, content } = readIssue(locale, file);
    for (const field of ['title', 'seoTitle', 'summary', 'date_display', 'read_time', 'featured_image_alt', 'featured_image_caption']) {
      expect(typeof data[field] === 'string' && data[field].trim().length > 0, field).toBe(true);
    }
    expect(data.published).toBe('2026-10-15');
    expect(data.lastmod).toBe('2026-10-15');
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
    // Catch leaked working artifacts without banning ordinary legal vocabulary.
    expect(raw).not.toMatch(/<!--|\/(?:Users|private\/tmp|tmp)\/|\bsrc\/content\/|\b(?:NOTES\.md|SOURCES\.md|queue\.tsv|tests\.txt)\b/);
    expect(raw).not.toMatch(/^(?:#{1,6}\s*)?(?:TODO|FIXME|SOURCE_READY|internal notes?|writer instructions?|편집자 메모|작성자 지시|執筆者メモ|編集メモ|memo nội bộ)(?:\s*[:：]|\s*$)/im);
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
      publicationDate: '2026-10-15',
      date: '2026-10-15',
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
      expect(expertiseSlugsByLocale[other].has(slug), `${other}/${slug}`).toBe(false);
    }
  });
});
