import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import { runDueScheduledPublishes } from '@/lib/builder/site/scheduled-publish';

vi.mock('@/lib/builder/security/cron-auth', () => ({
  isCronAuthorized: vi.fn(() => false),
}));

vi.mock('@/lib/builder/site/scheduled-publish', () => ({
  runDueScheduledPublishes: vi.fn(async () => ({
    checked: 0,
    due: 0,
    published: 0,
    failed: 0,
    skipped: 0,
    jobs: [],
  })),
}));

function cronRequest(url: string = 'https://law.example.test/api/cron/scheduled-publish'): NextRequest {
  return new NextRequest(url, { method: 'POST' });
}

describe('/api/cron/scheduled-publish', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when the request is not cron authorized', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(false);
    const route = await import('../route');
    const response = await route.POST(cronRequest());

    expect(response.status).toBe(401);
    expect(runDueScheduledPublishes).not.toHaveBeenCalled();
  });

  it('runs due scheduled publishes on authorized cron POST', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(true);
    vi.mocked(runDueScheduledPublishes).mockResolvedValue({
      checked: 3,
      due: 2,
      published: 1,
      failed: 0,
      skipped: 1,
      jobs: [{ status: 'published', publishedRevision: 12, publishedRevisionId: 'rev-12' }],
    } as unknown as Awaited<ReturnType<typeof runDueScheduledPublishes>>);
    const route = await import('../route');
    const response = await route.POST(cronRequest('https://law.example.test/api/cron/scheduled-publish?limit=5'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.checked).toBe(3);
    expect(payload.due).toBe(2);
    expect(payload.published).toBe(1);
    expect(payload.failed).toBe(0);
    expect(payload.skipped).toBe(1);
    expect(runDueScheduledPublishes).toHaveBeenCalledWith({ limit: 5 });
  });

  it('GET method shares the same authorization gate', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(false);
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/cron/scheduled-publish'),
    );

    expect(response.status).toBe(401);
    expect(runDueScheduledPublishes).not.toHaveBeenCalled();
  });
});
