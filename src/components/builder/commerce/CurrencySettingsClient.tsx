'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import {
  COMMERCE_SUPPORTED_CURRENCIES,
  currencyRateStatus,
  type CommerceCurrencyConversionMode,
  type CommerceCurrencyRate,
  type CommerceCurrencySettings,
} from '@/lib/builder/commerce/currency-shared';
import type { CommerceCurrency } from '@/lib/builder/commerce/products-shared';
import styles from './CurrencySettings.module.css';

interface CurrencySettingsClientProps {
  locale: Locale;
  siteTitle: string;
  initialSettings: CommerceCurrencySettings;
}

function patchRate(rates: CommerceCurrencyRate[], currency: CommerceCurrency, patch: Partial<CommerceCurrencyRate>): CommerceCurrencyRate[] {
  return COMMERCE_SUPPORTED_CURRENCIES.map((entry) => {
    const current = rates.find((rate) => rate.currency === entry) ?? {
      currency: entry,
      enabled: true,
      updatedAt: new Date().toISOString(),
    };
    return entry === currency ? { ...current, ...patch, currency } : current;
  });
}

function rateInputValue(rate: CommerceCurrencyRate | undefined): string {
  return typeof rate?.rateToBase === 'number' ? String(rate.rateToBase) : '';
}

function statusLabel(status: ReturnType<typeof currencyRateStatus>): string {
  if (status === 'base') return 'Base currency';
  if (status === 'ready') return 'Preview rate ready';
  if (status === 'disabled') return 'Disabled';
  return 'Rate missing';
}

export default function CurrencySettingsClient({ locale, siteTitle, initialSettings }: CurrencySettingsClientProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [notice, setNotice] = useState('Ready');
  const [busy, setBusy] = useState(false);

  const kpis = useMemo(() => ({
    base: settings.baseCurrency,
    enabled: settings.supportedCurrencies.length,
    mode: settings.conversionMode === 'manual-preview' ? 'preview' : 'disabled',
  }), [settings]);

  function setBaseCurrency(baseCurrency: CommerceCurrency) {
    setSettings((current) => ({
      ...current,
      baseCurrency,
      supportedCurrencies: Array.from(new Set([baseCurrency, ...current.supportedCurrencies])),
      rates: patchRate(current.rates, baseCurrency, { enabled: true, rateToBase: 1 }),
    }));
  }

  function setConversionMode(conversionMode: CommerceCurrencyConversionMode) {
    setSettings((current) => ({ ...current, conversionMode }));
  }

  function toggleCurrency(currency: CommerceCurrency, enabled: boolean) {
    setSettings((current) => {
      const nextSupported = enabled
        ? Array.from(new Set([...current.supportedCurrencies, currency]))
        : current.supportedCurrencies.filter((entry) => entry !== currency);
      const supportedCurrencies = nextSupported.includes(current.baseCurrency)
        ? nextSupported
        : [current.baseCurrency, ...nextSupported];
      return {
        ...current,
        supportedCurrencies,
        rates: patchRate(current.rates, currency, { enabled: supportedCurrencies.includes(currency) }),
      };
    });
  }

  function setRate(currency: CommerceCurrency, value: string) {
    const parsed = Number(value.trim());
    setSettings((current) => ({
      ...current,
      rates: patchRate(current.rates, currency, {
        rateToBase: Number.isFinite(parsed) && parsed > 0 ? parsed : undefined,
      }),
    }));
  }

  async function save() {
    setBusy(true);
    setNotice('Saving currency settings...');
    try {
      const response = await fetch('/api/builder/commerce/currency-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; settings?: CommerceCurrencySettings; error?: string };
      if (!response.ok || !payload.ok || !payload.settings) {
        setNotice(payload.error ?? 'Currency settings save failed');
        return;
      }
      setSettings(payload.settings);
      setNotice('Currency settings saved');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page} data-commerce-currency-admin>
      <header className={styles.header}>
        <div>
          <span>{siteTitle}</span>
          <h1>Currency settings</h1>
          <p>Control checkout currencies and keep conversion preview rates separate from live settlement.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/admin-builder/commerce/products`}>Products</Link>
          <Link href={`/${locale}/admin-builder/commerce/orders`}>Orders</Link>
          <Link href={`/${locale}/admin-builder/commerce/documents`}>Documents</Link>
          <Link href={`/${locale}/admin-builder/commerce/tax`}>Tax rules</Link>
          <Link href={`/${locale}/admin-builder/commerce/shipping`}>Shipping</Link>
          <Link href={`/${locale}/admin-builder/commerce/notifications`}>Notifications</Link>
          <button type="button" disabled={busy} onClick={() => void save()} data-commerce-currency-save>Save</button>
        </div>
      </header>

      <section className={styles.kpis} aria-label="Currency stats">
        {Object.entries(kpis).map(([key, value]) => (
          <article key={key} data-commerce-currency-kpi={key}>
            <strong>{value}</strong>
            <span>{key}</span>
          </article>
        ))}
      </section>

      <p className={styles.notice} role="status" data-commerce-currency-notice>{notice}</p>

      <section
        className={styles.policy}
        data-commerce-currency-policy
        data-commerce-currency-settings
        data-commerce-currency-supported={settings.supportedCurrencies.join(',')}
        data-commerce-currency-conversion-status={settings.conversionMode === 'disabled' ? 'off' : 'preview'}
      >
        <strong>Single-currency checkout is still enforced</strong>
        <span>Manual rates are preview metadata only. Checkout, orders, invoices, and manual payments still settle in the cart or document currency until provider currency QA is complete.</span>
      </section>

      <section className={styles.settings} aria-label="Currency controls">
        <label>
          <span>Base currency</span>
          <select
            value={settings.baseCurrency}
            data-commerce-currency-base
            onChange={(event) => setBaseCurrency(event.target.value as CommerceCurrency)}
          >
            {COMMERCE_SUPPORTED_CURRENCIES.map((currency) => (
              <option key={currency} value={currency} data-commerce-currency-supported-option={currency}>{currency}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Conversion mode</span>
          <select
            value={settings.conversionMode}
            data-commerce-currency-mode
            onChange={(event) => setConversionMode(event.target.value as CommerceCurrencyConversionMode)}
          >
            <option value="disabled">Disabled</option>
            <option value="manual-preview">Manual preview rates</option>
          </select>
        </label>
      </section>

      <section className={styles.matrix} aria-label="Currency matrix">
        {COMMERCE_SUPPORTED_CURRENCIES.map((currency) => {
          const rate = settings.rates.find((entry) => entry.currency === currency);
          const enabled = settings.supportedCurrencies.includes(currency);
          const isBase = settings.baseCurrency === currency;
          const status = currencyRateStatus(settings, currency);
          return (
            <article
              key={currency}
              className={styles.currencyCard}
              data-commerce-currency-row={currency}
              data-commerce-currency-rate-state={status}
            >
              <header>
                <div>
                  <strong>{currency}</strong>
                  <span data-commerce-currency-rate-status={currency}>{statusLabel(status)}</span>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={enabled}
                    disabled={isBase}
                    data-commerce-currency-enabled={currency}
                    onChange={(event) => toggleCurrency(currency, event.target.checked)}
                  />
                  <span>{enabled ? 'Enabled' : 'Disabled'}</span>
                </label>
              </header>
              <label>
                <span>{isBase ? 'Base rate' : `1 ${currency} equals base amount`}</span>
                <input
                  value={isBase ? '1' : rateInputValue(rate)}
                  inputMode="decimal"
                  disabled={isBase || settings.conversionMode === 'disabled' || !enabled}
                  placeholder={settings.conversionMode === 'disabled' ? 'Preview disabled' : 'Add manual rate'}
                  data-commerce-currency-rate={currency}
                  onChange={(event) => setRate(currency, event.target.value)}
                />
              </label>
            </article>
          );
        })}
      </section>
    </main>
  );
}
