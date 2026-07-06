'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { Subscriber, SubscriberStatus } from '@/lib/builder/marketing/subscriber-types';

interface Props {
  initialSubscribers: Subscriber[];
  locale?: Locale;
}

const copy = {
  ko: {
    searchPlaceholder: '이메일 검색',
    refresh: '조회',
    add: '+ 구독자 추가',
    emailPlaceholder: 'email@example.com',
    tagsPlaceholder: '태그 (쉼표 구분)',
    save: '저장',
    allStatus: '전체 상태',
    email: '이메일',
    status: '상태',
    locale: '로케일',
    tags: '태그',
    source: '출처',
    joinedAt: '가입일',
    empty: '구독자가 없습니다.',
    failed: '실패',
    statusLabels: {
      pending: '대기',
      subscribed: '구독중',
      unsubscribed: '해지됨',
      bounced: '반송',
    } satisfies Record<SubscriberStatus, string>,
    dateLocale: 'ko-KR',
  },
  'zh-hant': {
    searchPlaceholder: '搜尋電子郵件',
    refresh: '查詢',
    add: '+ 新增訂閱者',
    emailPlaceholder: 'email@example.com',
    tagsPlaceholder: '標籤（以逗號分隔）',
    save: '儲存',
    allStatus: '全部狀態',
    email: '電子郵件',
    status: '狀態',
    locale: '語系',
    tags: '標籤',
    source: '來源',
    joinedAt: '加入日期',
    empty: '沒有訂閱者。',
    failed: '失敗',
    statusLabels: {
      pending: '待處理',
      subscribed: '已訂閱',
      unsubscribed: '已取消',
      bounced: '退信',
    } satisfies Record<SubscriberStatus, string>,
    dateLocale: 'zh-TW',
  },
  en: {
    searchPlaceholder: 'Search email',
    refresh: 'Refresh',
    add: '+ Add subscriber',
    emailPlaceholder: 'email@example.com',
    tagsPlaceholder: 'Tags (comma separated)',
    save: 'Save',
    allStatus: 'All statuses',
    email: 'Email',
    status: 'Status',
    locale: 'Locale',
    tags: 'Tags',
    source: 'Source',
    joinedAt: 'Joined',
    empty: 'No subscribers.',
    failed: 'Failed',
    statusLabels: {
      pending: 'Pending',
      subscribed: 'Subscribed',
      unsubscribed: 'Unsubscribed',
      bounced: 'Bounced',
    } satisfies Record<SubscriberStatus, string>,
    dateLocale: 'en-US',
  },
} as const;

const STATUS_COLOR: Record<SubscriberStatus, string> = {
  pending: '#f59e0b',
  subscribed: '#16a34a',
  unsubscribed: '#94a3b8',
  bounced: '#dc2626',
};

function localizedMarketingApiPath(locale: Locale, path: string): string {
  if (locale === 'ko') return path;
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}locale=${locale}`;
}

export default function SubscribersAdmin({ initialSubscribers, locale = 'ko' }: Props) {
  const text = copy[locale];
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SubscriberStatus | ''>('');
  const [creating, setCreating] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newTags, setNewTags] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const visible = useMemo(
    () => subscribers
      .filter((s) => !statusFilter || s.status === statusFilter)
      .filter((s) => !search.trim() || s.email.includes(search.trim().toLowerCase())),
    [subscribers, search, statusFilter],
  );

  async function refresh() {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (search.trim()) params.set('q', search.trim());
    const path = `/api/builder/marketing/subscribers${params.size ? `?${params.toString()}` : ''}`;
    const res = await fetch(localizedMarketingApiPath(locale, path), {
      credentials: 'same-origin',
    });
    if (res.ok) {
      const payload = (await res.json()) as { subscribers: Subscriber[] };
      setSubscribers(payload.subscribers);
    }
  }

  async function createSubscriber() {
    if (!newEmail.trim()) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(localizedMarketingApiPath(locale, '/api/builder/marketing/subscribers'), {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail.trim(),
          tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
          status: 'subscribed',
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || text.failed);
        return;
      }
      setCreating(false);
      setNewEmail('');
      setNewTags('');
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="search"
          placeholder={text.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as SubscriberStatus | '')}
          style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
        >
          <option value="">{text.allStatus}</option>
          {(Object.keys(text.statusLabels) as SubscriberStatus[]).map((s) => (
            <option key={s} value={s}>{text.statusLabels[s]}</option>
          ))}
        </select>
        <button type="button" onClick={refresh} style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
          {text.refresh}
        </button>
        <button
          type="button"
          onClick={() => setCreating((v) => !v)}
          style={{ marginLeft: 'auto', padding: '6px 12px', border: 0, background: '#0f172a', color: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer', fontWeight: 700 }}
        >
          {text.add}
        </button>
      </div>

      {creating ? (
        <div style={{ display: 'flex', gap: 8, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc' }}>
          <input
            type="email"
            placeholder={text.emailPlaceholder}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            style={{ flex: 1, padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
          />
          <input
            type="text"
            placeholder={text.tagsPlaceholder}
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            style={{ width: 200, padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
          />
          <button type="button" disabled={busy} onClick={createSubscriber} style={{ padding: '6px 12px', border: 0, background: busy ? '#94a3b8' : '#16a34a', color: '#fff', borderRadius: 6, fontSize: 13, cursor: busy ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
            {text.save}
          </button>
        </div>
      ) : null}
      {error ? <div style={{ color: '#dc2626', fontSize: 12 }}>{error}</div> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>{text.email}</th>
            <th style={{ padding: '8px 12px' }}>{text.status}</th>
            <th style={{ padding: '8px 12px' }}>{text.locale}</th>
            <th style={{ padding: '8px 12px' }}>{text.tags}</th>
            <th style={{ padding: '8px 12px' }}>{text.source}</th>
            <th style={{ padding: '8px 12px' }}>{text.joinedAt}</th>
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                {text.empty}
              </td>
            </tr>
          ) : (
            visible.map((s) => (
              <tr key={s.subscriberId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 12px' }}>{s.email}</td>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, background: `${STATUS_COLOR[s.status]}22`, color: STATUS_COLOR[s.status], fontWeight: 700, fontSize: 11 }}>
                    {text.statusLabels[s.status]}
                  </span>
                </td>
                <td style={{ padding: '8px 12px' }}>{s.preferredLocale}</td>
                <td style={{ padding: '8px 12px' }}>{s.tags.join(', ') || '—'}</td>
                <td style={{ padding: '8px 12px' }}>{s.source}</td>
                <td style={{ padding: '8px 12px', color: '#64748b' }}>{new Date(s.createdAt).toLocaleDateString(text.dateLocale)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
