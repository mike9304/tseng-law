'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import type {
  CommercePaymentWebhookEvent,
  CommercePaymentWebhookStatus,
} from '@/lib/builder/commerce/payment-webhooks-shared';
import styles from './PaymentWebhookManager.module.css';

type ProviderFilter = 'all' | 'manual-invoice' | 'sandbox-card';
type StatusFilter = 'all' | CommercePaymentWebhookStatus;

interface PaymentWebhookManagerClientProps {
  locale: Locale;
  siteTitle: string;
  initialEvents: CommercePaymentWebhookEvent[];
}

function formatAmount(event: CommercePaymentWebhookEvent): string {
  if (typeof event.amountCents !== 'number' || !event.currency) return 'Amount unknown';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: event.currency,
    maximumFractionDigits: event.currency === 'TWD' || event.currency === 'KRW' ? 0 : 2,
  }).format(event.amountCents / 100);
}

function computeKpis(events: CommercePaymentWebhookEvent[]) {
  return {
    total: events.length,
    processed: events.filter((event) => event.status === 'processed').length,
    failed: events.filter((event) => event.status === 'failed').length,
    unmatched: events.filter((event) => event.status === 'unmatched').length,
    ignored: events.filter((event) => event.status === 'ignored').length,
    replayed: events.filter((event) => event.replayCount > 0).length,
  };
}

function eventMatches(event: CommercePaymentWebhookEvent, q: string): boolean {
  if (!q) return true;
  return [
    event.eventId,
    event.providerEventId,
    event.eventType,
    event.paymentReferenceId,
    event.orderId ?? '',
    event.status,
    event.error ?? '',
  ].some((value) => value.toLowerCase().includes(q));
}

export default function PaymentWebhookManagerClient({
  locale,
  siteTitle,
  initialEvents,
}: PaymentWebhookManagerClientProps) {
  const [events, setEvents] = useState(initialEvents);
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState<ProviderFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [expandedId, setExpandedId] = useState('');
  const [busyEventId, setBusyEventId] = useState('');
  const [notice, setNotice] = useState('Ready');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((event) => provider === 'all' || event.provider === provider)
      .filter((event) => status === 'all' || event.status === status)
      .filter((event) => eventMatches(event, q))
      .sort((left, right) => right.receivedAt.localeCompare(left.receivedAt));
  }, [events, provider, query, status]);

  const kpis = useMemo(() => computeKpis(events), [events]);

  async function refresh() {
    setNotice('Refreshing payment events...');
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (provider !== 'all') params.set('provider', provider);
    if (status !== 'all') params.set('status', status);
    const response = await fetch(`/api/builder/commerce/payment-webhooks?${params}`, { cache: 'no-store' });
    const payload = await response.json().catch(() => ({})) as { ok?: boolean; events?: CommercePaymentWebhookEvent[]; error?: string };
    if (!response.ok || !payload.ok || !Array.isArray(payload.events)) {
      setNotice(payload.error ?? 'Refresh failed');
      return;
    }
    setEvents(payload.events);
    setNotice('Payment events refreshed');
  }

  async function replay(eventId: string) {
    setBusyEventId(eventId);
    setNotice('Replaying payment event...');
    try {
      const response = await fetch(`/api/builder/commerce/payment-webhooks/events/${encodeURIComponent(eventId)}/replay`, {
        method: 'POST',
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; event?: CommercePaymentWebhookEvent; error?: string; reason?: string };
      if (!response.ok || !payload.ok || !payload.event) {
        setNotice(payload.error ?? 'Replay failed');
        return;
      }
      setEvents((current) => current.map((event) => (event.eventId === payload.event?.eventId ? payload.event : event)));
      setNotice(payload.reason ? `Replay finished: ${payload.reason}` : 'Replay finished');
    } finally {
      setBusyEventId('');
    }
  }

  return (
    <main className={styles.page} data-commerce-payment-webhooks-admin>
      <header className={styles.header}>
        <div>
          <span>{siteTitle}</span>
          <h1>Payment webhooks</h1>
          <p>Review provider events, payment references, order matching, replay state, and masked payload details.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/admin-builder/commerce/orders`}>Orders</Link>
          <Link href={`/${locale}/admin-builder/commerce/products`}>Products</Link>
          <Link href={`/${locale}/admin-builder/commerce/currency`}>Currency</Link>
          <Link href={`/${locale}/admin-builder/commerce/tax`}>Tax rules</Link>
          <Link href={`/${locale}/admin-builder/commerce/shipping`}>Shipping</Link>
          <Link href={`/${locale}/admin-builder/commerce/notifications`}>Notifications</Link>
          <button type="button" onClick={() => void refresh()} data-payment-webhooks-refresh>Refresh</button>
        </div>
      </header>

      <section className={styles.kpis} aria-label="Payment webhook stats">
        {Object.entries(kpis).map(([key, value]) => (
          <article key={key} data-payment-webhooks-kpi={key}>
            <strong>{value}</strong>
            <span>{key}</span>
          </article>
        ))}
      </section>

      <section className={styles.toolbar}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search event, reference, order, error"
          data-payment-webhooks-search
        />
        <select value={provider} onChange={(event) => setProvider(event.target.value as ProviderFilter)} data-payment-webhooks-provider-filter>
          <option value="all">All providers</option>
          <option value="sandbox-card">Sandbox card</option>
          <option value="manual-invoice">Manual invoice</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} data-payment-webhooks-status-filter>
          <option value="all">All status</option>
          <option value="processed">Processed</option>
          <option value="failed">Failed</option>
          <option value="unmatched">Unmatched</option>
          <option value="ignored">Ignored</option>
        </select>
      </section>

      <p role="status" className={styles.notice}>{notice}</p>

      <section className={styles.list} aria-label="Payment webhook events">
        {filtered.length === 0 ? (
          <article className={styles.empty} data-payment-webhooks-empty>
            <strong>No payment webhooks found</strong>
            <span>Signed provider events will appear here after a checkout payment reference is created.</span>
          </article>
        ) : filtered.map((event) => {
          const canReplay = event.status === 'failed' || event.status === 'unmatched' || event.status === 'ignored';
          const expanded = expandedId === event.eventId;
          return (
            <article
              key={event.eventId}
              className={styles.event}
              data-payment-webhook-row={event.eventId}
              data-payment-webhook-status={event.status}
            >
              <div className={styles.identity}>
                <strong>{event.eventType}</strong>
                <span>{event.provider} · {event.providerEventId}</span>
                <small>{new Date(event.receivedAt).toLocaleString()}</small>
              </div>
              <div className={styles.money}>
                <strong>{formatAmount(event)}</strong>
                <span data-payment-webhook-reference={event.eventId}>Payment ref {event.paymentReferenceId}</span>
                <span>Order {event.orderId ?? 'unmatched'}</span>
              </div>
              <div className={styles.state}>
                <strong>{event.status}</strong>
                <span>Payment status {event.paymentStatus}</span>
                <span>Replay count {event.replayCount}</span>
                {event.error ? <span>Error {event.error}</span> : null}
              </div>
              <div className={styles.eventActions}>
                <button
                  type="button"
                  disabled={!canReplay || busyEventId === event.eventId}
                  onClick={() => void replay(event.eventId)}
                  data-payment-webhook-replay={event.eventId}
                >
                  {busyEventId === event.eventId ? 'Replaying' : 'Replay'}
                </button>
              </div>
              <div className={styles.badges}>
                <span>{event.status}</span>
                <span>{event.signatureVerified ? 'signature verified' : 'signature missing'}</span>
                <span>{event.currency ?? 'currency unknown'}</span>
                <span>{event.processedAt ? `processed ${new Date(event.processedAt).toLocaleString()}` : 'pending processing'}</span>
              </div>
              <section className={styles.detail} data-payment-webhook-detail={event.eventId} hidden={!expanded}>
                <div className={styles.detailHeader}>
                  <strong>Masked payload</strong>
                  <button type="button" onClick={() => setExpandedId('')}>Hide details</button>
                </div>
                <span>Provider event {event.providerEventId}</span>
                <span>Local event {event.eventId}</span>
                <pre className={styles.payload}>{JSON.stringify(event.payload, null, 2)}</pre>
              </section>
              {!expanded ? (
                <div className={styles.badges}>
                  <button type="button" onClick={() => setExpandedId(event.eventId)} data-payment-webhook-toggle-detail={event.eventId}>
                    Show masked payload
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </main>
  );
}
