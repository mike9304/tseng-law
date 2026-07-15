import { describe, expect, it } from 'vitest';
import { campaignAnalyticsStatsPayloadSchema } from '../campaign-analytics-payload';

/**
 * The stats route (`/api/builder/marketing/campaigns/:id/stats`) emits
 * campaign.status verbatim, and CampaignAnalyticsPanel validates the response
 * with campaignAnalyticsStatsPayloadSchema.safeParse. The dispatcher can mark a
 * campaign 'partial', so the schema enum must accept every legitimate campaign
 * status or a truthful partial campaign falls into the client error state.
 *
 * These tests exercise the actual exported schema (not a redeclared enum), so
 * dropping any status from campaignStatusSchema fails the matching case here.
 */

const VALID_STATUSES = ['draft', 'scheduled', 'sending', 'sent', 'failed', 'partial'] as const;

function basePayload(status: string, sentAt?: string) {
  return {
    ok: true as const,
    campaign: {
      campaignId: 'cmp-1',
      name: 'Spring update',
      status,
      ...(sentAt !== undefined ? { sentAt } : {}),
    },
    stats: { recipients: 4, opens: 2, clicks: 1, unsubscribes: 0, bounces: 0 },
    rates: { open: 0.5, click: 0.25, unsubscribe: 0 },
    pending: 1,
    recipientBreakdown: {
      pending: 1,
      sent: 1,
      failed: 0,
      bounced: 0,
      opened: 1,
      clicked: 1,
      unsubscribed: 0,
    },
    recentEvents: [
      {
        kind: 'clicked',
        occurredAt: '2026-06-18T02:00:00.000Z',
        subscriberId: 'sub-clicked',
        email: 'clicked@example.test',
      },
    ],
    funnel: [
      { key: 'recipients', count: 4, rate: 1 },
      { key: 'opens', count: 2, rate: 0.5 },
      { key: 'clicks', count: 1, rate: 0.25 },
      { key: 'unsubscribes', count: 0, rate: 0 },
      { key: 'bounces', count: 0, rate: 0 },
    ],
  };
}

describe('campaignAnalyticsStatsPayloadSchema — campaign status contract', () => {
  it.each(VALID_STATUSES)('accepts the legitimate campaign status "%s"', (status) => {
    const parsed = campaignAnalyticsStatsPayloadSchema.safeParse(basePayload(status));
    expect(parsed.success).toBe(true);
  });

  it('rejects an unknown campaign status', () => {
    const parsed = campaignAnalyticsStatsPayloadSchema.safeParse(basePayload('archived'));
    expect(parsed.success).toBe(false);
  });

  it('keeps sentAt optional so draft/scheduled campaigns still parse', () => {
    const parsed = campaignAnalyticsStatsPayloadSchema.safeParse(basePayload('draft'));
    expect(parsed.success).toBe(true);
  });

  it('accepts a payload that includes sentAt for sent/partial campaigns', () => {
    const parsed = campaignAnalyticsStatsPayloadSchema.safeParse(
      basePayload('partial', '2026-06-18T00:00:00.000Z'),
    );
    expect(parsed.success).toBe(true);
  });

  it('rejects a payload missing required top-level fields', () => {
    const parsed = campaignAnalyticsStatsPayloadSchema.safeParse({ ok: true });
    expect(parsed.success).toBe(false);
  });
});
