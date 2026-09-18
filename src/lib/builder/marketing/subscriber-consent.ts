import type { Locale } from '@/lib/locales';
import type { Subscriber, SubscriberMarketingConsent } from './subscriber-types';

export const DOUBLE_OPT_IN_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Consent sentence stored on the subscriber record.
 *
 * It states what is sent, how often, and how to stop, because the record has
 * to show what the person actually agreed to (정보통신망법 §50 / 特定電子メール法
 * 第三条②). The sign-up widget shows this same sentence as its checkbox label
 * (`src/data/newsletter-signup-copy.ts`), so display and record cannot drift.
 */
export const DEFAULT_MARKETING_CONSENT_TEXT = {
  ko: '법무법인 호정의 대만 법률·제도 안내 뉴스레터(월 1~2회)를 이메일로 받는 것에 동의합니다. 언제든 메일 하단 링크로 수신을 거부할 수 있습니다.',
  'zh-hant': '我同意收到昊鼎國際法律事務所的台灣法律與制度電子報（每月 1～2 封）。我可隨時透過郵件底部連結取消訂閱。',
  en: "I agree to receive Hovering International Law Firm's newsletter on Taiwan law and procedures (1–2 emails per month). I can unsubscribe at any time via the link in each email.",
} as const satisfies Record<Locale, string>;

export type MarketingConsentRecordInput = {
  readonly acceptedAt: string;
  readonly source: string;
  readonly preferredLocale: Locale;
  readonly ipAddress: string;
  readonly userAgent?: string;
  readonly acceptedBy?: string;
  readonly text?: string;
};

export type DoubleOptInWindow = {
  readonly createdAt: string;
  readonly expiresAt: string;
};

export function buildMarketingConsentRecord(
  input: MarketingConsentRecordInput,
): SubscriberMarketingConsent {
  const trimmedText = input.text?.trim();
  return {
    acceptedAt: input.acceptedAt,
    source: input.source,
    preferredLocale: input.preferredLocale,
    ipAddress: input.ipAddress,
    text: trimmedText && trimmedText.length > 0
      ? trimmedText
      : DEFAULT_MARKETING_CONSENT_TEXT[input.preferredLocale],
    ...(input.userAgent ? { userAgent: input.userAgent } : {}),
    ...(input.acceptedBy ? { acceptedBy: input.acceptedBy } : {}),
  };
}

export function createDoubleOptInWindow(now: Date = new Date()): DoubleOptInWindow {
  return {
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + DOUBLE_OPT_IN_TOKEN_TTL_MS).toISOString(),
  };
}

export function isDoubleOptInExpired(
  subscriber: Pick<Subscriber, 'doubleOptInTokenExpiresAt'>,
  now: Date = new Date(),
): boolean {
  const expiresAt = subscriber.doubleOptInTokenExpiresAt;
  if (!expiresAt) return false;
  const expiresAtMs = Date.parse(expiresAt);
  if (Number.isNaN(expiresAtMs)) return true;
  return expiresAtMs <= now.getTime();
}
