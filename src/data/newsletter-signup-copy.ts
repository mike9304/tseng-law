/**
 * Newsletter sign-up copy for the column-page widget.
 *
 * Opt-in only: the consent box starts unchecked and its label is the exact
 * text stored on the subscriber record, so the record matches what the reader
 * agreed to (정보통신망법 §50 동의 기록 / 特定電子メール法 第三条②).
 *
 * The widget promises nothing about outcomes, price, or response time, and it
 * does not describe the newsletter as legal advice. Frequency is stated as the
 * operating target in the marketing plan, not as a guarantee.
 *
 * Campaign rendering supports ko / zh-hant / en only. A Japanese reader is
 * therefore subscribed with `en` and told, in Japanese, that the newsletter
 * arrives in English — see `SUBSCRIBE_LOCALE_BY_SITE_LOCALE`.
 *
 * Wording source: docs/marketing/EMAIL-SEQUENCE-WELCOME-REENGAGE-2026-09-17.md §2.
 * Status: NEEDS_LAWYER_REVIEW before the widget is published.
 */

import type { Locale, SiteLocale } from '@/lib/locales';
import { DEFAULT_MARKETING_CONSENT_TEXT } from '@/lib/builder/marketing/subscriber-consent';

/** Which campaign locale a reader of each site locale is subscribed as. */
export const SUBSCRIBE_LOCALE_BY_SITE_LOCALE: Record<SiteLocale, Locale> = {
  ko: 'ko',
  'zh-hant': 'zh-hant',
  en: 'en',
  ja: 'en',
};

export interface NewsletterSignupCopy {
  readonly heading: string;
  readonly description: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly consentLabel: string;
  readonly submitLabel: string;
  readonly submittingLabel: string;
  readonly successMessage: string;
  readonly alreadyMessage: string;
  readonly consentRequiredMessage: string;
  readonly invalidEmailMessage: string;
  readonly errorMessage: string;
  readonly unsubscribeNote: string;
  /** Only where the newsletter language differs from the page language. */
  readonly languageNote?: string;
}

export const newsletterSignupCopy: Record<SiteLocale, NewsletterSignupCopy> = {
  ko: {
    heading: '대만 법률·제도 안내 뉴스레터',
    description:
      '대만 회사설립·계약·노무·소송의 절차와 제도 변경을 정리해 월 1~2회 보내드립니다. 개별 사건에 대한 법률 자문이 아닙니다.',
    emailLabel: '이메일 주소',
    emailPlaceholder: 'you@example.com',
    consentLabel: DEFAULT_MARKETING_CONSENT_TEXT.ko,
    submitLabel: '구독 신청',
    submittingLabel: '신청 중…',
    successMessage: '확인 메일을 보냈습니다. 메일의 링크를 눌러야 구독이 완료됩니다.',
    alreadyMessage: '이미 구독 중인 주소입니다.',
    consentRequiredMessage: '수신 동의에 체크해 주세요.',
    invalidEmailMessage: '이메일 주소를 확인해 주세요.',
    errorMessage: '지금은 신청이 처리되지 않았습니다. 잠시 후 다시 시도해 주세요.',
    unsubscribeNote: '모든 메일 하단의 링크로 언제든 수신을 거부할 수 있습니다.',
  },
  'zh-hant': {
    heading: '台灣法律與制度資訊電子報',
    description:
      '每月 1～2 封，整理台灣公司設立、契約、勞動與訴訟的程序與制度變更。本電子報不是針對個案的法律意見。',
    emailLabel: '電子郵件',
    emailPlaceholder: 'you@example.com',
    consentLabel: DEFAULT_MARKETING_CONSENT_TEXT['zh-hant'],
    submitLabel: '訂閱',
    submittingLabel: '送出中…',
    successMessage: '確認信已寄出。請點選信中的連結完成訂閱。',
    alreadyMessage: '這個地址已經訂閱。',
    consentRequiredMessage: '請勾選同意接收。',
    invalidEmailMessage: '請確認電子郵件地址。',
    errorMessage: '目前無法完成訂閱，請稍後再試。',
    unsubscribeNote: '每封郵件底部都有取消訂閱連結，可隨時取消。',
  },
  en: {
    heading: 'Taiwan law and procedure newsletter',
    description:
      'One or two emails a month on Taiwan company formation, contracts, employment, and disputes. It is general information, not advice on your matter.',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    consentLabel: DEFAULT_MARKETING_CONSENT_TEXT.en,
    submitLabel: 'Subscribe',
    submittingLabel: 'Sending…',
    successMessage: 'Check your inbox and click the link in the confirmation email to finish subscribing.',
    alreadyMessage: 'This address is already subscribed.',
    consentRequiredMessage: 'Please tick the consent box.',
    invalidEmailMessage: 'Please check the email address.',
    errorMessage: 'The request did not go through. Please try again shortly.',
    unsubscribeNote: 'Every email carries an unsubscribe link.',
  },
  ja: {
    heading: '台湾の法律・制度ニュースレター',
    description:
      '台湾の会社設立、契約、労務、訴訟の手続と制度変更を月1〜2回お送りします。個別の案件についての法律意見ではありません。',
    emailLabel: 'メールアドレス',
    emailPlaceholder: 'you@example.com',
    // The record is stored as `en`; show the same sentence the record keeps.
    consentLabel: DEFAULT_MARKETING_CONSENT_TEXT.en,
    submitLabel: '購読する',
    submittingLabel: '送信中…',
    successMessage: '確認メールをお送りしました。メール内のリンクを押すと購読が完了します。',
    alreadyMessage: 'このアドレスはすでに購読済みです。',
    consentRequiredMessage: '受信への同意にチェックしてください。',
    invalidEmailMessage: 'メールアドレスをご確認ください。',
    errorMessage: '現在、手続を完了できませんでした。しばらくしてからお試しください。',
    unsubscribeNote: '各メール下部のリンクからいつでも配信を停止できます。',
    languageNote: 'ニュースレターは英語でお送りします。',
  },
};

export function getNewsletterSignupCopy(locale: SiteLocale): NewsletterSignupCopy {
  return newsletterSignupCopy[locale] ?? newsletterSignupCopy.ko;
}
