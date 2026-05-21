'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { CommerceShippingMethod, CommerceShippingRule } from '@/lib/builder/commerce/shipping-shared';
import type { CommerceCurrency } from '@/lib/builder/commerce/products-shared';
import styles from './ShippingRules.module.css';

interface ShippingRulesClientProps {
  locale: Locale;
  siteTitle: string;
  initialRules: CommerceShippingRule[];
}

function money(cents: number): string {
  return String(cents / 100);
}

function cents(value: string): number {
  const parsed = Number.parseFloat(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed * 100)) : 0;
}

function newRule(): CommerceShippingRule {
  const stamp = Date.now().toString(36);
  return {
    ruleId: `ship-custom-${stamp}`,
    method: 'standard',
    label: 'Custom shipping',
    currency: 'TWD',
    country: 'TW',
    amountCents: 12000,
    active: true,
    locale: 'all',
    priority: 0,
    estimatedDays: '3-5',
  };
}

function patchRule(rules: CommerceShippingRule[], ruleId: string, patch: Partial<CommerceShippingRule>): CommerceShippingRule[] {
  return rules.map((rule) => (rule.ruleId === ruleId ? { ...rule, ...patch } : rule));
}

export default function ShippingRulesClient({ locale, siteTitle, initialRules }: ShippingRulesClientProps) {
  const [rules, setRules] = useState(initialRules);
  const [notice, setNotice] = useState('Ready');
  const [busy, setBusy] = useState(false);

  const counts = useMemo(() => ({
    total: rules.length,
    active: rules.filter((rule) => rule.active).length,
    free: rules.filter((rule) => rule.freeShippingMinSubtotalCents !== undefined).length,
    pickup: rules.filter((rule) => rule.method === 'pickup').length,
  }), [rules]);

  async function save() {
    setBusy(true);
    setNotice('Saving shipping rules...');
    try {
      const response = await fetch('/api/builder/commerce/shipping-rules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; rules?: CommerceShippingRule[]; error?: string };
      if (!response.ok || !payload.ok || !Array.isArray(payload.rules)) {
        setNotice(payload.error ?? 'Shipping rules save failed');
        return;
      }
      setRules(payload.rules);
      setNotice('Shipping rules saved');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page} data-commerce-shipping-admin>
      <header className={styles.header}>
        <div>
          <span>{siteTitle}</span>
          <h1>Shipping rules</h1>
          <p>Configure shipping, pickup, local delivery, delivery estimates, and free shipping thresholds.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/admin-builder/commerce/products`}>Products</Link>
          <Link href={`/${locale}/admin-builder/commerce/orders`}>Orders</Link>
          <Link href={`/${locale}/admin-builder/commerce/currency`}>Currency</Link>
          <Link href={`/${locale}/admin-builder/commerce/tax`}>Tax rules</Link>
          <Link href={`/${locale}/admin-builder/commerce/notifications`}>Notifications</Link>
          <Link href={`/${locale}/admin-builder/commerce/webhooks`}>Webhooks</Link>
          <button type="button" onClick={() => setRules((current) => [...current, newRule()])} data-commerce-shipping-add>Add rule</button>
          <button type="button" disabled={busy} onClick={() => void save()} data-commerce-shipping-save>Save rules</button>
        </div>
      </header>

      <section className={styles.kpis} aria-label="Shipping stats">
        {Object.entries(counts).map(([key, value]) => (
          <article key={key} data-commerce-shipping-kpi={key}>
            <strong>{value}</strong>
            <span>{key}</span>
          </article>
        ))}
      </section>

      <p role="status" className={styles.notice} data-commerce-shipping-notice>{notice}</p>

      <section className={styles.rules} aria-label="Shipping rules">
        {rules.map((rule) => (
          <article key={rule.ruleId} className={styles.rule} data-commerce-shipping-rule-row={rule.ruleId}>
            <label className={styles.wide}>
              <span>Label</span>
              <input value={rule.label} data-commerce-shipping-label={rule.ruleId} onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { label: event.target.value }))} />
            </label>
            <label>
              <span>Method</span>
              <select value={rule.method} data-commerce-shipping-method={rule.ruleId} onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { method: event.target.value as CommerceShippingMethod }))}>
                <option value="digital">Digital</option>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="pickup">Pickup</option>
                <option value="local-delivery">Local delivery</option>
              </select>
            </label>
            <label>
              <span>Currency</span>
              <select value={rule.currency} data-commerce-shipping-currency={rule.ruleId} onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { currency: event.target.value as CommerceCurrency }))}>
                <option value="TWD">TWD</option>
                <option value="KRW">KRW</option>
                <option value="USD">USD</option>
              </select>
            </label>
            <label>
              <span>Country</span>
              <input value={rule.country ?? ''} maxLength={2} data-commerce-shipping-country={rule.ruleId} onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { country: event.target.value.toUpperCase().slice(0, 2) || undefined }))} />
            </label>
            <label>
              <span>Rate</span>
              <input value={money(rule.amountCents)} inputMode="decimal" data-commerce-shipping-amount={rule.ruleId} onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { amountCents: cents(event.target.value) }))} />
            </label>
            <label>
              <span>Free over</span>
              <input value={rule.freeShippingMinSubtotalCents === undefined ? '' : money(rule.freeShippingMinSubtotalCents)} inputMode="decimal" data-commerce-shipping-free={rule.ruleId} onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { freeShippingMinSubtotalCents: event.target.value ? cents(event.target.value) : undefined }))} />
            </label>
            <label>
              <span>Days</span>
              <input value={rule.estimatedDays} data-commerce-shipping-days={rule.ruleId} onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { estimatedDays: event.target.value }))} />
            </label>
            <label>
              <span>Priority</span>
              <input value={String(rule.priority)} inputMode="numeric" data-commerce-shipping-priority={rule.ruleId} onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { priority: Number.parseInt(event.target.value, 10) || 0 }))} />
            </label>
            <label className={styles.check}>
              <input type="checkbox" checked={rule.active} data-commerce-shipping-active={rule.ruleId} onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { active: event.target.checked }))} />
              <span>Active</span>
            </label>
          </article>
        ))}
      </section>
    </main>
  );
}
