/**
 * Column files written for the tax & accounting board (/{locale}/tax-accounting),
 * tagged `tax-accounting`. Kept apart from the weekday batch registries so the
 * board lane and the column lanes do not edit the same list.
 */
export const TAX_ACCOUNTING_COLUMN_FILES = {
  ko: [
    '301-taiwan-subsidiary-corporate-income-tax-calendar.md',
    '302-taiwan-dividend-withholding-foreign-parent-tax-agreement-rates.md',
    '303-taiwan-withholding-tax-payments-to-foreign-companies.md',
    '304-taiwan-transfer-pricing-documentation-thresholds.md',
    '305-taiwan-cpa-audit-tax-certification-bookkeeping.md',
    '321-taiwan-business-tax-vat-e-invoice-foreign-subsidiary.md',
    '322-taiwan-payroll-foreign-employees-withholding-social-insurance.md',
    '323-taiwan-branch-tax-head-office-expense-allocation.md',
    '324-taiwan-industrial-innovation-act-rd-investment-tax-credits.md',
    '325-taiwan-representative-office-tax-what-it-may-do.md',
    '341-taiwan-tax-audit-reexamination-appeal-deadlines.md',
    '343-closing-taiwan-subsidiary-branch-liquidation-tax-filings.md',
  ] as string[],
  ja: [
    '301-taiwan-subsidiary-corporate-income-tax-calendar.md',
    '302-taiwan-dividend-withholding-foreign-parent-tax-agreement-rates.md',
    '303-taiwan-withholding-tax-payments-to-foreign-companies.md',
    '304-taiwan-transfer-pricing-documentation-thresholds.md',
    '305-taiwan-cpa-audit-tax-certification-bookkeeping.md',
    '321-taiwan-business-tax-vat-e-invoice-foreign-subsidiary.md',
    '322-taiwan-payroll-foreign-employees-withholding-social-insurance.md',
    '323-taiwan-branch-tax-head-office-expense-allocation.md',
    '324-taiwan-industrial-innovation-act-rd-investment-tax-credits.md',
    '325-taiwan-representative-office-tax-what-it-may-do.md',
    '341-taiwan-tax-audit-reexamination-appeal-deadlines.md',
    '343-closing-taiwan-subsidiary-branch-liquidation-tax-filings.md',
  ] as string[],
  en: [
    '301-taiwan-subsidiary-corporate-income-tax-calendar.md',
    '302-taiwan-dividend-withholding-foreign-parent-tax-agreement-rates.md',
    '303-taiwan-withholding-tax-payments-to-foreign-companies.md',
    '304-taiwan-transfer-pricing-documentation-thresholds.md',
    '305-taiwan-cpa-audit-tax-certification-bookkeeping.md',
    '306-vietnamese-companies-taiwan-vietnam-tax-agreement.md',
    '321-taiwan-business-tax-vat-e-invoice-foreign-subsidiary.md',
    '322-taiwan-payroll-foreign-employees-withholding-social-insurance.md',
    '323-taiwan-branch-tax-head-office-expense-allocation.md',
    '324-taiwan-industrial-innovation-act-rd-investment-tax-credits.md',
    '325-taiwan-representative-office-tax-what-it-may-do.md',
    '341-taiwan-tax-audit-reexamination-appeal-deadlines.md',
    '343-closing-taiwan-subsidiary-branch-liquidation-tax-filings.md',
  ] as string[],
  'zh-hant': [
    '301-taiwan-subsidiary-corporate-income-tax-calendar.md',
    '302-taiwan-dividend-withholding-foreign-parent-tax-agreement-rates.md',
    '303-taiwan-withholding-tax-payments-to-foreign-companies.md',
    '304-taiwan-transfer-pricing-documentation-thresholds.md',
    '305-taiwan-cpa-audit-tax-certification-bookkeeping.md',
    '306-vietnamese-companies-taiwan-vietnam-tax-agreement.md',
    '321-taiwan-business-tax-vat-e-invoice-foreign-subsidiary.md',
    '322-taiwan-payroll-foreign-employees-withholding-social-insurance.md',
    '323-taiwan-branch-tax-head-office-expense-allocation.md',
    '324-taiwan-industrial-innovation-act-rd-investment-tax-credits.md',
    '325-taiwan-representative-office-tax-what-it-may-do.md',
    '341-taiwan-tax-audit-reexamination-appeal-deadlines.md',
    '343-closing-taiwan-subsidiary-branch-liquidation-tax-filings.md',
  ] as string[],
} as const;

/** Board columns published after 2026-10-06, by file-number prefix; every other board file is 2026-10-06. */
const LATER_PUBLICATION_DATES: Readonly<Record<string, string>> = {
  '342': '2026-10-07',
  '344': '2026-10-07',
  '345': '2026-10-07',
};

/** Publication date of a tax-board column by its file number. */
export function taxAccountingPublicationDate(prefix: string): string | undefined {
  const files = Object.values(TAX_ACCOUNTING_COLUMN_FILES).flat();
  if (!files.some((file) => file.startsWith(`${prefix}-`))) return undefined;
  return LATER_PUBLICATION_DATES[prefix] ?? '2026-10-06';
}

/** The board files of each locale that were published on `date`. */
export function taxAccountingFilesPublishedOn(date: string): Partial<Record<string, readonly string[]>> {
  return Object.fromEntries(
    Object.entries(TAX_ACCOUNTING_COLUMN_FILES).map(([locale, files]) => [
      locale,
      files.filter((file) => taxAccountingPublicationDate(file.slice(0, 3)) === date),
    ]),
  );
}
