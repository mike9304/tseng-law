import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { buildTranslationDashboard } from '@/lib/builder/translations/dashboard-model';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({ username: 'translator@example.test' })),
}));

vi.mock('@/lib/builder/translations/dashboard-model', () => ({
  buildTranslationDashboard: vi.fn(),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
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
    guardBuilderReadWithPermissionMock.mockResolvedValue(
      { username: 'translator@example.test' } as never,
    );
    buildTranslationDashboardMock.mockResolvedValue(dashboardPayload as never);
  });

  it('returns dashboard payloads while preserving GET success response shape', async () => {
    const response = await GET(request('siteId=site-a&sourceLocale=ko'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(Request),
      'manage-translations',
    );
    expect(buildTranslationDashboardMock).toHaveBeenCalledWith('site-a', 'ko');
    expect(data).toEqual(dashboardPayload);
  });

  it('returns 403 before building the dashboard when translation permission is missing', async () => {
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json(
        { error: 'Missing permission: manage-translations' },
        { status: 403 },
      ) as never,
    );

    const response = await GET(request('siteId=site-a&sourceLocale=ko'));

    expect(response.status).toBe(403);
    expect(buildTranslationDashboardMock).not.toHaveBeenCalled();
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
