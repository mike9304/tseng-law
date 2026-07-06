import type { OpsDashboardSnapshot, OpsDashboardTrendPoint } from '@/lib/builder/ops/dashboard';
import type { Locale } from '@/lib/locales';
import { OpsCmsLifecycleDashboard } from './OpsCmsLifecycleDashboard';
import { formatOpsDateTime } from './OpsOverviewMetrics';

interface OpsOverviewDetailsProps {
  locale: Locale;
  snapshot: OpsDashboardSnapshot | null;
  history: readonly OpsDashboardTrendPoint[];
}

export function OpsOverviewDetails({ locale, snapshot, history }: OpsOverviewDetailsProps) {
  if (!snapshot) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 12 }}>
      <OpsCmsLifecycleDashboard locale={locale} dashboard={snapshot.cmsLifecycle} />
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', padding: 12 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 13 }}>최근 로그</h3>
        <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '6px 8px' }}>at</th>
                <th style={{ padding: '6px 8px' }}>source</th>
                <th style={{ padding: '6px 8px' }}>level</th>
                <th style={{ padding: '6px 8px' }}>summary</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.logs.entries.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 16, textAlign: 'center', color: '#94a3b8' }}>로그가 없습니다.</td></tr>
              ) : snapshot.logs.entries.slice(0, 5).map((entry, idx) => (
                <tr key={`${entry.at}-${idx}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '6px 8px', whiteSpace: 'nowrap', color: '#64748b' }}>{formatOpsDateTime(entry.at)}</td>
                  <td style={{ padding: '6px 8px' }}>{entry.source}</td>
                  <td style={{ padding: '6px 8px' }}>{entry.level}</td>
                  <td style={{ padding: '6px 8px', fontFamily: 'ui-monospace, Menlo, monospace' }}>{entry.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', padding: 12 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 13 }}>최근 추이</h3>
        <TrendRow label="logs 24h" points={history.map((entry) => entry.logs24h)} />
        <TrendRow label="errors 24h" points={history.map((entry) => entry.errors24h)} />
        <TrendRow label="denied" points={history.map((entry) => entry.deniedRequests)} />
        <TrendRow label="heap used" points={history.map((entry) => entry.heapUsedBytes)} format={(value) => `${(value / 1024 / 1024).toFixed(1)} MB`} />
      </div>
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', padding: 12 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 13 }}>성능 / 보안</h3>
        <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          <Stat label="RSS" value={`${(snapshot.perf.memory.rssBytes / 1024 / 1024).toFixed(2)} MB`} />
          <Stat label="Heap used" value={`${(snapshot.perf.memory.heapUsedBytes / 1024 / 1024).toFixed(2)} MB`} />
          <Stat label="Security events" value={`${snapshot.security.totalEvents}`} />
          <Stat label="Denied" value={`${snapshot.security.deniedRequests}`} />
        </dl>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 6, minWidth: 0 }}>
      <dt style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0, fontWeight: 700 }}>{label}</dt>
      <dd style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{value}</dd>
    </div>
  );
}

function TrendRow({
  label,
  points,
  format,
}: {
  label: string;
  points: readonly number[];
  format?: (value: number) => string;
}) {
  const max = Math.max(1, ...points, 0);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4, fontSize: 12 }}>
        <span style={{ color: '#475569', fontWeight: 700 }}>{label}</span>
        <span style={{ color: '#64748b' }}>
          {points.length > 0 ? (format ? format(points[points.length - 1]) : String(points[points.length - 1])) : '—'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'end', gap: 3, minHeight: 28 }}>
        {points.length === 0 ? (
          <div style={{ fontSize: 12, color: '#94a3b8' }}>history 없음</div>
        ) : points.slice(-12).map((value, index) => (
          <div
            key={`${label}-${index}`}
            title={format ? format(value) : String(value)}
            style={{
              width: 10,
              height: `${Math.max(3, Math.round((value / max) * 28))}px`,
              background: '#0f172a',
              opacity: 0.15 + ((index + 1) / Math.max(1, points.slice(-12).length)) * 0.85,
              borderRadius: 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
