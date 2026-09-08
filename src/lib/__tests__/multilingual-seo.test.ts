import { describe, expect, it } from 'vitest';
import { buildSeoMetadata, getLanguageAlternates } from '@/lib/seo';
import {
  GUIDANCE_PAGE_KEYS,
  buildGuidanceCoreLanguageAlternates,
} from '@/lib/public-guidance';

describe('multilingual SEO language alternates', () => {
  it('uses the actual eight-language cluster on every core path', () => {
    for (const pageKey of GUIDANCE_PAGE_KEYS) {
      const path = pageKey === 'home' ? '' : `/${pageKey}`;
      const expected = buildGuidanceCoreLanguageAlternates(pageKey);
      expect(getLanguageAlternates(path)).toEqual(expected);
      expect(getLanguageAlternates(path, ['ko'])).toEqual(expected);

      if (pageKey === 'faq') {
        expect(Object.keys(expected).filter((tag) => tag !== 'x-default')).toHaveLength(7);
        expect(expected).not.toHaveProperty('en');
        expect(expected['x-default']).toBe('https://tseng-law.com/ko/faq');
      } else {
        expect(Object.keys(expected).filter((tag) => tag !== 'x-default')).toHaveLength(8);
        expect(expected).toMatchObject({
          ko: `https://tseng-law.com/ko${path}`,
          'zh-Hant': `https://tseng-law.com/zh-hant${path}`,
          en: `https://tseng-law.com/en${path}`,
          ja: `https://tseng-law.com/ja${path}`,
          vi: `https://tseng-law.com/vi${path}`,
          id: `https://tseng-law.com/id${path}`,
          th: `https://tseng-law.com/th${path}`,
          fil: `https://tseng-law.com/fil${path}`,
          'x-default': `https://tseng-law.com/en${path}`,
        });
        expect(expected).not.toHaveProperty('zh-hant');
      }
    }
  });

  it('keeps eight-language home and contact metadata reciprocal, including JA', () => {
    const home = buildSeoMetadata({
      locale: 'ko',
      title: '홈',
      description: '법무법인 호정',
      path: '',
    });
    const contact = buildSeoMetadata({
      locale: 'ja',
      title: 'お問い合わせ',
      description: '連絡先',
      path: '/contact',
    });

    expect(home.alternates?.languages).toEqual(buildGuidanceCoreLanguageAlternates('home'));
    expect(contact.alternates?.languages).toEqual(buildGuidanceCoreLanguageAlternates('contact'));
  });

  it('does not invent eight-language alternates for deep articles, US landings, or service details', () => {
    const article = getLanguageAlternates('/columns/taiwan-investment', ['ko', 'zh-hant', 'en', 'ja']);
    const usLanding = getLanguageAlternates('/taiwan-lawyer');
    const serviceDetail = getLanguageAlternates('/services/investment', ['ko', 'zh-hant', 'en', 'ja']);
    const account = getLanguageAlternates('/account/settings', ['ko', 'en']);

    for (const languages of [article, usLanding, serviceDetail, account]) {
      expect(languages).not.toHaveProperty('vi');
      expect(languages).not.toHaveProperty('id');
      expect(languages).not.toHaveProperty('th');
      expect(languages).not.toHaveProperty('fil');
    }

    expect(article).toEqual({
      ko: 'https://tseng-law.com/ko/columns/taiwan-investment',
      'zh-Hant': 'https://tseng-law.com/zh-hant/columns/taiwan-investment',
      en: 'https://tseng-law.com/en/columns/taiwan-investment',
      ja: 'https://tseng-law.com/ja/columns/taiwan-investment',
      'x-default': 'https://tseng-law.com/en/columns/taiwan-investment',
    });
    expect(usLanding).toMatchObject({
      ko: 'https://tseng-law.com/ko/taiwan-lawyer',
      'zh-Hant': 'https://tseng-law.com/zh-hant/taiwan-lawyer',
      en: 'https://tseng-law.com/en/taiwan-lawyer',
      ja: 'https://tseng-law.com/ja/taiwan-lawyer',
    });
    expect(serviceDetail).toEqual({
      ko: 'https://tseng-law.com/ko/services/investment',
      'zh-Hant': 'https://tseng-law.com/zh-hant/services/investment',
      en: 'https://tseng-law.com/en/services/investment',
      ja: 'https://tseng-law.com/ja/services/investment',
      'x-default': 'https://tseng-law.com/en/services/investment',
    });
  });

  it('honors a meaningful caller-specified subset only on non-core paths', () => {
    expect(getLanguageAlternates('/services/investment', ['ko', 'zh-hant'])).toEqual({
      ko: 'https://tseng-law.com/ko/services/investment',
      'zh-Hant': 'https://tseng-law.com/zh-hant/services/investment',
      'x-default': 'https://tseng-law.com/en/services/investment',
    });
    expect(getLanguageAlternates('/store', ['ko', 'zh-hant'])).toEqual({
      ko: 'https://tseng-law.com/ko/store',
      'zh-Hant': 'https://tseng-law.com/zh-hant/store',
      'x-default': 'https://tseng-law.com/ko/store',
    });
    expect(getLanguageAlternates('/store')).not.toHaveProperty('en');
    expect(getLanguageAlternates('/store')).not.toHaveProperty('vi');
  });
});
