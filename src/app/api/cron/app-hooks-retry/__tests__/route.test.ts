import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runDueStoredAppHookRetries } from '@/lib/builder/apps/hook-retry-drain';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';

vi.mock('@/lib/builder/security/cron-auth', () => ({
  isCronAuthorized: vi.fn(() => false),
}));

vi.mock('@/lib/builder/apps/hook-retry-drain', () => ({
  runDueStoredAppHookRetries: vi.fn(async () => ({
    failedTotal: 0,
    retried: 0,
    skipped: 0,
    gaveUp: 0,
    unavailable: 0,
  })),
}));

function cronRequest(url = 'https://law.example.test/api/cron/app-hooks-retry'): NextRequest {
  return new NextRequest(url, { method: 'POST' });
}

describe('/api/cron/app-hooks-retry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when the request is not cron authorized', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(false);
    const route = await import('../route');
    const response = await route.POST(cronRequest());

    expect(response.status).toBe(401);
    expect(runDueStoredAppHookRetries).not.toHaveBeenCalled();
  });

  it('runs due stored hook retries on authorized cron POST', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(true);
    vi.mocked(runDueStoredAppHookRetries).mockResolvedValue({
      failedTotal: 4,
      retried: 2,
      skipped: 1,
      gaveUp: 1,
      unavailable: 0,
    });
    const route = await import('../route');
    const response = await route.POST(cronRequest('https://law.example.test/api/cron/app-hooks-retry?limit=7'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      failedTotal: 4,
      retried: 2,
      skipped: 1,
      gaveUp: 1,
      unavailable: 0,
    });
    expect(runDueStoredAppHookRetries).toHaveBeenCalledWith({ limit: 7 });
  });

  it('GET method shares the same authorization gate', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(false);
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/cron/app-hooks-retry'),
    );

    expect(response.status).toBe(401);
    expect(runDueStoredAppHookRetries).not.toHaveBeenCalled();
  });
});
