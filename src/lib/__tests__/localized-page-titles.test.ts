import { describe, expect, it } from 'vitest';
import { getHomeLegacyMetadata } from '@/app/[locale]/(legacy)/home-legacy';
import type { SiteLocale } from '@/lib/locales';
import {
  buildLocalizedPageTitle,
  buildSeoMetadata,
  DEFAULT_SOCIAL_IMAGE_PATH,
  stripOrganizationNameSuffix,
} from '@/lib/seo';

const expectations: Array<[SiteLocale, string]> = [
  ['ko', '법무법인 호정'],
  ['zh-hant', '昊鼎國際法律事務所'],
  ['en', 'Hovering International Law Firm'],
  ['ja', '昊鼎国際法律事務所'],
];

describe('localized page titles', () => {
  it.each(expectations)('appends exactly one %s brand suffix', (locale, brand) => {
    expect(buildLocalizedPageTitle('Services', locale)).toBe(`Services | ${brand}`);
    expect(buildLocalizedPageTitle(`Services | ${brand}`, locale)).toBe(`Services | ${brand}`);
    expect(buildLocalizedPageTitle(`Services | ${brand} | ${brand}`, locale)).toBe(`Services | ${brand}`);
  });

  it('normalizes legacy dash-separated and cross-locale suffixes', () => {
    expect(stripOrganizationNameSuffix('한국어 가능한 대만 변호사 — 법무법인 호정')).toBe(
      '한국어 가능한 대만 변호사',
    );
    expect(
      buildLocalizedPageTitle(
        'Korean-Speaking Taiwan Lawyer — Hovering International Law Firm',
        'ko',
      ),
    ).toBe('Korean-Speaking Taiwan Lawyer | 법무법인 호정');
  });

  it('keeps page metadata keyword-only for the locale layout template', () => {
    const metadata = buildSeoMetadata({
      locale: 'ja',
      title: 'お問い合わせ | 昊鼎国際法律事務所',
      description: 'お問い合わせ',
      path: '/contact',
    });

    expect(metadata.title).toBe('お問い合わせ');
    expect(metadata.openGraph?.title).toBe('お問い合わせ | 昊鼎国際法律事務所');
    expect(metadata.twitter?.title).toBe('お問い合わせ | 昊鼎国際法律事務所');
  });

  it.each(expectations)('uses the dedicated social image by default for %s', (locale) => {
    const metadata = buildSeoMetadata({
      locale,
      title: 'Default social image',
      description: 'Default social image coverage',
    });
    const expectedImage = `https://tseng-law.com${DEFAULT_SOCIAL_IMAGE_PATH}`;

    expect(metadata.openGraph?.images).toEqual([{ url: expectedImage }]);
    expect(metadata.twitter?.images).toEqual([expectedImage]);
  });

  it('produces the exact required Korean homepage title after templating', () => {
    const metadata = getHomeLegacyMetadata('ko');
    expect(metadata.title).toBe('대만 변호사·회사설립·소송');
    expect(buildLocalizedPageTitle(String(metadata.title), 'ko')).toBe(
      '대만 변호사·회사설립·소송 | 법무법인 호정',
    );
  });
});
