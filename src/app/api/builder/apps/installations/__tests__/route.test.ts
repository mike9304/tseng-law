import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  installBuilderApp,
  listBuilderAppCatalogEntries,
} from '@/lib/builder/apps/installed';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'apps-admin@example.test' })),
}));

vi.mock('@/lib/builder/apps/installed', () => ({
  installBuilderApp: vi.fn(),
  listBuilderAppCatalogEntries: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const installBuilderAppMock = vi.mocked(installBuilderApp);
const listBuilderAppCatalogEntriesMock = vi.mocked(listBuilderAppCatalogEntries);

function request(method: string, query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/apps/installations${query ? `?${query}` : ''}`, {
    method,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder app installations API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'apps-admin@example.test' } as never);
    listBuilderAppCatalogEntriesMock.mockResolvedValue([{ manifest: { appId: 'site-search' } }] as never);
    installBuilderAppMock.mockResolvedValue({
      entry: { manifest: { appId: 'site-search' } },
      changed: true,
    } as never);
  });

  it('lists installed apps while preserving GET success response shape', async () => {
    const response = await GET(request('GET', 'locale=en'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(listBuilderAppCatalogEntriesMock).toHaveBeenCalledWith('tseng-law-main-site', 'en', { status: 'installed' });
    expect(data).toEqual({
      ok: true,
      entries: [{ manifest: { appId: 'site-search' } }],
    });
  });

  it('returns localized invalid install payload errors', async () => {
    const response = await POST(request('POST', 'locale=zh-hant', { appId: '' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: '請確認應用請求。',
      errorCode: 'invalid_request',
    });
    expect(installBuilderAppMock).not.toHaveBeenCalled();
  });

  it('returns localized not-found install errors', async () => {
    installBuilderAppMock.mockResolvedValueOnce(null as never);

    const response = await POST(request('POST', 'locale=ko', { appId: 'missing-app' }));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      ok: false,
      error: '앱을 찾을 수 없습니다.',
      errorCode: 'app_not_found',
    });
  });

  it('returns localized install failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    installBuilderAppMock.mockRejectedValueOnce(new Error('install secret leaked'));

    const response = await POST(request('POST', 'locale=en', { appId: 'site-search' }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: 'Unable to complete the app action.',
      errorCode: 'app_action_failed',
    });
    expect(JSON.stringify(data)).not.toContain('install secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/apps/installations] install failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
