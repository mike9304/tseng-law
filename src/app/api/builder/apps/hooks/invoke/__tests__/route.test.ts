import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dispatchAppHookEvent } from '@/lib/builder/apps/hook-runtime';
import { guardMutation } from '@/lib/builder/security/guard';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'apps-admin@example.test' })),
}));

vi.mock('@/lib/builder/apps/hook-runtime', () => ({
  dispatchAppHookEvent: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const dispatchAppHookEventMock = vi.mocked(dispatchAppHookEvent);

function request(query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/apps/hooks/invoke${query ? `?${query}` : ''}`, {
    method: 'POST',
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder app hook invoke API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'apps-admin@example.test' });
    dispatchAppHookEventMock.mockResolvedValue({
      kind: 'publish.completed',
      invoked: 1,
      failed: 0,
      dispatchedAt: '2026-06-18T00:00:00.000Z',
      live: {
        kind: 'publish.completed',
        invoked: 0,
        failed: 0,
        dispatchedAt: '2026-06-18T00:00:00.000Z',
      },
      stored: {
        kind: 'publish.completed',
        invoked: 1,
        failed: 0,
        skipped: 0,
        dispatchedAt: '2026-06-18T00:00:00.000Z',
        hooks: [
          {
            hookId: 'stored-app-publish-1',
            appId: 'stored-app',
            ok: true,
            attempt: 1,
            logCount: 1,
            runtime: 'worker-vm',
            durationMs: 4,
            result: 'ok',
          },
        ],
      },
    });
  });

  it('invokes a parsed app hook event through the guarded runtime', async () => {
    const response = await POST(request('locale=en', {
      kind: 'publish.completed',
      payload: {
        siteId: 'site-a',
        pageId: 'page-1',
        revision: 7,
        publishedAt: '2026-06-18T00:00:00.000Z',
      },
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(dispatchAppHookEventMock).toHaveBeenCalledWith({
      kind: 'publish.completed',
      payload: {
        siteId: 'site-a',
        pageId: 'page-1',
        revision: 7,
        publishedAt: '2026-06-18T00:00:00.000Z',
      },
    });
    expect(data).toMatchObject({
      ok: true,
      summary: {
        kind: 'publish.completed',
        invoked: 1,
        failed: 0,
        stored: {
          invoked: 1,
          hooks: [{ hookId: 'stored-app-publish-1', ok: true }],
        },
      },
    });
  });

  it('returns localized validation errors for malformed hook events', async () => {
    const response = await POST(request('locale=ko', {
      kind: 'publish.completed',
      payload: { pageId: 'page-1' },
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(dispatchAppHookEventMock).not.toHaveBeenCalled();
    expect(data).toMatchObject({
      ok: false,
      error: '앱 요청을 확인해 주세요.',
      errorCode: 'invalid_request',
    });
    expect(data.issues).toBeTruthy();
  });

  it('returns localized invoke failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    dispatchAppHookEventMock.mockRejectedValueOnce(new Error('secret invoke details'));

    const response = await POST(request('locale=zh-hant', {
      kind: 'commerce.order-created',
      payload: {
        orderId: 'order-1',
        totalCents: 1200,
        currency: 'TWD',
      },
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法執行應用 Hook。',
      errorCode: 'hook_invoke_failed',
    });
    expect(JSON.stringify(data)).not.toContain('secret invoke details');
    expect(consoleError).toHaveBeenCalledWith('[builder/apps/hooks/invoke] dispatch failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
