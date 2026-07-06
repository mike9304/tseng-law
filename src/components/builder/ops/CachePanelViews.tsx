import type { CachePurgeReport } from '@/lib/builder/ops/cache-introspection';

export function formatCacheBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function formatCacheAge(ms: number): string {
  if (ms < 60_000) return `${Math.max(0, Math.round(ms / 1000))}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
  if (ms < 86_400_000) return `${Math.round(ms / 3_600_000)}h`;
  return `${Math.round(ms / 86_400_000)}d`;
}

export function formatCacheDate(iso: string | undefined): string {
  if (!iso) return '—';
  const parsed = Date.parse(iso);
  if (!Number.isFinite(parsed)) return iso;
  return new Date(parsed).toLocaleString('ko-KR');
}

export function CacheMetric({
  label,
  value,
  marker,
  tone = 'ok',
}: {
  label: string;
  value: string | number;
  marker: string;
  tone?: 'ok' | 'warn';
}) {
  return (
    <div data-ops-cache-summary={marker} style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', minWidth: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0 }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 20, fontWeight: 800, color: tone === 'warn' ? '#c2410c' : '#0f172a' }}>{value}</div>
    </div>
  );
}

export function CacheReport({ report }: { report: CachePurgeReport | null }) {
  if (!report) {
    return (
      <div data-ops-cache-report="true" data-ops-cache-report-empty="true" style={{ padding: 12, border: '1px dashed #cbd5e1', borderRadius: 8, color: '#64748b', fontSize: 12 }}>
        최근 캐시 정리 리포트가 없습니다.
      </div>
    );
  }
  return (
    <div data-ops-cache-report="true" style={{ display: 'grid', gap: 8, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc' }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>최근 캐시 정리 리포트</div>
      <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: 10, margin: 0 }}>
        <CacheField label="mode" value={report.mode} marker="mode" />
        <CacheField label="cleared" value={`${report.clearedKeys.length}`} marker="cleared" />
        <CacheField label="failed" value={`${report.failedKeys.length}`} marker="failed" />
        <CacheField label="bytes" value={formatCacheBytes(report.totalBytesCleared)} marker="bytes" />
        <CacheField label="purged" value={formatCacheDate(report.purgedAt)} marker="purged-at" />
      </dl>
    </div>
  );
}

export function CacheField({
  label,
  value,
  marker,
}: {
  label: string;
  value: string;
  marker?: string;
}) {
  return (
    <div style={{ minWidth: 0 }}>
      <dt style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0 }}>{label}</dt>
      <dd data-ops-cache-field={marker} style={{ margin: '3px 0 0', fontSize: 12, color: '#334155', wordBreak: 'break-word' }}>
        {value}
      </dd>
    </div>
  );
}
