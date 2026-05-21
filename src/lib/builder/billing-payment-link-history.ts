import { createHash } from 'node:crypto';

export type BillingPaymentLinkHistoryReason = 'admin_revoked' | 'balance_changed' | 'document_voided' | 'document_superseded';
export type BillingPaymentLinkHistoryType = 'created' | 'renewed' | 'revoked';
export type BillingPaymentLinkHistoryActor = 'admin' | 'system';

export interface BillingPaymentLinkHistoryEntry {
  eventId: string;
  type: BillingPaymentLinkHistoryType;
  actor: BillingPaymentLinkHistoryActor;
  createdAt: string;
  paymentLinkId?: string;
  expiresAt?: string;
  reason?: BillingPaymentLinkHistoryReason;
  balanceDue?: number;
  paymentId?: string;
}

function historyEventId(input: Omit<BillingPaymentLinkHistoryEntry, 'eventId'>): string {
  return `ple_${createHash('sha256')
    .update([
      input.type,
      input.actor,
      input.createdAt,
      input.paymentLinkId ?? '',
      input.reason ?? '',
      input.balanceDue ?? '',
      input.paymentId ?? '',
    ].join(':'))
    .digest('hex')
    .slice(0, 24)}`;
}

export function appendPaymentLinkHistory<T extends { paymentLinkEvents?: BillingPaymentLinkHistoryEntry[] }>(
  document: T,
  input: Omit<BillingPaymentLinkHistoryEntry, 'eventId'> & { eventId?: string },
): T {
  const entry: BillingPaymentLinkHistoryEntry = {
    ...input,
    eventId: input.eventId ?? historyEventId(input),
  };
  const events = document.paymentLinkEvents ?? [];
  if (events.some((event) => event.eventId === entry.eventId)) return document;
  return {
    ...document,
    paymentLinkEvents: [...events, entry].slice(-25),
  };
}
