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

/** Registered locale-specific batches through 2026-10-05, in filename order. */
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
 * Archive lead of `locale`, newest first by date through 2026-10-05, with same-day
 * files in source order. Use this for newest-first ordering assertions;
 * `expertiseSlugsFor` stays in filename order for counts and column-number tie-breaks.
 */
export function archiveLeadSlugsFor(locale: string): string[] {
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
  const day20261005Slugs = [...day20261005].sort().map(slugOf);
  const currentSlugs = [...current].sort().map(slugOf);
  const latestSlugs = [...latest].sort().map(slugOf);
  const newestSlugs = [...newest].sort().map(slugOf);
  const newerSlugs = [...newer].sort().map(slugOf);
  const head = [...day20261005Slugs, ...currentSlugs, ...latestSlugs, ...newestSlugs, ...newerSlugs];
  return [...head, ...expertiseSlugsFor(locale).filter((slug) => !head.includes(slug))];
}

/** Verified publication date of an archive-lead slug (2026-09-30 through 2026-10-05). */
export function archiveLeadPublicationDate(slug: string): string {
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
