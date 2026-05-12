'use client';

import { useState } from 'react';
import type { CalendarConnection, CalendarProvider } from '@/lib/builder/bookings/calendar-sync/types';

interface Props {
  initialConnections: CalendarConnection[];
  staff: Array<{ staffId: string; name: string }>;
  googleConfigured: boolean;
  outlookConfigured: boolean;
}

export default function CalendarSyncAdmin({ initialConnections, staff, googleConfigured, outlookConfigured }: Props) {
  const [connections] = useState(initialConnections);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function startConnect(staffId: string, provider: CalendarProvider) {
    setMessage('');
    const res = await fetch(`/api/builder/bookings/calendar-sync/connect/${provider}?staffId=${encodeURIComponent(staffId)}`, {
      credentials: 'same-origin',
    });
    const payload = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!res.ok || !payload.url) {
      setMessage(payload.error ?? '연결 URL 생성 실패');
      return;
    }
    window.location.href = payload.url;
  }

  async function syncNow(connectionId: string) {
    setBusyId(connectionId);
    setMessage('');
    try {
      const res = await fetch(`/api/builder/bookings/calendar-sync/sync-now?connectionId=${encodeURIComponent(connectionId)}`, {
        method: 'POST',
        credentials: 'same-origin',
      });
      const payload = (await res.json().catch(() => ({}))) as {
        result?: { pushed: number; pulled: number; errors: Array<{ message: string }> };
        error?: string;
      };
      if (!res.ok || !payload.result) {
        setMessage(payload.error ?? '동기화 실패');
        return;
      }
      const pushed = payload.result?.pushed ?? 0;
      const pulled = payload.result?.pulled ?? 0;
      const errs = payload.result?.errors ?? [];
      setMessage(
        errs.length === 0
          ? `푸시 ${pushed}건, 가져오기 ${pulled}건`
          : `푸시 ${pushed}건, 가져오기 ${pulled}건, 오류 ${errs.length}건: ${errs[0].message ?? payload.error ?? '동기화 실패'}`,
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 13, color: '#475569' }}>
        Google: {googleConfigured ? <strong style={{ color: '#16a34a' }}>설정됨</strong> : <span style={{ color: '#dc2626' }}>미설정 (GOOGLE_OAUTH_*)</span>} ·
        Outlook: {outlookConfigured ? <strong style={{ color: '#16a34a' }}> 설정됨</strong> : <span style={{ color: '#dc2626' }}> 미설정 (MS_OAUTH_*)</span>}
      </div>

      <h3 style={{ margin: '12px 0 4px', fontSize: 14 }}>스태프별 연결</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>스태프</th>
            <th style={{ padding: '8px 12px' }}>Google</th>
            <th style={{ padding: '8px 12px' }}>Outlook</th>
          </tr>
        </thead>
        <tbody>
          {staff.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                스태프가 없습니다.
              </td>
            </tr>
          ) : staff.map((s) => {
            const google = connections.find((c) => c.staffId === s.staffId && c.provider === 'google');
            const outlook = connections.find((c) => c.staffId === s.staffId && c.provider === 'outlook');
            return (
              <tr key={s.staffId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 12px' }}>{s.name}</td>
                {([['google', google, googleConfigured], ['outlook', outlook, outlookConfigured]] as Array<[CalendarProvider, CalendarConnection | undefined, boolean]>).map(([provider, conn, configured]) => (
                  <td key={provider} style={{ padding: '8px 12px' }}>
                    {conn ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ padding: '2px 8px', borderRadius: 999, background: conn.status === 'connected' ? '#dcfce7' : '#fee2e2', color: conn.status === 'connected' ? '#15803d' : '#b91c1c', fontSize: 11, fontWeight: 700 }}>
                          {conn.status}
                        </span>
                        <button type="button" disabled={busyId === conn.connectionId} onClick={() => syncNow(conn.connectionId)} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, fontSize: 11, cursor: busyId === conn.connectionId ? 'not-allowed' : 'pointer' }}>
                          {busyId === conn.connectionId ? '동기화 중...' : '지금 동기화'}
                        </button>
                        {conn.lastSyncedAt ? <span style={{ fontSize: 10, color: '#64748b' }}>{new Date(conn.lastSyncedAt).toLocaleString('ko-KR')}</span> : null}
                      </div>
                    ) : (
                      <button type="button" disabled={!configured} onClick={() => startConnect(s.staffId, provider)} style={{ padding: '4px 10px', border: '1px solid #cbd5e1', background: configured ? '#fff' : '#f1f5f9', borderRadius: 4, fontSize: 11, color: configured ? '#0f172a' : '#94a3b8', cursor: configured ? 'pointer' : 'not-allowed' }}>
                        연결
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {message ? <div style={{ fontSize: 12, color: message.includes('오류') || message.includes('실패') ? '#dc2626' : '#16a34a' }}>{message}</div> : null}

      <div style={{ fontSize: 11, color: '#64748b', marginTop: 12 }}>
        ※ Hojeong 예약은 외부 캘린더로 push하고, 외부에서 만든 일정은 스태프 busy block으로 가져와 공개 예약 슬롯에서 제외합니다.
      </div>
    </div>
  );
}
