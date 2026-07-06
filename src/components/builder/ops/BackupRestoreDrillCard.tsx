'use client';

import { useEffect, useState } from 'react';
import type { BuilderBackupRestoreDrillReport } from '@/lib/builder/ops/backups-model';

function shortChecksum(value: string | undefined): string {
  return value ? value.slice(0, 12) : 'unverified';
}

function formatDate(value: string | undefined): string {
  if (!value) return '아직 실행 안 됨';
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value;
  return new Date(parsed).toLocaleString('ko-KR');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isDrillReport(value: unknown): value is BuilderBackupRestoreDrillReport {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.ranAt === 'string'
    && (value.status === 'ok' || value.status === 'failed')
    && typeof value.sourcePath === 'string'
    && typeof value.verified === 'boolean'
    && typeof value.durationMs === 'number'
    && typeof value.backupDeleted === 'boolean';
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
  }
}

export function BackupRestoreDrillCard() {
  const [report, setReport] = useState<BuilderBackupRestoreDrillReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function refresh() {
    const res = await fetch('/api/builder/ops/backups/drill', { credentials: 'same-origin' });
    if (res.ok) {
      const payload = await readJson(res);
      const nextReport = isRecord(payload) && isDrillReport(payload.report) ? payload.report : null;
      setReport(nextReport);
    }
  }

  async function runDrill() {
    setBusy(true);
    setMessage('');
    try {
      const res = await fetch('/api/builder/ops/backups/drill', {
        method: 'POST',
        credentials: 'same-origin',
      });
      const payload = await readJson(res);
      const nextReport = isRecord(payload) && isDrillReport(payload.report) ? payload.report : null;
      const error = isRecord(payload) && typeof payload.error === 'string' ? payload.error : res.statusText;
      if (res.ok && nextReport?.status === 'ok') {
        setReport(nextReport);
        setMessage(`드릴 성공 · 검증됨 ${shortChecksum(nextReport.checksumSha256)}`);
      } else {
        if (nextReport) setReport(nextReport);
        setMessage(`드릴 실패: ${nextReport?.error ?? error}`);
      }
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  const ok = report?.status === 'ok';

  return (
    <section
      data-ops-backup-drill="true"
      style={{ display: 'grid', gap: 10, padding: 12, border: '1px solid #bfdbfe', borderRadius: 8, background: '#eff6ff' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 13, color: '#1e3a8a' }}>복원 드릴</h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#475569' }}>
            임시 JSON을 백업, 변조, 복원, 재해시해서 백업 복구 경로를 검증합니다.
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={runDrill}
          data-ops-backup-drill-run="true"
          style={{ padding: '6px 12px', border: 0, borderRadius: 6, background: busy ? '#94a3b8' : '#1d4ed8', color: '#fff', fontSize: 12, fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer' }}
        >
          {busy ? '실행 중...' : '드릴 실행'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: 8 }}>
        <DrillStat label="status" value={report?.status ?? 'none'} marker="status" tone={ok ? 'ok' : report ? 'failed' : 'none'} />
        <DrillStat label="verified" value={report?.verified ? 'true' : 'false'} marker="verified" tone={report?.verified ? 'ok' : 'none'} />
        <DrillStat label="checksum" value={shortChecksum(report?.checksumSha256)} marker="checksum" />
        <DrillStat label="last run" value={formatDate(report?.ranAt)} marker="ran-at" />
      </div>

      {message ? (
        <span style={{ fontSize: 12, color: message.includes('실패') ? '#b91c1c' : '#166534' }}>{message}</span>
      ) : null}
    </section>
  );
}

function DrillStat({
  label,
  value,
  marker,
  tone = 'none',
}: {
  label: string;
  value: string;
  marker: string;
  tone?: 'ok' | 'failed' | 'none';
}) {
  const color = tone === 'ok' ? '#166534' : tone === 'failed' ? '#b91c1c' : '#334155';
  return (
    <div style={{ minWidth: 0 }}>
      <dt style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0 }}>{label}</dt>
      <dd
        data-ops-backup-drill-field={marker}
        style={{ margin: '3px 0 0', fontSize: 12, color, wordBreak: 'break-word', fontFamily: marker === 'checksum' ? 'ui-monospace, Menlo, monospace' : undefined }}
      >
        {value}
      </dd>
    </div>
  );
}
