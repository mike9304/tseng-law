import {
  Noto_Sans_KR,
  Noto_Sans_TC,
  Noto_Serif_KR,
  Noto_Serif_TC,
} from 'next/font/google';

/**
 * Public font payload — Cross-Strait Editorial Ledger.
 * Locale-gated: each page receives only the active sans + serif pair.
 * EN intentionally shares the KR pair for visual cohesion.
 *
 * Weight matrix (grep-justified from public CSS usage):
 * - sans 400/500/600/700 (body, UI, H2/H3, buttons; no public 300)
 * - serif 500/600/700 (closed display allowlist; no light faces)
 */

const sansKorean = Noto_Sans_KR({
  display: 'swap',
  preload: false,
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-kr-loaded',
});

const serifKorean = Noto_Serif_KR({
  display: 'swap',
  preload: false,
  weight: ['500', '600', '700'],
  variable: '--font-noto-serif-kr-loaded',
});

const sansTraditionalChinese = Noto_Sans_TC({
  display: 'swap',
  preload: false,
  // Noto Sans TC static faces in next/font: 400/500/700 historically;
  // 600 included when available for medium-emphasis UI parity with KR.
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-tc-loaded',
});

const serifTraditionalChinese = Noto_Serif_TC({
  display: 'swap',
  preload: false,
  weight: ['500', '600', '700'],
  variable: '--font-noto-serif-tc-loaded',
});

export type DocumentLanguage = 'ko' | 'zh-Hant' | 'en';

/**
 * CSS-variable class names for the active locale pair.
 * Must be applied where `:root` semantic tokens can resolve (typically `<html>`),
 * not as body-only variables referenced from `:root`.
 */
export function getLocaleFontClassName(language: DocumentLanguage): string {
  if (language === 'zh-Hant') {
    return [sansTraditionalChinese.variable, serifTraditionalChinese.variable].join(' ');
  }
  // ko + en → KR sans/serif pair
  return [sansKorean.variable, serifKorean.variable].join(' ');
}
