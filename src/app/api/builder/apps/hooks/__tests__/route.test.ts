import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  listRegisteredAppHooks,
  registerAppHookRecord,
} from '@/lib/builder/apps/hooks-registry';
import { createSecret } from '@/lib/builder/dev/secrets-store';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => ({ username: 'apps-admin@example.test' })),
  guardMutation: vi.fn(async () => ({ username: 'apps-admin@example.test' })),
}));

vi.mock('@/lib/builder/apps/hooks-registry', () => ({
  listRegisteredAppHooks: vi.fn(),
  registerAppHookRecord: vi.fn(),
}));

vi.mock('@/lib/builder/dev/secrets-store', () => ({
  createSecret: vi.fn(),
}));

const guardBuilderReadMock = vi.mocked(guardBuilderRead);
const guardMutationMock = vi.mocked(guardMutation);
const listRegisteredAppHooksMock = vi.mocked(listRegisteredAppHooks);
const registerAppHookRecordMock = vi.mocked(registerAppHookRecord);
const createSecretMock = vi.mocked(createSecret);

function request(method: 'GET' | 'POST', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/apps/hooks${query ? `?${query}` : ''}`, {
    method,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder app hooks API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadMock.mockReturnValue({ username: 'apps-admin@example.test' });
    guardMutationMock.mockResolvedValue({ username: 'apps-admin@example.test' });
    listRegisteredAppHooksMock.mockResolvedValue([
      {
        hookId: 'site-search-publish-1',
        appId: 'site-search',
        kind: 'publish.completed',
        priority: 5,
        registeredAt: '2026-06-03T00:00:00.000Z',
        hasHandler: false,
      },
    ]);
    registerAppHookRecordMock.mockImplementation(async (record) => record);
    createSecretMock.mockResolvedValue({
      secret: {
        id: 'secret-app-hook-code',
        key: 'APP_HOOK_SITE_SEARCH_PUBLISH',
        scope: 'site',
        lastRotatedAt: '2026-06-03T00:00:00.000Z',
        createdAt: '2026-06-03T00:00:00.000Z',
        addedBy: 'apps-admin@example.test',
      },
      plaintext: 'function handler() {}',
    });
  });

  it('lists app hooks while preserving GET success response shape', async () => {
    const response = await GET(request('GET', 'locale=en'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ok: true,
      hooks: [
        {
          hookId: 'site-search-publish-1',
          appId: 'site-search',
          kind: 'publish.completed',
          priority: 5,
          registeredAt: '2026-06-03T00:00:00.000Z',
          hasHandler: false,
        },
      ],
    });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listRegisteredAppHooksMock.mockRejectedValueOnce(new Error('hook list secret leaked'));

    const response = await GET(request('GET', 'locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法載入應用 Hook 清單。',
      errorCode: 'hooks_list_failed',
    });
    expect(JSON.stringify(data)).not.toContain('hook list secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/apps/hooks] list failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized validation and ID errors', async () => {
    const invalidKind = await POST(request('POST', 'locale=ko', {
      appId: 'site-search',
      kind: 'not-real',
    }));
    const invalidKindData = await invalidKind.json();

    expect(invalidKind.status).toBe(400);
    expect(invalidKindData).toMatchObject({
      ok: false,
      error: '앱 요청을 확인해 주세요.',
      errorCode: 'invalid_request',
    });
    expect(invalidKindData.issues).toBeTruthy();

    const invalidApp = await POST(request('POST', 'locale=en', {
      appId: 'SiteSearch',
      kind: 'publish.completed',
    }));
    await expect(invalidApp.json()).resolves.toEqual({
      ok: false,
      error: 'Check the app ID.',
      errorCode: 'invalid_app_id',
    });

    const invalidHook = await POST(request('POST', 'locale=zh-hant', {
      appId: 'site-search',
      kind: 'publish.completed',
      hookId: 'bad_hook',
    }));
    await expect(invalidHook.json()).resolves.toEqual({
      ok: false,
      error: '請確認應用 Hook ID。',
      errorCode: 'invalid_hook_id',
    });
    expect(registerAppHookRecordMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(request('POST', 'locale=zh-hant', '{'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: '請確認應用請求格式。',
      errorCode: 'invalid_json',
    });
  });

  it('registers stored hook metadata while preserving POST success response shape', async () => {
    const response = await POST(request('POST', 'locale=en', {
      appId: 'site-search',
      kind: 'publish.completed',
      hookId: 'site-search-publish-1',
      priority: 5,
    }));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(registerAppHookRecordMock).toHaveBeenCalledWith({
      hookId: 'site-search-publish-1',
      appId: 'site-search',
      kind: 'publish.completed',
      priority: 5,
      registeredAt: expect.any(String),
    });
    expect(data).toMatchObject({
      ok: true,
      hook: {
        hookId: 'site-search-publish-1',
        appId: 'site-search',
        kind: 'publish.completed',
        priority: 5,
        hasHandler: false,
      },
    });
  });

  it('stores code fallback notes without exposing secret-store exception details', async () => {
    createSecretMock.mockRejectedValueOnce(new Error('kek secret leaked'));

    const response = await POST(request('POST', 'locale=en', {
      appId: 'site-search',
      kind: 'publish.completed',
      hookId: 'site-search-publish-1',
      code: 'function handler() { return true; }',
    }));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(registerAppHookRecordMock).toHaveBeenCalledWith(expect.objectContaining({
      codeStubNote: expect.stringMatching(/^code-body-stored-as-stub \(secret-store-unavailable; bytes=\d+\)$/),
    }));
    expect(JSON.stringify(data)).not.toContain('kek secret leaked');
  });

  it('returns localized register failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    registerAppHookRecordMock.mockRejectedValueOnce(new Error('register secret leaked'));

    const response = await POST(request('POST', 'locale=ko', {
      appId: 'site-search',
      kind: 'publish.completed',
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '앱 훅을 등록하지 못했습니다.',
      errorCode: 'hook_register_failed',
    });
    expect(JSON.stringify(data)).not.toContain('register secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/apps/hooks] register failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
