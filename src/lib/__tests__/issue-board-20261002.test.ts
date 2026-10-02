import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import {
  ISSUE_BOARD_LOCALES,
  ISSUE_CONTENT_ROOT,
  getAllColumnPosts,
  getIssuePost,
  issueIdFromFilename,
  issueSlugFromFilename,
  type IssueBoardLocale,
} from '@/lib/columns';
import { PUBLIC_LOCALES_8 } from '@/lib/public-guidance';
import { isAiAuthoredColumn } from '@/lib/ai-authored-columns';

/** Issue columns ISSUE-20261002 that passed the Claude Code final review (02, 05 dropped after 4 rounds; 06, 12 skipped). */
const EXPECTED: Record<IssueBoardLocale, number[]> = {
  ko: [1, 3],
  ja: [4],
  'zh-hant': [],
  en: [7, 8, 9],
  vi: [10, 11],
};

function issueFiles(locale: IssueBoardLocale): string[] {
  const dir = path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale);
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => file.startsWith('ISSUE-20261002-') && file.endsWith('.md')).sort()
    : [];
}

const cases = ISSUE_BOARD_LOCALES.flatMap((locale) =>
  issueFiles(locale).map((file) => ({ locale, file, slug: issueSlugFromFilename(file) })),
);

describe('issue board 2026-10-02', () => {
  it('ships exactly the 8 passed files and never 02, 05, 06 or 12', () => {
    for (const locale of ISSUE_BOARD_LOCALES) {
      const numbers = issueFiles(locale).map((file) => Number(file.match(/^ISSUE-\d{8}-(\d{2})-/)?.[1]));
      expect(numbers, locale).toEqual(EXPECTED[locale]);
    }
    expect(cases).toHaveLength(8);
    expect(cases.some(({ file }) => /^ISSUE-20261002-(02|05|06|12)-/.test(file))).toBe(false);
  });

  it.each(cases)('$locale/$file has clean slug, frontmatter, image and no bold', ({ locale, file, slug }) => {
    expect(issueIdFromFilename(file)).toMatch(/^ISSUE-20261002-\d{2}$/);
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const raw = fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale, file), 'utf8');
    const { data } = matter(raw);
    expect(data.published).toBe('2026-10-02');
    expect(data.audience).toEqual([locale]);
    expect(data.author).toBe('legal-ai-assistant');
    expect(Array.isArray(data.faq) && data.faq.length).toBe(3);
    expect(raw).not.toMatch(/\*\*|<strong\b|<b>/i);
    const image = String(data.featured_image).replace(/^\.\.\/images\//, 'public/images/blog/');
    expect(fs.existsSync(path.join(process.cwd(), image)), image).toBe(true);
  });

  it.each(cases)('$locale/$slug loads on the issue board only', ({ locale, slug }) => {
    const post = getIssuePost(slug, locale);
    expect(post).toBeDefined();
    expect(post?.publicationDate).toBe('2026-10-02');
    expect(isAiAuthoredColumn(post)).toBe(true);
    for (const other of PUBLIC_LOCALES_8) {
      expect(getAllColumnPosts(other).some((candidate) => candidate.slug === slug), `${other}/${slug}`).toBe(false);
    }
  });
});
