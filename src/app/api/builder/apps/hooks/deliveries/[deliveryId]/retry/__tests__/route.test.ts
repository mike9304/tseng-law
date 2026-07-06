import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { retryStoredAppHookDelivery } from '@/lib/builder/apps/hook-runtime';
import { guardMutation } from '@/lib/builder/security/guard';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'apps-admin@example.test' })),
}));

vi.mock('@/lib/builder/apps/hook-runtime', () => ({
  retryStoredAppHookDelivery: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const retryStoredAppHookDeliveryMock = vi.mocked(retryStoredAppHookDelivery);

function request(query = ''): NextRequest {
  return new NextRequest(
    `https://law.example.test/api/builder/apps/hooks/deliveries/appdlv-1/retry${query ? `?${query}` : ''}`,
    { method: 'POST' },
  );
}

describe('builder app hook delivery retry API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'apps-admin@example.test' });
    retryStoredAppHookDeliveryMock.mockResolvedValue({
      status: 'retried',
      delivery: {
        deliveryId: 'appdlv-2',
        hookId: 'site-search-publish-1',
        appId: 'site-search',
        kind: 'publish.completed',
        status: 'failed',
        attempt: 2,
        event: {
          kind: 'publish.completed',
          payload: { siteId: 'site-a', pageId: 'page-1', revision: 7 },
        },
        createdAt: '2026-06-18T00:00:00.000Z',
        updatedAt: '2026-06-18T00:00:01.000Z',
        error: 'stored boom',
        logCount: 1,
      },
      invocation: {
        hookId: 'site-search-publish-1',
        appId: 'site-search',
        ok: false,
        attempt: 2,
        deliveryId: 'appdlv-2',
        error: 'stored boom',
        logCount: 1,
      },
    });
  });

  it('retries a stored hook delivery through the guarded runtime', async () => {
    const response = await POST(request('locale=en'), { params: { deliveryId: 'appdlv-1' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(retryStoredAppHookDeliveryMock).toHaveBeenCalledWith('appdlv-1');
    expect(data).toMatchObject({
      ok: false,
      delivery: {
        deliveryId: 'appdlv-2',
        hookId: 'site-search-publish-1',
        status: 'failed',
        attempt: 2,
      },
    });
  });

  it('returns not found when the delivery id is unknown', async () => {
    retryStoredAppHookDeliveryMock.mockResolvedValueOnce({ status: 'not-found' });

    const response = await POST(request('locale=ko'), { params: { deliveryId: 'missing-delivery' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      ok: false,
      error: '앱 훅 전달 기록을 찾을 수 없습니다.',
      errorCode: 'hook_delivery_not_found',
    });
  });

  it('returns unavailable when the stored hook can no longer be run', async () => {
    retryStoredAppHookDeliveryMock.mockResolvedValueOnce({ status: 'unavailable' });

    const response = await POST(request('locale=zh-hant'), { params: { deliveryId: 'appdlv-1' } });
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({
      ok: false,
      error: '此應用 Hook 傳遞無法重新執行。',
      errorCode: 'hook_retry_unavailable',
    });
  });
});
