import { describe, expect, it } from 'vitest';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import {
  findPageMetaForLocaleSlug,
  isLocaleSlugConflict,
  resolveLocaleSlug,
} from '@/lib/builder/translations/locale-slug';

function makePage(overrides?: Partial<BuilderPageMeta>): BuilderPageMeta {
  const now = '2026-05-20T00:00:00.000Z';
  return {
    pageId: 'page-1',
    slug: 'about',
    title: { ko: '소개', 'zh-hant': '關於', en: 'About' },
    locale: 'ko',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('resolveLocaleSlug', () => {
  it('falls back to source slug when no override exists', () => {
    const page = makePage();
    expect(resolveLocaleSlug(page, 'ko')).toBe('about');
    expect(resolveLocaleSlug(page, 'en')).toBe('about');
    expect(resolveLocaleSlug(page, 'zh-hant')).toBe('about');
  });

  it('honours per-locale overrides', () => {
    const page = makePage({
      slugByLocale: { en: 'about-us', 'zh-hant': 'guan-yu' },
    } as Partial<BuilderPageMeta>);
    expect(resolveLocaleSlug(page, 'en')).toBe('about-us');
    expect(resolveLocaleSlug(page, 'zh-hant')).toBe('guan-yu');
    expect(resolveLocaleSlug(page, 'ko')).toBe('about');
  });

  it('ignores empty-string overrides so home pages stay rooted', () => {
    const page = makePage({
      slug: 'about',
      slugByLocale: { en: '' },
    } as Partial<BuilderPageMeta>);
    expect(resolveLocaleSlug(page, 'en')).toBe('about');
  });
});

describe('findPageMetaForLocaleSlug', () => {
  it('prefers a per-locale override match over a source-slug match', () => {
    const overridePage = makePage({
      pageId: 'p-override',
      slug: 'about',
      slugByLocale: { en: 'about-us' },
    } as Partial<BuilderPageMeta>);
    const fallbackPage = makePage({ pageId: 'p-fallback', slug: 'about-us' });
    const match = findPageMetaForLocaleSlug(
      [fallbackPage, overridePage],
      'en',
      'about-us',
    );
    expect(match?.pageId).toBe('p-override');
  });

  it('returns the source-slug match when no override matches', () => {
    const page = makePage({ pageId: 'p-fallback', slug: 'services' });
    const match = findPageMetaForLocaleSlug([page], 'en', 'services');
    expect(match?.pageId).toBe('p-fallback');
  });

  it('returns undefined when nothing matches', () => {
    const page = makePage({ slug: 'about' });
    expect(findPageMetaForLocaleSlug([page], 'en', 'missing')).toBeUndefined();
  });
});

describe('isLocaleSlugConflict', () => {
  it('detects conflicts against a sibling per-locale slug', () => {
    const siblingA = makePage({
      pageId: 'p-a',
      slug: 'about',
      slugByLocale: { en: 'about-us' },
    } as Partial<BuilderPageMeta>);
    const siblingB = makePage({
      pageId: 'p-b',
      slug: 'services',
    });
    expect(
      isLocaleSlugConflict([siblingA, siblingB], 'en', 'about-us', 'p-b'),
    ).toBe(true);
    expect(
      isLocaleSlugConflict([siblingA, siblingB], 'en', 'services', 'p-b'),
    ).toBe(false);
  });

  it('ignores conflicts against the page being edited', () => {
    const page = makePage({
      pageId: 'p-self',
      slug: 'about',
      slugByLocale: { en: 'about-us' },
    } as Partial<BuilderPageMeta>);
    expect(
      isLocaleSlugConflict([page], 'en', 'about-us', 'p-self'),
    ).toBe(false);
  });

  it('treats empty proposed slug as no conflict (home pages)', () => {
    const sibling = makePage({ slug: 'about' });
    expect(isLocaleSlugConflict([sibling], 'en', '', 'p-x')).toBe(false);
  });
});