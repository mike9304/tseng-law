import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { GUIDANCE_LOCALES_4 } from '@/lib/public-guidance';

const LATIN_EXCEPTIONS = new Set(['th', 'ar', 'zh-hans', 'hi']);

describe('guidance locale font-variable bindings', () => {
  const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
  const latinGuidanceLocales = GUIDANCE_LOCALES_4.filter((locale) => !LATIN_EXCEPTIONS.has(locale));

  it('binds html[lang] latin variables for every latin guidance locale', () => {
    expect(latinGuidanceLocales).toEqual([
      'vi',
      'id',
      'fil',
      'de',
      'es',
      'fr',
      'pt',
      'ms',
      'ru',
      'tr',
      'it',
      'nl',
      'pl',
      'sv',
      'da',
      'nb',
      'fi',
    ]);
    for (const locale of latinGuidanceLocales) {
      expect(css, `missing html[lang='${locale}']`).toMatch(
        new RegExp(`html\\[lang='${locale}'\\]`),
      );
      expect(css, `missing .site[data-locale='${locale}']`).toMatch(
        new RegExp(`\\.site\\[data-locale='${locale}'\\]`),
      );
    }
  });

  it('binds zh-Hans to Simplified Chinese Noto variables', () => {
    expect(css).toMatch(/html\[lang='zh-Hans'\]/);
    expect(css).toMatch(/html\[lang='zh-hans'\]/);
    expect(css).toMatch(/\.site\[data-locale='zh-hans'\]/);
    expect(css).toMatch(/--font-noto-sans-sc-loaded/);
    expect(css).toMatch(/--font-noto-serif-sc-loaded/);
  });

  it('keeps Thai, Arabic and Hindi on their own bindings rather than the latin list', () => {
    expect(LATIN_EXCEPTIONS.has('th')).toBe(true);
    expect(LATIN_EXCEPTIONS.has('ar')).toBe(true);
    expect(LATIN_EXCEPTIONS.has('hi')).toBe(true);
    expect(css).toMatch(/html\[lang='th'\]/);
    expect(css).toMatch(/html\[lang='ar'\]/);
    expect(css).toMatch(/html\[lang='hi'\]/);
    expect(css).toMatch(/--font-noto-sans-devanagari-loaded/);
    expect(css).toMatch(/\.site\[data-locale='hi'\]/);
  });
});
