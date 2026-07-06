import type { Locale } from '@/lib/locales';

export const TEXT_LEGACY_DEFAULT_TEXT = '텍스트를 입력하세요';

const TEXT_DEFAULT_TEXT: Record<Locale, string> = {
  ko: TEXT_LEGACY_DEFAULT_TEXT,
  'zh-hant': '輸入文字',
  en: 'Enter text',
};

export function getTextDefaultText(locale?: Locale | string | null): string {
  if (locale === 'zh-hant') return TEXT_DEFAULT_TEXT['zh-hant'];
  if (locale === 'en') return TEXT_DEFAULT_TEXT.en;
  return TEXT_DEFAULT_TEXT.ko;
}

export function localizedTextDefault(text: string | undefined, locale?: Locale | string | null): string {
  const current = text ?? '';
  return current === TEXT_LEGACY_DEFAULT_TEXT ? getTextDefaultText(locale) : current;
}
