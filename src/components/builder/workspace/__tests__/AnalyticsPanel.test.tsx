import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import AnalyticsPanel from '@/components/builder/workspace/AnalyticsPanel';
import { buildPaymentAnalytics } from '@/lib/builder/payment-analytics';
import type { WorkspaceAnalyticsRollup } from '@/lib/builder/workspace/analytics-aggregate';
import type { AccountCollectionSummary } from '@/lib/builder/workspace/shared-cms';
import { getWorkspaceCopy } from '@/lib/builder/workspace/workspace-copy';

const generatedAt = '2026-06-22T00:00:00.000Z';

function analyticsRollup(): WorkspaceAnalyticsRollup {
  const payment = buildPaymentAnalytics({
    orders: [],
    bookings: [],
    services: [],
    now: generatedAt,
  });

  return {
    generatedAt,
    totalOrders: 0,
    totalBookings: 0,
    totalGrossCollectedCents: 0,
    totalOutstandingCents: 0,
    primaryCurrency: 'TWD',
    operations: {
      siteCount: 2,
      memberCount: 3,
      sharedAssetCount: 4,
      sharedAssetBytes: 1536,
      cmsCollectionCount: 5,
      cmsRecordCount: 6,
      latestCmsUpdatedAt: '2026-06-21T06:00:00.000Z',
      latestSharedAssetUploadedAt: '2026-06-21T07:00:00.000Z',
    },
    sites: [
      {
        siteId: 'site-a',
        siteName: 'Site A',
        payment,
        orderCount: 0,
        bookingCount: 0,
        cmsCollectionCount: 2,
        cmsRecordCount: 3,
        latestCmsUpdatedAt: '2026-06-21T06:00:00.000Z',
      },
    ],
  };
}

function collections(): AccountCollectionSummary[] {
  return [
    {
      collectionId: 'columns',
      name: 'Columns',
      recordCount: 6,
      lastUpdatedAt: '2026-06-21T06:00:00.000Z',
      sites: ['site-a'],
      bindableTargets: [],
    },
  ];
}

describe('AnalyticsPanel', () => {
  it('renders operational workspace metrics in the analytics tab', () => {
    const html = renderToStaticMarkup(
      <AnalyticsPanel
        copy={getWorkspaceCopy('en').analytics}
        analytics={analyticsRollup()}
        collections={collections()}
      />,
    );

    expect(html).toContain('data-analytics-operations="true"');
    expect(html).toContain('Workspace operations');
    expect(html).toContain('Shared asset storage');
    expect(html).toContain('1.5 KB');
    expect(html).toContain('2 collections · 3 records');
    expect(html).toContain('Columns');
  });
});
