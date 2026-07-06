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

function request(method: 'GET' | 'PATCH', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/marketing/campaigns/cmp-1${query ? `?${query}` : ''}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function patchRequest(body: unknown): NextRequest {
  return request('PATCH', '', body);
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
      request('GET', 'locale=en'),
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
      new NextRequest('https://law.example.test/api/builder/marketing/campaigns/cmp-missing?locale=zh-hant'),
      { params: { campaignId: 'cmp-missing' } },
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到活動。',
      errorCode: 'campaign_not_found',
    });
  });

  it('GET returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(getCampaign).mockRejectedValueOnce(new Error('campaign load secret leaked'));
    const route = await import('../route');
    const response = await route.GET(request('GET', 'locale=en'), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load the campaign.',
      errorCode: 'campaign_load_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('campaign load secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/marketing/campaigns/:id] load failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('PATCH renames a draft campaign', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    const route = await import('../route');
    const response = await route.PATCH(request('PATCH', 'locale=en', { name: 'Renamed' }), {
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
    const response = await route.PATCH(request('PATCH', 'locale=zh-hant', { name: 'Renamed' }), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: '發送中或已發送的活動無法修改。',
      errorCode: 'campaign_in_flight',
    });
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

  it('PATCH returns localized invalid JSON errors', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    const route = await import('../route');
    const response = await route.PATCH(request('PATCH', 'locale=en', '{'), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the marketing request format.',
      errorCode: 'invalid_json',
    });
    expect(saveCampaign).not.toHaveBeenCalled();
  });

  it('PATCH returns localized invalid update errors while preserving details', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    const route = await import('../route');
    const response = await route.PATCH(request('PATCH', 'locale=ko', { name: '' }), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '캠페인 업데이트 정보를 확인해 주세요.',
      errorCode: 'invalid_campaign_update',
    });
    expect(payload.details).toBeTruthy();
    expect(saveCampaign).not.toHaveBeenCalled();
  });

  it('PATCH returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    vi.mocked(saveCampaign).mockRejectedValueOnce(new Error('campaign update secret leaked'));
    const route = await import('../route');
    const response = await route.PATCH(request('PATCH', 'locale=en', { name: 'Renamed' }), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to update the campaign.',
      errorCode: 'campaign_update_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('campaign update secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/marketing/campaigns/:id] update failed:', expect.any(Error));
    consoleError.mockRestore();
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
