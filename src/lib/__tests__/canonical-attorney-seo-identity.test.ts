import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildLegalServiceJsonLd, buildWebsiteJsonLd } from '@/lib/seo';

const identitySourceFiles = [
  'src/lib/seo.ts',
  'src/lib/builder/seo/record-jsonld.ts',
  'src/lib/builder/columns/storage.ts',
  'src/app/llms.txt/route.ts',
] as const;

describe('canonical attorney SEO identity', () => {
  it('passes the public locale directly to global JSON-LD builders', () => {
    const layoutSource = readFileSync(path.join(process.cwd(), 'src/app/[locale]/layout.tsx'), 'utf8');

    expect(layoutSource).toContain('buildWebsiteJsonLd(locale)');
    expect(layoutSource).toContain('buildLegalServiceJsonLd(locale)');
    expect(layoutSource).not.toContain('buildWebsiteJsonLd(toBuilderLocale(locale))');
    expect(layoutSource).not.toContain('buildLegalServiceJsonLd(toBuilderLocale(locale))');
  });

  it('emits Japanese WebSite JSON-LD without an English locale or organization name', () => {
    const payload = buildWebsiteJsonLd('ja');
    const serialized = JSON.stringify(payload);

    expect(payload).toMatchObject({
      '@id': 'https://tseng-law.com/ja#website',
      name: '昊鼎国際法律事務所',
      url: 'https://tseng-law.com/ja',
      inLanguage: 'ja',
      potentialAction: {
        target: 'https://tseng-law.com/ja/search?q={search_term_string}',
      },
    });
    expect(serialized).not.toContain('/en');
    expect(serialized).not.toContain('Hovering International Law Firm');
  });

  it('preserves representative WebSite values for the existing locales', () => {
    expect(buildWebsiteJsonLd('ko')).toMatchObject({
      name: '법무법인 호정',
      url: 'https://tseng-law.com/ko',
      inLanguage: 'ko',
      potentialAction: {
        target: 'https://tseng-law.com/ko/search?q={search_term_string}',
      },
    });
    expect(buildWebsiteJsonLd('zh-hant')).toMatchObject({
      name: '昊鼎國際法律事務所',
      url: 'https://tseng-law.com/zh-hant',
      inLanguage: 'zh-Hant',
      potentialAction: {
        target: 'https://tseng-law.com/zh-hant/search?q={search_term_string}',
      },
    });
    expect(buildWebsiteJsonLd('en')).toMatchObject({
      name: 'Hovering International Law Firm',
      url: 'https://tseng-law.com/en',
      inLanguage: 'en',
      potentialAction: {
        target: 'https://tseng-law.com/en/search?q={search_term_string}',
      },
    });
  });

  it('emits localized Japanese LegalService and attorney routes', () => {
    const payload = buildLegalServiceJsonLd('ja');
    const serialized = JSON.stringify(payload);

    expect(payload).toMatchObject({
      name: '昊鼎国際法律事務所',
      url: 'https://tseng-law.com/ja',
      contactPoint: [
        {
          url: 'https://tseng-law.com/ja/contact',
        },
      ],
      employee: {
        name: '曾雋崴弁護士',
        url: 'https://tseng-law.com/ja/lawyers/wei-tseng',
      },
      address: {
        streetAddress: '台北市大同区承徳路一段35号7F-2',
      },
    });
    expect(serialized).not.toContain('/en');
    expect(serialized).not.toContain('Hovering International Law Firm');
    expect(serialized).not.toContain('Attorney Wei Tseng');
  });

  it('uses the canonical Traditional Chinese name in LegalService JSON-LD', () => {
    const payload = buildLegalServiceJsonLd('zh-hant');

    expect(payload).toMatchObject({
      name: '昊鼎國際法律事務所',
      url: 'https://tseng-law.com/zh-hant',
      contactPoint: [{ url: 'https://tseng-law.com/zh-hant/contact' }],
      employee: {
        name: '曾雋崴律師',
        url: 'https://tseng-law.com/zh-hant/lawyers/wei-tseng',
      },
      address: {
        streetAddress: '台北市大同區承德路一段35號7樓之2',
      },
    });
  });

  it('preserves the Korean and English LegalService employee names', () => {
    expect(buildLegalServiceJsonLd('ko')).toMatchObject({
      name: '법무법인 호정',
      url: 'https://tseng-law.com/ko',
      contactPoint: [{ url: 'https://tseng-law.com/ko/contact' }],
      employee: {
        name: '증준외 변호사',
        url: 'https://tseng-law.com/ko/lawyers/wei-tseng',
      },
      address: {
        streetAddress: '타이베이시 다퉁구 청더로 1단 35호 7층의2',
      },
    });
    expect(buildLegalServiceJsonLd('en')).toMatchObject({
      name: 'Hovering International Law Firm',
      url: 'https://tseng-law.com/en',
      contactPoint: [{ url: 'https://tseng-law.com/en/contact' }],
      employee: {
        name: 'Attorney Wei Tseng',
        url: 'https://tseng-law.com/en/lawyers/wei-tseng',
      },
      address: {
        streetAddress: '7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist.',
      },
    });
  });

  it('publishes the official email and localized consultation URL without a general telephone', () => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      const payload = buildLegalServiceJsonLd(locale);

      expect(payload).toMatchObject({
        email: 'wei@hoveringlaw.com.tw',
        contactPoint: [
          {
            email: 'wei@hoveringlaw.com.tw',
            url: `https://tseng-law.com/${locale}/contact`,
          },
        ],
      });
      expect(payload).not.toHaveProperty('telephone');
      expect(payload.contactPoint[0]).not.toHaveProperty('telephone');
      expect(JSON.stringify(payload)).not.toContain('+82-10-2992-9304');
    }
  });

  it('does not retain the incorrect Chinese name in identity source files', () => {
    for (const sourceFile of identitySourceFiles) {
      const source = readFileSync(path.join(process.cwd(), sourceFile), 'utf8');

      expect(source, sourceFile).not.toContain('曾俊瑋');
    }
  });
});
