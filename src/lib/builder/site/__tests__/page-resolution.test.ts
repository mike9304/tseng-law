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
});
