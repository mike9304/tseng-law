/**
 * Columns written natively for one audience (2026-09-29): English-, Japanese-
 * and Vietnamese-only articles that have no Korean source and no translations.
 * Corpus tests that assume "every locale mirrors the Korean set" exclude these
 * files; `native-locale-columns-20260929.test.ts` pins them instead.
 */
export const NATIVE_LOCALE_COLUMN_FILES = {
  en: [
    '032-taiwan-exit-ban-foreigners.md',
    '033-taiwan-police-questioning-foreigner-rights.md',
    '034-foreign-professional-dismissed-taiwan.md',
  ],
  ja: [
    '035-taiwan-unpaid-invoice-debt-collection.md',
    '036-taiwan-subsidiary-responsible-person-liability.md',
    '037-taiwan-subsidiary-employee-dismissal.md',
  ],
  vi: [
    '038-taiwan-bank-account-lending-fraud-money-laundering.md',
    '039-taiwan-migrant-worker-occupational-injury-compensation.md',
    '040-vietnamese-spouse-taiwan-residence-after-divorce-domestic-violence.md',
  ],
} as const;

export type NativeColumnLocale = keyof typeof NATIVE_LOCALE_COLUMN_FILES;

function slugOf(file: string): string {
  return file.replace(/\.md$/, '').replace(/^\d{3}-/, '');
}

export const NATIVE_LOCALE_COLUMN_SLUGS: ReadonlySet<string> = new Set(
  Object.values(NATIVE_LOCALE_COLUMN_FILES).flat().map(slugOf),
);

export function isNativeLocaleColumnFile(file: string): boolean {
  return NATIVE_LOCALE_COLUMN_SLUGS.has(slugOf(file));
}

export function isNativeLocaleColumnSlug(slug: string): boolean {
  return NATIVE_LOCALE_COLUMN_SLUGS.has(slug);
}
