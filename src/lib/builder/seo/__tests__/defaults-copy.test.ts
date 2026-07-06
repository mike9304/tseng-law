import { describe, expect, it } from 'vitest';
import type { Locale } from '@/lib/locales';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import {
  buildDefaultSeoMetadata,
  buildSeoPreviewRows,
  getBuilderSeoDefaults,
  getDefaultBuilderSeoPatterns,
} from '@/lib/builder/seo/defaults';

const now = '2026-06-02T00:00:00.000Z';

function page(locale: Locale, overrides: Partial<BuilderPageMeta> = {}): BuilderPageMeta {
  return {
    pageId: `page-${locale}`,
    slug: 'services',
    title: { ko: '서비스', en: 'Services', 'zh-hant': '服務' },
    locale,
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    ...overrides,
  };
}

function site(locale: Locale, pages: BuilderPageMeta[]): BuilderSiteDocument {
  return {
    version: 1,
    siteId: `site-${locale}`,
    name: locale === 'en' ? 'Tseng Law' : locale === 'zh-hant' ? '皓正國際' : '호정국제',
    locale,
    navigation: [],
    theme: DEFAULT_THEME,
    pages,
    createdAt: now,
    updatedAt: now,
  };
}

describe('SEO default pattern copy', () => {
  it('keeps ko fallback SEO default patterns', () => {
    const patterns = getDefaultBuilderSeoPatterns('ko');
    const current = page('ko');
    const metadata = buildDefaultSeoMetadata({
      page: current,
      site: site('ko', [current]),
      siteUrl: 'https://example.com',
      locale: 'ko',
    });

    expect(patterns.descriptionTemplate).toBe('{{pageName}} 페이지입니다. {{businessName}}의 주요 서비스와 상담 정보를 확인하세요.');
    expect(metadata.description).toContain('서비스 페이지입니다.');
  });

  it('uses zh-hant fallback SEO descriptions without Hangul', () => {
    const current = page('zh-hant');
    const metadata = buildDefaultSeoMetadata({
      page: current,
      site: site('zh-hant', [current]),
      siteUrl: 'https://example.com',
      locale: 'zh-hant',
    });
    const defaults = getBuilderSeoDefaults(site('zh-hant', [current]), 'zh-hant');
    const text = [
      getDefaultBuilderSeoPatterns('zh-hant').descriptionTemplate,
      defaults.patterns?.descriptionTemplate ?? '',
      metadata.description ?? '',
    ].join(' ');

    expect(metadata.description).toBe('服務 頁面。請查看 皓正國際 的主要服務與諮詢資訊。');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('uses en fallback SEO descriptions without CJK', () => {
    const current = page('en');
    const doc = site('en', [current]);
    const metadata = buildDefaultSeoMetadata({
      page: current,
      site: doc,
      siteUrl: 'https://example.com',
      locale: 'en',
    });
    const preview = buildSeoPreviewRows({
      site: doc,
      siteUrl: 'https://example.com',
      locale: 'en',
    });
    const text = [
      getDefaultBuilderSeoPatterns('en').descriptionTemplate,
      getBuilderSeoDefaults(doc, 'en').patterns?.descriptionTemplate ?? '',
      metadata.description ?? '',
      preview[0].description,
    ].join(' ');

    expect(metadata.description).toBe('Services page. View key services and consultation information from Tseng Law.');
    expect(preview[0].description).toBe(metadata.description);
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
