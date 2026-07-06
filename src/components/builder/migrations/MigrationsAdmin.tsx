'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { MigrationJournal, MigrationRecord } from '@/lib/builder/migrations/types';

interface Props {
  locale: Locale;
  initialJournal: MigrationJournal;
  initialPending: Array<{ id: string; description: string }>;
}

interface RunResult {
  ok: boolean;
  applied: MigrationRecord[];
  skipped: string[];
  failed?: { id: string; error: string };
}

const COPY = {
  ko: {
    title: '스키마 마이그레이션',
    subtitle: '블롭 JSON 컬렉션 스키마 변경을 순서대로 적용하고 적용 이력을 검토합니다.',
    run: (count: number) => `펜딩 ${count}건 실행`,
    running: '실행 중...',
    refresh: '새로고침',
    refreshStatus: '새로고침 완료',
    runningStatus: '마이그레이션을 실행하는 중...',
    runFailed: (id: string, error: string) => `실행 실패: ${id} ${error}`.trim(),
    runSummary: (applied: number, skipped: number) => `적용 ${applied}건, 스킵 ${skipped}건`,
    pending: (count: number) => `펜딩 (${count})`,
    allApplied: '모든 마이그레이션이 적용되었습니다.',
    appliedHistory: (count: number) => `적용 이력 (${count})`,
    appliedAt: '적용 시각',
    noApplied: '아직 적용된 마이그레이션이 없습니다.',
    touched: 'touched',
    ms: 'ms',
    id: 'id',
    description: 'description',
    statusReady: '준비됨',
  },
  'zh-hant': {
    title: '結構遷移',
    subtitle: '依序套用 Blob JSON 集合結構變更，並檢視套用紀錄。',
    run: (count: number) => `執行 ${count} 筆待處理項目`,
    running: '執行中...',
    refresh: '重新整理',
    refreshStatus: '已重新整理',
    runningStatus: '正在執行遷移...',
    runFailed: (id: string, error: string) => `執行失敗：${id} ${error}`.trim(),
    runSummary: (applied: number, skipped: number) => `已套用 ${applied} 筆，略過 ${skipped} 筆`,
    pending: (count: number) => `待處理 (${count})`,
    allApplied: '所有遷移都已套用。',
    appliedHistory: (count: number) => `套用紀錄 (${count})`,
    appliedAt: '套用時間',
    noApplied: '尚無已套用的遷移。',
    touched: 'touched',
    ms: 'ms',
    id: 'id',
    description: 'description',
    statusReady: '就緒',
  },
  en: {
    title: 'Schema migrations',
    subtitle: 'Apply blob JSON collection schema changes in order and review the applied history.',
    run: (count: number) => `Run ${count} pending`,
    running: 'Running...',
    refresh: 'Refresh',
    refreshStatus: 'Refreshed',
    runningStatus: 'Running migrations...',
    runFailed: (id: string, error: string) => `Run failed: ${id} ${error}`.trim(),
    runSummary: (applied: number, skipped: number) => `Applied ${applied}, skipped ${skipped}`,
    pending: (count: number) => `Pending (${count})`,
    allApplied: 'All migrations have been applied.',
    appliedHistory: (count: number) => `Applied history (${count})`,
    appliedAt: 'Applied at',
    noApplied: 'No migrations have been applied yet.',
    touched: 'touched',
    ms: 'ms',
    id: 'id',
    description: 'description',
    statusReady: 'Ready',
  },
} satisfies Record<Locale, {
  title: string;
  subtitle: string;
  run: (count: number) => string;
  running: string;
  refresh: string;
  refreshStatus: string;
  runningStatus: string;
  runFailed: (id: string, error: string) => string;
  runSummary: (applied: number, skipped: number) => string;
  pending: (count: number) => string;
  allApplied: string;
  appliedHistory: (count: number) => string;
  appliedAt: string;
  noApplied: string;
  touched: string;
  ms: string;
  id: string;
  description: string;
  statusReady: string;
}>;

export default function MigrationsAdmin({ locale, initialJournal, initialPending }: Props) {
  const copy = COPY[locale];
  const [journal, setJournal] = useState(initialJournal);
  const [pending, setPending] = useState(initialPending);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(copy.statusReady);
  const [messageTone, setMessageTone] = useState<'success' | 'error'>('success');

  async function refresh() {
    const res = await fetch('/api/builder/migrations', { credentials: 'same-origin' });
    if (!res.ok) return;
    const payload = (await res.json()) as { journal: MigrationJournal; pending: Array<{ id: string; description: string }> };
    setJournal(payload.journal);
    setPending(payload.pending);
    setMessageTone('success');
    setMessage(copy.refreshStatus);
  }

  async function run() {
    setBusy(true);
    setMessage('');
    setMessageTone('success');
    try {
      const res = await fetch('/api/builder/migrations', { method: 'POST', credentials: 'same-origin' });
      const payload = (await res.json().catch(() => ({}))) as RunResult;
      if (!res.ok || !payload.ok) {
        setMessageTone('error');
        setMessage(copy.runFailed(payload.failed?.id ?? '', payload.failed?.error ?? ''));
      } else {
        setMessageTone('success');
        setMessage(copy.runSummary(payload.applied.length, payload.skipped.length));
      }
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header>
        <h1 style={{ margin: 0, fontSize: 20 }}>{copy.title}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{copy.subtitle}</p>
      </header>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" disabled={busy || pending.length === 0} onClick={run} style={{ padding: '8px 14px', border: 0, background: busy || pending.length === 0 ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer' }}>
          {busy ? copy.running : copy.run(pending.length)}
        </button>
        <button type="button" onClick={refresh} style={{ padding: '8px 14px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8, cursor: 'pointer' }}>
          {copy.refresh}
        </button>
      </div>
      {message ? <div style={{ fontSize: 12, color: messageTone === 'error' ? '#dc2626' : '#16a34a' }}>{message}</div> : null}

      <section>
        <h2 style={{ margin: '12px 0 4px', fontSize: 14 }}>{copy.pending(pending.length)}</h2>
        {pending.length === 0 ? (
          <div style={{ color: '#94a3b8', fontSize: 12, padding: 12, border: '1px dashed #cbd5e1', borderRadius: 6 }}>
            {copy.allApplied}
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
        <h2 style={{ margin: '12px 0 4px', fontSize: 14 }}>{copy.appliedHistory(journal.applied.length)}</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '6px 10px' }}>{copy.id}</th>
              <th style={{ padding: '6px 10px' }}>{copy.description}</th>
              <th style={{ padding: '6px 10px' }}>{copy.appliedAt}</th>
              <th style={{ padding: '6px 10px' }}>{copy.touched}</th>
              <th style={{ padding: '6px 10px' }}>{copy.ms}</th>
            </tr>
          </thead>
          <tbody>
            {journal.applied.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                  {copy.noApplied}
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
