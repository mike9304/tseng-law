import { describe, expect, it } from 'vitest';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { buildBuilderRecordJsonLd } from '@/lib/builder/seo/record-jsonld';
import { locales } from '@/lib/locales';
import { buildLegalServiceJsonLd } from '@/lib/seo';

const SITE_URL = 'https://tseng-law.test';
const FIRM_AVAILABLE_LANGUAGES = ['ko', 'zh-Hant', 'en', 'ja'] as const;
const SERVICE_AVAILABLE_LANGUAGES = ['English', 'Chinese', 'Japanese', 'Korean'] as const;
const INDIVIDUAL_ENGLISH_MARKERS = /English|영어|英文|英語/;

describe('buildBuilderRecordJsonLd', () => {
  it('returns Article schema for a known columns record', () => {
    const payload = buildBuilderRecordJsonLd({
      collectionId: 'columns',
      locale: 'ko',
      recordSlug: 'taiwan-company-establishment-basics',
      siteUrl: SITE_URL,
    });
    expect(payload).not.toBeNull();
    expect(payload).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Article',
      url: 'https://tseng-law.test/ko/columns/taiwan-company-establishment-basics',
    });
    expect((payload as { headline?: unknown }).headline).toBeTruthy();
    expect((payload as { datePublished?: unknown }).datePublished).toBeTruthy();
  });

  it('returns LegalService schema for a service-area record', () => {
    const payload = buildBuilderRecordJsonLd({
      collectionId: 'service-areas',
      locale: 'ko',
      recordSlug: 'investment',
      siteUrl: SITE_URL,
    });
    expect(payload).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      url: 'https://tseng-law.test/ko/services/investment',
      areaServed: 'Taiwan',
    });
    expect((payload as { name?: unknown }).name).toBeTruthy();
    expect((payload as { availableLanguage?: string[] }).availableLanguage).toContain('Korean');
  });

  it('uses the canonical Traditional Chinese attorney name for a service-area record', () => {
    const payload = buildBuilderRecordJsonLd({
      collectionId: 'service-areas',
      locale: 'zh-hant',
      recordSlug: 'investment',
      siteUrl: SITE_URL,
    });

    expect(payload).toMatchObject({
      employee: {
        name: '曾雋崴律師',
      },
    });
  });

  it('returns Attorney schema for a known attorney profile record', () => {
    const payload = buildBuilderRecordJsonLd({
      collectionId: 'attorney-profiles',
      locale: 'ko',
      recordSlug: 'wei-tseng',
      siteUrl: SITE_URL,
    });
    expect(payload).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Attorney',
      url: 'https://tseng-law.test/ko/lawyers/wei-tseng',
    });
    expect((payload as { name?: unknown }).name).toBeTruthy();
  });

  it('returns null for an unknown slug', () => {
    expect(
      buildBuilderRecordJsonLd({
        collectionId: 'columns',
        locale: 'ko',
        recordSlug: 'no-such-column',
        siteUrl: SITE_URL,
      }),
    ).toBeNull();
    expect(
      buildBuilderRecordJsonLd({
        collectionId: 'columns',
        locale: 'ko',
        recordSlug: '',
        siteUrl: SITE_URL,
      }),
    ).toBeNull();
  });

  it('builds locale-specific service URLs and language order', () => {
    const ko = buildBuilderRecordJsonLd({
      collectionId: 'service-areas',
      locale: 'ko',
      recordSlug: 'investment',
      siteUrl: SITE_URL,
    });
    const en = buildBuilderRecordJsonLd({
      collectionId: 'service-areas',
      locale: 'en',
      recordSlug: 'investment',
      siteUrl: SITE_URL,
    });
    expect((ko as { url?: string }).url).toBe('https://tseng-law.test/ko/services/investment');
    expect((en as { url?: string }).url).toBe('https://tseng-law.test/en/services/investment');
    expect((ko as { availableLanguage?: string[] }).availableLanguage?.[0]).toBe('Korean');
    expect((en as { availableLanguage?: string[] }).availableLanguage?.[0]).toBe('English');
  });

  it.each(locales)(
    'uses the official individual three languages, not English, for Person in %s',
    (locale) => {
      const profile = getAttorneyProfile(locale, primaryAttorneySlug);
      const payload = buildBuilderRecordJsonLd({
        collectionId: 'attorney-profiles',
        locale,
        recordSlug: primaryAttorneySlug,
        siteUrl: SITE_URL,
      });

      expect(profile?.languages).toHaveLength(3);
      expect(payload).toMatchObject({
        '@type': 'Attorney',
        knowsLanguage: profile?.languages,
      });
      expect((payload as { knowsLanguage?: unknown[] }).knowsLanguage).toHaveLength(3);
      expect(JSON.stringify((payload as { knowsLanguage?: unknown }).knowsLanguage)).not.toMatch(
        INDIVIDUAL_ENGLISH_MARKERS,
      );
      expect(payload).not.toHaveProperty('hasCredential');
      expect(payload).not.toHaveProperty('award');
    },
  );

  it.each(locales)(
    'leaves firm four-language availability unaffected for %s',
    (locale) => {
      const firm = buildLegalServiceJsonLd(locale) as {
        knowsLanguage?: string[];
        contactPoint?: Array<{ availableLanguage?: string[] }>;
      };
      const service = buildBuilderRecordJsonLd({
        collectionId: 'service-areas',
        locale,
        recordSlug: 'investment',
        siteUrl: SITE_URL,
      });

      expect(firm.knowsLanguage).toEqual([...FIRM_AVAILABLE_LANGUAGES]);
      expect(firm.contactPoint?.[0]?.availableLanguage).toEqual([...FIRM_AVAILABLE_LANGUAGES]);
      expect((service as { availableLanguage?: string[] }).availableLanguage).toContain('English');
    },
  );

  it.each(locales)(
    'lists English, Chinese, Japanese, and Korean on service-area availableLanguage for %s',
    (locale) => {
      const service = buildBuilderRecordJsonLd({
        collectionId: 'service-areas',
        locale,
        recordSlug: 'investment',
        siteUrl: SITE_URL,
      });
      const languages = (service as { availableLanguage?: string[] }).availableLanguage ?? [];

      expect(languages).toHaveLength(4);
      expect(languages).toEqual(expect.arrayContaining([...SERVICE_AVAILABLE_LANGUAGES]));
      expect(new Set(languages).size).toBe(4);
    },
  );
});
