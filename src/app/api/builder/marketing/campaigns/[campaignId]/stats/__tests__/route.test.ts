import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  aggregateStats,
  getCampaign,
  listRecipientsForCampaign,
} from '@/lib/builder/marketing/campaign-storage';
import type { Campaign, CampaignRecipient } from '@/lib/builder/marketing/campaign-types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin-1' })),
}));

vi.mock('@/lib/builder/marketing/campaign-storage', () => ({
  getCampaign: vi.fn(),
  listRecipientsForCampaign: vi.fn(async () => []),
  aggregateStats: vi.fn(() => ({ recipients: 0, opens: 0, clicks: 0, unsubscribes: 0, bounces: 0 })),
}));

function makeCampaign(): Campaign {
  return {
    campaignId: 'cmp-1',
    name: 'Sent campaign',
    subject: { ko: '안녕', 'zh-hant': '安', en: 'Hi' },
    bodyHtml: { ko: '<p>x</p>', 'zh-hant': '<p>x</p>', en: '<p>x</p>' },
    bodyText: { ko: 'x', 'zh-hant': 'x', en: 'x' },
    segmentTags: [],
    fromName: '호정국제',
    fromAddress: 'bookings@hoveringlaw.com.tw',
    status: 'sent',
    sentAt: '2026-05-13T01:00:00Z',
    stats: { recipients: 100, opens: 60, clicks: 25, unsubscribes: 2, bounces: 1 },
    createdAt: '2026-05-13T00:00:00Z',
    updatedAt: '2026-05-13T01:00:00Z',
  };
}

function recipient(
  status: CampaignRecipient['status'],
  overrides: Partial<CampaignRecipient> = {},
): CampaignRecipient {
  return {
    campaignId: 'cmp-1',
    subscriberId: 'sub-1',
    email: 'visitor@example.test',
    status,
    attempts: 1,
    trackingToken: 'trk-1',
    ...overrides,
  };
}

describe('/api/builder/marketing/campaigns/[campaignId]/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ username: 'admin-1' });
  });

  it('returns aggregate stats and engagement rates on happy path', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    vi.mocked(listRecipientsForCampaign).mockResolvedValue([
      recipient('sent', {
        subscriberId: 'sub-sent',
        email: 'sent@example.test',
        sentAt: '2026-06-18T00:00:00.000Z',
      }),
      recipient('opened', {
        subscriberId: 'sub-opened',
        email: 'opened@example.test',
        sentAt: '2026-06-18T00:01:00.000Z',
        openedAt: '2026-06-18T01:00:00.000Z',
      }),
      recipient('clicked', {
        subscriberId: 'sub-clicked',
        email: 'clicked@example.test',
        sentAt: '2026-06-18T00:02:00.000Z',
        openedAt: '2026-06-18T01:30:00.000Z',
        clickedAt: '2026-06-18T02:00:00.000Z',
      }),
      recipient('pending', {
        subscriberId: 'sub-pending',
        email: 'pending@example.test',
      }),
    ]);
    vi.mocked(aggregateStats).mockReturnValue({
      recipients: 4,
      opens: 2,
      clicks: 1,
      unsubscribes: 0,
      bounces: 0,
    });
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/marketing/campaigns/cmp-1/stats?locale=en'),
      { params: Promise.resolve({ campaignId: 'cmp-1' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.stats.recipients).toBe(4);
    expect(payload.rates.open).toBe(0.5);
    expect(payload.rates.click).toBe(0.25);
    expect(payload.pending).toBe(1);
    expect(payload.campaign.campaignId).toBe('cmp-1');
    expect(payload.recipientBreakdown).toMatchObject({
      sent: 1,
      opened: 1,
      clicked: 1,
      pending: 1,
    });
    expect(payload.recentEvents.slice(0, 2)).toEqual([
      {
        kind: 'clicked',
        occurredAt: '2026-06-18T02:00:00.000Z',
        subscriberId: 'sub-clicked',
        email: 'clicked@example.test',
      },
      {
        kind: 'opened',
        occurredAt: '2026-06-18T01:30:00.000Z',
        subscriberId: 'sub-clicked',
        email: 'clicked@example.test',
      },
    ]);
    expect(payload.funnel).toEqual([
      { key: 'recipients', count: 4, rate: 1 },
      { key: 'opens', count: 2, rate: 0.5 },
      { key: 'clicks', count: 1, rate: 0.25 },
      { key: 'unsubscribes', count: 0, rate: 0 },
      { key: 'bounces', count: 0, rate: 0 },
    ]);
  });

  it('returns 404 when campaign is missing', async () => {
    vi.mocked(getCampaign).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/marketing/campaigns/cmp-missing/stats?locale=zh-hant'),
      { params: Promise.resolve({ campaignId: 'cmp-missing' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到活動。',
      errorCode: 'campaign_not_found',
    });
  });

  it('returns localized stats failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    vi.mocked(listRecipientsForCampaign).mockRejectedValueOnce(new Error('stats secret leaked'));
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/marketing/campaigns/cmp-1/stats?locale=en'),
      { params: Promise.resolve({ campaignId: 'cmp-1' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load campaign stats.',
      errorCode: 'campaign_stats_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('stats secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/marketing/campaigns/:id/stats] stats failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns zero rates when recipients are empty (no divide-by-zero)', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    vi.mocked(listRecipientsForCampaign).mockResolvedValue([]);
    vi.mocked(aggregateStats).mockReturnValue({
      recipients: 0,
      opens: 0,
      clicks: 0,
      unsubscribes: 0,
      bounces: 0,
    });
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/marketing/campaigns/cmp-1/stats'),
      { params: Promise.resolve({ campaignId: 'cmp-1' }) },
    );
    const payload = await response.json();

    expect(payload.rates.open).toBe(0);
    expect(payload.rates.click).toBe(0);
    expect(payload.rates.unsubscribe).toBe(0);
    expect(payload.pending).toBe(0);
  });

  it('refuses anonymous callers (guardMutation deny)', async () => {
    vi.mocked(guardMutation).mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/marketing/campaigns/cmp-1/stats'),
      { params: Promise.resolve({ campaignId: 'cmp-1' }) },
    );

    expect(response.status).toBe(401);
    expect(getCampaign).not.toHaveBeenCalled();
  });
});
