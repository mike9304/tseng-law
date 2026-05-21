'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type {
  CommerceNotificationEvent,
  CommerceNotificationSettings,
  CommerceRecoveryCart,
} from '@/lib/builder/commerce/notifications-engine';
import styles from './NotificationManager.module.css';

interface NotificationManagerClientProps {
  locale: Locale;
  siteTitle: string;
  initialSettings: CommerceNotificationSettings;
  initialEvents: CommerceNotificationEvent[];
  initialRecoveries: CommerceRecoveryCart[];
}

const templateLabels: Record<keyof CommerceNotificationSettings['templates'], string> = {
  'order.created.customer': 'Customer order confirmation',
  'order.created.admin': 'Admin new order alert',
  'order.updated.customer': 'Customer order update',
  'order.invoice.customer': 'Customer invoice email',
  'order.receipt.customer': 'Customer receipt email',
  'billing.payment_received.customer': 'Customer payment received',
  'cart.abandoned.customer': 'Cart recovery',
};

function patchTemplate(
  settings: CommerceNotificationSettings,
  type: keyof CommerceNotificationSettings['templates'],
  patch: Partial<CommerceNotificationSettings['templates'][keyof CommerceNotificationSettings['templates']]>,
): CommerceNotificationSettings {
  return {
    ...settings,
    templates: {
      ...settings.templates,
      [type]: {
        ...settings.templates[type],
        ...patch,
      },
    },
  };
}

function patchPaymentReceived(
  settings: CommerceNotificationSettings,
  patch: Partial<CommerceNotificationSettings['paymentReceived']>,
): CommerceNotificationSettings {
  return {
    ...settings,
    paymentReceived: {
      ...settings.paymentReceived,
      ...patch,
    },
  };
}

function payloadString(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function paymentReceivedSkipReason(payload: Record<string, unknown>): string {
  const policy = payload.paymentReceivedPolicy;
  if (!policy || typeof policy !== 'object' || Array.isArray(policy)) return '';
  const reason = (policy as Record<string, unknown>).skipReason;
  return typeof reason === 'string' && reason.trim() ? reason.trim() : '';
}

function paymentReceivedSummary(event: CommerceNotificationEvent): string {
  if (event.type !== 'billing.payment_received.customer') return '';
  const paymentId = payloadString(event.payload, 'paymentId');
  const skipReason = paymentReceivedSkipReason(event.payload);
  const parts = [
    payloadString(event.payload, 'paymentMethodLabel'),
    payloadString(event.payload, 'amountLabel'),
    payloadString(event.payload, 'documentNumber'),
    payloadString(event.payload, 'balanceDueLabel') ? `Balance ${payloadString(event.payload, 'balanceDueLabel')}` : '',
    paymentId ? `Payment ${paymentId}` : '',
    skipReason ? `Skipped: ${skipReason}` : '',
  ];
  return parts.filter(Boolean).join(' · ');
}

export default function NotificationManagerClient({
  locale,
  siteTitle,
  initialSettings,
  initialEvents,
  initialRecoveries,
}: NotificationManagerClientProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [events, setEvents] = useState(initialEvents);
  const [recoveries, setRecoveries] = useState(initialRecoveries);
  const [notice, setNotice] = useState('Ready');
  const [busy, setBusy] = useState(false);

  const counts = useMemo(() => ({
    events: events.length,
    queued: events.filter((event) => event.status === 'queued').length,
    recoveries: recoveries.length,
    captured: recoveries.filter((recovery) => recovery.status === 'captured').length,
  }), [events, recoveries]);

  async function refresh() {
    const response = await fetch(`/api/builder/commerce/notifications?locale=${locale}`, { cache: 'no-store' });
    const payload = await response.json().catch(() => ({})) as {
      ok?: boolean;
      settings?: CommerceNotificationSettings;
      events?: CommerceNotificationEvent[];
      recoveries?: CommerceRecoveryCart[];
    };
    if (payload.ok) {
      if (payload.settings) setSettings(payload.settings);
      if (Array.isArray(payload.events)) setEvents(payload.events);
      if (Array.isArray(payload.recoveries)) setRecoveries(payload.recoveries);
      setNotice('Notifications refreshed');
    }
  }

  async function save() {
    setBusy(true);
    setNotice('Saving notifications...');
    try {
      const response = await fetch('/api/builder/commerce/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; settings?: CommerceNotificationSettings; error?: string };
      if (!response.ok || !payload.ok || !payload.settings) {
        setNotice(payload.error ?? 'Notifications save failed');
        return;
      }
      setSettings(payload.settings);
      setNotice('Notifications saved');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page} data-commerce-notifications-admin>
      <header className={styles.header}>
        <div>
          <span>{siteTitle}</span>
          <h1>Commerce notifications</h1>
          <p>Queue order, billing payment, and cart recovery notifications for the store workflow.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/admin-builder/commerce/products`}>Products</Link>
          <Link href={`/${locale}/admin-builder/commerce/orders`}>Orders</Link>
          <Link href={`/${locale}/admin-builder/commerce/currency`}>Currency</Link>
          <Link href={`/${locale}/admin-builder/commerce/shipping`}>Shipping</Link>
          <Link href={`/${locale}/admin-builder/commerce/webhooks`}>Webhooks</Link>
          <button type="button" disabled={busy} onClick={() => void save()} data-commerce-notifications-save>Save</button>
          <button type="button" onClick={() => void refresh()} data-commerce-notifications-refresh>Refresh</button>
        </div>
      </header>

      <section className={styles.kpis} aria-label="Notification stats">
        {Object.entries(counts).map(([key, value]) => (
          <article key={key} data-commerce-notifications-kpi={key}>
            <strong>{value}</strong>
            <span>{key}</span>
          </article>
        ))}
      </section>

      <p role="status" className={styles.notice} data-commerce-notifications-notice>{notice}</p>

      <section className={styles.settings} aria-label="Notification settings">
        <label>
          <span>Enabled</span>
          <input
            type="checkbox"
            checked={settings.enabled}
            data-commerce-notifications-enabled
            onChange={(event) => setSettings((current) => ({ ...current, enabled: event.target.checked }))}
          />
        </label>
        <label>
          <span>Sender</span>
          <input
            value={settings.senderName}
            data-commerce-notifications-sender
            onChange={(event) => setSettings((current) => ({ ...current, senderName: event.target.value }))}
          />
        </label>
        <label>
          <span>Admin email</span>
          <input
            value={settings.adminEmail}
            type="email"
            data-commerce-notifications-admin-email
            onChange={(event) => setSettings((current) => ({ ...current, adminEmail: event.target.value }))}
          />
        </label>
        <label>
          <span>Recovery delay</span>
          <input
            value={String(settings.abandonedCart.delayMinutes)}
            inputMode="numeric"
            data-commerce-notifications-delay
            onChange={(event) => {
              const delayMinutes = Number.parseInt(event.target.value, 10);
              setSettings((current) => ({
                ...current,
                abandonedCart: {
                  ...current.abandonedCart,
                  delayMinutes: Number.isFinite(delayMinutes) ? delayMinutes : current.abandonedCart.delayMinutes,
                },
              }));
            }}
          />
        </label>
      </section>

      <section className={styles.templates} aria-label="Notification templates">
        {Object.entries(settings.templates).map(([type, template]) => (
          <article key={type} data-commerce-notification-template-row={type}>
            <label>
              <input
                type="checkbox"
                checked={template.enabled}
                data-commerce-notification-template-enabled={type}
                onChange={(event) => setSettings((current) => patchTemplate(current, type as keyof CommerceNotificationSettings['templates'], { enabled: event.target.checked }))}
              />
              <span>{templateLabels[type as keyof CommerceNotificationSettings['templates']]}</span>
            </label>
            <input
              value={template.subject}
              data-commerce-notification-template-subject={type}
              onChange={(event) => setSettings((current) => patchTemplate(current, type as keyof CommerceNotificationSettings['templates'], { subject: event.target.value }))}
            />
            {type === 'billing.payment_received.customer' ? (
              <details className={styles.paymentPolicy} data-commerce-notifications-payment-rules>
                <summary>Payment rules</summary>
                <div>
                  <span>Manual and hosted payments use the same customer-facing template.</span>
                  <span>Receipt overlap is skipped to avoid duplicate paid emails.</span>
                  <span>Partial payments include the remaining balance.</span>
                </div>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.paymentReceived.enabled}
                    data-commerce-notifications-payment-received-enabled
                    onChange={(event) => setSettings((current) => patchPaymentReceived(current, { enabled: event.target.checked }))}
                  />
                  <span>Send payment received emails</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.paymentReceived.manualEnabled}
                    data-commerce-notifications-payment-received-manual
                    onChange={(event) => setSettings((current) => patchPaymentReceived(current, { manualEnabled: event.target.checked }))}
                  />
                  <span>Send for manual payments</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.paymentReceived.hostedEnabled}
                    data-commerce-notifications-payment-received-hosted
                    onChange={(event) => setSettings((current) => patchPaymentReceived(current, { hostedEnabled: event.target.checked }))}
                  />
                  <span>Send for hosted payment links</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.paymentReceived.suppressFullSettlementReceiptOverlap}
                    data-commerce-notifications-payment-received-suppress-receipt-overlap
                    onChange={(event) => setSettings((current) => patchPaymentReceived(current, { suppressFullSettlementReceiptOverlap: event.target.checked }))}
                  />
                  <span>Skip when receipt email is queued</span>
                </label>
                <small data-commerce-notifications-payment-received-variables>
                  Variables: customerName, customerEmail, documentNumber, amountLabel, balanceDueLabel, paymentMethodLabel, paymentDate, paymentStatus, sourceLabel
                </small>
              </details>
            ) : null}
          </article>
        ))}
      </section>

      <section className={styles.grid}>
        <div>
          <h2>Outbox</h2>
          <div className={styles.list} data-commerce-notification-events>
            {events.map((event) => (
              <article
                key={event.eventId}
                data-commerce-notification-event-row={event.eventId}
                data-commerce-notification-event-type={event.type}
                data-commerce-notification-event-status={event.status}
              >
                <strong>{event.type}</strong>
                <span>{event.recipient.email}</span>
                {paymentReceivedSummary(event) ? (
                  <span className={styles.eventSummary} data-commerce-notification-event-summary>
                    {paymentReceivedSummary(event)}
                  </span>
                ) : null}
                <small>{event.status} · {event.subject}</small>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h2>Recovery carts</h2>
          <div className={styles.list} data-commerce-recovery-carts>
            {recoveries.map((recovery) => (
              <article
                key={recovery.recoveryId}
                data-commerce-recovery-row={recovery.recoveryId}
                data-commerce-recovery-status={recovery.status}
              >
                <strong>{recovery.email}</strong>
                <span>{recovery.status} · {recovery.totals.itemCount} items</span>
                <small>{recovery.orderId ?? recovery.recoveryUrl}</small>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
