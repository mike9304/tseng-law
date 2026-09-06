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
    expect(legalPageContent.en.privacy.sections[6].paragraphs[0]).toMatch(
      /Submit sensitive materials only by a secure method.*attorney’s instructions/,
    );
    expect(legalPageContent.ja.privacy.sections[6].paragraphs[0]).toMatch(
      /機微な資料は、弁護士の案内に従い、安全な方法でご提出ください/,
    );
  });

  it.each([
    ['en', /click alone does not send your draft, submit a consultation request, or give consent/i, /When your email reaches us.*address.*attachments/],
    ['ja', /選択だけでは、下書きの送信、相談の申し込み、相談内容の個人情報処理への同意は行われません/, /メールが当事務所に届くと.*メールアドレス.*添付ファイル/],
  ] as const)('distinguishes email-link selection from sending, consent, and receipt in %s', (locale, selection, receipt) => {
    const collection = legalPageContent[locale].privacy.sections[0].paragraphs.join(' ');

    expect(collection).toContain('wei@hoveringlaw.com.tw');
    expect(collection).toMatch(selection);
    expect(collection).toMatch(receipt);
  });

  it.each([
    {
      locale: 'en',
      fields: /browser-session identifier, pages viewed, referral source, language, time spent on a page, scroll depth, and selection of an email inquiry link/,
      storage: /Browser session storage may hold the identifier/,
      excludedContent: /email draft and attachments are not included in that selection record/,
      limitedIpClaim: /IP addresses are not stored in these visitor-analytics events.*may be used separately for security and request limits/,
      otherAnalytics: /other analytics tools.*require review/,
    },
    {
      locale: 'ja',
      fields: /セッション識別子、閲覧ページ、参照元、言語、ページ滞在時間、スクロール位置、相談用メールリンクの選択/,
      storage: /識別子をブラウザのセッションストレージに保存する場合/,
      excludedContent: /リンクの選択記録に、メールの下書きや添付ファイルは含まれません/,
      limitedIpClaim: /訪問分析イベントにはIPアドレスを保存しませんが.*セキュリティやリクエスト数の制限.*別途利用する場合/,
      otherAnalytics: /その他の分析ツール.*確認が必要/,
    },
  ] as const)('discloses visit-record scope without equating it to email content in $locale', ({ locale, fields, storage, excludedContent, limitedIpClaim, otherAnalytics }) => {
    const browserStorage = legalPageContent[locale].privacy.sections[4].paragraphs.join(' ');

    for (const fact of [fields, storage, excludedContent, limitedIpClaim, otherAnalytics]) {
      expect(browserStorage).toMatch(fact);
    }
  });
});
