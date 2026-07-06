import type { Locale } from '@/lib/locales';
import type { Subscriber, SubscriberMarketingConsent } from './subscriber-types';

export const DOUBLE_OPT_IN_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const DEFAULT_MARKETING_CONSENT_TEXT = {
  ko: '마케팅 뉴스레터 및 법률 업데이트 수신에 동의합니다.',
  'zh-hant': '我同意接收行銷電子報與法律更新。',
  en: 'I agree to receive marketing newsletters and legal updates.',
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
