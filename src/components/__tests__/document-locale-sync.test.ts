import { describe, expect, it } from 'vitest';
import { getSynchronizedDocumentLocaleState } from '@/components/DocumentLocaleSync';

const krPair = 'font-sans-kr font-serif-kr';
const tcPair = 'font-sans-tc font-serif-tc';
const managedFontClassNames = [...krPair.split(' '), ...tcPair.split(' ')];

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
    ['ja', 'ja'],
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
});
