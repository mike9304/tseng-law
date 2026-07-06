'use client';

/**
 * F110 — Dev logs viewer.
 *
 * Polls /api/builder/dev/logs every 5s and renders a searchable table.
 * Source filter dropdown toggles between function, webhook, app buffers.
 *
 * The backend is file-backed for local dev, but this panel still speaks to
 * the read API so route bundle reloads and future durable backends do not
 * require a UI rewrite.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  buildDevLogsExportFile,
  buildDevLogsExportFilename,
  serializeDevLogsExportFile,
} from '@/lib/builder/dev/logs-export';

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
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<DevLogLevel | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const lastTsRef = useRef<string | null>(null);

  const refresh = useCallback(async (reset = false) => {
    try {
      setIsRefreshing(true);
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
    } finally {
      setIsRefreshing(false);
    }
  }, [source]);

  useEffect(() => {
    lastTsRef.current = null;
    setEntries([]);
    void refresh(true);
    const handle = window.setInterval(() => { void refresh(false); }, POLL_MS);
    return () => window.clearInterval(handle);
  }, [refresh]);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (level !== 'all' && entry.level !== level) return false;
      if (!normalizedQuery) return true;
      return [
        entry.message,
        entry.reference ?? '',
        entry.source,
        entry.level,
        entry.timestamp,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [entries, level, query]);
  const matchedCount = filteredEntries.length;
  const totalCount = entries.length;

  const handleExport = useCallback(() => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const exportFile = buildDevLogsExportFile({
        source,
        entries: filteredEntries,
        level,
        query,
      });
      const blob = new Blob([serializeDevLogsExportFile(exportFile)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = buildDevLogsExportFilename({
        source,
        entries: filteredEntries,
        level,
        query,
      });
      link.rel = 'noreferrer';
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }, [filteredEntries, isExporting, level, query, source]);

  return (
    <div
      data-builder-dev-logs-panel="true"
      style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}
    >
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Dev Logs</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#475569' }}>
            File-backed locally, polled through the API. Search by message, reference, source, or timestamp.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
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
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <span>Level</span>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as DevLogLevel | 'all')}
              style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            >
              <option value="all">all</option>
              <option value="log">log</option>
              <option value="info">info</option>
              <option value="warn">warn</option>
              <option value="error">error</option>
            </select>
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <span>Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="message / reference / text"
              style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', minWidth: 220 }}
            />
          </label>
          <button
            type="button"
            onClick={() => void refresh(true)}
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              background: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {isRefreshing ? 'Refreshing…' : 'Refresh'}
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={filteredEntries.length === 0 || isExporting}
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              background: filteredEntries.length === 0 ? '#f8fafc' : '#fff',
              color: filteredEntries.length === 0 ? '#94a3b8' : '#0f172a',
              cursor: filteredEntries.length === 0 || isExporting ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            {isExporting ? 'Exporting…' : 'Export JSON'}
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12, color: '#475569' }}>
        <span>{source} logs</span>
        <span>{matchedCount} matched / {totalCount} loaded</span>
        {lastTsRef.current ? <span>latest {lastTsRef.current}</span> : null}
      </div>

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
          {filteredEntries.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 16, color: '#94a3b8', textAlign: 'center' }}>
                {entries.length === 0 ? 'No log entries yet.' : 'No log entries match the current filters.'}
              </td>
            </tr>
          ) : (
            filteredEntries.map((entry) => (
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
