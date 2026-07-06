import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import { loadOrder, softDeleteOrder, updateOrderState } from '@/lib/builder/commerce/orders-engine';
import { queueOrderUpdatedNotification } from '@/lib/builder/commerce/notifications-engine';
import { runOrderBillingAutomation } from '@/lib/builder/billing-document-automation';
import { DELETE, GET, PATCH } from '../route';

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(() => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/commerce/orders-engine', () => ({
  loadOrder: vi.fn(async () => null),
  softDeleteOrder: vi.fn(async () => true),
  updateOrderState: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/commerce/notifications-engine', () => ({
  queueOrderUpdatedNotification: vi.fn(async () => ({ ok: true })),
}));

vi.mock('@/lib/builder/billing-document-automation', () => ({
  runOrderBillingAutomation: vi.fn(async () => null),
}));

const order = {
  orderId: 'order-1',
  locale: 'ko',
  status: 'confirmed',
  payment: { status: 'requires_manual_payment' },
  fulfillment: { status: 'unfulfilled' },
};

const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const guardMutationMock = vi.mocked(guardMutation);
const loadOrderMock = vi.mocked(loadOrder);
const softDeleteOrderMock = vi.mocked(softDeleteOrder);
const updateOrderStateMock = vi.mocked(updateOrderState);
const queueOrderUpdatedNotificationMock = vi.mocked(queueOrderUpdatedNotification);
const runOrderBillingAutomationMock = vi.mocked(runOrderBillingAutomation);

function request(query = '', method = 'GET', body?: string | unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/orders/order-1${query ? `?${query}` : ''}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const params = { params: { orderId: 'order-1' } };

describe('builder commerce order detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireBuilderAdminAuthMock.mockReturnValue({ user: { id: 'admin-1' } } as never);
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    loadOrderMock.mockResolvedValue(order as never);
    softDeleteOrderMock.mockResolvedValue(true);
    updateOrderStateMock.mockResolvedValue(order as never);
    queueOrderUpdatedNotificationMock.mockResolvedValue({ ok: true } as never);
    runOrderBillingAutomationMock.mockResolvedValue(null);
  });

  it('returns localized missing-order errors', async () => {
    loadOrderMock.mockResolvedValueOnce(null);

    const response = await GET(request('locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到訂單。',
      errorCode: 'order_not_found',
    });
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loadOrderMock.mockRejectedValueOnce(new Error('order detail secret leaked'));

    const response = await GET(request('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '주문을 불러오지 못했습니다.',
      errorCode: 'orders_failed',
    });
    expect(payload.error).not.toContain('order detail secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/orders/:id] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns an order while preserving success response shape', async () => {
    const response = await GET(request('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, order });
    expect(requireBuilderAdminAuthMock).toHaveBeenCalled();
  });

  it('returns localized invalid-json update errors', async () => {
    const response = await PATCH(request('locale=zh-hant', 'PATCH', '{'), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認訂單請求格式。',
      errorCode: 'invalid_json',
    });
    expect(updateOrderStateMock).not.toHaveBeenCalled();
  });

  it('returns localized update validation errors', async () => {
    const response = await PATCH(request('locale=ko', 'PATCH', { status: 'bad' }), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '주문 요청을 확인해 주세요.',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(updateOrderStateMock).not.toHaveBeenCalled();
  });

  it('returns localized update missing-order errors', async () => {
    updateOrderStateMock.mockResolvedValueOnce(null);

    const response = await PATCH(request('locale=zh-hant', 'PATCH', { status: 'confirmed' }), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到訂單。',
      errorCode: 'order_not_found',
    });
  });

  it('returns localized update failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    updateOrderStateMock.mockRejectedValueOnce(new Error('order update secret leaked'));

    const response = await PATCH(request('locale=en', 'PATCH', { status: 'confirmed' }), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to update order.',
      errorCode: 'order_update_failed',
    });
    expect(payload.error).not.toContain('order update secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/orders/:id] PATCH failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('updates an order while preserving success response shape', async () => {
    const response = await PATCH(request('locale=en', 'PATCH', { fulfillmentStatus: 'fulfilled' }), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, order });
    expect(updateOrderStateMock).toHaveBeenCalledWith('order-1', {
      fulfillmentStatus: 'fulfilled',
      actor: 'admin',
    });
    expect(queueOrderUpdatedNotificationMock).toHaveBeenCalledWith(order, {
      fulfillmentStatus: 'fulfilled',
    });
  });

  it('preserves delete success response shape', async () => {
    const response = await DELETE(request('', 'DELETE'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, deleted: true });
    expect(softDeleteOrderMock).toHaveBeenCalledWith('order-1');
  });
});
