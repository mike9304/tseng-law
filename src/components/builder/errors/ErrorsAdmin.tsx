'use client';

import { useState } from 'react';
import type { CapturedError } from '@/lib/builder/errors/types';

interface Props {
  locale: 'ko' | 'zh-hant' | 'en';
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

export default function ErrorsAdmin({ locale, initialEntries, totalCount, severityCount, sentryConfigured }: Props) {
  const [entries, setEntries] = useState(initialEntries);
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [originFilter, setOriginFilter] = useState<string>('');
  const copy = getErrorsAdminCopy(locale);

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
        <strong>{copy.totalLabel}: {totalCount}</strong>
        {Object.entries(severityCount).map(([sev, count]) => (
          <span key={sev} style={{ color: SEVERITY_COLOR[sev] ?? '#475569' }}>
            {sev}: {count}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: sentryConfigured ? '#16a34a' : '#94a3b8' }}>
          Sentry: {sentryConfigured ? copy.connectedLabel : copy.unconfiguredLabel}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}>
          <option value="">{copy.allSeverityLabel}</option>
          <option value="info">info</option>
          <option value="warning">warning</option>
          <option value="error">error</option>
          <option value="fatal">fatal</option>
        </select>
        <select value={originFilter} onChange={(e) => setOriginFilter(e.target.value)} style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}>
          <option value="">{copy.allOriginLabel}</option>
          <option value="builder">builder</option>
          <option value="site">site</option>
          <option value="api">api</option>
          <option value="client">client</option>
        </select>
        <button type="button" onClick={refresh} style={{ marginLeft: 'auto', padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
          {copy.refreshLabel}
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '6px 10px' }}>{copy.timeColumnLabel}</th>
            <th style={{ padding: '6px 10px' }}>{copy.originColumnLabel}</th>
            <th style={{ padding: '6px 10px' }}>{copy.severityColumnLabel}</th>
            <th style={{ padding: '6px 10px' }}>{copy.messageColumnLabel}</th>
            <th style={{ padding: '6px 10px' }}>{copy.tagsColumnLabel}</th>
            <th style={{ padding: '6px 10px' }}>{copy.sentryColumnLabel}</th>
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                {copy.emptyLabel}
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
                  {entry.forwardedToSentry ? copy.yesLabel : copy.noLabel}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function getErrorsAdminCopy(locale: 'ko' | 'zh-hant' | 'en') {
  return {
    totalLabel: locale === 'ko' ? '누적' : locale === 'zh-hant' ? '累計' : 'Total',
    connectedLabel: locale === 'ko' ? '연결됨' : locale === 'zh-hant' ? '已連接' : 'Connected',
    unconfiguredLabel: locale === 'ko' ? '미설정' : locale === 'zh-hant' ? '未設定' : 'Not configured',
    allSeverityLabel: locale === 'ko' ? '모든 심각도' : locale === 'zh-hant' ? '所有嚴重程度' : 'All severities',
    allOriginLabel: locale === 'ko' ? '모든 출처' : locale === 'zh-hant' ? '所有來源' : 'All origins',
    refreshLabel: locale === 'ko' ? '새로고침' : locale === 'zh-hant' ? '重新整理' : 'Refresh',
    timeColumnLabel: locale === 'ko' ? '시각' : locale === 'zh-hant' ? '時間' : 'Time',
    originColumnLabel: locale === 'ko' ? '출처' : locale === 'zh-hant' ? '來源' : 'Origin',
    severityColumnLabel: locale === 'ko' ? '심각도' : locale === 'zh-hant' ? '嚴重程度' : 'Severity',
    messageColumnLabel: locale === 'ko' ? '메시지' : locale === 'zh-hant' ? '訊息' : 'Message',
    tagsColumnLabel: locale === 'ko' ? '태그' : locale === 'zh-hant' ? '標籤' : 'Tags',
    sentryColumnLabel: locale === 'ko' ? 'Sentry' : locale === 'zh-hant' ? 'Sentry' : 'Sentry',
    emptyLabel: locale === 'ko' ? '기록된 에러가 없습니다.' : locale === 'zh-hant' ? '沒有記錄的錯誤。' : 'No errors recorded.',
    yesLabel: locale === 'ko' ? '예' : locale === 'zh-hant' ? '是' : 'Yes',
    noLabel: locale === 'ko' ? '아니요' : locale === 'zh-hant' ? '否' : 'No',
  } as const;
}
