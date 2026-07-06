import type { Locale } from '@/lib/locales';

export const HEADING_LEGACY_DEFAULT_TEXT = '헤딩을 입력하세요';

const HEADING_DEFAULT_TEXT: Record<Locale, string> = {
  ko: HEADING_LEGACY_DEFAULT_TEXT,
  'zh-hant': '輸入標題',
  en: 'Enter a heading',
};

export function getHeadingDefaultText(locale?: Locale | string | null): string {
  if (locale === 'zh-hant') return HEADING_DEFAULT_TEXT['zh-hant'];
  if (locale === 'en') return HEADING_DEFAULT_TEXT.en;
  return HEADING_DEFAULT_TEXT.ko;
}

export function localizedHeadingText(text: string | undefined, locale?: Locale | string | null): string {
  const current = text ?? '';
  return current === HEADING_LEGACY_DEFAULT_TEXT ? getHeadingDefaultText(locale) : current;
}
