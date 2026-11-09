import type { InquiryCopyLocale } from '@/data/international-inquiry-copy';

export const INQUIRY_URL_TOPIC_WHITELIST = ['semiconductor'] as const;

export type InquiryUrlTopic = (typeof INQUIRY_URL_TOPIC_WHITELIST)[number];

export function parseInquiryUrlTopic(raw: string | null | undefined): InquiryUrlTopic | null {
  if (!raw) return null;
  return (INQUIRY_URL_TOPIC_WHITELIST as readonly string[]).includes(raw)
    ? (raw as InquiryUrlTopic)
    : null;
}

const SEMICONDUCTOR_ORIGINAL_TEXT_PREFIX: Partial<Record<InquiryCopyLocale, string>> = {
  ko: '[반도체 산업 상담] ',
  'zh-hant': '[半導體產業諮詢] ',
  en: '[Semiconductor industry inquiry] ',
  ja: '[半導体産業のご相談] ',
};

export function inquiryTopicOriginalTextPrefill(
  locale: InquiryCopyLocale,
  topic: InquiryUrlTopic | null,
): string {
  if (topic !== 'semiconductor') return '';
  return SEMICONDUCTOR_ORIGINAL_TEXT_PREFIX[locale] ?? SEMICONDUCTOR_ORIGINAL_TEXT_PREFIX.en ?? '';
}
