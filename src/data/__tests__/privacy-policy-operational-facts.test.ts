import { describe, expect, it } from 'vitest';
import { legalPageContent } from '@/data/legal-pages';
import { siteLocales } from '@/lib/locales';

describe('privacy policy operational facts', () => {
  it('documents the code-confirmed processors without presenting unknown deployment facts as settled', () => {
    for (const locale of siteLocales) {
      const policy = legalPageContent[locale].privacy;
      const text = policy.sections
        .flatMap((section) => [section.title, ...section.paragraphs, ...(section.items ?? [])])
        .join(' ');

      expect(text).toContain('Vercel');
      expect(text).toContain('OpenAI');
      expect(text).toContain('90');
      expect(text).toContain('wei@hoveringlaw.com.tw');
    }

    expect(JSON.stringify(legalPageContent.ko.privacy)).toContain('운영자 확인');
    expect(JSON.stringify(legalPageContent['zh-hant'].privacy)).toContain('營運者確認');
    expect(JSON.stringify(legalPageContent.en.privacy)).toContain('operator confirmation');
    expect(JSON.stringify(legalPageContent.ja.privacy)).toContain('運営者による確認');
  });

  it('warns against sending sensitive identity and banking material in every locale', () => {
    for (const locale of siteLocales) {
      const text = JSON.stringify(legalPageContent[locale].privacy);
      expect(text).toMatch(/passport|旅券|護照|여권/i);
      expect(text).toMatch(/bank|銀行|계좌/i);
    }
  });
});
