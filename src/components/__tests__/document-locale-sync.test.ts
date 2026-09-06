import { describe, expect, it } from 'vitest';
import { getSynchronizedDocumentLocaleState } from '@/components/DocumentLocaleSync';

const krPair = 'font-sans-kr font-serif-kr';
const tcPair = 'font-sans-tc font-serif-tc';
const jpPair = 'font-sans-jp font-serif-jp';
const managedFontClassNames = [...krPair.split(' '), ...tcPair.split(' '), ...jpPair.split(' ')];

describe('DocumentLocaleSync', () => {
  it('replaces the Korean pair with the Traditional Chinese pair and language', () => {
    expect(
      getSynchronizedDocumentLocaleState(
        `theme-light ${krPair}`,
        'zh-Hant',
        tcPair,
        managedFontClassNames,
      ),
    ).toEqual({
      language: 'zh-Hant',
      className: `theme-light ${tcPair}`,
    });
  });

  it.each([
    ['ko', 'ko'],
    ['en', 'en'],
  ] as const)('uses lang="%s" and the shared KR pair without duplicate classes', (_, language) => {
    const state = getSynchronizedDocumentLocaleState(
      `unrelated ${tcPair} unrelated font-sans-kr`,
      language,
      krPair,
      managedFontClassNames,
    );

    expect(state.language).toBe(language);
    expect(state.className.split(' ')).toEqual(['unrelated', 'font-sans-kr', 'font-serif-kr']);
  });

  it('replaces other locale pairs with Japanese and removes Japanese when leaving that locale', () => {
    const japanese = getSynchronizedDocumentLocaleState(
      `theme-light ${krPair} ${tcPair}`, 'ja', jpPair, managedFontClassNames,
    );
    expect(japanese).toEqual({ language: 'ja', className: `theme-light ${jpPair}` });

    const korean = getSynchronizedDocumentLocaleState(
      japanese.className, 'ko', krPair, managedFontClassNames,
    );
    expect(korean).toEqual({ language: 'ko', className: `theme-light ${krPair}` });
  });
});
