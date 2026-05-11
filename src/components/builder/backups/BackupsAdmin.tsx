'use client';

import { useState } from 'react';
import type { BackupSummary } from '@/lib/builder/backups/types';

interface Props {
  initialBackups: BackupSummary[];
}

function fmtBytes(n?: number): string {
  if (n == null) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export default function BackupsAdmin({ initialBackups }: Props) {
  const [backups, setBackups] = useState(initialBackups);
  const [running, setRunning] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function refresh() {
    const res = await fetch('/api/builder/backups', { credentials: 'same-origin' });
    if (!res.ok) return;
    const payload = (await res.json()) as { backups: BackupSummary[] };
    setBackups(payload.backups);
  }

  async function runBackup() {
    setRunning(true);
    setMessage('');
    try {
      const res = await fetch('/api/builder/backups', { method: 'POST', credentials: 'same-origin' });
      const payload = (await res.json().catch(() => ({}))) as { summary?: BackupSummary; error?: string };
      if (!res.ok) {
        setMessage(`백업 실패: ${payload.error ?? res.statusText}`);
      } else {
        setMessage(`백업 완료 — ${payload.summary?.entryCount ?? 0}건`);
        await refresh();
      }
    } finally {
      setRunning(false);
    }
  }

  async function restore(backupId: string) {
    if (!window.confirm(`백업 ${backupId} 으로 복원합니다. 현재 상태가 덮어쓰여집니다. 계속할까요?`)) return;
    setRestoringId(backupId);
    setMessage('');
    try {
      const res = await fetch(`/api/builder/backups/${backupId}/restore`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'RESTORE' }),
      });
      const payload = (await res.json().catch(() => ({}))) as { restored?: number; failed?: number; error?: string };
      if (!res.ok) {
        setMessage(`복원 실패: ${payload.error ?? res.statusText}`);
      } else {
        setMessage(`복원 완료 — 성공 ${payload.restored ?? 0} / 실패 ${payload.failed ?? 0}`);
      }
    } finally {
      setRestoringId(null);
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button type="button" disabled={running} onClick={runBackup} style={{ padding: '8px 14px', border: 0, background: running ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, cursor: running ? 'not-allowed' : 'pointer' }}>
          {running ? '백업 중...' : '지금 백업'}
        </button>
        <button type="button" onClick={refresh} style={{ padding: '8px 14px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
          새로고침
        </button>
        {message ? <span style={{ marginLeft: 'auto', fontSize: 12, color: message.includes('실패') ? '#dc2626' : '#16a34a' }}>{message}</span> : null}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>backup ID</th>
            <th style={{ padding: '8px 12px' }}>생성</th>
            <th style={{ padding: '8px 12px' }}>트리거</th>
            <th style={{ padding: '8px 12px' }}>엔트리</th>
            <th style={{ padding: '8px 12px' }}>크기</th>
            <th style={{ padding: '8px 12px' }}>작업</th>
          </tr>
        </thead>
        <tbody>
          {backups.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                백업이 없습니다.
              </td>
            </tr>
          ) : (
            backups.map((b) => (
              <tr key={b.backupId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px 12px', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11 }}>{b.backupId}</td>
                <td style={{ padding: '8px 12px', color: '#64748b' }}>{new Date(b.createdAt).toLocaleString('ko-KR')}</td>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{ padding: '2px 6px', borderRadius: 999, background: b.triggeredBy === 'cron' ? '#dbeafe' : '#f1f5f9', color: b.triggeredBy === 'cron' ? '#1e40af' : '#475569', fontSize: 11, fontWeight: 700 }}>
                    {b.triggeredBy}
                  </span>
                </td>
                <td style={{ padding: '8px 12px' }}>{b.entryCount}</td>
                <td style={{ padding: '8px 12px' }}>{fmtBytes(b.sizeBytes)}</td>
                <td style={{ padding: '8px 12px' }}>
                  <button
                    type="button"
                    disabled={restoringId === b.backupId}
                    onClick={() => restore(b.backupId)}
                    style={{ padding: '4px 8px', border: '1px solid #fecaca', background: restoringId === b.backupId ? '#fef2f2' : '#fff', color: '#b91c1c', borderRadius: 4, fontSize: 11, cursor: restoringId === b.backupId ? 'not-allowed' : 'pointer' }}
                  >
                    {restoringId === b.backupId ? '복원 중...' : '복원'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
