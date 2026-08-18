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
 * Variable Noto files cover the public CSS weight matrix:
 * - sans 400/500/600/700 (body, UI, H2/H3, buttons; no public 300)
 * - serif 500/600/700 (closed display allowlist; no light faces)
 */

const sansKorean = Noto_Sans_KR({
  display: 'swap',
  preload: false,
  weight: 'variable',
  variable: '--font-noto-sans-kr-loaded',
});

const serifKorean = Noto_Serif_KR({
  display: 'swap',
  preload: false,
  weight: 'variable',
  variable: '--font-noto-serif-kr-loaded',
});

const sansTraditionalChinese = Noto_Sans_TC({
  display: 'swap',
  preload: false,
  weight: 'variable',
  variable: '--font-noto-sans-tc-loaded',
});

const serifTraditionalChinese = Noto_Serif_TC({
  display: 'swap',
  preload: false,
  weight: 'variable',
  variable: '--font-noto-serif-tc-loaded',
});

export type DocumentLanguage = 'ko' | 'zh-Hant' | 'en' | 'ja';

const koreanFontClassName = [sansKorean.variable, serifKorean.variable].join(' ');
const traditionalChineseFontClassName = [
  sansTraditionalChinese.variable,
  serifTraditionalChinese.variable,
].join(' ');

/**
 * CSS-variable class names for the active locale pair.
 * Must be applied where `:root` semantic tokens can resolve (typically `<html>`),
 * not as body-only variables referenced from `:root`.
 */
export function getLocaleFontClassName(language: DocumentLanguage): string {
  if (language === 'zh-Hant') {
    return traditionalChineseFontClassName;
  }
  // ko + en + ja → KR pair (CJK coverage sufficient for JA launch; dedicated JP faces later)
  return koreanFontClassName;
}

export function getManagedLocaleFontClassNames(): string[] {
  return Array.from(
    new Set(
      [koreanFontClassName, traditionalChineseFontClassName].flatMap((className) =>
        className.split(/\s+/).filter(Boolean),
      ),
    ),
  );
}
