import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listStoredAppHookDeliveries } from '@/lib/builder/apps/hook-deliveries';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => ({ username: 'apps-admin@example.test' })),
}));

vi.mock('@/lib/builder/apps/hook-deliveries', () => ({
  listStoredAppHookDeliveries: vi.fn(),
}));

const guardBuilderReadMock = vi.mocked(guardBuilderRead);
const listStoredAppHookDeliveriesMock = vi.mocked(listStoredAppHookDeliveries);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/apps/hooks/deliveries${query ? `?${query}` : ''}`);
}

describe('builder app hook deliveries API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadMock.mockReturnValue({ username: 'apps-admin@example.test' });
    listStoredAppHookDeliveriesMock.mockResolvedValue([
      {
        deliveryId: 'appdlv-1',
        hookId: 'site-search-publish-1',
        appId: 'site-search',
        kind: 'publish.completed',
        status: 'failed',
        attempt: 1,
        event: {
          kind: 'publish.completed',
          payload: { siteId: 'site-a', pageId: 'page-1', revision: 7 },
        },
        createdAt: '2026-06-18T00:00:00.000Z',
        updatedAt: '2026-06-18T00:00:00.000Z',
        error: 'stored boom',
        logCount: 1,
      },
    ]);
  });

  it('lists filtered stored hook deliveries', async () => {
    const response = await GET(request('locale=en&hookId=site-search-publish-1&status=failed&limit=5'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(listStoredAppHookDeliveriesMock).toHaveBeenCalledWith({
      hookId: 'site-search-publish-1',
      status: 'failed',
      limit: 5,
    });
    expect(data).toMatchObject({
      ok: true,
      deliveries: [
        {
          deliveryId: 'appdlv-1',
          hookId: 'site-search-publish-1',
          status: 'failed',
          attempt: 1,
          error: 'stored boom',
        },
      ],
      total: 1,
    });
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listStoredAppHookDeliveriesMock.mockRejectedValueOnce(new Error('delivery secret leaked'));

    const response = await GET(request('locale=ko'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '앱 훅 전달 기록을 불러오지 못했습니다.',
      errorCode: 'hook_deliveries_failed',
    });
    expect(JSON.stringify(data)).not.toContain('delivery secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/apps/hooks/deliveries] list failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
