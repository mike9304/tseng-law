import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import { runScheduledTranslationProviderSmoke } from '@/lib/builder/translations/providers/scheduled-smoke';

vi.mock('@/lib/builder/security/cron-auth', () => ({
  isCronAuthorized: vi.fn(() => false),
}));

vi.mock('@/lib/builder/translations/providers/scheduled-smoke', () => ({
  runScheduledTranslationProviderSmoke: vi.fn(async () => ({
    checked: 0,
    passed: 0,
    failed: 0,
    unconfigured: 0,
    results: [],
  })),
}));

function cronRequest(url = 'https://law.example.test/api/cron/translation-provider-smoke'): NextRequest {
  return new NextRequest(url, { method: 'POST' });
}

describe('/api/cron/translation-provider-smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when the request is not cron authorized', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(false);
    const route = await import('../route');
    const response = await route.POST(cronRequest());

    expect(response.status).toBe(401);
    expect(runScheduledTranslationProviderSmoke).not.toHaveBeenCalled();
  });

  it('runs all-provider translation smoke checks on authorized cron POST', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(true);
    vi.mocked(runScheduledTranslationProviderSmoke).mockResolvedValue({
      checked: 2,
      passed: 1,
      failed: 0,
      unconfigured: 1,
      results: [
        {
          checkedAt: '2026-06-20T11:00:00.000Z',
          ok: true,
          provider: 'openai',
          status: 'pass',
          sourceLocale: 'ko',
          targetLocale: 'en',
          durationMs: 42,
          translatedTextPreview: 'Provider smoke check',
        },
        {
          checkedAt: '2026-06-20T11:00:01.000Z',
          ok: false,
          provider: 'deepl',
          status: 'unconfigured',
          sourceLocale: 'ko',
          targetLocale: 'en',
          durationMs: 0,
          reason: 'unconfigured',
        },
      ],
    });

    const route = await import('../route');
    const response = await route.POST(
      cronRequest('https://law.example.test/api/cron/translation-provider-smoke?sourceLocale=ko&targetLocale=en'),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.checked).toBe(2);
    expect(payload.passed).toBe(1);
    expect(payload.unconfigured).toBe(1);
    expect(payload.results).toHaveLength(2);
    expect(runScheduledTranslationProviderSmoke).toHaveBeenCalledWith({
      sourceLocale: 'ko',
      targetLocale: 'en',
      sourceText: '호정국제 번역 제공자 정기 점검',
    });
  });

  it('GET method shares the same authorization gate', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(false);
    const route = await import('../route');
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/cron/translation-provider-smoke'),
    );

    expect(response.status).toBe(401);
    expect(runScheduledTranslationProviderSmoke).not.toHaveBeenCalled();
  });
});
