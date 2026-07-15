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
  sendCampaignBatch: vi.fn(async () => ({
    ok: true,
    attempted: 50,
    succeeded: 48,
    failed: 2,
    remaining: 0,
    errors: [],
  })),
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

function postRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/marketing/campaigns/cmp-1/send${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
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
    const response = await route.POST(postRequest({ testEmail: 'me@example.test' }, 'locale=en'), {
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
    const response = await route.POST(postRequest({ batchSize: 25 }, 'locale=en'), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.mode).toBe('batch');
    expect(sendCampaignBatch).toHaveBeenCalledWith({
      campaignId: 'cmp-1',
      batchSize: 25,
      resetFailed: true,
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
    const response = await route.POST(postRequest({ testEmail: 'not-an-email' }, 'locale=zh-hant'), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認活動發送請求。',
      errorCode: 'invalid_send_payload',
    });
    expect(sendTestEmail).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    const route = await import('../route');
    const response = await route.POST(postRequest('{', 'locale=en'), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the marketing request format.',
      errorCode: 'invalid_json',
    });
    expect(sendTestEmail).not.toHaveBeenCalled();
  });

  it('localizes failed test-send results without leaking provider details', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    vi.mocked(sendTestEmail).mockResolvedValueOnce({ ok: false, error: 'provider secret leaked' });
    const route = await import('../route');
    const response = await route.POST(postRequest({ testEmail: 'me@example.test' }, 'locale=en'), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: false,
      mode: 'test',
      error: 'Unable to send the test email.',
      errorCode: 'campaign_test_send_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('provider secret leaked');
  });

  it('localizes batch result errors without leaking dispatcher details', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    vi.mocked(sendCampaignBatch).mockResolvedValueOnce({
      ok: false,
      attempted: 1,
      succeeded: 0,
      failed: 1,
      remaining: 0,
      errors: [{ email: 'lead@example.test', error: 'batch secret leaked' }],
    });
    const route = await import('../route');
    const response = await route.POST(postRequest({ batchSize: 1 }, 'locale=zh-hant'), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      mode: 'batch',
      ok: false,
      error: '無法完成活動發送。',
      errorCode: 'campaign_batch_send_failed',
      errors: [
        {
          email: 'lead@example.test',
          error: '無法完成活動發送。',
          errorCode: 'campaign_batch_send_failed',
        },
      ],
    });
    // Honest counts are preserved alongside the localized failure detail.
    expect(payload.succeeded).toBe(0);
    expect(payload.failed).toBe(1);
    expect(payload.remaining).toBe(0);
    expect(JSON.stringify(payload)).not.toContain('batch secret leaked');
  });

  it('preserves honest partial-delivery counts when the dispatcher reports mixed results', async () => {
    vi.mocked(getCampaign).mockResolvedValue(makeCampaign());
    vi.mocked(sendCampaignBatch).mockResolvedValueOnce({
      ok: false,
      attempted: 3,
      succeeded: 2,
      failed: 1,
      remaining: 0,
      errors: [{ email: 'c@example.test', error: 'provider down' }],
    });
    const route = await import('../route');
    const response = await route.POST(postRequest({ batchSize: 3 }, 'locale=en'), {
      params: { campaignId: 'cmp-1' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      mode: 'batch',
      ok: false,
      errorCode: 'campaign_batch_send_failed',
    });
    expect(payload.succeeded).toBe(2);
    expect(payload.failed).toBe(1);
    expect(payload.remaining).toBe(0);
    expect(sendCampaignBatch).toHaveBeenCalledWith({
      campaignId: 'cmp-1',
      batchSize: 3,
      resetFailed: true,
    });
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
