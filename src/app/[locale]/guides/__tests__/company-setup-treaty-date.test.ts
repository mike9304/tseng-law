import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { guideContent } from '@/app/[locale]/guides/taiwan-company-setup/content';

/**
 * The Taiwan–Korea income tax agreement entered into force on 2023-12-27 and
 * applies from 2024-01-01 (MOF English notice, checked 2026-09-18:
 * https://www.mof.gov.tw/eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=e1e57a4211474ff9b5d63a83b30dcf10).
 * The guide used to publish 2023.12.2 / 2023-12-02 in all four locales.
 *
 * These guards check the fact, not the layout: a locale may carry the dates in
 * the cost table or in its country-specific section. Only the locales that do
 * keep a treaty cost row are held to that row's wording.
 */
const WRONG_TREATY_DATE = /2023[.\-]12[.\-]0?2(?![0-9])|2023年12月2日(?!\d)/;
const IN_FORCE = ['2023.12.27', '2023-12-27', '2023年12月27日'];
const APPLIES_FROM = ['2024.1.1', '2024-01-01', '2024年1月1日'];
const TREATY_MENTION =
  /이중과세|雙重課稅|租稅協定|所得稅協定|tax treaty|租税条約|所得税協定|ADTA/;

const LOCALES = ['ko', 'zh-hant', 'en', 'ja'] as const;
type GuideLocale = (typeof LOCALES)[number];

function guideText(locale: GuideLocale): string {
  return JSON.stringify(guideContent[locale]);
}

function treatyCostRow(locale: GuideLocale): string | null {
  const row = guideContent[locale].costRows.find((item) => TREATY_MENTION.test(item.item));
  return row ? row.values.join(' ') : null;
}

describe('company-setup Korea–Taiwan tax agreement dates', () => {
  it.each(LOCALES)('never publishes the incorrect 2 December 2023 date in %s', (locale) => {
    expect(guideText(locale)).not.toMatch(WRONG_TREATY_DATE);
  });

  it.each(LOCALES)('states the 2023-12-27 entry into force wherever %s mentions the agreement', (locale) => {
    const text = guideText(locale);
    if (!TREATY_MENTION.test(text)) {
      return;
    }
    expect(
      IN_FORCE.some((date) => text.includes(date)),
      `${locale} guide mentions the agreement but not its 2023-12-27 entry into force`,
    ).toBe(true);
  });

  it.each(LOCALES)('keeps both dates in the %s treaty cost row when that row exists', (locale) => {
    const row = treatyCostRow(locale);
    if (row === null) {
      return;
    }
    expect(IN_FORCE.some((date) => row.includes(date)), `${locale} cost row entry into force`).toBe(
      true,
    );
    expect(
      APPLIES_FROM.some((date) => row.includes(date)),
      `${locale} cost row application start`,
    ).toBe(true);
  });

  it('keeps at least the ko and zh-hant cost tables on the agreement row', () => {
    expect(treatyCostRow('ko')).not.toBeNull();
    expect(treatyCostRow('zh-hant')).not.toBeNull();
  });

  it('keeps the ja and zh establishment columns on 2023年12月27日', () => {
    for (const file of [
      'src/content/columns-ja/001-taiwan-company-establishment-basics.md',
      'src/content/columns-zh/001-taiwan-company-establishment-basics.md',
    ]) {
      const source = readFileSync(path.join(process.cwd(), file), 'utf8');
      expect(source, file).toContain('2023年12月27日');
      expect(source, file).not.toMatch(WRONG_TREATY_DATE);
    }
  });
});
