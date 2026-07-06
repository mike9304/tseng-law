'use client';

import { useState } from 'react';
import type { CalendarConnection, CalendarProvider } from '@/lib/builder/bookings/calendar-sync/types';
import type { Locale } from '@/lib/locales';
import { formatDateTime } from '@/lib/builder/format/datetime';

interface Props {
  locale: Locale;
  initialConnections: CalendarConnection[];
  staff: Array<{ staffId: string; name: string }>;
  googleConfigured: boolean;
  outlookConfigured: boolean;
}

type ReconciliationStatus = NonNullable<NonNullable<CalendarConnection['lastSyncResult']>['reconciliationFeed']>[number]['status'];

const copy = {
  ko: {
    summaryHeader: '스태프별 연결',
    staffHeader: '스태프',
    googleLabel: 'Google',
    outlookLabel: 'Outlook',
    configured: '설정됨',
    unconfiguredGoogle: '미설정 (GOOGLE_OAUTH_*)',
    unconfiguredOutlook: '미설정 (MS_OAUTH_*)',
    noStaff: '스태프가 없습니다.',
    connectLabel: '연결',
    syncing: '동기화 중...',
    syncNow: '지금 동기화',
    connected: '연결됨',
    disconnected: '연결 끊김',
    noSync: '최근 동기화 기록 없음',
    syncSummary: (pushed: number, pulled: number, bookingUpdates: number, blockedUpdates: number, errorCount: number) =>
      errorCount === 0
        ? `최근 동기화: 푸시 ${pushed} · 가져오기 ${pulled} · 예약 반영 ${bookingUpdates} · 블록 반영 ${blockedUpdates} · 오류 없음`
        : `최근 동기화: 푸시 ${pushed} · 가져오기 ${pulled} · 예약 반영 ${bookingUpdates} · 블록 반영 ${blockedUpdates} · 오류 ${errorCount}건`,
    recentError: '최근 오류',
    connectFailed: '연결 URL 생성 실패',
    syncFailed: '동기화 실패',
    oauthScope: 'OAuth 범위',
    oauthOk: 'OAuth 범위 OK',
    oauthMismatch: (expected: string) => `OAuth 범위 불일치 · 예상 ${expected}`,
    account: '계정',
    bookingUpdates: '예약 반영',
    blockedUpdates: '블록 반영',
    countUnit: '건',
    connectionIdLabel: '연결 ID',
    mappingLabel: '매핑',
    noReconciliation: '최근 provider reconciliation detail 없음',
    feedBooking: 'booking',
    feedBlock: 'block',
    notePrefix: '메모',
    footer:
      '※ Hojeong 예약은 외부 캘린더로 push하고, 외부에서 만든 일정은 스태프 busy block으로 가져와 공개 예약 슬롯에서 제외합니다.',
    statuses: {
      connected: '연결됨',
      error: '오류',
    } as const,
    reconciliation: {
      updated: '업데이트',
      created: '생성',
      cancelled: '취소',
      removed: '제거',
      ignored: '무시',
      'ignored-invalid-range': '유효하지 않음',
      'ignored-own-event': '내부 이벤트',
      'ignored-unmatched': '매칭 없음',
      error: '오류',
    } as const,
  },
  'zh-hant': {
    summaryHeader: '按員工的連線',
    staffHeader: '員工',
    googleLabel: 'Google',
    outlookLabel: 'Outlook',
    configured: '已設定',
    unconfiguredGoogle: '未設定（GOOGLE_OAUTH_*）',
    unconfiguredOutlook: '未設定（MS_OAUTH_*）',
    noStaff: '沒有員工。',
    connectLabel: '連線',
    syncing: '同步中...',
    syncNow: '立即同步',
    connected: '已連線',
    disconnected: '已斷線',
    noSync: '沒有最近同步記錄',
    syncSummary: (pushed: number, pulled: number, bookingUpdates: number, blockedUpdates: number, errorCount: number) =>
      errorCount === 0
        ? `最近同步：推送 ${pushed} · 拉取 ${pulled} · 預約反映 ${bookingUpdates} · 區塊反映 ${blockedUpdates} · 無錯誤`
        : `最近同步：推送 ${pushed} · 拉取 ${pulled} · 預約反映 ${bookingUpdates} · 區塊反映 ${blockedUpdates} · 錯誤 ${errorCount} 筆`,
    recentError: '最近錯誤',
    connectFailed: '建立連線網址失敗',
    syncFailed: '同步失敗',
    oauthScope: 'OAuth 範圍',
    oauthOk: 'OAuth 範圍正常',
    oauthMismatch: (expected: string) => `OAuth 範圍不符 · 預期 ${expected}`,
    account: '帳戶',
    bookingUpdates: '預約反映',
    blockedUpdates: '區塊反映',
    countUnit: '件',
    connectionIdLabel: '連線 ID',
    mappingLabel: '映射',
    noReconciliation: '最近沒有 provider reconciliation detail',
    feedBooking: 'booking',
    feedBlock: 'block',
    notePrefix: '備註',
    footer:
      '※ Hojeong 預約會推送到外部行事曆，而外部建立的行程會匯入為員工忙碌區塊，並從公開預約時段中排除。',
    statuses: {
      connected: '已連線',
      error: '錯誤',
    } as const,
    reconciliation: {
      updated: '更新',
      created: '建立',
      cancelled: '取消',
      removed: '移除',
      ignored: '忽略',
      'ignored-invalid-range': '無效',
      'ignored-own-event': '內部事件',
      'ignored-unmatched': '未配對',
      error: '錯誤',
    } as const,
  },
  en: {
    summaryHeader: 'Connections by staff',
    staffHeader: 'Staff',
    googleLabel: 'Google',
    outlookLabel: 'Outlook',
    configured: 'Configured',
    unconfiguredGoogle: 'Not configured (GOOGLE_OAUTH_*)',
    unconfiguredOutlook: 'Not configured (MS_OAUTH_*)',
    noStaff: 'No staff.',
    connectLabel: 'Connect',
    syncing: 'Syncing...',
    syncNow: 'Sync now',
    connected: 'Connected',
    disconnected: 'Disconnected',
    noSync: 'No recent sync record',
    syncSummary: (pushed: number, pulled: number, bookingUpdates: number, blockedUpdates: number, errorCount: number) =>
      errorCount === 0
        ? `Recent sync: push ${pushed} · pull ${pulled} · booking updates ${bookingUpdates} · block updates ${blockedUpdates} · no errors`
        : `Recent sync: push ${pushed} · pull ${pulled} · booking updates ${bookingUpdates} · block updates ${blockedUpdates} · ${errorCount} errors`,
    recentError: 'Recent error',
    connectFailed: 'Failed to create connect URL',
    syncFailed: 'Sync failed',
    oauthScope: 'OAuth scope',
    oauthOk: 'OAuth scope OK',
    oauthMismatch: (expected: string) => `OAuth scope mismatch · expected ${expected}`,
    account: 'Account',
    bookingUpdates: 'Booking updates',
    blockedUpdates: 'Block updates',
    countUnit: '',
    connectionIdLabel: 'Connection ID',
    mappingLabel: 'Mapping',
    noReconciliation: 'No recent provider reconciliation detail',
    feedBooking: 'booking',
    feedBlock: 'block',
    notePrefix: 'Note',
    footer:
      'Hojeong bookings are pushed to external calendars, and externally created events are imported as staff busy blocks and excluded from public booking slots.',
    statuses: {
      connected: 'Connected',
      error: 'Error',
    } as const,
    reconciliation: {
      updated: 'Updated',
      created: 'Created',
      cancelled: 'Cancelled',
      removed: 'Removed',
      ignored: 'Ignored',
      'ignored-invalid-range': 'Ignored invalid range',
      'ignored-own-event': 'Ignored own event',
      'ignored-unmatched': 'Ignored unmatched event',
      error: 'Error',
    } as const,
  },
} as const;

export default function CalendarSyncAdmin({ locale, initialConnections, staff, googleConfigured, outlookConfigured }: Props) {
  const [connections] = useState(initialConnections);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const c = copy[locale];

  function expectedScope(provider: CalendarProvider): string {
    return provider === 'google'
      ? 'https://www.googleapis.com/auth/calendar.events'
      : 'offline_access Calendars.ReadWrite';
  }

  function syncSummary(connection: CalendarConnection): string {
    const result = connection.lastSyncResult;
    if (!result) return c.noSync;
    const errorCount = result.errors?.length ?? 0;
    const bookingUpdates = result.bookingUpdates ?? 0;
    const blockedUpdates = result.blockedUpdates ?? 0;
    return c.syncSummary(result.pushed, result.pulled, bookingUpdates, blockedUpdates, errorCount);
  }

  function reconciliationLabel(status: ReconciliationStatus): string {
    return c.reconciliation[status] ?? c.reconciliation.error;
  }

  async function startConnect(staffId: string, provider: CalendarProvider) {
    setMessage('');
    const params = new URLSearchParams({ staffId, locale });
    const res = await fetch(`/api/builder/bookings/calendar-sync/connect/${provider}?${params.toString()}`, {
      credentials: 'same-origin',
    });
    const payload = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!res.ok || !payload.url) {
      setMessage(payload.error ?? c.connectFailed);
      return;
    }
    window.location.href = payload.url;
  }

  async function syncNow(connectionId: string) {
    setBusyId(connectionId);
    setMessage('');
    try {
      const params = new URLSearchParams({ connectionId, locale });
      const res = await fetch(`/api/builder/bookings/calendar-sync/sync-now?${params.toString()}`, {
        method: 'POST',
        credentials: 'same-origin',
      });
      const payload = (await res.json().catch(() => ({}))) as {
        result?: { pushed: number; pulled: number; errors: Array<{ message: string }> };
        error?: string;
      };
      if (!res.ok || !payload.result) {
        setMessage(payload.error ?? c.syncFailed);
        return;
      }
      const pushed = payload.result?.pushed ?? 0;
      const pulled = payload.result?.pulled ?? 0;
      const errs = payload.result?.errors ?? [];
      setMessage(
        errs.length === 0
          ? `${c.syncSummary(pushed, pulled, 0, 0, 0)}`
          : `${c.syncSummary(pushed, pulled, 0, 0, errs.length)}: ${errs[0].message ?? payload.error ?? c.syncFailed}`,
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 13, color: '#475569' }}>
        {c.googleLabel}: {googleConfigured ? <strong style={{ color: '#16a34a' }}>{c.configured}</strong> : <span style={{ color: '#dc2626' }}>{c.unconfiguredGoogle}</span>} ·
        {c.outlookLabel}: {outlookConfigured ? <strong style={{ color: '#16a34a' }}> {c.configured}</strong> : <span style={{ color: '#dc2626' }}> {c.unconfiguredOutlook}</span>}
      </div>

      <h3 style={{ margin: '12px 0 4px', fontSize: 14 }}>{c.summaryHeader}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>{c.staffHeader}</th>
            <th style={{ padding: '8px 12px' }}>{c.googleLabel}</th>
            <th style={{ padding: '8px 12px' }}>{c.outlookLabel}</th>
          </tr>
        </thead>
        <tbody>
          {staff.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                {c.noStaff}
              </td>
            </tr>
          ) : staff.map((s) => {
            const google = connections.find((connection) => connection.staffId === s.staffId && connection.provider === 'google');
            const outlook = connections.find((connection) => connection.staffId === s.staffId && connection.provider === 'outlook');
            return (
              <tr key={s.staffId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 12px' }}>{s.name}</td>
                {([['google', google, googleConfigured], ['outlook', outlook, outlookConfigured]] as Array<[CalendarProvider, CalendarConnection | undefined, boolean]>).map(([provider, conn, configured]) => (
                  <td key={provider} style={{ padding: '8px 12px' }}>
                    {conn ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ padding: '2px 8px', borderRadius: 999, background: conn.status === 'connected' ? '#dcfce7' : '#fee2e2', color: conn.status === 'connected' ? '#15803d' : '#b91c1c', fontSize: 11, fontWeight: 700 }}>
                            {conn.status === 'connected' ? c.connected : c.disconnected}
                          </span>
                          <button type="button" disabled={busyId === conn.connectionId} onClick={() => syncNow(conn.connectionId)} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: busyId === conn.connectionId ? 'not-allowed' : 'pointer' }}>
                            {busyId === conn.connectionId ? c.syncing : c.syncNow}
                          </button>
                          {conn.lastSyncedAt ? <span style={{ fontSize: 10, color: '#64748b' }}>{formatDateTime(conn.lastSyncedAt, locale)}</span> : null}
                        </div>
                        <div data-calendar-sync-summary={conn.connectionId} style={{ fontSize: 11, color: '#334155' }}>
                          {syncSummary(conn)}
                        </div>
                        {conn.lastError ? <div data-calendar-sync-last-error={conn.connectionId} style={{ fontSize: 11, color: '#b91c1c' }}>{c.recentError}: {conn.lastError}</div> : null}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <span data-calendar-sync-connection-id={conn.connectionId} style={{ padding: '2px 8px', borderRadius: 999, background: '#eff6ff', color: '#1d4ed8', fontSize: 11 }}>
                            {c.connectionIdLabel} {conn.connectionId}
                          </span>
                          <span data-calendar-sync-mapping-count={conn.connectionId} style={{ padding: '2px 8px', borderRadius: 999, background: '#eff6ff', color: '#1d4ed8', fontSize: 11 }}>
                            {c.mappingLabel} {conn.eventMappings?.length ?? 0}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: '#334155' }}>
                          <div data-calendar-sync-provider-scope={conn.connectionId}>
                            {c.oauthScope}: {conn.scope}
                          </div>
                          <div
                            data-calendar-sync-provider-scope-status={conn.connectionId}
                            style={{ color: conn.scope === expectedScope(conn.provider) ? '#166534' : '#b45309' }}
                          >
                            {conn.scope === expectedScope(conn.provider) ? c.oauthOk : c.oauthMismatch(expectedScope(conn.provider))}
                          </div>
                          <div data-calendar-sync-provider-account={conn.connectionId}>
                            {c.account} {conn.accountEmail ?? '미확인'}
                          </div>
                          <div data-calendar-sync-provider-reconciliation={conn.connectionId}>
                            {c.bookingUpdates} {conn.lastSyncResult?.bookingUpdates ?? 0}{c.countUnit}, {c.blockedUpdates} {conn.lastSyncResult?.blockedUpdates ?? 0}{c.countUnit}
                          </div>
                        </div>
                        <div data-calendar-sync-reconciliation-feed={conn.connectionId} style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 }}>
                          {(conn.lastSyncResult?.reconciliationFeed ?? []).length === 0 ? (
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.noReconciliation}</div>
                          ) : (
                            conn.lastSyncResult!.reconciliationFeed.map((item) => (
                              <div
                                key={`${item.externalId}-${item.status}-${item.kind}`}
                                data-calendar-sync-reconciliation-item={conn.connectionId}
                                style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11, color: '#334155' }}
                              >
                                <span style={{ padding: '2px 8px', borderRadius: 999, background: '#eef2ff', color: '#4338ca', fontSize: 10, whiteSpace: 'nowrap' }}>
                                  {item.source ? `${item.source} ` : ''}{item.kind === 'booking' ? c.feedBooking : c.feedBlock} · {reconciliationLabel(item.status)}
                                </span>
                                <span>
                                  {item.summary}
                                  {item.note ? ` · ${c.notePrefix}: ${item.note}` : ''}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : (
                      <button type="button" disabled={!configured} onClick={() => startConnect(s.staffId, provider)} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: configured ? '#fff' : '#f1f5f9', borderRadius: 4, fontSize: 11, color: configured ? '#0f172a' : '#94a3b8', cursor: configured ? 'pointer' : 'not-allowed' }}>
                        {c.connectLabel}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {message ? <div style={{ fontSize: 12, color: message.includes('오류') || message.includes('失敗') || message.includes('錯誤') || message.includes('Error') ? '#dc2626' : '#16a34a' }}>{message}</div> : null}

      <div style={{ fontSize: 11, color: '#64748b', marginTop: 12 }}>
        {c.footer}
      </div>
    </div>
  );
}
