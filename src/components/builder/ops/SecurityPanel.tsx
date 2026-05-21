'use client';

import { useEffect, useState } from 'react';
import type { SecuritySummary } from '@/lib/builder/ops/security-summary';

const WINDOW_OPTIONS = [1, 6, 24, 72, 168] as const;

export default function SecurityPanel() {
  const [summary, setSummary] = useState<SecuritySummary | null>(null);
  const [windowHours, setWindowHours] = useState<number>(24);

  async function refresh() {
    const res = await fetch(`/api/builder/ops/security?windowHours=${windowHours}`, {
      credentials: 'same-origin',
    });
    if (res.ok) {
      const payload = await res.json() as { summary: SecuritySummary };
      setSummary(payload.summary);
    }
  }

  useEffect(() => { void refresh(); }, [windowHours]);

  return (
    <div data-ops-security-panel="true" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: 12, color: '#64748b', display: 'flex', gap: 6, alignItems: 'center' }}>
          window
          <select
            value={windowHours}
            onChange={(e) => setWindowHours(Number.parseInt(e.target.value, 10))}
            style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }}
          >
            {WINDOW_OPTIONS.map((h) => (
              <option key={h} value={h}>{h}h</option>
            ))}
          </select>
        </label>
        <button type="button" onClick={refresh}
          style={{ padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
          새로고침
        </button>
        {summary ? (
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}>
            총 이벤트 {summary.totalEvents} · 거부 {summary.deniedRequests}
          </span>
        ) : null}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, minWidth: 0 }}>
        <Section title="이벤트 유형 Top 10" rows={summary?.byType ?? []} />
        <Section title="actor / IP Top 10" rows={summary?.topActors ?? []} />
      </div>
    </div>
  );
}

function Section({ title, rows }: { title: string; rows: { key: string; count: number }[] }) {
  return (
    <div style={{ minWidth: 0 }}>
      <h3 style={{ fontSize: 13, margin: '0 0 6px', color: '#475569' }}>{title}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '6px 10px' }}>key</th>
            <th style={{ padding: '6px 10px', width: 80 }}>count</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={2} style={{ padding: 16, textAlign: 'center', color: '#94a3b8' }}>이벤트 없음</td></tr>
          ) : rows.map((row) => (
            <tr key={row.key} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '6px 10px', fontFamily: 'ui-monospace, Menlo, monospace' }}>{row.key}</td>
              <td style={{ padding: '6px 10px' }}>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}