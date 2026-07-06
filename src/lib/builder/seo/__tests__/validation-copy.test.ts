import { describe, expect, it } from 'vitest';
import type { Locale } from '@/lib/locales';
import type { BuilderPageMeta, BuilderSeoMetadata, BuilderSiteDocument } from '@/lib/builder/site/types';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import { validateBuilderPageSeo } from '@/lib/builder/seo/validation';
import { getSeoValidationCopy } from '@/lib/builder/seo/validation-copy';

const now = '2026-06-02T00:00:00.000Z';

function page(locale: Locale, overrides: Partial<BuilderPageMeta> = {}): BuilderPageMeta {
  return {
    pageId: `page-${locale}`,
    slug: 'Bad_slug',
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

function invalidSeo(locale: Locale): BuilderSeoMetadata {
  const customLabel = locale === 'en' ? 'Custom block' : locale === 'zh-hant' ? '自訂區塊' : '커스텀 블록';
  const brokenLabel = locale === 'en' ? 'Broken block' : locale === 'zh-hant' ? '錯誤區塊' : '깨진 블록';

  return {
    title: 'Short title',
    description: 'Short description',
    canonical: `https://example.com/${locale}/different?tracking=1`,
    ogImage: 'ftp://example.com/og.png',
    twitterImage: 'not-a-valid-image',
    focusKeyword: 'x'.repeat(81),
    noIndex: true,
    noFollow: true,
    structuredData: {
      legalService: false,
      organization: false,
      localBusiness: false,
      faqPage: 'off',
      breadcrumbList: false,
    },
    additionalMetaTags: [
      { id: 'empty', name: '', content: '' },
      { id: 'bad-name', name: 'bad name', content: 'value' },
      { id: 'duplicate-a', name: 'duplicate', content: 'one' },
      { id: 'duplicate-b', name: 'duplicate', content: 'two' },
      ...Array.from({ length: 8 }, (_, index) => ({
        id: `extra-${index}`,
        name: `extra-${index}`,
        content: 'value',
      })),
    ],
    structuredDataBlocks: [
      { id: 'array', type: 'Custom', label: customLabel, enabled: true, json: '[]' },
      { id: 'broken', type: 'Custom', label: brokenLabel, enabled: true, json: '{ broken' },
    ],
  };
}

function validateText(locale: Locale): string {
  const current = page(locale, { seo: invalidSeo(locale) });
  const duplicate = page(locale, { pageId: `duplicate-${locale}` });
  const issues = validateBuilderPageSeo({
    page: current,
    site: site(locale, [current, duplicate]),
    seo: current.seo,
    slug: current.slug,
    siteUrl: 'https://example.com',
  });

  return issues.flatMap((issue) => [issue.message, issue.fixHint ?? '']).join(' ');
}

describe('SEO validation copy', () => {
  it('returns ko validation issue copy from helper and validator', () => {
    const copy = getSeoValidationCopy('ko');
    const text = validateText('ko');

    expect(copy.homeSlugNotEmpty.message).toBe('홈 페이지 슬러그는 비워야 합니다.');
    expect(copy.lengthMissing('title', 30, 60).message).toBe('SEO 제목이 비어 있습니다.');
    expect(text).toContain('슬러그 형식이 잘못되었습니다.');
    expect(text).toContain('SEO 제목 길이가 권장 범위');
    expect(text).toContain('OG 이미지 URL 형식이 올바르지 않습니다.');
    expect(text).toContain('Custom JSON-LD "커스텀 블록"는 object 형태여야 합니다.');
    expect(text).not.toContain('Home page slug 는');
    expect(text).not.toContain('Additional meta tag 에 빈 name');
  });

  it('returns zh-hant validation issue copy without Hangul', () => {
    const copy = getSeoValidationCopy('zh-hant');
    const text = [
      copy.homeSlugNotEmpty.message,
      copy.lengthMissing('description', 120, 160).fixHint,
      validateText('zh-hant'),
    ].join(' ');

    expect(text).toContain('Slug 格式不正確。');
    expect(text).toContain('SEO 標題超出建議長度');
    expect(text).toContain('Custom JSON-LD「自訂區塊」必須是 object 格式。');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en validation issue copy without CJK', () => {
    const copy = getSeoValidationCopy('en');
    const text = [
      copy.homeSlugNotEmpty.message,
      copy.lengthMissing('description', 120, 160).fixHint,
      validateText('en'),
    ].join(' ');

    expect(text).toContain('Slug format is invalid.');
    expect(text).toContain('SEO title is outside the recommended range');
    expect(text).toContain('Custom JSON-LD "Custom block" must be an object.');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
