import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getLocaleFontClassName, getLocaleFontStylesheets, getManagedLocaleFontClassNames, JA_ZEN_STYLESHEET, KO_PRETENDARD_STYLESHEET, ZH_TITLE_SERIF_STYLESHEET } from '../fonts';
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
    ['en', ['kr', 'kr']],
    ['zh-Hans', ['sc', 'sc']],
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
  it('loads the zh-Hant Noto pair plus the static title serif (2026-10-07)', () => {
    const hrefs = getLocaleFontStylesheets('zh-Hant');
    expect(hrefs).toHaveLength(3);
    ['tc', 'tc'].forEach((script, index) => expect(hrefs[index]).toContain(`-${script}-loaded-`));
    expect(hrefs[2]).toBe(ZH_TITLE_SERIF_STYLESHEET);
  });
  it('loads the ja Noto pair plus the Zen faces (J1, 2026-10-07), also on a client-side switch into /ja', () => {
    const hrefs = getLocaleFontStylesheets('ja');
    expect(hrefs).toHaveLength(3);
    ['jp', 'jp'].forEach((script, index) => expect(hrefs[index]).toContain(`-${script}-loaded-`));
    expect(hrefs[2]).toBe(JA_ZEN_STYLESHEET);
    expect(getLocaleFontStylesheets('zh-Hant')).not.toContain(JA_ZEN_STYLESHEET);
  });
});
