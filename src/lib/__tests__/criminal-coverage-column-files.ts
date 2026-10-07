/** Explicit native release inventory; do not infer expectations from runtime tags. */
export const CRIMINAL_COLUMN_FILES_20261008 = {
  "ko": [
    "421-taiwan-assault-injury-medical-evidence-complaint.md",
    "422-taiwan-cannabis-drugs-luggage-parcel-criminal-risk.md",
    "423-taiwan-crime-report-complaint-korean-return.md",
    "424-taiwan-criminal-judgment-summary-appeal-twenty-days.md",
    "425-taiwan-deferred-prosecution-suspended-sentence-fine-conversion.md",
    "426-taiwan-online-review-defamation-public-insult.md",
    "427-taiwan-sexual-assault-medical-report-support.md",
    "428-taiwan-stolen-phone-wallet-police-evidence.md"
  ],
  "zh-hant": [
    "413-taiwan-criminal-first-judgment-appeal-summary.md",
    "414-taiwan-deferred-prosecution-duties-revocation.md",
    "415-taiwan-fine-conversion-community-service-execution.md",
    "416-taiwan-injury-complaint-fight-self-defense.md",
    "417-taiwan-remand-family-visits-contact-challenge.md",
    "418-taiwan-sexual-assault-report-evidence-victim-support.md",
    "419-taiwan-suspended-sentence-obligations-revocation.md",
    "420-taiwan-threats-coercion-messages-evidence.md"
  ],
  "en": [
    "405-taiwan-assault-injury-self-defense-compensation.md",
    "406-taiwan-criminal-judgment-summary-appeal-service.md",
    "407-taiwan-deferred-prosecution-conditions-revocation.md",
    "408-taiwan-detention-center-family-visits-lawyer-contact.md",
    "409-taiwan-police-criminal-record-certificate-omitted-conviction.md",
    "410-taiwan-sexual-assault-report-adult-foreign-victim.md",
    "411-taiwan-shoplifting-found-property-theft.md",
    "412-taiwan-short-sentence-fine-community-service-suspension.md"
  ],
  "ja": [
    "429-taiwan-assault-damages-attached-civil-action-japanese.md",
    "430-taiwan-assault-injury-threat-complaint-japanese.md",
    "431-taiwan-criminal-judgment-appeal-japanese.md",
    "432-taiwan-deferred-prosecution-suspended-sentence-fine-japanese.md",
    "433-taiwan-detained-family-visits-lawyer-japanese.md",
    "434-taiwan-search-warrant-consent-home-office-japanese.md",
    "435-taiwan-sexual-assault-medical-reporting-japanese.md",
    "436-taiwan-shoplifting-found-property-japanese.md"
  ],
  "vi": [
    "437-taiwan-arrest-detention-bail-vietnamese-families.md",
    "438-taiwan-assault-threats-evidence-complaint-deadline.md",
    "439-taiwan-criminal-judgment-appeal-vietnamese.md",
    "440-taiwan-drug-parcel-courier-job-criminal-risk.md",
    "441-taiwan-fraud-victim-report-civil-money-recovery.md",
    "442-taiwan-police-interview-vietnamese-interpreter-lawyer.md",
    "443-taiwan-sexual-assault-report-vietnamese-workers-residents.md",
    "444-taiwan-short-sentence-fine-suspension-residence.md"
  ]
} as const;

export const RECLASSIFIED_CRIMINAL_COLUMN_FILES_20261008 = {
  "ko": [],
  "zh-hant": [],
  "en": [
    "355-cannabis-thc-cbd-taiwan-penalties-us-visitors.md"
  ],
  "ja": [],
  "vi": []
} as const;

const ORIGINAL_CRIMINAL_SLUGS = [
  "taiwan-criminal-witness-summons-refuse-testimony",
  "taiwan-criminal-settlement-withdraw-complaint",
  "taiwan-non-prosecution-reconsideration-deadline",
  "taiwan-seized-phone-property-return"
] as const;

export function expectedCriminalBoardSlugs(locale: keyof typeof CRIMINAL_COLUMN_FILES_20261008): string[] {
  return [
    ...ORIGINAL_CRIMINAL_SLUGS,
    ...CRIMINAL_COLUMN_FILES_20261008[locale].map((file: string) => file.replace(/^\d{3}-/, '').replace(/\.md$/, '')),
    ...RECLASSIFIED_CRIMINAL_COLUMN_FILES_20261008[locale].map((file: string) => file.replace(/^\d{3}-/, '').replace(/\.md$/, '')),
  ].sort();
}
