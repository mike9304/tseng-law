import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { filterOrders } from '@/lib/builder/commerce/orders-engine';
import { GET } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/commerce/orders-engine', () => ({
  filterOrders: vi.fn(async () => []),
}));

const order = { orderId: 'order-1', locale: 'ko', status: 'confirmed' };
const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const filterOrdersMock = vi.mocked(filterOrders);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/orders${query ? `?${query}` : ''}`);
}

describe('builder commerce orders list API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ user: { id: 'admin-1' } } as never);
    filterOrdersMock.mockResolvedValue([order] as never);
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
    expect(requireBuilderAdminAuthMock).toHaveBeenCalled();
    expect(filterOrdersMock).toHaveBeenCalledWith({
      locale: 'en',
      q: 'order',
      status: 'all',
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
    });
  });
});
