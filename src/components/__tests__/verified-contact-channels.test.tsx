import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ConsultationGuideSection from '@/components/ConsultationGuideSection';
import MessengerChatSection from '@/components/MessengerChatSection';
import AiConsultationSection from '@/components/consultation/AiConsultationSection';
import { contactPageContent } from '@/data/contact-page-content';
import { siteLocales } from '@/lib/locales';

const verifiedMessengerHref = 'https://pf.kakao.com/_hojeong/chat';
const verifiedEmail = 'wei@hoveringlaw.com.tw';
const verifiedPhone = '+82-10-2992-9304';
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
  'KakaoTalk、メール、電話でお問い合わせいただけます。',
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

const japaneseMessengerCopy = [
  'MESSENGER',
  'メッセンジャーでのお問い合わせ',
  'KakaoTalkチャンネルからお問い合わせいただけます。',
  'KakaoTalkチャンネルでお問い合わせ',
  'メッセージをお送りください。確認後、相談方法をご案内します。',
  'KakaoTalkでお問い合わせいただける内容',
  '会社設立・投資に関するお問い合わせ',
  '訴訟・紛争に関するお問い合わせ',
  '相談方法・日程のご案内',
  '資料送付に関する事前確認',
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
];

describe('verified public contact channels', () => {
  it('exposes one required primary messenger for every public locale', () => {
    for (const locale of siteLocales) {
      const content = contactPageContent[locale];

      expect(Object.keys(content.messenger)).toEqual(['primary']);
      expect(content.messenger.primary).toMatchObject({
        href: verifiedMessengerHref,
        platform: 'KakaoTalk',
      });
      expect(content.messenger.primary.label).not.toHaveLength(0);
      expect(content.direct.email).toMatchObject({
        value: verifiedEmail,
        href: `mailto:${verifiedEmail}`,
      });
      expect(content.direct.phone).toMatchObject({
        value: verifiedPhone,
        href: 'tel:+821029929304',
      });
      expect(content.offices.offices[0]?.phone).toBe(verifiedPhone);
    }
  });

  it('renders one verified messenger card and link', () => {
    const html = renderToStaticMarkup(createElement(MessengerChatSection, { locale: 'en' }));

    expect(occurrences(html, `href="${verifiedMessengerHref}"`)).toBe(1);
    expect(occurrences(html, 'KakaoTalk')).toBe(1);
    expect(occurrences(html, 'messenger-card messenger-card--')).toBe(1);
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
    expect(html).not.toContain('日本語で対応');
  });

  it('renders the complete reviewed Japanese messenger with one canonical KakaoTalk link', () => {
    const html = renderToStaticMarkup(createElement(MessengerChatSection, { locale: 'ja' }));
    const guideHtml = renderToStaticMarkup(createElement(ConsultationGuideSection, { locale: 'ja' }));
    const japaneseContactHtml = `${guideHtml}${html}`;

    for (const line of japaneseMessengerCopy) {
      expect(html).toContain(line);
    }
    expect(html).not.toContain('Messenger Consultation');
    expect(html).not.toContain('即時通訊諮詢');
    expect(html).not.toContain('verified');
    expect(html).not.toContain('認証');
    for (const prohibitedClaim of prohibitedJapaneseContactClaims) {
      expect(japaneseContactHtml).not.toContain(prohibitedClaim);
    }
    expect(occurrences(html, '<a ')).toBe(1);
    expect(occurrences(html, `href="${verifiedMessengerHref}"`)).toBe(1);
    expect(html).toContain(
      '<h3 class="messenger-card-platform" style="text-transform:none">KakaoTalkチャンネルでお問い合わせ</h3>',
    );
    expect(html).toContain(
      `href="${verifiedMessengerHref}" class="messenger-card messenger-card--primary messenger-card--kakao" target="_blank" rel="noopener noreferrer"`,
    );
  });

  it('preserves representative Korean, Traditional Chinese, and English guide copy', () => {
    const expectations = [
      ['ko', '상담 전 확인 사항', '카카오톡, 이메일, 전화로 문의를 접수할 수 있습니다.'],
      ['zh-hant', '諮詢前可先確認的事項', '可透過 KakaoTalk、電子郵件與電話提出詢問。'],
      ['en', 'Before You Contact Us', 'You can reach us through KakaoTalk, email, or phone.'],
    ] as const;

    for (const [locale, title, channelLine] of expectations) {
      const html = renderToStaticMarkup(createElement(ConsultationGuideSection, { locale }));
      expect(html).toContain(title);
      expect(html).toContain(channelLine);
    }
  });

  it('preserves representative Korean, Traditional Chinese, and English messenger copy', () => {
    const expectations = [
      ['ko', '메신저 상담', '검증된 메신저 채널로 편리하게 법률 상담을 시작하세요.'],
      ['zh-hant', '即時通訊諮詢', '透過已驗證的即時通訊頻道輕鬆開始法律諮詢。'],
      ['en', 'Messenger Consultation', 'Start your legal consultation through our verified messenger channel.'],
    ] as const;

    for (const [locale, title, description] of expectations) {
      const html = renderToStaticMarkup(createElement(MessengerChatSection, { locale }));
      expect(html).toContain(title);
      expect(html).toContain(description);
      expect(occurrences(html, '<a ')).toBe(1);
      expect(occurrences(html, `href="${verifiedMessengerHref}"`)).toBe(1);
      expect(html).toContain('target="_blank" rel="noopener noreferrer"');
      expect(html).toContain('<h3 class="messenger-card-platform">');
      expect(html).not.toContain('style="text-transform:none"');
    }
  });

  it('uses only the verified primary messenger in the consultation fallback', () => {
    const html = renderToStaticMarkup(createElement(AiConsultationSection, { locale: 'en' }));

    expect(consultationSource).not.toContain('messenger.secondary');
    expect(occurrences(html, `href="${verifiedMessengerHref}"`)).toBe(1);
    expect(html).toContain(`href="tel:${verifiedPhone.replace(/[^0-9+]/g, '')}"`);
    expect(html).toContain(`href="mailto:${verifiedEmail}"`);
  });
});
