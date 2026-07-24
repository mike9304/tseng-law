import { describe, expect, it } from 'vitest';
import {
  coercePresetForLocale,
  columnTypographyClassName,
  defaultTypographyForLocale,
  listTypographyPresetsForLocale,
  publicColumnTypographyClassName,
  resolveTypography,
} from '@/lib/builder/columns/typography';
import {
  columnDocumentSchema,
  columnTypographyPresetIdSchema,
  columnTypographySchema,
} from '@/lib/builder/columns/types';

describe('column typography schema', () => {
  it('accepts allowlisted presets and rejects arbitrary fontFamily', () => {
    expect(columnTypographySchema.parse({ presetId: 'ko-body-readable' })).toEqual({
      presetId: 'ko-body-readable',
    });
    expect(() => columnTypographySchema.parse({ presetId: 'comic-sans' })).toThrow();
    // fontFamily is not part of the schema — unknown keys are stripped by Zod object.
    const parsed = columnTypographySchema.parse({
      presetId: 'en-body-sans',
      fontFamily: 'Comic Sans MS',
    } as never);
    expect(parsed).toEqual({ presetId: 'en-body-sans' });
    expect('fontFamily' in parsed).toBe(false);
  });

  it('does not null an entire document when typography is invalid', () => {
    const result = columnDocumentSchema.safeParse({
      version: 1,
      slug: 'sample-column',
      locale: 'ko',
      title: '제목',
      summary: '',
      bodyMarkdown: 'body',
      bodyHtml: '<p>body</p>',
      linkedSlugs: {},
      frontmatter: {
        lastmod: '2026-07-24T00:00:00.000Z',
        attorneyReviewStatus: 'pending',
        freshness: 'unknown',
        typography: { presetId: 'not-a-real-preset', fontFamily: 'Evil' },
      },
      draft: true,
      revision: 1,
      updatedAt: '2026-07-24T00:00:00.000Z',
      updatedBy: 'admin',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('제목');
      expect(result.data.frontmatter.typography).toBeUndefined();
    }
  });
});

describe('typography resolver', () => {
  it('defaults per locale', () => {
    expect(defaultTypographyForLocale('ko').presetId).toBe('ko-body-sans');
    expect(defaultTypographyForLocale('zh-hant').presetId).toBe('zh-body-sans');
    expect(defaultTypographyForLocale('en').presetId).toBe('en-body-sans');
  });

  it('lists only locale-scoped presets', () => {
    expect(listTypographyPresetsForLocale('ko')).toEqual([
      'ko-body-sans',
      'ko-body-readable',
      'ko-display-serif',
      'ko-compact',
    ]);
    expect(listTypographyPresetsForLocale('zh-hant').every((id) => id.startsWith('zh-'))).toBe(true);
    expect(listTypographyPresetsForLocale('en').every((id) => id.startsWith('en-'))).toBe(true);
  });

  it('remaps mismatched preset to locale default', () => {
    expect(coercePresetForLocale('en-body-readable', 'ko')).toBe('ko-body-sans');
    const resolved = resolveTypography('zh-hant', { presetId: 'ko-display-serif' });
    expect(resolved.presetId).toBe('zh-body-sans');
    expect(resolved.className).toBe('column-typo--zh-body-sans');
  });

  it('builds public class names', () => {
    expect(columnTypographyClassName('ko-body-readable')).toBe('column-typo--ko-body-readable');
    expect(publicColumnTypographyClassName('en', { presetId: 'en-compact' })).toBe(
      'column-typo--en-compact',
    );
    expect(publicColumnTypographyClassName('ko', undefined)).toBe('column-typo--ko-body-sans');
  });

  it('exposes css vars for size and leading', () => {
    const resolved = resolveTypography('ko', {
      presetId: 'ko-body-readable',
      bodySize: 'lg',
      lineHeight: 'relaxed',
    });
    expect(resolved.cssVars['--column-typo-size']).toBe('1.125rem');
    expect(resolved.cssVars['--column-typo-leading']).toBe('1.85');
    expect(columnTypographyPresetIdSchema.options).toHaveLength(12);
  });
});
