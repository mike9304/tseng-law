'use client';

import { useState } from 'react';
import type { SearchIndex } from '@/lib/builder/search/types';
import { formatDateTime } from '@/lib/builder/format/datetime';

interface QueryStat {
  query: string;
  count: number;
  avgHits: number;
  zeroResults: boolean;
  locales: string[];
  lastAt: string;
}

interface Props {
  locale: 'ko' | 'zh-hant' | 'en';
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

export default function SearchAdminPanel({ locale, initialIndexSummary, initialQueryStats }: Props) {
  const [summary, setSummary] = useState(initialIndexSummary);
  const [stats] = useState(initialQueryStats);
  const [rebuilding, setRebuilding] = useState(false);
  const [message, setMessage] = useState('');
  const copy = getSearchAdminCopy(locale);

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
        setMessage(copy.rebuildFailedLabel(payload.error ?? res.statusText));
        return;
      }
      const payload = (await res.json()) as { builtAt: string; totalDocs: number; byLocale: Record<string, number> };
      setSummary({ builtAt: payload.builtAt, totals: payload.byLocale });
      setMessage(copy.rebuildCompleteLabel(payload.totalDocs));
    } finally {
      setRebuilding(false);
    }
  }

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>{copy.indexStatusTitle}</h2>
        <div style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}>
          <div style={{ fontSize: 13 }}>
            {copy.lastBuiltLabel}:{' '}
            <strong>{summary.builtAt ? formatDateTime(summary.builtAt, locale) : copy.noneLabel}</strong>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>
            {Object.entries(summary.totals).map(([loc, n]) => (
              <div key={loc}>· {loc}: {copy.docsCountLabel(n)}</div>
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
          {rebuilding ? copy.rebuildingLabel : copy.rebuildIndexLabel}
        </button>
        {message ? <div style={{ fontSize: 12, color: copy.isErrorMessage(message) ? '#dc2626' : '#16a34a' }}>{message}</div> : null}
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>{copy.searchStatsTitle}</h2>
        <div style={{ fontSize: 13, color: '#475569' }}>
          {copy.totalQueriesLabel}: <strong>{stats.totalQueries}</strong> · {copy.uniqueQueriesLabel}: <strong>{stats.uniqueQueries}</strong>
        </div>

        <h3 style={{ margin: '12px 0 4px', fontSize: 13, color: '#475569' }}>{copy.topQueriesTitle}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '6px 10px' }}>{copy.queryColumnLabel}</th>
              <th style={{ padding: '6px 10px' }}>{copy.countColumnLabel}</th>
              <th style={{ padding: '6px 10px' }}>{copy.avgHitsColumnLabel}</th>
            </tr>
          </thead>
          <tbody>
            {stats.top.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: 12, color: '#94a3b8', textAlign: 'center' }}>
                  {copy.noQueriesLabel}
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
            <h3 style={{ margin: '12px 0 4px', fontSize: 13, color: '#dc2626' }}>{copy.zeroResultTitle}</h3>
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

function getSearchAdminCopy(locale: 'ko' | 'zh-hant' | 'en') {
  return {
    indexStatusTitle: locale === 'ko' ? '인덱스 상태' : locale === 'zh-hant' ? '索引狀態' : 'Index status',
    lastBuiltLabel: locale === 'ko' ? '마지막 빌드' : locale === 'zh-hant' ? '最後建置' : 'Last built',
    noneLabel: locale === 'ko' ? '없음' : locale === 'zh-hant' ? '無' : 'None',
    docsCountLabel: (n: number) => (locale === 'ko' ? `${n}건` : locale === 'zh-hant' ? `${n} 筆` : `${n}`),
    rebuildingLabel: locale === 'ko' ? '재빌드 중...' : locale === 'zh-hant' ? '重新建置中...' : 'Rebuilding...',
    rebuildIndexLabel: locale === 'ko' ? '인덱스 재빌드' : locale === 'zh-hant' ? '重新建置索引' : 'Rebuild index',
    rebuildFailedLabel:
      locale === 'ko'
        ? (error: string) => `재빌드 실패: ${error}`
        : locale === 'zh-hant'
          ? (error: string) => `重新建置失敗：${error}`
          : (error: string) => `Rebuild failed: ${error}`,
    rebuildCompleteLabel:
      locale === 'ko'
        ? (count: number) => `재빌드 완료 — 총 ${count}건`
        : locale === 'zh-hant'
          ? (count: number) => `重新建置完成 — 共 ${count} 筆`
          : (count: number) => `Rebuild complete — ${count} docs`,
    searchStatsTitle: locale === 'ko' ? '검색 통계' : locale === 'zh-hant' ? '搜尋統計' : 'Search stats',
    totalQueriesLabel: locale === 'ko' ? '누적' : locale === 'zh-hant' ? '累計' : 'Total queries',
    uniqueQueriesLabel: locale === 'ko' ? '고유' : locale === 'zh-hant' ? '不重複' : 'Unique queries',
    topQueriesTitle: locale === 'ko' ? '인기 쿼리' : locale === 'zh-hant' ? '熱門查詢' : 'Top queries',
    queryColumnLabel: locale === 'ko' ? '쿼리' : locale === 'zh-hant' ? '查詢' : 'Query',
    countColumnLabel: locale === 'ko' ? '횟수' : locale === 'zh-hant' ? '次數' : 'Count',
    avgHitsColumnLabel: locale === 'ko' ? '평균 결과수' : locale === 'zh-hant' ? '平均結果數' : 'Avg hits',
    noQueriesLabel: locale === 'ko' ? '기록된 쿼리가 없습니다.' : locale === 'zh-hant' ? '沒有記錄的查詢。' : 'No queries recorded.',
    zeroResultTitle: locale === 'ko' ? '결과 0건 쿼리' : locale === 'zh-hant' ? '零結果查詢' : 'Zero-result queries',
    isErrorMessage: (message: string) => /실패|失敗|failed|error|錯誤/i.test(message),
  } as const;
}
