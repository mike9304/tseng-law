'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type {
  CommerceNotificationEvent,
  CommerceNotificationSettings,
  CommerceRecoveryCart,
} from '@/lib/builder/commerce/notifications-engine';
import { getNotificationsCopy } from './notifications-copy';
import styles from './NotificationManager.module.css';

interface NotificationManagerClientProps {
  locale: Locale;
  siteTitle: string;
  initialSettings: CommerceNotificationSettings;
  initialEvents: CommerceNotificationEvent[];
  initialRecoveries: CommerceRecoveryCart[];
}

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

function paymentReceivedSummary(event: CommerceNotificationEvent, locale: Locale): string {
  if (event.type !== 'billing.payment_received.customer') return '';
  const copy = getNotificationsCopy(locale);
  const paymentId = payloadString(event.payload, 'paymentId');
  const skipReason = paymentReceivedSkipReason(event.payload);
  const parts = [
    payloadString(event.payload, 'paymentMethodLabel'),
    payloadString(event.payload, 'amountLabel'),
    payloadString(event.payload, 'documentNumber'),
    payloadString(event.payload, 'balanceDueLabel') ? `${copy.balanceDuePrefix} ${payloadString(event.payload, 'balanceDueLabel')}` : '',
    paymentId ? `${copy.paymentIdPrefix} ${paymentId}` : '',
    skipReason ? `${copy.skippedPrefix}: ${skipReason}` : '',
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
  const copy = getNotificationsCopy(locale);
  const [settings, setSettings] = useState(initialSettings);
  const [events, setEvents] = useState(initialEvents);
  const [recoveries, setRecoveries] = useState(initialRecoveries);
  const [notice, setNotice] = useState(copy.ready);
  const [busy, setBusy] = useState(false);

  const counts = useMemo(() => ({
    events: events.length,
    queued: events.filter((event) => event.status === 'queued').length,
    recoveries: recoveries.length,
    captured: recoveries.filter((recovery) => recovery.status === 'captured').length,
  }), [events, recoveries]);

  async function refresh() {
    const response = await fetch(`/api/builder/commerce/notifications?locale=${encodeURIComponent(locale)}`, { cache: 'no-store' });
    const payload = await response.json().catch(() => ({})) as {
      ok?: boolean;
      settings?: CommerceNotificationSettings;
      events?: CommerceNotificationEvent[];
      recoveries?: CommerceRecoveryCart[];
      error?: string;
    };
    if (payload.ok) {
      if (payload.settings) setSettings(payload.settings);
      if (Array.isArray(payload.events)) setEvents(payload.events);
      if (Array.isArray(payload.recoveries)) setRecoveries(payload.recoveries);
      setNotice(copy.notificationsRefreshed);
    } else {
      setNotice(payload.error ?? copy.notificationsRefreshFailed);
    }
  }

  async function save() {
    setBusy(true);
    setNotice(copy.saving);
    try {
      const response = await fetch(`/api/builder/commerce/notifications?locale=${encodeURIComponent(locale)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; settings?: CommerceNotificationSettings; error?: string };
      if (!response.ok || !payload.ok || !payload.settings) {
        setNotice(payload.error ?? copy.notificationsSaveFailed);
        return;
      }
      setSettings(payload.settings);
      setNotice(copy.notificationsSaved);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page} data-commerce-notifications-admin>
      <header className={styles.header}>
        <div>
          <span>{siteTitle}</span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
        <div className={styles.headerActions} data-commerce-notifications-header-actions>
          <Link href={`/${locale}/admin-builder/commerce/products`}>{copy.nav.products}</Link>
          <Link href={`/${locale}/admin-builder/commerce/orders`}>{copy.nav.orders}</Link>
          <Link href={`/${locale}/admin-builder/commerce/currency`}>{copy.nav.currency}</Link>
          <Link href={`/${locale}/admin-builder/commerce/shipping`}>{copy.nav.shipping}</Link>
          <Link href={`/${locale}/admin-builder/commerce/webhooks`}>{copy.nav.webhooks}</Link>
          <button type="button" disabled={busy} onClick={() => void save()} data-commerce-notifications-save>
            {busy ? copy.saving : copy.save}
          </button>
          <button type="button" onClick={() => void refresh()} data-commerce-notifications-refresh>{copy.refresh}</button>
        </div>
      </header>

      <section className={styles.kpis} aria-label={copy.statsLabel}>
        {Object.entries(counts).map(([key, value]) => (
          <article key={key} data-commerce-notifications-kpi={key}>
            <strong>{value}</strong>
            <span>{key}</span>
          </article>
        ))}
      </section>

      <p role="status" className={styles.notice} data-commerce-notifications-notice>{notice}</p>

      <section className={styles.settings} aria-label={copy.settingsLabel}>
        <label>
          <span>{copy.enabled}</span>
          <input
            type="checkbox"
            checked={settings.enabled}
            data-commerce-notifications-enabled
            onChange={(event) => setSettings((current) => ({ ...current, enabled: event.target.checked }))}
          />
        </label>
        <label>
          <span>{copy.sender}</span>
          <input
            value={settings.senderName}
            data-commerce-notifications-sender
            onChange={(event) => setSettings((current) => ({ ...current, senderName: event.target.value }))}
          />
        </label>
        <label>
          <span>{copy.adminEmail}</span>
          <input
            value={settings.adminEmail}
            type="email"
            data-commerce-notifications-admin-email
            onChange={(event) => setSettings((current) => ({ ...current, adminEmail: event.target.value }))}
          />
        </label>
        <label>
          <span>{copy.recoveryDelay}</span>
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

      <section className={styles.templates} aria-label={copy.templatesLabel}>
        {Object.entries(settings.templates).map(([type, template]) => (
          <article key={type} data-commerce-notification-template-row={type}>
            <label>
              <input
                type="checkbox"
                checked={template.enabled}
                data-commerce-notification-template-enabled={type}
                onChange={(event) => setSettings((current) => patchTemplate(current, type as keyof CommerceNotificationSettings['templates'], { enabled: event.target.checked }))}
              />
              <span>{copy.templateLabels[type]}</span>
            </label>
            <input
              value={template.subject}
              data-commerce-notification-template-subject={type}
              onChange={(event) => setSettings((current) => patchTemplate(current, type as keyof CommerceNotificationSettings['templates'], { subject: event.target.value }))}
            />
            {type === 'billing.payment_received.customer' ? (
              <details className={styles.paymentPolicy} data-commerce-notifications-payment-rules>
                <summary>{copy.paymentRules}</summary>
                <div>
                  {copy.paymentRulesNotes.map((note) => (
                    <span key={note}>{note}</span>
                  ))}
                </div>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.paymentReceived.enabled}
                    data-commerce-notifications-payment-received-enabled
                    onChange={(event) => setSettings((current) => patchPaymentReceived(current, { enabled: event.target.checked }))}
                  />
                  <span>{copy.paymentReceivedEnabled}</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.paymentReceived.manualEnabled}
                    data-commerce-notifications-payment-received-manual
                    onChange={(event) => setSettings((current) => patchPaymentReceived(current, { manualEnabled: event.target.checked }))}
                  />
                  <span>{copy.paymentReceivedManual}</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.paymentReceived.hostedEnabled}
                    data-commerce-notifications-payment-received-hosted
                    onChange={(event) => setSettings((current) => patchPaymentReceived(current, { hostedEnabled: event.target.checked }))}
                  />
                  <span>{copy.paymentReceivedHosted}</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.paymentReceived.suppressFullSettlementReceiptOverlap}
                    data-commerce-notifications-payment-received-suppress-receipt-overlap
                    onChange={(event) => setSettings((current) => patchPaymentReceived(current, { suppressFullSettlementReceiptOverlap: event.target.checked }))}
                  />
                  <span>{copy.paymentReceivedSuppressOverlap}</span>
                </label>
                <small data-commerce-notifications-payment-received-variables>
                  {copy.paymentReceivedVariables}
                </small>
              </details>
            ) : null}
          </article>
        ))}
      </section>

      <section className={styles.grid}>
        <div>
          <h2>{copy.outboxTitle}</h2>
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
                {paymentReceivedSummary(event, locale) ? (
                  <span className={styles.eventSummary} data-commerce-notification-event-summary>
                    {paymentReceivedSummary(event, locale)}
                  </span>
                ) : null}
                <small>{event.status} · {event.subject}</small>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h2>{copy.recoveriesTitle}</h2>
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
