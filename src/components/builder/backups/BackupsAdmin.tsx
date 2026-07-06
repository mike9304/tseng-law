'use client';

import { useState } from 'react';
import type { BackupSummary } from '@/lib/builder/backups/types';
import type { Locale } from '@/lib/locales';

interface Props {
  locale: Locale;
  initialBackups: BackupSummary[];
}

type BackupsCopy = {
  runBackup: string;
  runningBackup: string;
  refresh: string;
  backupFailed: string;
  backupComplete: string;
  restoreConfirm: (backupId: string) => string;
  restoreFailed: string;
  restoreComplete: string;
  restoring: string;
  restore: string;
  backupId: string;
  created: string;
  trigger: string;
  entries: string;
  size: string;
  actions: string;
  empty: string;
  resultSuccess: string;
  resultFailure: string;
};

const COPY: Record<Locale, BackupsCopy> = {
  ko: {
    runBackup: '지금 백업',
    runningBackup: '백업 중...',
    refresh: '새로고침',
    backupFailed: '백업 실패',
    backupComplete: '백업 완료',
    restoreConfirm: (backupId) => `백업 ${backupId} 으로 복원합니다. 현재 상태가 덮어쓰여집니다. 계속할까요?`,
    restoreFailed: '복원 실패',
    restoreComplete: '복원 완료',
    restoring: '복원 중...',
    restore: '복원',
    backupId: '백업 ID',
    created: '생성',
    trigger: '트리거',
    entries: '엔트리',
    size: '크기',
    actions: '작업',
    empty: '백업이 없습니다.',
    resultSuccess: '성공',
    resultFailure: '실패',
  },
  'zh-hant': {
    runBackup: '立即備份',
    runningBackup: '備份中...',
    refresh: '重新整理',
    backupFailed: '備份失敗',
    backupComplete: '備份完成',
    restoreConfirm: (backupId) => `將備份 ${backupId} 還原，現有狀態會被覆寫。要繼續嗎？`,
    restoreFailed: '還原失敗',
    restoreComplete: '還原完成',
    restoring: '還原中...',
    restore: '還原',
    backupId: '備份 ID',
    created: '建立時間',
    trigger: '觸發來源',
    entries: '項目',
    size: '大小',
    actions: '操作',
    empty: '沒有備份。',
    resultSuccess: '成功',
    resultFailure: '失敗',
  },
  en: {
    runBackup: 'Run backup',
    runningBackup: 'Running...',
    refresh: 'Refresh',
    backupFailed: 'Backup failed',
    backupComplete: 'Backup complete',
    restoreConfirm: (backupId) => `Restore backup ${backupId}. Current state will be overwritten. Continue?`,
    restoreFailed: 'Restore failed',
    restoreComplete: 'Restore complete',
    restoring: 'Restoring...',
    restore: 'Restore',
    backupId: 'Backup ID',
    created: 'Created',
    trigger: 'Trigger',
    entries: 'Entries',
    size: 'Size',
    actions: 'Actions',
    empty: 'No backups yet.',
    resultSuccess: 'success',
    resultFailure: 'failure',
  },
};

function fmtBytes(n?: number): string {
  if (n == null) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export default function BackupsAdmin({ locale, initialBackups }: Props) {
  const [backups, setBackups] = useState(initialBackups);
  const [running, setRunning] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const text = COPY[locale];

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
        setMessage(`${text.backupFailed}: ${payload.error ?? res.statusText}`);
      } else {
        setMessage(`${text.backupComplete} — ${payload.summary?.entryCount ?? 0}건`);
        await refresh();
      }
    } finally {
      setRunning(false);
    }
  }

  async function restore(backupId: string) {
    if (!window.confirm(text.restoreConfirm(backupId))) return;
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
        setMessage(`${text.restoreFailed}: ${payload.error ?? res.statusText}`);
      } else {
        setMessage(
          `${text.restoreComplete} — ${text.resultSuccess} ${payload.restored ?? 0} / ${text.resultFailure} ${payload.failed ?? 0}`,
        );
      }
    } finally {
      setRestoringId(null);
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button type="button" disabled={running} onClick={runBackup} style={{ padding: '8px 14px', border: 0, background: running ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, cursor: running ? 'not-allowed' : 'pointer' }}>
          {running ? text.runningBackup : text.runBackup}
        </button>
        <button type="button" onClick={refresh} style={{ padding: '8px 14px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
          {text.refresh}
        </button>
        {message ? <span style={{ marginLeft: 'auto', fontSize: 12, color: message.includes('실패') ? '#dc2626' : '#16a34a' }}>{message}</span> : null}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>{text.backupId}</th>
            <th style={{ padding: '8px 12px' }}>{text.created}</th>
            <th style={{ padding: '8px 12px' }}>{text.trigger}</th>
            <th style={{ padding: '8px 12px' }}>{text.entries}</th>
            <th style={{ padding: '8px 12px' }}>{text.size}</th>
            <th style={{ padding: '8px 12px' }}>{text.actions}</th>
          </tr>
        </thead>
        <tbody>
          {backups.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                {text.empty}
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
                    {restoringId === b.backupId ? text.restoring : text.restore}
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
