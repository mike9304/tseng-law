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

/** Local content contract for ISSUE-20261125; the lane separately reviews shipping. */
const EXPECTED: Partial<Record<IssueBoardLocale, string[]>> = {
  ko: [
    'ISSUE-20261125-01-taiwan-toucheng-protected-coast-hand-harvesting.md',
    'ISSUE-20261125-02-taiwan-airbnb-checkout-chores-late-house-rules.md',
  ],
  ja: [
    'ISSUE-20261125-03-taiwan-estate-tax-financial-assets-penalty-reduction.md',
    'ISSUE-20261125-04-taiwan-character-cake-mold-copyright-permission.md',
  ],
  en: [
    // The separately added PRC-control piece shares EN-05 with the lane batch.
    'ISSUE-20261125-05-taiwan-branch-prc-control-third-country-investor.md',
    'ISSUE-20261125-05-taiwan-parent-subsidiary-merger-cfc-income-return.md',
    'ISSUE-20261125-06-taiwan-successive-inheritance-home-sale-tax-shares.md',
  ],
  vi: [
    'ISSUE-20261125-07-taiwan-pregnant-migrant-employer-transfer-suspension.md',
    'ISSUE-20261125-08-taiwan-worker-request-no-occupational-insurance.md',
  ],
};

function issueFiles(locale: IssueBoardLocale): string[] {
  const dir = path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale);
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((file) => file.startsWith('ISSUE-20261125-') && file.endsWith('.md')).sort()
    : [];
}

const cases = ISSUE_BOARD_LOCALES.flatMap((locale) =>
  issueFiles(locale).map((file) => ({ locale, file, slug: issueSlugFromFilename(file) })),
);

describe('issue board 2026-11-25', () => {
  const expertiseSlugsByLocale = {} as Record<PublicLocale8, Set<string>>;

  beforeAll(() => {
    for (const locale of PUBLIC_LOCALES_8) {
      expertiseSlugsByLocale[locale] = new Set(getAllColumnPosts(locale).map((post) => post.slug));
    }
  }, 30_000);

  it('contains the eight lane pieces and the separate English piece with unique slugs', () => {
    for (const locale of ISSUE_BOARD_LOCALES) {
      expect(issueFiles(locale), locale).toEqual(EXPECTED[locale] ?? []);
    }
    expect(cases).toHaveLength(9);
    expect(new Set(cases.map(({ slug }) => slug)).size).toBe(cases.length);
  });

  it.each(cases)('$locale/$file has clean slug, frontmatter, media and no bold', ({ locale, file, slug }) => {
    expect(issueIdFromFilename(file)).toMatch(/^ISSUE-20261125-\d{2}$/);
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    const raw = fs.readFileSync(path.join(process.cwd(), ISSUE_CONTENT_ROOT, locale, file), 'utf8');
    const { data } = matter(raw);
    expect(data.published).toBe('2026-11-25');
    expect(data.lastmod).toBe('2026-11-25');
    expect(data.audience).toEqual([locale]);
    expect(data.author).toBe('legal-ai-assistant');
    expect(Array.isArray(data.faq) && data.faq.length).toBe(3);
    expect(raw).not.toMatch(/\*\*|__[^\n]+__|<strong\b|<b\b/i);
    for (const field of ['title', 'seoTitle', 'summary', 'date_display', 'read_time', 'topic', 'featured_image_alt', 'featured_image_caption']) {
      expect(typeof data[field] === 'string' && data[field].trim().length > 0, field).toBe(true);
    }
    expect(Array.isArray(data.categories) && data.categories.length > 0).toBe(true);
    const imageBase = `/images/blog/${file.replace(/\.md$/, '')}/featured-01`;
    for (const [field, extension] of Object.entries({ featured_image: 'webp', social_image: 'jpg' })) {
      const imagePath = String(data[field]).replace(/^\.\.\/images\//, '/images/blog/');
      expect(imagePath, field).toBe(`${imageBase}.${extension}`);
      expect(fs.existsSync(path.join(process.cwd(), 'public', imagePath)), imagePath).toBe(true);
    }
  });

  it.each(cases)('$locale/$slug loads on the issue board only', ({ locale, slug }) => {
    const post = getIssuePost(slug, locale);
    expect(post).toBeDefined();
    expect(post?.publicationDate).toBe('2026-11-25');
    expect(isAiAuthoredColumn(post)).toBe(true);
    for (const other of PUBLIC_LOCALES_8) {
      expect(expertiseSlugsByLocale[other].has(slug), `${other}/${slug}`).toBe(false);
    }
  });
});
