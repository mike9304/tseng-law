import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getLocaleFontClassName, getLocaleFontStylesheets, getManagedLocaleFontClassNames, JA_ZEN_STYLESHEET, KO_PRETENDARD_STYLESHEET, VI_TYPE_STYLESHEET, ZH_TITLE_SERIF_STYLESHEET } from '../fonts';
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
    // th and id moved to the Folio sheet (2026-10-15); ms and fil keep the Noto latin sheet.
    ['he', ['hebrew', 'latin']], ['ms', ['latin']], ['fil', ['latin']],
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
  it('loads the vi latin Noto sheet plus the Indochine type (2026-10-13), on vi only', () => {
    const hrefs = getLocaleFontStylesheets('vi');
    expect(hrefs).toHaveLength(2);
    expect(hrefs[0]).toContain('-latin-loaded-');
    expect(hrefs[1]).toBe(VI_TYPE_STYLESHEET);
    for (const locale of ['ko', 'zh-Hant', 'en', 'ja', 'id', 'th', 'fil'] as const) {
      expect(getLocaleFontStylesheets(locale)).not.toContain(VI_TYPE_STYLESHEET);
    }
  });
});

describe('vi type sheet', () => {
  const css = readFileSync(path.join(process.cwd(), 'public', VI_TYPE_STYLESHEET), 'utf8');
  const urls = [...css.matchAll(/url\(([^)]+)\)/g)].map((match) => match[1]);

  it('is content-hashed (/fonts is served immutable)', () => {
    const hash = /vi-type-([0-9a-f]{12})\.css$/.exec(VI_TYPE_STYLESHEET)?.[1];
    expect(hash).toBe(createHash('sha256').update(css).digest('hex').slice(0, 12));
  });

  it('serves four hashed woff2 files from its own folder, with swap, under the 200 KB country budget', () => {
    expect(urls).toHaveLength(4);
    let bytes = 0;
    for (const url of urls) {
      expect(url).toMatch(/^\/fonts\/vi-2026-10\/[a-z0-9-]+-[0-9a-f]{8}\.woff2$/);
      const file = path.join(process.cwd(), 'public', url);
      expect(existsSync(file), url).toBe(true);
      const data = readFileSync(file);
      expect(url).toContain(`-${createHash('sha256').update(data).digest('hex').slice(0, 8)}.woff2`);
      bytes += data.length;
    }
    expect(bytes).toBeLessThanOrEqual(200 * 1024);
    expect(css.match(/font-display:swap/g)).toHaveLength(4);
    expect(css).not.toMatch(/https?:/);
  });

  it('ships the OFL texts and keeps the reserved name "Lora" out of the served family name', () => {
    for (const license of ['OFL-be-vietnam-pro.txt', 'OFL-vi-display-serif.txt']) {
      expect(readFileSync(path.join(process.cwd(), 'public/fonts/vi-2026-10', license), 'utf8')).toContain('SIL OPEN FONT LICENSE Version 1.1');
    }
    expect(readFileSync(path.join(process.cwd(), 'public/fonts/vi-2026-10/OFL-vi-display-serif.txt'), 'utf8')).toContain('Reserved Font Name "Lora"');
    expect(css).toContain("font-family:'VI Display Serif'");
    expect(css).not.toMatch(/font-family:'[^']*Lora/);
  });
});
