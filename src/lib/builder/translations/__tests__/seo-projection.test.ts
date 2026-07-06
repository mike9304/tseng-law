import { describe, expect, it } from 'vitest';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import {
  projectSeoToLocales,
  resolveLocaleSeo,
} from '@/lib/builder/translations/seo-projection';

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

describe('projectSeoToLocales', () => {
  it('inherits source SEO when no overrides exist', () => {
    const page = makePage({
      seo: {
        title: '소개 페이지',
        description: '한국어 설명',
        ogTitle: 'OG 소개',
        ogDescription: 'OG 한국어 설명',
        ogImage: '/og.png',
        twitterTitle: '트위터 소개',
        twitterDescription: '트위터 한국어 설명',
      },
    });
    const map = projectSeoToLocales(page);
    expect(map.ko?.title).toBe('소개 페이지');
    expect(map.en?.title).toBe('소개 페이지');
    expect(map.en?.description).toBe('한국어 설명');
    expect(map.en?.ogTitle).toBe('OG 소개');
    expect(map.en?.twitterDescription).toBe('트위터 한국어 설명');
    expect(map['zh-hant']?.ogImage).toBe('/og.png');
  });

  it('honours per-locale overrides field-by-field', () => {
    const page = makePage({
      seo: {
        title: '소개',
        description: '한국어 설명',
        ogImage: '/og.png',
        ogTitle: 'OG 소개',
        twitterDescription: '트위터 한국어 설명',
        focusKeyword: '국제 소송',
        // Additive field — see Files to modify for the type patch.
        localizedOverrides: {
          en: { title: 'About us', description: 'English description', ogTitle: 'About OG', twitterDescription: 'English tweet desc', focusKeyword: 'international law' },
          'zh-hant': { ogImage: '/og-zh.png' },
        },
      } as never,
    });
    const map = projectSeoToLocales(page);
    expect(map.en?.title).toBe('About us');
    expect(map.en?.description).toBe('English description');
    expect(map.en?.ogTitle).toBe('About OG');
    expect(map.en?.twitterDescription).toBe('English tweet desc');
    expect(map.en?.focusKeyword).toBe('international law');
    // ogImage not overridden for en → falls back to source.
    expect(map.en?.ogImage).toBe('/og.png');
    expect(map['zh-hant']?.ogImage).toBe('/og-zh.png');
    // Other zh-hant fields fall back to source.
    expect(map['zh-hant']?.title).toBe('소개');
  });

  it('returns empty values when neither source nor override is set', () => {
    const page = makePage();
    const map = projectSeoToLocales(page);
    expect(map.ko).toEqual({});
    expect(map.en).toEqual({});
  });
});

describe('resolveLocaleSeo', () => {
  it('returns one locale slice', () => {
    const page = makePage({
      seo: {
        title: '소개',
        focusKeyword: '국제 소송',
        localizedOverrides: { en: { title: 'About', focusKeyword: 'international law' } },
      } as never,
    });
    expect(resolveLocaleSeo(page, 'en').title).toBe('About');
    expect(resolveLocaleSeo(page, 'en').focusKeyword).toBe('international law');
    expect(resolveLocaleSeo(page, 'ko').title).toBe('소개');
    expect(resolveLocaleSeo(page, 'ko').focusKeyword).toBe('국제 소송');
  });
});
