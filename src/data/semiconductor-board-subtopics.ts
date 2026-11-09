import type { SiteLocale } from '@/lib/locales';

export const SEMICONDUCTOR_BOARD_SUBTOPICS = [
  'tsmc-supply-chain',
  'trade-secrets',
  'export-control',
  'talent-labor-noncompete',
  'company-setup',
  'ip-patent',
  'contract-payment',
] as const;

export type SemiconductorBoardSubtopic = (typeof SEMICONDUCTOR_BOARD_SUBTOPICS)[number];

export const SEMICONDUCTOR_SUBTOPIC_LABELS: Record<
  SiteLocale,
  Record<SemiconductorBoardSubtopic, string>
> = {
  ko: {
    'tsmc-supply-chain': 'TSMC·공급망',
    'trade-secrets': '영업비밀',
    'export-control': '수출통제',
    'talent-labor-noncompete': '인력·노동·경업',
    'company-setup': '회사설립·진출',
    'ip-patent': 'IP·특허',
    'contract-payment': '계약·대금',
  },
  'zh-hant': {
    'tsmc-supply-chain': 'TSMC·供應鏈',
    'trade-secrets': '營業秘密',
    'export-control': '出口管制',
    'talent-labor-noncompete': '人才·勞動·競業',
    'company-setup': '公司設立·進入台灣',
    'ip-patent': 'IP·專利',
    'contract-payment': '契約·款項',
  },
  en: {
    'tsmc-supply-chain': 'TSMC and supply chain',
    'trade-secrets': 'Trade secrets',
    'export-control': 'Export controls',
    'talent-labor-noncompete': 'Talent, labor, non-compete',
    'company-setup': 'Company setup and entry',
    'ip-patent': 'IP and patents',
    'contract-payment': 'Contracts and payment',
  },
  ja: {
    'tsmc-supply-chain': 'TSMC・サプライチェーン',
    'trade-secrets': '営業秘密',
    'export-control': '輸出規制',
    'talent-labor-noncompete': '人材・労働・競業',
    'company-setup': '会社設立・進出',
    'ip-patent': 'IP・特許',
    'contract-payment': '契約・代金',
  },
};

/** Slug → one or two subtopics (fixed after title/summary review). */
export const SEMICONDUCTOR_SLUG_SUBTOPICS: Readonly<Record<string, readonly SemiconductorBoardSubtopic[]>> = {
  'taiwan-manufacturing-ai-distributor-direct-sales-pricing-korean': ['contract-payment'],
  'taiwan-equipment-engineer-contract-work-permit-korean': ['talent-labor-noncompete'],
  'korea-taiwan-tax-agreement-dispatched-engineers-permanent-establishment': ['company-setup', 'talent-labor-noncompete'],
  'tsmc-former-executive-intel-noncompete-injunction-korean-employers': ['talent-labor-noncompete', 'trade-secrets'],
  'taiwan-semiconductor-patent-litigation-korean-companies': ['ip-patent'],
  'taiwan-science-park-fab-supplier-permits-water-power': ['company-setup', 'tsmc-supply-chain'],
  'taiwan-semiconductor-shift-work-labor-law-korean-subsidiary': ['talent-labor-noncompete'],
  'taiwan-export-control-entity-list-korean-traders': ['export-control'],
  'taiwan-gold-card-semiconductor-talent-korean-engineers': ['talent-labor-noncompete'],
  'taiwan-national-security-act-core-key-technology-korean-engineers': ['export-control', 'trade-secrets'],
  'taiwan-trade-secrets-act-criminal-civil-korean-companies': ['trade-secrets'],
  'korean-supplier-tsmc-vendor-qualification-contract': ['tsmc-supply-chain', 'contract-payment'],
  'taiwan-semiconductor-ai-nstc-university-licensing': ['ip-patent', 'contract-payment'],
  'taiwan-ai-project-unpaid-balance-delivery-evidence': ['contract-payment'],
  'taiwan-ai-model-inspection-equipment-investment-tax-credit': ['company-setup'],
  'taiwan-ai-inspection-contract-liability': ['contract-payment'],
  'taiwan-factory-vision-ai-worker-personal-data': ['talent-labor-noncompete'],
  'taiwan-ai-server-gpu-export-order-contract-controls': ['export-control', 'contract-payment'],
  'taiwan-ai-development-model-data-code-rights': ['ip-patent', 'contract-payment'],
  'taiwan-manufacturing-ai-data-trade-secrets': ['trade-secrets'],
  'taiwan-ai-basic-act-semiconductor-factory-governance': ['company-setup'],
  'taiwan-employee-stock-award-tax-deferral-industrial-innovation-act-19-1': ['talent-labor-noncompete'],
  'taiwan-semiconductor-environmental-compliance-wastewater-judgments': ['company-setup'],
  'taiwan-semiconductor-export-control-entity-list-2025': ['export-control'],
  'taiwan-semiconductor-foreign-talent-recruitment-law': ['talent-labor-noncompete'],
  'taiwan-ic-design-cross-border-patent-licensing-disputes': ['ip-patent'],
  'taiwan-engineer-job-change-trade-secret-national-security-judgments': [
    'trade-secrets',
    'talent-labor-noncompete',
  ],
  'taiwan-semiconductor-overseas-fab-core-key-technology-review': ['export-control', 'company-setup'],
  'taiwan-semiconductor-employees-overseas-assignment-labor-law': ['talent-labor-noncompete'],
  'us-buyer-taiwan-ai-chip-startup-investment-approval-closing': ['company-setup'],
  'us-ai-chip-taiwan-packaging-capacity-prepayment-refund': ['contract-payment', 'tsmc-supply-chain'],
  'taiwan-zero-recruitment-fee-forced-labor-rules-us-chip-supply-chain': ['talent-labor-noncompete', 'tsmc-supply-chain'],
  'us-equipment-vendor-field-engineers-taiwan-labor-law': ['talent-labor-noncompete'],
  'us-taiwan-double-taxation-semiconductor-expansion': ['company-setup'],
  'taiwan-trade-secrets-act-civil-remedies-injunctions-us-tech': ['trade-secrets'],
  'taiwan-export-controls-shtc-entity-list-us-ear-compliance': ['export-control'],
  'tsmc-arizona-chips-act-taiwan-outbound-approval': ['tsmc-supply-chain', 'export-control'],
  'micron-taiwan-trade-secret-cases-lessons-for-us-companies': ['trade-secrets', 'talent-labor-noncompete'],
  'taiwan-semiconductor-equipment-order-cancellation-costs-japanese': ['contract-payment'],
  'taiwan-ai-poc-additional-testing-commercial-order-japanese': ['contract-payment'],
  'taiwan-renewable-obligation-new-plants-energy-act-bill-japanese-makers': ['company-setup'],
  'taiwan-origin-declaration-us-bound-exports-japanese-trading-companies': ['export-control'],
  'taiwan-semiconductor-chemicals-environment-permits-japanese': ['company-setup', 'export-control'],
  'japan-taiwan-tax-agreement-semiconductor-expatriates': ['company-setup', 'talent-labor-noncompete'],
  'taiwan-ip-commercial-court-semiconductor-patent-judgments': ['ip-patent'],
  'taiwan-science-park-entry-japanese-semiconductor-companies': ['company-setup'],
  'taiwan-semiconductor-labor-union-collective-bargaining-japanese-subsidiary': ['talent-labor-noncompete'],
  'japanese-equipment-maker-engineers-taiwan-work-permit': ['talent-labor-noncompete'],
  'japanese-materials-supplier-taiwan-nda-trade-secrets': ['trade-secrets', 'contract-payment'],
  'tsmc-kumamoto-jasm-taiwan-outbound-investment-rules': ['tsmc-supply-chain', 'export-control'],
  'taiwan-semiconductor-market-entry': ['company-setup'],
};

export function resolveSemiconductorSubtopics(slug: string): readonly SemiconductorBoardSubtopic[] {
  return SEMICONDUCTOR_SLUG_SUBTOPICS[slug] ?? [];
}

export function slugMatchesSemiconductorSubtopic(
  slug: string,
  subtopic: SemiconductorBoardSubtopic | null,
): boolean {
  if (!subtopic) return true;
  return resolveSemiconductorSubtopics(slug).includes(subtopic);
}
