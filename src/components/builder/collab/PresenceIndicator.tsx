'use client';

import { useEffect, useRef, useState } from 'react';

const HEARTBEAT_MS = 5_000;
const POLL_MS = 8_000;
const SESSION_KEY = 'builder.collab.sessionId';

interface ActivePresence {
  sessionId: string;
  username: string;
  color: string;
  lastSeenAt: string;
  nodeId?: string;
}

interface PresenceIndicatorProps {
  siteId?: string;
  pageId: string;
  /** Currently selected node — surfaced to other collaborators. */
  selectedNodeId?: string;
  /** Optional override for the indicator label tooltip. */
  className?: string;
}

function ensureSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    window.sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function initialsFromUsername(username: string): string {
  const trimmed = username.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}

function relativeAgo(iso: string, now: number = Date.now()): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return '';
  const diff = Math.max(0, Math.round((now - t) / 1000));
  if (diff < 10) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  const m = Math.round(diff / 60);
  return `${m}m ago`;
}

export default function PresenceIndicator(props: PresenceIndicatorProps) {
  const { pageId, selectedNodeId, className } = props;
  const siteId = props.siteId ?? 'default';
  const [active, setActive] = useState<ActivePresence[]>([]);
  const sessionIdRef = useRef<string>('');
  const selectedRef = useRef<string | undefined>(selectedNodeId);

  useEffect(() => {
    selectedRef.current = selectedNodeId;
  }, [selectedNodeId]);

  useEffect(() => {
    sessionIdRef.current = ensureSessionId();
    if (!sessionIdRef.current) return;

    let cancelled = false;

    const sendHeartbeat = async () => {
      try {
        const res = await fetch('/api/builder/collab/presence', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId,
            pageId,
            sessionId: sessionIdRef.current,
            nodeId: selectedRef.current,
          }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as { active?: ActivePresence[] };
        if (!cancelled && Array.isArray(data.active)) {
          setActive(data.active);
        }
      } catch {
        /* swallow — transient network failures should not break the editor */
      }
    };

    const poll = async () => {
      try {
        const params = new URLSearchParams({ siteId, pageId });
        const res = await fetch(`/api/builder/collab/presence?${params.toString()}`, {
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = (await res.json()) as { active?: ActivePresence[] };
        if (!cancelled && Array.isArray(data.active)) {
          setActive(data.active);
        }
      } catch {
        /* swallow */
      }
    };

    sendHeartbeat();
    const hb = setInterval(sendHeartbeat, HEARTBEAT_MS);
    const pl = setInterval(poll, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(hb);
      clearInterval(pl);
    };
  }, [siteId, pageId]);

  const others = active.filter((entry) => entry.sessionId !== sessionIdRef.current);
  const visible = others.slice(0, 5);
  const overflow = Math.max(0, others.length - visible.length);

  if (visible.length === 0 && overflow === 0) return null;

  return (
    <div
      className={className}
      role="group"
      aria-label="Active collaborators"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
      data-builder-presence-indicator=""
    >
      {visible.map((entry) => (
        <div
          key={entry.sessionId}
          title={`${entry.username} · ${relativeAgo(entry.lastSeenAt)}${entry.nodeId ? ` · editing ${entry.nodeId}` : ''}`}
          aria-label={`${entry.username} active`}
          data-builder-presence-avatar=""
          data-builder-presence-username={entry.username}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: entry.color,
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #fff',
            boxShadow: '0 0 0 1px rgba(15, 23, 42, 0.15)',
            marginLeft: -6,
          }}
        >
          {initialsFromUsername(entry.username)}
        </div>
      ))}
      {overflow > 0 ? (
        <div
          aria-label={`${overflow} more collaborators`}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#475569',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #fff',
            marginLeft: -6,
          }}
        >
          +{overflow}
        </div>
      ) : null}
    </div>
  );
}