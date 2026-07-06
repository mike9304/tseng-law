'use client';

/**
 * F104 — Notification bell + dropdown.
 *
 * Mounts in the admin shell header. Fetches /api/builder/notifications on
 * mount and every 60s while open. Renders a bell icon with an unread badge
 * and a dropdown listing the most recent 20 notifications. Each row marks
 * itself read on click; a "Mark all read" button triggers PUT.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BuilderNotification } from '@/lib/builder/notifications/notification-model';
import { normalizeLocale, type Locale } from '@/lib/locales';

const KIND_TONES: Record<BuilderNotification['kind'], string> = {
  comment: '#0ea5e9',
  approval: '#a855f7',
  order: '#10b981',
  booking: '#f59e0b',
  'app-install': '#6366f1',
  publish: '#22c55e',
};

const BELL_BUTTON_STYLE: React.CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#ffffff',
  cursor: 'pointer',
};

const DROPDOWN_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 44,
  right: 0,
  width: 360,
  maxHeight: 480,
  overflowY: 'auto',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  boxShadow: '0 12px 32px rgba(15,23,42,0.12)',
  zIndex: 50,
  padding: 8,
};

const BADGE_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: -4,
  right: -4,
  minWidth: 18,
  height: 18,
  padding: '0 4px',
  borderRadius: 9,
  background: '#ef4444',
  color: '#ffffff',
  fontSize: 11,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function formatRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return 'now';
  if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m`;
  if (ms < 86_400_000) return `${Math.floor(ms / 3_600_000)}h`;
  return `${Math.floor(ms / 86_400_000)}d`;
}

export function getNotificationInboxCopy(locale: Locale) {
  const kindLabels: Record<BuilderNotification['kind'], string> = {
    comment: locale === 'ko' ? '댓글' : locale === 'zh-hant' ? '留言' : 'Comment',
    approval: locale === 'ko' ? '승인' : locale === 'zh-hant' ? '核准' : 'Approval',
    order: locale === 'ko' ? '주문' : locale === 'zh-hant' ? '訂單' : 'Order',
    booking: locale === 'ko' ? '예약' : locale === 'zh-hant' ? '預約' : 'Booking',
    'app-install': locale === 'ko' ? '앱' : locale === 'zh-hant' ? '應用程式' : 'App',
    publish: locale === 'ko' ? '게시' : locale === 'zh-hant' ? '發布' : 'Publish',
  };

  return {
    buttonLabel: (unreadCount: number) => {
      if (locale === 'ko') return unreadCount > 0 ? `알림 (${unreadCount}개 읽지 않음)` : '알림';
      if (locale === 'zh-hant') return unreadCount > 0 ? `通知（${unreadCount} 則未讀）` : '通知';
      return unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications';
    },
    dialogLabel: locale === 'ko' ? '알림함' : locale === 'zh-hant' ? '通知收件匣' : 'Notification inbox',
    title: locale === 'ko' ? '알림' : locale === 'zh-hant' ? '通知' : 'Notifications',
    markAllRead: locale === 'ko' ? '모두 읽음' : locale === 'zh-hant' ? '全部標為已讀' : 'Mark all read',
    loading: locale === 'ko' ? '불러오는 중...' : locale === 'zh-hant' ? '載入中...' : 'Loading...',
    failedPrefix: locale === 'ko' ? '실패' : locale === 'zh-hant' ? '失敗' : 'Failed',
    empty: locale === 'ko' ? '알림이 없습니다.' : locale === 'zh-hant' ? '沒有通知。' : 'No notifications.',
    noDetails: locale === 'ko' ? '세부 정보 없음' : locale === 'zh-hant' ? '沒有詳細資料' : 'no details',
    loadFailed: locale === 'ko' ? '알림을 불러오지 못했습니다.' : locale === 'zh-hant' ? '無法載入通知。' : 'Unable to load notifications.',
    kindLabels,
  } as const;
}

function appendLocale(url: string, locale: Locale, extra?: Record<string, string | number>): string {
  const params = new URLSearchParams({ locale, ...Object.fromEntries(Object.entries(extra ?? {}).map(([key, value]) => [key, String(value)])) });
  return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
}

export interface NotificationInboxProps {
  /** Override fetch endpoint for testing. */
  endpoint?: string;
  locale?: Locale;
  /** Poll interval in ms while the dropdown is open. */
  pollMs?: number;
}

export default function NotificationInbox({
  endpoint = '/api/builder/notifications',
  locale = 'ko',
  pollMs = 60_000,
}: NotificationInboxProps) {
  const effectiveLocale = normalizeLocale(locale);
  const copy = useMemo(() => getNotificationInboxCopy(effectiveLocale), [effectiveLocale]);
  const [items, setItems] = useState<BuilderNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = useMemo(() => items.filter((n) => !n.readAt).length, [items]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(appendLocale(endpoint, effectiveLocale, { limit: 20 }), { credentials: 'same-origin' });
      const json = (await res.json().catch(() => ({}))) as { notifications?: BuilderNotification[]; error?: string };
      if (!res.ok) throw new Error(json.error || copy.loadFailed);
      setItems(Array.isArray(json.notifications) ? json.notifications : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [copy.loadFailed, effectiveLocale, endpoint]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => {
      void load();
    }, pollMs);
    return () => window.clearInterval(timer);
  }, [open, pollMs, load]);

  useEffect(() => {
    if (!open) return;
    function onDocClick(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const onItemClick = useCallback(
    async (notification: BuilderNotification) => {
      if (!notification.readAt) {
        try {
          await fetch(appendLocale(`${endpoint}/${notification.id}`, effectiveLocale), {
            method: 'PATCH',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locale: effectiveLocale }),
          });
          setItems((current) =>
            current.map((n) => (n.id === notification.id ? { ...n, readAt: new Date().toISOString() } : n)),
          );
        } catch {
          // ignore — UI will refresh next poll
        }
      }
      if (notification.link) {
        window.location.href = notification.link;
      }
    },
    [effectiveLocale, endpoint],
  );

  const onMarkAll = useCallback(async () => {
    try {
      await fetch(appendLocale(endpoint, effectiveLocale), {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: effectiveLocale }),
      });
      setItems((current) => current.map((n) => (n.readAt ? n : { ...n, readAt: new Date().toISOString() })));
    } catch {
      // ignore
    }
  }, [effectiveLocale, endpoint]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        style={BELL_BUTTON_STYLE}
        aria-label={copy.buttonLabel(unreadCount)}
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 ? <span style={BADGE_STYLE}>{unreadCount > 99 ? '99+' : unreadCount}</span> : null}
      </button>
      {open ? (
        <div style={DROPDOWN_STYLE} role="dialog" aria-label={copy.dialogLabel}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px' }}>
            <strong style={{ fontSize: 14 }}>{copy.title}</strong>
            <button
              type="button"
              onClick={() => void onMarkAll()}
              disabled={unreadCount === 0}
              style={{
                background: 'none',
                border: 'none',
                color: unreadCount === 0 ? '#94a3b8' : '#2563eb',
                cursor: unreadCount === 0 ? 'default' : 'pointer',
                fontSize: 12,
              }}
            >
              {copy.markAllRead}
            </button>
          </div>
          {loading && items.length === 0 ? (
            <div style={{ padding: 16, fontSize: 13, color: '#64748b' }}>{copy.loading}</div>
          ) : null}
          {error ? (
            <div style={{ padding: 12, fontSize: 12, color: '#dc2626' }}>{copy.failedPrefix}: {error}</div>
          ) : null}
          {!loading && items.length === 0 && !error ? (
            <div style={{ padding: 16, fontSize: 13, color: '#64748b' }}>{copy.empty}</div>
          ) : null}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {items.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => void onItemClick(n)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: n.readAt ? 'transparent' : '#f8fafc',
                    border: 'none',
                    borderTop: '1px solid #f1f5f9',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        background: KIND_TONES[n.kind],
                      }}
                    />
                    <strong style={{ fontSize: 13 }}>{n.subject}</strong>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8' }}>{formatRelative(n.createdAt)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#475569' }}>
                    {copy.kindLabels[n.kind]} · {n.body || `(${copy.noDetails})`}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
