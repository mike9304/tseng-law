import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { guidanceColumnCategoryLabel } from '@/lib/columns';
import { GUIDANCE_LOCALES_4 } from '@/lib/public-guidance';

const ENGLISH = { formation: 'Company Setup', legal: 'Legal Information', case: 'Case Study' } as const;
const ARABIC = { formation: 'تأسيس الشركات', legal: 'معلومات قانونية', case: 'دراسات قضايا' } as const;

/**
 * The column category badge on guidance pages fell back to the English map for
 * every guidance language (live /vi 4×, /id /th /fil 8× "Legal Information",
 * and /ar after the flip). Arabic now carries the reviewed labels; the other
 * four keep the English fallback until the translation lane supplies theirs —
 * that fallback is pinned here on purpose so the leak stays visible.
 */
describe('guidance column category badge', () => {
  it('renders the reviewed Arabic labels for ar and never the English badge', () => {
    for (const category of ['formation', 'legal', 'case'] as const) {
      expect(guidanceColumnCategoryLabel(category, 'ar')).toBe(ARABIC[category]);
      expect(guidanceColumnCategoryLabel(category, 'ar')).not.toBe(ENGLISH[category]);
      // Arabic script, not a Latin placeholder.
      expect(guidanceColumnCategoryLabel(category, 'ar')).toMatch(/[؀-ۿ]/);
    }
  });

  it('keeps the documented English fallback for the four languages without reviewed terms', () => {
    for (const locale of GUIDANCE_LOCALES_4.filter((l) => l !== 'ar')) {
      for (const category of ['formation', 'legal', 'case'] as const) {
        expect(guidanceColumnCategoryLabel(category, locale), `${locale}/${category}`).toBe(ENGLISH[category]);
      }
    }
  });

  it('is the single resolver the guidance branch of categoryLabelFn delegates to', () => {
    const src = readFileSync(path.join(process.cwd(), 'src/lib/columns.ts'), 'utf8');
    expect(src).toMatch(/if \(isGuidanceLocale4\(locale\)\) \{\s*return guidanceColumnCategoryLabel\(cat, locale\);/);
    // The old inline English map for guidance locales must be gone from that branch.
    expect(src).not.toMatch(/isGuidanceLocale4\(locale\)\) \{\s*const map: Record<ColumnCategory, string> = \{ formation: 'Company Setup'/);
  });
});
