import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  disableBuilderApp,
  enableBuilderApp,
  rollbackBuilderApp,
  restoreUninstalledBuilderApp,
  uninstallBuilderApp,
} from '@/lib/builder/apps/installed';
import { DELETE, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'apps-admin@example.test' })),
}));

vi.mock('@/lib/builder/apps/installed', () => ({
  disableBuilderApp: vi.fn(),
  enableBuilderApp: vi.fn(),
  rollbackBuilderApp: vi.fn(),
  restoreUninstalledBuilderApp: vi.fn(),
  uninstallBuilderApp: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const disableBuilderAppMock = vi.mocked(disableBuilderApp);
const enableBuilderAppMock = vi.mocked(enableBuilderApp);
const rollbackBuilderAppMock = vi.mocked(rollbackBuilderApp);
const restoreUninstalledBuilderAppMock = vi.mocked(restoreUninstalledBuilderApp);
const uninstallBuilderAppMock = vi.mocked(uninstallBuilderApp);

function request(method: 'PATCH' | 'DELETE', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/apps/installations/site-search${query ? `?${query}` : ''}`, {
    method,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const routeContext = { params: Promise.resolve({ appId: 'site-search' }) };

describe('builder app installation lifecycle API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'apps-admin@example.test' } as never);
    const result = {
      entry: { manifest: { appId: 'site-search' } },
      changed: true,
    };
    disableBuilderAppMock.mockResolvedValue(result as never);
    enableBuilderAppMock.mockResolvedValue(result as never);
    rollbackBuilderAppMock.mockResolvedValue(result as never);
    restoreUninstalledBuilderAppMock.mockResolvedValue(result as never);
    uninstallBuilderAppMock.mockResolvedValue(result as never);
  });

  it('updates lifecycle state while preserving PATCH success response shape', async () => {
    const response = await PATCH(request('PATCH', 'locale=en', { status: 'disabled' }), routeContext);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(disableBuilderAppMock).toHaveBeenCalledWith('tseng-law-main-site', 'en', 'site-search', 'apps-admin@example.test');
    expect(data).toEqual({
      ok: true,
      entry: { manifest: { appId: 'site-search' } },
      changed: true,
    });
  });

  it('returns localized lifecycle validation errors', async () => {
    const response = await PATCH(request('PATCH', 'locale=zh-hant', { status: 'paused' }), routeContext);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: '請確認應用請求。',
      errorCode: 'invalid_request',
    });
    expect(enableBuilderAppMock).not.toHaveBeenCalled();
    expect(disableBuilderAppMock).not.toHaveBeenCalled();
  });

  it('returns localized rollback-unavailable conflicts', async () => {
    rollbackBuilderAppMock.mockResolvedValueOnce({
      entry: { manifest: { appId: 'site-search' } },
      changed: false,
      rollbackUnavailable: true,
    } as never);

    const response = await PATCH(request('PATCH', 'locale=en', { action: 'rollback' }), routeContext);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({
      ok: false,
      error: 'This app cannot be rolled back.',
      errorCode: 'app_rollback_unavailable',
      entry: { manifest: { appId: 'site-search' } },
      changed: false,
      rollbackUnavailable: true,
    });
  });

  it('returns localized lifecycle failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    enableBuilderAppMock.mockRejectedValueOnce(new Error('lifecycle secret leaked'));

    const response = await PATCH(request('PATCH', 'locale=ko', { status: 'enabled' }), routeContext);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '앱 작업을 완료하지 못했습니다.',
      errorCode: 'app_action_failed',
    });
    expect(JSON.stringify(data)).not.toContain('lifecycle secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/apps/installations/:appId] lifecycle failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized uninstall not-found errors', async () => {
    uninstallBuilderAppMock.mockResolvedValueOnce(null as never);

    const response = await DELETE(request('DELETE', 'locale=zh-hant', { cleanupMode: 'keep-data' }), routeContext);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      ok: false,
      error: '找不到應用。',
      errorCode: 'app_not_found',
    });
  });
});
