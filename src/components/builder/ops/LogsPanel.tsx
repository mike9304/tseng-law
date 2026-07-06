'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LogAggregateResult, UnifiedLogType, UnifiedLogEntry } from '@/lib/builder/ops/logs-aggregator';
import {
  buildUnifiedLogsExportFile,
  buildUnifiedLogsExportFilename,
  filterUnifiedLogEntries,
  serializeUnifiedLogsExportFile,
} from '@/lib/builder/ops/logs-view';
import styles from './LogsPanel.module.css';

const TYPE_OPTIONS: Array<{ value: '' | UnifiedLogType; label: string }> = [
  { value: '', label: '전체' },
  { value: 'audit', label: 'Audit' },
  { value: 'dev', label: 'Dev' },
  { value: 'security', label: 'Security' },
  { value: 'error', label: 'Error' },
];

const LEVEL_OPTIONS: Array<{ value: '' | UnifiedLogEntry['level']; label: string }> = [
  { value: '', label: '전체' },
  { value: 'info', label: 'info' },
  { value: 'warning', label: 'warning' },
  { value: 'error', label: 'error' },
];

function levelColor(level: UnifiedLogEntry['level']): string {
  if (level === 'error') return '#b91c1c';
  if (level === 'warning') return '#b45309';
  return '#0f172a';
}

function parseLogType(value: string | undefined): '' | UnifiedLogType {
  switch (value) {
    case 'audit':
    case 'dev':
    case 'security':
    case 'error':
      return value;
    default:
      return '';
  }
}

function parseLogLevel(value: string | undefined): '' | UnifiedLogEntry['level'] {
  switch (value) {
    case 'info':
    case 'warning':
    case 'error':
      return value;
    default:
      return '';
  }
}

function detailKey(label: string): string {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'detail';
}

function LogDetails({ entry }: { entry: UnifiedLogEntry }) {
  if (!entry.details?.length) return null;
  return (
    <div
      data-ops-log-details="true"
      style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6, fontFamily: 'system-ui, sans-serif' }}
    >
      {entry.details.map((detail) => (
        <span
          key={`${detail.label}-${detail.value}`}
          data-ops-log-detail={detailKey(detail.label)}
          style={{ border: '1px solid #cbd5e1', borderRadius: 999, padding: '2px 7px', color: '#334155', background: '#f8fafc' }}
        >
          <strong style={{ color: '#0f172a', fontWeight: 700 }}>{detail.label}</strong>: {detail.value}
        </span>
      ))}
    </div>
  );
}

interface LogsPanelProps {
  initialType?: string;
  initialLevel?: string;
  initialQuery?: string;
}

export default function LogsPanel({ initialType, initialLevel, initialQuery }: LogsPanelProps) {
  const [data, setData] = useState<LogAggregateResult | null>(null);
  const [typeFilter, setTypeFilter] = useState<'' | UnifiedLogType>(() => parseLogType(initialType));
  const [levelFilter, setLevelFilter] = useState<'' | UnifiedLogEntry['level']>(() => parseLogLevel(initialLevel));
  const [query, setQuery] = useState(() => initialQuery?.trim() ?? '');
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const qs = typeFilter ? `?type=${encodeURIComponent(typeFilter)}` : '';
      const res = await fetch(`/api/builder/ops/logs${qs}`, { credentials: 'same-origin' });
      if (res.ok) setData(await res.json() as LogAggregateResult);
    } finally {
      setRefreshing(false);
    }
  }, [typeFilter]);

  useEffect(() => { void refresh(); }, [refresh]);

  const visibleEntries = useMemo(() => {
    if (!data) return [];
    return filterUnifiedLogEntries(data.entries, {
      type: typeFilter,
      level: levelFilter,
      query,
    });
  }, [data, levelFilter, query, typeFilter]);

  const handleExport = useCallback(() => {
    if (!data || exporting || visibleEntries.length === 0) return;
    setExporting(true);
    try {
      const file = buildUnifiedLogsExportFile({
        entries: visibleEntries,
        counts: data.counts,
        filters: {
          type: typeFilter,
          level: levelFilter,
          query,
        },
      });
      const blob = new Blob([serializeUnifiedLogsExportFile(file)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = buildUnifiedLogsExportFilename({
        type: typeFilter,
        level: levelFilter,
        query,
      });
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, [data, exporting, levelFilter, query, typeFilter, visibleEntries]);

  return (
    <div data-ops-logs-panel="true" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: 12, color: '#64748b', display: 'flex', gap: 6, alignItems: 'center' }}>
          타입
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(parseLogType(e.target.value))}
            style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }}
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <label style={{ fontSize: 12, color: '#64748b', display: 'flex', gap: 6, alignItems: 'center' }}>
          레벨
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(parseLogLevel(e.target.value))}
            style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }}
          >
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        <label style={{ fontSize: 12, color: '#64748b', display: 'flex', gap: 6, alignItems: 'center' }}>
          검색
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="summary / detail / actor / at"
            style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, minWidth: 220 }}
          />
        </label>
        <button type="button" disabled={refreshing} onClick={refresh}
          style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
          {refreshing ? '...' : '새로고침'}
        </button>
        <button
          type="button"
          disabled={exporting || visibleEntries.length === 0}
          onClick={handleExport}
          style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 12, cursor: exporting || visibleEntries.length === 0 ? 'not-allowed' : 'pointer' }}
        >
          {exporting ? '내보내는 중...' : 'JSON 내보내기'}
        </button>
        {data?.counts ? (
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}>
            audit {data.counts.audit} · dev {data.counts.dev} · security {data.counts.security} · error {data.counts.error}
          </span>
        ) : null}
      </div>

      <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '6px 10px' }}>at</th>
            <th style={{ padding: '6px 10px' }}>source</th>
            <th style={{ padding: '6px 10px' }}>level</th>
            <th style={{ padding: '6px 10px' }}>summary</th>
          </tr>
        </thead>
        <tbody>
          {!data || visibleEntries.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>{data ? '필터에 맞는 로그가 없습니다.' : '로그가 없습니다.'}</td></tr>
          ) : visibleEntries.map((entry, idx) => (
            <tr key={`${entry.at}-${idx}`} className={styles.row} data-ops-log-row="true" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td className={styles.cell} data-label="at" style={{ padding: '6px 10px', color: '#64748b', whiteSpace: 'nowrap' }}>{new Date(entry.at).toLocaleString('ko-KR')}</td>
              <td className={styles.cell} data-label="source" style={{ padding: '6px 10px' }}>{entry.source}</td>
              <td className={styles.cell} data-label="level" style={{ padding: '6px 10px', color: levelColor(entry.level), fontWeight: 700 }}>{entry.level}</td>
              <td className={`${styles.cell} ${styles.summaryCell}`} data-label="summary" style={{ padding: '6px 10px', fontFamily: 'ui-monospace, Menlo, monospace' }}>
                <span data-ops-log-summary="true">{entry.summary}</span>
                <LogDetails entry={entry} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
