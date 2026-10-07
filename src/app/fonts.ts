import fontStylesheets from '@/data/font-stylesheets.json';

// Same Noto faces, Unicode subsets and fallback metrics as the prior next/font
// build. Standalone stylesheets let each page load only its active families.
const sansKorean = { variable: '--font-noto-sans-kr-loaded' };
const serifKorean = { variable: '--font-noto-serif-kr-loaded' };
const sansTraditionalChinese = { variable: '--font-noto-sans-tc-loaded' };
const serifTraditionalChinese = { variable: '--font-noto-serif-tc-loaded' };
const sansSimplifiedChinese = { variable: '--font-noto-sans-sc-loaded' };
const serifSimplifiedChinese = { variable: '--font-noto-serif-sc-loaded' };
const sansJapanese = { variable: '--font-noto-sans-jp-loaded' };
const serifJapanese = { variable: '--font-noto-serif-jp-loaded' };
const sansThai = { variable: '--font-noto-sans-thai-loaded' };
const sansArabic = { variable: '--font-noto-sans-arabic-loaded' };
const sansDevanagari = { variable: '--font-noto-sans-devanagari-loaded' };
const sansHebrew = { variable: '--font-noto-sans-hebrew-loaded' };
const sansBengali = { variable: '--font-noto-sans-bengali-loaded' };
const sansTamil = { variable: '--font-noto-sans-tamil-loaded' };
const sansMyanmar = { variable: '--font-noto-sans-myanmar-loaded' };
const sansKhmer = { variable: '--font-noto-sans-khmer-loaded' };
const sansLatin = { variable: '--font-noto-sans-latin-loaded' };

export type DocumentLanguage =
  | 'ko'
  | 'zh-Hant'
  | 'en'
  | 'ja'
  | 'vi'
  | 'id'
  | 'th'
  | 'fil'
  | 'ar'
  | 'de'
  | 'es'
  | 'fr'
  | 'pt'
  | 'zh-Hans'
  | 'ms'
  | 'ru'
  | 'tr'
  | 'it'
  | 'nl'
  | 'pl'
  | 'hi'
  | 'sv'
  | 'da'
  | 'nb'
  | 'fi'
  | 'cs'
  | 'hu'
  | 'ro'
  | 'uk'
  | 'el'
  | 'he'
  | 'bn'
  | 'ur'
  | 'fa'
  | 'my'
  | 'ta'
  | 'ne'
  | 'km'
  | 'mn'
  | 'sk'
  | 'bg'
  | 'hr'
  | 'sr'
  | 'sl'
  | 'lt'
  | 'lv'
  | 'et'
  | 'ca'
  | 'is';

const koreanFontClassName = [sansKorean.variable, serifKorean.variable].join(' ');
const traditionalChineseFontClassName = [
  sansTraditionalChinese.variable,
  serifTraditionalChinese.variable,
].join(' ');
const simplifiedChineseFontClassName = [
  sansSimplifiedChinese.variable,
  serifSimplifiedChinese.variable,
].join(' ');
const japaneseFontClassName = [sansJapanese.variable, serifJapanese.variable].join(' ');
const thaiFontClassName = [sansThai.variable, sansLatin.variable].join(' ');
const arabicFontClassName = [sansArabic.variable, sansLatin.variable].join(' ');
const hindiFontClassName = [sansDevanagari.variable, sansLatin.variable].join(' ');
const hebrewFontClassName = [sansHebrew.variable, sansLatin.variable].join(' ');
const bengaliFontClassName = [sansBengali.variable, sansLatin.variable].join(' ');
const tamilFontClassName = [sansTamil.variable, sansLatin.variable].join(' ');
const myanmarFontClassName = [sansMyanmar.variable, sansLatin.variable].join(' ');
const khmerFontClassName = [sansKhmer.variable, sansLatin.variable].join(' ');
const latinExtendedFontClassName = sansLatin.variable;

/**
 * CSS-variable class names for the active locale pair.
 * Must be applied where `:root` semantic tokens can resolve (typically `<html>`),
 * not as body-only variables referenced from `:root`.
 */
export function getLocaleFontClassName(language: DocumentLanguage): string {
  if (language === 'zh-Hant') {
    return traditionalChineseFontClassName;
  }
  if (language === 'zh-Hans') {
    return simplifiedChineseFontClassName;
  }
  if (language === 'ja') {
    return japaneseFontClassName;
  }
  if (language === 'th') {
    return thaiFontClassName;
  }
  if (language === 'ar' || language === 'ur' || language === 'fa') {
    return arabicFontClassName;
  }
  if (language === 'hi' || language === 'ne') {
    return hindiFontClassName;
  }
  if (language === 'bn') {
    return bengaliFontClassName;
  }
  if (language === 'ta') {
    return tamilFontClassName;
  }
  if (language === 'my') {
    return myanmarFontClassName;
  }
  if (language === 'km') {
    return khmerFontClassName;
  }
  if (language === 'he') {
    return hebrewFontClassName;
  }
  if (
    language === 'vi'
    || language === 'id'
    || language === 'fil'
    || language === 'de'
    || language === 'es'
    || language === 'fr'
    || language === 'pt'
    || language === 'ms'
    || language === 'ru'
    || language === 'tr'
    || language === 'it'
    || language === 'nl'
    || language === 'pl'
    || language === 'sv'
    || language === 'da'
    || language === 'nb'
    || language === 'fi'
    || language === 'cs'
    || language === 'hu'
    || language === 'ro'
    || language === 'uk'
    || language === 'el'
    || language === 'mn'
    || language === 'sk'
    || language === 'bg'
    || language === 'hr'
    || language === 'sr'
    || language === 'sl'
    || language === 'lt'
    || language === 'lv'
    || language === 'et'
    || language === 'ca'
    || language === 'is'
  ) {
    return latinExtendedFontClassName;
  }
  // Korean and English retain their existing shared pair.
  return koreanFontClassName;
}

export function getManagedLocaleFontClassNames(): string[] {
  return Array.from(
    new Set(
      [
        koreanFontClassName,
        traditionalChineseFontClassName,
        simplifiedChineseFontClassName,
        japaneseFontClassName,
        thaiFontClassName,
        arabicFontClassName,
        hindiFontClassName,
        hebrewFontClassName,
        bengaliFontClassName,
        tamilFontClassName,
        myanmarFontClassName,
        khmerFontClassName,
        latinExtendedFontClassName,
      ].flatMap((className) => className.split(/\s+/).filter(Boolean)),
    ),
  );
}

/**
 * ko identity type (2026-10-06): Pretendard Variable 1.3.9 in unicode-range slices (SIL OFL 1.1, 漢字 ranges removed),
 * self-hosted under a versioned folder with a content-hashed sheet — /fonts is served immutable, so a changed sheet
 * needs a new name.
 */
/** ja type (2026-10-07, J1): Zen Old Mincho (500/700) + Zen Kaku Gothic New (400/700) in unicode-range slices (SIL OFL 1.1), hashed sheet. */
export const JA_ZEN_STYLESHEET = '/fonts/zen-ja-2026-10/zen-ja-50b77accc577.css';

export const KO_PRETENDARD_STYLESHEET = '/fonts/pretendard-1.3.9/pretendard-ff7df79e29f2.css';

/** Content-hashed, self-hosted stylesheets for this page's script only. */
export function getLocaleFontStylesheets(language: DocumentLanguage): string[] {
  const sheets = getLocaleFontClassName(language).split(' ').map(name => fontStylesheets[name as keyof typeof fontStylesheets]);
  // ko leads with Pretendard; the list also feeds DocumentLocaleSync, so a client-side switch into /ko attaches it too.
  if (language === 'ko') return [...sheets, KO_PRETENDARD_STYLESHEET];
  if (language === 'ja') return [...sheets, JA_ZEN_STYLESHEET];
  return sheets;
}
