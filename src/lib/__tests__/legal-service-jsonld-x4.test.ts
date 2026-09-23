import { describe, expect, it } from 'vitest';
import { siteLocales } from '@/lib/locales';
import { buildLegalServiceJsonLd, getConsultationLanguageTags, getLanguageAlternates } from '@/lib/seo';

// WO-X4 (GOAL-EN-JA-2026 G7): EN/JA/KO technical SEO alignment.
const FOUR_CONSULTATION_LANGUAGES = ['en', 'ja', 'ko', 'zh-Hant'];

describe('WO-X4 LegalService JSON-LD', () => {
  it.each(siteLocales)('serves the United States alongside Taiwan, Korea and Japan on %s', (locale) => {
    expect(buildLegalServiceJsonLd(locale).areaServed).toEqual([
      'Taiwan',
      'United States',
      'South Korea',
      'Japan',
    ]);
  });

  it.each([
    ['en', 'en'],
    ['ja', 'ja'],
    ['ko', 'ko'],
    ['zh-hant', 'zh-Hant'],
  ] as const)('puts the %s page language (%s) first in knowsLanguage and availableLanguage', (locale, tag) => {
    const payload = buildLegalServiceJsonLd(locale);
    expect(payload.knowsLanguage[0]).toBe(tag);
    expect(payload.contactPoint[0]?.availableLanguage[0]).toBe(tag);
    expect(payload.contactPoint[0]?.availableLanguage).toEqual(payload.knowsLanguage);
  });

  it.each(siteLocales)('never grows or shrinks the four consultation languages on %s', (locale) => {
    const tags = getConsultationLanguageTags(locale);
    expect(tags).toHaveLength(4);
    expect([...tags].sort()).toEqual(FOUR_CONSULTATION_LANGUAGES);
  });

  it('keeps the Korean order byte-identical to the pre-X4 output', () => {
    expect(buildLegalServiceJsonLd('ko').knowsLanguage).toEqual(['ko', 'zh-Hant', 'en', 'ja']);
  });
});

describe('WO-X4 /faq hreflang follows the EN FAQ noindex policy', () => {
  it('does not advertise the noindex /en/faq as an alternate of /ja/faq', () => {
    const languages = getLanguageAlternates('/faq');
    expect(languages).not.toHaveProperty('en');
    expect(languages.ja).toBe('https://tseng-law.com/ja/faq');
  });
});
