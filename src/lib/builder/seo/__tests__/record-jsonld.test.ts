import { describe, expect, it } from 'vitest';
import { buildBuilderRecordJsonLd } from '@/lib/builder/seo/record-jsonld';

const SITE_URL = 'https://tseng-law.test';

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
});
