import {
  getBillingDocument,
  listBillingDocuments,
  voidBuilderBillingDocument,
  type BillingDocumentSource,
  type BuilderBillingDocumentRow,
} from '@/lib/builder/billing-documents';
import { issueOrderDocument, loadOrder } from '@/lib/builder/commerce/orders-engine';
import { issueBookingBillingDocument, BookingBillingDocumentError } from '@/lib/builder/bookings/billing-documents';
import type { Locale } from '@/lib/locales';

/**
 * Shape passed to bulk APIs. Each entry identifies a billing document by
 * its owning source and ids. The wire-level POST body can also accept
 * a `string[]` of `source:ownerId:documentId` triples which we normalize
 * via {@link parseBulkDocumentIds}.
 */
export interface BulkBillingDocumentTarget {
  source: BillingDocumentSource;
  ownerId: string;
  /** Optional for invoice issuance (we issue against the owner, not an existing doc). */
  documentId?: string;
}

export interface BulkBillingDocumentIssueTarget {
  source: BillingDocumentSource;
  ownerId: string;
}

export interface BulkSkipEntry {
  target: BulkBillingDocumentTarget;
  reason: string;
  row?: BuilderBillingDocumentRow;
}

export interface BulkErrorEntry {
  target: BulkBillingDocumentTarget;
  error: string;
}

export interface BulkIssueInvoicesResult {
  issued: BuilderBillingDocumentRow[];
  skipped: BulkSkipEntry[];
  errors: BulkErrorEntry[];
}

export interface BulkVoidDocumentsResult {
  voided: BuilderBillingDocumentRow[];
  skipped: BulkSkipEntry[];
  errors: BulkErrorEntry[];
}

/** Mirror of {@link listBillingDocuments} options, named for the spec. */
export interface BillingDocumentFilter {
  locale?: Locale;
  source?: BillingDocumentSource | 'all';
  q?: string;
}

export interface BulkIssueInvoicesOptions {
  actor?: 'admin' | 'system';
  notes?: string;
}

/**
 * Parse `source:ownerId:documentId` triples or already-structured objects
 * into {@link BulkBillingDocumentTarget}. Invalid entries are dropped — the
 * caller can still validate the resulting length against input.
 */
export function parseBulkDocumentIds(
  input: Array<string | BulkBillingDocumentTarget> | null | undefined,
): BulkBillingDocumentTarget[] {
  if (!Array.isArray(input)) return [];
  const result: BulkBillingDocumentTarget[] = [];
  for (const entry of input) {
    if (entry && typeof entry === 'object' && 'source' in entry && 'ownerId' in entry) {
      if ((entry.source === 'order' || entry.source === 'booking') && typeof entry.ownerId === 'string' && entry.ownerId) {
        result.push({
          source: entry.source,
          ownerId: entry.ownerId,
          documentId: typeof entry.documentId === 'string' ? entry.documentId : undefined,
        });
      }
      continue;
    }
    if (typeof entry !== 'string') continue;
    const parts = entry.split(':');
    if (parts.length < 2) continue;
    const [source, ownerId, ...rest] = parts;
    if (source !== 'order' && source !== 'booking') continue;
    if (!ownerId) continue;
    result.push({
      source,
      ownerId,
      documentId: rest.length > 0 ? rest.join(':') : undefined,
    });
  }
  return result;
}

async function bulkIssueOrderInvoice(
  ownerId: string,
  options: BulkIssueInvoicesOptions,
): Promise<{ row?: BuilderBillingDocumentRow; skipped?: string; error?: string }> {
  const order = await loadOrder(ownerId);
  if (!order) return { error: 'order_not_found' };
  const result = await issueOrderDocument(ownerId, {
    type: 'invoice',
    actor: options.actor ?? 'admin',
    notes: options.notes,
  });
  if (result.error) return { error: result.error };
  if (!result.document) return { error: 'document_not_issued' };
  if (!result.created) {
    const row = await getBillingDocument('order', ownerId, result.document.documentId);
    return { row: row ?? undefined, skipped: 'invoice_already_issued' };
  }
  const row = await getBillingDocument('order', ownerId, result.document.documentId);
  if (!row) return { error: 'document_lookup_failed' };
  return { row };
}

async function bulkIssueBookingInvoice(
  ownerId: string,
  options: BulkIssueInvoicesOptions,
): Promise<{ row?: BuilderBillingDocumentRow; skipped?: string; error?: string }> {
  try {
    const result = await issueBookingBillingDocument(ownerId, {
      type: 'invoice',
      actor: options.actor ?? 'admin',
      notes: options.notes,
    });
    const row = await getBillingDocument('booking', ownerId, result.document.documentId);
    if (!row) return { error: 'document_lookup_failed' };
    if (result.reused) return { row, skipped: 'invoice_already_issued' };
    return { row };
  } catch (error) {
    if (error instanceof BookingBillingDocumentError) return { error: error.code };
    throw error;
  }
}

/**
 * Issue an invoice for each provided order/booking. Documents that already
 * exist for the current snapshot are reported in `skipped` (carrying the
 * existing row); only newly issued documents are added to `issued`.
 */
export async function bulkIssueInvoicesForOrders(
  targets: Array<BulkBillingDocumentIssueTarget | string>,
  options: BulkIssueInvoicesOptions = {},
): Promise<BulkIssueInvoicesResult> {
  const normalized = parseBulkDocumentIds(targets as Array<string | BulkBillingDocumentTarget>);
  const issued: BuilderBillingDocumentRow[] = [];
  const skipped: BulkSkipEntry[] = [];
  const errors: BulkErrorEntry[] = [];

  for (const target of normalized) {
    try {
      const outcome = target.source === 'order'
        ? await bulkIssueOrderInvoice(target.ownerId, options)
        : await bulkIssueBookingInvoice(target.ownerId, options);
      if (outcome.error) {
        errors.push({ target, error: outcome.error });
        continue;
      }
      if (outcome.skipped) {
        skipped.push({ target, reason: outcome.skipped, row: outcome.row });
        continue;
      }
      if (outcome.row) issued.push(outcome.row);
    } catch (error) {
      errors.push({ target, error: error instanceof Error ? error.message : 'unknown_error' });
    }
  }

  return { issued, skipped, errors };
}

/**
 * Void each document. Already-voided/superseded documents are reported in
 * `skipped` (with the existing row when retrievable).
 */
export async function bulkVoidDocuments(
  targets: Array<BulkBillingDocumentTarget | string>,
  reason: string,
): Promise<BulkVoidDocumentsResult> {
  const trimmedReason = reason.trim();
  const normalized = parseBulkDocumentIds(targets);
  const voided: BuilderBillingDocumentRow[] = [];
  const skipped: BulkSkipEntry[] = [];
  const errors: BulkErrorEntry[] = [];

  for (const target of normalized) {
    if (!target.documentId) {
      errors.push({ target, error: 'document_id_missing' });
      continue;
    }
    try {
      const existing = await getBillingDocument(target.source, target.ownerId, target.documentId);
      if (!existing) {
        errors.push({ target, error: 'document_not_found' });
        continue;
      }
      if (existing.status === 'voided' || existing.status === 'superseded') {
        skipped.push({ target, reason: `already_${existing.status}`, row: existing });
        continue;
      }
      const result = await voidBuilderBillingDocument(target.source, target.ownerId, target.documentId, {
        reason: trimmedReason || undefined,
      });
      if (!result) {
        errors.push({ target, error: 'document_lifecycle_unavailable' });
        continue;
      }
      voided.push(result);
    } catch (error) {
      errors.push({ target, error: error instanceof Error ? error.message : 'unknown_error' });
    }
  }

  return { voided, skipped, errors };
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str === '') return '';
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function csvRow(values: Array<unknown>): string {
  return values.map(csvEscape).join(',');
}

const CSV_COLUMNS = [
  'source',
  'ownerId',
  'ownerLabel',
  'documentId',
  'number',
  'type',
  'status',
  'locale',
  'currency',
  'totalAmount',
  'refundedAmount',
  'balanceDue',
  'recipientEmail',
  'recipientName',
  'customerLabel',
  'issuedAt',
  'emailedAt',
  'voidedAt',
  'voidReason',
  'supersedesDocumentId',
  'supersededByDocumentId',
  'shareStatus',
  'paymentStatus',
  'paymentLinkStatus',
  'paymentReconciliationStatus',
  'viewCount',
  'downloadCount',
  'notes',
] as const;

/**
 * Build an RFC-4180 CSV export of every row matching the filter.
 * Fields containing commas, quotes, or newlines are quoted and have internal
 * quotes doubled.
 */
export async function bulkExportCsv(filter: BillingDocumentFilter = {}): Promise<string> {
  const rows = await listBillingDocuments({
    locale: filter.locale,
    q: filter.q,
    source: filter.source ?? 'all',
  });
  const lines = [csvRow([...CSV_COLUMNS])];
  for (const row of rows) {
    lines.push(csvRow([
      row.source,
      row.ownerId,
      row.ownerLabel,
      row.documentId,
      row.number,
      row.type,
      row.status,
      row.locale,
      row.currency,
      row.totalAmount,
      row.refundedAmount,
      row.balanceDue,
      row.recipientEmail,
      row.recipientName ?? '',
      row.customerLabel,
      row.issuedAt,
      row.emailedAt ?? '',
      row.voidedAt ?? '',
      row.voidReason ?? '',
      row.supersedesDocumentId ?? '',
      row.supersededByDocumentId ?? '',
      row.shareStatus,
      row.paymentStatus ?? '',
      row.paymentLinkStatus,
      row.paymentReconciliationStatus,
      row.viewCount,
      row.downloadCount,
      row.notes ?? '',
    ]));
  }
  return `${lines.join('\r\n')}\r\n`;
}

/**
 * Internal helper exposed for tests/UI: list candidate targets matching a
 * filter. Returns the minimal triples the bulk APIs accept.
 */
export async function listBulkDocumentTargets(
  filter: BillingDocumentFilter = {},
): Promise<BulkBillingDocumentTarget[]> {
  const rows = await listBillingDocuments({
    locale: filter.locale,
    q: filter.q,
    source: filter.source ?? 'all',
  });
  return rows.map((row) => ({
    source: row.source,
    ownerId: row.ownerId,
    documentId: row.documentId,
  }));
}

export type { BillingDocumentSource } from '@/lib/builder/billing-documents';