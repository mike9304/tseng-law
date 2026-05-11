'use client';

import { useState } from 'react';
import type { MigrationJournal, MigrationRecord } from '@/lib/builder/migrations/types';

interface Props {
  initialJournal: MigrationJournal;
  initialPending: Array<{ id: string; description: string }>;
}

interface RunResult {
  ok: boolean;
  applied: MigrationRecord[];
  skipped: string[];
  failed?: { id: string; error: string };
}

export default function MigrationsAdmin({ initialJournal, initialPending }: Props) {
  const [journal, setJournal] = useState(initialJournal);
  const [pending, setPending] = useState(initialPending);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function refresh() {
    const res = await fetch('/api/builder/migrations', { credentials: 'same-origin' });
    if (!res.ok) return;
    const payload = (await res.json()) as { journal: MigrationJournal; pending: Array<{ id: string; description: string }> };
    setJournal(payload.journal);
    setPending(payload.pending);
  }

  async function run() {
    setBusy(true);
    setMessage('');
    try {
      const res = await fetch('/api/builder/migrations', { method: 'POST', credentials: 'same-origin' });
      const payload = (await res.json().catch(() => ({}))) as RunResult;
      if (!res.ok || !payload.ok) {
        setMessage(`실행 실패: ${payload.failed?.id ?? ''} ${payload.failed?.error ?? ''}`);
      } else {
        setMessage(`적용 ${payload.applied.length}건, 스킵 ${payload.skipped.length}건`);
      }
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header>
        <h1 style={{ margin: 0, fontSize: 20 }}>Schema Migrations</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          블롭 JSON 컬렉션 스키마 변경을 idempotent 순서대로 적용.
        </p>
      </header>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" disabled={busy || pending.length === 0} onClick={run} style={{ padding: '8px 14px', border: 0, background: busy || pending.length === 0 ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer' }}>
          {busy ? '실행 중...' : `펜딩 ${pending.length}건 실행`}
        </button>
        <button type="button" onClick={refresh} style={{ padding: '8px 14px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8, cursor: 'pointer' }}>
          새로고침
        </button>
      </div>
      {message ? <div style={{ fontSize: 12, color: message.includes('실패') ? '#dc2626' : '#16a34a' }}>{message}</div> : null}

      <section>
        <h2 style={{ margin: '12px 0 4px', fontSize: 14 }}>펜딩 ({pending.length})</h2>
        {pending.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: 12, padding: 12, border: '1px dashed #cbd5e1', borderRadius: 6 }}>
            모든 마이그레이션이 적용되었습니다.
          </div>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {pending.map((m) => (
              <li key={m.id} style={{ padding: '8px 12px', border: '1px solid #fcd34d', background: '#fef3c7', color: '#92400e', borderRadius: 6, fontSize: 12 }}>
                <strong style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{m.id}</strong> — {m.description}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 style={{ margin: '12px 0 4px', fontSize: 14 }}>적용 이력 ({journal.applied.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '6px 10px' }}>id</th>
              <th style={{ padding: '6px 10px' }}>description</th>
              <th style={{ padding: '6px 10px' }}>적용 시각</th>
              <th style={{ padding: '6px 10px' }}>touched</th>
              <th style={{ padding: '6px 10px' }}>ms</th>
            </tr>
          </thead>
          <tbody>
            {journal.applied.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                  아직 적용된 마이그레이션이 없습니다.
                </td>
              </tr>
            ) : journal.applied.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '6px 10px', fontFamily: 'ui-monospace, Menlo, monospace' }}>{r.id}</td>
                <td style={{ padding: '6px 10px' }}>{r.description}</td>
                <td style={{ padding: '6px 10px', color: '#64748b' }}>{new Date(r.appliedAt).toLocaleString('ko-KR')}</td>
                <td style={{ padding: '6px 10px' }}>{r.touched}</td>
                <td style={{ padding: '6px 10px' }}>{r.durationMs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
