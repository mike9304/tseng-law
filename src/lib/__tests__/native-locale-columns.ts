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

/**
 * Korean-first traffic column 051 (2026-10-01; traffic column routine ko → zh-Hant → en).
 * Available in Korean, Traditional Chinese and English. It is newer than the 2026-09-30 batch and so
 * leads those archives; the helpers below fold it in with that batch because every
 * assertion built on them is about "files not mirrored in every locale that lead the
 * newest-first archive". Add its other locales here when their files ship.
 */
export const TRAFFIC_COLUMN_FILES_20261001 = {
  ko: ['051-taiwan-left-turn-vs-straight-motorcycle.md'],
  'zh-hant': ['051-taiwan-left-turn-vs-straight-motorcycle.md'],
  en: ['051-taiwan-left-turn-vs-straight-motorcycle.md'],
} as const;

/**
 * Expertise columns 052–059 (2026-10-01 weekday routine). Locale-specific like 041–048.
 */
export const EXPERTISE_COLUMN_FILES_20261001 = {
  ko: [
    '052-taiwan-commercial-court-jurisdiction-threshold.md',
    '053-taiwan-franchise-foreign-brand-entry.md',
    '055-taiwan-company-dissolution-liquidation.md',
    '056-taiwan-medical-malpractice-foreign-patient.md',
    '058-taiwan-online-consumer-dispute-foreigners.md',
    '059-taiwan-criminal-accessory-civil-suit-fraud.md',
  ],
  en: [
    '052-taiwan-commercial-court-jurisdiction-threshold.md',
    '053-taiwan-franchise-foreign-brand-entry.md',
    '054-taiwan-foreign-employer-labor-dispute-strike.md',
    '055-taiwan-company-dissolution-liquidation.md',
    '056-taiwan-medical-malpractice-foreign-patient.md',
    '057-taiwan-cfc-overseas-subsidiary-tax.md',
    '058-taiwan-online-consumer-dispute-foreigners.md',
    '059-taiwan-criminal-accessory-civil-suit-fraud.md',
  ],
  ja: [
    '054-taiwan-foreign-employer-labor-dispute-strike.md',
    '055-taiwan-company-dissolution-liquidation.md',
    '058-taiwan-online-consumer-dispute-foreigners.md',
  ],
  'zh-hant': [
    '052-taiwan-commercial-court-jurisdiction-threshold.md',
    '053-taiwan-franchise-foreign-brand-entry.md',
    '054-taiwan-foreign-employer-labor-dispute-strike.md',
    '055-taiwan-company-dissolution-liquidation.md',
    '056-taiwan-medical-malpractice-foreign-patient.md',
    '057-taiwan-cfc-overseas-subsidiary-tax.md',
    '059-taiwan-criminal-accessory-civil-suit-fraud.md',
  ],
} as const;

/**
 * Domestic-interest columns 060–062 (2026-10-01), written natively for Taiwanese readers
 * (zh-hant only, no Korean twin): inheritance renunciation, public insult / defamation
 * complaints, unpaid overtime pay. Same day as 052–059, so they join the same-day helpers.
 */

/**
 * Expertise columns 063–069 (2026-10-02 weekday routine). Locale-specific like 052–059.
 * KO+EN+ZH-Hant for all seven; JA for 066 FX remittance and 067 company responsible person.
 */
export const EXPERTISE_COLUMN_FILES_20261002 = {
  ko: [
    '063-taiwan-gift-tax-foreigners.md',
    '064-taiwan-warning-account-foreigners.md',
    '065-taiwan-rental-deposit-foreign-tenant.md',
    '066-taiwan-fx-remittance-declaration.md',
    '067-taiwan-company-responsible-person-liability.md',
    '068-taiwan-child-support-enforcement-cross-border.md',
    '069-taiwan-labor-mediation-foreign-employee.md',
  ],
  en: [
    '063-taiwan-gift-tax-foreigners.md',
    '064-taiwan-warning-account-foreigners.md',
    '065-taiwan-rental-deposit-foreign-tenant.md',
    '066-taiwan-fx-remittance-declaration.md',
    '067-taiwan-company-responsible-person-liability.md',
    '068-taiwan-child-support-enforcement-cross-border.md',
    '069-taiwan-labor-mediation-foreign-employee.md',
  ],
  ja: [
    '066-taiwan-fx-remittance-declaration.md',
    '067-taiwan-company-responsible-person-liability.md',
  ],
  'zh-hant': [
    '063-taiwan-gift-tax-foreigners.md',
    '064-taiwan-warning-account-foreigners.md',
    '065-taiwan-rental-deposit-foreign-tenant.md',
    '066-taiwan-fx-remittance-declaration.md',
    '067-taiwan-company-responsible-person-liability.md',
    '068-taiwan-child-support-enforcement-cross-border.md',
    '069-taiwan-labor-mediation-foreign-employee.md',
  ],
} as const;

export const DOMESTIC_ZH_COLUMN_FILES_20261001 = {
  'zh-hant': [
    '060-taiwan-inheritance-renunciation-debt.md',
    '061-taiwan-defamation-public-insult-complaint.md',
    '062-taiwan-unpaid-overtime-pay.md',
  ],
} as const;

/** Independently authored audience columns, including a domestic Taiwan addition. */
export const COUNTRY_COLUMN_FILES_20261002 = {
  'zh-hant': [
    '072-taiwan-lane-change-side-rear-collision-liability.md',
    '073-taiwan-right-turn-car-straight-motorcycle-evidence.md',
    '074-taiwan-flashing-red-yellow-intersection-liability.md',
    '075-taiwan-car-door-opening-motorcycle-liability.md',
    '076-taiwan-roadside-starting-parking-exit-liability.md',
    '077-taiwan-chain-rear-end-first-impact-evidence.md',
    '078-taiwan-bus-sudden-braking-passenger-carrier-liability.md',
    '079-taiwan-accident-stop-dialogue-hit-and-run-evidence.md',
    '080-taiwan-borrowed-car-owner-driver-key-custody-liability.md',
    '081-taiwan-car-repair-cost-estimate-parts-depreciation.md',
    '082-taiwan-mediation-delayed-injury-rescission.md',
    '083-taiwan-accident-assessment-secondary-cause-compensation-ratio.md',
    '084-taiwan-car-accident-work-loss-rest-note.md',
  ],
  vi: ['070-taiwan-employer-broker-passport-arc-return.md'],
  ja: ['071-taiwan-entry-japan-heated-tobacco-vapes-duty-free.md'],
} as const;

/** Native audience, traffic and family-law columns published 2026-10-03 (085–098, 100–103). */
export const COUNTRY_COLUMN_FILES_20261003 = {
  'ko': [
    '091-taiwan-distributor-trademark-registration-korean-brand.md',
    '094-korea-divorce-recognition-taiwan-household-registration.md', // family lane b01
  ],
  'en': [
    '092-taiwan-bank-inheritance-us-power-of-attorney.md',
    '095-us-parent-child-taken-to-taiwan-custody.md', // family lane b01
  ],
  'ja': [
    '096-taiwan-protection-order-japanese-spouse.md', // family lane b01
  ],
  'zh-hant': [
    '085-taiwan-accident-family-care-necessity-period.md',
    '086-taiwan-car-repair-rental-cost-repair-period-evidence.md',
    '087-taiwan-retaliatory-driving-rear-ended-intentional-injury.md',
    '088-taiwan-racing-no-contact-joint-tort-liability.md',
    '089-taiwan-truck-blocking-multiple-dashcam-evidence.md',
    '090-green-light-red-light-pedestrian-third-person.md',
    '093-taiwan-gas-station-tanker-reversing-beeper-liability.md',
    '097-taiwan-parking-wheelstop-latch-service-safety-causation.md',
    '098-taiwan-motorway-blocking-no-collision-public-danger.md',
    '100-taiwan-lowered-height-gantry-state-compensation-driver-fault.md',
    '101-taiwan-flying-object-truck-origin-dashcam-evidence.md',
    '102-taiwan-motorcycle-passenger-compulsory-insurance-unlicensed-recourse.md',
    '103-taiwan-uninsured-settlement-excludes-compulsory-insurance-fund-deduction.md',
  ],
} as const;

/** Road-rage judgment series (2026-10-03), published in all four locales with a reviewed looping dashcam-style AI clip. */
export const ROAD_RAGE_COLUMN_FILES_20261003 = {
  ko: ['099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md'],
  en: ['099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md'],
  ja: ['099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md'],
  'zh-hant': ['099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md'],
} as const;

/** Registered locale-specific batches through 2026-10-03, in filename order. */
function sameDayFilesOf(locale: string): readonly string[] {
  return [
    ...(EXPERTISE_COLUMN_FILES_20260930[locale as ExpertiseColumnLocale] ?? []),
    ...(TRAFFIC_COLUMN_FILES_20260930[locale as ExpertiseColumnLocale] ?? []),
    ...((TRAFFIC_COLUMN_FILES_20261001 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((EXPERTISE_COLUMN_FILES_20261001 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((DOMESTIC_ZH_COLUMN_FILES_20261001 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((EXPERTISE_COLUMN_FILES_20261002 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261002 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261003 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((ROAD_RAGE_COLUMN_FILES_20261003 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
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

/**
 * Archive lead of `locale`, newest first by date through 2026-10-03, with same-day
 * files in source order. Use this for newest-first ordering assertions;
 * `expertiseSlugsFor` stays in filename order for counts and column-number tie-breaks.
 */
export function archiveLeadSlugsFor(locale: string): string[] {
  const latest: readonly string[] = [
    ...((COUNTRY_COLUMN_FILES_20261003 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((ROAD_RAGE_COLUMN_FILES_20261003 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
  ];
  const newest: readonly string[] = [
    ...((EXPERTISE_COLUMN_FILES_20261002 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261002 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
  ];
  const newer: readonly string[] = [
    ...((TRAFFIC_COLUMN_FILES_20261001 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((EXPERTISE_COLUMN_FILES_20261001 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((DOMESTIC_ZH_COLUMN_FILES_20261001 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
  ];
  // Same calendar day → source (filename) order, matching sortColumnPostsNewestFirst.
  const latestSlugs = [...latest].sort().map(slugOf);
  const newestSlugs = [...newest].sort().map(slugOf);
  const newerSlugs = [...newer].sort().map(slugOf);
  const head = [...latestSlugs, ...newestSlugs, ...newerSlugs];
  return [...head, ...expertiseSlugsFor(locale).filter((slug) => !head.includes(slug))];
}

/** Verified publication date of an archive-lead slug (2026-09-30 through 2026-10-03). */
export function archiveLeadPublicationDate(slug: string): string {
  const latest = [...Object.values(COUNTRY_COLUMN_FILES_20261003), ...Object.values(ROAD_RAGE_COLUMN_FILES_20261003)].flat().map(slugOf);
  if (latest.includes(slug)) return '2026-10-03';
  const newest = [
    ...Object.values(EXPERTISE_COLUMN_FILES_20261002),
    ...Object.values(COUNTRY_COLUMN_FILES_20261002),
  ].flat().map(slugOf);
  if (newest.includes(slug)) return '2026-10-02';
  const newer = [
    ...Object.values(TRAFFIC_COLUMN_FILES_20261001),
    ...Object.values(EXPERTISE_COLUMN_FILES_20261001),
    ...Object.values(DOMESTIC_ZH_COLUMN_FILES_20261001),
  ].flat().map(slugOf);
  return newer.includes(slug) ? '2026-10-01' : '2026-09-30';
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
  [
    ...Object.values(EXPERTISE_COLUMN_FILES_20260930),
    ...Object.values(TRAFFIC_COLUMN_FILES_20260930),
    ...Object.values(TRAFFIC_COLUMN_FILES_20261001),
    ...Object.values(EXPERTISE_COLUMN_FILES_20261001),
    ...Object.values(DOMESTIC_ZH_COLUMN_FILES_20261001),
    ...Object.values(EXPERTISE_COLUMN_FILES_20261002),
    ...Object.values(COUNTRY_COLUMN_FILES_20261002),
    ...Object.values(COUNTRY_COLUMN_FILES_20261003),
    ...Object.values(ROAD_RAGE_COLUMN_FILES_20261003),
  ].flat().map(slugOf),
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
