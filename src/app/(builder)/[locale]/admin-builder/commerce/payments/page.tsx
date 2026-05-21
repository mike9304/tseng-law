import Link from 'next/link';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { listOrders } from '@/lib/builder/commerce/orders-engine';
import { listBookings, listServices } from '@/lib/builder/bookings/storage';
import {
  buildPaymentAnalytics,
  type PaymentAnalyticsCurrencyTotal,
  type PaymentAnalyticsSourceSummary,
} from '@/lib/builder/payment-analytics';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from '@/components/builder/commerce/OrderManager.module.css';

export const dynamic = 'force-dynamic';

function moneyDivisor(currency: string): number {
  return currency === 'KRW' || currency === 'JPY' ? 1 : 100;
}

function formatMoney(locale: Locale, total?: PaymentAnalyticsCurrencyTotal): string {
  if (!total) return '-';
  return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : locale === 'zh-hant' ? 'zh-TW' : 'en-US', {
    currency: total.currency,
    maximumFractionDigits: moneyDivisor(total.currency) === 1 ? 0 : 2,
    style: 'currency',
  }).format(total.netCollected / moneyDivisor(total.currency));
}

function formatCurrencyAmount(locale: Locale, currency: string, amount: number): string {
  return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : locale === 'zh-hant' ? 'zh-TW' : 'en-US', {
    currency,
    maximumFractionDigits: moneyDivisor(currency) === 1 ? 0 : 2,
    style: 'currency',
  }).format(amount / moneyDivisor(currency));
}

function formatRate(rate: number): string {
  return `${rate.toFixed(1)}%`;
}

function sourceRows(summary: PaymentAnalyticsSourceSummary): Array<{ label: string; value: string; tone: string }> {
  return [
    { label: 'Attempts', value: String(summary.paymentAttempts), tone: 'neutral' },
    { label: 'Converted', value: `${summary.successfulPayments} · ${formatRate(summary.paymentConversionRate)}`, tone: 'good' },
    { label: 'Partial', value: String(summary.partialPayments), tone: 'neutral' },
    { label: 'Failed', value: `${summary.failedPayments} · ${formatRate(summary.failedPaymentRate)}`, tone: summary.failedPayments > 0 ? 'warn' : 'good' },
    { label: 'Refunded', value: `${summary.refundedPayments} · ${formatRate(summary.refundRate)}`, tone: summary.refundedPayments > 0 ? 'warn' : 'neutral' },
  ];
}

export default async function CommercePaymentsAnalyticsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const [orders, bookings, services] = await Promise.all([
    listOrders({ locale }),
    listBookings({ includeCancelled: true }),
    listServices(true),
  ]);
  const analytics = buildPaymentAnalytics({ orders, bookings, services });
  const primaryCurrency = analytics.totals.currencyTotals[0];

  return (
    <main className={styles.page} data-payment-analytics-page>
      <header className={styles.header}>
        <div>
          <span>{site.name}</span>
          <h1>Payment analytics</h1>
          <p>Revenue, conversion, refund, failed payment, and outstanding balance summaries across orders and bookings.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/admin-builder/commerce/products`}>Products</Link>
          <Link href={`/${locale}/admin-builder/commerce/orders`}>Orders</Link>
          <Link href={`/${locale}/admin-builder/commerce/documents`}>Documents</Link>
          <Link href={`/${locale}/admin-builder/commerce/webhooks`}>Webhooks</Link>
          <Link href={`/${locale}/admin-builder/bookings/dashboard`}>Bookings</Link>
        </div>
      </header>

      <section className={styles.paymentHero} data-payment-analytics-summary>
        <div>
          <span>Net collected</span>
          <strong data-payment-analytics-net>{formatMoney(locale, primaryCurrency)}</strong>
          <p>
            {analytics.totals.successfulPayments} successful payments from {analytics.totals.paymentAttempts} attempts.
            Generated {new Date(analytics.generatedAt).toLocaleString()}.
          </p>
        </div>
        <div className={styles.paymentHeroStats}>
          <article data-payment-analytics-card="conversion">
            <span>Conversion</span>
            <strong>{formatRate(analytics.totals.paymentConversionRate)}</strong>
          </article>
          <article data-payment-analytics-card="failed">
            <span>Failed</span>
            <strong>{analytics.totals.failedPayments}</strong>
          </article>
          <article data-payment-analytics-card="refunds">
            <span>Refunded</span>
            <strong>{analytics.totals.refundedPayments}</strong>
          </article>
        </div>
      </section>

      <section className={styles.kpis} aria-label="Payment stats">
        <article data-payment-analytics-kpi="attempts">
          <strong>{analytics.totals.paymentAttempts}</strong>
          <span>attempts</span>
        </article>
        <article data-payment-analytics-kpi="successful">
          <strong>{analytics.totals.successfulPayments}</strong>
          <span>successful</span>
        </article>
        <article data-payment-analytics-kpi="partial">
          <strong>{analytics.totals.partialPayments}</strong>
          <span>partial</span>
        </article>
        <article data-payment-analytics-kpi="failed">
          <strong>{analytics.totals.failedPayments}</strong>
          <span>failed</span>
        </article>
        <article data-payment-analytics-kpi="refunded">
          <strong>{analytics.totals.refundedPayments}</strong>
          <span>refunded</span>
        </article>
        <article data-payment-analytics-kpi="currencies">
          <strong>{analytics.totals.currencyTotals.length}</strong>
          <span>currencies</span>
        </article>
      </section>

      <section className={styles.paymentAnalyticsGrid} aria-label="Payment analytics details">
        <article className={styles.paymentAnalyticsPanel} data-payment-analytics-currencies>
          <div className={styles.paymentPanelHeader}>
            <div>
              <span>Revenue by currency</span>
              <h2>Collected, refunded, net, and due</h2>
            </div>
          </div>
          {analytics.totals.currencyTotals.length > 0 ? (
            <div className={styles.paymentCurrencyTable}>
              <div className={styles.paymentCurrencyHeader}>
                <span>Currency</span>
                <span>Gross</span>
                <span>Refunded</span>
                <span>Net</span>
                <span>Outstanding</span>
              </div>
              {analytics.totals.currencyTotals.map((total) => (
                <div key={total.currency} data-payment-analytics-currency={total.currency}>
                  <strong>{total.currency}</strong>
                  <span>{formatCurrencyAmount(locale, total.currency, total.grossCollected)}</span>
                  <span>{formatCurrencyAmount(locale, total.currency, total.refunded)} · {formatRate(total.refundShareRate)}</span>
                  <span>{formatCurrencyAmount(locale, total.currency, total.netCollected)}</span>
                  <span>{formatCurrencyAmount(locale, total.currency, total.outstanding)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.paymentEmpty}>No payment activity has been recorded yet.</p>
          )}
        </article>

        <article className={styles.paymentAnalyticsPanel} data-payment-analytics-sources>
          <div className={styles.paymentPanelHeader}>
            <div>
              <span>Source quality</span>
              <h2>Orders vs. bookings</h2>
            </div>
          </div>
          <div className={styles.paymentSourceGrid}>
            {[
              ['Orders', analytics.orders] as const,
              ['Bookings', analytics.bookings] as const,
            ].map(([label, summary]) => (
              <section key={label} data-payment-analytics-source={label.toLowerCase()}>
                <h3>{label}</h3>
                {sourceRows(summary).map((row) => (
                  <div key={row.label} data-payment-analytics-source-row={row.label.toLowerCase()}>
                    <span>{row.label}</span>
                    <strong data-tone={row.tone}>{row.value}</strong>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
