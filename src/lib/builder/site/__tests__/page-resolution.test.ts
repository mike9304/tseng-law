import { describe, expect, it } from 'vitest';

import { findPageMetaForLocale } from '@/lib/builder/site/page-resolution';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

function page(
  pageId: string,
  locale: Locale,
  slug: string,
  updatedAt: string,
  overrides: Partial<BuilderPageMeta> = {},
): BuilderPageMeta {
  return {
    pageId,
    slug,
    title: { ko: pageId, 'zh-hant': pageId, en: pageId },
    locale,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt,
    publishedAt: updatedAt,
    ...overrides,
  };
}

describe('findPageMetaForLocale', () => {
  it('keeps Korean public home on the Korean page even when zh-hant home is newer', () => {
    const koHome = page('ko-home', 'ko', '', '2026-05-01T00:00:00.000Z', { isHomePage: true });
    const zhHome = page('zh-home', 'zh-hant', '', '2026-05-12T00:00:00.000Z', { isHomePage: true });

    expect(findPageMetaForLocale([koHome, zhHome], 'ko', '')?.pageId).toBe('ko-home');
    expect(findPageMetaForLocale([koHome, zhHome], 'zh-hant', '')?.pageId).toBe('zh-home');
  });

  it('uses the locale-specific slug page before default-locale projection', () => {
    const koAbout = page('ko-about', 'ko', 'about', '2026-05-01T00:00:00.000Z');
    const zhAbout = page('zh-about', 'zh-hant', 'about', '2026-05-12T00:00:00.000Z');

    expect(findPageMetaForLocale([koAbout, zhAbout], 'zh-hant', 'about')?.pageId).toBe('zh-about');
  });

  it('projects a Korean default-locale page only when the target locale lacks an equivalent', () => {
    const koPricing = page('ko-pricing', 'ko', 'pricing', '2026-05-01T00:00:00.000Z');

    expect(findPageMetaForLocale([koPricing], 'zh-hant', 'pricing')?.pageId).toBe('ko-pricing');
  });

  it('resolves a locale-specific slug override ahead of the base slug projection', () => {
    const koAbout = page('ko-about', 'ko', 'about', '2026-05-01T00:00:00.000Z', {
      slugByLocale: { en: 'about-us' },
    } as Partial<BuilderPageMeta>);
    const enAbout = page('en-about', 'en', 'about', '2026-05-12T00:00:00.000Z');

    expect(findPageMetaForLocale([koAbout, enAbout], 'en', 'about-us')?.pageId).toBe('ko-about');
  });

  it('keeps the source page visible for a localized slug even when a linked target page exists', () => {
    const koAbout = page('ko-about', 'ko', 'about', '2026-05-01T00:00:00.000Z', {
      slugByLocale: { en: 'about-us' },
      linkedPageIds: { en: 'en-about' },
    } as Partial<BuilderPageMeta>);
    const enAbout = page('en-about', 'en', 'about', '2026-05-12T00:00:00.000Z');

    expect(findPageMetaForLocale([koAbout, enAbout], 'en', 'about-us')?.pageId).toBe('ko-about');
  });

  describe('internal sandbox / QA / probe pages', () => {
    const INTERNAL_SANDBOX_SLUGS = [
      'visual-template-pet-home-mqzemq7q',
      'public-animation-mqzrfcqb',
      'custom-preview-mr0kw8u4',
      'db-probe-1783017761',
    ] as const;

    it.each(INTERNAL_SANDBOX_SLUGS)(
      'does not resolve a published internal sandbox page by slug (%s)',
      (slug) => {
        const leaked = page(`p-${slug}`, 'ko', slug, '2026-05-01T00:00:00.000Z');
        expect(findPageMetaForLocale([leaked], 'ko', slug)).toBeUndefined();
      },
    );

    it('still resolves real customer pages alongside published internal sandbox pages', () => {
      const about = page('p-about', 'ko', 'about', '2026-05-01T00:00:00.000Z');
      const leaked = page(
        'p-leak',
        'ko',
        'custom-preview-mr0kw8u4',
        '2026-05-02T00:00:00.000Z',
      );

      expect(findPageMetaForLocale([about, leaked], 'ko', 'about')?.pageId).toBe('p-about');
      expect(
        findPageMetaForLocale([about, leaked], 'ko', 'custom-preview-mr0kw8u4'),
      ).toBeUndefined();
    });

    it('keeps legitimate customer pages resolvable even when they share a broad prefix', () => {
      const real = [
        page('p-landing', 'ko', 'custom-landing', '2026-05-01T00:00:00.000Z'),
        page('p-services', 'ko', 'services/detention', '2026-05-01T00:00:00.000Z'),
        page('p-reviews', 'ko', 'reviews', '2026-05-01T00:00:00.000Z'),
      ];

      expect(findPageMetaForLocale(real, 'ko', 'custom-landing')?.pageId).toBe('p-landing');
      expect(findPageMetaForLocale(real, 'ko', 'services/detention')?.pageId).toBe('p-services');
      expect(findPageMetaForLocale(real, 'ko', 'reviews')?.pageId).toBe('p-reviews');
    });

    it('can still resolve internal sandbox pages when explicitly opted in', () => {
      const leaked = page(
        'p-leak',
        'ko',
        'visual-template-pet-home-mqzemq7q',
        '2026-05-01T00:00:00.000Z',
      );

      expect(
        findPageMetaForLocale([leaked], 'ko', 'visual-template-pet-home-mqzemq7q', {
          includeInternalSandbox: true,
        })?.pageId,
      ).toBe('p-leak');
    });
  });
});
