import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { updateBuilderAppSettings } from '@/lib/builder/apps/installed';
import { PUT } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'apps-admin@example.test' })),
}));

vi.mock('@/lib/builder/apps/installed', () => ({
  updateBuilderAppSettings: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const updateBuilderAppSettingsMock = vi.mocked(updateBuilderAppSettings);
const routeContext = { params: { appId: 'site-search' } };

function request(query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/apps/installations/site-search/settings${query ? `?${query}` : ''}`, {
    method: 'PUT',
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder app settings API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'apps-admin@example.test' } as never);
    updateBuilderAppSettingsMock.mockResolvedValue({
      entry: { manifest: { appId: 'site-search' } },
      changed: true,
    } as never);
  });

  it('saves settings while preserving PUT success response shape', async () => {
    const response = await PUT(request('locale=en', { settings: { placeholder: 'Search' } }), routeContext);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(updateBuilderAppSettingsMock).toHaveBeenCalledWith(
      'tseng-law-main-site',
      'en',
      'site-search',
      'apps-admin@example.test',
      { placeholder: 'Search' },
    );
    expect(data).toEqual({
      ok: true,
      entry: { manifest: { appId: 'site-search' } },
      changed: true,
    });
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await PUT(request('locale=zh-hant', '{'), routeContext);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: '請確認應用請求格式。',
      errorCode: 'invalid_json',
    });
    expect(updateBuilderAppSettingsMock).not.toHaveBeenCalled();
  });

  it('returns localized settings validation errors while preserving field details', async () => {
    updateBuilderAppSettingsMock.mockResolvedValueOnce({
      entry: { manifest: { appId: 'site-search' } },
      changed: false,
      validationErrors: [{ panelId: 'main', fieldId: 'placeholder', message: 'Placeholder is required.' }],
    } as never);

    const response = await PUT(request('locale=en', { settings: { placeholder: '' } }), routeContext);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: 'Check the app settings.',
      errorCode: 'invalid_app_settings',
      entry: { manifest: { appId: 'site-search' } },
      validationErrors: [{ panelId: 'main', fieldId: 'placeholder', message: 'Placeholder is required.' }],
    });
  });

  it('returns localized save failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    updateBuilderAppSettingsMock.mockRejectedValueOnce(new Error('settings secret leaked'));

    const response = await PUT(request('locale=ko', { settings: {} }), routeContext);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '앱 설정을 저장하지 못했습니다.',
      errorCode: 'app_settings_save_failed',
    });
    expect(JSON.stringify(data)).not.toContain('settings secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/apps/installations/:appId/settings] save failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
