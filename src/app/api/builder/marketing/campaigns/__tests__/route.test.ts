import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  listCampaigns,
  saveCampaign,
} from '@/lib/builder/marketing/campaign-storage';
import type { Campaign } from '@/lib/builder/marketing/campaign-types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/marketing/campaign-storage', () => ({
  listCampaigns: vi.fn(async () => []),
  saveCampaign: vi.fn(async () => undefined),
  makeCampaignId: vi.fn(() => 'cmp-new-1'),
}));

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    campaignId: 'cmp-1',
    name: '5월 뉴스레터',
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

function request(method: 'GET' | 'POST', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/marketing/campaigns${query ? `?${query}` : ''}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/marketing/campaigns', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/marketing/campaigns', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
  });

  it('GET returns the campaign list with total', async () => {
    vi.mocked(listCampaigns).mockResolvedValue([makeCampaign(), makeCampaign({ campaignId: 'cmp-2' })]);
    const route = await import('../route');
    const response = await route.GET(
      request('GET', 'locale=en'),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.total).toBe(2);
    expect(payload.campaigns).toHaveLength(2);
  });

  it('GET returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(listCampaigns).mockRejectedValueOnce(new Error('campaign list secret leaked'));
    const route = await import('../route');
    const response = await route.GET(request('GET', 'locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '無法載入活動清單。',
      errorCode: 'campaigns_list_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('campaign list secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/marketing/campaigns] list failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('POST creates a draft campaign with empty stats and 201 status', async () => {
    const route = await import('../route');
    const response = await route.POST(
      postRequest({
        name: 'June digest',
        subject: { ko: '6월', 'zh-hant': '6月', en: 'June' },
        bodyHtml: { ko: '<p>안녕</p>', 'zh-hant': '<p>哈</p>', en: '<p>Hi</p>' },
        bodyText: { ko: '안녕', 'zh-hant': '哈', en: 'Hi' },
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.campaign.campaignId).toBe('cmp-new-1');
    expect(payload.campaign.status).toBe('draft');
    expect(saveCampaign).toHaveBeenCalledTimes(1);
  });

  it('POST sets status=scheduled when scheduledAt is provided', async () => {
    const route = await import('../route');
    const response = await route.POST(
      postRequest({
        name: 'Future digest',
        subject: { ko: '미래', 'zh-hant': '未來', en: 'Future' },
        bodyHtml: { ko: '<p>x</p>', 'zh-hant': '<p>x</p>', en: '<p>x</p>' },
        bodyText: { ko: 'x', 'zh-hant': 'x', en: 'x' },
        scheduledAt: '2026-06-01T09:00:00Z',
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.campaign.status).toBe('scheduled');
    expect(payload.campaign.scheduledAt).toBe('2026-06-01T09:00:00Z');
  });

  it('POST rejects empty name with 400', async () => {
    const route = await import('../route');
    const response = await route.POST(
      request('POST', 'locale=zh-hant', {
        name: '   ',
        subject: { ko: 'a', 'zh-hant': 'a', en: 'a' },
        bodyHtml: { ko: 'a', 'zh-hant': 'a', en: 'a' },
        bodyText: { ko: 'a', 'zh-hant': 'a', en: 'a' },
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認活動資料。',
      errorCode: 'invalid_campaign_payload',
    });
    expect(saveCampaign).not.toHaveBeenCalled();
  });

  it('POST returns localized invalid JSON errors', async () => {
    const route = await import('../route');
    const response = await route.POST(request('POST', 'locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the marketing request format.',
      errorCode: 'invalid_json',
    });
    expect(saveCampaign).not.toHaveBeenCalled();
  });

  it('POST returns localized create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(saveCampaign).mockRejectedValueOnce(new Error('campaign create secret leaked'));
    const route = await import('../route');
    const response = await route.POST(
      request('POST', 'locale=en', {
        name: 'June digest',
        subject: { ko: '6월', 'zh-hant': '6月', en: 'June' },
        bodyHtml: { ko: '<p>안녕</p>', 'zh-hant': '<p>哈</p>', en: '<p>Hi</p>' },
        bodyText: { ko: '안녕', 'zh-hant': '哈', en: 'Hi' },
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to create the campaign.',
      errorCode: 'campaign_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('campaign create secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/marketing/campaigns] create failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('POST refuses anonymous callers (guardMutation deny)', async () => {
    vi.mocked(guardMutation).mockResolvedValue(
      NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    );
    const route = await import('../route');
    const response = await route.POST(postRequest({ name: 'x' }));

    expect(response.status).toBe(401);
    expect(saveCampaign).not.toHaveBeenCalled();
  });
});
