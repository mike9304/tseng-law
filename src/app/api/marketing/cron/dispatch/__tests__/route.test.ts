import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import { dispatchPendingCampaigns } from '@/lib/builder/marketing/dispatcher';

vi.mock('@/lib/builder/security/cron-auth', () => ({
  isCronAuthorized: vi.fn(() => false),
}));

vi.mock('@/lib/builder/marketing/dispatcher', () => ({
  dispatchPendingCampaigns: vi.fn(async () => ({ delivered: 0, failed: 0, skipped: 0 })),
}));

function cronRequest(): NextRequest {
  return new NextRequest('https://law.example.test/api/marketing/cron/dispatch', {
    method: 'POST',
  });
}

describe('/api/marketing/cron/dispatch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when the request is not Vercel-cron authorized', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(false);
    const route = await import('../route');
    const response = await route.POST(cronRequest());

    expect(response.status).toBe(401);
    expect(dispatchPendingCampaigns).not.toHaveBeenCalled();
  });

  it('dispatches pending campaigns on authorized cron POST', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(true);
    vi.mocked(dispatchPendingCampaigns).mockResolvedValue({
      delivered: 4,
      failed: 1,
      skipped: 0,
    } as unknown as Awaited<ReturnType<typeof dispatchPendingCampaigns>>);
    const route = await import('../route');
    const response = await route.POST(cronRequest());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.delivered).toBe(4);
    expect(payload.failed).toBe(1);
    expect(dispatchPendingCampaigns).toHaveBeenCalledWith(50);
  });

  it('GET method shares the same authorization gate', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(false);
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/marketing/cron/dispatch'),
    );

    expect(response.status).toBe(401);
    expect(dispatchPendingCampaigns).not.toHaveBeenCalled();
  });
});
