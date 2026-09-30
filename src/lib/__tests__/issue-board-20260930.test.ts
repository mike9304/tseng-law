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
import { issueBoardCopy } from '@/data/issue-board';

/** Issue columns released 2026-09-30 (both final reviews passed; ISSUE-08 held). */
const EXPECTED: Record<IssueBoardLocale, number[]> = {
  ko: [1, 2, 3],
  ja: [4, 5, 6],
  'zh-hant': [7, 9],
  en: [10, 11, 12],
  vi: [13, 14, 15],
};

function issueFiles(locale: IssueBoardLocale): string[] {
  const dir = path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale);
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter((file) => file.endsWith('.md')).sort() : [];
}

const cases = ISSUE_BOARD_LOCALES.flatMap((locale) =>
  issueFiles(locale).map((file) => ({ locale, file, slug: issueSlugFromFilename(file) })),
);

describe('issue board 2026-09-30', () => {
  it('ships exactly the reviewed issue files and never the held ISSUE-08', () => {
    for (const locale of ISSUE_BOARD_LOCALES) {
      const numbers = issueFiles(locale).map((file) => Number(file.match(/^ISSUE-\d{8}-(\d{2})-/)?.[1]));
      expect(numbers, locale).toEqual(EXPECTED[locale]);
    }
    expect(cases).toHaveLength(14);
    expect(cases.some(({ file }) => file.startsWith('ISSUE-20260930-08-'))).toBe(false);
    expect(fs.readdirSync(path.join(process.cwd(), 'public/images/blog'))
      .some((dir) => dir.startsWith('ISSUE-20260930-08-'))).toBe(false);
  });

  it.each(cases)('$locale/$file has clean slug, frontmatter and image', ({ locale, file, slug }) => {
    expect(issueIdFromFilename(file)).toMatch(/^ISSUE-20260930-\d{2}$/);
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const { data } = matter(fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale, file), 'utf8'));
    expect(data.published).toBe('2026-09-30');
    expect(data.audience).toEqual([locale]);
    expect(data.author).toBe('legal-ai-assistant');
    expect(Array.isArray(data.faq) && data.faq.length).toBe(3);
    const image = String(data.featured_image).replace(/^\.\.\/images\//, 'public/images/blog/');
    expect(fs.existsSync(path.join(process.cwd(), image)), image).toBe(true);
  });

  it.each(cases)('$locale/$slug loads on the issue board only', ({ locale, slug }) => {
    const post = getIssuePost(slug, locale);
    expect(post).toBeDefined();
    expect(post?.publicationDate).toBe('2026-09-30');
    expect(isAiAuthoredColumn(post)).toBe(true);
    // Separate board: no expertise list (any locale) contains an issue slug.
    for (const other of PUBLIC_LOCALES_8) {
      expect(getAllColumnPosts(other).some((candidate) => candidate.slug === slug), `${other}/${slug}`).toBe(false);
    }
  });

  it('issue slugs are unique within each locale across both boards', () => {
    for (const locale of ISSUE_BOARD_LOCALES) {
      const expertise = new Set(getAllColumnPosts(locale).map((post) => post.slug));
      const issues = getAllIssuePosts(locale).map((post) => post.slug);
      expect(new Set(issues).size).toBe(issues.length);
      for (const slug of issues) expect(expertise.has(slug), `${locale}/${slug}`).toBe(false);
    }
  });

  it('issue board lists newest first and has copy for every board locale', () => {
    for (const locale of ISSUE_BOARD_LOCALES) {
      const posts = getAllIssuePosts(locale);
      const dates = posts.map((post) => post.publicationDate ?? '');
      expect([...dates].sort().reverse()).toEqual(dates);
      expect(issueBoardCopy[locale].label.length).toBeGreaterThan(0);
    }
    expect(getAllIssuePosts('de')).toEqual([]);
  });

  it.each(cases)('$locale/$slug internal column links resolve in the same locale', ({ locale, file }) => {
    const raw = fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale, file), 'utf8');
    const links = [...raw.matchAll(/\]\((\/[a-z-]+\/columns\/[^)#?\s]+)\)/g)].map((match) => match[1]);
    for (const link of links) {
      const [, linkLocale, , linkSlug] = link.split('/');
      expect(linkLocale, link).toBe(locale);
      expect(getAllColumnPosts(locale).some((post) => post.slug === linkSlug), link).toBe(true);
    }
  });

  it('does not name the private individual from the EN-11 news report', () => {
    const file = issueFiles('en').find((name) => name.startsWith('ISSUE-20260930-11-'));
    expect(file).toBeDefined();
    const raw = fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, 'en', file!), 'utf8');
    expect(raw).not.toMatch(/Potter|Fife|25-year-old/);
  });
});
