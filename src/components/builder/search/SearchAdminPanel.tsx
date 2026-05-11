'use client';

import { useState } from 'react';
import type { SearchIndex } from '@/lib/builder/search/types';

interface QueryStat {
  query: string;
  count: number;
  avgHits: number;
  zeroResults: boolean;
  locales: string[];
  lastAt: string;
}

interface Props {
  initialIndexSummary: {
    builtAt: string | null;
    totals: Record<string, number>;
  };
  initialQueryStats: {
    totalQueries: number;
    uniqueQueries: number;
    top: QueryStat[];
    zeroResultQueries: QueryStat[];
  };
}

export default function SearchAdminPanel({ initialIndexSummary, initialQueryStats }: Props) {
  const [summary, setSummary] = useState(initialIndexSummary);
  const [stats] = useState(initialQueryStats);
  const [rebuilding, setRebuilding] = useState(false);
  const [message, setMessage] = useState('');

  async function rebuild() {
    setRebuilding(true);
    setMessage('');
    try {
      const res = await fetch('/api/builder/search/rebuild', {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage(`재빌드 실패: ${payload.error ?? res.statusText}`);
        return;
      }
      const payload = (await res.json()) as { builtAt: string; totalDocs: number; byLocale: Record<string, number> };
      setSummary({ builtAt: payload.builtAt, totals: payload.byLocale });
      setMessage(`재빌드 완료 — 총 ${payload.totalDocs}건`);
    } finally {
      setRebuilding(false);
    }
  }

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>인덱스 상태</h2>
        <div style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}>
          <div style={{ fontSize: 13 }}>
            마지막 빌드:{' '}
            <strong>{summary.builtAt ? new Date(summary.builtAt).toLocaleString('ko-KR') : '없음'}</strong>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>
            {Object.entries(summary.totals).map(([loc, n]) => (
              <div key={loc}>· {loc}: {n}건</div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={rebuild}
          disabled={rebuilding}
          style={{
            padding: '10px 16px',
            border: 0,
            background: rebuilding ? '#94a3b8' : '#0f172a',
            color: '#fff',
            borderRadius: 8,
            cursor: rebuilding ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: 13,
            width: 'fit-content',
          }}
        >
          {rebuilding ? '재빌드 중...' : '인덱스 재빌드'}
        </button>
        {message ? <div style={{ fontSize: 12, color: message.includes('실패') ? '#dc2626' : '#16a34a' }}>{message}</div> : null}
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>검색 통계</h2>
        <div style={{ fontSize: 13, color: '#475569' }}>
          누적: <strong>{stats.totalQueries}</strong> · 고유: <strong>{stats.uniqueQueries}</strong>
        </div>

        <h3 style={{ margin: '12px 0 4px', fontSize: 13, color: '#475569' }}>인기 쿼리</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '6px 10px' }}>쿼리</th>
              <th style={{ padding: '6px 10px' }}>횟수</th>
              <th style={{ padding: '6px 10px' }}>평균 결과수</th>
            </tr>
          </thead>
          <tbody>
            {stats.top.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: 12, color: '#94a3b8', textAlign: 'center' }}>
                  기록된 쿼리가 없습니다.
                </td>
              </tr>
            ) : (
              stats.top.slice(0, 20).map((q) => (
                <tr key={q.query} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px 10px', fontFamily: 'ui-monospace, Menlo, monospace' }}>{q.query}</td>
                  <td style={{ padding: '6px 10px' }}>{q.count}</td>
                  <td style={{ padding: '6px 10px', color: q.zeroResults ? '#dc2626' : '#0f172a' }}>
                    {q.avgHits}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {stats.zeroResultQueries.length > 0 ? (
          <>
            <h3 style={{ margin: '12px 0 4px', fontSize: 13, color: '#dc2626' }}>결과 0건 쿼리</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {stats.zeroResultQueries.slice(0, 30).map((q) => (
                <li
                  key={q.query}
                  style={{
                    padding: '4px 10px',
                    border: '1px solid #fecaca',
                    background: '#fef2f2',
                    color: '#7f1d1d',
                    borderRadius: 999,
                    fontSize: 12,
                  }}
                >
                  {q.query} ({q.count})
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>
    </div>
  );
}

export type IndexSummary = Pick<SearchIndex, never>;
