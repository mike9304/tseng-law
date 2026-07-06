'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { CommerceTaxRule } from '@/lib/builder/commerce/tax-shared';
import styles from './TaxRules.module.css';

interface TaxRulesClientProps {
  locale: Locale;
  siteTitle: string;
  initialRules: CommerceTaxRule[];
}

function ratePercent(rule: CommerceTaxRule): string {
  return (rule.rateBps / 100).toFixed(2);
}

function newRule(): CommerceTaxRule {
  const stamp = Date.now().toString(36);
  return {
    ruleId: `tax-custom-${stamp}`,
    label: 'Custom tax rule',
    country: 'TW',
    rateBps: 500,
    active: true,
    locale: 'all',
    priority: 0,
  };
}

function patchRule(rules: CommerceTaxRule[], ruleId: string, patch: Partial<CommerceTaxRule>): CommerceTaxRule[] {
  return rules.map((rule) => (rule.ruleId === ruleId ? { ...rule, ...patch } : rule));
}

export default function TaxRulesClient({ locale, siteTitle, initialRules }: TaxRulesClientProps) {
  const [rules, setRules] = useState(initialRules);
  const [notice, setNotice] = useState('Ready');
  const [busy, setBusy] = useState(false);

  const counts = useMemo(() => ({
    total: rules.length,
    active: rules.filter((rule) => rule.active).length,
    countries: new Set(rules.map((rule) => rule.country)).size,
  }), [rules]);

  async function save() {
    setBusy(true);
    setNotice('Saving tax rules...');
    try {
      const response = await fetch(`/api/builder/commerce/tax-rules?locale=${encodeURIComponent(locale)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; rules?: CommerceTaxRule[]; error?: string };
      if (!response.ok || !payload.ok || !Array.isArray(payload.rules)) {
        setNotice(payload.error ?? 'Tax rules save failed');
        return;
      }
      setRules(payload.rules);
      setNotice('Tax rules saved');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page} data-commerce-tax-admin>
      <header className={styles.header}>
        <div>
          <span>{siteTitle}</span>
          <h1>Tax rules</h1>
          <p>Configure checkout tax rates by country, locale, region, priority, and active state.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/admin-builder/commerce/products`}>Products</Link>
          <Link href={`/${locale}/admin-builder/commerce/orders`}>Orders</Link>
          <Link href={`/${locale}/admin-builder/commerce/currency`}>Currency</Link>
          <Link href={`/${locale}/admin-builder/commerce/shipping`}>Shipping</Link>
          <Link href={`/${locale}/admin-builder/commerce/notifications`}>Notifications</Link>
          <Link href={`/${locale}/admin-builder/commerce/webhooks`}>Webhooks</Link>
          <button type="button" onClick={() => setRules((current) => [...current, newRule()])} data-commerce-tax-add>
            Add rule
          </button>
          <button type="button" disabled={busy} onClick={() => void save()} data-commerce-tax-save>
            Save rules
          </button>
        </div>
      </header>

      <section className={styles.kpis} aria-label="Tax stats">
        {Object.entries(counts).map(([key, value]) => (
          <article key={key} data-commerce-tax-kpi={key}>
            <strong>{value}</strong>
            <span>{key}</span>
          </article>
        ))}
      </section>

      <p role="status" className={styles.notice} data-commerce-tax-notice>{notice}</p>

      <section className={styles.rules} aria-label="Tax rules">
        {rules.map((rule) => (
          <article key={rule.ruleId} className={styles.rule} data-commerce-tax-rule-row={rule.ruleId}>
            <label className={styles.wide}>
              <span>Label</span>
              <input
                value={rule.label}
                data-commerce-tax-label={rule.ruleId}
                onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { label: event.target.value }))}
              />
            </label>
            <label>
              <span>Country</span>
              <input
                value={rule.country}
                maxLength={2}
                data-commerce-tax-country={rule.ruleId}
                onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { country: event.target.value.toUpperCase().slice(0, 2) }))}
              />
            </label>
            <label>
              <span>Region</span>
              <input
                value={rule.region ?? ''}
                data-commerce-tax-region={rule.ruleId}
                onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { region: event.target.value || undefined }))}
              />
            </label>
            <label>
              <span>Rate bps</span>
              <input
                value={String(rule.rateBps)}
                inputMode="numeric"
                data-commerce-tax-rate={rule.ruleId}
                onChange={(event) => {
                  const rateBps = Number.parseInt(event.target.value, 10);
                  setRules((current) => patchRule(current, rule.ruleId, {
                    rateBps: Number.isFinite(rateBps) ? Math.max(0, Math.min(10000, rateBps)) : 0,
                  }));
                }}
              />
            </label>
            <label>
              <span>Locale</span>
              <select
                value={rule.locale ?? 'all'}
                data-commerce-tax-locale={rule.ruleId}
                onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { locale: event.target.value as CommerceTaxRule['locale'] }))}
              >
                <option value="all">All locales</option>
                <option value="ko">Korean</option>
                <option value="zh-hant">Traditional Chinese</option>
                <option value="en">English</option>
              </select>
            </label>
            <label>
              <span>Priority</span>
              <input
                value={String(rule.priority)}
                inputMode="numeric"
                data-commerce-tax-priority={rule.ruleId}
                onChange={(event) => {
                  const priority = Number.parseInt(event.target.value, 10);
                  setRules((current) => patchRule(current, rule.ruleId, { priority: Number.isFinite(priority) ? priority : 0 }));
                }}
              />
            </label>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={rule.active}
                data-commerce-tax-active={rule.ruleId}
                onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { active: event.target.checked }))}
              />
              <span>Active</span>
            </label>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={Boolean(rule.includedInPrice)}
                data-commerce-tax-included={rule.ruleId}
                onChange={(event) => setRules((current) => patchRule(current, rule.ruleId, { includedInPrice: event.target.checked }))}
              />
              <span>Included in price</span>
            </label>
            <p data-commerce-tax-rate-preview={rule.ruleId}>{ratePercent(rule)}%</p>
          </article>
        ))}
      </section>
    </main>
  );
}
