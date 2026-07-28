import { describe, expect, it, vi } from 'vitest';
import { generateMetadata } from '@/app/[locale]/layout';

// next/font/google returns font instances only under Next's build-time loader;
// mock it (same shape as reveal-lifecycle.test.ts) so layout import works in vitest.
vi.mock('next/font/google', () => {
  const font = (options: { variable: string }) => ({
    className: 'font-test',
    style: { fontFamily: 'font-test' },
    variable: options.variable,
  });
  return {
    Noto_Sans_KR: font,
    Noto_Sans_TC: font,
    Noto_Serif_KR: font,
    Noto_Serif_TC: font,
  };
});
import { siteContent } from '@/data/site-content';
import type { SiteLocale } from '@/lib/locales';
import { buildLegalServiceJsonLd, buildWebsiteJsonLd } from '@/lib/seo';

const localeExpectations: Record<
  SiteLocale,
  {
    organizationName: string;
    attorneyName: string;
    language: string;
  }
> = {
  ko: {
    organizationName: '법무법인 호정',
    attorneyName: '증준외 변호사',
    language: 'ko',
  },
  'zh-hant': {
    organizationName: '昊鼎國際法律事務所',
    attorneyName: '曾雋崴律師',
    language: 'zh-Hant',
  },
  en: {
    organizationName: 'Hovering International Law Firm',
    attorneyName: 'Attorney Wei Tseng',
    language: 'en',
  },
  ja: {
    organizationName: '昊鼎国際法律事務所',
    attorneyName: '曾雋崴弁護士',
    language: 'ja',
  },
};

const bcp47Languages = ['ko', 'zh-Hant', 'en', 'ja'];
const organizationId = 'https://tseng-law.com/#organization';

describe.each(Object.entries(localeExpectations) as Array<
  [SiteLocale, (typeof localeExpectations)[SiteLocale]]
>)('global SEO locale integrity: %s', (locale, expected) => {
  it('keeps page metadata while localizing inherited organization fields', () => {
    const metadata = generateMetadata({ params: { locale } });

    expect(metadata.title).toBe(siteContent[locale].meta.title);
    expect(metadata.description).toBe(siteContent[locale].meta.description);
    expect(metadata.applicationName).toBe(expected.organizationName);
    expect(metadata.authors).toEqual([{ name: expected.organizationName }]);
    expect(metadata.creator).toBe(expected.organizationName);
    expect(metadata.publisher).toBe(expected.organizationName);

    if (locale !== 'ko') {
      expect([
        metadata.applicationName,
        metadata.authors,
        metadata.creator,
        metadata.publisher,
      ]).not.toContain('법무법인 호정');
      expect(JSON.stringify(metadata.authors)).not.toContain('법무법인 호정');
    }
  });

  it('localizes the WebSite publisher while sharing a neutral organization ID', () => {
    const payload = buildWebsiteJsonLd(locale);
    const localeRoot = `https://tseng-law.com/${locale}`;

    expect(payload).toMatchObject({
      '@id': `${localeRoot}#website`,
      name: expected.organizationName,
      url: localeRoot,
      inLanguage: expected.language,
      publisher: {
        '@id': organizationId,
        name: expected.organizationName,
        url: localeRoot,
      },
    });
  });

  it('uses localized LegalService identities and BCP 47 language values', () => {
    const payload = buildLegalServiceJsonLd(locale);
    const localeRoot = `https://tseng-law.com/${locale}`;

    expect(payload).toMatchObject({
      '@id': organizationId,
      name: expected.organizationName,
      url: localeRoot,
      knowsLanguage: bcp47Languages,
      contactPoint: [
        {
          availableLanguage: bcp47Languages,
          url: `${localeRoot}/contact`,
        },
      ],
      employee: {
        name: expected.attorneyName,
        url: `${localeRoot}/lawyers/wei-tseng`,
      },
    });
    expect(payload).not.toHaveProperty('availableLanguage');
    expect(payload).not.toHaveProperty('inLanguage');
  });
});
