'use client';

import { useState } from 'react';
import type { WebhookDelivery } from '@/lib/builder/webhooks/types';
import type { Locale } from '@/lib/locales';

interface Props {
  locale: Locale;
  webhookId: string;
  webhookUrl: string;
  initialDeliveries: WebhookDelivery[];
}

const STATUS_COLOR: Record<WebhookDelivery['status'], string> = {
  success: '#16a34a',
  failed: '#dc2626',
  pending: '#f59e0b',
};

type WebhookDeliveriesCopy = {
  title: string;
  refresh: string;
  time: string;
  event: string;
  status: string;
  http: string;
  attempts: string;
  error: string;
  actions: string;
  empty: string;
  retry: string;
  retrying: string;
  retryFailed: string;
  retryResult: string;
};

const COPY: Record<Locale, WebhookDeliveriesCopy> = {
  ko: {
    title: '전송 이력',
    refresh: '새로고침',
    time: '시각',
    event: '이벤트',
    status: '상태',
    http: 'HTTP',
    attempts: '시도',
    error: '오류',
    actions: '액션',
    empty: '전송 이력이 없습니다.',
    retry: '재시도',
    retrying: '재시도 중...',
    retryFailed: '재시도 실패',
    retryResult: '재시도 결과',
  },
  'zh-hant': {
    title: '傳送記錄',
    refresh: '重新整理',
    time: '時間',
    event: '事件',
    status: '狀態',
    http: 'HTTP',
    attempts: '次數',
    error: '錯誤',
    actions: '操作',
    empty: '沒有傳送記錄。',
    retry: '重試',
    retrying: '重試中...',
    retryFailed: '重試失敗',
    retryResult: '重試結果',
  },
  en: {
    title: 'Deliveries',
    refresh: 'Refresh',
    time: 'Time',
    event: 'Event',
    status: 'Status',
    http: 'HTTP',
    attempts: 'Attempts',
    error: 'Error',
    actions: 'Actions',
    empty: 'No deliveries yet.',
    retry: 'Retry',
    retrying: 'Retrying...',
    retryFailed: 'Retry failed',
    retryResult: 'Retry result',
  },
};

export default function WebhookDeliveriesView({ locale, webhookId, webhookUrl, initialDeliveries }: Props) {
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState<'success' | 'error'>('success');
  const text = COPY[locale];

  async function refresh() {
    const params = new URLSearchParams({ locale });
    const res = await fetch(`/api/builder/webhooks/${webhookId}/deliveries?${params.toString()}`, { credentials: 'same-origin' });
    const payload = (await res.json().catch(() => ({}))) as { deliveries?: WebhookDelivery[]; error?: string };
    if (!res.ok) {
      setMessageTone('error');
      setMessage(payload.error ?? res.statusText);
      return;
    }
    if (!Array.isArray(payload.deliveries)) return;
    setDeliveries(payload.deliveries);
  }

  async function retry(deliveryId: string) {
    setRetryingId(deliveryId);
    setMessage('');
    setMessageTone('success');
    try {
      const params = new URLSearchParams({ locale });
      const res = await fetch(`/api/builder/webhooks/${webhookId}/retry?${params.toString()}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryId }),
      });
      const payload = (await res.json().catch(() => ({}))) as { delivery?: WebhookDelivery; error?: string };
      if (!res.ok) {
        setMessageTone('error');
        setMessage(`${text.retryFailed}: ${payload.error ?? res.statusText}`);
      } else if (payload.delivery) {
        setMessageTone('success');
        setMessage(`${text.retryResult}: ${payload.delivery.status}`);
        await refresh();
      }
    } finally {
      setRetryingId(null);
    }
  }

  return (
    <main style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <header>
        <h1 style={{ margin: 0, fontSize: 20 }}>{text.title}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
          <strong>{webhookId}</strong> · {webhookUrl}
        </p>
      </header>
      <div>
        <button type="button" onClick={refresh} style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
          {text.refresh}
        </button>
      </div>
      {message ? <div style={{ fontSize: 12, color: messageTone === 'error' ? '#dc2626' : '#16a34a' }}>{message}</div> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '6px 10px' }}>{text.time}</th>
            <th style={{ padding: '6px 10px' }}>{text.event}</th>
            <th style={{ padding: '6px 10px' }}>{text.status}</th>
            <th style={{ padding: '6px 10px' }}>{text.http}</th>
            <th style={{ padding: '6px 10px' }}>{text.attempts}</th>
            <th style={{ padding: '6px 10px' }}>{text.error}</th>
            <th style={{ padding: '6px 10px' }}>{text.actions}</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                {text.empty}
              </td>
            </tr>
          ) : deliveries.map((d) => (
            <tr key={d.deliveryId} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '6px 10px', whiteSpace: 'nowrap', color: '#64748b' }}>{new Date(d.createdAt).toLocaleString('ko-KR')}</td>
              <td style={{ padding: '6px 10px', fontFamily: 'ui-monospace, Menlo, monospace' }}>{d.event}</td>
              <td style={{ padding: '6px 10px' }}>
                <span style={{ padding: '2px 6px', borderRadius: 999, background: `${STATUS_COLOR[d.status]}22`, color: STATUS_COLOR[d.status], fontWeight: 700 }}>
                  {d.status}
                </span>
              </td>
              <td style={{ padding: '6px 10px' }}>{d.responseStatus ?? '—'}</td>
              <td style={{ padding: '6px 10px' }}>{d.attempts}</td>
              <td style={{ padding: '6px 10px', maxWidth: 280, wordBreak: 'break-all', color: '#dc2626' }}>{d.error ?? d.responseSnippet ?? '—'}</td>
              <td style={{ padding: '6px 10px' }}>
                <button
                  type="button"
                  disabled={retryingId === d.deliveryId || d.status === 'success'}
                  onClick={() => retry(d.deliveryId)}
                  style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: retryingId === d.deliveryId || d.status === 'success' ? 'not-allowed' : 'pointer' }}
                >
                  {retryingId === d.deliveryId ? text.retrying : text.retry}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
