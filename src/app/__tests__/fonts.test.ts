import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getLocaleFontClassName, getLocaleFontStylesheets, getManagedLocaleFontClassNames, KO_PRETENDARD_STYLESHEET } from '../fonts';
import sheets from '@/data/font-stylesheets.json';

describe('locale font resources', () => {
  it('serves the existing 17 Noto families with swap and the original fallback metrics', () => {
    expect(getManagedLocaleFontClassNames()).toHaveLength(17);
    for (const [variable, href] of Object.entries(sheets)) {
      const css = readFileSync(path.join(process.cwd(), 'public', href), 'utf8');
      expect(css).toContain('font-display:swap');
      expect(css).toContain('size-adjust:');
      expect(css).toContain(`.${variable}{${variable}:`);
      expect(css).not.toMatch(/https?:/);
      for (const match of css.matchAll(/url\(([^)]+)\)/g)) {
        expect(existsSync(path.join(process.cwd(), 'public', match[1])), match[1]).toBe(true);
      }
    }
  });
  it.each([
    ['en', ['kr', 'kr']], ['ja', ['jp', 'jp']],
    ['zh-Hant', ['tc', 'tc']], ['zh-Hans', ['sc', 'sc']],
    ['ar', ['arabic', 'latin']], ['hi', ['devanagari', 'latin']],
    ['bn', ['bengali', 'latin']], ['ta', ['tamil', 'latin']],
    ['my', ['myanmar', 'latin']], ['km', ['khmer', 'latin']],
    ['he', ['hebrew', 'latin']], ['th', ['thai', 'latin']], ['vi', ['latin']],
  ] as const)('loads only the %s page fonts', (locale, scripts) => {
    const hrefs = getLocaleFontStylesheets(locale);
    expect(hrefs).toHaveLength(scripts.length);
    scripts.forEach((script, index) => expect(hrefs[index]).toContain(`-${script}-loaded-`));
    for (const fontClass of getLocaleFontClassName(locale).split(' ')) {
      expect(getManagedLocaleFontClassNames()).toContain(fontClass);
    }
  });
  it('loads the ko Noto pair plus Pretendard (Korean identity, 2026-10-06), also on a client-side switch into /ko', () => {
    const hrefs = getLocaleFontStylesheets('ko');
    expect(hrefs).toHaveLength(3);
    ['kr', 'kr'].forEach((script, index) => expect(hrefs[index]).toContain(`-${script}-loaded-`));
    expect(hrefs[2]).toBe(KO_PRETENDARD_STYLESHEET);
    expect(getLocaleFontStylesheets('en')).not.toContain(KO_PRETENDARD_STYLESHEET);
  });
});
