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
    Noto_Sans_TC: createFontLoader(),
    Noto_Serif_KR: createFontLoader(),
    Noto_Serif_TC: createFontLoader(),
  };
});

vi.mock('next/font/google', () => fontLoaders);

import { getLocaleFontClassName } from '../fonts';

describe('locale font configuration', () => {
  it.each([
    ['Noto_Sans_KR', '--font-noto-sans-kr-loaded'],
    ['Noto_Serif_KR', '--font-noto-serif-kr-loaded'],
    ['Noto_Sans_TC', '--font-noto-sans-tc-loaded'],
    ['Noto_Serif_TC', '--font-noto-serif-tc-loaded'],
  ] as const)('requests the variable %s font payload', (fontName, variable) => {
    expect(fontLoaders[fontName]).toHaveBeenCalledOnce();
    expect(fontLoaders[fontName]).toHaveBeenCalledWith({
      display: 'swap',
      preload: false,
      variable,
      weight: 'variable',
    });
  });

  it('keeps Korean fonts mapped to Korean, English, and Japanese pages', () => {
    expect(getLocaleFontClassName('ko')).toContain('--font-noto-sans-kr-loaded');
    expect(getLocaleFontClassName('en')).toContain('--font-noto-serif-kr-loaded');
    expect(getLocaleFontClassName('ja')).toContain('--font-noto-sans-kr-loaded');
    expect(getLocaleFontClassName('zh-Hant')).toContain('--font-noto-serif-tc-loaded');
  });
});
