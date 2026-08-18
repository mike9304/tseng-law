import { NextRequest, NextResponse } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import { loadOrder, softDeleteOrder, updateOrderState } from '@/lib/builder/commerce/orders-engine';
import { queueOrderUpdatedNotification } from '@/lib/builder/commerce/notifications-engine';
import { runOrderBillingAutomation } from '@/lib/builder/billing-document-automation';
import { DELETE, GET, PATCH } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'view-commerce',
  })),
  guardMutation: vi.fn(async () => ({
    username: 'admin',
    permission: 'manage-commerce',
  })),
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

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
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

const params = { params: Promise.resolve({ orderId: 'order-1' }) };

describe('builder commerce order detail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'admin',
      permission: 'view-commerce',
    } as never);
    guardMutationMock.mockResolvedValue({
      username: 'admin',
      permission: 'manage-commerce',
    } as never);
    loadOrderMock.mockResolvedValue(order as never);
    softDeleteOrderMock.mockResolvedValue(true);
    updateOrderStateMock.mockResolvedValue(order as never);
    queueOrderUpdatedNotificationMock.mockResolvedValue({ ok: true } as never);
    runOrderBillingAutomationMock.mockResolvedValue(null);
  });

  it('returns 403 and short-circuits order loading when commerce read permission is denied', async () => {
    const deniedRequest = request('locale=en');
    guardBuilderReadWithPermissionMock.mockResolvedValueOnce(
      NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 }) as never,
    );

    const response = await GET(deniedRequest, params);

    expect(response.status).toBe(403);
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      deniedRequest,
      'view-commerce',
    );
    expect(loadOrderMock).not.toHaveBeenCalled();
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
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-commerce',
    );
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

describe('production authorized_stub payment status guard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'admin',
      permission: 'view-commerce',
    } as never);
    guardMutationMock.mockResolvedValue({
      username: 'admin',
      permission: 'manage-commerce',
    } as never);
    loadOrderMock.mockResolvedValue(order as never);
    softDeleteOrderMock.mockResolvedValue(true);
    updateOrderStateMock.mockResolvedValue(order as never);
    queueOrderUpdatedNotificationMock.mockResolvedValue({ ok: true } as never);
    runOrderBillingAutomationMock.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('rejects authorized_stub before load/update/notification/billing in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const response = await PATCH(request('locale=en', 'PATCH', { paymentStatus: 'authorized_stub' }), params);
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to update order.',
      errorCode: 'order_update_failed',
    });
    expect(loadOrderMock).not.toHaveBeenCalled();
    expect(updateOrderStateMock).not.toHaveBeenCalled();
    expect(queueOrderUpdatedNotificationMock).not.toHaveBeenCalled();
    expect(runOrderBillingAutomationMock).not.toHaveBeenCalled();
  });

  it('ignores ALLOW_STUB escape hatches in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('ALLOW_STUB', '1');

    const response = await PATCH(request('locale=en', 'PATCH', { paymentStatus: 'authorized_stub' }), params);
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toMatchObject({ ok: false, errorCode: 'order_update_failed' });
    expect(updateOrderStateMock).not.toHaveBeenCalled();
    expect(loadOrderMock).not.toHaveBeenCalled();
  });

  it('still routes authorized_stub to the engine outside production', async () => {
    vi.stubEnv('NODE_ENV', 'test');

    const response = await PATCH(request('locale=en', 'PATCH', { paymentStatus: 'authorized_stub' }), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, order });
    expect(updateOrderStateMock).toHaveBeenCalledWith('order-1', {
      paymentStatus: 'authorized_stub',
      actor: 'admin',
    });
  });

  it.each([
    { label: 'tracking', body: { trackingNumber: 'TRK-LEGACY-1' } },
    { label: 'fulfillment', body: { fulfillmentStatus: 'fulfilled' } },
    { label: 'status', body: { status: 'cancelled' } },
  ])('returns a stable 422 for a $label-only PATCH on a legacy authorized_stub order in production', async ({ body }) => {
    vi.stubEnv('NODE_ENV', 'production');
    loadOrderMock.mockResolvedValueOnce({ ...order, payment: { status: 'authorized_stub' } } as never);

    const response = await PATCH(request('locale=ko', 'PATCH', body), params);
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toEqual({
      ok: false,
      error: '주문을 업데이트하지 못했습니다.',
      errorCode: 'order_update_failed',
    });
    expect(updateOrderStateMock).not.toHaveBeenCalled();
    expect(queueOrderUpdatedNotificationMock).not.toHaveBeenCalled();
    expect(runOrderBillingAutomationMock).not.toHaveBeenCalled();
  });

  it('returns a stable 422 for a paymentStatus paid PATCH on a legacy authorized_stub order in production without mutation/notification/billing', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    loadOrderMock.mockResolvedValueOnce({ ...order, payment: { status: 'authorized_stub' } } as never);

    const response = await PATCH(request('locale=ko', 'PATCH', { paymentStatus: 'paid' }), params);
    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toEqual({
      ok: false,
      error: '주문을 업데이트하지 못했습니다.',
      errorCode: 'order_update_failed',
    });
    expect(updateOrderStateMock).not.toHaveBeenCalled();
    expect(queueOrderUpdatedNotificationMock).not.toHaveBeenCalled();
    expect(runOrderBillingAutomationMock).not.toHaveBeenCalled();
  });

  it('still patches a legacy authorized_stub order outside production', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    const legacyStubOrder = { ...order, payment: { status: 'authorized_stub' } };
    loadOrderMock.mockResolvedValueOnce(legacyStubOrder as never);
    updateOrderStateMock.mockResolvedValueOnce(legacyStubOrder as never);

    const response = await PATCH(request('locale=en', 'PATCH', { trackingNumber: 'TRK-LEGACY-2' }), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, order: legacyStubOrder });
    expect(updateOrderStateMock).toHaveBeenCalledWith('order-1', {
      trackingNumber: 'TRK-LEGACY-2',
      actor: 'admin',
    });
  });
});
