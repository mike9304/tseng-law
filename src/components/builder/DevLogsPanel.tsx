'use client';

/**
 * F110 — Dev logs viewer.
 *
 * Polls /api/builder/dev/logs every 5s and renders a simple table.
 * Source filter dropdown toggles between function, webhook, app buffers.
 *
 * Limitation: the underlying ring buffer lives in module memory of the
 * Node.js process. Vercel serverless functions do not share memory across
 * invocations, so this panel is most useful in `next dev` / preview
 * environments. Real production logging needs KV/Blob storage.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

type DevLogSource = 'function' | 'webhook' | 'app';
type DevLogLevel = 'log' | 'info' | 'warn' | 'error';

interface DevLogEntry {
  id: string;
  source: DevLogSource;
  level: DevLogLevel;
  message: string;
  timestamp: string;
  reference?: string;
}

const POLL_MS = 5000;
const SOURCES: DevLogSource[] = ['function', 'webhook', 'app'];

const LEVEL_COLOR: Record<DevLogLevel, string> = {
  log: '#475569',
  info: '#2563eb',
  warn: '#a16207',
  error: '#dc2626',
};

export default function DevLogsPanel() {
  const [source, setSource] = useState<DevLogSource>('function');
  const [entries, setEntries] = useState<DevLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const lastTsRef = useRef<string | null>(null);

  const refresh = useCallback(async (reset = false) => {
    try {
      const params = new URLSearchParams({ source });
      if (!reset && lastTsRef.current) params.set('since', lastTsRef.current);
      const response = await fetch(`/api/builder/dev/logs?${params.toString()}`);
      if (!response.ok) {
        setError(`HTTP ${response.status}`);
        return;
      }
      const json = (await response.json()) as { entries?: DevLogEntry[] };
      const incoming = json.entries ?? [];
      setError(null);
      setEntries((prev) => {
        const base = reset ? [] : prev;
        const next = [...base, ...incoming].slice(-200);
        return next;
      });
      const newest = incoming[incoming.length - 1];
      if (newest) lastTsRef.current = newest.timestamp;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown_error');
    }
  }, [source]);

  useEffect(() => {
    lastTsRef.current = null;
    setEntries([]);
    void refresh(true);
    const handle = window.setInterval(() => { void refresh(false); }, POLL_MS);
    return () => window.clearInterval(handle);
  }, [refresh]);

  return (
    <div
      data-builder-dev-logs-panel="true"
      style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}
    >
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Dev Logs</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#475569' }}>
            In-memory ring buffer (≤ 200 entries). Promote to durable storage for production.
          </p>
        </div>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <span>Source</span>
          <select
            value={source}
            onChange={(event) => setSource(event.target.value as DevLogSource)}
            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1' }}
          >
            {SOURCES.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
      </header>

      {error ? (
        <div style={{ color: '#dc2626', fontSize: 12 }}>Logs error: {error}</div>
      ) : null}

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 12,
          background: '#fff',
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 10px', width: 170 }}>timestamp</th>
            <th style={{ padding: '8px 10px', width: 70 }}>level</th>
            <th style={{ padding: '8px 10px', width: 140 }}>reference</th>
            <th style={{ padding: '8px 10px' }}>message</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 16, color: '#94a3b8', textAlign: 'center' }}>
                No log entries yet.
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr key={entry.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '6px 10px', fontFamily: 'ui-monospace, Menlo, monospace', color: '#475569' }}>
                  {entry.timestamp}
                </td>
                <td style={{ padding: '6px 10px', color: LEVEL_COLOR[entry.level], fontWeight: 600 }}>
                  {entry.level}
                </td>
                <td style={{ padding: '6px 10px', color: '#0f172a' }}>{entry.reference ?? ''}</td>
                <td style={{ padding: '6px 10px', whiteSpace: 'pre-wrap' }}>{entry.message}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}