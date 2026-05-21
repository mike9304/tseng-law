'use client';

import { useEffect, useState } from 'react';
import type { LogAggregateResult, UnifiedLogType, UnifiedLogEntry } from '@/lib/builder/ops/logs-aggregator';

const TYPE_OPTIONS: Array<{ value: '' | UnifiedLogType; label: string }> = [
  { value: '', label: '전체' },
  { value: 'audit', label: 'Audit' },
  { value: 'dev', label: 'Dev' },
  { value: 'security', label: 'Security' },
  { value: 'error', label: 'Error' },
];

function levelColor(level: UnifiedLogEntry['level']): string {
  if (level === 'error') return '#b91c1c';
  if (level === 'warning') return '#b45309';
  return '#0f172a';
}

export default function LogsPanel() {
  const [data, setData] = useState<LogAggregateResult | null>(null);
  const [typeFilter, setTypeFilter] = useState<'' | UnifiedLogType>('');
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    try {
      const qs = typeFilter ? `?type=${encodeURIComponent(typeFilter)}` : '';
      const res = await fetch(`/api/builder/ops/logs${qs}`, { credentials: 'same-origin' });
      if (res.ok) setData(await res.json() as LogAggregateResult);
    } finally { setRefreshing(false); }
  }

  useEffect(() => { void refresh(); }, [typeFilter]);

  return (
    <div data-ops-logs-panel="true" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: 12, color: '#64748b', display: 'flex', gap: 6, alignItems: 'center' }}>
          타입
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as '' | UnifiedLogType)}
            style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <button type="button" disabled={refreshing} onClick={refresh}
          style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
          {refreshing ? '...' : '새로고침'}
        </button>
        {data?.counts ? (
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}>
            audit {data.counts.audit} · dev {data.counts.dev} · security {data.counts.security} · error {data.counts.error}
          </span>
        ) : null}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '6px 10px' }}>at</th>
            <th style={{ padding: '6px 10px' }}>source</th>
            <th style={{ padding: '6px 10px' }}>level</th>
            <th style={{ padding: '6px 10px' }}>summary</th>
          </tr>
        </thead>
        <tbody>
          {!data || data.entries.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>로그가 없습니다.</td></tr>
          ) : data.entries.map((entry, idx) => (
            <tr key={`${entry.at}-${idx}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '6px 10px', color: '#64748b', whiteSpace: 'nowrap' }}>{new Date(entry.at).toLocaleString('ko-KR')}</td>
              <td style={{ padding: '6px 10px' }}>{entry.source}</td>
              <td style={{ padding: '6px 10px', color: levelColor(entry.level), fontWeight: 700 }}>{entry.level}</td>
              <td style={{ padding: '6px 10px', fontFamily: 'ui-monospace, Menlo, monospace' }}>{entry.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}