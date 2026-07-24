import { describe, expect, it } from 'vitest';
import { publicColumnTypographyClassName, resolveTypography } from '@/lib/builder/columns/typography';

/**
 * Preview parity: admin advanced preview and public page both use
 * ColumnContent (markdown) + the same typography class helper.
 * This unit locks the shared class contract used by both surfaces.
 */
describe('preview/public typography parity helpers', () => {
  it.each([
    ['ko', 'ko-body-readable', 'column-typo--ko-body-readable'],
    ['zh-hant', 'zh-display-serif', 'column-typo--zh-display-serif'],
    ['en', 'en-compact', 'column-typo--en-compact'],
  ] as const)('locale %s preset %s → class %s', (locale, presetId, className) => {
    expect(publicColumnTypographyClassName(locale, { presetId })).toBe(className);
    expect(resolveTypography(locale, { presetId }).className).toBe(className);
  });
});
