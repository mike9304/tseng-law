import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import MessengerChatSection from '@/components/MessengerChatSection';
import AiConsultationSection from '@/components/consultation/AiConsultationSection';
import { contactPageContent } from '@/data/contact-page-content';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { siteLocales } from '@/lib/locales';

const verifiedEmail = 'wei@hoveringlaw.com.tw';
const consultationMailto = getConsultationPublicMailto('en').replace(/&/g, '&amp;');
const consultationSource = readFileSync(
  path.join(process.cwd(), 'src/components/consultation/AiConsultationSection.tsx'),
  'utf8',
);

function occurrences(value: string, fragment: string): number {
  return value.split(fragment).length - 1;
}

const japaneseGuideCopy = [
  'GUIDE',
  'ご相談前の確認事項',
  '連絡手段と案件に関する資料をあらかじめ整理していただくと、相談日程の調整や内容の確認がスムーズです。',
  'ご利用いただける連絡手段',
  'メールでお問い合わせいただけます。',
  'ご希望の相談形式がある場合は、ご連絡時にお知らせください。',
  'ご希望の使用言語がある場合は、ご連絡時にお知らせください。',
  'ご用意いただきたい資料',
  '契約書、見積書、公文書、メール、メッセージの履歴などの主要資料',
  '会社名、当事者に関する情報、主な出来事の日付、現在の進行状況',
  '写真、動画、判決書、届出書類など、事実関係を確認できる資料',
  'ご相談の流れ',
  'お問い合わせを受けた後、まず案件の種類と緊急性を確認します。',
  '必要に応じて追加資料をお願いし、適切な相談方法をご案内します。',
  '日程確定後、ご案内した方法で相談を行います。',
];

const prohibitedJapaneseContactClaims = [
  '公式チャンネル',
  '認証済み',
  '迅速な回答',
  'すぐに返信',
  '即時回答',
  '24時間',
  'ビザ',
  'Zoom',
  'Google Meet',
  '日本語で対応',
  '日本語対応を保証',
  '必ず対応',
  'LINE',
  'lin.ee',
  'KakaoTalk',
];

describe('verified public contact channels', () => {
  it('uses email as the sole direct channel in the public consultation SSOT', () => {
    for (const locale of siteLocales) {
      const content = contactPageContent[locale];

      expect(Object.keys(content)).toEqual(['messenger', 'direct']);
      expect(Object.keys(content.messenger)).toEqual(['primary']);
      expect(Object.keys(content.direct)).toEqual(['email']);
      expect(content.messenger.primary).toMatchObject({
        href: expect.stringContaining('mailto:wei@hoveringlaw.com.tw'),
      });
      expect(content.direct.email.value).toBe(verifiedEmail);
      expect(content.direct.email.href).toMatch(
        new RegExp(`^mailto:${verifiedEmail.replace('.', '\\.')}\\?subject=`),
      );
    }
  });

  it('renders the email consultation card without messenger links', () => {
    const html = renderToStaticMarkup(createElement(MessengerChatSection, { locale: 'en' }));

    expect(html).toContain('Email Consultation');
    expect(html).toContain('wei@hoveringlaw.com.tw');
    expect(html).not.toContain('KakaoTalk');
    expect(html).not.toContain('LINE');
    expect(occurrences(html, 'messenger-card messenger-card--')).toBe(1);
    expect(html).toContain(`href="${consultationMailto}"`);
  });

  it('renders the complete reviewed Japanese consultation guide without locale fallback', () => {
    const html = renderToStaticMarkup(createElement(ConsultationGuideSection, { locale: 'ja' }));

    for (const line of japaneseGuideCopy) {
      expect(html).toContain(line);
    }
    expect(html).not.toContain('Before You Contact Us');
    expect(html).not.toContain('諮詢前可先確認的事項');
    expect(html).not.toContain('Zoom');
    expect(html).not.toContain('Google Meet');
    expect(html).not.toContain('KakaoTalk');
  });

  it('renders the complete reviewed Japanese email consultation copy', () => {
    const html = renderToStaticMarkup(createElement(MessengerChatSection, { locale: 'ja' }));
    const guideHtml = renderToStaticMarkup(createElement(ConsultationGuideSection, { locale: 'ja' }));
    const japaneseContactHtml = `${guideHtml}${html}`;

    for (const line of [
      'EMAIL',
      'メールでのご相談',
      'ご相談は公式メールアドレス宛にお送りください。確認後ご案内します。',
      '公式相談メール',
      'wei@hoveringlaw.com.tw',
      'メールでご相談いただける内容',
    ]) {
      expect(html).toContain(line);
    }
    expect(html).not.toContain('KakaoTalk');
    expect(html).not.toContain('LINE');
    for (const prohibitedClaim of prohibitedJapaneseContactClaims) {
      expect(japaneseContactHtml).not.toContain(prohibitedClaim);
    }
    expect(occurrences(html, '<a ')).toBe(1);
  });

  it('preserves representative Korean, Traditional Chinese, and English guide copy', () => {
    const expectations = [
      ['ko', '상담 전 확인 사항', '이메일로 문의를 접수할 수 있습니다.'],
      ['zh-hant', '諮詢前可先確認的事項', '可透過電子郵件提出詢問。'],
      ['en', 'Before You Contact Us', 'You can reach us through email.'],
    ] as const;

    for (const [locale, title, channelLine] of expectations) {
      const html = renderToStaticMarkup(createElement(ConsultationGuideSection, { locale }));
      expect(html).toContain(title);
      expect(html).toContain(channelLine);
    }
  });

  it('preserves representative Korean, Traditional Chinese, and English messenger copy', () => {
    const expectations = [
      ['ko', '이메일 상담', '상담 문의는 공식 이메일로 보내주시면 확인 후 안내해 드립니다.'],
      ['zh-hant', '電子郵件諮詢', '請將諮詢內容寄至官方電子郵件信箱，我們確認後回覆。'],
      ['en', 'Email Consultation', 'Please send consultation inquiries to our official email address for follow-up.'],
    ] as const;

    for (const [locale, title, description] of expectations) {
      const html = renderToStaticMarkup(createElement(MessengerChatSection, { locale }));
      expect(html).toContain(title);
      expect(html).toContain(description);
      expect(occurrences(html, '<a ')).toBe(1);
      expect(html).toContain('wei@hoveringlaw.com.tw');
    }
  });

  it('uses email as the sole direct CTA in the consultation fallback', () => {
    const html = renderToStaticMarkup(createElement(AiConsultationSection, { locale: 'en' }));

    expect(consultationSource).not.toContain('contactPageContent');
    expect(html).not.toContain('pf.kakao.com');
    expect(html).not.toContain('href="tel:');
    expect(html).toContain(`href="${consultationMailto}"`);
    expect(html).toContain(`Email consultation</span><strong>${verifiedEmail}</strong>`);
  });
});
