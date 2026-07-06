import Link from 'next/link';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { listPaymentWebhookEvents } from '@/lib/builder/commerce/payment-webhooks-engine';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { listOrders } from '@/lib/builder/commerce/orders-engine';
import { listBookings, listServices } from '@/lib/builder/bookings/storage';
import PaymentAnalyticsExportClient from '@/components/builder/commerce/PaymentAnalyticsExportClient';
import {
  buildPaymentAnalyticsAlerts,
  buildPaymentAnalytics,
  type PaymentAnalyticsAlert,
  type PaymentAnalyticsCurrencyTotal,
  type PaymentAnalyticsProviderFeeSummary,
  type PaymentAnalyticsProviderSummary,
  type PaymentAnalyticsSourceSummary,
  type PaymentAnalyticsSourceFunnelSummary,
  type PaymentAnalyticsWebhookFeeProviderSummary,
  type PaymentAnalyticsWebhookReconciliationSummary,
  type PaymentAnalyticsTrendPoint,
} from '@/lib/builder/payment-analytics';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from '@/components/builder/commerce/OrderManager.module.css';

export const dynamic = 'force-dynamic';

const COPY = {
  ko: {
    title: '결제 분석',
    description: '주문과 예약 전반의 매출, 전환, 환불, 실패 결제, 미수금 현황을 한 번에 확인합니다.',
    products: '제품',
    orders: '주문',
    documents: '문서',
    webhooks: '웹훅',
    bookings: '예약',
    netCollected: '실제 수금',
    successfulPayments: '성공한 결제',
    attempts: '시도',
    conversion: '전환율',
    failed: '실패',
    refunded: '환불',
    paymentStats: '결제 통계',
    alerts: '알림',
    paymentIssues: '결제 이슈와 잔액 신호',
    critical: '긴급',
    review: '검토',
    info: '정보',
    noAlerts: '현재 결제 알림이 없습니다.',
    revenueByCurrency: '통화별 매출',
    collectedRefundedNetDue: '수금, 환불, 순액, 미수금',
    currency: '통화',
    gross: '총액',
    refundedGross: '환불',
    net: '순액',
    outstanding: '미수금',
    noCurrencyActivity: '아직 기록된 결제 활동이 없습니다.',
    sourceQuality: '출처 품질',
    ordersVsBookings: '주문 vs 예약',
    sourceFunnel: '출처 퍼널',
    ordersVsWebAndAdminBookings: '주문 vs 웹 예약 및 관리자 예약',
    paymentAttempts: '결제 시도',
    noSourceFunnel: '아직 기록된 출처별 결제 활동이 없습니다.',
    liveReconciliation: '실시간 대사',
    paymentWebhookLedgerCoverage: '결제 웹훅 원장 범위',
    eventStatus: '이벤트 상태',
    amountCoverage: '금액 범위',
    reported: '보고됨',
    matched: '일치',
    unmatched: '불일치',
    amountCurrencyMismatches: '금액 / 통화 불일치',
    recentMismatchReasons: '최근 불일치 사유',
    recentEvents: '최근 이벤트',
    noWebhookEvents: '아직 기록된 결제 웹훅 이벤트가 없습니다.',
    providerFeeReconciliation: '공급자 수수료 대사',
    feesAndNetReportedByWebhookPayloads: '웹훅 페이로드로 보고된 수수료와 순액',
    webhooksWithFeeMetadata: '수수료 메타데이터가 있는 웹훅',
    ledgerCoverage: '원장 범위',
    feeEventsMissingFeeData: '수수료 이벤트 / 누락된 수수료 데이터',
    reportedFee: '보고된 수수료',
    reportedNet: '보고된 순액',
    noWebhookFees: '아직 기록된 웹훅 수수료 메타데이터가 없습니다.',
    trendChart: '추세 차트',
    sevenDayGrossCollectedAndRefundTrend: '7일 총 수금 및 환불 추세',
    noTrendData: '아직 결제 추세 데이터가 없습니다.',
    providerMix: '공급자 구성',
    orderPaymentAdapterAttribution: '주문 결제 어댑터 기여도',
    ordersOnly: '주문만',
    noProviderPayments: '아직 기록된 공급자별 주문 결제가 없습니다.',
    providerFees: '공급자 수수료',
    estimatedPaymentProcessorCostByAdapter: '어댑터별 예상 결제 처리 비용',
    estimatesNote: '예상치는 현재 어댑터 구성과 내장 수수료 가정표를 사용하며, 실제 공급자 청구서는 아닙니다.',
    noFeeEstimates: '아직 사용할 수 있는 공급자 수수료 예상치가 없습니다.',
    attemptsLabel: '시도',
    convertedLabel: '전환됨',
    partialLabel: '부분 결제',
    failedLabel: '실패',
    refundedLabel: '환불됨',
    totalEvents: '총 이벤트',
    processed: '처리됨',
    ignored: '무시됨',
    replayed: '재생됨',
    feeEvents: '수수료 이벤트',
    missingFeeData: '수수료 데이터 누락',
    sourceRows: {
      attempts: '시도',
      converted: '전환됨',
      partial: '부분 결제',
      failed: '실패',
      refunded: '환불됨',
      feeEvents: '수수료 이벤트',
      feeReported: '보고된 수수료',
      feeNet: '보고된 순액',
      missingFeeData: '수수료 데이터 누락',
      amountReported: '보고됨',
      amountMatched: '일치',
      amountUnmatched: '불일치',
      mismatchCounts: '금액 / 통화 불일치',
    },
    sourceLabels: {
      orders: '주문',
      bookings: '예약',
      web: '웹 예약',
      admin: '관리자 예약',
      paymentAttempts: '결제 시도',
    },
  },
  'zh-hant': {
    title: '付款分析',
    description: '一次查看訂單與預約的營收、轉換、退款、失敗付款與未結餘額。',
    products: '產品',
    orders: '訂單',
    documents: '文件',
    webhooks: 'Webhook',
    bookings: '預約',
    netCollected: '實際收款',
    successfulPayments: '成功付款',
    attempts: '次數',
    conversion: '轉換率',
    failed: '失敗',
    refunded: '已退款',
    paymentStats: '付款統計',
    alerts: '警示',
    paymentIssues: '付款問題與餘額訊號',
    critical: '重大',
    review: '檢視',
    info: '資訊',
    noAlerts: '目前沒有付款警示。',
    revenueByCurrency: '依幣別營收',
    collectedRefundedNetDue: '收款、退款、淨額、未結',
    currency: '幣別',
    gross: '總額',
    refundedGross: '退款',
    net: '淨額',
    outstanding: '未結',
    noCurrencyActivity: '目前尚無付款活動紀錄。',
    sourceQuality: '來源品質',
    ordersVsBookings: '訂單 vs 預約',
    sourceFunnel: '來源漏斗',
    ordersVsWebAndAdminBookings: '訂單 vs 網站與後台預約',
    paymentAttempts: '付款次數',
    noSourceFunnel: '目前尚無按來源的付款活動紀錄。',
    liveReconciliation: '即時對帳',
    paymentWebhookLedgerCoverage: '付款 Webhook 分錄覆蓋',
    eventStatus: '事件狀態',
    amountCoverage: '金額覆蓋',
    reported: '已回報',
    matched: '已比對',
    unmatched: '未比對',
    amountCurrencyMismatches: '金額 / 幣別不符',
    recentMismatchReasons: '最近的不符原因',
    recentEvents: '最近事件',
    noWebhookEvents: '目前尚無付款 Webhook 事件紀錄。',
    providerFeeReconciliation: '供應商費用對帳',
    feesAndNetReportedByWebhookPayloads: 'Webhook 負載回報的費用與淨額',
    webhooksWithFeeMetadata: '含費用中繼資料的 Webhook',
    ledgerCoverage: '分錄覆蓋',
    feeEventsMissingFeeData: '費用事件 / 缺少費用資料',
    reportedFee: '已回報費用',
    reportedNet: '已回報淨額',
    noWebhookFees: '目前尚無已記錄的 Webhook 費用中繼資料。',
    trendChart: '趨勢圖',
    sevenDayGrossCollectedAndRefundTrend: '7 天總收款與退款趨勢',
    noTrendData: '目前尚無付款趨勢資料。',
    providerMix: '供應商組合',
    orderPaymentAdapterAttribution: '訂單付款介面歸因',
    ordersOnly: '僅訂單',
    noProviderPayments: '目前尚無供應商別的訂單付款紀錄。',
    providerFees: '供應商費用',
    estimatedPaymentProcessorCostByAdapter: '依介面估算的付款處理成本',
    estimatesNote: '估算值使用目前的介面組合與內建費用假設表，並非實際供應商帳單。',
    noFeeEstimates: '目前尚無可用的供應商費用估算。',
    attemptsLabel: '次數',
    convertedLabel: '已轉換',
    partialLabel: '部分付款',
    failedLabel: '失敗',
    refundedLabel: '已退款',
    totalEvents: '事件總數',
    processed: '已處理',
    ignored: '已忽略',
    replayed: '已重播',
    feeEvents: '費用事件',
    missingFeeData: '缺少費用資料',
    sourceRows: {
      attempts: '次數',
      converted: '已轉換',
      partial: '部分付款',
      failed: '失敗',
      refunded: '已退款',
      feeEvents: '費用事件',
      feeReported: '已回報費用',
      feeNet: '已回報淨額',
      missingFeeData: '缺少費用資料',
      amountReported: '已回報',
      amountMatched: '已比對',
      amountUnmatched: '未比對',
      mismatchCounts: '金額 / 幣別不符',
    },
    sourceLabels: {
      orders: '訂單',
      bookings: '預約',
      web: '網站預約',
      admin: '後台預約',
      paymentAttempts: '付款次數',
    },
  },
  en: {
    title: 'Payment analytics',
    description: 'Revenue, conversion, refund, failed payment, and outstanding balance summaries across orders and bookings.',
    products: 'Products',
    orders: 'Orders',
    documents: 'Documents',
    webhooks: 'Webhooks',
    bookings: 'Bookings',
    netCollected: 'Net collected',
    successfulPayments: 'Successful payments',
    attempts: 'Attempts',
    conversion: 'Conversion',
    failed: 'Failed',
    refunded: 'Refunded',
    paymentStats: 'Payment stats',
    alerts: 'Alerts',
    paymentIssues: 'Payment issues and balance signals',
    critical: 'Critical',
    review: 'Review',
    info: 'Info',
    noAlerts: 'No payment alerts right now.',
    revenueByCurrency: 'Revenue by currency',
    collectedRefundedNetDue: 'Collected, refunded, net, and due',
    currency: 'Currency',
    gross: 'Gross',
    refundedGross: 'Refunded',
    net: 'Net',
    outstanding: 'Outstanding',
    noCurrencyActivity: 'No payment activity has been recorded yet.',
    sourceQuality: 'Source quality',
    ordersVsBookings: 'Orders vs. bookings',
    sourceFunnel: 'Source funnel',
    ordersVsWebAndAdminBookings: 'Orders vs. web and admin bookings',
    paymentAttempts: 'Payment attempts',
    noSourceFunnel: 'No source-funnel payment activity has been recorded yet.',
    liveReconciliation: 'Live reconciliation',
    paymentWebhookLedgerCoverage: 'Payment webhook ledger coverage',
    eventStatus: 'Event status',
    amountCoverage: 'Amount coverage',
    reported: 'Reported',
    matched: 'Matched',
    unmatched: 'Unmatched',
    amountCurrencyMismatches: 'Amount / currency mismatches',
    recentMismatchReasons: 'Recent mismatch reasons',
    recentEvents: 'Recent events',
    noWebhookEvents: 'No payment webhook events have been recorded yet.',
    providerFeeReconciliation: 'Provider fee reconciliation',
    feesAndNetReportedByWebhookPayloads: 'Fees and net amounts reported by webhook payloads',
    webhooksWithFeeMetadata: 'Webhooks with fee metadata',
    ledgerCoverage: 'Ledger coverage',
    feeEventsMissingFeeData: 'Fee events / missing fee data',
    reportedFee: 'Reported fee',
    reportedNet: 'Reported net',
    noWebhookFees: 'No webhook fee metadata has been recorded yet.',
    trendChart: 'Trend chart',
    sevenDayGrossCollectedAndRefundTrend: '7-day gross collected and refund trend',
    noTrendData: 'No payment trend data is available yet.',
    providerMix: 'Provider mix',
    orderPaymentAdapterAttribution: 'Order payment adapter attribution',
    ordersOnly: 'Orders only',
    noProviderPayments: 'No provider-specific order payments have been recorded yet.',
    providerFees: 'Provider fees',
    estimatedPaymentProcessorCostByAdapter: 'Estimated payment processor cost by adapter',
    estimatesNote: 'Estimates use the current adapter mix and a built-in fee assumption table; they are not settled provider invoices.',
    noFeeEstimates: 'No provider-fee estimates are available yet.',
    attemptsLabel: 'Attempts',
    convertedLabel: 'Converted',
    partialLabel: 'Partial',
    failedLabel: 'Failed',
    refundedLabel: 'Refunded',
    totalEvents: 'Total events',
    processed: 'Processed',
    ignored: 'Ignored',
    replayed: 'Replayed',
    feeEvents: 'Fee events',
    missingFeeData: 'Missing fee data',
    sourceRows: {
      attempts: 'Attempts',
      converted: 'Converted',
      partial: 'Partial',
      failed: 'Failed',
      refunded: 'Refunded',
      feeEvents: 'Fee events',
      feeReported: 'Reported fee',
      feeNet: 'Reported net',
      missingFeeData: 'Missing fee data',
      amountReported: 'Reported',
      amountMatched: 'Matched',
      amountUnmatched: 'Unmatched',
      mismatchCounts: 'Amount / currency mismatches',
    },
    sourceLabels: {
      orders: 'Orders',
      bookings: 'Bookings',
      web: 'Web bookings',
      admin: 'Admin bookings',
      paymentAttempts: 'Payment attempts',
    },
  },
} satisfies Record<Locale, {
  title: string;
  description: string;
  products: string;
  orders: string;
  documents: string;
  webhooks: string;
  bookings: string;
  netCollected: string;
  successfulPayments: string;
  attempts: string;
  conversion: string;
  failed: string;
  refunded: string;
  paymentStats: string;
  alerts: string;
  paymentIssues: string;
  critical: string;
  review: string;
  info: string;
  noAlerts: string;
  revenueByCurrency: string;
  collectedRefundedNetDue: string;
  currency: string;
  gross: string;
  refundedGross: string;
  net: string;
  outstanding: string;
  noCurrencyActivity: string;
  sourceQuality: string;
  ordersVsBookings: string;
  sourceFunnel: string;
  ordersVsWebAndAdminBookings: string;
  paymentAttempts: string;
  noSourceFunnel: string;
  liveReconciliation: string;
  paymentWebhookLedgerCoverage: string;
  eventStatus: string;
  amountCoverage: string;
  reported: string;
  matched: string;
  unmatched: string;
  amountCurrencyMismatches: string;
  recentMismatchReasons: string;
  recentEvents: string;
  noWebhookEvents: string;
  providerFeeReconciliation: string;
  feesAndNetReportedByWebhookPayloads: string;
  webhooksWithFeeMetadata: string;
  ledgerCoverage: string;
  feeEventsMissingFeeData: string;
  reportedFee: string;
  reportedNet: string;
  noWebhookFees: string;
  trendChart: string;
  sevenDayGrossCollectedAndRefundTrend: string;
  noTrendData: string;
  providerMix: string;
  orderPaymentAdapterAttribution: string;
  ordersOnly: string;
  noProviderPayments: string;
  providerFees: string;
  estimatedPaymentProcessorCostByAdapter: string;
  estimatesNote: string;
  noFeeEstimates: string;
  attemptsLabel: string;
  convertedLabel: string;
  partialLabel: string;
  failedLabel: string;
  refundedLabel: string;
  totalEvents: string;
  processed: string;
  ignored: string;
  replayed: string;
  feeEvents: string;
  missingFeeData: string;
  sourceRows: {
    attempts: string;
    converted: string;
    partial: string;
    failed: string;
    refunded: string;
    feeEvents: string;
    feeReported: string;
    feeNet: string;
    missingFeeData: string;
    amountReported: string;
    amountMatched: string;
    amountUnmatched: string;
    mismatchCounts: string;
  };
  sourceLabels: {
    orders: string;
    bookings: string;
    web: string;
    admin: string;
    paymentAttempts: string;
  };
}>;

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

function summarySentence(locale: Locale, successful: number, attempts: number, generatedAt: string): string {
  if (locale === 'ko') return `${attempts}회 시도 중 ${successful}건이 성공했습니다. 생성 시각: ${generatedAt}.`;
  if (locale === 'zh-hant') return `${attempts} 次嘗試中有 ${successful} 次成功。產生時間：${generatedAt}。`;
  return `${successful} successful payments from ${attempts} attempts. Generated ${generatedAt}.`;
}

function sourceRows(locale: Locale, summary: PaymentAnalyticsSourceSummary): Array<{ label: string; value: string; tone: string }> {
  const copy = COPY[locale];
  return [
    { label: copy.sourceRows.attempts, value: String(summary.paymentAttempts), tone: 'neutral' },
    { label: copy.sourceRows.converted, value: `${summary.successfulPayments} · ${formatRate(summary.paymentConversionRate)}`, tone: 'good' },
    { label: copy.sourceRows.partial, value: String(summary.partialPayments), tone: 'neutral' },
    { label: copy.sourceRows.failed, value: `${summary.failedPayments} · ${formatRate(summary.failedPaymentRate)}`, tone: summary.failedPayments > 0 ? 'warn' : 'good' },
    { label: copy.sourceRows.refunded, value: `${summary.refundedPayments} · ${formatRate(summary.refundRate)}`, tone: summary.refundedPayments > 0 ? 'warn' : 'neutral' },
  ];
}

function trendRows(locale: Locale, points: PaymentAnalyticsTrendPoint[]): Array<{
  day: string;
  label: string;
  attempts: number;
  successful: number;
  failed: number;
  refunded: number;
  width: number;
}> {
  const maxAttempts = Math.max(1, ...points.map((point) => point.paymentAttempts));
  return points.map((point) => ({
    day: point.day,
    label: new Date(`${point.day}T00:00:00Z`).toLocaleDateString(locale === 'ko' ? 'ko-KR' : locale === 'zh-hant' ? 'zh-TW' : 'en-US', {
      month: 'short',
      day: 'numeric',
    }),
    attempts: point.paymentAttempts,
    successful: point.successfulPayments,
    failed: point.failedPayments,
    refunded: point.refundedPayments,
    width: Math.max(6, Math.round((point.paymentAttempts / maxAttempts) * 100)),
  }));
}

function providerRows(locale: Locale, summary: PaymentAnalyticsProviderSummary): Array<{ label: string; value: string; tone: string }> {
  return sourceRows(locale, summary);
}

function sourceFunnelRows(locale: Locale, summary: PaymentAnalyticsSourceFunnelSummary): Array<{ label: string; value: string; tone: string }> {
  return sourceRows(locale, summary);
}

function webhookReconciliationRows(locale: Locale, summary: PaymentAnalyticsWebhookReconciliationSummary): Array<{ label: string; value: string; tone: string }> {
  const copy = COPY[locale];
  return [
    { label: copy.totalEvents, value: String(summary.totalEvents), tone: 'neutral' },
    { label: copy.processed, value: String(summary.processed), tone: 'good' },
    { label: copy.unmatched, value: String(summary.unmatched), tone: summary.unmatched > 0 ? 'warn' : 'good' },
    { label: copy.failed, value: String(summary.failed), tone: summary.failed > 0 ? 'warn' : 'good' },
    { label: copy.ignored, value: String(summary.ignored), tone: summary.ignored > 0 ? 'warn' : 'neutral' },
    { label: copy.replayed, value: String(summary.replayed), tone: summary.replayed > 0 ? 'warn' : 'neutral' },
  ];
}

function webhookFeeRows(locale: Locale, summary: PaymentAnalyticsWebhookFeeProviderSummary): Array<{ label: string; value: string; tone: string }> {
  const copy = COPY[locale];
  return [
    { label: copy.feeEvents, value: String(summary.feeEvents), tone: summary.feeEvents > 0 ? 'good' : 'neutral' },
    { label: copy.reportedFee, value: formatCurrencyAmount(locale, 'TWD', summary.feeReportedCents), tone: summary.feeEvents > 0 ? 'good' : 'neutral' },
    { label: copy.reportedNet, value: formatCurrencyAmount(locale, 'TWD', summary.netReportedCents), tone: summary.feeEvents > 0 ? 'good' : 'neutral' },
    { label: copy.missingFeeData, value: String(summary.missingFeeEvents), tone: summary.missingFeeEvents > 0 ? 'warn' : 'good' },
  ];
}

function alertRows(locale: Locale, alerts: PaymentAnalyticsAlert[]): Array<{
  id: string;
  label: string;
  detail: string;
  tone: string;
  amount?: string;
}> {
  return alerts.map((alert) => ({
    id: alert.id,
    label: alert.label,
    detail: alert.detail,
    tone: alert.tone,
    amount: alert.amountCents && alert.currency ? formatCurrencyAmount(locale, alert.currency, alert.amountCents) : undefined,
  }));
}

function feeRows(locale: Locale, summary: PaymentAnalyticsProviderFeeSummary): Array<{ label: string; value: string; tone: string }> {
  const copy = COPY[locale];
  return [
    { label: copy.attemptsLabel, value: String(summary.paymentAttempts), tone: 'neutral' },
    { label: copy.gross, value: summary.currencyTotals.map((bucket) => `${bucket.currency} ${formatCurrencyAmount(locale, bucket.currency, bucket.grossCollected)}`).join(' · '), tone: 'neutral' },
    { label: locale === 'ko' ? '예상 수수료' : locale === 'zh-hant' ? '預估費用' : 'Estimated fee', value: summary.currencyTotals.map((bucket) => `${bucket.currency} ${formatCurrencyAmount(locale, bucket.currency, bucket.estimatedFee)}`).join(' · '), tone: 'warn' },
    { label: locale === 'ko' ? '수수료 후 순액' : locale === 'zh-hant' ? '扣費後淨額' : 'Net after fee', value: summary.currencyTotals.map((bucket) => `${bucket.currency} ${formatCurrencyAmount(locale, bucket.currency, bucket.estimatedNetCollected)}`).join(' · '), tone: 'good' },
  ];
}

export default async function CommercePaymentsAnalyticsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const copy = COPY[locale];
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const [orders, bookings, services] = await Promise.all([
    listOrders({ locale }),
    listBookings({ includeCancelled: true }),
    listServices(true),
  ]);
  const webhookEvents = await listPaymentWebhookEvents();
  const analytics = buildPaymentAnalytics({ orders, bookings, services, webhookEvents });
  const alerts = buildPaymentAnalyticsAlerts(analytics);
  const primaryCurrency = analytics.totals.currencyTotals[0];

  return (
    <main className={styles.page} data-payment-analytics-page>
      <header className={styles.header}>
        <div>
          <span>{site.name}</span>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/admin-builder/commerce/products`}>{copy.products}</Link>
          <Link href={`/${locale}/admin-builder/commerce/orders`}>{copy.orders}</Link>
          <Link href={`/${locale}/admin-builder/commerce/documents`}>{copy.documents}</Link>
          <Link href={`/${locale}/admin-builder/commerce/webhooks`}>{copy.webhooks}</Link>
          <Link href={`/${locale}/admin-builder/bookings/dashboard`}>{copy.bookings}</Link>
        </div>
        <PaymentAnalyticsExportClient summary={analytics} locale={locale} />
      </header>

      <section className={styles.paymentHero} data-payment-analytics-summary>
        <div>
          <span>{copy.netCollected}</span>
          <strong data-payment-analytics-net>{formatMoney(locale, primaryCurrency)}</strong>
          <p>{summarySentence(locale, analytics.totals.successfulPayments, analytics.totals.paymentAttempts, new Date(analytics.generatedAt).toLocaleString())}</p>
        </div>
        <div className={styles.paymentHeroStats}>
          <article data-payment-analytics-card="conversion">
            <span>{copy.conversion}</span>
            <strong>{formatRate(analytics.totals.paymentConversionRate)}</strong>
          </article>
          <article data-payment-analytics-card="failed">
            <span>{copy.failed}</span>
            <strong>{analytics.totals.failedPayments}</strong>
          </article>
          <article data-payment-analytics-card="refunds">
            <span>{copy.refunded}</span>
            <strong>{analytics.totals.refundedPayments}</strong>
          </article>
        </div>
      </section>

      <section className={styles.kpis} aria-label={copy.paymentStats}>
        <article data-payment-analytics-kpi="attempts">
          <strong>{analytics.totals.paymentAttempts}</strong>
          <span>{copy.attemptsLabel}</span>
        </article>
        <article data-payment-analytics-kpi="successful">
          <strong>{analytics.totals.successfulPayments}</strong>
          <span>{copy.successfulPayments}</span>
        </article>
        <article data-payment-analytics-kpi="partial">
          <strong>{analytics.totals.partialPayments}</strong>
          <span>{copy.sourceRows.partial}</span>
        </article>
        <article data-payment-analytics-kpi="failed">
          <strong>{analytics.totals.failedPayments}</strong>
          <span>{copy.failed}</span>
        </article>
        <article data-payment-analytics-kpi="refunded">
          <strong>{analytics.totals.refundedPayments}</strong>
          <span>{copy.refunded}</span>
        </article>
        <article data-payment-analytics-kpi="currencies">
          <strong>{analytics.totals.currencyTotals.length}</strong>
          <span>{copy.currency}</span>
        </article>
      </section>

      <article className={`${styles.paymentAnalyticsPanel} ${styles.paymentAlertPanel}`} data-payment-analytics-alerts>
        <div className={styles.paymentPanelHeader}>
          <div>
            <span>{copy.alerts}</span>
            <h2>{copy.paymentIssues}</h2>
          </div>
        </div>
        {alerts.length > 0 ? (
          <div className={styles.paymentAlertGrid}>
            {alertRows(locale, alerts).map((alert) => (
              <section key={alert.id} className={styles.paymentAlertCard} data-payment-analytics-alert={alert.id} data-tone={alert.tone}>
                <span>{alert.tone === 'danger' ? copy.critical : alert.tone === 'warn' ? copy.review : copy.info}</span>
                <h3>{alert.label}</h3>
                <p>{alert.detail}</p>
                {alert.amount ? <strong>{alert.amount}</strong> : null}
              </section>
            ))}
          </div>
        ) : (
          <p className={styles.paymentEmpty}>{copy.noAlerts}</p>
        )}
      </article>

      <section className={styles.paymentAnalyticsGrid} aria-label={copy.title}>
        <article className={styles.paymentAnalyticsPanel} data-payment-analytics-currencies>
          <div className={styles.paymentPanelHeader}>
            <div>
              <span>{copy.revenueByCurrency}</span>
              <h2>{copy.collectedRefundedNetDue}</h2>
            </div>
          </div>
          {analytics.totals.currencyTotals.length > 0 ? (
            <div className={styles.paymentCurrencyTable}>
              <div className={styles.paymentCurrencyHeader}>
                <span>{copy.currency}</span>
                <span>{copy.gross}</span>
                <span>{copy.refundedGross}</span>
                <span>{copy.net}</span>
                <span>{copy.outstanding}</span>
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
            <p className={styles.paymentEmpty}>{copy.noCurrencyActivity}</p>
          )}
        </article>

        <article className={styles.paymentAnalyticsPanel} data-payment-analytics-sources>
          <div className={styles.paymentPanelHeader}>
            <div>
              <span>{copy.sourceQuality}</span>
              <h2>{copy.ordersVsBookings}</h2>
            </div>
          </div>
          <div className={styles.paymentSourceGrid}>
            {[
              ['orders', copy.sourceLabels.orders, analytics.orders] as const,
              ['bookings', copy.sourceLabels.bookings, analytics.bookings] as const,
            ].map(([source, label, summary]) => (
              <section key={source} data-payment-analytics-source={source}>
                <h3>{label}</h3>
                {sourceRows(locale, summary).map((row) => (
                  <div key={row.label} data-payment-analytics-source-row={row.label.toLowerCase()}>
                    <span>{row.label}</span>
                    <strong data-tone={row.tone}>{row.value}</strong>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </article>

        <article className={styles.paymentAnalyticsPanel} data-payment-analytics-source-funnel>
          <div className={styles.paymentPanelHeader}>
            <div>
              <span>{copy.sourceFunnel}</span>
              <h2>{copy.ordersVsWebAndAdminBookings}</h2>
            </div>
          </div>
          {analytics.sourceFunnel.length > 0 ? (
            <div className={styles.paymentSourceGrid}>
              {analytics.sourceFunnel.map((summary) => (
                <section key={summary.source} data-payment-analytics-source-funnel-row={summary.source}>
                  <h3>{summary.label}</h3>
                  <p>{copy.paymentAttempts}</p>
                  {sourceFunnelRows(locale, summary).map((row) => (
                    <div key={row.label} data-payment-analytics-source-funnel-metric={row.label.toLowerCase()}>
                      <span>{row.label}</span>
                      <strong data-tone={row.tone}>{row.value}</strong>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          ) : (
            <p className={styles.paymentEmpty}>{copy.noSourceFunnel}</p>
          )}
        </article>

        <article className={styles.paymentAnalyticsPanel} data-payment-analytics-webhook-reconciliation>
          <div className={styles.paymentPanelHeader}>
            <div>
              <span>{copy.liveReconciliation}</span>
              <h2>{copy.paymentWebhookLedgerCoverage}</h2>
            </div>
          </div>
          {analytics.webhookReconciliation.totalEvents > 0 ? (
            <>
              <div className={styles.paymentSourceGrid}>
                <section>
                  <h3>{copy.eventStatus}</h3>
                  {webhookReconciliationRows(locale, analytics.webhookReconciliation).map((row) => (
                    <div key={row.label} data-payment-analytics-webhook-row={row.label.toLowerCase()}>
                      <span>{row.label}</span>
                      <strong data-tone={row.tone}>{row.value}</strong>
                    </div>
                  ))}
                </section>
                <section>
                  <h3>{copy.amountCoverage}</h3>
                  <div data-payment-analytics-webhook-row="amount-reported">
                    <span>{copy.reported}</span>
                    <strong>{formatCurrencyAmount(locale, primaryCurrency?.currency ?? 'TWD', analytics.webhookReconciliation.amountReportedCents)}</strong>
                  </div>
                  <div data-payment-analytics-webhook-row="amount-matched">
                    <span>{copy.matched}</span>
                    <strong data-tone={analytics.webhookReconciliation.amountMismatchCount > 0 ? 'warn' : 'good'}>
                      {formatCurrencyAmount(locale, primaryCurrency?.currency ?? 'TWD', analytics.webhookReconciliation.amountMatchedCents)}
                    </strong>
                  </div>
                  <div data-payment-analytics-webhook-row="amount-unmatched">
                    <span>{copy.unmatched}</span>
                    <strong data-tone={analytics.webhookReconciliation.amountUnmatchedCents > 0 ? 'warn' : 'good'}>
                      {formatCurrencyAmount(locale, primaryCurrency?.currency ?? 'TWD', analytics.webhookReconciliation.amountUnmatchedCents)}
                    </strong>
                  </div>
                  <div data-payment-analytics-webhook-row="mismatch-counts">
                    <span>{copy.amountCurrencyMismatches}</span>
                    <strong data-tone={analytics.webhookReconciliation.amountMismatchCount > 0 || analytics.webhookReconciliation.currencyMismatchCount > 0 ? 'warn' : 'good'}>
                      {analytics.webhookReconciliation.amountMismatchCount} / {analytics.webhookReconciliation.currencyMismatchCount}
                    </strong>
                  </div>
                </section>
              </div>
              <div className={styles.paymentWebhookFeed}>
                {analytics.webhookReconciliation.providerBreakdown.map((provider) => (
                  <section key={provider.provider} data-payment-analytics-webhook-provider={provider.provider}>
                    <h3>{provider.label}</h3>
                    <p>{copy.processed} {provider.processed} · {copy.unmatched} {provider.unmatched} · {copy.failed} {provider.failed}</p>
                  </section>
                ))}
                {analytics.webhookReconciliation.errorBreakdown.length > 0 ? (
                  <section data-payment-analytics-webhook-errors>
                    <h3>{copy.recentMismatchReasons}</h3>
                    {analytics.webhookReconciliation.errorBreakdown.map((error) => (
                      <div key={error.error} data-payment-analytics-webhook-error={error.error}>
                        <span>{error.label}</span>
                        <strong>{error.count}</strong>
                      </div>
                    ))}
                  </section>
                ) : null}
                <section data-payment-analytics-webhook-recent>
                  <h3>{copy.recentEvents}</h3>
                  {analytics.webhookReconciliation.recentEvents.map((event) => (
                    <div key={event.eventId} data-payment-analytics-webhook-event={event.eventId}>
                      <span>{event.label} · {event.status}</span>
                      <strong>{event.providerEventId}</strong>
                    </div>
                  ))}
                </section>
              </div>
            </>
          ) : (
            <p className={styles.paymentEmpty}>{copy.noWebhookEvents}</p>
          )}
        </article>

        <article className={styles.paymentAnalyticsPanel} data-payment-analytics-webhook-fees>
          <div className={styles.paymentPanelHeader}>
            <div>
              <span>{copy.providerFeeReconciliation}</span>
              <h2>{copy.feesAndNetReportedByWebhookPayloads}</h2>
            </div>
          </div>
          {analytics.webhookReconciliation.feeProviderBreakdown.length > 0 ? (
            <>
              <div className={styles.paymentSourceGrid}>
                {analytics.webhookReconciliation.feeProviderBreakdown.map((provider) => (
                  <section key={provider.provider} data-payment-analytics-webhook-fee-provider={provider.provider}>
                    <h3>{provider.label}</h3>
                    <p>{copy.webhooksWithFeeMetadata}</p>
                    {webhookFeeRows(locale, provider).map((row) => (
                      <div key={row.label} data-payment-analytics-webhook-fee-row={row.label.toLowerCase()}>
                        <span>{row.label}</span>
                        <strong data-tone={row.tone}>{row.value}</strong>
                      </div>
                    ))}
                  </section>
                ))}
              </div>
              <div className={styles.paymentWebhookFeed}>
                <section data-payment-analytics-webhook-fee-summary>
                  <h3>{copy.ledgerCoverage}</h3>
                  <div data-payment-analytics-webhook-fee-total>
                    <span>{copy.feeEvents} / {copy.missingFeeData}</span>
                    <strong>{analytics.webhookReconciliation.feeEvents} / {analytics.webhookReconciliation.missingFeeEvents}</strong>
                  </div>
                  <div data-payment-analytics-webhook-fee-amounts>
                    <span>{copy.reportedFee}</span>
                    <strong>{formatCurrencyAmount(locale, primaryCurrency?.currency ?? 'TWD', analytics.webhookReconciliation.feeReportedCents)}</strong>
                  </div>
                  <div data-payment-analytics-webhook-fee-net>
                    <span>{copy.reportedNet}</span>
                    <strong>{formatCurrencyAmount(locale, primaryCurrency?.currency ?? 'TWD', analytics.webhookReconciliation.feeNetReportedCents)}</strong>
                  </div>
                </section>
              </div>
            </>
          ) : (
            <p className={styles.paymentEmpty}>{copy.noWebhookFees}</p>
          )}
        </article>
      </section>

      <article className={`${styles.paymentAnalyticsPanel} ${styles.paymentTrendPanel}`} data-payment-analytics-trend>
        <div className={styles.paymentPanelHeader}>
          <div>
            <span>{copy.trendChart}</span>
            <h2>{copy.sevenDayGrossCollectedAndRefundTrend}</h2>
          </div>
        </div>
        {analytics.trend.length > 0 ? (
          <div className={styles.paymentTrendGrid}>
            {trendRows(locale, analytics.trend).map((row) => (
              <div key={row.day} className={styles.paymentTrendRow} data-payment-analytics-trend-row={row.day}>
                <div className={styles.paymentTrendLabel}>
                  <strong>{row.label}</strong>
                  <span>{row.attempts} {copy.attemptsLabel}</span>
                </div>
                <div className={styles.paymentTrendBarTrack} aria-hidden="true">
                  <div className={styles.paymentTrendBar} style={{ width: `${row.width}%` }} />
                </div>
                <div className={styles.paymentTrendValues}>
                  <strong>{row.successful} {copy.successfulPayments}</strong>
                  <span>{row.failed} {copy.failed} · {row.refunded} {copy.refunded}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.paymentEmpty}>{copy.noTrendData}</p>
        )}
      </article>

      <article className={`${styles.paymentAnalyticsPanel} ${styles.paymentProviderPanel}`} data-payment-analytics-providers>
        <div className={styles.paymentPanelHeader}>
          <div>
            <span>{copy.providerMix}</span>
            <h2>{copy.orderPaymentAdapterAttribution}</h2>
          </div>
        </div>
        {analytics.providerBreakdown.length > 0 ? (
          <div className={styles.paymentSourceGrid}>
            {analytics.providerBreakdown.map((summary) => (
              <section key={summary.provider} data-payment-analytics-provider={summary.provider}>
                <h3>{summary.label}</h3>
                <p>{copy.ordersOnly}</p>
                {providerRows(locale, summary).map((row) => (
                  <div key={row.label} data-payment-analytics-provider-row={row.label.toLowerCase()}>
                    <span>{row.label}</span>
                    <strong data-tone={row.tone}>{row.value}</strong>
                  </div>
                ))}
              </section>
            ))}
          </div>
        ) : (
          <p className={styles.paymentEmpty}>{copy.noProviderPayments}</p>
        )}
      </article>

      <article className={`${styles.paymentAnalyticsPanel} ${styles.paymentProviderPanel}`} data-payment-analytics-provider-fees>
        <div className={styles.paymentPanelHeader}>
          <div>
            <span>{copy.providerFees}</span>
            <h2>{copy.estimatedPaymentProcessorCostByAdapter}</h2>
          </div>
        </div>
        <p className={styles.paymentEmpty}>
          {copy.estimatesNote}
        </p>
        {analytics.providerFeeBreakdown.length > 0 ? (
          <div className={styles.paymentSourceGrid}>
            {analytics.providerFeeBreakdown.map((summary) => (
              <section key={summary.provider} data-payment-analytics-provider-fee={summary.provider}>
                <h3>{summary.label}</h3>
                <p>{summary.feeRateBps > 0 ? `${(summary.feeRateBps / 100).toFixed(2)}% + fixed fee` : locale === 'ko' ? '처리 수수료 없음' : locale === 'zh-hant' ? '不假設處理費用' : 'No processor fee assumed'}</p>
                {feeRows(locale, summary).map((row) => (
                  <div key={row.label} data-payment-analytics-provider-fee-row={row.label.toLowerCase()}>
                    <span>{row.label}</span>
                    <strong data-tone={row.tone}>{row.value}</strong>
                  </div>
                ))}
              </section>
            ))}
          </div>
        ) : (
          <p className={styles.paymentEmpty}>{copy.noFeeEstimates}</p>
        )}
      </article>
    </main>
  );
}
