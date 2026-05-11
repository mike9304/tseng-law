'use client';

import { useState } from 'react';
import type { WebhookDelivery } from '@/lib/builder/webhooks/types';

interface Props {
  webhookId: string;
  webhookUrl: string;
  initialDeliveries: WebhookDelivery[];
}

const STATUS_COLOR: Record<WebhookDelivery['status'], string> = {
  success: '#16a34a',
  failed: '#dc2626',
  pending: '#f59e0b',
};

export default function WebhookDeliveriesView({ webhookId, webhookUrl, initialDeliveries }: Props) {
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function refresh() {
    const res = await fetch(`/api/builder/webhooks/${webhookId}/deliveries`, { credentials: 'same-origin' });
    if (!res.ok) return;
    const payload = (await res.json()) as { deliveries: WebhookDelivery[] };
    setDeliveries(payload.deliveries);
  }

  async function retry(deliveryId: string) {
    setRetryingId(deliveryId);
    setMessage('');
    try {
      const res = await fetch(`/api/builder/webhooks/${webhookId}/retry`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryId }),
      });
      const payload = (await res.json().catch(() => ({}))) as { delivery?: WebhookDelivery; error?: string };
      if (!res.ok) {
        setMessage(`재시도 실패: ${payload.error ?? res.statusText}`);
      } else if (payload.delivery) {
        setMessage(`재시도 결과: ${payload.delivery.status}`);
        await refresh();
      }
    } finally {
      setRetryingId(null);
    }
  }

  return (
    <main style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <header>
        <h1 style={{ margin: 0, fontSize: 20 }}>Deliveries</h1>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
          <strong>{webhookId}</strong> · {webhookUrl}
        </p>
      </header>
      <div>
        <button type="button" onClick={refresh} style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
          새로고침
        </button>
      </div>
      {message ? <div style={{ fontSize: 12, color: message.includes('실패') ? '#dc2626' : '#16a34a' }}>{message}</div> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '6px 10px' }}>시각</th>
            <th style={{ padding: '6px 10px' }}>event</th>
            <th style={{ padding: '6px 10px' }}>상태</th>
            <th style={{ padding: '6px 10px' }}>HTTP</th>
            <th style={{ padding: '6px 10px' }}>시도</th>
            <th style={{ padding: '6px 10px' }}>오류</th>
            <th style={{ padding: '6px 10px' }}>액션</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                전송 이력이 없습니다.
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
                  {retryingId === d.deliveryId ? '재시도 중...' : '재시도'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
