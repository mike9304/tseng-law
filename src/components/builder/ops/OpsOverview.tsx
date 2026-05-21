'use client';

import { useEffect, useState } from 'react';
import type { OpsHealthSnapshot } from '@/lib/builder/ops/health-model';

function fmtRelative(iso: string | undefined): string {
  if (!iso) return '—';
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso;
  return new Date(t).toLocaleString('ko-KR');
}

interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'ok' | 'warn' | 'unknown';
}

function KpiCard({ label, value, hint, tone = 'ok' }: KpiCardProps) {
  const color = tone === 'warn' ? '#b91c1c' : tone === 'unknown' ? '#64748b' : '#16a34a';
  return (
    <div
      data-ops-kpi-card={label}
      style={{
        flex: '1 1 180px', padding: 16, border: '1px solid #e2e8f0', borderRadius: 8,
        background: '#fff', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 180,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </span>
      <span style={{ fontSize: 22, fontWeight: 700, color }}>{value}</span>
      {hint ? <span style={{ fontSize: 12, color: '#64748b' }}>{hint}</span> : null}
    </div>
  );
}

export default function OpsOverview() {
  const [snapshot, setSnapshot] = useState<OpsHealthSnapshot | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  async function loadCached() {
    setError('');
    try {
      const res = await fetch('/api/builder/ops/health', { credentials: 'same-origin' });
      if (!res.ok) throw new Error(res.statusText);
      const payload = await res.json() as { snapshot?: OpsHealthSnapshot };
      if (payload.snapshot) setSnapshot(payload.snapshot);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'failed to load');
    }
  }

  async function recollect() {
    setRefreshing(true);
    setError('');
    try {
      const res = await fetch('/api/builder/ops/health', {
        method: 'POST', credentials: 'same-origin',
      });
      if (!res.ok) throw new Error(res.statusText);
      const payload = await res.json() as { snapshot?: OpsHealthSnapshot };
      if (payload.snapshot) setSnapshot(payload.snapshot);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'failed to refresh');
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => { void loadCached(); }, []);

  return (
    <div data-ops-overview="true" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          disabled={refreshing}
          onClick={recollect}
          data-ops-overview-refresh="true"
          style={{
            padding: '6px 12px', border: 0, borderRadius: 6, fontSize: 12, fontWeight: 700,
            background: refreshing ? '#94a3b8' : '#0f172a', color: '#fff',
            cursor: refreshing ? 'not-allowed' : 'pointer',
          }}
        >
          {refreshing ? '수집 중...' : '지금 수집'}
        </button>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          마지막 수집: {fmtRelative(snapshot?.gatheredAt)}
        </span>
        {error ? <span style={{ marginLeft: 'auto', fontSize: 12, color: '#dc2626' }}>{error}</span> : null}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <KpiCard
          label="Deploy"
          value={snapshot?.deploys.status ?? 'unknown'}
          hint={fmtRelative(snapshot?.deploys.lastDeployAt)}
          tone={snapshot?.deploys.status === 'ok' ? 'ok' : 'unknown'}
        />
        <KpiCard
          label="Cache keys"
          value={snapshot?.cache.runtimeCacheKeys ?? 0}
          hint={`last write ${fmtRelative(snapshot?.cache.lastClearedAt)}`}
        />
        <KpiCard
          label="Backups"
          value={snapshot?.storage.backupCount ?? 0}
          hint={`latest ${fmtRelative(snapshot?.storage.lastBackupAt)}`}
        />
        <KpiCard
          label="Logs 24h"
          value={snapshot?.logs.last24hCount ?? 0}
          hint={`errors ${snapshot?.logs.errorCount ?? 0}`}
          tone={(snapshot?.logs.errorCount ?? 0) > 0 ? 'warn' : 'ok'}
        />
        <KpiCard
          label="Security 24h"
          value={snapshot?.security.last24hEvents ?? 0}
          hint={`denied ${snapshot?.security.deniedRequests ?? 0}`}
          tone={(snapshot?.security.deniedRequests ?? 0) > 0 ? 'warn' : 'ok'}
        />
      </div>
    </div>
  );
}