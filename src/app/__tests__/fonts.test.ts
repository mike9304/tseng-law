import { describe, expect, it, vi } from 'vitest';

const fontLoaders = vi.hoisted(() => {
  const createFontLoader = () =>
    vi.fn((options: { variable: string }) => ({
      className: 'font-test',
      style: { fontFamily: 'font-test' },
      variable: options.variable,
    }));

  return {
    Noto_Sans_KR: createFontLoader(),
    Noto_Sans_JP: createFontLoader(),
    Noto_Sans_TC: createFontLoader(),
    Noto_Sans_Thai: createFontLoader(),
    Noto_Sans: createFontLoader(),
    Noto_Serif_KR: createFontLoader(),
    Noto_Serif_JP: createFontLoader(),
    Noto_Serif_TC: createFontLoader(),
  };
});

vi.mock('next/font/google', () => fontLoaders);

import { getLocaleFontClassName, getManagedLocaleFontClassNames } from '../fonts';

describe('locale font configuration', () => {
  it.each([
    ['Noto_Sans_KR', '--font-noto-sans-kr-loaded'],
    ['Noto_Serif_KR', '--font-noto-serif-kr-loaded'],
    ['Noto_Sans_TC', '--font-noto-sans-tc-loaded'],
    ['Noto_Serif_TC', '--font-noto-serif-tc-loaded'],
    ['Noto_Sans_JP', '--font-noto-sans-jp-loaded'],
    ['Noto_Serif_JP', '--font-noto-serif-jp-loaded'],
  ] as const)('requests the variable %s font payload', (fontName, variable) => {
    expect(fontLoaders[fontName]).toHaveBeenCalledOnce();
    expect(fontLoaders[fontName]).toHaveBeenCalledWith({
      display: 'swap',
      preload: false,
      variable,
      weight: 'variable',
    });
  });

  it('preserves the Korean/English and Traditional Chinese pairs while gating Japanese fonts to Japanese pages', () => {
    expect(getLocaleFontClassName('ko')).toContain('--font-noto-sans-kr-loaded');
    expect(getLocaleFontClassName('en')).toContain('--font-noto-serif-kr-loaded');
    expect(getLocaleFontClassName('ja')).toBe('--font-noto-sans-jp-loaded --font-noto-serif-jp-loaded');
    expect(getLocaleFontClassName('zh-Hant')).toContain('--font-noto-serif-tc-loaded');
    for (const locale of ['ko', 'en', 'zh-Hant'] as const) {
      expect(getLocaleFontClassName(locale)).not.toContain('-jp-loaded');
    }
    expect(getLocaleFontClassName('ja')).not.toContain('-kr-loaded');
    expect(getLocaleFontClassName('ja')).not.toContain('-tc-loaded');
  });

  it('includes all three pairs in the managed set so locale transitions remove stale font classes', () => {
    const managed = getManagedLocaleFontClassNames();
    expect(managed).toEqual(expect.arrayContaining([
      '--font-noto-sans-kr-loaded',
      '--font-noto-serif-kr-loaded',
      '--font-noto-sans-tc-loaded',
      '--font-noto-serif-tc-loaded',
      '--font-noto-sans-jp-loaded',
      '--font-noto-serif-jp-loaded',
    ]));
    expect(managed).toHaveLength(8);
    expect(new Set(managed).size).toBe(8);
    for (const locale of ['ko', 'en', 'zh-Hant', 'ja'] as const) {
      for (const fontClass of getLocaleFontClassName(locale).split(' ')) {
        expect(managed).toContain(fontClass);
      }
    }
  });

  it('requests Thai and latin/Vietnamese payloads for the eight document languages', () => {
    expect(fontLoaders.Noto_Sans_Thai).toHaveBeenCalledOnce();
    expect(fontLoaders.Noto_Sans_Thai).toHaveBeenCalledWith({
      display: 'swap',
      preload: false,
      variable: '--font-noto-sans-thai-loaded',
      weight: 'variable',
    });
    expect(fontLoaders.Noto_Sans).toHaveBeenCalledOnce();
    expect(fontLoaders.Noto_Sans).toHaveBeenCalledWith({
      display: 'swap',
      preload: false,
      variable: '--font-noto-sans-latin-loaded',
      weight: 'variable',
      subsets: ['latin', 'latin-ext', 'vietnamese'],
    });

    const managed = getManagedLocaleFontClassNames();
    expect(managed).toEqual(expect.arrayContaining([
      '--font-noto-sans-thai-loaded',
      '--font-noto-sans-latin-loaded',
    ]));
    expect(getLocaleFontClassName('th')).toContain('--font-noto-sans-thai-loaded');
    expect(getLocaleFontClassName('th')).toContain('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('vi')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('id')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('fil')).toBe('--font-noto-sans-latin-loaded');

    const documentLanguages = ['ko', 'zh-Hant', 'en', 'ja', 'vi', 'id', 'th', 'fil'] as const;
    expect(documentLanguages).toHaveLength(8);
    for (const language of documentLanguages) {
      for (const fontClass of getLocaleFontClassName(language).split(' ').filter(Boolean)) {
        expect(managed).toContain(fontClass);
      }
    }
  });
});
