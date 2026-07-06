'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { WebhookEventType, WebhookSubscription } from '@/lib/builder/webhooks/types';
import { WEBHOOK_EVENT_TYPES } from '@/lib/builder/webhooks/types';

interface Props {
  locale: Locale;
  initialSubscriptions: WebhookSubscription[];
}

type WebhooksCopy = {
  addWebhook: string;
  createPanel: string;
  urlPlaceholder: string;
  descriptionPlaceholder: string;
  close: string;
  create: string;
  url: string;
  events: string;
  status: string;
  created: string;
  actions: string;
  empty: string;
  history: string;
  activate: string;
  deactivate: string;
  active: string;
  inactive: string;
  createdSecretLabel: string;
  createdSecretHint: string;
  backupTip: string;
};

const COPY: Record<Locale, WebhooksCopy> = {
  ko: {
    addWebhook: '+ 새 webhook',
    createPanel: 'Webhook 생성',
    urlPlaceholder: 'https://hooks.example.com/incoming',
    descriptionPlaceholder: '설명 (옵션)',
    close: '닫기',
    create: '생성',
    url: 'URL',
    events: '이벤트',
    status: '상태',
    created: '생성일',
    actions: '액션',
    empty: '등록된 webhook 이 없습니다.',
    history: '이력',
    activate: '활성화',
    deactivate: '비활성화',
    active: '활성',
    inactive: '비활성',
    createdSecretLabel: '이번 한 번만 표시되는 시크릿:',
    createdSecretHint: '지금 복사해서 안전한 곳에 저장하세요.',
    backupTip: 'HMAC-SHA256 서명 포함.',
  },
  'zh-hant': {
    addWebhook: '+ 新增 webhook',
    createPanel: '建立 Webhook',
    urlPlaceholder: 'https://hooks.example.com/incoming',
    descriptionPlaceholder: '描述（選填）',
    close: '關閉',
    create: '建立',
    url: 'URL',
    events: '事件',
    status: '狀態',
    created: '建立時間',
    actions: '操作',
    empty: '尚未建立 webhook。',
    history: '紀錄',
    activate: '啟用',
    deactivate: '停用',
    active: '啟用中',
    inactive: '停用中',
    createdSecretLabel: '只顯示一次的密鑰：',
    createdSecretHint: '請立即複製並妥善保存。',
    backupTip: '包含 HMAC-SHA256 簽章。',
  },
  en: {
    addWebhook: '+ New webhook',
    createPanel: 'Create webhook',
    urlPlaceholder: 'https://hooks.example.com/incoming',
    descriptionPlaceholder: 'Description (optional)',
    close: 'Close',
    create: 'Create',
    url: 'URL',
    events: 'Events',
    status: 'Status',
    created: 'Created',
    actions: 'Actions',
    empty: 'No webhooks yet.',
    history: 'History',
    activate: 'Activate',
    deactivate: 'Deactivate',
    active: 'Active',
    inactive: 'Inactive',
    createdSecretLabel: 'Secret shown only once:',
    createdSecretHint: 'Copy it now and store it somewhere safe.',
    backupTip: 'Includes HMAC-SHA256 signing.',
  },
};

export default function WebhooksAdmin({ locale, initialSubscriptions }: Props) {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [showCreate, setShowCreate] = useState(false);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [events, setEvents] = useState<WebhookEventType[]>(['form.submitted']);
  const [busy, setBusy] = useState(false);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [messageTone, setMessageTone] = useState<'success' | 'error'>('success');
  const text = COPY[locale];

  async function create() {
    if (!url.trim()) return;
    setBusy(true);
    setError('');
    setCreatedSecret(null);
    setMessageTone('success');
    try {
      const params = new URLSearchParams({ locale });
      const res = await fetch(`/api/builder/webhooks?${params.toString()}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), description: description.trim() || undefined, events, active: true }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setMessageTone('error');
        setError(payload.error || res.statusText);
        return;
      }
      const payload = (await res.json()) as { subscription: WebhookSubscription };
      setMessageTone('success');
      setCreatedSecret(payload.subscription.secret);
      setSubscriptions((s) => [{ ...payload.subscription, secret: `${payload.subscription.secret.slice(0, 12)}…` }, ...s]);
      setUrl('');
      setDescription('');
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(webhookId: string, next: boolean) {
    setError('');
    setMessageTone('success');
    const params = new URLSearchParams({ locale });
    const res = await fetch(`/api/builder/webhooks/${webhookId}?${params.toString()}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: next }),
    });
    if (res.ok) {
      setSubscriptions((s) => s.map((x) => (x.webhookId === webhookId ? { ...x, active: next } : x)));
      return;
    }
    const payload = (await res.json().catch(() => ({}))) as { error?: string };
    setMessageTone('error');
    setError(payload.error || res.statusText);
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          style={{ marginLeft: 'auto', padding: '6px 12px', border: 0, background: '#0f172a', color: '#fff', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          {text.addWebhook}
        </button>
      </div>

      {showCreate ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc' }}>
          <input
            type="url"
            placeholder={text.urlPlaceholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
          />
          <input
            type="text"
            placeholder={text.descriptionPlaceholder}
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
          {error ? <div style={{ color: messageTone === 'error' ? '#dc2626' : '#16a34a', fontSize: 12 }}>{error}</div> : null}
          {createdSecret ? (
            <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', padding: 10, borderRadius: 6, fontSize: 12, color: '#92400e' }}>
              <strong>{text.createdSecretLabel}</strong>{' '}
              <code style={{ fontFamily: 'ui-monospace, Menlo, monospace', userSelect: 'all' }}>{createdSecret}</code>
              <div style={{ marginTop: 4 }}>{text.createdSecretHint}</div>
            </div>
          ) : null}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowCreate(false)} style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
              {text.close}
            </button>
            <button type="button" disabled={busy || events.length === 0} onClick={create} style={{ padding: '6px 12px', border: 0, background: busy || events.length === 0 ? '#94a3b8' : '#16a34a', color: '#fff', borderRadius: 6, fontSize: 13, cursor: busy ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
              {text.create}
            </button>
          </div>
        </div>
      ) : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>{text.url}</th>
            <th style={{ padding: '8px 12px' }}>{text.events}</th>
            <th style={{ padding: '8px 12px' }}>{text.status}</th>
            <th style={{ padding: '8px 12px' }}>{text.created}</th>
            <th style={{ padding: '8px 12px' }}>{text.actions}</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                {text.empty}
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
                <td style={{ padding: '8px 12px', display: 'flex', gap: 6 }}>
                  <Link
                    href={`/${locale}/admin-builder/webhooks/${sub.webhookId}`}
                    style={{ padding: '4px 8px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, color: '#0f172a', textDecoration: 'none' }}
                  >
                    {text.history}
                  </Link>
                  <button type="button" onClick={() => toggleActive(sub.webhookId, !sub.active)} style={{ padding: '4px 8px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                    {sub.active ? text.deactivate : text.activate}
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
