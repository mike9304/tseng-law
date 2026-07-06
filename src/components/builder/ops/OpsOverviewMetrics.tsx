import type { OpsDashboardSnapshot } from '@/lib/builder/ops/dashboard';

export function formatOpsDateTime(iso: string | undefined): string {
  if (!iso) return '—';
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso;
  return new Date(t).toLocaleString('ko-KR');
}

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function shortSha(value: string | undefined): string {
  return value ? value.slice(0, 8) : 'unknown';
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
        flex: '1 1 180px',
        padding: 16,
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minWidth: 180,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: 22, fontWeight: 700, color }}>{value}</span>
      {hint ? <span style={{ fontSize: 12, color: '#64748b' }}>{hint}</span> : null}
    </div>
  );
}

function DeployIdentity({ snapshot }: { snapshot: OpsDashboardSnapshot | null }) {
  const deploy = snapshot?.health.deploys;
  const items = [
    { label: 'source', value: deploy?.source ?? 'unknown', marker: 'source' },
    { label: 'env', value: deploy?.environment ?? 'unknown', marker: 'environment' },
    { label: 'url', value: deploy?.url ?? 'unknown', marker: 'url' },
    { label: 'ref', value: deploy?.gitRef ?? 'unknown', marker: 'git-ref' },
    { label: 'sha', value: shortSha(deploy?.gitCommitSha), marker: 'git-sha' },
  ];
  return (
    <div
      data-ops-deploy-identity="true"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        padding: 12,
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        background: '#f8fafc',
      }}
    >
      {items.map((item) => (
        <span
          key={item.marker}
          data-ops-deploy-field={item.marker}
          style={{ fontSize: 12, color: '#334155', fontFamily: 'ui-monospace, Menlo, monospace' }}
        >
          <strong style={{ color: '#64748b', fontFamily: 'inherit' }}>{item.label}</strong> {item.value}
        </span>
      ))}
    </div>
  );
}

export function OpsOverviewMetrics({ snapshot }: { snapshot: OpsDashboardSnapshot | null }) {
  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <KpiCard
          label="Deploy"
          value={snapshot?.health.deploys.status ?? 'unknown'}
          hint={formatOpsDateTime(snapshot?.health.deploys.lastDeployAt)}
          tone={snapshot?.health.deploys.status === 'ok' ? 'ok' : 'unknown'}
        />
        <KpiCard
          label="Cache keys"
          value={snapshot?.health.cache.runtimeCacheKeys ?? 0}
          hint={`last write ${formatOpsDateTime(snapshot?.health.cache.lastClearedAt)}`}
        />
        <KpiCard
          label="Backups"
          value={snapshot?.health.storage.backupCount ?? 0}
          hint={`latest ${formatOpsDateTime(snapshot?.health.storage.lastBackupAt)}`}
        />
        <KpiCard
          label="Logs 24h"
          value={snapshot?.health.logs.last24hCount ?? 0}
          hint={`errors ${snapshot?.health.logs.errorCount ?? 0}`}
          tone={(snapshot?.health.logs.errorCount ?? 0) > 0 ? 'warn' : 'ok'}
        />
        <KpiCard
          label="Security 24h"
          value={snapshot?.health.security.last24hEvents ?? 0}
          hint={`denied ${snapshot?.health.security.deniedRequests ?? 0}`}
          tone={(snapshot?.health.security.deniedRequests ?? 0) > 0 ? 'warn' : 'ok'}
        />
        <KpiCard
          label="Uptime"
          value={snapshot ? formatUptime(snapshot.perf.uptimeSeconds) : '—'}
          hint={`captured ${formatOpsDateTime(snapshot?.perf.capturedAt)}`}
        />
      </div>
      <DeployIdentity snapshot={snapshot} />
    </>
  );
}
