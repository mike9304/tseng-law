import { describe, expect, it } from 'vitest';
import { buildCampaignAnalyticsSummary } from '../campaign-analytics';
import type { CampaignRecipient } from '../campaign-types';

function recipient(overrides: Partial<CampaignRecipient>): CampaignRecipient {
  return {
    campaignId: 'camp_1',
    subscriberId: 'sub_1',
    email: 'lead@example.test',
    status: 'sent',
    attempts: 1,
    trackingToken: 'track_1',
    ...overrides,
  };
}

describe('buildCampaignAnalyticsSummary', () => {
  it('summarizes recipient status counts and latest attribution events', () => {
    const summary = buildCampaignAnalyticsSummary([
      recipient({
        subscriberId: 'sub_1',
        email: 'clicked@example.test',
        status: 'clicked',
        sentAt: '2026-06-18T00:00:00.000Z',
        openedAt: '2026-06-18T01:00:00.000Z',
        clickedAt: '2026-06-18T02:00:00.000Z',
      }),
      recipient({
        subscriberId: 'sub_2',
        email: 'failed@example.test',
        status: 'failed',
        lastError: 'provider rejected',
      }),
      recipient({
        subscriberId: 'sub_3',
        email: 'unsub@example.test',
        status: 'unsubscribed',
        sentAt: '2026-06-18T00:05:00.000Z',
        unsubscribedAt: '2026-06-18T03:00:00.000Z',
      }),
    ]);

    expect(summary.recipientBreakdown).toMatchObject({
      clicked: 1,
      failed: 1,
      unsubscribed: 1,
    });
    expect(summary.recentEvents.slice(0, 3)).toEqual([
      {
        kind: 'unsubscribed',
        occurredAt: '2026-06-18T03:00:00.000Z',
        subscriberId: 'sub_3',
        email: 'unsub@example.test',
      },
      {
        kind: 'clicked',
        occurredAt: '2026-06-18T02:00:00.000Z',
        subscriberId: 'sub_1',
        email: 'clicked@example.test',
      },
      {
        kind: 'opened',
        occurredAt: '2026-06-18T01:00:00.000Z',
        subscriberId: 'sub_1',
        email: 'clicked@example.test',
      },
    ]);
    expect(summary.funnel).toEqual([
      { key: 'recipients', count: 3, rate: 1 },
      { key: 'opens', count: 1, rate: 0.333 },
      { key: 'clicks', count: 1, rate: 0.333 },
      { key: 'unsubscribes', count: 1, rate: 0.333 },
      { key: 'bounces', count: 0, rate: 0 },
    ]);
  });
});
