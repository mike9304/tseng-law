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

type PaymentWebhooksCopy = {
  title: string;
  subtitle: string;
  orders: string;
  products: string;
  currency: string;
  tax: string;
  shipping: string;
  notifications: string;
  refresh: string;
  searchPlaceholder: string;
  allProviders: string;
  sandboxCard: string;
  manualInvoice: string;
  allStatus: string;
  processed: string;
  failed: string;
  unmatched: string;
  ignored: string;
  statusReady: string;
  statusRefreshing: string;
  statusRefreshed: string;
  statusReplay: string;
  statusReplayDone: string;
  statusRefreshFailed: string;
  statusReplayFailed: string;
  kpiLabel: (key: 'total' | 'processed' | 'failed' | 'unmatched' | 'ignored' | 'replayed') => string;
  emptyTitle: string;
  emptyBody: string;
  eventPaymentRef: string;
  eventOrder: string;
  eventPaymentStatus: string;
  eventReplayCount: string;
  eventError: string;
  signatureVerified: string;
  signatureMissing: string;
  currencyUnknown: string;
  pendingProcessing: string;
  replay: string;
  replaying: string;
  maskedPayload: string;
  hideDetails: string;
  showMaskedPayload: string;
  providerEvent: string;
  localEvent: string;
  amountUnknown: string;
  eventsLabel: string;
};

const COPY: Record<Locale, PaymentWebhooksCopy> = {
  ko: {
    title: '결제 웹훅',
    subtitle: '결제 이벤트, 주문 매칭, 재시도 상태, 마스킹된 payload를 한곳에서 검토합니다.',
    orders: '주문',
    products: '제품',
    currency: '통화',
    tax: '세금 규칙',
    shipping: '배송',
    notifications: '알림',
    refresh: '새로고침',
    searchPlaceholder: '이벤트, 참조, 주문, 오류 검색',
    allProviders: '모든 공급자',
    sandboxCard: '샌드박스 카드',
    manualInvoice: '수동 청구서',
    allStatus: '모든 상태',
    processed: '처리됨',
    failed: '실패함',
    unmatched: '일치하지 않음',
    ignored: '무시됨',
    statusReady: '준비됨',
    statusRefreshing: '결제 이벤트를 새로고침하는 중...',
    statusRefreshed: '결제 이벤트가 새로고침되었습니다',
    statusReplay: '결제 이벤트를 재시도하는 중...',
    statusReplayDone: '재시도 완료',
    statusRefreshFailed: '새로고침 실패',
    statusReplayFailed: '재시도 실패',
    kpiLabel: (key) => ({
      total: '전체 이벤트',
      processed: '처리됨',
      failed: '실패함',
      unmatched: '일치하지 않음',
      ignored: '무시됨',
      replayed: '재시도됨',
    })[key],
    emptyTitle: '결제 웹훅이 없습니다',
    emptyBody: '체크아웃 결제 참조가 생성되면 서명된 공급자 이벤트가 여기에 표시됩니다.',
    eventPaymentRef: '결제 참조',
    eventOrder: '주문',
    eventPaymentStatus: '결제 상태',
    eventReplayCount: '재시도 횟수',
    eventError: '오류',
    signatureVerified: '서명 확인됨',
    signatureMissing: '서명 없음',
    currencyUnknown: '통화 정보 없음',
    pendingProcessing: '처리 대기 중',
    replay: '재시도',
    replaying: '재시도 중',
    maskedPayload: '마스킹된 payload',
    hideDetails: '세부 정보 숨기기',
    showMaskedPayload: '마스킹된 payload 보기',
    providerEvent: '공급자 이벤트',
    localEvent: '로컬 이벤트',
    amountUnknown: '금액 정보 없음',
    eventsLabel: '결제 웹훅 이벤트',
  },
  'zh-hant': {
    title: '付款 Webhook',
    subtitle: '在同一處檢視付款事件、訂單比對、重試狀態與遮罩後的 payload。',
    orders: '訂單',
    products: '產品',
    currency: '幣別',
    tax: '稅務規則',
    shipping: '運送',
    notifications: '通知',
    refresh: '重新整理',
    searchPlaceholder: '搜尋事件、參考、訂單、錯誤',
    allProviders: '所有供應商',
    sandboxCard: '沙盒卡片',
    manualInvoice: '手動發票',
    allStatus: '所有狀態',
    processed: '已處理',
    failed: '失敗',
    unmatched: '未比對',
    ignored: '已忽略',
    statusReady: '就緒',
    statusRefreshing: '正在重新整理付款事件...',
    statusRefreshed: '付款事件已重新整理',
    statusReplay: '正在重播付款事件...',
    statusReplayDone: '重播完成',
    statusRefreshFailed: '重新整理失敗',
    statusReplayFailed: '重播失敗',
    kpiLabel: (key) => ({
      total: '事件總數',
      processed: '已處理',
      failed: '失敗',
      unmatched: '未比對',
      ignored: '已忽略',
      replayed: '已重播',
    })[key],
    emptyTitle: '尚無付款 Webhook',
    emptyBody: '當建立結帳付款參考後，已簽署的供應商事件會顯示在這裡。',
    eventPaymentRef: '付款參考',
    eventOrder: '訂單',
    eventPaymentStatus: '付款狀態',
    eventReplayCount: '重播次數',
    eventError: '錯誤',
    signatureVerified: '簽章已驗證',
    signatureMissing: '缺少簽章',
    currencyUnknown: '幣別未知',
    pendingProcessing: '待處理',
    replay: '重播',
    replaying: '重播中',
    maskedPayload: '已遮罩的 payload',
    hideDetails: '隱藏詳細資料',
    showMaskedPayload: '顯示已遮罩的 payload',
    providerEvent: '供應商事件',
    localEvent: '本地事件',
    amountUnknown: '金額未知',
    eventsLabel: '付款 Webhook 事件',
  },
  en: {
    title: 'Payment webhooks',
    subtitle: 'Review provider events, payment references, order matching, replay state, and masked payload details.',
    orders: 'Orders',
    products: 'Products',
    currency: 'Currency',
    tax: 'Tax rules',
    shipping: 'Shipping',
    notifications: 'Notifications',
    refresh: 'Refresh',
    searchPlaceholder: 'Search event, reference, order, error',
    allProviders: 'All providers',
    sandboxCard: 'Sandbox card',
    manualInvoice: 'Manual invoice',
    allStatus: 'All status',
    processed: 'Processed',
    failed: 'Failed',
    unmatched: 'Unmatched',
    ignored: 'Ignored',
    statusReady: 'Ready',
    statusRefreshing: 'Refreshing payment events...',
    statusRefreshed: 'Payment events refreshed',
    statusReplay: 'Replaying payment event...',
    statusReplayDone: 'Replay finished',
    statusRefreshFailed: 'Refresh failed',
    statusReplayFailed: 'Replay failed',
    kpiLabel: (key) => ({
      total: 'Total events',
      processed: 'Processed',
      failed: 'Failed',
      unmatched: 'Unmatched',
      ignored: 'Ignored',
      replayed: 'Replayed',
    })[key],
    emptyTitle: 'No payment webhooks found',
    emptyBody: 'Signed provider events will appear here after a checkout payment reference is created.',
    eventPaymentRef: 'Payment ref',
    eventOrder: 'Order',
    eventPaymentStatus: 'Payment status',
    eventReplayCount: 'Replay count',
    eventError: 'Error',
    signatureVerified: 'signature verified',
    signatureMissing: 'signature missing',
    currencyUnknown: 'currency unknown',
    pendingProcessing: 'pending processing',
    replay: 'Replay',
    replaying: 'Replaying',
    maskedPayload: 'Masked payload',
    hideDetails: 'Hide details',
    showMaskedPayload: 'Show masked payload',
    providerEvent: 'Provider event',
    localEvent: 'Local event',
    amountUnknown: 'Amount unknown',
    eventsLabel: 'Payment webhook events',
  },
};

interface PaymentWebhookManagerClientProps {
  locale: Locale;
  siteTitle: string;
  initialEvents: CommercePaymentWebhookEvent[];
}

function formatAmount(event: CommercePaymentWebhookEvent, amountUnknown: string): string {
  if (typeof event.amountCents !== 'number' || !event.currency) return amountUnknown;
  const localeTag = event.currency === 'TWD' ? 'zh-Hant-TW' : event.currency === 'KRW' ? 'ko-KR' : 'en-US';
  return new Intl.NumberFormat(localeTag, {
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

function replayReasonLabel(locale: Locale, reason?: string): string {
  if (!reason) return '';
  const labels: Record<Locale, Record<string, string>> = {
    ko: {
      amount_mismatch: '금액 불일치',
      currency_mismatch: '통화 불일치',
      duplicate_event: '중복 이벤트',
      manual_payment_locked: '수동 결제로 잠김',
      order_not_found: '주문을 찾을 수 없음',
      paid_payment_locked: '결제 완료 상태로 잠김',
      payment_status_unchanged: '결제 상태 변경 없음',
      refund_payment_locked: '부분 환불 상태로 잠김',
      refunded_payment_locked: '환불 완료 상태로 잠김',
    },
    'zh-hant': {
      amount_mismatch: '金額不符',
      currency_mismatch: '幣別不符',
      duplicate_event: '重複事件',
      manual_payment_locked: '已由手動付款鎖定',
      order_not_found: '找不到訂單',
      paid_payment_locked: '已付款狀態已鎖定',
      payment_status_unchanged: '付款狀態未變更',
      refund_payment_locked: '部分退款狀態已鎖定',
      refunded_payment_locked: '已退款狀態已鎖定',
    },
    en: {
      amount_mismatch: 'Amount mismatch',
      currency_mismatch: 'Currency mismatch',
      duplicate_event: 'Duplicate event',
      manual_payment_locked: 'Manual payment locked',
      order_not_found: 'Order not found',
      paid_payment_locked: 'Paid payment locked',
      payment_status_unchanged: 'Payment status unchanged',
      refund_payment_locked: 'Partial refund locked',
      refunded_payment_locked: 'Refunded payment locked',
    },
  };
  return labels[locale][reason] ?? reason;
}

export default function PaymentWebhookManagerClient({
  locale,
  siteTitle,
  initialEvents,
}: PaymentWebhookManagerClientProps) {
  const text = COPY[locale];
  const [events, setEvents] = useState(initialEvents);
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState<ProviderFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [expandedId, setExpandedId] = useState('');
  const [busyEventId, setBusyEventId] = useState('');
  const [notice, setNotice] = useState(text.statusReady);

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
    setNotice(text.statusRefreshing);
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (provider !== 'all') params.set('provider', provider);
    if (status !== 'all') params.set('status', status);
    params.set('locale', locale);
    const response = await fetch(`/api/builder/commerce/payment-webhooks?${params}`, { cache: 'no-store' });
    const payload = await response.json().catch(() => ({})) as { ok?: boolean; events?: CommercePaymentWebhookEvent[]; error?: string };
    if (!response.ok || !payload.ok || !Array.isArray(payload.events)) {
      setNotice(payload.error ?? text.statusRefreshFailed);
      return;
    }
    setEvents(payload.events);
    setNotice(text.statusRefreshed);
  }

  async function replay(eventId: string) {
    setBusyEventId(eventId);
    setNotice(text.statusReplay);
    try {
      const response = await fetch(`/api/builder/commerce/payment-webhooks/events/${encodeURIComponent(eventId)}/replay?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; event?: CommercePaymentWebhookEvent; error?: string; reason?: string };
      if (!response.ok || !payload.ok || !payload.event) {
        setNotice(payload.error ?? text.statusReplayFailed);
        return;
      }
      setEvents((current) => current.map((event) => (event.eventId === payload.event?.eventId ? payload.event : event)));
      const reason = replayReasonLabel(locale, payload.reason);
      setNotice(reason ? `${text.statusReplayDone}: ${reason}` : text.statusReplayDone);
    } finally {
      setBusyEventId('');
    }
  }

  return (
    <main className={styles.page} data-commerce-payment-webhooks-admin>
      <header className={styles.header}>
        <div>
          <span>{siteTitle}</span>
          <h1>{text.title}</h1>
          <p>{text.subtitle}</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/admin-builder/commerce/orders`}>{text.orders}</Link>
          <Link href={`/${locale}/admin-builder/commerce/products`}>{text.products}</Link>
          <Link href={`/${locale}/admin-builder/commerce/currency`}>{text.currency}</Link>
          <Link href={`/${locale}/admin-builder/commerce/tax`}>{text.tax}</Link>
          <Link href={`/${locale}/admin-builder/commerce/shipping`}>{text.shipping}</Link>
          <Link href={`/${locale}/admin-builder/commerce/notifications`}>{text.notifications}</Link>
          <button type="button" onClick={() => void refresh()} data-payment-webhooks-refresh>{text.refresh}</button>
        </div>
      </header>

      <section className={styles.kpis} aria-label={text.title}>
        {Object.entries(kpis).map(([key, value]) => (
          <article key={key} data-payment-webhooks-kpi={key}>
            <strong>{value}</strong>
            <span>{text.kpiLabel(key as keyof typeof kpis)}</span>
          </article>
        ))}
      </section>

      <section className={styles.toolbar}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={text.searchPlaceholder}
          data-payment-webhooks-search
        />
        <select value={provider} onChange={(event) => setProvider(event.target.value as ProviderFilter)} data-payment-webhooks-provider-filter>
          <option value="all">{text.allProviders}</option>
          <option value="sandbox-card">{text.sandboxCard}</option>
          <option value="manual-invoice">{text.manualInvoice}</option>
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} data-payment-webhooks-status-filter>
          <option value="all">{text.allStatus}</option>
          <option value="processed">{text.processed}</option>
          <option value="failed">{text.failed}</option>
          <option value="unmatched">{text.unmatched}</option>
          <option value="ignored">{text.ignored}</option>
        </select>
      </section>

      <p role="status" className={styles.notice}>{notice}</p>

      <section className={styles.list} aria-label={text.eventsLabel}>
        {filtered.length === 0 ? (
          <article className={styles.empty} data-payment-webhooks-empty>
            <strong>{text.emptyTitle}</strong>
            <span>{text.emptyBody}</span>
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
                <strong>{formatAmount(event, text.amountUnknown)}</strong>
                <span data-payment-webhook-reference={event.eventId}>{text.eventPaymentRef} {event.paymentReferenceId}</span>
                <span>{text.eventOrder} {event.orderId ?? text.unmatched}</span>
              </div>
              <div className={styles.state}>
                <strong>{event.status}</strong>
                <span>{text.eventPaymentStatus} {event.paymentStatus}</span>
                <span>{text.eventReplayCount} {event.replayCount}</span>
                {event.error ? <span>{text.eventError} {event.error}</span> : null}
              </div>
              <div className={styles.eventActions}>
                <button
                  type="button"
                  disabled={!canReplay || busyEventId === event.eventId}
                  onClick={() => void replay(event.eventId)}
                  data-payment-webhook-replay={event.eventId}
                >
                  {busyEventId === event.eventId ? text.replaying : text.replay}
                </button>
              </div>
              <div className={styles.badges}>
                <span>{event.status}</span>
                <span>{event.signatureVerified ? text.signatureVerified : text.signatureMissing}</span>
                <span>{event.currency ?? text.currencyUnknown}</span>
                <span>{event.processedAt ? `processed ${new Date(event.processedAt).toLocaleString()}` : text.pendingProcessing}</span>
              </div>
              <section className={styles.detail} data-payment-webhook-detail={event.eventId} hidden={!expanded}>
                <div className={styles.detailHeader}>
                  <strong>{text.maskedPayload}</strong>
                  <button type="button" onClick={() => setExpandedId('')}>{text.hideDetails}</button>
                </div>
                <span>{text.providerEvent} {event.providerEventId}</span>
                <span>{text.localEvent} {event.eventId}</span>
                <pre className={styles.payload}>{JSON.stringify(event.payload, null, 2)}</pre>
              </section>
              {!expanded ? (
                <div className={styles.badges}>
                  <button type="button" onClick={() => setExpandedId(event.eventId)} data-payment-webhook-toggle-detail={event.eventId}>
                    {text.showMaskedPayload}
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
