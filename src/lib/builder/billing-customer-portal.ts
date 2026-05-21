import {
  listBillingDocuments,
  type BillingDocumentSource,
  type BillingDocumentStatus,
  type BillingDocumentPaymentLinkStatus,
  type BillingDocumentPaymentReconciliationStatus,
  type BillingDocumentShareStatus,
} from '@/lib/builder/billing-documents';
import type { Locale } from '@/lib/locales';

/**
 * Customer-facing safe DTO of a billing document.
 *
 * Intentionally omits internal admin/payment-provider fields:
 *  - `paymentReferenceId`
 *  - `paymentLinkId`
 *  - `paymentLinkRevokedByPaymentId`
 *  - `paymentLinkEvents` (audit history)
 *  - `paymentLinkRevokedBalanceDue`
 *  - the admin `downloadPath` (admin-only API; customers download via
 *    the token-authenticated share link path)
 *  - any audit/notes that may contain admin-only context
 *
 * Keeps token-authenticated public URLs (`paymentLinkPath`, `sharePath`) and
 * money/state labels suitable for member display.
 */
export interface CustomerBillingDocumentDto {
  source: BillingDocumentSource;
  documentId: string;
  number: string;
  type: 'invoice' | 'receipt';
  typeLabel: string;
  status: BillingDocumentStatus;
  statusLabel: string;
  locale: Locale;
  currency: string;
  totalLabel: string;
  refundedLabel: string;
  balanceDueLabel: string;
  balanceDue: number;
  recipientEmail: string;
  customerLabel: string;
  contextLabel: string;
  ownerLabel: string;
  issuedAt: string;
  emailedAt?: string;
  voidedAt?: string;
  supersededByDocumentId?: string;
  shareStatus: BillingDocumentShareStatus;
  paymentLinkStatus: BillingDocumentPaymentLinkStatus;
  paymentLinkStatusLabel: string;
  paymentReconciliationStatus: BillingDocumentPaymentReconciliationStatus;
  paymentReconciliationStatusLabel: string;
  paymentLinkRenewalNeeded: boolean;
  sharePath: string;
  paymentLinkPath: string;
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Return all billing documents whose `recipientEmail` matches the given
 * member email (case-insensitive). Results are filtered to current,
 * paid, voided, and superseded statuses — visible by intent, but with
 * internal IDs stripped.
 */
export async function listCustomerBillingDocuments(
  email: string,
  options: { locale?: Locale } = {},
): Promise<CustomerBillingDocumentDto[]> {
  const target = normalizeEmail(email);
  if (!target) return [];
  const rows = await listBillingDocuments({ locale: options.locale });
  return rows
    .filter((row) => normalizeEmail(row.recipientEmail) === target)
    .map((row) => ({
      source: row.source,
      documentId: row.documentId,
      number: row.number,
      type: row.type,
      typeLabel: row.typeLabel,
      status: row.status,
      statusLabel: row.statusLabel,
      locale: row.locale,
      currency: row.currency,
      totalLabel: row.totalLabel,
      refundedLabel: row.refundedLabel,
      balanceDueLabel: row.balanceDueLabel,
      balanceDue: row.balanceDue,
      recipientEmail: row.recipientEmail,
      customerLabel: row.customerLabel,
      contextLabel: row.contextLabel,
      ownerLabel: row.ownerLabel,
      issuedAt: row.issuedAt,
      emailedAt: row.emailedAt,
      voidedAt: row.voidedAt,
      supersededByDocumentId: row.supersededByDocumentId,
      shareStatus: row.shareStatus,
      paymentLinkStatus: row.paymentLinkStatus,
      paymentLinkStatusLabel: row.paymentLinkStatusLabel,
      paymentReconciliationStatus: row.paymentReconciliationStatus,
      paymentReconciliationStatusLabel: row.paymentReconciliationStatusLabel,
      paymentLinkRenewalNeeded: row.paymentLinkRenewalNeeded,
      sharePath: row.sharePath,
      paymentLinkPath: row.paymentLinkPath,
    }));
}

/**
 * Convenience: partition documents by status so the UI can group unpaid
 * invoices separately from paid receipts. Voided/superseded land in
 * `archived`.
 */
export function partitionCustomerBillingDocuments(documents: CustomerBillingDocumentDto[]): {
  unpaidInvoices: CustomerBillingDocumentDto[];
  paidReceipts: CustomerBillingDocumentDto[];
  archived: CustomerBillingDocumentDto[];
} {
  const unpaidInvoices: CustomerBillingDocumentDto[] = [];
  const paidReceipts: CustomerBillingDocumentDto[] = [];
  const archived: CustomerBillingDocumentDto[] = [];
  for (const document of documents) {
    if (document.status === 'voided' || document.status === 'superseded') {
      archived.push(document);
      continue;
    }
    if (document.type === 'invoice' && document.balanceDue > 0) {
      unpaidInvoices.push(document);
      continue;
    }
    paidReceipts.push(document);
  }
  return { unpaidInvoices, paidReceipts, archived };
}