'use client';

import { useEffect, useState } from 'react';
import type { BuilderBackupRecord } from '@/lib/builder/ops/backups-model';
import { BackupRestoreDrillCard } from './BackupRestoreDrillCard';
import {
  parseBackupCreatePayload,
  parseBackupRestorePayload,
  parseBackupsPayload,
  readResponsePayload,
} from './backupPayloads';

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function shortChecksum(value: string | undefined): string {
  return value ? value.slice(0, 12) : 'unverified';
}

export default function BackupsPanel() {
  const [items, setItems] = useState<BuilderBackupRecord[]>([]);
  const [sourcePath, setSourcePath] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function refresh() {
    const res = await fetch('/api/builder/ops/backups', { credentials: 'same-origin' });
    if (res.ok) {
      const payload = parseBackupsPayload(await readResponsePayload(res));
      setItems([...payload.backups]);
    }
  }

  async function createOne() {
    if (!sourcePath.trim()) return;
    setBusy(true); setMessage('');
    try {
      const res = await fetch('/api/builder/ops/backups', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourcePath: sourcePath.trim(), note: note.trim() || undefined }),
      });
      const payload = parseBackupCreatePayload(await readResponsePayload(res));
      if (res.ok && payload.record?.status === 'ok') {
        setMessage(`백업 완료 — ${payload.record.id}`);
        setSourcePath(''); setNote('');
        await refresh();
      } else {
        setMessage(`백업 실패: ${payload.error ?? payload.record?.note ?? 'unknown'}`);
      }
    } finally { setBusy(false); }
  }

  async function removeOne(id: string) {
    if (!window.confirm(`백업 ${id} 삭제?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/builder/ops/backups?id=${encodeURIComponent(id)}`, {
        method: 'DELETE', credentials: 'same-origin',
      });
      if (res.ok) await refresh();
    } finally { setBusy(false); }
  }

  async function restoreOne(id: string) {
    if (!window.confirm(`백업 ${id} 복원? 현재 source 파일이 덮어써집니다.`)) return;
    setBusy(true);
    setMessage('');
    try {
      const res = await fetch(`/api/builder/ops/backups/${encodeURIComponent(id)}/restore`, {
        method: 'POST',
        credentials: 'same-origin',
      });
      const payload = parseBackupRestorePayload(await readResponsePayload(res));
      if (res.ok && payload.ok) {
        const suffix = payload.verified ? ` · 검증됨 ${shortChecksum(payload.checksumSha256 ?? undefined)}` : '';
        setMessage(`복원 완료 — ${payload.restoredPath ?? id}${suffix}`);
      } else {
        setMessage(`복원 실패: ${payload.error ?? res.statusText}`);
      }
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  return (
    <div data-ops-backups-panel="true" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <BackupRestoreDrillCard />

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="runtime-data/.../target.json"
          value={sourcePath}
          onChange={(e) => setSourcePath(e.target.value)}
          data-ops-backup-source="true"
          style={{ flex: '1 1 320px', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, minWidth: 240 }}
        />
        <input
          type="text"
          placeholder="note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          data-ops-backup-note="true"
          style={{ flex: '1 1 180px', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, minWidth: 180 }}
        />
        <button
          type="button"
          disabled={busy || !sourcePath.trim()}
          onClick={createOne}
          data-ops-backup-create="true"
          style={{ padding: '6px 12px', border: 0, borderRadius: 6, background: '#0f172a', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
        >
          백업 생성
        </button>
        {message ? <span style={{ width: '100%', fontSize: 12, color: message.includes('실패') ? '#dc2626' : '#16a34a' }}>{message}</span> : null}
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {items.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}>
            백업이 없습니다.
          </div>
        ) : items.map((b) => (
          <div
            key={b.id}
            data-ops-backup-row={b.id}
            style={{ display: 'grid', gap: 10, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, color: '#0f172a', wordBreak: 'break-all' }}>{b.id}</span>
              <span style={{
                padding: '2px 6px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                background: b.status === 'ok' ? '#dcfce7' : '#fee2e2',
                color: b.status === 'ok' ? '#166534' : '#991b1b',
              }}>{b.status}</span>
            </div>
            <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))', gap: 10, margin: 0 }}>
              <BackupField label="source" value={b.sourcePath} wide />
              <BackupField label="size" value={fmtBytes(b.sizeBytes)} />
              <BackupField label="checksum" value={shortChecksum(b.checksumSha256)} marker={b.id} />
              <BackupField label="created" value={new Date(b.createdAt).toLocaleString('ko-KR')} />
            </dl>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" disabled={busy} onClick={() => removeOne(b.id)}
                data-ops-backup-delete={b.id}
                style={{ padding: '4px 8px', border: '1px solid #fecaca', color: '#b91c1c', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                삭제
              </button>
              {b.status === 'ok' ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => restoreOne(b.id)}
                  data-ops-backup-restore={b.id}
                  style={{ padding: '4px 8px', border: '1px solid #bfdbfe', color: '#1d4ed8', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
                >
                  복원
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BackupField({
  label,
  value,
  marker,
  wide = false,
}: {
  label: string;
  value: string;
  marker?: string;
  wide?: boolean;
}) {
  return (
    <div style={{ minWidth: 0, ...(wide ? { gridColumn: '1 / -1' } : {}) }}>
      <dt style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0 }}>{label}</dt>
      <dd
        data-ops-backup-checksum={marker}
        style={{ margin: '3px 0 0', fontSize: 12, color: '#334155', wordBreak: 'break-word', fontFamily: marker ? 'ui-monospace, Menlo, monospace' : undefined }}
      >
        {value}
      </dd>
    </div>
  );
}
