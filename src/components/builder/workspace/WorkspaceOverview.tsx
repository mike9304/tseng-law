'use client';

import type { BuilderAccount } from '@/lib/builder/workspace/account-model';
import type { WorkspaceAnalyticsRollup } from '@/lib/builder/workspace/analytics-aggregate';

interface WorkspaceOverviewProps {
  account: BuilderAccount;
  siteCount: number;
  memberCount: number;
  sharedAssetCount: number;
  collectionCount: number;
  analytics: WorkspaceAnalyticsRollup | null;
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: '16px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

const valueStyle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 600,
  color: '#0f172a',
};

function formatMoney(cents: number, currency: string): string {
  const value = cents / 100;
  return value.toLocaleString(undefined, { style: 'currency', currency: currency || 'TWD' });
}

export default function WorkspaceOverview({
  account,
  siteCount,
  memberCount,
  sharedAssetCount,
  collectionCount,
  analytics,
}: WorkspaceOverviewProps) {
  return (
    <div data-workspace-overview style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        <article style={cardStyle} data-overview-card="sites">
          <span style={labelStyle}>Sites</span>
          <span style={valueStyle}>{siteCount}</span>
        </article>
        <article style={cardStyle} data-overview-card="members">
          <span style={labelStyle}>Members</span>
          <span style={valueStyle}>{memberCount}</span>
        </article>
        <article style={cardStyle} data-overview-card="shared-assets">
          <span style={labelStyle}>Shared assets</span>
          <span style={valueStyle}>{sharedAssetCount}</span>
        </article>
        <article style={cardStyle} data-overview-card="collections">
          <span style={labelStyle}>CMS collections</span>
          <span style={valueStyle}>{collectionCount}</span>
        </article>
      </div>

      {analytics ? (
        <section
          data-overview-kpis
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}
        >
          <article style={cardStyle} data-overview-kpi="orders">
            <span style={labelStyle}>Orders</span>
            <span style={valueStyle}>{analytics.totalOrders}</span>
          </article>
          <article style={cardStyle} data-overview-kpi="bookings">
            <span style={labelStyle}>Bookings</span>
            <span style={valueStyle}>{analytics.totalBookings}</span>
          </article>
          <article style={cardStyle} data-overview-kpi="gross">
            <span style={labelStyle}>Gross collected</span>
            <span style={valueStyle}>
              {formatMoney(analytics.totalGrossCollectedCents, analytics.primaryCurrency)}
            </span>
          </article>
          <article style={cardStyle} data-overview-kpi="outstanding">
            <span style={labelStyle}>Outstanding</span>
            <span style={valueStyle}>
              {formatMoney(analytics.totalOutstandingCents, analytics.primaryCurrency)}
            </span>
          </article>
        </section>
      ) : null}

      <article style={{ ...cardStyle, gap: 4 }} data-overview-meta>
        <span style={labelStyle}>Account</span>
        <strong style={{ fontSize: 15, color: '#0f172a' }}>{account.name}</strong>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          Created {new Date(account.createdAt).toLocaleDateString()} · Updated{' '}
          {new Date(account.updatedAt).toLocaleDateString()}
        </span>
      </article>
    </div>
  );
}