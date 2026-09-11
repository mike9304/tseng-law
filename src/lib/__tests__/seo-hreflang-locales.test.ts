import { describe, expect, it } from 'vitest';
import { siteLocales } from '@/lib/locales';
import { buildGuidanceCoreLanguageAlternates } from '@/lib/public-guidance';
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
      'x-default': 'https://tseng-law.com/en/about',
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
      // x-default must not target the noindexed /en page — it falls back to ko.
      'x-default': 'https://tseng-law.com/ko/faq',
    });

    // Even an explicit four-locale set cannot re-introduce en.
    const explicit = getLanguageAlternates('/faq', ['ko', 'zh-hant', 'en', 'ja']);
    expect(explicit).not.toHaveProperty('en');
    expect(explicit).toHaveProperty('ja');
    expect(explicit['x-default']).toBe('https://tseng-law.com/ko/faq');

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

/**
 * WO-B2B-R1 §3-b. `/{vi,id,th,fil}/company-setup` claims the four intent
 * landings as its ko/zh-hant/en/ja alternates, so those landings have to claim
 * the four guidance URLs back. The landings build their metadata through
 * `buildSeoMetadata`, so this merge reaches the HTML head as well as the
 * sitemap — asserted below so the head output is a checked contract rather than
 * a side effect.
 */
describe('intent-landing hreflang reciprocity (WO-B2B-R1 §3)', () => {
  for (const { path, pageKey } of [
    { path: '/taiwan-company-setup-lawyer', pageKey: 'company-setup' },
    { path: '/taiwan-litigation-lawyer', pageKey: 'debt-collection' },
  ] as const) {
    it(`merges the four guidance alternates into ${path}`, () => {
      const languages = getLanguageAlternates(path);

      expect(languages).toEqual({
        ko: `https://tseng-law.com/ko${path}`,
        'zh-Hant': `https://tseng-law.com/zh-hant${path}`,
        en: `https://tseng-law.com/en${path}`,
        ja: `https://tseng-law.com/ja${path}`,
        vi: `https://tseng-law.com/vi/${pageKey}`,
        id: `https://tseng-law.com/id/${pageKey}`,
        th: `https://tseng-law.com/th/${pageKey}`,
        fil: `https://tseng-law.com/fil/${pageKey}`,
        'x-default': `https://tseng-law.com/en${path}`,
      });
      expect(Object.keys(languages).filter((tag) => tag !== 'x-default')).toHaveLength(8);

      // The sitemap's STATIC_PATHS loop passes the three-locale set and lets
      // `addReciprocalJapaneseAlternates` supply `ja`; the merge is independent
      // of which site locales the caller asked for.
      const threeLocale = getLanguageAlternates(path, ['ko', 'zh-hant', 'en']);
      expect(threeLocale).not.toHaveProperty('ja');
      expect(threeLocale.vi).toBe(`https://tseng-law.com/vi/${pageKey}`);

      // Reciprocal: each side names the other.
      const guidanceSide = buildGuidanceCoreLanguageAlternates(pageKey);
      expect(guidanceSide.en).toBe(languages['x-default']);
      expect(languages.vi).toBe(guidanceSide.vi);
      expect(guidanceSide.ja).toBe(languages.ja);
    });

    it(`emits those alternates in the ${path} page metadata (HTML head)`, () => {
      const metadata = buildSeoMetadata({
        locale: 'en',
        title: 'Taiwan lawyer',
        description: 'Intent landing.',
        path,
        alternateLocales: siteLocales,
      });
      const languages = metadata.alternates?.languages as Record<string, string>;

      expect(languages).toEqual(getLanguageAlternates(path, siteLocales));
      for (const guidanceLocale of ['vi', 'id', 'th', 'fil'] as const) {
        expect(languages[guidanceLocale]).toBe(
          `https://tseng-law.com/${guidanceLocale}/${pageKey}`,
        );
      }
    });
  }

  it('leaves the other intent landings on their four-language set', () => {
    for (const path of ['/taiwan-lawyer', '/korean-lawyer-in-taiwan', '/guides/taiwan-company-setup']) {
      const languages = getLanguageAlternates(path);
      for (const guidanceLocale of ['vi', 'id', 'th', 'fil']) {
        expect(languages, `${path} must not claim ${guidanceLocale}`).not.toHaveProperty(
          guidanceLocale,
        );
      }
    }
  });
});
