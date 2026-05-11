'use client';

import { useState } from 'react';
import type { CapturedError } from '@/lib/builder/errors/types';

interface Props {
  initialEntries: CapturedError[];
  totalCount: number;
  severityCount: Record<string, number>;
  sentryConfigured: boolean;
}

const SEVERITY_COLOR: Record<string, string> = {
  info: '#0ea5e9',
  warning: '#f59e0b',
  error: '#dc2626',
  fatal: '#7f1d1d',
};

export default function ErrorsAdmin({ initialEntries, totalCount, severityCount, sentryConfigured }: Props) {
  const [entries, setEntries] = useState(initialEntries);
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [originFilter, setOriginFilter] = useState<string>('');

  async function refresh() {
    const res = await fetch('/api/builder/errors', { credentials: 'same-origin' });
    if (!res.ok) return;
    const payload = (await res.json()) as { recent: CapturedError[] };
    setEntries(payload.recent);
  }

  const visible = entries
    .filter((e) => !severityFilter || e.severity === severityFilter)
    .filter((e) => !originFilter || e.origin === originFilter);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 13 }}>
        <strong>누적: {totalCount}</strong>
        {Object.entries(severityCount).map(([sev, count]) => (
          <span key={sev} style={{ color: SEVERITY_COLOR[sev] ?? '#475569' }}>
            {sev}: {count}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: sentryConfigured ? '#16a34a' : '#94a3b8' }}>
          Sentry: {sentryConfigured ? '연결됨' : '미설정'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}>
          <option value="">모든 심각도</option>
          <option value="info">info</option>
          <option value="warning">warning</option>
          <option value="error">error</option>
          <option value="fatal">fatal</option>
        </select>
        <select value={originFilter} onChange={(e) => setOriginFilter(e.target.value)} style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}>
          <option value="">모든 origin</option>
          <option value="builder">builder</option>
          <option value="site">site</option>
          <option value="api">api</option>
          <option value="client">client</option>
        </select>
        <button type="button" onClick={refresh} style={{ marginLeft: 'auto', padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
          새로고침
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '6px 10px' }}>시각</th>
            <th style={{ padding: '6px 10px' }}>origin</th>
            <th style={{ padding: '6px 10px' }}>severity</th>
            <th style={{ padding: '6px 10px' }}>메시지</th>
            <th style={{ padding: '6px 10px' }}>tags</th>
            <th style={{ padding: '6px 10px' }}>Sentry</th>
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                기록된 에러가 없습니다.
              </td>
            </tr>
          ) : (
            visible.map((entry) => (
              <tr key={entry.errorId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '6px 10px', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {new Date(entry.capturedAt).toLocaleString('ko-KR')}
                </td>
                <td style={{ padding: '6px 10px' }}>{entry.origin}</td>
                <td style={{ padding: '6px 10px' }}>
                  <span style={{ padding: '2px 6px', borderRadius: 999, background: `${SEVERITY_COLOR[entry.severity] ?? '#475569'}22`, color: SEVERITY_COLOR[entry.severity] ?? '#475569', fontWeight: 700 }}>
                    {entry.severity}
                  </span>
                </td>
                <td style={{ padding: '6px 10px', maxWidth: 400, wordBreak: 'break-word' }}>
                  <code style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{entry.message}</code>
                </td>
                <td style={{ padding: '6px 10px', fontSize: 11, color: '#475569' }}>
                  {entry.tags ? Object.entries(entry.tags).map(([k, v]) => `${k}=${v}`).join(', ') : '—'}
                </td>
                <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                  {entry.forwardedToSentry ? '✓' : '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
