'use client';

import type { WorkspaceAnalyticsRollup } from '@/lib/builder/workspace/analytics-aggregate';
import type { AccountCollectionSummary } from '@/lib/builder/workspace/shared-cms';

interface AnalyticsPanelProps {
  analytics: WorkspaceAnalyticsRollup | null;
  collections: AccountCollectionSummary[];
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: '16px 18px',
};

function formatMoney(cents: number, currency: string): string {
  const value = cents / 100;
  return value.toLocaleString(undefined, { style: 'currency', currency: currency || 'TWD' });
}

export default function AnalyticsPanel({ analytics, collections }: AnalyticsPanelProps) {
  if (!analytics) {
    return (
      <p data-analytics-empty style={{ color: '#64748b', fontSize: 13 }}>
        Analytics rollup is unavailable right now.
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
        <article style={cardStyle} data-analytics-card="orders">
          <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Orders</p>
          <p style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 600 }}>{analytics.totalOrders}</p>
        </article>
        <article style={cardStyle} data-analytics-card="bookings">
          <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Bookings</p>
          <p style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 600 }}>{analytics.totalBookings}</p>
        </article>
        <article style={cardStyle} data-analytics-card="gross">
          <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Gross collected</p>
          <p style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 600 }}>
            {formatMoney(analytics.totalGrossCollectedCents, analytics.primaryCurrency)}
          </p>
        </article>
        <article style={cardStyle} data-analytics-card="outstanding">
          <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Outstanding</p>
          <p style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 600 }}>
            {formatMoney(analytics.totalOutstandingCents, analytics.primaryCurrency)}
          </p>
        </article>
      </section>

      <section data-analytics-sites style={{ ...cardStyle, padding: 0 }}>
        <header style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: 14, color: '#0f172a' }}>Per-site breakdown</h2>
        </header>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {analytics.sites.map((site) => (
            <li
              key={site.siteId}
              data-analytics-site={site.siteId}
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
                <strong>{site.siteName}</strong>
                <span style={{ color: '#64748b', marginLeft: 6 }}>{site.siteId}</span>
              </span>
              <span style={{ color: '#475569' }}>
                {site.orderCount} orders · {site.bookingCount} bookings
              </span>
            </li>
          ))}
          {analytics.sites.length === 0 ? (
            <li style={{ padding: '12px 18px', color: '#64748b', fontSize: 13 }}>
              No sites registered.
            </li>
          ) : null}
        </ul>
      </section>

      <section data-analytics-collections style={{ ...cardStyle, padding: 0 }}>
        <header style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: 14, color: '#0f172a' }}>CMS collections (read-only)</h2>
        </header>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {collections.length === 0 ? (
            <li style={{ padding: '12px 18px', color: '#64748b', fontSize: 13 }}>
              No collections aggregated.
            </li>
          ) : null}
          {collections.map((collection) => (
            <li
              key={collection.collectionId}
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
              </span>
              <span style={{ color: '#475569' }}>
                {collection.recordCount} records · {collection.sites.length} site(s)
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}