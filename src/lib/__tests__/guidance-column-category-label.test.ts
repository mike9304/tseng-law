import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { guidanceColumnCategoryLabel } from '@/lib/columns';
import { COLUMN_CONTENT_DIR_BY_LOCALE } from '@/lib/column-locales';
import { GUIDANCE_LOCALES_4 } from '@/lib/public-guidance';

const CATEGORIES = ['formation', 'legal', 'case'] as const;
const ENGLISH = { formation: 'Company Setup', legal: 'Legal Information', case: 'Case Study' } as const;
const ARABIC = { formation: 'تأسيس الشركات', legal: 'معلومات قانونية', case: 'دراسات قضايا' } as const;

/** Every distinct `categories[0]` phrase the translation lane wrote for a locale. */
function frontmatterCategoryPhrases(locale: (typeof GUIDANCE_LOCALES_4)[number]): Set<string> {
  const dir = path.join(process.cwd(), COLUMN_CONTENT_DIR_BY_LOCALE[locale]);
  if (!existsSync(dir)) return new Set();
  const phrases = new Set<string>();
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const { data } = matter(readFileSync(path.join(dir, file), 'utf8'));
    const first = Array.isArray(data.categories) ? data.categories[0] : data.categories;
    if (typeof first === 'string' && first.trim()) phrases.add(first.trim());
  }
  return phrases;
}

/**
 * The column category badge on guidance pages used to fall back to the English
 * map for every guidance language (live /vi 4×, /id /th /fil 8× "Legal
 * Information"). Labels are now the reviewed copy that already exists:
 * vi/id/th/fil reuse their frontmatter `categories` phrase verbatim, ar uses the
 * WO-M3-reviewed terms. The cross-check against the files on disk means a label
 * can never drift from what the translation lane actually wrote.
 */
describe('guidance column category badge', () => {
  it('renders the reviewed Arabic labels for ar and never the English badge', () => {
    for (const category of CATEGORIES) {
      expect(guidanceColumnCategoryLabel(category, 'ar')).toBe(ARABIC[category]);
      expect(guidanceColumnCategoryLabel(category, 'ar')).toMatch(/[؀-ۿ]/);
    }
  });

  for (const locale of GUIDANCE_LOCALES_4.filter((l) => l !== 'ar')) {
    it(`${locale}: every label is a phrase the translation lane wrote in the column frontmatter`, () => {
      const phrases = frontmatterCategoryPhrases(locale);
      if (phrases.size === 0) {
        const dir = path.join(process.cwd(), COLUMN_CONTENT_DIR_BY_LOCALE[locale]);
        const hasMarkdown =
          existsSync(dir) && readdirSync(dir).some((name) => name.endsWith('.md'));
        expect(hasMarkdown, `${locale} has no column files yet; skip frontmatter phrase lock`).toBe(
          false,
        );
        return;
      }
      expect(phrases.size, `${locale} frontmatter phrases`).toBe(3);
      for (const category of CATEGORIES) {
        const label = guidanceColumnCategoryLabel(category, locale);
        expect(label, `${locale}/${category}`).not.toBe(ENGLISH[category]);
        expect(phrases.has(label), `${locale}/${category} "${label}" not in frontmatter ${[...phrases].join(' | ')}`).toBe(true);
      }
      // The three labels must be distinct — one badge per bucket.
      expect(new Set(CATEGORIES.map((c) => guidanceColumnCategoryLabel(c, locale))).size).toBe(3);
    });
  }

  it('is the single resolver the guidance branch of categoryLabelFn delegates to', () => {
    const src = readFileSync(path.join(process.cwd(), 'src/lib/columns.ts'), 'utf8');
    expect(src).toMatch(/if \(isGuidanceLocale4\(locale\)\) \{\s*return guidanceColumnCategoryLabel\(cat, locale\);/);
    expect(src).not.toMatch(/isGuidanceLocale4\(locale\)\) \{\s*const map: Record<ColumnCategory, string> = \{ formation: 'Company Setup'/);
  });
});
