import { describe, expect, it } from 'vitest';
import { buildSeoMetadata, getLanguageAlternates } from '@/lib/seo';
import { isEnglishNoindexPath } from '@/lib/seo-visibility';

describe('hreflang locale coverage (WO#3)', () => {
  it('includes ja in default language alternates for a static page (about)', () => {
    const metadata = buildSeoMetadata({
      locale: 'ko',
      title: '소개',
      description: '법무법인 호정 소개',
      path: '/about',
    });

    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(languages).toMatchObject({
      ko: 'https://tseng-law.com/ko/about',
      'zh-Hant': 'https://tseng-law.com/zh-hant/about',
      en: 'https://tseng-law.com/en/about',
      ja: 'https://tseng-law.com/ja/about',
      'x-default': 'https://tseng-law.com/ko/about',
    });
  });

  it('drops the en alternate for English-noindex paths (faq) while keeping ja and x-default', () => {
    // getLanguageAlternates with the default locale set.
    const defaults = getLanguageAlternates('/faq');
    expect(defaults).not.toHaveProperty('en');
    expect(defaults).toMatchObject({
      ko: 'https://tseng-law.com/ko/faq',
      'zh-Hant': 'https://tseng-law.com/zh-hant/faq',
      ja: 'https://tseng-law.com/ja/faq',
      'x-default': 'https://tseng-law.com/ko/faq',
    });

    // Even an explicit four-locale set cannot re-introduce en.
    const explicit = getLanguageAlternates('/faq', ['ko', 'zh-hant', 'en', 'ja']);
    expect(explicit).not.toHaveProperty('en');
    expect(explicit).toHaveProperty('ja');
    expect(explicit).toHaveProperty('x-default');

    // Final page metadata output is en-free as well.
    const metadata = buildSeoMetadata({
      locale: 'ko',
      title: 'FAQ',
      description: '자주 묻는 질문',
      path: '/faq',
    });
    const languages = metadata.alternates?.languages as Record<string, string>;
    expect(languages).not.toHaveProperty('en');
    expect(languages).toHaveProperty('ja');
  });

  it('keeps en for indexable paths and classifies English-noindex paths', () => {
    expect(isEnglishNoindexPath('/about')).toBe(false);
    expect(isEnglishNoindexPath('/faq')).toBe(true);
    expect(isEnglishNoindexPath('/store')).toBe(true);
    expect(isEnglishNoindexPath('/events/taipei-seminar')).toBe(true);

    const about = getLanguageAlternates('/about');
    expect(about).toHaveProperty('en');
  });
});
