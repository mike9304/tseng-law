import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import { runDueCmsDynamicItemScheduledPolicies } from '@/lib/builder/cms-dynamic-item-scheduled-policy';

vi.mock('@/lib/builder/security/cron-auth', () => ({
  isCronAuthorized: vi.fn(() => false),
}));

vi.mock('@/lib/builder/cms-dynamic-item-scheduled-policy', () => ({
  runDueCmsDynamicItemScheduledPolicies: vi.fn(async () => ({
    checked: 0,
    due: 0,
    applied: 0,
    failed: 0,
    skipped: 0,
    jobs: [],
  })),
}));

function cronRequest(
  url: string = 'https://law.example.test/api/cron/cms-dynamic-item-lifecycle-policies',
): NextRequest {
  return new NextRequest(url, { method: 'POST' });
}

describe('/api/cron/cms-dynamic-item-lifecycle-policies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when the request is not cron authorized', async () => {
    // Given: the cron request is not authorized.
    vi.mocked(isCronAuthorized).mockReturnValue(false);

    // When: the route is invoked.
    const route = await import('../route');
    const response = await route.POST(cronRequest());

    // Then: no scheduled CMS lifecycle policies run.
    expect(response.status).toBe(401);
    expect(runDueCmsDynamicItemScheduledPolicies).not.toHaveBeenCalled();
  });

  it('runs due scheduled CMS lifecycle policies on authorized cron POST', async () => {
    // Given: due CMS lifecycle jobs exist and the cron request is authorized.
    vi.mocked(isCronAuthorized).mockReturnValue(true);
    vi.mocked(runDueCmsDynamicItemScheduledPolicies).mockResolvedValue({
      checked: 2,
      due: 1,
      applied: 1,
      failed: 0,
      skipped: 1,
      jobs: [],
    });

    // When: cron runs with a limit.
    const route = await import('../route');
    const response = await route.POST(
      cronRequest('https://law.example.test/api/cron/cms-dynamic-item-lifecycle-policies?limit=5'),
    );
    const payload = await response.json();

    // Then: the runner receives the parsed limit and exposes its summary.
    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.checked).toBe(2);
    expect(payload.due).toBe(1);
    expect(payload.applied).toBe(1);
    expect(payload.failed).toBe(0);
    expect(payload.skipped).toBe(1);
    expect(runDueCmsDynamicItemScheduledPolicies).toHaveBeenCalledWith({ limit: 5 });
  });
});
