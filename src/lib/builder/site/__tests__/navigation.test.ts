import { describe, expect, it } from 'vitest';
import { filterNavigationForLocale } from '@/lib/builder/site/navigation';
import { hrefLocalePrefix, isForeignLocaleHref } from '@/lib/builder/site/paths';
import type { BuilderNavItem, BuilderPageMeta } from '@/lib/builder/site/types';

function nav(id: string, href: string, children?: BuilderNavItem[]): BuilderNavItem {
  return {
    id,
    href,
    pageId: id,
    label: { ko: id, 'zh-hant': id, en: id },
    children,
  };
}

function page(pageId: string, publishedAt?: string): BuilderPageMeta {
  return {
    pageId,
    slug: pageId,
    title: { ko: pageId, 'zh-hant': pageId, en: pageId },
    locale: 'ko',
    createdAt: '2026-05-21T00:00:00.000Z',
    updatedAt: '2026-05-21T00:00:00.000Z',
    publishedAt,
  };
}

describe('navigation locale filtering', () => {
  it('detects only real internal locale prefixes', () => {
    expect(hrefLocalePrefix('/ko/services')).toBe('ko');
    expect(hrefLocalePrefix('/zh-hant?x=1')).toBe('zh-hant');
    expect(hrefLocalePrefix('/en#top')).toBe('en');
    expect(hrefLocalePrefix('/knowledge')).toBeNull();
    expect(hrefLocalePrefix('https://example.com/ko')).toBeNull();
    expect(hrefLocalePrefix('#ko')).toBeNull();
  });

  it('filters foreign-locale hrefs without dropping shared relative or external links', () => {
    expect(isForeignLocaleHref('/zh-hant/services', 'ko')).toBe(true);
    expect(isForeignLocaleHref('/ko/services', 'ko')).toBe(false);
    expect(isForeignLocaleHref('/services', 'ko')).toBe(false);
    expect(isForeignLocaleHref('mailto:test@example.com', 'ko')).toBe(false);

    const filtered = filterNavigationForLocale([
      nav('relative-services', '/services'),
      nav('ko-template-page', '/ko/template-page'),
      nav('zh-template-page', '/zh-hant/template-page'),
      nav('external', 'https://example.com'),
    ], 'ko');

    expect(filtered.map((item) => item.id)).toEqual([
      'relative-services',
      'ko-template-page',
      'external',
    ]);
  });

  it('filters nested foreign-locale children while preserving the parent', () => {
    const filtered = filterNavigationForLocale([
      nav('services', '/services', [
        nav('ko-child', '/ko/services#ko'),
        nav('zh-child', '/zh-hant/services#zh'),
        nav('relative-child', '/contact'),
      ]),
    ], 'ko');

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.children?.map((item) => item.id)).toEqual(['ko-child', 'relative-child']);
  });

  it('hides known unpublished page navigation items when requested', () => {
    const filtered = filterNavigationForLocale([
      nav('published-page', '/ko/published-page'),
      nav('draft-page', '/ko/draft-page'),
      nav('external', 'https://example.com'),
    ], 'ko', {
      pages: [
        page('published-page', '2026-05-21T00:00:00.000Z'),
        page('draft-page'),
      ],
      publishedOnly: true,
    });

    expect(filtered.map((item) => item.id)).toEqual(['published-page', 'external']);
  });
});
