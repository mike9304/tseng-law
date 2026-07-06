'use client';

import { useEffect, useState } from 'react';
import type {
  CacheInventorySummary,
  CacheKeyMeta,
  CachePurgeMode,
  CachePurgeReport,
} from '@/lib/builder/ops/cache-introspection';
import {
  emptyCacheSummary,
  parseCachePayload,
  parseCachePurgePayload,
  readResponsePayload,
} from './cachePayloads';
import {
  CacheField,
  CacheMetric,
  CacheReport,
  formatCacheAge,
  formatCacheBytes,
  formatCacheDate,
} from './CachePanelViews';

export default function CachePanel() {
  const [keys, setKeys] = useState<CacheKeyMeta[]>([]);
  const [summary, setSummary] = useState<CacheInventorySummary>(emptyCacheSummary);
  const [latestPurge, setLatestPurge] = useState<CachePurgeReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function refresh() {
    setMessage('');
    const res = await fetch('/api/builder/ops/cache', { credentials: 'same-origin' });
    if (res.ok) {
      const payload = parseCachePayload(await readResponsePayload(res));
      setKeys([...payload.keys]);
      setSummary(payload.summary);
      setLatestPurge(payload.latestPurge);
    }
  }

  async function clearOne(key: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/builder/ops/cache?key=${encodeURIComponent(key)}`, {
        method: 'DELETE', credentials: 'same-origin',
      });
      if (res.ok) {
        const payload = parseCachePurgePayload(await readResponsePayload(res));
        if (payload.summary) setSummary(payload.summary);
        setMessage(`cleared ${key}`);
        await refresh();
      } else {
        setMessage(`failed: ${res.statusText}`);
      }
    } finally { setBusy(false); }
  }

  async function purge(mode: CachePurgeMode) {
    if (mode === 'all' && !window.confirm('모든 캐시 키를 삭제합니다. 계속할까요?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/builder/ops/cache?mode=${mode}`, {
        method: 'POST', credentials: 'same-origin',
      });
      const payload = parseCachePurgePayload(await readResponsePayload(res));
      if (res.ok && payload.report) {
        setLatestPurge(payload.report);
        if (payload.summary) setSummary(payload.summary);
        setMessage(`cleared ${payload.cleared} ${mode === 'stale' ? 'stale ' : ''}keys`);
      } else {
        setMessage(`failed: ${payload.error ?? res.statusText}`);
      }
      await refresh();
    } finally { setBusy(false); }
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <div data-ops-cache-panel="true" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="button" disabled={busy} onClick={refresh}
          style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
          새로고침
        </button>
        <button type="button" disabled={busy || summary.staleKeys === 0} onClick={() => purge('stale')}
          data-ops-cache-purge-stale="true"
          style={{ padding: '6px 12px', border: '1px solid #fed7aa', color: '#c2410c', background: '#fff', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
          오래된 키 삭제
        </button>
        <button type="button" disabled={busy || keys.length === 0} onClick={() => purge('all')}
          data-ops-cache-purge-all="true"
          style={{ padding: '6px 12px', border: '1px solid #fecaca', color: '#b91c1c', background: '#fff', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
          전체 삭제
        </button>
        {message ? <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}>{message}</span> : null}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: 10 }}>
        <CacheMetric label="전체 키" value={summary.totalKeys} marker="total" />
        <CacheMetric label="오래된 키" value={summary.staleKeys} marker="stale" tone={summary.staleKeys > 0 ? 'warn' : 'ok'} />
        <CacheMetric label="대형 키" value={summary.largeKeys} marker="large" tone={summary.largeKeys > 0 ? 'warn' : 'ok'} />
        <CacheMetric label="총 용량" value={formatCacheBytes(summary.totalBytes)} marker="bytes" />
      </div>

      <CacheReport report={latestPurge} />

      <div style={{ display: 'grid', gap: 10 }}>
        {keys.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}>
            캐시 키가 없습니다.
          </div>
        ) : keys.map((meta) => (
          <div
            key={meta.key}
            data-ops-cache-row={meta.key}
            data-ops-cache-stale={String(meta.stale)}
            data-ops-cache-large={String(meta.large)}
            style={{ display: 'grid', gap: 10, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, color: '#0f172a', wordBreak: 'break-all' }}>{meta.key}</span>
              <span style={{
                padding: '2px 6px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                background: meta.stale ? '#ffedd5' : '#dcfce7',
                color: meta.stale ? '#9a3412' : '#166534',
              }}>{meta.stale ? 'stale' : 'fresh'}</span>
            </div>
            <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: 10, margin: 0 }}>
              <CacheField label="size" value={formatCacheBytes(meta.sizeBytes)} />
              <CacheField label="age" value={formatCacheAge(meta.ageMs)} />
              <CacheField label="last written" value={formatCacheDate(meta.lastWrittenAt)} />
              <CacheField label="large" value={meta.large ? 'true' : 'false'} />
            </dl>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" disabled={busy} onClick={() => clearOne(meta.key)}
                data-ops-cache-delete={meta.key}
                style={{ padding: '4px 8px', border: '1px solid #fecaca', color: '#b91c1c', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
