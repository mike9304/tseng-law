'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import type {
  BillingDocumentSource,
  BillingDocumentStatus,
  BillingDocumentType,
  BuilderBillingDocumentRow,
} from '@/lib/builder/billing-documents';
import type { BillingDocumentAutomationSettings } from '@/lib/builder/billing-document-automation';
import type { BillingDocumentWebhookEvent } from '@/lib/builder/billing-document-webhooks';
import styles from './BillingDocuments.module.css';

type SourceFilter = BillingDocumentSource | 'all';
type TypeFilter = BillingDocumentType | 'all';
type StatusFilter = BillingDocumentStatus | 'all';
type ManualPaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'other';
type ManualPaymentStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';

interface BillingDocumentsClientProps {
  locale: Locale;
  siteTitle: string;
  initialDocuments: BuilderBillingDocumentRow[];
  initialAutomationSettings: BillingDocumentAutomationSettings;
  initialWebhookEvents?: BillingDocumentWebhookEvent[];
  initialSource?: SourceFilter;
}

type AutomationTarget = 'orders' | 'bookings';
type AutomationRule = 'invoiceOnCreate' | 'receiptOnPaid';
type ManualInstructionField = 'enabled' | 'title' | 'instructions';
type ManualPaymentDraft = {
  amount: string;
  idempotencyKey: string;
  method: ManualPaymentMethod;
  status: ManualPaymentStatus;
  reference: string;
  note: string;
};
type BillingPaymentAnalyticsBucket = {
  currency: string;
  collected: number;
  balanceDue: number;
  refunded: number;
};
type BillingPaymentAnalytics = {
  buckets: BillingPaymentAnalyticsBucket[];
  collectedLabel: string;
  balanceDueLabel: string;
  refundedLabel: string;
  activePayLinks: number;
  manualPending: number;
  needsReview: number;
  failedWebhooks: number;
  attentionRows: Array<{ key: string; label: string; detail: string }>;
};
const manualPaymentMethods: ManualPaymentMethod[] = ['bank_transfer', 'cash', 'check', 'other'];

function documentKey(document: Pick<BuilderBillingDocumentRow, 'documentId' | 'source'>): string {
  return `${document.source}:${document.documentId}`;
}

function documentWebhookKey(document: Pick<BuilderBillingDocumentRow, 'documentId' | 'ownerId' | 'source'>): string {
  return `${document.source}:${document.ownerId}:${document.documentId}`;
}

function amountInputDivisor(currency: string): number {
  return currency === 'KRW' || currency === 'JPY' ? 1 : 100;
}

function defaultManualPaymentDraft(document: BuilderBillingDocumentRow): ManualPaymentDraft {
  const divisor = amountInputDivisor(document.currency);
  const idempotencyKey = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${document.source}-${document.documentId}-${Date.now()}`;
  return {
    amount: document.balanceDue > 0 ? (document.balanceDue / divisor).toFixed(divisor === 1 ? 0 : 2) : '',
    idempotencyKey,
    method: 'bank_transfer',
    status: 'succeeded',
    reference: '',
    note: '',
  };
}

function manualPaymentMethodLabel(method: ManualPaymentMethod): string {
  switch (method) {
    case 'bank_transfer':
      return 'Bank transfer';
    case 'cash':
      return 'Cash';
    case 'check':
      return 'Check';
    case 'other':
    default:
      return 'Other';
  }
}

function manualPaymentStatusLabel(status: ManualPaymentStatus): string {
  switch (status) {
    case 'succeeded':
      return 'Succeeded - counts as paid';
    case 'pending':
      return 'Pending - awaiting confirmation';
    case 'failed':
      return 'Failed - not paid';
    case 'canceled':
    default:
      return 'Canceled - not paid';
  }
}

function manualPaymentAmountCents(currency: string, amount: string): number {
  return Math.round(Number(amount) * amountInputDivisor(currency));
}

function formatMinorMoney(locale: Locale, currency: string, amount: number): string {
  return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : locale === 'zh-hant' ? 'zh-TW' : 'en-US', {
    currency,
    maximumFractionDigits: amountInputDivisor(currency) === 1 ? 0 : 2,
    style: 'currency',
  }).format(amount / amountInputDivisor(currency));
}

function bucketLabel(locale: Locale, buckets: BillingPaymentAnalyticsBucket[], field: keyof Omit<BillingPaymentAnalyticsBucket, 'currency'>): string {
  if (!buckets.length) return '-';
  const primary = buckets[0];
  const suffix = buckets.length > 1 ? ` +${buckets.length - 1}` : '';
  return `${formatMinorMoney(locale, primary.currency, primary[field])}${suffix}`;
}

function canRecordManualPayment(document: BuilderBillingDocumentRow): boolean {
  const isCurrent = document.status === 'issued' || document.status === 'emailed_stub';
  if (!isCurrent || document.type !== 'invoice' || document.balanceDue <= 0) return false;
  if (document.source === 'order') {
    return document.paymentStatus === 'requires_manual_payment' || document.paymentStatus === 'partially_paid';
  }
  return document.paymentStatus !== 'paid'
    && document.paymentStatus !== 'refunded'
    && document.paymentStatus !== 'partial-refund';
}

type PaymentLinkDisplayState = BuilderBillingDocumentRow['paymentLinkStatus'] | 'stale' | 'closed';

function paymentLinkDisplayState(document: BuilderBillingDocumentRow): PaymentLinkDisplayState {
  if (document.paymentReconciliationStatus === 'renew_required') return 'stale';
  if (document.paymentReconciliationStatus === 'settled' && (document.paymentLinkCreatedAt || document.paymentLinkRevokedAt)) return 'closed';
  return document.paymentLinkStatus;
}

function paymentLinkDisplayLabel(document: BuilderBillingDocumentRow, state: PaymentLinkDisplayState): string {
  if (state === 'stale') return 'Pay link needs renewal · balance changed';
  if (state === 'closed') return 'Pay link closed · balance paid';
  return `${document.paymentLinkStatusLabel}${document.paymentLinkExpiresAt ? ` · expires ${new Date(document.paymentLinkExpiresAt).toLocaleDateString()}` : ''}`;
}

function paymentLinkEventLabel(event: BuilderBillingDocumentRow['paymentLinkEvents'][number]): string {
  if (event.type === 'created') return 'Pay link created';
  if (event.type === 'renewed') return 'Pay link renewed';
  if (event.reason === 'balance_changed') return 'Pay link stale after payment';
  if (event.reason === 'document_voided') return 'Pay link closed by void';
  if (event.reason === 'document_superseded') return 'Pay link closed by supersede';
  return 'Pay link revoked';
}

function paymentLinkEventDetail(event: BuilderBillingDocumentRow['paymentLinkEvents'][number]): string {
  const parts = [new Date(event.createdAt).toLocaleString()];
  if (event.expiresAt) parts.push(`expires ${new Date(event.expiresAt).toLocaleDateString()}`);
  if (event.balanceDueLabel) parts.push(`due ${event.balanceDueLabel}`);
  if (event.paymentId) parts.push(`payment ${event.paymentId}`);
  if (event.actor === 'system') parts.push('system');
  return parts.join(' · ');
}

function webhookStatusLabel(event: BillingDocumentWebhookEvent): string {
  if (event.status === 'processed') return event.changed ? 'Webhook processed' : 'Webhook processed · no change';
  if (event.status === 'ignored') return 'Webhook ignored';
  return 'Webhook failed';
}

function compactWebhookId(id: string): string {
  return id.length <= 20 ? id : `${id.slice(0, 10)}...${id.slice(-6)}`;
}

function webhookEventDetail(event: BillingDocumentWebhookEvent): string {
  const divisor = amountInputDivisor(event.currency);
  const amount = (event.amount / divisor).toLocaleString(undefined, {
    maximumFractionDigits: divisor === 1 ? 0 : 2,
    minimumFractionDigits: divisor === 1 ? 0 : 2,
  });
  const parts = [
    new Date(event.receivedAt).toLocaleString(),
    event.eventType,
    event.paymentStatus,
    compactWebhookId(event.providerEventId),
    `${event.currency} ${amount}`,
  ];
  if (event.providerPaymentId) parts.push(event.providerPaymentId);
  if (event.paymentLinkId) parts.push(`link ${compactWebhookId(event.paymentLinkId)}`);
  if (event.replayCount > 0) parts.push(`replayed ${event.replayCount}`);
  if (event.error) parts.push(event.error);
  return parts.map((part) => (part.startsWith('pi_') || part.startsWith('cs_') ? compactWebhookId(part) : part)).join(' · ');
}

function webhookSummaryLabel(events: BillingDocumentWebhookEvent[]): string {
  if (!events.length) return 'No hosted webhooks';
  const failed = events.filter((event) => event.status === 'failed').length;
  const ignored = events.filter((event) => event.status === 'ignored').length;
  const processed = events.filter((event) => event.status === 'processed').length;
  if (failed) return `Webhook failed · ${failed}/${events.length}`;
  if (ignored) return `Webhook ignored · ${ignored}/${events.length}`;
  return `Webhook processed · ${processed}/${events.length}`;
}

function documentCsv(documents: BuilderBillingDocumentRow[]): string {
  const rows = [
    ['source', 'sourceId', 'documentNumber', 'type', 'status', 'paymentStatus', 'paymentLinkStatus', 'paymentReconciliationStatus', 'customer', 'email', 'total', 'refunded', 'balanceDue', 'currency', 'issuedAt', 'shareStatus', 'shareExpiresAt', 'voidedAt', 'voidReason', 'supersedesDocumentId', 'supersededByDocumentId', 'viewCount', 'downloadCount'],
    ...documents.map((document) => [
      document.source,
      document.ownerId,
      document.number,
      document.type,
      document.status,
      document.paymentStatus ?? '',
      document.paymentLinkStatus,
      document.paymentReconciliationStatus,
      document.customerLabel,
      document.recipientEmail,
      document.totalLabel,
      document.refundedLabel,
      document.balanceDueLabel,
      document.currency,
      document.issuedAt,
      document.shareStatus,
      document.shareLinkExpiresAt ?? '',
      document.voidedAt ?? '',
      document.voidReason ?? '',
      document.supersedesDocumentId ?? '',
      document.supersededByDocumentId ?? '',
      document.viewCount,
      document.downloadCount,
    ]),
  ];
  return rows.map((row) => row.map((value) => {
    const text = String(value ?? '');
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }).join(',')).join('\n');
}

export default function BillingDocumentsClient({
  locale,
  siteTitle,
  initialDocuments,
  initialAutomationSettings,
  initialWebhookEvents = [],
  initialSource = 'all',
}: BillingDocumentsClientProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [webhookEvents, setWebhookEvents] = useState(initialWebhookEvents);
  const [automationSettings, setAutomationSettings] = useState(initialAutomationSettings);
  const [automationDraft, setAutomationDraft] = useState(initialAutomationSettings);
  const [automationNotice, setAutomationNotice] = useState('Automatic issuance policy ready');
  const [savingAutomation, setSavingAutomation] = useState(false);
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<SourceFilter>(initialSource);
  const [type, setType] = useState<TypeFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [notice, setNotice] = useState('Ready');
  const [exportText, setExportText] = useState('');
  const [manualPaymentOpenKey, setManualPaymentOpenKey] = useState('');
  const [manualPaymentBusyKey, setManualPaymentBusyKey] = useState('');
  const [manualPaymentDrafts, setManualPaymentDrafts] = useState<Record<string, ManualPaymentDraft>>({});
  const [activityOpenKey, setActivityOpenKey] = useState('');
  const [webhookBusyId, setWebhookBusyId] = useState('');

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return documents
      .filter((document) => source === 'all' || document.source === source)
      .filter((document) => type === 'all' || document.type === type)
      .filter((document) => status === 'all' || document.status === status)
      .filter((document) => {
        if (!search) return true;
        return [
          document.source,
          document.sourceLabel,
          document.ownerId,
          document.ownerLabel,
          document.documentId,
          document.number,
          document.type,
          document.status,
          document.paymentStatus ?? '',
          document.paymentStatusLabel,
          document.paymentLinkStatus,
          document.paymentLinkStatusLabel,
          document.customerLabel,
          document.recipientEmail,
          document.contextLabel,
          document.notes ?? '',
        ].some((value) => value.toLowerCase().includes(search));
      });
  }, [documents, query, source, status, type]);

  const counts = useMemo(() => ({
    total: documents.length,
    invoices: documents.filter((document) => document.type === 'invoice').length,
    receipts: documents.filter((document) => document.type === 'receipt').length,
    orders: documents.filter((document) => document.source === 'order').length,
    bookings: documents.filter((document) => document.source === 'booking').length,
    emailed: documents.filter((document) => document.status === 'emailed_stub').length,
    shared: documents.filter((document) => document.shareStatus === 'active').length,
  }), [documents]);

  const webhookEventsByDocument = useMemo(() => {
    const map = new Map<string, BillingDocumentWebhookEvent[]>();
    webhookEvents.forEach((event) => {
      const key = `${event.source}:${event.ownerId}:${event.documentId}`;
      map.set(key, [...(map.get(key) ?? []), event]);
    });
    map.forEach((events, key) => {
      map.set(key, events.sort((left, right) => right.receivedAt.localeCompare(left.receivedAt)));
    });
    return map;
  }, [webhookEvents]);

  const unmatchedWebhookEvents = useMemo(() => {
    const documentKeys = new Set(documents.map((document) => documentWebhookKey(document)));
    return webhookEvents
      .filter((event) => !documentKeys.has(`${event.source}:${event.ownerId}:${event.documentId}`))
      .filter((event) => event.status !== 'processed')
      .sort((left, right) => right.receivedAt.localeCompare(left.receivedAt));
  }, [documents, webhookEvents]);

  const paymentAnalytics = useMemo<BillingPaymentAnalytics>(() => {
    const buckets = new Map<string, BillingPaymentAnalyticsBucket>();
    const attentionRows: BillingPaymentAnalytics['attentionRows'] = [];
    let manualPending = 0;
    let activePayLinks = 0;
    let needsReview = unmatchedWebhookEvents.length;
    const failedWebhooks = webhookEvents.filter((event) => event.status === 'failed').length;

    const bucketFor = (currency: string): BillingPaymentAnalyticsBucket => {
      const normalized = currency.trim().toUpperCase() || 'TWD';
      const existing = buckets.get(normalized);
      if (existing) return existing;
      const next = { currency: normalized, collected: 0, balanceDue: 0, refunded: 0 };
      buckets.set(normalized, next);
      return next;
    };

    for (const document of filtered) {
      if (document.status === 'voided' || document.status === 'superseded') continue;
      const bucket = bucketFor(document.currency);
      bucket.refunded += Math.max(0, document.refundedAmount);
      bucket.balanceDue += Math.max(0, document.balanceDue);
      bucket.collected += Math.max(0, document.totalAmount - document.refundedAmount - document.balanceDue);
      if (document.paymentLinkStatus === 'active') activePayLinks += 1;
      if (document.balanceDue > 0 && document.paymentStatus !== 'failed') manualPending += 1;
      const stale = document.paymentReconciliationStatus === 'renew_required' || document.paymentLinkRenewalNeeded;
      const failedPayment = document.paymentStatus === 'failed';
      const documentEvents = webhookEventsByDocument.get(documentWebhookKey(document)) ?? [];
      const documentFailedWebhooks = documentEvents.filter((event) => event.status === 'failed');
      if (stale || failedPayment || documentFailedWebhooks.length > 0) {
        needsReview += 1;
        attentionRows.push({
          key: documentWebhookKey(document),
          label: stale ? 'Stale pay link' : failedPayment ? 'Failed payment' : 'Failed webhook',
          detail: `${document.number} · ${document.sourceLabel} · ${document.paymentReconciliationStatusLabel}`,
        });
      }
    }

    for (const event of unmatchedWebhookEvents.slice(0, 3)) {
      attentionRows.push({
        key: event.eventId,
        label: webhookStatusLabel(event),
        detail: `${event.source} · ${event.paymentStatus} · ${compactWebhookId(event.providerEventId)}`,
      });
    }

    const sortedBuckets = Array.from(buckets.values())
      .sort((left, right) => (right.collected - left.collected) || left.currency.localeCompare(right.currency));

    return {
      buckets: sortedBuckets,
      collectedLabel: bucketLabel(locale, sortedBuckets, 'collected'),
      balanceDueLabel: bucketLabel(locale, sortedBuckets, 'balanceDue'),
      refundedLabel: bucketLabel(locale, sortedBuckets, 'refunded'),
      activePayLinks,
      manualPending,
      needsReview,
      failedWebhooks,
      attentionRows: attentionRows.slice(0, 5),
    };
  }, [filtered, locale, unmatchedWebhookEvents, webhookEvents, webhookEventsByDocument]);

  const automationDirty = useMemo(
    () => JSON.stringify(automationDraft) !== JSON.stringify(automationSettings),
    [automationDraft, automationSettings],
  );

  function replaceDocument(document: BuilderBillingDocumentRow) {
    setDocuments((current) => {
      const exists = current.some((entry) => (
        entry.source === document.source && entry.documentId === document.documentId
      ));
      if (!exists) return [document, ...current];
      return current.map((entry) => (
        entry.source === document.source && entry.documentId === document.documentId ? document : entry
      ));
    });
  }

  async function refreshDocuments() {
    const [response, webhookResponse] = await Promise.all([
      fetch(`/api/builder/billing-documents?locale=${encodeURIComponent(locale)}&source=all`, {
        cache: 'no-store',
      }),
      fetch('/api/builder/billing-documents/webhooks', {
        cache: 'no-store',
      }),
    ]);
    const payload = await response.json().catch(() => ({})) as {
      ok?: boolean;
      documents?: BuilderBillingDocumentRow[];
      error?: string;
    };
    if (!response.ok || !payload.ok || !Array.isArray(payload.documents)) {
      setNotice(payload.error ?? 'Document refresh failed');
      return;
    }
    setDocuments(payload.documents);
    const webhookPayload = await webhookResponse.json().catch(() => ({})) as {
      ok?: boolean;
      events?: BillingDocumentWebhookEvent[];
      error?: string;
    };
    if (webhookResponse.ok && webhookPayload.ok && Array.isArray(webhookPayload.events)) {
      setWebhookEvents(webhookPayload.events);
    }
  }

  async function replayWebhookEvent(event: BillingDocumentWebhookEvent) {
    setWebhookBusyId(event.eventId);
    setNotice('Replaying hosted webhook...');
    try {
      const response = await fetch(`/api/builder/billing-documents/webhooks/events/${encodeURIComponent(event.eventId)}/replay`, {
        method: 'POST',
      });
      const payload = await response.json().catch(() => ({})) as {
        ok?: boolean;
        event?: BillingDocumentWebhookEvent;
        changed?: boolean;
        reason?: string;
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.event) {
        setNotice(payload.error ?? payload.reason ?? 'Webhook replay failed');
        return;
      }
      setWebhookEvents((current) => current.map((entry) => (
        entry.eventId === payload.event?.eventId ? payload.event : entry
      )));
      await refreshDocuments();
      setNotice(payload.changed ? 'Webhook replay applied changes' : 'Webhook replay completed with no document change');
    } finally {
      setWebhookBusyId('');
    }
  }

  function updateAutomationRule(
    target: AutomationTarget,
    rule: AutomationRule,
    field: 'enabled' | 'email',
    value: boolean,
  ) {
    setAutomationDraft((current) => {
      const nextRule = {
        ...current[target][rule],
        [field]: value,
      };
      if (field === 'enabled' && !value) nextRule.email = false;
      return {
        ...current,
        [target]: {
          ...current[target],
          [rule]: nextRule,
        },
      };
    });
  }

  function updateManualInstruction(
    target: AutomationTarget,
    method: ManualPaymentMethod,
    field: ManualInstructionField,
    value: boolean | string,
  ) {
    setAutomationDraft((current) => ({
      ...current,
      manualPayments: {
        ...current.manualPayments,
        [target]: {
          ...current.manualPayments[target],
          [method]: {
            ...current.manualPayments[target][method],
            [field]: value,
          },
        },
      },
    }));
  }

  async function saveAutomationPolicy() {
    setSavingAutomation(true);
    setAutomationNotice('Saving policy...');
    try {
      const response = await fetch('/api/builder/billing-documents/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: automationDraft }),
      });
      const payload = await response.json().catch(() => ({})) as {
        ok?: boolean;
        settings?: BillingDocumentAutomationSettings;
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.settings) {
        setAutomationNotice(payload.error ?? 'Could not save automatic issuance policy.');
        return;
      }
      setAutomationSettings(payload.settings);
      setAutomationDraft(payload.settings);
      setAutomationNotice('Automatic issuance policy saved.');
    } catch {
      setAutomationNotice('Could not save automatic issuance policy.');
    } finally {
      setSavingAutomation(false);
    }
  }

  async function copyShareLink(path: string) {
    if (!path) {
      setNotice('Create a share link first');
      return;
    }
    const url = new URL(path, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      setNotice('Share link copied');
    } catch {
      setNotice('Copy failed. Open link and copy from the address bar.');
    }
  }

  async function copyPaymentLink(path: string) {
    if (!path) {
      setNotice('No payment link available');
      return;
    }
    const url = new URL(path, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      setNotice('Payment link copied');
    } catch {
      setNotice('Copy failed. Open payment link and copy from the address bar.');
    }
  }

  async function createPaymentLink(document: BuilderBillingDocumentRow) {
    const renew = document.paymentLinkStatus !== 'not_created';
    setNotice(renew ? 'Renewing pay link...' : 'Creating pay link...');
    const response = await fetch(`/api/builder/billing-documents/${encodeURIComponent(document.source)}/${encodeURIComponent(document.ownerId)}/${encodeURIComponent(document.documentId)}/payment-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ renew }),
    });
    const payload = await response.json().catch(() => ({})) as { ok?: boolean; document?: BuilderBillingDocumentRow; error?: string };
    if (!response.ok || !payload.ok || !payload.document) {
      setNotice(payload.error ?? 'Pay link failed');
      return;
    }
    replaceDocument(payload.document);
    await copyPaymentLink(payload.document.paymentLinkPath);
    if (renew) setNotice('New pay link copied');
  }

  async function revokePaymentLink(document: BuilderBillingDocumentRow) {
    setNotice('Revoking pay link...');
    const response = await fetch(`/api/builder/billing-documents/${encodeURIComponent(document.source)}/${encodeURIComponent(document.ownerId)}/${encodeURIComponent(document.documentId)}/payment-link`, {
      method: 'DELETE',
    });
    const payload = await response.json().catch(() => ({})) as { ok?: boolean; document?: BuilderBillingDocumentRow; error?: string };
    if (!response.ok || !payload.ok || !payload.document) {
      setNotice(payload.error ?? 'Pay link revoke failed');
      return;
    }
    replaceDocument(payload.document);
    setNotice('Pay link revoked');
  }

  async function updateLifecycle(document: BuilderBillingDocumentRow, action: 'void' | 'supersede') {
    setNotice(action === 'void' ? 'Voiding document...' : 'Creating superseding document...');
    const response = await fetch(`/api/builder/billing-documents/${encodeURIComponent(document.source)}/${encodeURIComponent(document.ownerId)}/${encodeURIComponent(document.documentId)}/lifecycle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        reason: action === 'void' ? 'Voided in central billing manager' : 'Superseded in central billing manager',
      }),
    });
    const payload = await response.json().catch(() => ({})) as {
      ok?: boolean;
      document?: BuilderBillingDocumentRow;
      supersededDocument?: BuilderBillingDocumentRow;
      error?: string;
    };
    if (!response.ok || !payload.ok || !payload.document) {
      setNotice(payload.error ?? 'Lifecycle update failed');
      return;
    }
    if (payload.supersededDocument) replaceDocument(payload.supersededDocument);
    replaceDocument(payload.document);
    setNotice(action === 'void' ? 'Document voided' : 'Superseding document issued');
  }

  async function createShareLink(document: BuilderBillingDocumentRow) {
    setNotice('Creating share link...');
    const response = await fetch(`/api/builder/billing-documents/${encodeURIComponent(document.source)}/${encodeURIComponent(document.ownerId)}/${encodeURIComponent(document.documentId)}/share-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const payload = await response.json().catch(() => ({})) as { ok?: boolean; document?: BuilderBillingDocumentRow; error?: string };
    if (!response.ok || !payload.ok || !payload.document) {
      setNotice(payload.error ?? 'Share link failed');
      return;
    }
    replaceDocument(payload.document);
    await copyShareLink(payload.document.sharePath);
  }

  async function revokeShareLink(document: BuilderBillingDocumentRow) {
    setNotice('Revoking share link...');
    const response = await fetch(`/api/builder/billing-documents/${encodeURIComponent(document.source)}/${encodeURIComponent(document.ownerId)}/${encodeURIComponent(document.documentId)}/share-link`, {
      method: 'DELETE',
    });
    const payload = await response.json().catch(() => ({})) as { ok?: boolean; document?: BuilderBillingDocumentRow; error?: string };
    if (!response.ok || !payload.ok || !payload.document) {
      setNotice(payload.error ?? 'Revoke failed');
      return;
    }
    replaceDocument(payload.document);
    setNotice('Share link revoked');
  }

  async function recordManualPayment(document: BuilderBillingDocumentRow) {
    const key = documentKey(document);
    const draft = manualPaymentDrafts[key] ?? defaultManualPaymentDraft(document);
    const amountCents = manualPaymentAmountCents(document.currency, draft.amount);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      setNotice('Enter a valid manual payment amount');
      return;
    }
    if (amountCents > document.balanceDue) {
      setNotice('Manual payment exceeds balance due');
      return;
    }

    setManualPaymentBusyKey(key);
    setNotice('Recording central manual payment...');
    try {
      const response = await fetch(`/api/builder/billing-documents/${encodeURIComponent(document.source)}/${encodeURIComponent(document.ownerId)}/${encodeURIComponent(document.documentId)}/manual-payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountCents,
          idempotencyKey: draft.idempotencyKey,
          method: draft.method,
          status: draft.status,
          reference: draft.reference,
          note: draft.note,
        }),
      });
      const payload = await response.json().catch(() => ({})) as {
        ok?: boolean;
        document?: BuilderBillingDocumentRow;
        error?: string;
      };
      if (!response.ok || !payload.ok || !payload.document) {
        setNotice(payload.error ?? 'Manual payment failed');
        return;
      }

      replaceDocument(payload.document);
      await refreshDocuments();
      const nextDraft = defaultManualPaymentDraft(payload.document);
      setManualPaymentDrafts((current) => ({
        ...current,
        [key]: nextDraft,
      }));
      if (payload.document.balanceDue <= 0) setManualPaymentOpenKey('');
      setNotice(payload.document.balanceDue <= 0 ? 'Manual payment completed balance' : 'Manual payment recorded');
    } finally {
      setManualPaymentBusyKey('');
    }
  }

  return (
    <section className={styles.manager} data-billing-documents-admin>
      <header className={styles.header}>
        <div>
          <span>{siteTitle}</span>
          <h1>Billing documents</h1>
          <p>Central invoice and receipt archive for commerce orders and paid booking flows.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/admin-builder/commerce/products`}>Products</Link>
          <Link href={`/${locale}/admin-builder/commerce/orders`}>Orders</Link>
          <Link href={`/${locale}/admin-builder/commerce/payments`}>Payments</Link>
          <Link href={`/${locale}/admin-builder/commerce/currency`}>Currency</Link>
          <Link href={`/${locale}/admin-builder/bookings/dashboard`}>Bookings</Link>
          <button
            type="button"
            onClick={() => {
              setExportText(documentCsv(filtered));
              setNotice('Export ready');
            }}
            data-billing-documents-export
          >
            Export CSV
          </button>
          <button type="button" onClick={() => void refreshDocuments()} data-billing-documents-refresh>
            Refresh
          </button>
        </div>
      </header>

      <section className={styles.kpis} aria-label="Billing document stats">
        {Object.entries(counts).map(([key, value]) => (
          <article key={key} data-billing-documents-kpi={key}>
            <strong>{value}</strong>
            <span>{key}</span>
          </article>
        ))}
      </section>

      <section className={styles.paymentAnalytics} data-payment-analytics>
        <div className={styles.paymentAnalyticsHeader}>
          <div>
            <span>Payment analytics</span>
            <h2>Current document scope</h2>
          </div>
          <Link href={`/${locale}/admin-builder/commerce/payments`}>Open full analytics</Link>
        </div>
        <div className={styles.paymentAnalyticsCards}>
          <article data-payment-analytics-kpi="collected">
            <strong>{paymentAnalytics.collectedLabel}</strong>
            <span>Collected</span>
          </article>
          <article data-payment-analytics-kpi="balance-due">
            <strong>{paymentAnalytics.balanceDueLabel}</strong>
            <span>Balance due</span>
          </article>
          <article data-payment-analytics-kpi="manual-pending">
            <strong>{paymentAnalytics.manualPending}</strong>
            <span>Manual pending</span>
          </article>
          <article data-payment-analytics-kpi="refunded">
            <strong>{paymentAnalytics.refundedLabel}</strong>
            <span>Refunded</span>
          </article>
          <article data-payment-analytics-kpi="needs-review">
            <strong>{paymentAnalytics.needsReview}</strong>
            <span>Needs review</span>
          </article>
        </div>
        <div className={styles.paymentMix} data-payment-analytics-mix>
          <span data-payment-analytics-segment style={{ flexGrow: Math.max(1, paymentAnalytics.activePayLinks) }} />
          <span data-payment-analytics-segment style={{ flexGrow: Math.max(1, paymentAnalytics.manualPending) }} />
          <span data-payment-analytics-segment style={{ flexGrow: Math.max(1, paymentAnalytics.failedWebhooks) }} />
        </div>
        <div className={styles.paymentMixLegend}>
          <span>Hosted links {paymentAnalytics.activePayLinks}</span>
          <span>Manual due {paymentAnalytics.manualPending}</span>
          <span>Webhook failures {paymentAnalytics.failedWebhooks}</span>
        </div>
        <div className={styles.paymentAttention} data-payment-analytics-attention>
          {paymentAnalytics.attentionRows.length > 0 ? paymentAnalytics.attentionRows.map((row) => (
            <article key={row.key} data-payment-analytics-attention-row>
              <strong>{row.label}</strong>
              <span>{row.detail}</span>
            </article>
          )) : (
            <article data-payment-analytics-empty>
              <strong>No payment exceptions</strong>
              <span>Failed webhooks, stale pay links, and failed payment rows will appear here.</span>
            </article>
          )}
        </div>
      </section>

      <section className={styles.automationPanel} data-billing-auto-policy>
        <div className={styles.automationHeader}>
          <div>
            <h2>Automatic issuance</h2>
            <p>Choose when invoices and receipts are created automatically. Manual actions remain available.</p>
          </div>
          <button
            type="button"
            onClick={() => void saveAutomationPolicy()}
            disabled={savingAutomation || !automationDirty}
            data-billing-auto-policy-save
          >
            {savingAutomation ? 'Saving policy...' : 'Save policy'}
          </button>
        </div>
        <div className={styles.automationGroups}>
          <div className={styles.automationGroup} data-billing-auto-policy-group="orders">
            <strong>Commerce orders</strong>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.orders.invoiceOnCreate.enabled}
                onChange={(event) => updateAutomationRule('orders', 'invoiceOnCreate', 'enabled', event.target.checked)}
                data-billing-auto-order-invoice
              />
              <span>Auto-issue invoices for new orders</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.orders.invoiceOnCreate.email}
                disabled={!automationDraft.orders.invoiceOnCreate.enabled}
                onChange={(event) => updateAutomationRule('orders', 'invoiceOnCreate', 'email', event.target.checked)}
                data-billing-auto-order-invoice-email
              />
              <span>Auto-email order invoices</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.orders.receiptOnPaid.enabled}
                onChange={(event) => updateAutomationRule('orders', 'receiptOnPaid', 'enabled', event.target.checked)}
                data-billing-auto-order-receipt
              />
              <span>Auto-issue receipts when orders are paid</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.orders.receiptOnPaid.email}
                disabled={!automationDraft.orders.receiptOnPaid.enabled}
                onChange={(event) => updateAutomationRule('orders', 'receiptOnPaid', 'email', event.target.checked)}
                data-billing-auto-order-receipt-email
              />
              <span>Auto-email order receipts</span>
            </label>
          </div>
          <div className={styles.automationGroup} data-billing-auto-policy-group="bookings">
            <strong>Bookings</strong>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.bookings.invoiceOnCreate.enabled}
                onChange={(event) => updateAutomationRule('bookings', 'invoiceOnCreate', 'enabled', event.target.checked)}
                data-billing-auto-booking-invoice
              />
              <span>Auto-issue invoices for new bookings</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.bookings.invoiceOnCreate.email}
                disabled={!automationDraft.bookings.invoiceOnCreate.enabled}
                onChange={(event) => updateAutomationRule('bookings', 'invoiceOnCreate', 'email', event.target.checked)}
                data-billing-auto-booking-invoice-email
              />
              <span>Auto-email booking invoices</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.bookings.receiptOnPaid.enabled}
                onChange={(event) => updateAutomationRule('bookings', 'receiptOnPaid', 'enabled', event.target.checked)}
                data-billing-auto-booking-receipt
              />
              <span>Auto-issue receipts when bookings are paid</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={automationDraft.bookings.receiptOnPaid.email}
                disabled={!automationDraft.bookings.receiptOnPaid.enabled}
                onChange={(event) => updateAutomationRule('bookings', 'receiptOnPaid', 'email', event.target.checked)}
                data-billing-auto-booking-receipt-email
              />
              <span>Auto-email booking receipts</span>
            </label>
          </div>
        </div>
        <div className={styles.instructionHeader}>
          <strong>Offline payment instructions</strong>
          <span>Shown on invoice payment links. Keep banking details short and operational.</span>
        </div>
        <div className={styles.instructionGroups} data-billing-manual-instructions>
          {(['orders', 'bookings'] as AutomationTarget[]).map((target) => (
            <div key={target} className={styles.instructionGroup} data-billing-manual-instructions-group={target}>
              <strong>{target === 'orders' ? 'Order invoices' : 'Booking invoices'}</strong>
              {manualPaymentMethods.map((method) => {
                const instruction = automationDraft.manualPayments[target][method];
                const fieldKey = `${target}-${method}`;
                return (
                  <div key={method} className={styles.instructionRow} data-billing-manual-instruction-row={fieldKey}>
                    <label className={styles.instructionToggle}>
                      <input
                        type="checkbox"
                        checked={instruction.enabled}
                        onChange={(event) => updateManualInstruction(target, method, 'enabled', event.target.checked)}
                        data-billing-manual-instruction-enabled={fieldKey}
                      />
                      <span>{manualPaymentMethodLabel(method)}</span>
                    </label>
                    <input
                      value={instruction.title}
                      maxLength={80}
                      aria-label={`${manualPaymentMethodLabel(method)} title`}
                      onChange={(event) => updateManualInstruction(target, method, 'title', event.target.value)}
                      data-billing-manual-instruction-title={fieldKey}
                    />
                    <textarea
                      value={instruction.instructions}
                      rows={3}
                      maxLength={900}
                      aria-label={`${manualPaymentMethodLabel(method)} instructions`}
                      placeholder="Account, routing details, branch notes, or office instructions"
                      onChange={(event) => updateManualInstruction(target, method, 'instructions', event.target.value)}
                      data-billing-manual-instruction-body={fieldKey}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <p className={styles.automationNotice} role="status" data-billing-auto-policy-notice>
          {automationNotice}
        </p>
      </section>

      <section className={styles.toolbar}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search document, customer, email"
          data-billing-documents-search
        />
        <select value={source} onChange={(event) => setSource(event.target.value as SourceFilter)} data-billing-documents-source>
          <option value="all">All sources</option>
          <option value="order">Orders</option>
          <option value="booking">Bookings</option>
        </select>
        <select value={type} onChange={(event) => setType(event.target.value as TypeFilter)} data-billing-documents-type>
          <option value="all">All document types</option>
          <option value="invoice">Invoices</option>
          <option value="receipt">Receipts</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} data-billing-documents-status>
          <option value="all">All status</option>
          <option value="issued">Issued</option>
          <option value="emailed_stub">Email queued</option>
          <option value="voided">Voided</option>
          <option value="superseded">Superseded</option>
        </select>
      </section>

      <p className={styles.notice} role="status">{notice}</p>

      {unmatchedWebhookEvents.length ? (
        <section className={styles.webhookExceptions} data-billing-document-webhook-exceptions>
          <div>
            <strong>Billing webhook exceptions</strong>
            <span>Hosted payment webhooks that do not match a visible billing document row.</span>
            <span data-billing-document-webhook-exception-count>
              Showing latest {Math.min(3, unmatchedWebhookEvents.length)} of {unmatchedWebhookEvents.length}
            </span>
          </div>
          <ol>
            {unmatchedWebhookEvents.slice(0, 3).map((event) => (
              <li
                key={event.eventId}
                data-billing-document-webhook-exception={event.eventId}
                data-billing-document-webhook-exception-status={event.status}
                data-billing-document-webhook-exception-reason={event.error ?? event.paymentStatus}
              >
                <span>{webhookStatusLabel(event)}</span>
                <small>
                  {event.source} {event.ownerId} / {event.documentId} · {webhookEventDetail(event)}
                </small>
                <button
                  type="button"
                  disabled={webhookBusyId === event.eventId}
                  onClick={() => void replayWebhookEvent(event)}
                  data-billing-document-webhook-exception-replay={event.eventId}
                >
                  {webhookBusyId === event.eventId ? 'Replaying...' : 'Replay'}
                </button>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className={styles.list} aria-label="Billing documents list">
        {filtered.length === 0 ? (
          <article className={styles.empty} data-billing-documents-empty>
            <strong>No billing documents found</strong>
            <span>Issued invoices and receipts will appear here after order or booking document actions.</span>
          </article>
        ) : filtered.map((document) => {
          const isCurrent = document.status === 'issued' || document.status === 'emailed_stub';
          const rowKey = documentKey(document);
          const manualPaymentAllowed = canRecordManualPayment(document);
          const manualPaymentOpen = manualPaymentOpenKey === rowKey;
          const activityOpen = activityOpenKey === rowKey;
          const manualPaymentDraft = manualPaymentDrafts[rowKey] ?? defaultManualPaymentDraft(document);
          const manualPaymentBusy = manualPaymentBusyKey === rowKey;
          const payLinkState = paymentLinkDisplayState(document);
          const payLinkLabel = paymentLinkDisplayLabel(document, payLinkState);
          const rowWebhookEvents = webhookEventsByDocument.get(documentWebhookKey(document)) ?? [];
          const hasActivity = document.paymentLinkEvents.length > 0 || rowWebhookEvents.length > 0 || document.paymentLinkRenewalNeeded;
          return (
          <article
            key={rowKey}
            className={styles.document}
            data-billing-document-row={rowKey}
            data-billing-document-source={document.source}
            data-billing-document-type={document.type}
            data-billing-document-status={document.status}
            data-billing-document-currency-code={document.currency}
          >
            <div className={styles.identity}>
              <span>{document.sourceLabel}</span>
              <strong>{document.typeLabel} {document.number}</strong>
              <small>{document.ownerLabel}</small>
            </div>
            <div className={styles.customer}>
              <strong>{document.customerLabel}</strong>
              <span>{document.recipientEmail}</span>
              <span>{document.contextLabel}</span>
            </div>
            <div className={styles.amounts}>
              <strong>{document.totalLabel}</strong>
              <span className={styles.currencyChip} data-billing-document-currency={rowKey}>
                Currency {document.currency}
              </span>
              <span>Due {document.balanceDueLabel}</span>
              <span>Refunded {document.refundedLabel}</span>
            </div>
            <div className={styles.state}>
              <strong>{document.statusLabel}</strong>
              <span>{new Date(document.issuedAt).toLocaleString()}</span>
              {document.emailedAt ? <span>Email {new Date(document.emailedAt).toLocaleString()}</span> : null}
              <span>{document.shareStatusLabel}{document.shareLinkExpiresAt ? ` · expires ${new Date(document.shareLinkExpiresAt).toLocaleDateString()}` : ''}</span>
              <span data-billing-document-payment-status={rowKey}>Payment {document.paymentStatusLabel}</span>
              <span
                data-billing-document-payment-link-status={rowKey}
                data-billing-document-payment-link-state={payLinkState}
                data-billing-document-payment-link-reconcile={payLinkState === 'stale' ? rowKey : undefined}
              >
                {payLinkLabel}
              </span>
              <span data-billing-document-reconciliation-status={rowKey}>{document.paymentReconciliationStatusLabel}</span>
              {rowWebhookEvents.length ? (
                <span
                  data-billing-document-webhook-status={rowKey}
                  data-billing-document-webhook-state={rowWebhookEvents.some((event) => event.status === 'failed') ? 'failed' : rowWebhookEvents.some((event) => event.status === 'ignored') ? 'ignored' : 'processed'}
                >
                  {webhookSummaryLabel(rowWebhookEvents)}
                </span>
              ) : null}
              {document.voidedAt ? <span>Voided {new Date(document.voidedAt).toLocaleString()}</span> : null}
              {document.voidReason ? <span>{document.voidReason}</span> : null}
              {document.supersedesDocumentId ? <span>Supersedes {document.supersedesDocumentId}</span> : null}
              {document.supersededByDocumentId ? <span>Superseded by {document.supersededByDocumentId}</span> : null}
              <span>{document.viewCount} views · {document.downloadCount} downloads</span>
            </div>
            <div className={styles.actions}>
              <a href={document.downloadPath} data-billing-document-download={rowKey}>
                Download PDF
              </a>
              {isCurrent && document.paymentLinkPath ? (
                <>
                  <a href={document.paymentLinkPath} target="_blank" rel="noreferrer" data-billing-document-payment={rowKey}>
                    Open pay
                  </a>
                  <button type="button" onClick={() => void copyPaymentLink(document.paymentLinkPath)} data-billing-document-copy-payment={rowKey}>
                    Copy pay
                  </button>
                  <button type="button" onClick={() => void createPaymentLink(document)} data-billing-document-renew-payment={rowKey}>
                    Renew pay
                  </button>
                  <button type="button" onClick={() => void revokePaymentLink(document)} data-billing-document-revoke-payment={rowKey}>
                    Revoke pay
                  </button>
                </>
              ) : isCurrent && (document.paymentLinkStatus === 'not_created' || document.paymentLinkStatus === 'expired' || document.paymentLinkStatus === 'revoked') ? (
                <button type="button" onClick={() => void createPaymentLink(document)} data-billing-document-create-payment={rowKey}>
                  {document.paymentLinkStatus === 'not_created' ? 'Create pay' : 'Renew pay'}
                </button>
              ) : null}
              {manualPaymentAllowed ? (
                <button
                  type="button"
                  onClick={() => {
                    setManualPaymentOpenKey((current) => (current === rowKey ? '' : rowKey));
                    setManualPaymentDrafts((current) => ({
                      ...current,
                      [rowKey]: current[rowKey] ?? defaultManualPaymentDraft(document),
                    }));
                  }}
                  data-billing-document-manual-payment-toggle={rowKey}
                >
                  {manualPaymentOpen ? 'Hide payment' : 'Record payment'}
                </button>
              ) : null}
              {isCurrent && document.shareStatus === 'active' ? (
                <>
                  <a href={document.sharePath} target="_blank" rel="noreferrer" data-billing-document-share={rowKey}>
                    View link
                  </a>
                  <button type="button" onClick={() => void copyShareLink(document.sharePath)} data-billing-document-copy={rowKey}>
                    Copy link
                  </button>
                  <button type="button" onClick={() => void revokeShareLink(document)} data-billing-document-revoke={rowKey}>
                    Revoke link
                  </button>
                </>
              ) : isCurrent ? (
                <button type="button" onClick={() => void createShareLink(document)} data-billing-document-create-share={rowKey}>
                  Create link
                </button>
              ) : null}
              {isCurrent ? (
                <>
                  <button type="button" onClick={() => void updateLifecycle(document, 'void')} data-billing-document-void={rowKey}>
                    Void
                  </button>
                  <button type="button" onClick={() => void updateLifecycle(document, 'supersede')} data-billing-document-supersede={rowKey}>
                    Supersede
                  </button>
                </>
              ) : null}
              {hasActivity ? (
                <button
                  type="button"
                  onClick={() => setActivityOpenKey((current) => (current === rowKey ? '' : rowKey))}
                  data-billing-document-activity-toggle={rowKey}
                >
                  {activityOpen ? 'Hide activity' : 'Activity'}
                </button>
              ) : null}
              <Link href={document.detailHref}>Open source</Link>
            </div>
            {activityOpen && hasActivity ? (
              <div
                className={styles.paymentLinkHistory}
                data-billing-document-activity-panel={rowKey}
                data-billing-document-payment-link-history={rowKey}
              >
                <div>
                  <strong>Document activity</strong>
                  <span>Payment link lifecycle and hosted payment webhook history for this document.</span>
                </div>
                {rowWebhookEvents.length ? (
                  <section
                    className={styles.webhookHistory}
                    data-billing-document-webhook-history={rowKey}
                    data-billing-document-webhook-ledger={rowKey}
                  >
                    <strong>Hosted payment webhooks</strong>
                    <ol>
                      {rowWebhookEvents.slice(0, 5).map((event) => (
                        <li
                          key={event.eventId}
                          data-billing-document-webhook-event={event.eventId}
                          data-billing-document-webhook-event-status={event.status}
                        >
                          <span>{webhookStatusLabel(event)}</span>
                          <small>{webhookEventDetail(event)}</small>
                          {event.status !== 'processed' ? (
                            <button
                              type="button"
                              disabled={webhookBusyId === event.eventId}
                              onClick={() => void replayWebhookEvent(event)}
                              data-billing-document-webhook-replay={event.eventId}
                            >
                              {webhookBusyId === event.eventId ? 'Replaying...' : 'Replay'}
                            </button>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  </section>
                ) : null}
                <ol>
                  {document.paymentLinkRenewalNeeded ? (
                    <li data-billing-document-activity-item="renewal_needed">
                      <span>Renewal needed</span>
                      <small>{payLinkLabel}</small>
                    </li>
                  ) : null}
                  {document.paymentLinkEvents.slice(-5).reverse().map((event) => (
                    <li
                      key={event.eventId}
                      data-billing-document-activity-item={event.type}
                      data-billing-document-activity-reason={event.reason}
                      data-billing-document-activity-reference={event.paymentId ?? event.paymentLinkId ?? event.eventId}
                    >
                      <span>{paymentLinkEventLabel(event)}</span>
                      <small>{paymentLinkEventDetail(event)}</small>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
            {manualPaymentOpen ? (
              <div className={styles.manualPaymentPanel} data-billing-document-manual-payment-form={rowKey}>
                <div className={styles.manualPaymentHeader}>
                  <div>
                    <strong>Record offline payment</strong>
                    <span data-billing-document-manual-payment-helper={rowKey}>Only succeeded payments reduce balance.</span>
                    <span data-billing-document-manual-payment-currency={rowKey}>Record in invoice currency: {document.currency}</span>
                  </div>
                  <em>Balance due {document.balanceDueLabel}</em>
                </div>
                <label>
                  <span>Status</span>
                  <select
                    value={manualPaymentDraft.status}
                    disabled={manualPaymentBusy}
                    onChange={(event) => setManualPaymentDrafts((current) => ({
                      ...current,
                      [rowKey]: { ...manualPaymentDraft, status: event.target.value as ManualPaymentStatus },
                    }))}
                    data-billing-document-manual-payment-status={rowKey}
                  >
                    {(['succeeded', 'pending', 'failed', 'canceled'] as ManualPaymentStatus[]).map((statusOption) => (
                      <option key={statusOption} value={statusOption}>{manualPaymentStatusLabel(statusOption)}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Amount</span>
                  <input
                    value={manualPaymentDraft.amount}
                    inputMode="decimal"
                    disabled={manualPaymentBusy}
                    onChange={(event) => setManualPaymentDrafts((current) => ({
                      ...current,
                      [rowKey]: { ...manualPaymentDraft, amount: event.target.value },
                    }))}
                    data-billing-document-manual-payment-amount={rowKey}
                  />
                </label>
                <label>
                  <span>Method</span>
                  <select
                    value={manualPaymentDraft.method}
                    disabled={manualPaymentBusy}
                    onChange={(event) => setManualPaymentDrafts((current) => ({
                      ...current,
                      [rowKey]: { ...manualPaymentDraft, method: event.target.value as ManualPaymentMethod },
                    }))}
                    data-billing-document-manual-payment-method={rowKey}
                  >
                    {(['bank_transfer', 'cash', 'check', 'other'] as ManualPaymentMethod[]).map((method) => (
                      <option key={method} value={method}>{manualPaymentMethodLabel(method)}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Reference</span>
                  <input
                    value={manualPaymentDraft.reference}
                    disabled={manualPaymentBusy}
                    onChange={(event) => setManualPaymentDrafts((current) => ({
                      ...current,
                      [rowKey]: { ...manualPaymentDraft, reference: event.target.value },
                    }))}
                    data-billing-document-manual-payment-reference={rowKey}
                  />
                </label>
                <label>
                  <span>Note</span>
                  <textarea
                    value={manualPaymentDraft.note}
                    rows={2}
                    maxLength={500}
                    disabled={manualPaymentBusy}
                    onChange={(event) => setManualPaymentDrafts((current) => ({
                      ...current,
                      [rowKey]: { ...manualPaymentDraft, note: event.target.value },
                    }))}
                    data-billing-document-manual-payment-note={rowKey}
                  />
                </label>
                <button
                  type="button"
                  disabled={manualPaymentBusy || !manualPaymentAllowed}
                  onClick={() => void recordManualPayment(document)}
                  data-billing-document-manual-payment-submit={rowKey}
                >
                  {manualPaymentBusy ? 'Saving...' : 'Save payment record'}
                </button>
              </div>
            ) : null}
          </article>
          );
        })}
      </section>

      {exportText ? (
        <section className={styles.exportPanel} data-billing-documents-export-panel>
          <h2>CSV export</h2>
          <textarea readOnly rows={8} value={exportText} />
        </section>
      ) : null}
    </section>
  );
}
