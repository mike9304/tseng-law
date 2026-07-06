import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import { buildTranslationDashboard } from '@/lib/builder/translations/dashboard-model';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => ({ username: 'translator@example.test' })),
}));

vi.mock('@/lib/builder/translations/dashboard-model', () => ({
  buildTranslationDashboard: vi.fn(),
}));

const guardBuilderReadMock = vi.mocked(guardBuilderRead);
const buildTranslationDashboardMock = vi.mocked(buildTranslationDashboard);

const dashboardPayload = {
  ok: true,
  siteId: 'site-a',
  sourceLocale: 'ko',
  targetLocales: ['zh-hant', 'en'],
  rows: [],
  syncedAt: '2026-06-03T00:00:00.000Z',
};

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/translations/dashboard${query ? `?${query}` : ''}`);
}

describe('builder translations dashboard API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadMock.mockReturnValue({ username: 'translator@example.test' } as never);
    buildTranslationDashboardMock.mockResolvedValue(dashboardPayload as never);
  });

  it('returns dashboard payloads while preserving GET success response shape', async () => {
    const response = await GET(request('siteId=site-a&sourceLocale=ko'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(buildTranslationDashboardMock).toHaveBeenCalledWith('site-a', 'ko');
    expect(data).toEqual(dashboardPayload);
  });

  it('returns localized dashboard failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    buildTranslationDashboardMock.mockRejectedValueOnce(new Error('dashboard secret leaked'));

    const response = await GET(request('locale=zh-hant&sourceLocale=ko'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法載入翻譯儀表板。',
      errorCode: 'translation_dashboard_failed',
    });
    expect(JSON.stringify(data)).not.toContain('dashboard secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/translations/dashboard] load failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
