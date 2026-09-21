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
    Noto_Sans_SC: createFontLoader(),
    Noto_Sans_Thai: createFontLoader(),
    Noto_Sans_Arabic: createFontLoader(),
    Noto_Sans_Devanagari: createFontLoader(),
    Noto_Sans_Hebrew: createFontLoader(),
    Noto_Sans_Bengali: createFontLoader(),
    Noto_Sans_Tamil: createFontLoader(),
    Noto_Sans_Myanmar: createFontLoader(),
    Noto_Sans_Khmer: createFontLoader(),
    Noto_Sans: createFontLoader(),
    Noto_Serif_KR: createFontLoader(),
    Noto_Serif_JP: createFontLoader(),
    Noto_Serif_SC: createFontLoader(),
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
    ['Noto_Sans_SC', '--font-noto-sans-sc-loaded'],
    ['Noto_Serif_SC', '--font-noto-serif-sc-loaded'],
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
    expect(getLocaleFontClassName('zh-Hans')).toContain('--font-noto-serif-sc-loaded');
    for (const locale of ['ko', 'en', 'zh-Hant'] as const) {
      expect(getLocaleFontClassName(locale)).not.toContain('-jp-loaded');
    }
    expect(getLocaleFontClassName('ja')).not.toContain('-kr-loaded');
    expect(getLocaleFontClassName('ja')).not.toContain('-tc-loaded');
  });

  it('includes every locale pair (four pairs plus Thai, Arabic and latin) in the managed set so locale transitions remove stale font classes', () => {
    const managed = getManagedLocaleFontClassNames();
    expect(managed).toEqual(expect.arrayContaining([
      '--font-noto-sans-kr-loaded',
      '--font-noto-serif-kr-loaded',
      '--font-noto-sans-tc-loaded',
      '--font-noto-serif-tc-loaded',
      '--font-noto-sans-sc-loaded',
      '--font-noto-serif-sc-loaded',
      '--font-noto-sans-jp-loaded',
      '--font-noto-serif-jp-loaded',
    ]));
    expect(managed).toHaveLength(17) // + Bengali, Tamil, Myanmar, Khmer (2026-09-22);
    expect(new Set(managed).size).toBe(17);
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
      subsets: ['latin', 'latin-ext', 'vietnamese', 'cyrillic', 'greek'],
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
    expect(getLocaleFontClassName('de')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('es')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('fr')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('pt')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('ms')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('ru')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('tr')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('it')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('nl')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('pl')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('sv')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('da')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('nb')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('fi')).toBe('--font-noto-sans-latin-loaded');
    expect(getLocaleFontClassName('zh-Hans')).toContain('--font-noto-sans-sc-loaded');
    expect(getLocaleFontClassName('zh-Hans')).toContain('--font-noto-serif-sc-loaded');

    const documentLanguages = ['ko', 'zh-Hant', 'en', 'ja', 'vi', 'id', 'th', 'fil', 'de', 'es', 'fr', 'pt', 'zh-Hans', 'ms', 'ru', 'tr', 'it', 'nl', 'pl', 'sv', 'da', 'nb', 'fi'] as const;
    expect(documentLanguages).toHaveLength(23);
    for (const language of documentLanguages) {
      for (const fontClass of getLocaleFontClassName(language).split(' ').filter(Boolean)) {
        expect(managed).toContain(fontClass);
      }
    }
  });

  it('requests Noto Sans Arabic for the Arabic document language and pairs it with the latin face', () => {
    expect(fontLoaders.Noto_Sans_Arabic).toHaveBeenCalledOnce();
    expect(fontLoaders.Noto_Sans_Arabic).toHaveBeenCalledWith({
      display: 'swap',
      preload: false,
      variable: '--font-noto-sans-arabic-loaded',
      weight: 'variable',
      subsets: ['arabic'],
    });
    const classes = getLocaleFontClassName('ar').split(' ');
    expect(classes).toContain('--font-noto-sans-arabic-loaded');
    expect(classes).toContain('--font-noto-sans-latin-loaded');
    // Arabic must not fall through to the Korean pair.
    expect(classes).not.toContain('--font-noto-sans-kr-loaded');
    for (const fontClass of classes) expect(getManagedLocaleFontClassNames()).toContain(fontClass);
  });

  it('requests Noto Sans Devanagari for Hindi and pairs it with the latin face', () => {
    expect(fontLoaders.Noto_Sans_Devanagari).toHaveBeenCalledOnce();
    expect(fontLoaders.Noto_Sans_Devanagari).toHaveBeenCalledWith({
      display: 'swap',
      preload: false,
      variable: '--font-noto-sans-devanagari-loaded',
      weight: 'variable',
      subsets: ['devanagari'],
    });
    const classes = getLocaleFontClassName('hi').split(' ');
    expect(classes).toContain('--font-noto-sans-devanagari-loaded');
    expect(classes).toContain('--font-noto-sans-latin-loaded');
    expect(classes).not.toContain('--font-noto-sans-kr-loaded');
    for (const fontClass of classes) expect(getManagedLocaleFontClassNames()).toContain(fontClass);
  });
});
