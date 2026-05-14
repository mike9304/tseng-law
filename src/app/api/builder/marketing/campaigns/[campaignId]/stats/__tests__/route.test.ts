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
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
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

function recipient(status: CampaignRecipient['status']): CampaignRecipient {
  return {
    campaignId: 'cmp-1',
    subscriberId: 'sub-1',
    email: 'visitor@example.test',
    status,
    attempts: 1,
    trackingToken: 'trk-1',
  };
}

describe('/api/builder/marketing/campaigns/[campaignId]/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
  });

  it('returns aggregate stats and engagement rates on happy path', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    vi.mocked(listRecipientsForCampaign).mockResolvedValue([
      recipient('sent'),
      recipient('opened'),
      recipient('clicked'),
      recipient('pending'),
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
      new NextRequest('https://law.example.test/api/builder/marketing/campaigns/cmp-1/stats'),
      { params: { campaignId: 'cmp-1' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.stats.recipients).toBe(4);
    expect(payload.rates.open).toBe(0.5);
    expect(payload.rates.click).toBe(0.25);
    expect(payload.pending).toBe(1);
    expect(payload.campaign.campaignId).toBe('cmp-1');
  });

  it('returns 404 when campaign is missing', async () => {
    vi.mocked(getCampaign).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/marketing/campaigns/cmp-missing/stats'),
      { params: { campaignId: 'cmp-missing' } },
    );
    expect(response.status).toBe(404);
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
      { params: { campaignId: 'cmp-1' } },
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
      { params: { campaignId: 'cmp-1' } },
    );

    expect(response.status).toBe(401);
    expect(getCampaign).not.toHaveBeenCalled();
  });
});
