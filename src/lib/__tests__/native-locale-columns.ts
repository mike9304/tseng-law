import { AIR_COLUMN_FILES_20261011, AIR_COLUMN_PUBLICATION_DATE } from './air-column-files';
import { NEXT_TOPIC_COLUMN_FILES_20261010 } from './next-topic-column-files';
import { GAP_COLUMN_FILES_20261010 } from './gap-column-files';
import { SINGAPORE_COLUMN_FILES_20261010 } from './singapore-column-files';
import { AI_SEMICONDUCTOR_COLUMN_FILES_20261009 } from './ai-semiconductor-column-files';
import { TAX_ACCOUNTING_COLUMN_FILES, taxAccountingFilesPublishedOn } from './tax-accounting-column-files';
import { CRIMINAL_COLUMN_FILES_20261008 } from './criminal-coverage-column-files';

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

/** Native audience, traffic and family-law columns published 2026-10-03 (085–108). */
export const COUNTRY_COLUMN_FILES_20261003 = {
  'ko': [
    '091-taiwan-distributor-trademark-registration-korean-brand.md',
    '094-korea-divorce-recognition-taiwan-household-registration.md', // family lane b01
    '110-korean-supplier-tsmc-vendor-qualification-contract.md', // semiconductor lane b01
    '116-taiwan-trade-secrets-act-criminal-civil-korean-companies.md', // semiconductor lane b04
    '134-taiwan-national-security-act-core-key-technology-korean-engineers.md', // reviewed fraud/semiconductor release
    '143-taiwan-unpaid-invoice-fraud-or-contract.md', // reviewed fraud/semiconductor release
    '144-taiwan-protection-order-domestic-violence-korean-spouse.md', // family lane b05
    '160-lost-korean-passport-taiwan-return-travel-documents.md', // reviewed editorial batch002
    '167-taiwan-secondhand-seller-payment-verification-scam-korean.md', // reviewed editorial batch003
  ],
  'en': [
    '092-taiwan-bank-inheritance-us-power-of-attorney.md',
    '095-us-parent-child-taken-to-taiwan-custody.md', // family lane b01
    '108-us-divorce-decree-recognition-taiwan.md', // family lane b02+b03 ship
    '112-micron-taiwan-trade-secret-cases-lessons-for-us-companies.md', // semiconductor lane b01
    '118-tsmc-arizona-chips-act-taiwan-outbound-approval.md', // semiconductor lane b04
    '136-taiwan-export-controls-shtc-entity-list-us-ear-compliance.md', // reviewed fraud/semiconductor release
    '142-taiwan-supplier-bank-account-change-bec.md', // reviewed fraud/semiconductor release
    '159-immigration-officer-impersonation-arc-taiwan.md', // reviewed editorial batch002
    '166-parcel-pickup-job-scam-bank-cards-taiwan.md', // reviewed editorial batch003
  ],
  'ja': [
    '096-taiwan-protection-order-japanese-spouse.md', // family lane b01
    '111-tsmc-kumamoto-jasm-taiwan-outbound-investment-rules.md', // semiconductor lane b01
    '115-japan-kyogi-rikon-recognition-taiwan.md', // family lane b04
    '117-japanese-materials-supplier-taiwan-nda-trade-secrets.md', // semiconductor lane b04
    '135-japanese-equipment-maker-engineers-taiwan-work-permit.md', // reviewed fraud/semiconductor release
    '141-taiwan-rental-deposit-before-viewing-fraud.md', // reviewed fraud/semiconductor release
    '158-taiwan-hotel-booking-extra-payment-phishing.md', // reviewed editorial batch002
    '165-taiwan-issued-card-unauthorized-charge-dispute-japanese.md', // reviewed editorial batch003
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
    '104-judicial-divorce-grounds-civil-code-1052.md', // family lane b02
    '105-child-support-calculation-taiwan-court.md', // family lane b02
    '106-remaining-property-distribution-calculation.md', // family lane b03
    '107-child-custody-best-interests-social-worker-report.md', // family lane b03
    '113-domestic-violence-protection-order-application-evidence.md', // family lane b04
    '114-divorce-agreement-terms-before-signing.md', // family lane b04
    '119-taiwan-semiconductor-employees-overseas-assignment-labor-law.md', // semiconductor lane b04
    '120-taiwan-ambulance-red-light-emergency-priority-negligence.md',
    '121-taiwan-bus-stop-illegal-parking-no-contact-criminal-causation.md',
    '133-taiwan-semiconductor-overseas-fab-core-key-technology-review.md', // reviewed fraud/semiconductor release
    '137-taiwan-engineer-job-change-trade-secret-national-security-judgments.md', // reviewed fraud/semiconductor release
    '138-cash-investment-courier-receipt-fraud-taiwan.md', // reviewed fraud/semiconductor release
    '139-land-registration-alert-property-fraud-taiwan.md', // reviewed fraud/semiconductor release
    '140-fake-lawyer-scam-recovery-fee-taiwan.md', // reviewed fraud/semiconductor release
    '154-family-voice-impersonation-transfer-taiwan.md', // reviewed editorial batch002
    '155-secondhand-concert-ticket-screenshot-taiwan.md', // reviewed editorial batch002
    '156-presale-home-payee-developer-agent-taiwan.md', // reviewed editorial batch002
    '157-unordered-cash-on-delivery-parcel-taiwan.md', // reviewed editorial batch002
    '161-job-scam-payroll-account-atm-card-taiwan.md', // reviewed editorial batch003
    '162-fake-customer-service-cancel-installment-atm-taiwan.md', // reviewed editorial batch003
    '163-gym-closure-prepaid-installments-taiwan.md', // reviewed editorial batch003
    '164-promissory-note-enforcement-undisbursed-loan-taiwan.md', // reviewed editorial batch003
  ],
} as const;

/** Road-rage judgment series (2026-10-03), published in all four locales with a reviewed looping dashcam-style AI clip. */
export const ROAD_RAGE_COLUMN_FILES_20261003 = {
  ko: ['099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md', '109-taiwan-road-rage-baseball-bat-fracture-damages.md', '122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md'],
  en: ['099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md', '109-taiwan-road-rage-baseball-bat-fracture-damages.md', '122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md'],
  ja: ['099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md', '109-taiwan-road-rage-baseball-bat-fracture-damages.md', '122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md'],
  'zh-hant': ['099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md', '109-taiwan-road-rage-baseball-bat-fracture-damages.md', '122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md'],
} as const;

/** Native semiconductor, traffic and reviewed Taiwan-first editorial columns published 2026-10-04. */
export const COUNTRY_COLUMN_FILES_20261004 = {
  ko: [
    '168-taiwan-gold-card-semiconductor-talent-korean-engineers.md',
    '180-taiwan-unpaid-invoice-settlement-release-korean.md', // reviewed editorial batch004
    '187-taiwan-trademark-nonuse-three-years-korean-brand.md', // reviewed editorial batch005
    '188-taiwan-road-rage-started-did-not-matter-driver-blocked.md', // road-rage series (all four locales)
    '191-taiwan-road-rage-driver-stopped-route-66s-fast-lane.md', // road-rage series (all four locales)
    '192-taiwan-export-control-entity-list-korean-traders.md', // semiconductor lane b08
    '194-taiwan-road-rage-freeway-chase-own-dashcam-too.md', // road-rage series (all four locales)
    '197-taiwan-remaining-property-claim-asset-tracing.md', // family lane b08
    '201-taiwan-road-rage-52-seconds-subtracted-case.md', // road-rage series (all four locales)
    '204-taiwan-road-rage-two-second-stop-taipei-not-enough.md', // road-rage series (all four locales)
    '207-taiwan-semiconductor-shift-work-labor-law-korean-subsidiary.md', // semiconductor lane b09
    '211-taiwan-science-park-fab-supplier-permits-water-power.md', // semiconductor lane b10
  ],
  en: [
    '170-taiwan-trade-secrets-act-civil-remedies-injunctions-us-tech.md',
    '179-taiwan-landlord-entry-rental-home-repairs.md', // reviewed editorial batch004
    '186-taiwan-personal-data-access-copy-request.md', // reviewed editorial batch005
    '188-taiwan-road-rage-started-did-not-matter-driver-blocked.md', // road-rage series (all four locales)
    '191-taiwan-road-rage-driver-stopped-route-66s-fast-lane.md', // road-rage series (all four locales)
    '194-taiwan-road-rage-freeway-chase-own-dashcam-too.md', // road-rage series (all four locales)
    '200-taiwan-protection-order-foreign-resident.md', // family lane b09
    '201-taiwan-road-rage-52-seconds-subtracted-case.md', // road-rage series (all four locales)
    '204-taiwan-road-rage-two-second-stop-taipei-not-enough.md', // road-rage series (all four locales)
    '209-us-taiwan-double-taxation-semiconductor-expansion.md', // semiconductor lane b09
  ],
  ja: [
    '202-taiwan-post-employment-non-compete-compensation-japanese.md', // reviewed daily Japan/Vietnam pair
    '169-taiwan-semiconductor-labor-union-collective-bargaining-japanese-subsidiary.md',
    '178-taiwan-hotel-luggage-loss-custody-japanese.md', // reviewed editorial batch004
    '185-taiwan-hotel-typhoon-cancellation-refund-japanese.md', // reviewed editorial batch005
    '188-taiwan-road-rage-started-did-not-matter-driver-blocked.md', // road-rage series (all four locales)
    '191-taiwan-road-rage-driver-stopped-route-66s-fast-lane.md', // road-rage series (all four locales)
    '193-taiwan-science-park-entry-japanese-semiconductor-companies.md', // semiconductor lane b08
    '194-taiwan-road-rage-freeway-chase-own-dashcam-too.md', // road-rage series (all four locales)
    '201-taiwan-road-rage-52-seconds-subtracted-case.md', // road-rage series (all four locales)
    '204-taiwan-road-rage-two-second-stop-taipei-not-enough.md', // road-rage series (all four locales)
    '208-taiwan-ip-commercial-court-semiconductor-patent-judgments.md', // semiconductor lane b09
    '212-japan-taiwan-tax-agreement-semiconductor-expatriates.md', // semiconductor lane b10
  ],
  'zh-hant': [
    '171-taiwan-ic-design-cross-border-patent-licensing-disputes.md',
    '172-taiwan-video-timing-sidewalk-bicycle-alley-scooter-evidence.md',
    '173-taiwan-manhole-pothole-road-authority-utility-internal-recourse.md',
    '174-home-leak-defect-notice-repair-evidence-taiwan.md', // reviewed editorial batch004
    '175-contractor-employee-status-control-work-taiwan.md', // reviewed editorial batch004
    '176-private-loan-joint-guarantor-first-demand-taiwan.md', // reviewed editorial batch004
    '177-parent-home-gift-care-obligation-evidence-taiwan.md', // reviewed editorial batch004
    '181-annual-leave-dates-employer-scheduling-taiwan.md', // reviewed editorial batch005
    '182-rental-electricity-average-price-bill-taiwan.md', // reviewed editorial batch005
    '183-limited-company-shareholder-books-inspection-taiwan.md', // reviewed editorial batch005
    '184-handwritten-will-typed-print-signature-taiwan.md', // reviewed editorial batch005
    '188-taiwan-road-rage-started-did-not-matter-driver-blocked.md', // road-rage series (all four locales)
    '189-taiwan-repaired-car-diminished-value-appraisal-evidence.md',
    '190-taiwan-pursuit-fatal-self-crash-vacated-judgment.md',
    '191-taiwan-road-rage-driver-stopped-route-66s-fast-lane.md', // road-rage series (all four locales)
    '194-taiwan-road-rage-freeway-chase-own-dashcam-too.md', // road-rage series (all four locales)
    '195-reserved-share-will-inheritance-dispute.md', // family lane b08
    '196-separation-cohabitation-duty-taiwan.md', // family lane b08
    '198-alimony-after-divorce-civil-code-1057.md', // family lane b09
    '199-child-surname-change-after-divorce.md', // family lane b09
    '201-taiwan-road-rage-52-seconds-subtracted-case.md', // road-rage series (all four locales)
    '204-taiwan-road-rage-two-second-stop-taipei-not-enough.md', // road-rage series (all four locales)
    '205-taiwan-detached-tire-delayed-treatment-criminal-injury-causation.md',
    '206-taiwan-freeway-warning-triangle-time-ability-evidence.md',
    '210-taiwan-semiconductor-foreign-talent-recruitment-law.md', // semiconductor lane b09
    '214-taiwan-semiconductor-export-control-entity-list-2025.md', // semiconductor lane b10
  ],
  vi: [
    '203-taiwan-change-employer-broker-jobbuying-fees.md', // reviewed daily Japan/Vietnam pair
  ],
} as const;

/** Native audience columns published 2026-10-05. */
export const COUNTRY_COLUMN_FILES_20261005 = {
  en: [
    '213-taiwan-marital-property-division-us-assets.md', // family lane b27
    '221-us-equipment-vendor-field-engineers-taiwan-labor-law.md', // semiconductor lane b15
    '228-taiwan-zero-recruitment-fee-forced-labor-rules-us-chip-supply-chain.md', // semiconductor lane b17
    '230-taiwan-inheritance-registration-deadline-unregistered-land.md', // inherit-20261005-I1
    '231-taiwan-estate-tax-2026-amendment-gifts-before-death.md', // inherit-20261005-I2
    '232-taiwan-intestate-succession-order-shares-representation.md', // inherit-20261005-I3
    '233-taiwan-parent-debt-renunciation-heir-in-japan.md', // inherit-20261005-I5
    '234-us-living-trust-will-taiwan-property.md', // inherit-20261005-I6
    '237-us-victim-scam-funds-taiwan-bank-complaint.md', // fraud lane b57
    '249-korean-national-dies-in-taiwan-inheritance-estate-tax.md', // inherit-20261005-I4
  ],
  'zh-hant': [
    '215-remaining-property-distribution-overseas-assets.md', // family lane b27
    '216-spouse-affair-evidence-damages-taiwan.md', // family lane b27
    '217-landlord-listing-stolen-fake-rental-deposit-taiwan.md', // fraud lane b05
    '222-taiwan-semiconductor-environmental-compliance-wastewater-judgments.md', // semiconductor lane b15
    '223-account-lending-prosecutor-summons-money-laundering-taiwan.md', // fraud lane b53
    '224-romance-scam-loan-or-fraud-evidence-taiwan.md', // fraud lane b53
    '229-taiwan-employee-stock-award-tax-deferral-industrial-innovation-act-19-1.md', // semiconductor lane b17
    '230-taiwan-inheritance-registration-deadline-unregistered-land.md', // inherit-20261005-I1
    '231-taiwan-estate-tax-2026-amendment-gifts-before-death.md', // inherit-20261005-I2
    '232-taiwan-intestate-succession-order-shares-representation.md', // inherit-20261005-I3
    '233-taiwan-parent-debt-renunciation-heir-in-japan.md', // inherit-20261005-I5
    '234-us-living-trust-will-taiwan-property.md', // inherit-20261005-I6
    '235-fraud-crime-prevention-act-2024-victims-taiwan.md', // fraud lane b57
    '236-fraud-complaint-filing-police-prosecutor-taiwan.md', // fraud lane b57
    '240-change-custody-visitation-refusal.md', // family lane b79
    '241-child-taken-abroad-taiwan-parent-remedies.md', // family lane b79
    '243-provisional-order-during-divorce-custody-support.md', // family lane b80
    '244-family-act-procedure-litigation-vs-non-contentious.md', // family lane b80
    '246-criminal-confiscation-return-to-fraud-victims-taiwan.md', // fraud lane b59
    '247-fraud-victim-provisional-attachment-security-taiwan.md', // fraud lane b59
    '249-korean-national-dies-in-taiwan-inheritance-estate-tax.md', // inherit-20261005-I4
  ],
  ja: [
    '218-japanese-resident-taiwan-account-lending-crime.md', // fraud lane b05
    '220-taiwan-semiconductor-chemicals-environment-permits-japanese.md', // semiconductor lane b15
    '225-japanese-victim-fraud-complaint-taiwan-account.md', // fraud lane b53
    '227-taiwan-origin-declaration-us-bound-exports-japanese-trading-companies.md', // semiconductor lane b17
    '230-taiwan-inheritance-registration-deadline-unregistered-land.md', // inherit-20261005-I1
    '231-taiwan-estate-tax-2026-amendment-gifts-before-death.md', // inherit-20261005-I2
    '232-taiwan-intestate-succession-order-shares-representation.md', // inherit-20261005-I3
    '233-taiwan-parent-debt-renunciation-heir-in-japan.md', // inherit-20261005-I5
    '234-us-living-trust-will-taiwan-property.md', // inherit-20261005-I6
    '239-taiwan-renewable-obligation-new-plants-energy-act-bill-japanese-makers.md', // semiconductor lane b19
    '242-child-abduction-taiwan-non-hague-japan.md', // family lane b79
    '248-japanese-subsidiary-taiwan-invoice-fraud-recovery.md', // fraud lane b59
    '249-korean-national-dies-in-taiwan-inheritance-estate-tax.md', // inherit-20261005-I4
  ],
  ko: [
    '219-taiwan-semiconductor-patent-litigation-korean-companies.md', // semiconductor lane b15
    '226-tsmc-former-executive-intel-noncompete-injunction-korean-employers.md', // semiconductor lane b17
    '230-taiwan-inheritance-registration-deadline-unregistered-land.md', // inherit-20261005-I1
    '231-taiwan-estate-tax-2026-amendment-gifts-before-death.md', // inherit-20261005-I2
    '232-taiwan-intestate-succession-order-shares-representation.md', // inherit-20261005-I3
    '233-taiwan-parent-debt-renunciation-heir-in-japan.md', // inherit-20261005-I5
    '234-us-living-trust-will-taiwan-property.md', // inherit-20261005-I6
    '238-korea-taiwan-tax-agreement-dispatched-engineers-permanent-establishment.md', // semiconductor lane b19
    '245-child-taken-to-taiwan-non-hague-korean-parent.md', // family lane b80
    '249-korean-national-dies-in-taiwan-inheritance-estate-tax.md', // inherit-20261005-I4
  ],
} as const;

/** Native audience columns published 2026-10-06. */
export const COUNTRY_COLUMN_FILES_20261006 = {
  ko: [
    '250-taiwan-stalking-harassment-act-written-warning-protection-order.md', // cols-20261006-C1
    '251-taiwan-small-claims-simplified-civil-procedure.md', // cols-20261006-C2
    '252-taiwan-workplace-sexual-harassment-employer-obligations.md', // cols-20261006-C3
    '253-taiwan-maternity-paternity-parental-leave-2026.md', // cols-20261006-C4
    '254-taiwan-apartment-management-committee-fees-rules.md', // cols-20261006-C5
    '255-taiwan-copyright-employee-freelancer-work-ownership.md', // cols-20261006-C6
    '256-taiwan-vat-foreign-digital-services-registration.md', // cols-20261006-C7
    '257-taiwan-naturalization-keep-original-nationality.md', // cols-20261006-C8
    '258-taiwan-dui-reach-beyond-drivers-seat.md', // gap1006-G1
    '259-taken-taiwan-police-station-first-24-hours-not-release.md', // gap1006-G2
    '260-foreigners-buying-property-in-taiwan.md', // gap1006-G3
    '275-taiwan-divorce-property-damages-support.md', // audit-split-1006
  ],
  en: [
    '250-taiwan-stalking-harassment-act-written-warning-protection-order.md', // cols-20261006-C1
    '251-taiwan-small-claims-simplified-civil-procedure.md', // cols-20261006-C2
    '252-taiwan-workplace-sexual-harassment-employer-obligations.md', // cols-20261006-C3
    '253-taiwan-maternity-paternity-parental-leave-2026.md', // cols-20261006-C4
    '254-taiwan-apartment-management-committee-fees-rules.md', // cols-20261006-C5
    '255-taiwan-copyright-employee-freelancer-work-ownership.md', // cols-20261006-C6
    '256-taiwan-vat-foreign-digital-services-registration.md', // cols-20261006-C7
    '257-taiwan-naturalization-keep-original-nationality.md', // cols-20261006-C8
    '258-taiwan-dui-reach-beyond-drivers-seat.md', // gap1006-G1
    '259-taken-taiwan-police-station-first-24-hours-not-release.md', // gap1006-G2
    '260-foreigners-buying-property-in-taiwan.md', // gap1006-G3
    '275-taiwan-divorce-property-damages-support.md', // audit-split-1006
  ],
  ja: [
    '250-taiwan-stalking-harassment-act-written-warning-protection-order.md', // cols-20261006-C1
    '251-taiwan-small-claims-simplified-civil-procedure.md', // cols-20261006-C2
    '252-taiwan-workplace-sexual-harassment-employer-obligations.md', // cols-20261006-C3
    '253-taiwan-maternity-paternity-parental-leave-2026.md', // cols-20261006-C4
    '254-taiwan-apartment-management-committee-fees-rules.md', // cols-20261006-C5
    '255-taiwan-copyright-employee-freelancer-work-ownership.md', // cols-20261006-C6
    '256-taiwan-vat-foreign-digital-services-registration.md', // cols-20261006-C7
    '257-taiwan-naturalization-keep-original-nationality.md', // cols-20261006-C8
    '258-taiwan-dui-reach-beyond-drivers-seat.md', // gap1006-G1
    '259-taken-taiwan-police-station-first-24-hours-not-release.md', // gap1006-G2
    '260-foreigners-buying-property-in-taiwan.md', // gap1006-G3
    '307-taiwan-divorce-children-custody-support-visitation.md', // audit-split-1006
    '275-taiwan-divorce-property-damages-support.md', // audit-split-1006
    '310-japanese-engineer-hired-by-taiwan-subsidiary-work-permit.md', // audit-split-1006
  ],
  'zh-hant': [
    '250-taiwan-stalking-harassment-act-written-warning-protection-order.md', // cols-20261006-C1
    '251-taiwan-small-claims-simplified-civil-procedure.md', // cols-20261006-C2
    '252-taiwan-workplace-sexual-harassment-employer-obligations.md', // cols-20261006-C3
    '253-taiwan-maternity-paternity-parental-leave-2026.md', // cols-20261006-C4
    '254-taiwan-apartment-management-committee-fees-rules.md', // cols-20261006-C5
    '255-taiwan-copyright-employee-freelancer-work-ownership.md', // cols-20261006-C6
    '256-taiwan-vat-foreign-digital-services-registration.md', // cols-20261006-C7
    '257-taiwan-naturalization-keep-original-nationality.md', // cols-20261006-C8
    '258-taiwan-dui-reach-beyond-drivers-seat.md', // gap1006-G1
    '259-taken-taiwan-police-station-first-24-hours-not-release.md', // gap1006-G2
    '260-foreigners-buying-property-in-taiwan.md', // gap1006-G3
    '308-taiwan-engineer-leaving-job-trade-secret-risk.md', // audit-split-1006
    '309-taiwan-semiconductor-core-key-technology-list-trade-secrets.md', // audit-split-1006
  ],
} as const;

/** Native audience columns published 2026-10-07. */
export const COUNTRY_COLUMN_FILES_20261007 = {
  ja: [
    '261-japanese-arrested-questioned-in-taiwan-interpreter-lawyer-detention.md', // ja-plan-20261006
    '262-taiwan-drunk-driving-thresholds-criminal-code-185-3-license-return-home.md', // ja-plan-20261006
    '263-japanese-will-effect-on-taiwan-real-estate-and-deposits.md', // ja-plan-20261006
    '264-taiwan-certified-letter-cunzheng-xinhan-vs-japanese-naiyo-shomei.md', // ja-plan-20261006
    '265-taiwan-distributor-registered-japanese-brand-trademark.md', // ja-plan-20261006
    '266-taiwan-rental-deposit-refund-two-months.md', // ja-plan-20261006
    '267-japan-taiwan-couple-marital-property-governing-law.md', // ja-plan-20261006
    '268-taiwan-labor-dispute-mediation-bureau-vs-court.md', // ja-plan-20261006
    '269-taiwan-medical-dispute-records-mediation-damages.md', // ja-plan-20261006
    '270-taiwan-company-setup-costs-japanese.md', // ja-plan-20261006
    '271-taiwan-traffic-accident-compensation-items-japanese.md', // ja-plan-20261006
    '272-taiwan-warning-account-frozen-japanese.md', // ja-plan-20261006
    '273-taiwan-national-security-act-core-technology-japanese-employers.md', // ja-plan-20261006
    '346-taiwan-distributor-agreement-termination-japanese-brand.md', // enja-inbound-20261007
    '347-taiwan-counterfeit-japanese-brand-customs-criminal-civil.md', // enja-inbound-20261007
    '348-taiwan-cross-border-ecommerce-consumer-protection-japanese-sellers.md', // enja-inbound-20261007
    '349-japanese-company-acquiring-taiwan-company-investment-review-merger-filing.md', // enja-inbound-20261007
    '350-taiwan-cannabis-cbd-penalties-japanese-travellers.md', // enja-inbound-20261007

    '401-taiwan-criminal-witness-summons-refuse-testimony.md', // criminal-20261007
    '402-taiwan-criminal-settlement-withdraw-complaint.md', // criminal-20261007
    '403-taiwan-non-prosecution-reconsideration-deadline.md', // criminal-20261007
    '404-taiwan-seized-phone-property-return.md', // criminal-20261007
  ],
  ko: [
    '401-taiwan-criminal-witness-summons-refuse-testimony.md', // criminal-20261007
    '402-taiwan-criminal-settlement-withdraw-complaint.md', // criminal-20261007
    '403-taiwan-non-prosecution-reconsideration-deadline.md', // criminal-20261007
    '404-taiwan-seized-phone-property-return.md', // criminal-20261007
  ],
  en: [
    '401-taiwan-criminal-witness-summons-refuse-testimony.md', // criminal-20261007
    '402-taiwan-criminal-settlement-withdraw-complaint.md', // criminal-20261007
    '403-taiwan-non-prosecution-reconsideration-deadline.md', // criminal-20261007
    '404-taiwan-seized-phone-property-return.md', // criminal-20261007
    '351-enforcing-us-arbitral-award-in-taiwan.md', // enja-inbound-20261007
    '352-hiring-in-taiwan-without-local-entity-eor-pe-work-permits.md', // enja-inbound-20261007
    '353-terminating-taiwan-distributor-us-exporter.md', // enja-inbound-20261007
    '354-unpaid-invoices-taiwan-buyer-payment-order-attachment.md', // enja-inbound-20261007
    '355-cannabis-thc-cbd-taiwan-penalties-us-visitors.md', // enja-inbound-20261007
  ],

  'zh-hant': [
    '401-taiwan-criminal-witness-summons-refuse-testimony.md', // criminal-20261007
    '402-taiwan-criminal-settlement-withdraw-complaint.md', // criminal-20261007
    '403-taiwan-non-prosecution-reconsideration-deadline.md', // criminal-20261007
    '404-taiwan-seized-phone-property-return.md', // criminal-20261007
  ],

  vi: [
    '401-taiwan-criminal-witness-summons-refuse-testimony.md', // criminal-20261007
    '402-taiwan-criminal-settlement-withdraw-complaint.md', // criminal-20261007
    '403-taiwan-non-prosecution-reconsideration-deadline.md', // criminal-20261007
    '404-taiwan-seized-phone-property-return.md', // criminal-20261007
  ],

} as const;

/** Native audience columns published 2026-10-13. */
export const COUNTRY_COLUMN_FILES_20261013 = {
  ko: [
    '518-recovering-unpaid-invoices-from-taiwan-customers.md', // gap1006-G4
    '519-taiwan-non-prosecution-reconsideration-private-prosecution.md', // gap1006-G5
    '520-taiwan-deferred-prosecution-conditions-complainant.md', // gap1006-G6
    '521-taiwan-summons-defendant-witness-warrant-wanted-notice.md', // gap1006-G7
    '522-taiwan-complaint-only-offense-settlement-withdrawal-deadline.md', // gap1006-G8
    '523-taiwan-criminal-appeal-twenty-days-third-instance-barred.md', // gap1006-G9
    '524-taiwan-sentence-fine-conversion-probation-deportation-foreigner.md', // gap1006-G10
  ],
  en: [
    '518-recovering-unpaid-invoices-from-taiwan-customers.md', // gap1006-G4
    '519-taiwan-non-prosecution-reconsideration-private-prosecution.md', // gap1006-G5
    '520-taiwan-deferred-prosecution-conditions-complainant.md', // gap1006-G6
    '521-taiwan-summons-defendant-witness-warrant-wanted-notice.md', // gap1006-G7
    '522-taiwan-complaint-only-offense-settlement-withdrawal-deadline.md', // gap1006-G8
    '523-taiwan-criminal-appeal-twenty-days-third-instance-barred.md', // gap1006-G9
    '524-taiwan-sentence-fine-conversion-probation-deportation-foreigner.md', // gap1006-G10
  ],
  ja: [
    '518-recovering-unpaid-invoices-from-taiwan-customers.md', // gap1006-G4
    '519-taiwan-non-prosecution-reconsideration-private-prosecution.md', // gap1006-G5
    '520-taiwan-deferred-prosecution-conditions-complainant.md', // gap1006-G6
    '521-taiwan-summons-defendant-witness-warrant-wanted-notice.md', // gap1006-G7
    '522-taiwan-complaint-only-offense-settlement-withdrawal-deadline.md', // gap1006-G8
    '523-taiwan-criminal-appeal-twenty-days-third-instance-barred.md', // gap1006-G9
    '524-taiwan-sentence-fine-conversion-probation-deportation-foreigner.md', // gap1006-G10
  ],
  'zh-hant': [
    '518-recovering-unpaid-invoices-from-taiwan-customers.md', // gap1006-G4
    '519-taiwan-non-prosecution-reconsideration-private-prosecution.md', // gap1006-G5
    '520-taiwan-deferred-prosecution-conditions-complainant.md', // gap1006-G6
    '521-taiwan-summons-defendant-witness-warrant-wanted-notice.md', // gap1006-G7
    '522-taiwan-complaint-only-offense-settlement-withdrawal-deadline.md', // gap1006-G8
    '523-taiwan-criminal-appeal-twenty-days-third-instance-barred.md', // gap1006-G9
    '524-taiwan-sentence-fine-conversion-probation-deportation-foreigner.md', // gap1006-G10
  ],
} as const;

/** Native audience columns published 2026-10-14. */
export const COUNTRY_COLUMN_FILES_20261014 = {
  ko: [
    '547-taiwan-civil-korean-documents-chinese-translations.md',
    '550-taiwan-investigation-korean-citizen-exit-restriction.md',
    '544-taiwan-subsidiary-korean-outward-investment-remittance.md',
    '540-taiwan-company-preincorporation-contracts-liability.md', // jp-us-kr-20261014
    '542-taiwan-civil-evidence-preservation-before-lawsuit.md',
    '543-taiwan-employee-criminal-questioning-company-paid-counsel.md',
    '603-taiwan-sick-leave-half-pay-ten-day-protection.md', // cols-20261013-C1
    '604-taiwan-tenant-early-lease-termination-notice-penalty.md', // cols-20261013-C4
    '605-taiwan-private-loan-interest-cap-iou-repayment.md', // cols-20261013-C5
    '606-taiwan-unpaid-wages-insolvent-employer-payment-fund.md', // cols-20261014-C1
    '607-taiwan-foreign-student-part-time-work-permit-hours.md', // cols-20261013-C6
    '608-taiwan-false-financial-report-investor-civil-damages.md', // cols-20261014-C3
    '609-taiwan-mistaken-bank-transfer-unjust-enrichment.md', // cols-20261014-C4
  ],
  en: [
    '549-taiwan-civil-us-company-opponent-document-production.md',
    '552-taiwan-us-citizen-arrest-ait-local-defense.md',
    '546-taiwan-investment-delaware-llc-identity-authority.md',
    '540-taiwan-company-preincorporation-contracts-liability.md', // jp-us-kr-20261014
    '542-taiwan-civil-evidence-preservation-before-lawsuit.md',
    '543-taiwan-employee-criminal-questioning-company-paid-counsel.md',
    '603-taiwan-sick-leave-half-pay-ten-day-protection.md', // cols-20261013-C1
    '604-taiwan-tenant-early-lease-termination-notice-penalty.md', // cols-20261013-C4
    '605-taiwan-private-loan-interest-cap-iou-repayment.md', // cols-20261013-C5
    '606-taiwan-unpaid-wages-insolvent-employer-payment-fund.md', // cols-20261014-C1
    '607-taiwan-foreign-student-part-time-work-permit-hours.md', // cols-20261013-C6
    '608-taiwan-false-financial-report-investor-civil-damages.md', // cols-20261014-C3
    '609-taiwan-mistaken-bank-transfer-unjust-enrichment.md', // cols-20261014-C4
  ],
  ja: [
    '548-taiwan-civil-japanese-company-litigation-authority.md',
    '551-taiwan-police-japanese-interpretation-record-corrections.md',
    '545-taiwan-investment-japanese-company-documents-authentication.md',
    '540-taiwan-company-preincorporation-contracts-liability.md', // jp-us-kr-20261014
    '542-taiwan-civil-evidence-preservation-before-lawsuit.md',
    '543-taiwan-employee-criminal-questioning-company-paid-counsel.md',
    '603-taiwan-sick-leave-half-pay-ten-day-protection.md', // cols-20261013-C1
    '604-taiwan-tenant-early-lease-termination-notice-penalty.md', // cols-20261013-C4
    '605-taiwan-private-loan-interest-cap-iou-repayment.md', // cols-20261013-C5
    '606-taiwan-unpaid-wages-insolvent-employer-payment-fund.md', // cols-20261014-C1
    '607-taiwan-foreign-student-part-time-work-permit-hours.md', // cols-20261013-C6
    '608-taiwan-false-financial-report-investor-civil-damages.md', // cols-20261014-C3
    '609-taiwan-mistaken-bank-transfer-unjust-enrichment.md', // cols-20261014-C4
  ],
  'zh-hant': [
    '603-taiwan-sick-leave-half-pay-ten-day-protection.md', // cols-20261013-C1
    '604-taiwan-tenant-early-lease-termination-notice-penalty.md', // cols-20261013-C4
    '605-taiwan-private-loan-interest-cap-iou-repayment.md', // cols-20261013-C5
    '606-taiwan-unpaid-wages-insolvent-employer-payment-fund.md', // cols-20261014-C1
    '607-taiwan-foreign-student-part-time-work-permit-hours.md', // cols-20261013-C6
    '608-taiwan-false-financial-report-investor-civil-damages.md', // cols-20261014-C3
    '609-taiwan-mistaken-bank-transfer-unjust-enrichment.md', // cols-20261014-C4
  ],
} as const;

/** Fictional dashcam scenarios, authored only in Korean and Traditional Chinese. */
export const TRAFFIC_SCENE_COLUMN_FILES_20261014 = {
  ko: [
    '601-taiwan-double-yellow-uturn-dashcam-liability.md',
    '602-taiwan-rain-rear-end-braking-dashcam.md',
  ],
  'zh-hant': [
    '601-taiwan-double-yellow-uturn-dashcam-liability.md',
    '602-taiwan-rain-rear-end-braking-dashcam.md',
  ],
} as const;

/** Reviewed fictional traffic scenes: scooter in three languages, four further cases in Korean and Traditional Chinese. */
export const TRAFFIC_SCENE_COLUMN_FILES_20261015 = {
  ko: [
    '625-taiwan-unsignalized-roundabout-entry-collision.md',
    '626-taiwan-red-signal-straight-stop-line-collision.md',
    '627-taiwan-oneway-wrongway-head-on-collision.md',
    '628-taiwan-parked-car-collision-external-video-evidence.md',
    '611-taiwan-scooter-outer-lane-left-turn-dashcam.md',
    '621-taiwan-lane-ending-merge-dashcam.md',
    '622-taiwan-equal-road-uncontrolled-intersection-dashcam.md',
    '623-taiwan-opposing-turns-single-lane-collision.md',
    '624-taiwan-mountain-road-meeting-collision.md',
  ],
  'zh-hant': [
    '625-taiwan-unsignalized-roundabout-entry-collision.md',
    '626-taiwan-red-signal-straight-stop-line-collision.md',
    '627-taiwan-oneway-wrongway-head-on-collision.md',
    '628-taiwan-parked-car-collision-external-video-evidence.md',
    '611-taiwan-scooter-outer-lane-left-turn-dashcam.md',
    '621-taiwan-lane-ending-merge-dashcam.md',
    '622-taiwan-equal-road-uncontrolled-intersection-dashcam.md',
    '623-taiwan-opposing-turns-single-lane-collision.md',
    '624-taiwan-mountain-road-meeting-collision.md',
  ],
  en: ['611-taiwan-scooter-outer-lane-left-turn-dashcam.md'],
} as const;

export const TRAFFIC_SCENE_COLUMN_FILES_20261021 = {
  ko: ['641-taiwan-right-turn-crosswalk-pedestrian-dashcam.md'],
  'zh-hant': ['641-taiwan-right-turn-crosswalk-pedestrian-dashcam.md'],
  en: ['641-taiwan-right-turn-crosswalk-pedestrian-dashcam.md'],
} as const;

/** Native audience columns published 2026-10-15. */
export const COUNTRY_COLUMN_FILES_20261015 = {
  ko: [
    '610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md', // cols-20261013-C2
  ],
  en: [
    '610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md', // cols-20261013-C2
  ],
  ja: [
    '610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md', // cols-20261013-C2
  ],
  'zh-hant': [
    '610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md', // cols-20261013-C2
  ],
} as const;

/** Native audience columns published 2026-10-16. */
export const COUNTRY_COLUMN_FILES_20261016 = {
  ko: [
    '629-taiwan-notarized-fixed-term-lease-direct-enforcement.md', // cols-20261016-C3
    '630-taiwan-crypto-trading-mandate-accounting.md', // cols-20261016-C1
    '631-taiwan-property-transfer-claim-provisional-registration.md', // cols-20261016-C2
  ],
  en: [
    '629-taiwan-notarized-fixed-term-lease-direct-enforcement.md', // cols-20261016-C3
    '630-taiwan-crypto-trading-mandate-accounting.md', // cols-20261016-C1
    '631-taiwan-property-transfer-claim-provisional-registration.md', // cols-20261016-C2
  ],
  ja: [
    '629-taiwan-notarized-fixed-term-lease-direct-enforcement.md', // cols-20261016-C3
    '630-taiwan-crypto-trading-mandate-accounting.md', // cols-20261016-C1
    '631-taiwan-property-transfer-claim-provisional-registration.md', // cols-20261016-C2
  ],
  'zh-hant': [
    '629-taiwan-notarized-fixed-term-lease-direct-enforcement.md', // cols-20261016-C3
    '630-taiwan-crypto-trading-mandate-accounting.md', // cols-20261016-C1
    '631-taiwan-property-transfer-claim-provisional-registration.md', // cols-20261016-C2
  ],
} as const;

/** Native audience columns published 2026-10-18. */
export const COUNTRY_COLUMN_FILES_20261018 = {
  ko: [
    '632-taiwan-company-liquidation-creditor-claim-notice.md', // cols-20261016-C4
    '633-taiwan-subsidiary-board-video-proxy-written-vote.md', // cols-20261016-C5
    '634-taiwan-employee-resignation-notice-indefinite-contract.md', // cols-20261016-C6
    '635-taiwan-traffic-ticket-other-driver-notice.md', // cols-20261016-C7
    '636-taiwan-related-company-loan-permitted-conditions.md', // cols-20261016-C8
  ],
  en: [
    '632-taiwan-company-liquidation-creditor-claim-notice.md', // cols-20261016-C4
    '633-taiwan-subsidiary-board-video-proxy-written-vote.md', // cols-20261016-C5
    '634-taiwan-employee-resignation-notice-indefinite-contract.md', // cols-20261016-C6
    '635-taiwan-traffic-ticket-other-driver-notice.md', // cols-20261016-C7
    '636-taiwan-related-company-loan-permitted-conditions.md', // cols-20261016-C8
  ],
  ja: [
    '632-taiwan-company-liquidation-creditor-claim-notice.md', // cols-20261016-C4
    '633-taiwan-subsidiary-board-video-proxy-written-vote.md', // cols-20261016-C5
    '634-taiwan-employee-resignation-notice-indefinite-contract.md', // cols-20261016-C6
    '635-taiwan-traffic-ticket-other-driver-notice.md', // cols-20261016-C7
    '636-taiwan-related-company-loan-permitted-conditions.md', // cols-20261016-C8
  ],
  'zh-hant': [
    '632-taiwan-company-liquidation-creditor-claim-notice.md', // cols-20261016-C4
    '633-taiwan-subsidiary-board-video-proxy-written-vote.md', // cols-20261016-C5
    '634-taiwan-employee-resignation-notice-indefinite-contract.md', // cols-20261016-C6
    '635-taiwan-traffic-ticket-other-driver-notice.md', // cols-20261016-C7
    '636-taiwan-related-company-loan-permitted-conditions.md', // cols-20261016-C8
  ],
} as const;

/** Native audience columns published 2026-10-20. */
export const COUNTRY_COLUMN_FILES_20261020 = {
  ko: [
    '637-taiwan-work-permit-side-gig-other-employer.md', // cols-20261019-C3
    '638-taiwan-account-provider-scam-victim-civil-damages.md', // cols-20261019-C4
    '639-taiwan-rental-holding-deposit-dingjin.md', // cols-20261019-C1
    '640-taiwan-spouse-debt-family-living-expenses-joint-liability.md', // cols-20261019-C2
  ],
  en: [
    '637-taiwan-work-permit-side-gig-other-employer.md', // cols-20261019-C3
    '638-taiwan-account-provider-scam-victim-civil-damages.md', // cols-20261019-C4
    '639-taiwan-rental-holding-deposit-dingjin.md', // cols-20261019-C1
    '640-taiwan-spouse-debt-family-living-expenses-joint-liability.md', // cols-20261019-C2
  ],
  ja: [
    '637-taiwan-work-permit-side-gig-other-employer.md', // cols-20261019-C3
    '638-taiwan-account-provider-scam-victim-civil-damages.md', // cols-20261019-C4
    '639-taiwan-rental-holding-deposit-dingjin.md', // cols-20261019-C1
    '640-taiwan-spouse-debt-family-living-expenses-joint-liability.md', // cols-20261019-C2
  ],
  'zh-hant': [
    '637-taiwan-work-permit-side-gig-other-employer.md', // cols-20261019-C3
    '638-taiwan-account-provider-scam-victim-civil-damages.md', // cols-20261019-C4
    '639-taiwan-rental-holding-deposit-dingjin.md', // cols-20261019-C1
    '640-taiwan-spouse-debt-family-living-expenses-joint-liability.md', // cols-20261019-C2
  ],
} as const;

/** Native audience columns published 2026-10-22. */
export const COUNTRY_COLUMN_FILES_20261022 = {
  ko: [
    '642-taiwan-small-claims-appeal-from-abroad-deadline-violation-of-law.md', // ship-20261022-P-CIV
    '643-taiwan-parent-instructions-director-dissent-supervisor-stop-notice.md', // ship-20261022-P-CORP
    '644-taiwan-criminal-exit-ban-foreign-defendant-temporary-travel.md', // ship-20261022-P-CRIM
    '647-taiwan-crypto-exchange-account-fraud-control-warning-foreign-residents.md', // ship-20261022-G1
    '648-taiwan-securities-broker-employee-dispute-sfipc-mediation-foreign-investor.md', // ship-20261022-G2
    '649-taiwan-foreign-worker-change-employer-without-consent-separation-document.md', // ship-20261022-G3
    '650-taiwan-mixed-family-baby-surname-chinese-name-passport-home-registration.md', // ship-20261022-G4
    '651-taiwan-contract-penalty-clause-reduction-civil-code-252-2026-judgments.md', // ship-20261022-G5
    '652-taiwan-hospital-death-autopsy-request-complaint-medical-mediation.md', // ship-20261022-G6
  ],
  en: [
    '642-taiwan-small-claims-appeal-from-abroad-deadline-violation-of-law.md', // ship-20261022-P-CIV
    '643-taiwan-parent-instructions-director-dissent-supervisor-stop-notice.md', // ship-20261022-P-CORP
    '644-taiwan-criminal-exit-ban-foreign-defendant-temporary-travel.md', // ship-20261022-P-CRIM
    '647-taiwan-crypto-exchange-account-fraud-control-warning-foreign-residents.md', // ship-20261022-G1
    '648-taiwan-securities-broker-employee-dispute-sfipc-mediation-foreign-investor.md', // ship-20261022-G2
    '649-taiwan-foreign-worker-change-employer-without-consent-separation-document.md', // ship-20261022-G3
    '650-taiwan-mixed-family-baby-surname-chinese-name-passport-home-registration.md', // ship-20261022-G4
    '651-taiwan-contract-penalty-clause-reduction-civil-code-252-2026-judgments.md', // ship-20261022-G5
    '652-taiwan-hospital-death-autopsy-request-complaint-medical-mediation.md', // ship-20261022-G6
  ],
  ja: [
    '642-taiwan-small-claims-appeal-from-abroad-deadline-violation-of-law.md', // ship-20261022-P-CIV
    '643-taiwan-parent-instructions-director-dissent-supervisor-stop-notice.md', // ship-20261022-P-CORP
    '644-taiwan-criminal-exit-ban-foreign-defendant-temporary-travel.md', // ship-20261022-P-CRIM
    '647-taiwan-crypto-exchange-account-fraud-control-warning-foreign-residents.md', // ship-20261022-G1
    '648-taiwan-securities-broker-employee-dispute-sfipc-mediation-foreign-investor.md', // ship-20261022-G2
    '649-taiwan-foreign-worker-change-employer-without-consent-separation-document.md', // ship-20261022-G3
    '650-taiwan-mixed-family-baby-surname-chinese-name-passport-home-registration.md', // ship-20261022-G4
    '651-taiwan-contract-penalty-clause-reduction-civil-code-252-2026-judgments.md', // ship-20261022-G5
    '652-taiwan-hospital-death-autopsy-request-complaint-medical-mediation.md', // ship-20261022-G6
  ],
  'zh-hant': [
    '642-taiwan-small-claims-appeal-from-abroad-deadline-violation-of-law.md', // ship-20261022-P-CIV
    '643-taiwan-parent-instructions-director-dissent-supervisor-stop-notice.md', // ship-20261022-P-CORP
    '644-taiwan-criminal-exit-ban-foreign-defendant-temporary-travel.md', // ship-20261022-P-CRIM
    '647-taiwan-crypto-exchange-account-fraud-control-warning-foreign-residents.md', // ship-20261022-G1
    '648-taiwan-securities-broker-employee-dispute-sfipc-mediation-foreign-investor.md', // ship-20261022-G2
    '649-taiwan-foreign-worker-change-employer-without-consent-separation-document.md', // ship-20261022-G3
    '650-taiwan-mixed-family-baby-surname-chinese-name-passport-home-registration.md', // ship-20261022-G4
    '651-taiwan-contract-penalty-clause-reduction-civil-code-252-2026-judgments.md', // ship-20261022-G5
    '652-taiwan-hospital-death-autopsy-request-complaint-medical-mediation.md', // ship-20261022-G6
  ],
  es: [
    '642-taiwan-small-claims-appeal-from-abroad-deadline-violation-of-law.md', // ship-20261022-P-CIV
    '643-taiwan-parent-instructions-director-dissent-supervisor-stop-notice.md', // ship-20261022-P-CORP
    '644-taiwan-criminal-exit-ban-foreign-defendant-temporary-travel.md', // ship-20261022-P-CRIM
    '647-taiwan-crypto-exchange-account-fraud-control-warning-foreign-residents.md', // ship-20261022-G1
    '648-taiwan-securities-broker-employee-dispute-sfipc-mediation-foreign-investor.md', // ship-20261022-G2
    '649-taiwan-foreign-worker-change-employer-without-consent-separation-document.md', // ship-20261022-G3
    '650-taiwan-mixed-family-baby-surname-chinese-name-passport-home-registration.md', // ship-20261022-G4
    '651-taiwan-contract-penalty-clause-reduction-civil-code-252-2026-judgments.md', // ship-20261022-G5
    '652-taiwan-hospital-death-autopsy-request-complaint-medical-mediation.md', // ship-20261022-G6
    '656-taiwan-one-shareholder-limited-company-director.md', // esfr-20261022 COL-es-1
    '657-taiwan-spanish-document-legalization-taipei-office.md', // esfr-20261022 COL-es-3
    '658-taiwan-bail-local-surety-cash-deposit-family.md', // esfr-20261022 COL-es-2
  ],
  fr: [
    '653-taiwan-business-takeover-shares-or-assets-foreign-buyer.md', // esfr-20261022 COL-fr-1
    '654-taiwan-working-holiday-visa-work-insurance-tax.md', // esfr-20261022 COL-fr-3
    '655-taiwan-criminal-plea-bargaining-foreign-defendant.md', // esfr-20261022 COL-fr-2
  ],
} as const;

/** Native audience columns published 2026-10-23. */
export const COUNTRY_COLUMN_FILES_20261023 = {
  ar: [
    '699-uae-importer-taiwan-supplier-advance-refund.md', // nine-market-20261023
    '700-saudi-arbitral-award-taiwan-assets.md', // nine-market-20261023
    '701-uae-court-judgment-taiwan-enforcement.md', // nine-market-20261023
    '702-overseas-heir-taiwan-estate-nationality-documents.md', // nine-market-20261023
    '703-uae-resident-taiwan-counsel-arabic-documents.md', // nine-market-20261023
  ],
  de: [
    '679-taiwan-maschinenlieferung-fat-sat-schlusszahlung.md', // nine-market-20261023
    '680-taiwan-bauteile-maengelruege-pruefmuster.md', // nine-market-20261023
    '681-taiwan-lieferant-werkzeuge-pruefvorrichtungen-herausgabe.md', // nine-market-20261023
    '682-taiwan-gemeinsame-entwicklung-cad-geschaeftsgeheimnisse.md', // nine-market-20261023
    '683-deutsches-urteil-vermoegen-taiwan-vollstreckung.md', // nine-market-20261023
  ],
  es: [
    '689-spain-exporter-taiwan-unpaid-invoices.md', // nine-market-20261023
    '690-spain-buyer-taiwan-defective-goods-notice.md', // nine-market-20261023
    '691-spanish-judgment-taiwan-assets-enforcement.md', // nine-market-20261023
    '692-return-spain-unpaid-taiwan-wages.md', // nine-market-20261023
    '693-spain-resident-taiwan-divorce-property.md', // nine-market-20261023
    '662-taiwan-departure-income-tax-agent-article-72.md', // ship-20261023-G4
    '659-taiwan-visitor-commercial-activity-deportation-entry-ban.md', // ship-20261023-G1
    '660-taiwan-overseas-surrogacy-child-parentage-spouse-adoption-registration.md', // ship-20261023-G2
    '661-taiwan-ride-hailing-platform-dispatch-license-accident-liability.md', // ship-20261023-G3
    '663-taiwan-foreign-company-cyber-incident-personal-data-scope.md', // ship-20261023-G5
    '664-taiwan-strike-employer-damages-retaliation-mediation-arbitration.md', // ship-20261023-G6
  ],
  fr: [
    '674-france-exporter-taiwan-unpaid-invoices-credit-notes-returns.md', // nine-market-20261023
    '675-french-brand-taiwan-trademark-registered-distributor.md', // nine-market-20261023
    '676-french-supplier-taiwan-distributor-termination-stock-online-accounts.md', // nine-market-20261023
    '677-france-resident-heir-taiwan-bank-property-documents.md', // nine-market-20261023
    '678-french-employee-taiwan-unpaid-wages-employer-closure.md', // nine-market-20261023
  ],
  hi: [
    '669-indian-supplier-unpaid-taiwan-invoice.md', // nine-market-20261023
    '670-indian-buyer-taiwan-machinery-defect-notice.md', // nine-market-20261023
    '671-indian-engineer-taiwan-noncompete-compensation.md', // nine-market-20261023
    '672-indian-resident-taiwan-rental-deposit-handover.md', // nine-market-20261023
    '673-indian-importer-taiwan-supplier-bank-change-fraud.md', // nine-market-20261023
  ],
  id: [
    '664-indonesian-home-caregiver-unpaid-wages-taiwan.md', // nine-market-20261023
    '665-indonesian-worker-passport-broker-dispute-taiwan.md', // nine-market-20261023
    '666-indonesian-worker-bank-account-cash-job-police-taiwan.md', // nine-market-20261023
    '667-indonesian-factory-worker-injury-evidence-compensation-taiwan.md', // nine-market-20261023
    '668-indonesian-buyer-taiwan-machinery-defect-notice.md', // nine-market-20261023
  ],
  it: [
    '684-italian-exporter-taiwan-unpaid-installation-balance.md', // nine-market-20261023
    '685-italian-brand-taiwan-distributor-trademark-registration.md', // nine-market-20261023
    '686-taiwan-oem-molds-design-files-handover.md', // nine-market-20261023
    '687-italy-resident-heir-taiwan-inheritance-renunciation-debts.md', // nine-market-20261023
    '688-italian-business-visitor-taiwan-summons-interpreter-defense.md', // nine-market-20261023
  ],
  pt: [
    '694-portugal-exportador-acordo-prestacoes-taiwan.md', // nine-market-20261023
    '695-portugal-fornecedor-taiwan-alteracao-conta-fraude.md', // nine-market-20261023
    '696-portugal-sentenca-arbitral-bens-taiwan.md', // nine-market-20261023
    '697-portugal-mandatario-processo-civil-taiwan.md', // nine-market-20261023
    '698-portugal-fim-contrato-taiwan-salarios-em-falta.md', // nine-market-20261023
  ],
  th: [
    '659-thai-worker-taiwan-payslip-deductions-unpaid-salary.md', // nine-market-20261023
    '660-thai-worker-taiwan-factory-closure-wage-fund.md', // nine-market-20261023
    '661-thai-worker-taiwan-bank-account-police-notice.md', // nine-market-20261023
    '662-thai-return-home-taiwan-traffic-injury-records.md', // nine-market-20261023
    '663-thai-supplier-taiwan-buyer-unpaid-invoice.md', // nine-market-20261023
  ],
  'ko': [
    '659-taiwan-visitor-commercial-activity-deportation-entry-ban.md', // ship-20261023-G1
    '660-taiwan-overseas-surrogacy-child-parentage-spouse-adoption-registration.md', // ship-20261023-G2
    '661-taiwan-ride-hailing-platform-dispatch-license-accident-liability.md', // ship-20261023-G3
    '663-taiwan-foreign-company-cyber-incident-personal-data-scope.md', // ship-20261023-G5
    '664-taiwan-strike-employer-damages-retaliation-mediation-arbitration.md', // ship-20261023-G6
  ],
  'zh-hant': [
    '659-taiwan-visitor-commercial-activity-deportation-entry-ban.md', // ship-20261023-G1
    '660-taiwan-overseas-surrogacy-child-parentage-spouse-adoption-registration.md', // ship-20261023-G2
    '661-taiwan-ride-hailing-platform-dispatch-license-accident-liability.md', // ship-20261023-G3
    '663-taiwan-foreign-company-cyber-incident-personal-data-scope.md', // ship-20261023-G5
    '664-taiwan-strike-employer-damages-retaliation-mediation-arbitration.md', // ship-20261023-G6
  ],
  'ja': [
    '659-taiwan-visitor-commercial-activity-deportation-entry-ban.md', // ship-20261023-G1
    '660-taiwan-overseas-surrogacy-child-parentage-spouse-adoption-registration.md', // ship-20261023-G2
    '661-taiwan-ride-hailing-platform-dispatch-license-accident-liability.md', // ship-20261023-G3
    '663-taiwan-foreign-company-cyber-incident-personal-data-scope.md', // ship-20261023-G5
    '664-taiwan-strike-employer-damages-retaliation-mediation-arbitration.md', // ship-20261023-G6
  ],
  'en': [
    '659-taiwan-visitor-commercial-activity-deportation-entry-ban.md', // ship-20261023-G1
    '660-taiwan-overseas-surrogacy-child-parentage-spouse-adoption-registration.md', // ship-20261023-G2
    '661-taiwan-ride-hailing-platform-dispatch-license-accident-liability.md', // ship-20261023-G3
    '663-taiwan-foreign-company-cyber-incident-personal-data-scope.md', // ship-20261023-G5
    '664-taiwan-strike-employer-damages-retaliation-mediation-arbitration.md', // ship-20261023-G6
  ],
} as const;

const ARC_VISA_FILES_20261024 = [
  '704-taiwan-arc-first-application.md',
  '705-taiwan-visa-residence-work-study-family.md',
  '706-taiwan-arc-renewal-changes-reentry.md',
] as const;

/** ARC/visa procedure series, expanded to49 authored locales through October26. */
export const ARC_VISA_COLUMN_FILES_20261024: Partial<Record<string, readonly string[]>> = {
  ko: ARC_VISA_FILES_20261024,
  en: ARC_VISA_FILES_20261024,
  ja: ARC_VISA_FILES_20261024,
  vi: ARC_VISA_FILES_20261024,
  'zh-hant': ARC_VISA_FILES_20261024,
  th: ARC_VISA_FILES_20261024,
  id: ARC_VISA_FILES_20261024,
  hi: ARC_VISA_FILES_20261024,
  fr: ARC_VISA_FILES_20261024,
  de: ARC_VISA_FILES_20261024,
  it: ARC_VISA_FILES_20261024,
  es: ARC_VISA_FILES_20261024,
  pt: ARC_VISA_FILES_20261024,
  ar: ARC_VISA_FILES_20261024,
  'ru': ARC_VISA_FILES_20261024,
  'ms': ARC_VISA_FILES_20261024,
  'fil': ARC_VISA_FILES_20261024,
  'tr': ARC_VISA_FILES_20261024,
  'nl': ARC_VISA_FILES_20261024,
  'zh-hans': ARC_VISA_FILES_20261024,
  'sv': ARC_VISA_FILES_20261024,
  'da': ARC_VISA_FILES_20261024,
  'nb': ARC_VISA_FILES_20261024,
  'fi': ARC_VISA_FILES_20261024,
  'pl': ARC_VISA_FILES_20261024,
  'cs': ARC_VISA_FILES_20261024,
  'ro': ARC_VISA_FILES_20261024,
  'uk': ARC_VISA_FILES_20261024,
  'bg': ARC_VISA_FILES_20261024,
  'ca': ARC_VISA_FILES_20261024,
  'el': ARC_VISA_FILES_20261024,
  'hr': ARC_VISA_FILES_20261024,
  'hu': ARC_VISA_FILES_20261024,
  'is': ARC_VISA_FILES_20261024,
  'sk': ARC_VISA_FILES_20261024,
  'he': ARC_VISA_FILES_20261024,
  'bn': ARC_VISA_FILES_20261024,
  'ur': ARC_VISA_FILES_20261024,
  'fa': ARC_VISA_FILES_20261024,
  'my': ARC_VISA_FILES_20261024,
  'ta': ARC_VISA_FILES_20261024,
  'ne': ARC_VISA_FILES_20261024,
  'km': ARC_VISA_FILES_20261024,
  'mn': ARC_VISA_FILES_20261024,
  'sr': ARC_VISA_FILES_20261024,
  'sl': ARC_VISA_FILES_20261024,
  'lt': ARC_VISA_FILES_20261024,
  'lv': ARC_VISA_FILES_20261024,
  'et': ARC_VISA_FILES_20261024,
};

/** Native audience columns published 2026-10-24. */
export const COUNTRY_COLUMN_FILES_20261024 = {
  ja: [
    '711-taiwan-franchise-disclosure-japanese-restaurant-retail-chains.md', // ja-gap-20261024
    '712-taiwan-joint-venture-shareholders-agreement-deadlock-japanese.md', // ja-gap-20261024
    '713-japan-arbitral-award-recognition-enforcement-taiwan.md', // ja-gap-20261024
    '714-taiwan-government-procurement-japanese-companies-gpa-bid.md', // ja-gap-20261024
    '715-taiwan-cartel-investigation-fines-leniency-japanese-subsidiaries.md', // ja-gap-20261024
    '716-taiwan-overtime-pay-responsibility-system-japanese-managers.md', // ja-gap-20261024
    '717-taiwan-shtc-export-control-entity-list-japanese-subsidiaries.md', // ja-gap-20261024
    '718-taiwan-customer-reorganization-bankruptcy-japanese-supplier-claims.md', // ja-gap-20261024
    '719-taiwan-promissory-note-security-court-ruling-enforcement-japanese.md', // ja-gap-20261024
    '720-taiwan-supplement-health-food-advertising-rules-japanese-brands.md', // ja-gap-20261024
  ],
  fil: [
    '801-filipino-caregiver-taiwan-patient-died-transfer-employer.md', // world-columns-20261024
    '802-filipino-factory-worker-taiwan-overtime-deductions-broker-fee.md', // world-columns-20261024
    '803-filipino-worker-taiwan-reported-missing-overstay-surrender.md', // world-columns-20261024
  ],
  'zh-hans': [
    '804-mainland-chinese-heirs-taiwan-estate-cap-deadline.md', // world-columns-20261024
    '805-mainland-chinese-spouse-taiwan-residence-after-divorce.md', // world-columns-20261024
    '806-mainland-chinese-judgment-arbitral-award-taiwan-recognition.md', // world-columns-20261024
  ],
  ms: [
    '807-malaysian-student-taiwan-part-time-work-permit.md', // world-columns-20261024
    '808-malaysian-brand-taiwan-subsidiary-branch-first-shop.md', // world-columns-20261024
    '809-malaysian-rider-taiwan-scooter-accident-licence-insurance.md', // world-columns-20261024
  ],
  km: [
    '813-cambodian-spouse-marry-taiwanese-interview-list-registration.md', // world-columns-20261024
    '814-cambodian-wife-divorce-taiwanese-husband-arc-children.md', // world-columns-20261024
    '815-cambodian-widow-taiwanese-husband-death-inheritance-arc.md', // world-columns-20261024
  ],
  ne: [
    '819-nepali-student-taiwan-part-time-work-permit-20-hours.md', // world-columns-20261024
    '820-nepali-graduate-taiwan-stay-work-after-degree-points.md', // world-columns-20261024
    '821-nepali-student-taiwan-bank-account-easy-job-police.md', // world-columns-20261024
  ],
  bn: [
    '822-bangladeshi-garment-factory-taiwan-fabric-defect-notice.md', // world-columns-20261024
    '823-bangladeshi-student-taiwan-part-time-work-permit-20-hours.md', // world-columns-20261024
    '824-bangladeshi-importer-taiwan-supplier-new-bank-account-email.md', // world-columns-20261024
  ],
  ur: [
    '825-pakistani-exporter-unpaid-taiwan-buyer-invoice.md', // world-columns-20261024
    '826-pakistani-engineer-taiwan-work-permit-arc-family.md', // world-columns-20261024
    '827-pakistani-fiance-marry-taiwanese-national-interview.md', // world-columns-20261024
  ],
  fa: [
    '828-iranian-professional-taiwan-work-permit-visa-arc.md', // world-columns-20261024
    '829-iranian-buyer-taiwan-supplier-export-control-permit.md', // world-columns-20261024
    '830-iranian-spouse-marry-taiwanese-national-registration.md', // world-columns-20261024
  ],
  ta: [
    '831-tamil-engineer-taiwan-work-permit-family-residence.md', // world-columns-20261024
    '832-tamil-engineer-taiwan-job-ends-permit-arc-severance.md', // world-columns-20261024
    '833-tamil-manufacturer-taiwan-machine-defect-shipping-risk.md', // world-columns-20261024
  ],
  nl: [
    '834-dutch-company-taiwan-subsidiary-branch-office.md', // world-columns-20261024
    '835-dutch-employer-taiwan-first-hire-eor.md', // world-columns-20261024
    '836-dutch-working-holiday-taiwan-work-insurance-tax.md', // world-columns-20261024
  ],
  el: [
    '855-greek-shipowner-arbitral-award-taiwan-enforcement.md', // world-columns-20261024
    '856-greek-exporter-taiwan-unpaid-olive-oil-invoices.md', // world-columns-20261024
    '857-greek-professionals-taiwan-work-permit-residence.md', // world-columns-20261024
  ],
  he: [
    '858-israeli-tech-taiwan-source-code-trade-secrets.md', // world-columns-20261024
    '859-israeli-company-taiwan-subsidiary-branch-investment.md', // world-columns-20261024
    '860-israeli-professional-taiwan-work-permit-residence.md', // world-columns-20261024
  ],
  ru: [
    '864-russian-professional-taiwan-work-permit-residence.md', // world-columns-20261024
    '865-russian-buyer-taiwan-export-controls-end-user.md', // world-columns-20261024
    '866-russian-spouse-taiwan-divorce-child-residence.md', // world-columns-20261024
  ],
  pl: [
    '870-polish-company-taiwan-subsidiary-branch-office.md', // world-columns-20261024
    '871-polish-working-holiday-taiwan-six-month-work.md', // world-columns-20261024
    '872-polish-exporter-taiwan-unpaid-euro-invoices.md', // world-columns-20261024
  ],
  cs: [
    '873-czech-company-taiwan-subsidiary-branch-office.md', // world-columns-20261024
    '874-czech-working-holiday-taiwan-work-limits.md', // world-columns-20261024
    '875-czech-buyer-taiwan-defective-machine-claim.md', // world-columns-20261024
  ],
  lt: [
    '897-lithuanian-laser-company-taiwan-subsidiary-branch.md', // world-columns-20261024
    '898-lithuanian-engineer-taiwan-work-permit-residence.md', // world-columns-20261024
    '899-lithuanian-brand-taiwan-distributor-trademark-registration.md', // world-columns-20261024
  ],
  hu: [
    '879-hungarian-working-holiday-taiwan-employer-limit.md', // world-columns-20261024
    '880-hungarian-company-taiwan-subsidiary-branch-setup.md', // world-columns-20261024
    '881-hungarian-heir-taiwan-estate-deadlines-documents.md', // world-columns-20261024
  ],
  mn: [
    '816-mongolian-student-taiwan-part-time-work-permit-hours.md', // world-columns-20261024
    '817-mongolian-worker-taiwan-unpaid-overtime-wages-labor-mediation.md', // world-columns-20261024
    '818-mongolian-student-taiwan-scooter-accident-police-records-insurance.md', // world-columns-20261024
  ],
  my: [
    '810-myanmar-student-taiwan-part-time-work-permit-graduation.md', // world-columns-20261024
    '811-myanmar-resident-taiwan-bank-account-lending-police-warning.md', // world-columns-20261024
    '812-myanmar-spouse-taiwanese-marriage-interview-registration-visa.md', // world-columns-20261024
  ],
  sv: [
    '837-swedish-company-taiwan-subsidiary-branch-office.md', // world-columns-20261024
    '838-swedish-professional-taiwan-work-permit-residence.md', // world-columns-20261024
    '839-swedish-heir-taiwan-estate-deadlines-documents.md', // world-columns-20261024
  ],
  da: [
    '840-danish-company-taiwan-subsidiary-branch-project-office.md', // world-columns-20261024
    '841-danish-buyer-taiwan-wind-components-defect-notice.md', // world-columns-20261024
    '842-danish-engineer-taiwan-work-permit-family-residence.md', // world-columns-20261024
  ],
  tr: [
    '861-turkish-exporter-taiwan-unpaid-marble-invoices.md', // world-columns-20261024
    '862-turkish-importer-taiwan-machine-defect-notice.md', // world-columns-20261024
    '863-turkish-professionals-taiwan-work-permit-residence.md', // world-columns-20261024
  ],
  sk: [
    '876-slovak-working-holiday-taiwan-six-month-work-limit.md', // world-columns-20261024
    '877-slovak-exporter-taiwan-unpaid-invoice-recovery.md', // world-columns-20261024
    '878-slovak-business-taiwan-subsidiary-branch-office.md', // world-columns-20261024
  ],
  ro: [
    '882-romanian-exporter-taiwan-unpaid-panel-invoices.md', // world-columns-20261024
    '883-romanian-professional-taiwan-work-permit-residence.md', // world-columns-20261024
    '884-romanian-visitor-taiwan-traffic-injury-return-home.md', // world-columns-20261024
  ],
  bg: [
    '885-bulgarian-exporter-taiwan-unpaid-invoice.md', // world-columns-20261024
    '886-bulgarian-professional-taiwan-work-permit-residence.md', // world-columns-20261024
    '887-bulgarian-taiwanese-marriage-registration-residence.md', // world-columns-20261024
  ],
  hr: [
    '888-croatian-buyer-taiwan-defective-machine-evidence.md', // world-columns-20261024
    '889-croatian-professionals-taiwan-work-permit-residence.md', // world-columns-20261024
    '890-croatian-traveler-taiwan-accident-return-home.md', // world-columns-20261024
  ],
  fi: [
    '846-finnish-supplier-taiwan-distributor-exit-stock.md', // world-columns-20261024
    '847-finnish-professional-taiwan-work-permit-family.md', // world-columns-20261024
    '848-finnish-heir-taiwan-estate-renunciation-documents.md', // world-columns-20261024
  ],
  uk: [
    '867-ukrainian-professional-taiwan-work-permit-residence.md', // world-columns-20261024
    '868-ukrainian-taiwanese-marriage-documents-residence.md', // world-columns-20261024
    '869-ukrainian-oil-exporter-taiwan-unpaid-invoice.md', // world-columns-20261024
  ],
  nb: [
    '843-norwegian-seafood-exporter-taiwan-unpaid-invoices.md', // world-columns-20261024
    '844-norwegian-professional-taiwan-work-permit-residence.md', // world-columns-20261024
    '845-norwegian-traveller-taiwan-traffic-accident-return-home.md', // world-columns-20261024
  ],
  is: [
    '849-icelandic-professional-taiwan-work-permit-residence.md', // world-columns-20261024
    '850-icelandic-traveller-taiwan-accident-return-home.md', // world-columns-20261024
    '851-icelandic-exporter-taiwan-unpaid-shipment-invoice.md', // world-columns-20261024
  ],
  ca: [
    '852-catalan-brand-taiwan-trademark-distributor.md', // world-columns-20261024
    '853-catalan-professional-taiwan-work-permit-residence.md', // world-columns-20261024
    '854-catalan-taiwan-divorce-children-residence.md', // world-columns-20261024
  ],
  sr: [
    '891-serbian-professional-taiwan-work-permit-residence.md', // world-columns-20261024
    '892-serbian-fruit-exporter-taiwan-unpaid-invoices.md', // world-columns-20261024
    '893-serbian-resident-taiwan-police-summons-interpreter.md', // world-columns-20261024
  ],
  sl: [
    '894-slovenian-supplier-taiwan-distributor-exit-stock.md', // world-columns-20261024
    '895-slovenian-professional-taiwan-work-permit-residence.md', // world-columns-20261024
    '896-slovenian-heir-taiwan-estate-documents-deadlines.md', // world-columns-20261024
  ],
  lv: [
    '900-latvian-timber-exporter-taiwan-unpaid-invoices.md', // world-columns-20261024
    '901-latvian-professional-taiwan-work-permit-family.md', // world-columns-20261024
    '902-latvian-visitor-taiwan-traffic-injury-return-home.md', // world-columns-20261024
  ],
  et: [
    '903-estonian-company-taiwan-first-hire-eor.md', // world-columns-20261024
    '904-estonian-professional-taiwan-work-permit-residence.md', // world-columns-20261024
    '905-estonian-supplier-taiwan-unpaid-technology-invoices.md', // world-columns-20261024
  ],
} as const;

/** Four distinct case-led articles for each core market, published 2026-10-25. */
export const CASE_COLUMN_FILES_20261025 = {
  'ko': [
    '906-korean-publisher-exclusive-license-taiwan-complaint.md',
    '907-korean-brand-parallel-import-store-signs-taiwan.md',
    '908-korean-team-taiwan-after-hours-messages-overtime.md',
    '909-korean-traveler-taiwan-refund-claim-deadline.md',
  ],
  'ja': [
    '910-japanese-expat-allowances-bonuses-taiwan-judgment.md',
    '911-japan-taiwan-distributor-competing-products-judgment.md',
    '912-taiwan-oem-mold-return-inventory-claim-japan.md',
    '913-japanese-genuine-goods-taiwan-trademark-exhaustion.md',
  ],
  'en': [
    '914-taiwan-us-executive-share-bonus-payment-promise.md',
    '915-taiwan-public-contract-mediation-arbitration-same-claim.md',
    '916-taiwan-parent-company-pollution-liability-us-investor.md',
    '917-taiwan-film-license-corporate-party-us-declaration.md',
  ],
  'zh-hant': [
    '918-taiwan-presale-mortgage-notice-handover-judgment.md',
    '919-taiwan-workplace-bullying-investigation-hearing-judgment.md',
    '920-taiwan-apartment-ev-charger-common-area-judgment.md',
    '921-taiwan-online-game-coins-refund-judgment.md',
  ],
} as const;

const CASE_TRANSLATION_FILES_20261026 = [
  '915-taiwan-public-contract-mediation-arbitration-same-claim.md',
  '916-taiwan-parent-company-pollution-liability-us-investor.md',
  '918-taiwan-presale-mortgage-notice-handover-judgment.md',
  '919-taiwan-workplace-bullying-investigation-hearing-judgment.md',
  '920-taiwan-apartment-ev-charger-common-area-judgment.md',
  '921-taiwan-online-game-coins-refund-judgment.md',
] as const;

/** Reviewed translations published October26; their EN/ZH originals keep October25. */
export const CASE_TRANSLATION_COLUMN_FILES_20261026: Partial<Record<string, readonly string[]>> = {
  de: CASE_TRANSLATION_FILES_20261026,
  it: CASE_TRANSLATION_FILES_20261026,
  ar: CASE_TRANSLATION_FILES_20261026,
  pt: CASE_TRANSLATION_FILES_20261026,
  hi: CASE_TRANSLATION_FILES_20261026,
  ms: CASE_TRANSLATION_FILES_20261026,
  ru: CASE_TRANSLATION_FILES_20261026,
  bg: CASE_TRANSLATION_FILES_20261026,
  bn: CASE_TRANSLATION_FILES_20261026,
  ca: CASE_TRANSLATION_FILES_20261026,
  da: CASE_TRANSLATION_FILES_20261026,
  el: CASE_TRANSLATION_FILES_20261026,
  et: CASE_TRANSLATION_FILES_20261026,
  fa: CASE_TRANSLATION_FILES_20261026,
  fi: CASE_TRANSLATION_FILES_20261026,
  hr: CASE_TRANSLATION_FILES_20261026,
  hu: CASE_TRANSLATION_FILES_20261026,
  is: CASE_TRANSLATION_FILES_20261026,
  km: CASE_TRANSLATION_FILES_20261026,
  lv: CASE_TRANSLATION_FILES_20261026,
  mn: CASE_TRANSLATION_FILES_20261026,
  nb: CASE_TRANSLATION_FILES_20261026,
  ne: CASE_TRANSLATION_FILES_20261026,
  pl: CASE_TRANSLATION_FILES_20261026,
  ro: CASE_TRANSLATION_FILES_20261026,
  sk: CASE_TRANSLATION_FILES_20261026,
  sl: CASE_TRANSLATION_FILES_20261026,
  sr: CASE_TRANSLATION_FILES_20261026,
};

// These case locales already have ARC articles with later dates than the original ARC batch.
const CASE_LOCALE_ARC_PUBLICATION_DATES: Partial<Record<string, string>> = {
  bg: '2026-10-26', bn: '2026-10-26', ca: '2026-10-26', da: '2026-10-25',
  el: '2026-10-26', et: '2026-10-26', fa: '2026-10-26',
  fi: '2026-10-25', hr: '2026-10-26', hu: '2026-10-26', is: '2026-10-26',
  km: '2026-10-26', lv: '2026-10-26', mn: '2026-10-26',
  nb: '2026-10-25', ne: '2026-10-26', pl: '2026-10-25', ro: '2026-10-25',
  sk: '2026-10-26', sl: '2026-10-26', sr: '2026-10-26',
};

/** Country-specific market expansion, two original articles per selected locale. */
export const MARKET_EXPANSION_COLUMN_FILES_20261025 = {
  'vi': [
    '922-vietnamese-tenant-taiwan-deposit-handover-deductions.md',
    '923-vietnamese-graduate-taiwan-probation-pay-work-exemption.md',
  ],
  'id': [
    '924-indonesian-caregiver-taiwan-pregnancy-dismissal.md',
    '925-indonesian-caregiver-taiwan-work-outside-permit.md',
  ],
  'fil': [
    '926-filipino-worker-taiwan-injury-resignation-settlement.md',
    '927-filipino-worker-taiwan-loan-promissory-note-court-order.md',
  ],
  'hi': [
    '928-indian-minority-investor-taiwan-company-inspector.md',
    '929-indian-technical-service-fees-taiwan-tax-treaty.md',
  ],
  'ar': [
    '930-uae-taiwan-shipment-rerouting-hardship.md',
    '931-saudi-supplier-taiwan-distributor-resale-prices.md',
  ],
  'he': [
    '932-israel-taiwan-pph-patent-claims-window.md',
    '933-israeli-taiwan-joint-patent-license-consent.md',
  ],
  'nl': [
    '934-dutch-technicians-taiwan-installation-contract-work-permit.md',
    '935-dutch-machinery-taiwan-retention-title-registration.md',
  ],
  'fr': [
    '936-french-cosmetics-taiwan-pif-importer-handover.md',
    '937-french-wine-taiwan-online-orders-advertising.md',
  ],
  'pt': [
    '938-brazil-coffee-taiwan-border-reinspection.md',
    '939-brazil-organic-coffee-taiwan-label-certification.md',
  ],
  'pl': [
    '940-polish-importer-taiwan-invoice-bank-change-payment.md',
    '941-polish-brand-taiwan-consumer-injury-importer-recall.md',
  ],
  'cs': [
    '942-czech-supplier-taiwan-email-purchase-order-contract.md',
    '943-czech-exhibitor-taiwan-patent-disclosure-priority.md',
  ],
  'lt': [
    '944-lithuanian-laser-taiwan-evaluation-samples-test-data.md',
    '945-lithuanian-company-taiwan-firmware-copyright-source-code.md',
  ],
} as const;

/** Weekday expert columns published 2026-10-26, in source order. */
export const COUNTRY_COLUMN_FILES_20261026 = {
  'ko': [
    '947-taiwan-overseas-fx-broker-account-hacked-criminal-complaint-jurisdiction.md', // ship-20261026-G2
    '948-taiwan-police-prosecutor-interpreter-oath-challenge-foreign-suspect.md', // ship-20261026-G3
    '949-taiwan-national-park-filming-fine-administrative-appeal.md', // ship-20261026-G4
    '950-taiwan-estate-tax-listed-shares-closing-price-valuation.md', // ship-20261026-G5
    '951-taiwan-construction-subcontractor-fall-principal-contractor-liability.md', // ship-20261026-G6
  ],
  'zh-hant': [
    '947-taiwan-overseas-fx-broker-account-hacked-criminal-complaint-jurisdiction.md', // ship-20261026-G2
    '948-taiwan-police-prosecutor-interpreter-oath-challenge-foreign-suspect.md', // ship-20261026-G3
    '949-taiwan-national-park-filming-fine-administrative-appeal.md', // ship-20261026-G4
    '950-taiwan-estate-tax-listed-shares-closing-price-valuation.md', // ship-20261026-G5
    '951-taiwan-construction-subcontractor-fall-principal-contractor-liability.md', // ship-20261026-G6
  ],
  'ja': [
    '947-taiwan-overseas-fx-broker-account-hacked-criminal-complaint-jurisdiction.md', // ship-20261026-G2
    '948-taiwan-police-prosecutor-interpreter-oath-challenge-foreign-suspect.md', // ship-20261026-G3
    '949-taiwan-national-park-filming-fine-administrative-appeal.md', // ship-20261026-G4
    '950-taiwan-estate-tax-listed-shares-closing-price-valuation.md', // ship-20261026-G5
    '951-taiwan-construction-subcontractor-fall-principal-contractor-liability.md', // ship-20261026-G6
  ],
  'en': [
    '947-taiwan-overseas-fx-broker-account-hacked-criminal-complaint-jurisdiction.md', // ship-20261026-G2
    '948-taiwan-police-prosecutor-interpreter-oath-challenge-foreign-suspect.md', // ship-20261026-G3
    '949-taiwan-national-park-filming-fine-administrative-appeal.md', // ship-20261026-G4
    '950-taiwan-estate-tax-listed-shares-closing-price-valuation.md', // ship-20261026-G5
    '951-taiwan-construction-subcontractor-fall-principal-contractor-liability.md', // ship-20261026-G6
  ],
  'es': [
    '946-taiwan-crypto-tax-audit-letter-exchange-location-cost-basis.md', // ship-20261026-G1
    '947-taiwan-overseas-fx-broker-account-hacked-criminal-complaint-jurisdiction.md', // ship-20261026-G2
    '948-taiwan-police-prosecutor-interpreter-oath-challenge-foreign-suspect.md', // ship-20261026-G3
    '949-taiwan-national-park-filming-fine-administrative-appeal.md', // ship-20261026-G4
    '950-taiwan-estate-tax-listed-shares-closing-price-valuation.md', // ship-20261026-G5
    '951-taiwan-construction-subcontractor-fall-principal-contractor-liability.md', // ship-20261026-G6
  ],
} as const;

/** Weekday expert columns published 2026-10-27, in source order. */
export const COUNTRY_COLUMN_FILES_20261027 = {
  'ko': [
    '952-taiwan-employee-compensation-bonus-rsu-leaving-before-payout.md', // ship-20261027-G1
    '953-taiwan-foreign-freelancer-contractor-worker-status-work-permit.md', // ship-20261027-G2
    '954-taiwan-overseas-company-data-breach-notice-resident-damages-claim.md', // ship-20261027-G3
    '955-taiwan-mortgage-grace-period-end-debt-negotiation-auction-co-borrower.md', // ship-20261027-G4
    '956-taiwan-fake-trading-platform-withdrawal-fee-payouts-account-trace.md', // ship-20261027-G5
    '957-taiwan-china-partner-technology-licensing-trade-secret-permit.md', // ship-20261027-G6
  ],
  'zh-hant': [
    '952-taiwan-employee-compensation-bonus-rsu-leaving-before-payout.md', // ship-20261027-G1
    '953-taiwan-foreign-freelancer-contractor-worker-status-work-permit.md', // ship-20261027-G2
    '954-taiwan-overseas-company-data-breach-notice-resident-damages-claim.md', // ship-20261027-G3
    '955-taiwan-mortgage-grace-period-end-debt-negotiation-auction-co-borrower.md', // ship-20261027-G4
    '956-taiwan-fake-trading-platform-withdrawal-fee-payouts-account-trace.md', // ship-20261027-G5
    '957-taiwan-china-partner-technology-licensing-trade-secret-permit.md', // ship-20261027-G6
  ],
  'ja': [
    '952-taiwan-employee-compensation-bonus-rsu-leaving-before-payout.md', // ship-20261027-G1
    '953-taiwan-foreign-freelancer-contractor-worker-status-work-permit.md', // ship-20261027-G2
    '954-taiwan-overseas-company-data-breach-notice-resident-damages-claim.md', // ship-20261027-G3
    '955-taiwan-mortgage-grace-period-end-debt-negotiation-auction-co-borrower.md', // ship-20261027-G4
    '956-taiwan-fake-trading-platform-withdrawal-fee-payouts-account-trace.md', // ship-20261027-G5
    '957-taiwan-china-partner-technology-licensing-trade-secret-permit.md', // ship-20261027-G6
  ],
  'en': [
    '952-taiwan-employee-compensation-bonus-rsu-leaving-before-payout.md', // ship-20261027-G1
    '953-taiwan-foreign-freelancer-contractor-worker-status-work-permit.md', // ship-20261027-G2
    '954-taiwan-overseas-company-data-breach-notice-resident-damages-claim.md', // ship-20261027-G3
    '955-taiwan-mortgage-grace-period-end-debt-negotiation-auction-co-borrower.md', // ship-20261027-G4
    '956-taiwan-fake-trading-platform-withdrawal-fee-payouts-account-trace.md', // ship-20261027-G5
    '957-taiwan-china-partner-technology-licensing-trade-secret-permit.md', // ship-20261027-G6
  ],
  'es': [
    '952-taiwan-employee-compensation-bonus-rsu-leaving-before-payout.md', // ship-20261027-G1
    '953-taiwan-foreign-freelancer-contractor-worker-status-work-permit.md', // ship-20261027-G2
    '954-taiwan-overseas-company-data-breach-notice-resident-damages-claim.md', // ship-20261027-G3
    '955-taiwan-mortgage-grace-period-end-debt-negotiation-auction-co-borrower.md', // ship-20261027-G4
    '956-taiwan-fake-trading-platform-withdrawal-fee-payouts-account-trace.md', // ship-20261027-G5
    '957-taiwan-china-partner-technology-licensing-trade-secret-permit.md', // ship-20261027-G6
  ],
} as const;

/** Weekday expert columns published 2026-10-28, in source order. */
export const COUNTRY_COLUMN_FILES_20261028 = {
  'ko': [
    '958-taiwan-marketplace-seller-when-local-entity-business-tax-registration.md', // ship-20261028-G1
    '959-taiwan-spouse-life-insurance-insured-written-consent-beneficiary-revocation.md', // ship-20261028-G2
    '960-taiwan-futures-securities-broker-system-error-order-loss-claim.md', // ship-20261028-G3
  ],
  'zh-hant': [
    '958-taiwan-marketplace-seller-when-local-entity-business-tax-registration.md', // ship-20261028-G1
    '959-taiwan-spouse-life-insurance-insured-written-consent-beneficiary-revocation.md', // ship-20261028-G2
    '960-taiwan-futures-securities-broker-system-error-order-loss-claim.md', // ship-20261028-G3
  ],
  'ja': [
    '958-taiwan-marketplace-seller-when-local-entity-business-tax-registration.md', // ship-20261028-G1
    '959-taiwan-spouse-life-insurance-insured-written-consent-beneficiary-revocation.md', // ship-20261028-G2
    '960-taiwan-futures-securities-broker-system-error-order-loss-claim.md', // ship-20261028-G3
  ],
  'en': [
    '958-taiwan-marketplace-seller-when-local-entity-business-tax-registration.md', // ship-20261028-G1
    '959-taiwan-spouse-life-insurance-insured-written-consent-beneficiary-revocation.md', // ship-20261028-G2
    '960-taiwan-futures-securities-broker-system-error-order-loss-claim.md', // ship-20261028-G3
  ],
  'es': [
    '958-taiwan-marketplace-seller-when-local-entity-business-tax-registration.md', // ship-20261028-G1
    '959-taiwan-spouse-life-insurance-insured-written-consent-beneficiary-revocation.md', // ship-20261028-G2
    '960-taiwan-futures-securities-broker-system-error-order-loss-claim.md', // ship-20261028-G3
  ],
} as const;

/** Registered locale-specific batches through 2026-10-28, in filename order. */
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
    ...((COUNTRY_COLUMN_FILES_20261004 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261005 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261006 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261007 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261013 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261014 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261015 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261016 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261018 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261020 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261022 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261023 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...(ARC_VISA_COLUMN_FILES_20261024[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261024 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((CASE_COLUMN_FILES_20261025 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...(CASE_TRANSLATION_COLUMN_FILES_20261026[locale] ?? []),
    ...((MARKET_EXPANSION_COLUMN_FILES_20261025 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261026 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261027 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261028 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((TRAFFIC_SCENE_COLUMN_FILES_20261014 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((TRAFFIC_SCENE_COLUMN_FILES_20261015 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((TRAFFIC_SCENE_COLUMN_FILES_20261021 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((NEXT_TOPIC_COLUMN_FILES_20261010 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((AIR_COLUMN_FILES_20261011 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((GAP_COLUMN_FILES_20261010 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((SINGAPORE_COLUMN_FILES_20261010 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((AI_SEMICONDUCTOR_COLUMN_FILES_20261009 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((CRIMINAL_COLUMN_FILES_20261008 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((TAX_ACCOUNTING_COLUMN_FILES as Partial<Record<string, readonly string[]>>)[locale] ?? []),
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
 * Archive lead of `locale`, newest first by date through 2026-10-28, with same-day
 * files in source order. Use this for newest-first ordering assertions;
 * `expertiseSlugsFor` stays in filename order for counts and column-number tie-breaks.
 */
export function archiveLeadSlugsFor(locale: string): string[] {
  const day20261028: readonly string[] =
    (COUNTRY_COLUMN_FILES_20261028 as Partial<Record<string, readonly string[]>>)[locale] ?? [];
  const day20261027: readonly string[] =
    (COUNTRY_COLUMN_FILES_20261027 as Partial<Record<string, readonly string[]>>)[locale] ?? [];
  const day20261026: readonly string[] = [
    ...(CASE_LOCALE_ARC_PUBLICATION_DATES[locale] === '2026-10-26' ? ARC_VISA_FILES_20261024 : []),
    ...(CASE_TRANSLATION_COLUMN_FILES_20261026[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261026 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...(taxAccountingFilesPublishedOn('2026-10-26')[locale] ?? []),
  ];
  const day20261025: readonly string[] = [
    ...(CASE_LOCALE_ARC_PUBLICATION_DATES[locale] === '2026-10-25' ? ARC_VISA_FILES_20261024 : []),
    ...((CASE_COLUMN_FILES_20261025 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((MARKET_EXPANSION_COLUMN_FILES_20261025 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
  ];
  const day20261024: readonly string[] = [
    ...(CASE_LOCALE_ARC_PUBLICATION_DATES[locale] ? [] : ARC_VISA_COLUMN_FILES_20261024[locale] ?? []),
    ...((COUNTRY_COLUMN_FILES_20261024 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
  ];
  const day20261023: readonly string[] = [
    ...((COUNTRY_COLUMN_FILES_20261023 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...(taxAccountingFilesPublishedOn('2026-10-23')[locale] ?? []),
  ];
  const day20261022: readonly string[] = [
    ...((COUNTRY_COLUMN_FILES_20261022 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...(taxAccountingFilesPublishedOn('2026-10-22')[locale] ?? []),
  ];
  const day20261021: readonly string[] =
    (TRAFFIC_SCENE_COLUMN_FILES_20261021 as Partial<Record<string, readonly string[]>>)[locale] ?? [];
  const day20261020: readonly string[] =
    (COUNTRY_COLUMN_FILES_20261020 as Partial<Record<string, readonly string[]>>)[locale] ?? [];
  const day20261018: readonly string[] =
    (COUNTRY_COLUMN_FILES_20261018 as Partial<Record<string, readonly string[]>>)[locale] ?? [];
  const day20261016: readonly string[] =
    (COUNTRY_COLUMN_FILES_20261016 as Partial<Record<string, readonly string[]>>)[locale] ?? [];
  const day20261015: readonly string[] = [
    ...((COUNTRY_COLUMN_FILES_20261015 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((TRAFFIC_SCENE_COLUMN_FILES_20261015 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
  ];
  const day20261014: readonly string[] = [
    ...((COUNTRY_COLUMN_FILES_20261014 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((TRAFFIC_SCENE_COLUMN_FILES_20261014 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...(taxAccountingFilesPublishedOn('2026-10-14')[locale] ?? []),
  ];
  const day20261013: readonly string[] =
    (COUNTRY_COLUMN_FILES_20261013 as Partial<Record<string, readonly string[]>>)[locale] ?? [];
  const day20261011: readonly string[] = [
    ...((NEXT_TOPIC_COLUMN_FILES_20261010 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((AIR_COLUMN_FILES_20261011 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
  ];
  const day20261010: readonly string[] = [
    ...((GAP_COLUMN_FILES_20261010 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...((SINGAPORE_COLUMN_FILES_20261010 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
  ];
  const day20261009 = (AI_SEMICONDUCTOR_COLUMN_FILES_20261009 as Partial<Record<string, readonly string[]>>)[locale] ?? [];
  const day20261008 = (CRIMINAL_COLUMN_FILES_20261008 as Partial<Record<string, readonly string[]>>)[locale] ?? [];
  const day20261007: readonly string[] = [
    ...((COUNTRY_COLUMN_FILES_20261007 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...(taxAccountingFilesPublishedOn('2026-10-07')[locale] ?? []),
  ];
  const day20261006: readonly string[] = [
    ...((COUNTRY_COLUMN_FILES_20261006 as Partial<Record<string, readonly string[]>>)[locale] ?? []),
    ...(taxAccountingFilesPublishedOn('2026-10-06')[locale] ?? []),
  ];
  const day20261005: readonly string[] =
    (COUNTRY_COLUMN_FILES_20261005 as Partial<Record<string, readonly string[]>>)[locale] ?? [];
  const current: readonly string[] =
    (COUNTRY_COLUMN_FILES_20261004 as Partial<Record<string, readonly string[]>>)[locale] ?? [];
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
  const day20261007Slugs = [...day20261007].sort().map(slugOf);
  const day20261006Slugs = [...day20261006].sort().map(slugOf);
  const day20261005Slugs = [...day20261005].sort().map(slugOf);
  const currentSlugs = [...current].sort().map(slugOf);
  const latestSlugs = [...latest].sort().map(slugOf);
  const newestSlugs = [...newest].sort().map(slugOf);
  const newerSlugs = [...newer].sort().map(slugOf);
  const head = [...day20261023].sort().map(slugOf).concat([...day20261022].sort().map(slugOf), [...day20261021].sort().map(slugOf), [...day20261020].sort().map(slugOf), [...day20261018].sort().map(slugOf), [...day20261016].sort().map(slugOf), [...day20261015].sort().map(slugOf), [...day20261014].sort().map(slugOf), [...day20261013].sort().map(slugOf), [...day20261011].sort().map(slugOf), [...day20261010].sort().map(slugOf), [...day20261009].sort().map(slugOf), [...day20261008].sort().map(slugOf), day20261007Slugs, day20261006Slugs, day20261005Slugs, currentSlugs, latestSlugs, newestSlugs, newerSlugs);
  const latestHead = [...day20261028].sort().map(slugOf).concat([...day20261027].sort().map(slugOf), [...day20261026].sort().map(slugOf), [...day20261025].sort().map(slugOf), [...day20261024].sort().map(slugOf), head);
  return [...latestHead, ...expertiseSlugsFor(locale).filter((slug) => !latestHead.includes(slug))];
}

/** Locale is explicit because translated cases have a later publication date than their originals. */
export function archiveLeadPublicationDate(slug: string, locale: string): string {
  if (Object.values(COUNTRY_COLUMN_FILES_20261028).flat().map(slugOf).includes(slug)) return '2026-10-28';
  if (Object.values(COUNTRY_COLUMN_FILES_20261027).flat().map(slugOf).includes(slug)) return '2026-10-27';
  if (CASE_TRANSLATION_COLUMN_FILES_20261026[locale]?.map(slugOf).includes(slug)) return '2026-10-26';
  const day20261026 = [...Object.values(COUNTRY_COLUMN_FILES_20261026), ...Object.values(taxAccountingFilesPublishedOn('2026-10-26')).filter((files): files is readonly string[] => files !== undefined)].flat().map(slugOf);
  if (day20261026.includes(slug)) return '2026-10-26';
  if (Object.values(CASE_COLUMN_FILES_20261025).flat().map(slugOf).includes(slug)) return '2026-10-25';
  if (Object.values(MARKET_EXPANSION_COLUMN_FILES_20261025).flat().map(slugOf).includes(slug)) return '2026-10-25';
  if (ARC_VISA_FILES_20261024.map(slugOf).includes(slug)) return CASE_LOCALE_ARC_PUBLICATION_DATES[locale] ?? '2026-10-24';
  if (Object.values(COUNTRY_COLUMN_FILES_20261024).flat().map(slugOf).includes(slug)) return '2026-10-24';
  if (Object.values(COUNTRY_COLUMN_FILES_20261023).flat().map(slugOf).includes(slug)) return '2026-10-23';
  const day20261022 = [...Object.values(COUNTRY_COLUMN_FILES_20261022), ...Object.values(taxAccountingFilesPublishedOn('2026-10-22')).filter((files): files is readonly string[] => files !== undefined)].flat().map(slugOf);
  if (day20261022.includes(slug)) return '2026-10-22';
  if (Object.values(TRAFFIC_SCENE_COLUMN_FILES_20261021).flat().map(slugOf).includes(slug)) return '2026-10-21';
  if (Object.values(COUNTRY_COLUMN_FILES_20261020).flat().map(slugOf).includes(slug)) return '2026-10-20';
  if (Object.values(COUNTRY_COLUMN_FILES_20261018).flat().map(slugOf).includes(slug)) return '2026-10-18';
  if (Object.values(COUNTRY_COLUMN_FILES_20261016).flat().map(slugOf).includes(slug)) return '2026-10-16';
  if ([...Object.values(COUNTRY_COLUMN_FILES_20261015), ...Object.values(TRAFFIC_SCENE_COLUMN_FILES_20261015)].flat().map(slugOf).includes(slug)) return '2026-10-15';
  const day20261014 = [...Object.values(COUNTRY_COLUMN_FILES_20261014), ...Object.values(TRAFFIC_SCENE_COLUMN_FILES_20261014), ...Object.values(taxAccountingFilesPublishedOn('2026-10-14')).filter((files): files is readonly string[] => files !== undefined)].flat().map(slugOf);
  if (day20261014.includes(slug)) return '2026-10-14';
  if (Object.values(COUNTRY_COLUMN_FILES_20261013).flat().map(slugOf).includes(slug)) return '2026-10-13';
  if (Object.values(AIR_COLUMN_FILES_20261011).flat().map(slugOf).includes(slug)) return AIR_COLUMN_PUBLICATION_DATE;
  if (Object.values(NEXT_TOPIC_COLUMN_FILES_20261010).flat().map(slugOf).includes(slug)) return '2026-10-11';
  if (Object.values(GAP_COLUMN_FILES_20261010).flat().map(slugOf).includes(slug)) return '2026-10-10';
  if (Object.values(SINGAPORE_COLUMN_FILES_20261010).flat().map(slugOf).includes(slug)) return '2026-10-10';
  if (Object.values(AI_SEMICONDUCTOR_COLUMN_FILES_20261009).flat().map(slugOf).includes(slug)) return '2026-10-09';
  if (Object.values(CRIMINAL_COLUMN_FILES_20261008).flat().map(slugOf).includes(slug)) return '2026-10-08';
  const day20261007 = [...Object.values(COUNTRY_COLUMN_FILES_20261007), ...Object.values(taxAccountingFilesPublishedOn('2026-10-07')).filter((files): files is readonly string[] => files !== undefined)].flat().map(slugOf);
  if (day20261007.includes(slug)) return '2026-10-07';
  const day20261006 = [...Object.values(COUNTRY_COLUMN_FILES_20261006), ...Object.values(taxAccountingFilesPublishedOn('2026-10-06')).filter((files): files is readonly string[] => files !== undefined)].flat().map(slugOf);
  if (day20261006.includes(slug)) return '2026-10-06';
  const day20261005 = Object.values(COUNTRY_COLUMN_FILES_20261005).flat().map(slugOf);
  if (day20261005.includes(slug)) return '2026-10-05';
  const current = Object.values(COUNTRY_COLUMN_FILES_20261004).flat().map(slugOf);
  if (current.includes(slug)) return '2026-10-04';
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
    ...Object.values(COUNTRY_COLUMN_FILES_20261004),
    ...Object.values(COUNTRY_COLUMN_FILES_20261005),
    ...Object.values(COUNTRY_COLUMN_FILES_20261006),
    ...Object.values(COUNTRY_COLUMN_FILES_20261007),
    ...Object.values(COUNTRY_COLUMN_FILES_20261013),
    ...Object.values(COUNTRY_COLUMN_FILES_20261014),
    ...Object.values(COUNTRY_COLUMN_FILES_20261015),
    ...Object.values(COUNTRY_COLUMN_FILES_20261016),
    ...Object.values(COUNTRY_COLUMN_FILES_20261018),
    ...Object.values(COUNTRY_COLUMN_FILES_20261020),
    ...Object.values(COUNTRY_COLUMN_FILES_20261022),
    ...Object.values(COUNTRY_COLUMN_FILES_20261023),
    ARC_VISA_FILES_20261024,
    ...Object.values(COUNTRY_COLUMN_FILES_20261024),
    ...Object.values(CASE_COLUMN_FILES_20261025),
    ...Object.values(MARKET_EXPANSION_COLUMN_FILES_20261025),
    ...Object.values(COUNTRY_COLUMN_FILES_20261026),
    ...Object.values(COUNTRY_COLUMN_FILES_20261027),
    ...Object.values(COUNTRY_COLUMN_FILES_20261028),
    ...Object.values(TRAFFIC_SCENE_COLUMN_FILES_20261014),
    ...Object.values(TRAFFIC_SCENE_COLUMN_FILES_20261015),
    ...Object.values(TRAFFIC_SCENE_COLUMN_FILES_20261021),
    ...Object.values(NEXT_TOPIC_COLUMN_FILES_20261010),
    ...Object.values(AIR_COLUMN_FILES_20261011),
    ...Object.values(GAP_COLUMN_FILES_20261010),
    ...Object.values(SINGAPORE_COLUMN_FILES_20261010),
    ...Object.values(AI_SEMICONDUCTOR_COLUMN_FILES_20261009),
    ...Object.values(CRIMINAL_COLUMN_FILES_20261008),
    ...Object.values(TAX_ACCOUNTING_COLUMN_FILES),
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
