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

const COPY = {
  ko: {
    title: '통화 설정',
    subtitle: '체크아웃 통화는 제어하고, 변환 미리보기 비율은 실제 정산과 분리합니다.',
    products: '제품',
    orders: '주문',
    documents: '문서',
    taxRules: '세금 규칙',
    shipping: '배송',
    notifications: '알림',
    save: '저장',
    stats: {
      base: '기준 통화',
      enabled: '활성 통화',
      mode: '전환 모드',
    },
    notice: '준비됨',
    saving: '통화 설정 저장 중...',
    saved: '통화 설정이 저장되었습니다.',
    saveFailed: '통화 설정 저장에 실패했습니다.',
    policyTitle: '단일 통화 체크아웃은 계속 적용됩니다',
    policyBody: '수동 비율은 미리보기 메타데이터일 뿐입니다. 체크아웃, 주문, 청구서, 수동 결제는 공급자 통화 QA가 끝날 때까지 장바구니 또는 문서 통화로 정산됩니다.',
    controls: '통화 제어',
    baseCurrency: '기준 통화',
    conversionMode: '전환 모드',
    disabled: '비활성화됨',
    previewRates: '수동 미리보기 비율',
    baseRate: '기준 환율',
    equalsBaseAmount: (currency: string) => `1 ${currency} = 기준 금액`,
    previewDisabled: '미리보기 비활성화',
    addManualRate: '기준 통화 환산 비율 · 0 초과 · 예: 42.5',
    enabledLabel: '활성화됨',
  },
  'zh-hant': {
    title: '幣別設定',
    subtitle: '控制結帳幣別，並將轉換預覽比率與實際結算分開。',
    products: '產品',
    orders: '訂單',
    documents: '文件',
    taxRules: '稅務規則',
    shipping: '運送',
    notifications: '通知',
    save: '儲存',
    stats: {
      base: '基礎幣別',
      enabled: '已啟用幣別',
      mode: '轉換模式',
    },
    notice: '已就緒',
    saving: '儲存幣別設定中...',
    saved: '幣別設定已儲存。',
    saveFailed: '幣別設定儲存失敗。',
    policyTitle: '仍維持單幣別結帳',
    policyBody: '手動匯率僅供預覽。結帳、訂單、發票與手動付款仍會以購物車或文件幣別結算，直到供應商幣別 QA 完成。',
    controls: '幣別控制',
    baseCurrency: '基礎幣別',
    conversionMode: '轉換模式',
    disabled: '已停用',
    previewRates: '手動預覽匯率',
    baseRate: '基準匯率',
    equalsBaseAmount: (currency: string) => `1 ${currency} 等於基礎金額`,
    previewDisabled: '預覽已停用',
    addManualRate: '新增手動匯率 · 須大於 0 · 例如：42.5',
    enabledLabel: '已啟用',
  },
  en: {
    title: 'Currency settings',
    subtitle: 'Control checkout currencies and keep conversion preview rates separate from live settlement.',
    products: 'Products',
    orders: 'Orders',
    documents: 'Documents',
    taxRules: 'Tax rules',
    shipping: 'Shipping',
    notifications: 'Notifications',
    save: 'Save',
    stats: {
      base: 'Base currency',
      enabled: 'Enabled currencies',
      mode: 'Conversion mode',
    },
    notice: 'Ready',
    saving: 'Saving currency settings...',
    saved: 'Currency settings saved',
    saveFailed: 'Currency settings save failed',
    policyTitle: 'Single-currency checkout is still enforced',
    policyBody: 'Manual rates are preview metadata only. Checkout, orders, invoices, and manual payments still settle in the cart or document currency until provider currency QA is complete.',
    controls: 'Currency controls',
    baseCurrency: 'Base currency',
    conversionMode: 'Conversion mode',
    disabled: 'Disabled',
    previewRates: 'Manual preview rates',
    baseRate: 'Base rate',
    equalsBaseAmount: (currency: string) => `1 ${currency} equals base amount`,
    previewDisabled: 'Preview disabled',
    addManualRate: 'Rate to base · must be > 0 · e.g. 42.5',
    enabledLabel: 'Enabled',
  },
} satisfies Record<Locale, {
  addManualRate: string;
  baseCurrency: string;
  baseRate: string;
  controls: string;
  conversionMode: string;
  disabled: string;
  documents: string;
  enabledLabel: string;
  equalsBaseAmount: (currency: string) => string;
  notifications: string;
  notice: string;
  orders: string;
  policyBody: string;
  policyTitle: string;
  previewDisabled: string;
  previewRates: string;
  products: string;
  save: string;
  saveFailed: string;
  saved: string;
  saving: string;
  shipping: string;
  stats: { base: string; enabled: string; mode: string };
  subtitle: string;
  taxRules: string;
  title: string;
}>;

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

function statusLabel(locale: Locale, status: ReturnType<typeof currencyRateStatus>): string {
  if (status === 'base') return locale === 'ko' ? '기준 통화' : locale === 'zh-hant' ? '基礎幣別' : 'Base currency';
  if (status === 'ready') return locale === 'ko' ? '미리보기 비율 준비됨' : locale === 'zh-hant' ? '預覽匯率已就緒' : 'Preview rate ready';
  if (status === 'disabled') return locale === 'ko' ? '비활성화됨' : locale === 'zh-hant' ? '已停用' : 'Disabled';
  return locale === 'ko' ? '비율 누락' : locale === 'zh-hant' ? '匯率缺少' : 'Rate missing';
}

export default function CurrencySettingsClient({ locale, siteTitle, initialSettings }: CurrencySettingsClientProps) {
  const c = COPY[locale];
  const [settings, setSettings] = useState(initialSettings);
  const [notice, setNotice] = useState(c.notice);
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
    setNotice(c.saving);
    try {
      const response = await fetch(`/api/builder/commerce/currency-settings?locale=${encodeURIComponent(locale)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; settings?: CommerceCurrencySettings; error?: string };
      if (!response.ok || !payload.ok || !payload.settings) {
        setNotice(payload.error ?? c.saveFailed);
        return;
      }
      setSettings(payload.settings);
      setNotice(c.saved);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.page} data-commerce-currency-admin>
      <header className={styles.header}>
        <div>
          <span>{siteTitle}</span>
          <h1>{c.title}</h1>
          <p>{c.subtitle}</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/admin-builder/commerce/products`}>{c.products}</Link>
          <Link href={`/${locale}/admin-builder/commerce/orders`}>{c.orders}</Link>
          <Link href={`/${locale}/admin-builder/commerce/documents`}>{c.documents}</Link>
          <Link href={`/${locale}/admin-builder/commerce/tax`}>{c.taxRules}</Link>
          <Link href={`/${locale}/admin-builder/commerce/shipping`}>{c.shipping}</Link>
          <Link href={`/${locale}/admin-builder/commerce/notifications`}>{c.notifications}</Link>
          <button type="button" disabled={busy} onClick={() => void save()} data-commerce-currency-save>{c.save}</button>
        </div>
      </header>

      <section className={styles.kpis} aria-label={locale === 'ko' ? '통화 통계' : locale === 'zh-hant' ? '幣別統計' : 'Currency stats'}>
        {Object.entries(kpis).map(([key, value]) => (
          <article key={key} data-commerce-currency-kpi={key}>
            <strong>{value}</strong>
            <span>{key === 'base' ? c.stats.base : key === 'enabled' ? c.stats.enabled : c.stats.mode}</span>
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
        <strong>{c.policyTitle}</strong>
        <span>{c.policyBody}</span>
      </section>

      <section className={styles.settings} aria-label={c.controls}>
        <label>
          <span>{c.baseCurrency}</span>
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
          <span>{c.conversionMode}</span>
          <select
            value={settings.conversionMode}
            data-commerce-currency-mode
            onChange={(event) => setConversionMode(event.target.value as CommerceCurrencyConversionMode)}
          >
            <option value="disabled">{c.disabled}</option>
            <option value="manual-preview">{c.previewRates}</option>
          </select>
        </label>
      </section>

      <section className={styles.matrix} aria-label={locale === 'ko' ? '통화 표' : locale === 'zh-hant' ? '幣別矩陣' : 'Currency matrix'}>
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
                  <span data-commerce-currency-rate-status={currency}>{statusLabel(locale, status)}</span>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={enabled}
                    disabled={isBase}
                    data-commerce-currency-enabled={currency}
                    onChange={(event) => toggleCurrency(currency, event.target.checked)}
                  />
                  <span>{enabled ? c.enabledLabel : c.disabled}</span>
                </label>
              </header>
              <label>
                <span>{isBase ? c.baseRate : c.equalsBaseAmount(currency)}</span>
                <input
                  value={isBase ? '1' : rateInputValue(rate)}
                  inputMode="decimal"
                  disabled={isBase || settings.conversionMode === 'disabled' || !enabled}
                  placeholder={settings.conversionMode === 'disabled' ? c.previewDisabled : c.addManualRate}
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
