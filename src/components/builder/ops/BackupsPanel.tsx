'use client';

import { useEffect, useState } from 'react';
import type { BuilderBackupRecord } from '@/lib/builder/ops/backups-model';

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
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
      const payload = await res.json() as { backups: BuilderBackupRecord[] };
      setItems(payload.backups);
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
      const payload = (await res.json().catch(() => ({}))) as { record?: BuilderBackupRecord; error?: string };
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

  useEffect(() => { void refresh(); }, []);

  return (
    <div data-ops-backups-panel="true" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
            <th style={{ padding: '8px 12px' }}>id</th>
            <th style={{ padding: '8px 12px' }}>source</th>
            <th style={{ padding: '8px 12px' }}>size</th>
            <th style={{ padding: '8px 12px' }}>created</th>
            <th style={{ padding: '8px 12px' }}>status</th>
            <th style={{ padding: '8px 12px' }}>action</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>백업이 없습니다.</td></tr>
          ) : items.map((b) => (
            <tr key={b.id} style={{ borderBottom: '1px solid #e2e8f0' }} data-ops-backup-row={b.id}>
              <td style={{ padding: '8px 12px', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11 }}>{b.id}</td>
              <td style={{ padding: '8px 12px', color: '#64748b' }}>{b.sourcePath}</td>
              <td style={{ padding: '8px 12px' }}>{fmtBytes(b.sizeBytes)}</td>
              <td style={{ padding: '8px 12px', color: '#64748b' }}>{new Date(b.createdAt).toLocaleString('ko-KR')}</td>
              <td style={{ padding: '8px 12px' }}>
                <span style={{
                  padding: '2px 6px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                  background: b.status === 'ok' ? '#dcfce7' : '#fee2e2',
                  color: b.status === 'ok' ? '#166534' : '#991b1b',
                }}>{b.status}</span>
              </td>
              <td style={{ padding: '8px 12px' }}>
                <button type="button" disabled={busy} onClick={() => removeOne(b.id)}
                  data-ops-backup-delete={b.id}
                  style={{ padding: '4px 8px', border: '1px solid #fecaca', color: '#b91c1c', background: '#fff', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}