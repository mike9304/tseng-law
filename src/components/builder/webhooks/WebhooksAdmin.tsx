'use client';

import { useState } from 'react';
import type { WebhookEventType, WebhookSubscription } from '@/lib/builder/webhooks/types';
import { WEBHOOK_EVENT_TYPES } from '@/lib/builder/webhooks/types';

interface Props {
  initialSubscriptions: WebhookSubscription[];
}

export default function WebhooksAdmin({ initialSubscriptions }: Props) {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [showCreate, setShowCreate] = useState(false);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [events, setEvents] = useState<WebhookEventType[]>(['form.submitted']);
  const [busy, setBusy] = useState(false);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function create() {
    if (!url.trim()) return;
    setBusy(true);
    setError('');
    setCreatedSecret(null);
    try {
      const res = await fetch('/api/builder/webhooks', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), description: description.trim() || undefined, events, active: true }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || res.statusText);
        return;
      }
      const payload = (await res.json()) as { subscription: WebhookSubscription };
      setCreatedSecret(payload.subscription.secret);
      setSubscriptions((s) => [{ ...payload.subscription, secret: `${payload.subscription.secret.slice(0, 12)}…` }, ...s]);
      setUrl('');
      setDescription('');
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(webhookId: string, next: boolean) {
    const res = await fetch(`/api/builder/webhooks/${webhookId}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: next }),
    });
    if (res.ok) {
      setSubscriptions((s) => s.map((x) => (x.webhookId === webhookId ? { ...x, active: next } : x)));
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          style={{ marginLeft: 'auto', padding: '6px 12px', border: 0, background: '#0f172a', color: '#fff', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          + 새 webhook
        </button>
      </div>

      {showCreate ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc' }}>
          <input
            type="url"
            placeholder="https://hooks.example.com/incoming"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
          />
          <input
            type="text"
            placeholder="설명 (옵션)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {WEBHOOK_EVENT_TYPES.map((evt) => (
              <label key={evt} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: 999, background: events.includes(evt) ? '#dbeafe' : '#fff' }}>
                <input
                  type="checkbox"
                  checked={events.includes(evt)}
                  onChange={(e) => {
                    setEvents((curr) => e.target.checked ? [...curr, evt] : curr.filter((x) => x !== evt));
                  }}
                />
                {evt}
              </label>
            ))}
          </div>
          {error ? <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div> : null}
          {createdSecret ? (
            <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', padding: 10, borderRadius: 6, fontSize: 12, color: '#92400e' }}>
              <strong>이번 한 번만 표시되는 시크릿:</strong>{' '}
              <code style={{ fontFamily: 'ui-monospace, Menlo, monospace', userSelect: 'all' }}>{createdSecret}</code>
              <div style={{ marginTop: 4 }}>지금 복사해서 안전한 곳에 저장하세요.</div>
            </div>
          ) : null}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowCreate(false)} style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
              닫기
            </button>
            <button type="button" disabled={busy || events.length === 0} onClick={create} style={{ padding: '6px 12px', border: 0, background: busy || events.length === 0 ? '#94a3b8' : '#16a34a', color: '#fff', borderRadius: 6, fontSize: 13, cursor: busy ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
              생성
            </button>
          </div>
        </div>
      ) : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>URL</th>
            <th style={{ padding: '8px 12px' }}>이벤트</th>
            <th style={{ padding: '8px 12px' }}>상태</th>
            <th style={{ padding: '8px 12px' }}>생성일</th>
            <th style={{ padding: '8px 12px' }}>액션</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                등록된 webhook 이 없습니다.
              </td>
            </tr>
          ) : (
            subscriptions.map((sub) => (
              <tr key={sub.webhookId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 12px', maxWidth: 320, wordBreak: 'break-all' }}>
                  <strong>{sub.url}</strong>
                  {sub.description ? <div style={{ fontSize: 11, color: '#94a3b8' }}>{sub.description}</div> : null}
                </td>
                <td style={{ padding: '8px 12px', fontSize: 11 }}>
                  {sub.events.join(', ')}
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: sub.active ? '#dcfce7' : '#f1f5f9', color: sub.active ? '#15803d' : '#475569' }}>
                    {sub.active ? '활성' : '비활성'}
                  </span>
                </td>
                <td style={{ padding: '8px 12px', color: '#64748b' }}>{new Date(sub.createdAt).toLocaleDateString('ko-KR')}</td>
                <td style={{ padding: '8px 12px' }}>
                  <button type="button" onClick={() => toggleActive(sub.webhookId, !sub.active)} style={{ padding: '4px 8px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                    {sub.active ? '비활성화' : '활성화'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
