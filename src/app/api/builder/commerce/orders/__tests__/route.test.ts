import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { filterOrders } from '@/lib/builder/commerce/orders-engine';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'view-commerce',
  })),
}));

vi.mock('@/lib/builder/commerce/orders-engine', () => ({
  filterOrders: vi.fn(async () => []),
}));

const order = { orderId: 'order-1', locale: 'ko', status: 'confirmed' };
const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const filterOrdersMock = vi.mocked(filterOrders);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/orders${query ? `?${query}` : ''}`);
}

describe('builder commerce orders list API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'admin',
      permission: 'view-commerce',
    } as never);
    filterOrdersMock.mockResolvedValue([order] as never);
  });

  it('returns 401 and short-circuits storage when commerce read auth fails', async () => {
    const request = getRequest('locale=en');
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 }) as never,
    );

    const response = await GET(request);

    expect(response.status).toBe(401);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(request, 'view-commerce');
    expect(filterOrdersMock).not.toHaveBeenCalled();
  });

  it('returns localized validation errors with stable codes', async () => {
    const response = await GET(getRequest('locale=zh-hant&status=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認訂單請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(filterOrdersMock).not.toHaveBeenCalled();
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    filterOrdersMock.mockRejectedValueOnce(new Error('orders storage secret leaked'));

    const response = await GET(getRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '주문을 불러오지 못했습니다.',
      errorCode: 'orders_failed',
    });
    expect(payload.error).not.toContain('orders storage secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/orders] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns orders while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en&paymentStatus=paid&fulfillmentStatus=fulfilled&q=order'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, orders: [order], total: 1 });
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-commerce',
    );
    expect(filterOrdersMock).toHaveBeenCalledWith({
      locale: 'en',
      q: 'order',
      status: 'all',
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    });
  });
});
