'use client';

import { Fragment } from 'react';
import type { WorkspaceAnalyticsRollup } from '@/lib/builder/workspace/analytics-aggregate';
import type { AccountCollectionSummary } from '@/lib/builder/workspace/shared-cms';
import type { WorkspaceCopy } from '@/lib/builder/workspace/workspace-copy';

interface AnalyticsPanelProps {
  copy: WorkspaceCopy['analytics'];
  analytics: WorkspaceAnalyticsRollup | null;
  collections: AccountCollectionSummary[];
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: '16px 18px',
};

const sectionHeadingStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: 'inherit',
  fontSize: 14,
  fontWeight: 700,
  color: '#0f172a',
};

function formatMoney(cents: number, currency: string): string {
  const value = cents / 100;
  return value.toLocaleString(undefined, { style: 'currency', currency: currency || 'TWD' });
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'] as const;
  let value = Math.max(0, bytes);
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const formatted = unitIndex === 0
    ? String(Math.round(value))
    : value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return `${formatted} ${units[unitIndex]}`;
}

function MetricCard({
  label,
  value,
  metric,
}: {
  label: string;
  value: string | number;
  metric: string;
}) {
  return (
    <article style={cardStyle} data-analytics-card={metric}>
      <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{label}</p>
      <p style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 600 }}>{value}</p>
    </article>
  );
}

export default function AnalyticsPanel({ copy, analytics, collections }: AnalyticsPanelProps) {
  if (!analytics) {
    return (
      <p data-analytics-empty style={{ color: '#64748b', fontSize: 13 }}>
        {copy.unavailable}
      </p>
    );
  }

  return (
    <div data-analytics-panel style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section
        data-analytics-totals
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        <MetricCard label={copy.orders} value={analytics.totalOrders} metric="orders" />
        <MetricCard label={copy.bookings} value={analytics.totalBookings} metric="bookings" />
        <MetricCard
          label={copy.grossCollected}
          value={formatMoney(analytics.totalGrossCollectedCents, analytics.primaryCurrency)}
          metric="gross"
        />
        <MetricCard
          label={copy.outstanding}
          value={formatMoney(analytics.totalOutstandingCents, analytics.primaryCurrency)}
          metric="outstanding"
        />
      </section>

      <section data-analytics-operations style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={sectionHeadingStyle}>{copy.workspaceOperations}</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
          }}
        >
          <MetricCard label={copy.sites} value={analytics.operations.siteCount} metric="operation-sites" />
          <MetricCard label={copy.members} value={analytics.operations.memberCount} metric="operation-members" />
          <MetricCard
            label={copy.sharedAssets}
            value={analytics.operations.sharedAssetCount}
            metric="operation-assets"
          />
          <MetricCard
            label={copy.assetStorage}
            value={formatBytes(analytics.operations.sharedAssetBytes)}
            metric="operation-asset-storage"
          />
          <MetricCard
            label={copy.cmsCollectionsMetric}
            value={analytics.operations.cmsCollectionCount}
            metric="operation-cms-collections"
          />
          <MetricCard
            label={copy.cmsRecords}
            value={analytics.operations.cmsRecordCount}
            metric="operation-cms-records"
          />
        </div>
      </section>

      <section data-analytics-sites style={{ ...cardStyle, padding: 0 }}>
        <header style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={sectionHeadingStyle}>{copy.perSiteBreakdown}</h2>
        </header>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {analytics.sites.map((site) => (
            <li
              key={site.siteId}
              data-analytics-site={site.siteId}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px 12px',
                padding: '12px 18px',
                borderTop: '1px solid #f1f5f9',
                fontSize: 13,
                color: '#0f172a',
              }}
            >
              <span>
                <strong>{site.siteName}</strong>
                <span style={{ color: '#64748b', marginLeft: 6 }}>{site.siteId}</span>
              </span>
              <span style={{ color: '#475569', textAlign: 'right' }}>
                {site.orderCount} {copy.orderCountSuffix} · {site.bookingCount} {copy.bookingCountSuffix} ·{' '}
                {site.cmsCollectionCount} {copy.collectionCountSuffix} · {site.cmsRecordCount}{' '}
                {copy.recordCountSuffix}
              </span>
            </li>
          ))}
          {analytics.sites.length === 0 ? (
            <li style={{ padding: '12px 18px', color: '#64748b', fontSize: 13 }}>
              {copy.noSites}
            </li>
          ) : null}
        </ul>
      </section>

      <section data-analytics-collections style={{ ...cardStyle, padding: 0 }}>
        <header style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={sectionHeadingStyle}>{copy.cmsCollections}</h2>
        </header>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {collections.length === 0 ? (
            <li style={{ padding: '12px 18px', color: '#64748b', fontSize: 13 }}>
              {copy.noCollections}
            </li>
          ) : null}
          {collections.map((collection) => (
            <Fragment key={collection.collectionId}>
              <li
                data-analytics-collection={collection.collectionId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  borderTop: '1px solid #f1f5f9',
                  fontSize: 13,
                  color: '#0f172a',
                }}
              >
                <span>
                  <strong>{collection.name}</strong>
                  <span style={{ color: '#64748b', marginLeft: 6 }}>{collection.collectionId}</span>
                  {collection.bindableTargets.length > 0 ? (
                    <span style={{ color: '#475569', marginLeft: 6 }}>
                      · {collection.bindableTargets.length}{' '}
                      {collection.bindableTargets.length === 1 ? copy.bindableTarget : copy.bindableTargets}
                    </span>
                  ) : null}
                </span>
                <span style={{ color: '#475569', textAlign: 'right' }}>
                  {collection.recordCount} {copy.recordCountSuffix} · {collection.sites.length} {copy.siteCountSuffix}
                </span>
              </li>
              {collection.bindableTargets.length > 0 ? (
                <li
                  style={{
                    borderTop: '1px solid #f8fafc',
                    padding: '0 18px 12px',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {collection.bindableTargets.map((target) => (
                      <span
                        key={target.targetId}
                        style={{
                          border: '1px solid #dbeafe',
                          borderRadius: 999,
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 0,
                          padding: '3px 7px',
                        }}
                      >
                        {target.title}
                      </span>
                    ))}
                  </div>
                </li>
              ) : null}
            </Fragment>
          ))}
        </ul>
      </section>
    </div>
  );
}
