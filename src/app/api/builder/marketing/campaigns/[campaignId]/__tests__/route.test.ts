import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getCampaign,
  saveCampaign,
} from '@/lib/builder/marketing/campaign-storage';
import type { Campaign } from '@/lib/builder/marketing/campaign-types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/marketing/campaign-storage', () => ({
  getCampaign: vi.fn(),
  saveCampaign: vi.fn(async () => undefined),
}));

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    campaignId: 'cmp-1',
    name: 'Draft campaign',
    subject: { ko: '안녕', 'zh-hant': '安', en: 'Hi' },
    bodyHtml: { ko: '<p>본문</p>', 'zh-hant': '<p>本</p>', en: '<p>Body</p>' },
    bodyText: { ko: '본문', 'zh-hant': '本', en: 'Body' },
    segmentTags: [],
    fromName: '호정국제',
    fromAddress: 'bookings@hoveringlaw.com.tw',
    status: 'draft',
    stats: { recipients: 0, opens: 0, clicks: 0, unsubscribes: 0, bounces: 0 },
    createdAt: '2026-05-13T00:00:00Z',
    updatedAt: '2026-05-13T00:00:00Z',
    ...overrides,
  };
}

function patchRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/marketing/campaigns/cmp-1', {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/marketing/campaigns/[campaignId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
  });

  it('GET returns the campaign on happy path', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/marketing/campaigns/cmp-1'),
      { params: { campaignId: 'cmp-1' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.campaign.campaignId).toBe('cmp-1');
  });

  it('GET returns 404 when campaign is missing', async () => {
    vi.mocked(getCampaign).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/marketing/campaigns/cmp-missing'),
      { params: { campaignId: 'cmp-missing' } },
    );
    expect(response.status).toBe(404);
  });

  it('PATCH renames a draft campaign', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ name: 'Renamed' }), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.campaign.name).toBe('Renamed');
    expect(saveCampaign).toHaveBeenCalledTimes(1);
  });

  it('PATCH refuses editing a campaign already in flight (409)', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign({ status: 'sending' }));
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ name: 'Renamed' }), {
      params: { campaignId: 'cmp-1' },
    });

    expect(response.status).toBe(409);
    expect(saveCampaign).not.toHaveBeenCalled();
  });

  it('PATCH refuses editing a sent campaign (409)', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign({ status: 'sent' }));
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ name: 'Renamed' }), {
      params: { campaignId: 'cmp-1' },
    });

    expect(response.status).toBe(409);
    expect(saveCampaign).not.toHaveBeenCalled();
  });

  it('PATCH returns 404 when target campaign is missing', async () => {
    vi.mocked(getCampaign).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ name: 'x' }), {
      params: { campaignId: 'cmp-missing' },
    });
    expect(response.status).toBe(404);
  });

  it('PATCH refuses anonymous callers (guardMutation deny)', async () => {
    vi.mocked(guardMutation).mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ name: 'x' }), {
      params: { campaignId: 'cmp-1' },
    });

    expect(response.status).toBe(401);
    expect(saveCampaign).not.toHaveBeenCalled();
  });
});
