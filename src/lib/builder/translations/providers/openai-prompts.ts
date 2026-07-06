import type { Locale } from '@/lib/locales';

const TARGET_LABELS: Record<Locale, string> = {
  ko: 'Korean',
  'zh-hant': 'Traditional Chinese for Taiwan',
  en: 'English',
};

export function buildPrompt(sourceLocale: Locale, targetLocale: Locale, sourceText: string): string {
  return [
    `Translate ${TARGET_LABELS[sourceLocale]} legal website content to ${TARGET_LABELS[targetLocale]}.`,
    'Keep a professional, formal legal-service tone.',
    'Preserve names, URLs, phone numbers, email addresses, and HTML-like tokens exactly.',
    'Preferred brand terms: 호정국제 -> 浩正國際 in zh-hant, Hojeong International in English.',
    'Return only JSON in this shape: {"text":"..."}',
    '',
    `Source: ${sourceText}`,
  ].join('\n');
}

export function buildBatchPrompt(
  sourceLocale: Locale,
  targetLocale: Locale,
  items: readonly { readonly key: string; readonly sourceText: string }[],
): string {
  return [
    `Translate ${TARGET_LABELS[sourceLocale]} legal website content to ${TARGET_LABELS[targetLocale]}.`,
    'Keep a professional, formal legal-service tone.',
    'Preserve names, URLs, phone numbers, email addresses, and HTML-like tokens exactly.',
    'Preferred brand terms: 호정국제 -> 浩正國際 in zh-hant, Hojeong International in English.',
    'Return only JSON in this shape: {"items":[{"key":"...","text":"..."}]}',
    '',
    JSON.stringify({ items }),
  ].join('\n');
}
