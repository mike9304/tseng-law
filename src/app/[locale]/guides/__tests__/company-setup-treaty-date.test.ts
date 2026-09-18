import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { guideContent } from '@/app/[locale]/guides/taiwan-company-setup/content';

const WRONG_TREATY_DATE = /2023[.\-]12[.\-]0?2(?![0-9])/;
const LOCALES = ['ko', 'zh-hant', 'en', 'ja'] as const;

function treatyRowValue(locale: (typeof LOCALES)[number]): string {
  const row = guideContent[locale].costRows.find((item) =>
    /이중과세|雙重課稅|tax treaty|租税条約/.test(item.item),
  );
  expect(row, `${locale} Korea–Taiwan treaty cost row`).toBeDefined();
  return row?.values[0] ?? '';
}

describe('company-setup Korea–Taiwan DTA dates', () => {
  it.each(LOCALES)('does not keep the incorrect 2 December 2023 date in the %s treaty row', (locale) => {
    expect(treatyRowValue(locale)).not.toMatch(WRONG_TREATY_DATE);
  });

  it.each(LOCALES)(
    'states entry into force 2023-12-27 and application from 2024-01-01 in the %s treaty row',
    (locale) => {
      const value = treatyRowValue(locale);
      expect(
        value.includes('2023.12.27') || value.includes('2023-12-27'),
        `${locale} entry-into-force date`,
      ).toBe(true);
      expect(
        value.includes('2024.1.1') || value.includes('2024-01-01'),
        `${locale} application-start date`,
      ).toBe(true);
    },
  );

  it('keeps JA/ZH establishment columns on 2023年12月27日 and not 2023年12月2日', () => {
    const ja = readFileSync(
      path.join(process.cwd(), 'src/content/columns-ja/001-taiwan-company-establishment-basics.md'),
      'utf8',
    );
    const zh = readFileSync(
      path.join(process.cwd(), 'src/content/columns-zh/001-taiwan-company-establishment-basics.md'),
      'utf8',
    );

    expect(ja).toContain('2023年12月27日');
    expect(ja).not.toContain('2023年12月2日');
    expect(zh).toContain('2023年12月27日');
    expect(zh).not.toContain('2023年12月2日');
  });
});
