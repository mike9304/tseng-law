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

/** Local content contract for ISSUE-20261123; shipping requires the lane's Claude Code review. */
const EXPECTED: Partial<Record<IssueBoardLocale, number[]>> = {
  ko: [1, 2],
  ja: [3, 4],
  en: [5, 6],
  vi: [7, 8],
};

function issueFiles(locale: IssueBoardLocale): string[] {
  const dir = path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale);
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => file.startsWith('ISSUE-20261123-') && file.endsWith('.md')).sort()
    : [];
}

const cases = ISSUE_BOARD_LOCALES.flatMap((locale) =>
  issueFiles(locale).map((file) => ({ locale, file, slug: issueSlugFromFilename(file) })),
);

describe('issue board 2026-11-23', () => {
  const expertiseSlugsByLocale = {} as Record<PublicLocale8, Set<string>>;

  beforeAll(() => {
    for (const locale of PUBLIC_LOCALES_8) {
      expertiseSlugsByLocale[locale] = new Set(getAllColumnPosts(locale).map((post) => post.slug));
    }
  }, 30_000);

  it('keeps available batch files in their assigned markets without duplicate IDs', () => {
    for (const locale of ISSUE_BOARD_LOCALES) {
      const numbers = issueFiles(locale).map((file) => Number(file.match(/^ISSUE-\d{8}-(\d{2})-/)?.[1]));
      for (const number of numbers) {
        expect(EXPECTED[locale] ?? [], `${locale}: ${number}`).toContain(number);
      }
    }
    expect(cases.length).toBeGreaterThan(0);
    expect(new Set(cases.map(({ file }) => issueIdFromFilename(file))).size).toBe(cases.length);
  });

  it.each(cases)('$locale/$file has clean slug, frontmatter, media and no bold', ({ locale, file, slug }) => {
    expect(issueIdFromFilename(file)).toMatch(/^ISSUE-20261123-\d{2}$/);
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const raw = fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale, file), 'utf8');
    const { data } = matter(raw);
    expect(data.published).toBe('2026-11-23');
    expect(data.lastmod).toBe('2026-11-23');
    expect(data.audience).toEqual([locale]);
    expect(data.author).toBe('legal-ai-assistant');
    expect(Array.isArray(data.faq) && data.faq.length).toBe(3);
    expect(raw).not.toMatch(/\*\*|__[^\n]+__|<strong\b|<b\b/i);
    for (const field of ['title', 'seoTitle', 'summary', 'date_display', 'read_time', 'topic', 'featured_image_alt', 'featured_image_caption']) {
      expect(typeof data[field] === 'string' && data[field].trim().length > 0, field).toBe(true);
    }
    for (const field of ['featured_image', 'social_image']) {
      const media = String(data[field]).replace(/^\.\.\/images\//, 'public/images/blog/');
      expect(fs.existsSync(path.join(process.cwd(), media)), media).toBe(true);
    }
  });

  it.each(cases)('$locale/$slug loads on the issue board only', ({ locale, slug }) => {
    const post = getIssuePost(slug, locale);
    expect(post).toBeDefined();
    expect(post?.publicationDate).toBe('2026-11-23');
    expect(isAiAuthoredColumn(post)).toBe(true);
    for (const other of PUBLIC_LOCALES_8) {
      expect(expertiseSlugsByLocale[other].has(slug), `${other}/${slug}`).toBe(false);
    }
  });
});
