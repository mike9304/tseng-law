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

/**
 * Expertise columns 041–048 (2026-09-30). Unlike 024–031 they are locale
 * specific: each file exists only in the locales it was written for, so
 * "one file per Korean file" no longer holds for every locale. Files with no
 * Korean twin are native to their locale; Korean files missing from a locale
 * are derived below so the mirror checks stay exact instead of being loosened.
 */
export const EXPERTISE_COLUMN_FILES_20260930 = {
  ko: [
    '043-korea-crypto-tax-2027-taiwan-residents.md',
    '046-taiwan-marital-property-regime-international-couples.md',
    '048-taiwan-stocks-direct-investment-tax.md',
  ],
  en: [
    '041-taiwan-crypto-exchange-vasp-dispute.md',
    '047-foreigner-buy-sell-taiwan-real-estate-tax.md',
    '048-taiwan-stocks-direct-investment-tax.md',
  ],
  ja: [
    '047-foreigner-buy-sell-taiwan-real-estate-tax.md',
    '048-taiwan-stocks-direct-investment-tax.md',
  ],
  'zh-hant': [
    '041-taiwan-crypto-exchange-vasp-dispute.md',
    '042-taiwan-investment-scam-recovery.md',
    '044-taiwan-payment-order-provisional-attachment.md',
    '045-taiwan-overseas-income-us-stocks-crypto-amt.md',
    '046-taiwan-marital-property-regime-international-couples.md',
    '047-foreigner-buy-sell-taiwan-real-estate-tax.md',
  ],
} as const;

export type ExpertiseColumnLocale = keyof typeof EXPERTISE_COLUMN_FILES_20260930;

/**
 * Traffic police-records column (2026-09-30; numbered 049 in its lane, 050 on
 * release). Same publication day as 041–048 and present in all four core
 * locales with a Korean twin, so the same-day ordering/count helpers below
 * include it alongside the expertise batch.
 */
export const TRAFFIC_COLUMN_FILES_20260930 = {
  ko: ['050-taiwan-accident-police-records.md'],
  en: ['050-taiwan-accident-police-records.md'],
  ja: ['050-taiwan-accident-police-records.md'],
  'zh-hant': ['050-taiwan-accident-police-records.md'],
} as const;

/** Every 2026-09-30 column file of `locale` (041–048 expertise + 050 traffic), in filename order. */
function sameDayFilesOf(locale: string): readonly string[] {
  return [
    ...(EXPERTISE_COLUMN_FILES_20260930[locale as ExpertiseColumnLocale] ?? []),
    ...(TRAFFIC_COLUMN_FILES_20260930[locale as ExpertiseColumnLocale] ?? []),
  ].sort();
}

const EXPERTISE_KO_FILES: readonly string[] = sameDayFilesOf('ko');

function expertiseFilesOf(locale: string): readonly string[] {
  return sameDayFilesOf(locale);
}

/** Slugs of the 2026-09-30 batch in `locale`, in source (filename) order; they lead the newest-first archive. */
export function expertiseSlugsFor(locale: string): string[] {
  return expertiseFilesOf(locale).map(slugOf);
}

/** Files of the 2026-09-30 batch in `locale` that have no Korean twin. */
export function expertiseNativeFiles(locale: string): string[] {
  return locale === 'ko' ? [] : expertiseFilesOf(locale).filter((file) => !EXPERTISE_KO_FILES.includes(file));
}

/** Korean files of the 2026-09-30 batch that `locale` does not carry (the guidance locales carry none of them). */
export function koFilesAbsentFromLocale(locale: string): string[] {
  if (locale === 'ko') return [];
  const present = expertiseFilesOf(locale);
  return EXPERTISE_KO_FILES.filter((file) => !present.includes(file));
}

/** Every native (no Korean twin) file of `locale`: the 2026-09-29 natives plus the 2026-09-30 ones. */
export function allNativeFiles(locale: string): string[] {
  const earlier: readonly string[] = NATIVE_LOCALE_COLUMN_FILES[locale as NativeColumnLocale] ?? [];
  return [...earlier, ...expertiseNativeFiles(locale)].sort();
}

const EXPERTISE_SLUGS_20260930: ReadonlySet<string> = new Set(
  [...Object.values(EXPERTISE_COLUMN_FILES_20260930), ...Object.values(TRAFFIC_COLUMN_FILES_20260930)].flat().map(slugOf),
);

/** True for any file/slug of the 2026-09-30 batch, in any locale. */
export function isExpertiseColumnFile20260930(file: string): boolean {
  return EXPERTISE_SLUGS_20260930.has(slugOf(file));
}

export function isExpertiseColumnSlug20260930(slug: string): boolean {
  return EXPERTISE_SLUGS_20260930.has(slug);
}

/** Posts of `locale` with no Korean twin (2026-09-29 and 2026-09-30 natives). */
export function isNativeOrExpertiseNativeSlug(locale: string, slug: string): boolean {
  return (
    isNativeLocaleColumnSlug(slug) ||
    expertiseNativeFiles(locale).some((file) => slugOf(file) === slug)
  );
}
