import type { OpsAlertEvaluation, OpsAlertReport, OpsAlertSeverity } from '@/lib/builder/ops/alert-report-model';
import type { OpsDashboardAlert } from '@/lib/builder/ops/dashboard';
import { formatOpsDateTime } from './OpsOverviewMetrics';

const ALERT_TONES: Record<OpsAlertSeverity, { readonly bg: string; readonly color: string }> = {
  error: { bg: '#fef2f2', color: '#991b1b' },
  warn: { bg: '#fffbeb', color: '#92400e' },
  info: { bg: '#eff6ff', color: '#1d4ed8' },
};

function AlertCard({ alert }: { readonly alert: OpsAlertEvaluation }) {
  const tone = ALERT_TONES[alert.severity];
  return (
    <div
      data-ops-alert-row={alert.id}
      data-ops-alert-state={alert.state}
      style={{
        padding: 12,
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        background: tone.bg,
        color: tone.color,
        minWidth: 0,
      }}
    >
      <strong style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>{alert.title}</strong>
      <span style={{ display: 'block', fontSize: 12, lineHeight: 1.45 }}>{alert.detail}</span>
      <span style={{ display: 'block', marginTop: 6, fontSize: 11, color: '#475569', lineHeight: 1.45 }}>
        {alert.action}
      </span>
    </div>
  );
}

function LegacyAlertCard({ alert }: { readonly alert: OpsDashboardAlert }) {
  const tone = ALERT_TONES[alert.severity];
  return (
    <div style={{ padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', background: tone.bg, color: tone.color }}>
      <strong style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>{alert.title}</strong>
      <span style={{ fontSize: 12 }}>{alert.detail}</span>
    </div>
  );
}

export function OpsAlertReportView({
  report,
  fallbackAlerts,
}: {
  readonly report: OpsAlertReport | null;
  readonly fallbackAlerts: readonly OpsDashboardAlert[];
}) {
  if (!report) {
    if (fallbackAlerts.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {fallbackAlerts.map((alert) => (
          <LegacyAlertCard key={`${alert.severity}-${alert.title}`} alert={alert} />
        ))}
      </div>
    );
  }

  return (
    <section
      data-ops-alert-report="true"
      data-ops-alert-open-count={report.openAlerts.length}
      style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
          gap: 8,
        }}
      >
        <SummaryTile label="open" value={String(report.openAlerts.length)} tone={report.openAlerts.length > 0 ? 'warn' : 'ok'} />
        <SummaryTile label="ok" value={String(report.okAlerts.length)} tone="ok" />
        <SummaryTile label="updated" value={formatOpsDateTime(report.generatedAt)} tone="neutral" />
        <SummaryTile label="window" value={`${report.historyWindow.points} points`} tone="neutral" />
      </div>
      {report.openAlerts.length === 0 ? (
        <div
          data-ops-alert-empty="true"
          style={{ padding: 12, borderRadius: 8, border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#166534' }}
        >
          <strong style={{ display: 'block', fontSize: 12 }}>열린 알림 없음</strong>
          <span style={{ fontSize: 12 }}>logs, security, perf, backup, cache 룰이 현재 기준 안에 있습니다.</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 8 }}>
          {report.openAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </section>
  );
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  readonly label: string;
  readonly value: string;
  readonly tone: 'ok' | 'warn' | 'neutral';
}) {
  const color = tone === 'warn' ? '#b45309' : tone === 'ok' ? '#15803d' : '#334155';
  return (
    <div style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', minWidth: 0 }}>
      <span style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{ display: 'block', marginTop: 4, fontSize: 16, fontWeight: 800, color, overflowWrap: 'anywhere' }}>
        {value}
      </span>
    </div>
  );
}
