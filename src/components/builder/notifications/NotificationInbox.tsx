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

const KIND_LABELS: Record<BuilderNotification['kind'], string> = {
  comment: 'Comment',
  approval: 'Approval',
  order: 'Order',
  booking: 'Booking',
  'app-install': 'App',
  publish: 'Publish',
};

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

export interface NotificationInboxProps {
  /** Override fetch endpoint for testing. */
  endpoint?: string;
  /** Poll interval in ms while the dropdown is open. */
  pollMs?: number;
}

export default function NotificationInbox({
  endpoint = '/api/builder/notifications',
  pollMs = 60_000,
}: NotificationInboxProps) {
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
      const res = await fetch(`${endpoint}?limit=20`, { credentials: 'same-origin' });
      if (!res.ok) throw new Error(`status_${res.status}`);
      const json = (await res.json()) as { notifications?: BuilderNotification[] };
      setItems(Array.isArray(json.notifications) ? json.notifications : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'load_failed');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

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
          await fetch(`${endpoint}/${notification.id}`, {
            method: 'PATCH',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
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
    [endpoint],
  );

  const onMarkAll = useCallback(async () => {
    try {
      await fetch(endpoint, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      setItems((current) => current.map((n) => (n.readAt ? n : { ...n, readAt: new Date().toISOString() })));
    } catch {
      // ignore
    }
  }, [endpoint]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        style={BELL_BUTTON_STYLE}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 ? <span style={BADGE_STYLE}>{unreadCount > 99 ? '99+' : unreadCount}</span> : null}
      </button>
      {open ? (
        <div style={DROPDOWN_STYLE} role="dialog" aria-label="Notification inbox">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px' }}>
            <strong style={{ fontSize: 14 }}>Notifications</strong>
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
              Mark all read
            </button>
          </div>
          {loading && items.length === 0 ? (
            <div style={{ padding: 16, fontSize: 13, color: '#64748b' }}>Loading...</div>
          ) : null}
          {error ? (
            <div style={{ padding: 12, fontSize: 12, color: '#dc2626' }}>Failed: {error}</div>
          ) : null}
          {!loading && items.length === 0 && !error ? (
            <div style={{ padding: 16, fontSize: 13, color: '#64748b' }}>No notifications.</div>
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
                    {KIND_LABELS[n.kind]} · {n.body || '(no details)'}
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