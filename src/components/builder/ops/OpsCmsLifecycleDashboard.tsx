import Link from 'next/link';
import type { OpsCmsLifecycleDashboard as OpsCmsLifecycleDashboardModel } from '@/lib/builder/ops/cms-lifecycle-dashboard';
import type { Locale } from '@/lib/locales';
import { formatOpsDateTime } from './OpsOverviewMetrics';

interface OpsCmsLifecycleDashboardProps {
  readonly locale: Locale;
  readonly dashboard: OpsCmsLifecycleDashboardModel;
}

export function OpsCmsLifecycleDashboard({
  locale,
  dashboard,
}: OpsCmsLifecycleDashboardProps) {
  const hasEvents = dashboard.totalEvents > 0;
  return (
    <div
      data-ops-cms-lifecycle-dashboard="true"
      data-ops-cms-lifecycle-event-count={dashboard.totalEvents}
      style={{ border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', padding: 12 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'start' }}>
        <h3 style={{ margin: 0, fontSize: 13 }}>CMS lifecycle audit</h3>
        <span style={{ fontSize: 12, color: '#64748b' }}>{dashboard.changedRecords}/{dashboard.requestedRecords} changed</span>
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, margin: '10px 0' }}>
        <Metric label="Events" value={dashboard.totalEvents} marker="events" />
        <Metric label="Requested" value={dashboard.requestedRecords} marker="requested" />
        <Metric label="Changed" value={dashboard.changedRecords} marker="changed" />
      </dl>
      {hasEvents ? (
        <>
          <div style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
            {dashboard.topCollections.map((collection) => (
              <div
                key={collection.collectionId}
                data-ops-cms-lifecycle-collection={collection.collectionId}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, minWidth: 0 }}
              >
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: 'block', fontSize: 12, color: '#0f172a', overflowWrap: 'anywhere' }}>
                    {collection.collectionId}
                  </strong>
                  <span style={{ fontSize: 11, color: '#64748b' }}>
                    {collection.count} events · {collection.changedRecords}/{collection.requestedRecords} changed
                  </span>
                </div>
                <Link
                  href={`/${locale}/admin-builder/ops?tab=logs&type=audit&q=${encodeURIComponent(collection.collectionId)}`}
                  className="builder-link-inline"
                  data-ops-cms-lifecycle-log-link={collection.collectionId}
                  style={{ flex: '0 0 auto', fontSize: 12 }}
                >
                  logs
                </Link>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
            {dashboard.recent.map((entry) => (
              <div
                key={`${entry.at}-${entry.collectionId}-${entry.action}`}
                data-ops-cms-lifecycle-recent={entry.collectionId}
                style={{ display: 'grid', gridTemplateColumns: '96px minmax(0, 1fr)', gap: 8, marginTop: 6, fontSize: 12 }}
              >
                <span style={{ color: '#64748b' }}>{formatOpsDateTime(entry.at)}</span>
                <span style={{ color: '#334155', overflowWrap: 'anywhere' }}>
                  {entry.action} · {entry.collectionId} · {entry.changedCount}/{entry.requestedCount}
                  {entry.status ? ` · ${entry.status}` : ''}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{ margin: '8px 0 0', fontSize: 12, color: '#94a3b8' }}>CMS lifecycle audit 이벤트가 없습니다.</p>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  marker,
}: {
  readonly label: string;
  readonly value: number;
  readonly marker: string;
}) {
  return (
    <div style={{ minWidth: 0, border: '1px solid #e2e8f0', borderRadius: 6, padding: 8 }}>
      <dt style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0, fontWeight: 700 }}>
        {label}
      </dt>
      <dd
        data-ops-cms-lifecycle-metric={marker}
        style={{ margin: '3px 0 0', fontSize: 16, fontWeight: 700, color: '#0f172a' }}
      >
        {value}
      </dd>
    </div>
  );
}
