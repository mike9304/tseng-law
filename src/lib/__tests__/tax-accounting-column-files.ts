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
    '325-taiwan-representative-office-tax-what-it-may-do.md',
  ] as string[],
  ja: [
    '301-taiwan-subsidiary-corporate-income-tax-calendar.md',
    '302-taiwan-dividend-withholding-foreign-parent-tax-agreement-rates.md',
    '303-taiwan-withholding-tax-payments-to-foreign-companies.md',
    '304-taiwan-transfer-pricing-documentation-thresholds.md',
    '305-taiwan-cpa-audit-tax-certification-bookkeeping.md',
    '321-taiwan-business-tax-vat-e-invoice-foreign-subsidiary.md',
    '325-taiwan-representative-office-tax-what-it-may-do.md',
  ] as string[],
  en: [
    '301-taiwan-subsidiary-corporate-income-tax-calendar.md',
    '302-taiwan-dividend-withholding-foreign-parent-tax-agreement-rates.md',
    '303-taiwan-withholding-tax-payments-to-foreign-companies.md',
    '304-taiwan-transfer-pricing-documentation-thresholds.md',
    '305-taiwan-cpa-audit-tax-certification-bookkeeping.md',
    '306-vietnamese-companies-taiwan-vietnam-tax-agreement.md',
    '321-taiwan-business-tax-vat-e-invoice-foreign-subsidiary.md',
    '325-taiwan-representative-office-tax-what-it-may-do.md',
  ] as string[],
  'zh-hant': [
    '301-taiwan-subsidiary-corporate-income-tax-calendar.md',
    '302-taiwan-dividend-withholding-foreign-parent-tax-agreement-rates.md',
    '303-taiwan-withholding-tax-payments-to-foreign-companies.md',
    '304-taiwan-transfer-pricing-documentation-thresholds.md',
    '305-taiwan-cpa-audit-tax-certification-bookkeeping.md',
    '306-vietnamese-companies-taiwan-vietnam-tax-agreement.md',
    '321-taiwan-business-tax-vat-e-invoice-foreign-subsidiary.md',
    '325-taiwan-representative-office-tax-what-it-may-do.md',
  ] as string[],
} as const;

/** Publication date of a tax-board column by its file number (all 2026-10-06 so far). */
export function taxAccountingPublicationDate(prefix: string): string | undefined {
  const files = Object.values(TAX_ACCOUNTING_COLUMN_FILES).flat();
  return files.some((file) => file.startsWith(`${prefix}-`)) ? '2026-10-06' : undefined;
}
