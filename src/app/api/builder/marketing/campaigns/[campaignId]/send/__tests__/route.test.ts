import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { getCampaign } from '@/lib/builder/marketing/campaign-storage';
import {
  sendCampaignBatch,
  sendTestEmail,
} from '@/lib/builder/marketing/dispatcher';
import type { Campaign } from '@/lib/builder/marketing/campaign-types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/marketing/campaign-storage', () => ({
  getCampaign: vi.fn(),
}));

vi.mock('@/lib/builder/marketing/subscriber-storage', () => ({
  getSubscriberByEmail: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/marketing/dispatcher', () => ({
  sendCampaignBatch: vi.fn(async () => ({ ok: true, attempted: 50, delivered: 48, failed: 2 })),
  sendTestEmail: vi.fn(async () => ({ ok: true })),
}));

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    campaignId: 'cmp-1',
    name: 'Test campaign',
    subject: { ko: '안녕', 'zh-hant': '安', en: 'Hi' },
    bodyHtml: { ko: '<p>x</p>', 'zh-hant': '<p>x</p>', en: '<p>x</p>' },
    bodyText: { ko: 'x', 'zh-hant': 'x', en: 'x' },
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

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/marketing/campaigns/cmp-1/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/marketing/campaigns/[campaignId]/send', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
  });

  it('routes to sendTestEmail when payload contains testEmail', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    const route = await import('../route');
    const response = await route.POST(postRequest({ testEmail: 'me@example.test' }), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.mode).toBe('test');
    expect(sendTestEmail).toHaveBeenCalledTimes(1);
    expect(sendCampaignBatch).not.toHaveBeenCalled();
  });

  it('runs a batch dispatch when no testEmail is provided', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    const route = await import('../route');
    const response = await route.POST(postRequest({ batchSize: 25 }), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.mode).toBe('batch');
    expect(sendCampaignBatch).toHaveBeenCalledWith({
      campaignId: 'cmp-1',
      batchSize: 25,
    });
    expect(sendTestEmail).not.toHaveBeenCalled();
  });

  it('returns 404 when the target campaign is missing', async () => {
    vi.mocked(getCampaign).mockResolvedValue(null);
    const route = await import('../route');
    const response = await route.POST(postRequest({}), {
      params: { campaignId: 'cmp-missing' },
    });

    expect(response.status).toBe(404);
    expect(sendCampaignBatch).not.toHaveBeenCalled();
  });

  it('returns 400 when testEmail is malformed', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    const route = await import('../route');
    const response = await route.POST(postRequest({ testEmail: 'not-an-email' }), {
      params: { campaignId: 'cmp-1' },
    });

    expect(response.status).toBe(400);
    expect(sendTestEmail).not.toHaveBeenCalled();
  });

  it('refuses anonymous callers (guardMutation deny)', async () => {
    vi.mocked(guardMutation).mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );
    const route = await import('../route');
    const response = await route.POST(postRequest({}), {
      params: { campaignId: 'cmp-1' },
    });

    expect(response.status).toBe(401);
    expect(sendCampaignBatch).not.toHaveBeenCalled();
  });
});
