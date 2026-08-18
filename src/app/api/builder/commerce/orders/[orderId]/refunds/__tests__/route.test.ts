import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { refundOrderPayment } from '@/lib/builder/commerce/orders-engine';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/commerce/orders-engine', () => ({
  refundOrderPayment: vi.fn(async () => ({ order: null, refund: null, error: 'order_not_found' })),
}));

const order = {
  orderId: 'order-1',
  locale: 'ko',
  payment: { status: 'paid' },
};
const refund = {
  refundId: 'refund-1',
  amountCents: 12000,
  currency: 'TWD',
  status: 'succeeded',
};

const guardMutationMock = vi.mocked(guardMutation);
const refundOrderPaymentMock = vi.mocked(refundOrderPayment);

function postRequest(query = '', body: string | unknown = { amountCents: 12000, reason: 'Customer request' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/orders/order-1/refunds${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const params = { params: Promise.resolve({ orderId: 'order-1' }) };

describe('builder commerce order refunds API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    refundOrderPaymentMock.mockResolvedValue({ order, refund } as never);
  });

  it('returns localized validation errors with stable codes', async () => {
    const response = await POST(postRequest('locale=zh-hant', { amountCents: 0 }), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認訂單請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(refundOrderPaymentMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid-json errors', async () => {
    const response = await POST(postRequest('locale=ko', '{'), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '주문 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_json',
    });
    expect(refundOrderPaymentMock).not.toHaveBeenCalled();
  });

  it('returns localized missing-order errors', async () => {
    refundOrderPaymentMock.mockResolvedValueOnce({
      order: null,
      refund: null,
      error: 'order_not_found',
    } as never);

    const response = await POST(postRequest('locale=zh-hant'), params);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到訂單。',
      errorCode: 'order_not_found',
    });
  });

  it('returns localized refundable-balance errors while preserving order payload', async () => {
    refundOrderPaymentMock.mockResolvedValueOnce({
      order,
      refund: null,
      error: 'refund_amount_exceeds_remaining',
    } as never);

    const response = await POST(postRequest('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '환불 금액이 남은 환불 가능 금액을 초과합니다.',
      errorCode: 'refund_amount_exceeds_remaining',
      order,
    });
  });

  it('returns localized provider failures without leaking provider details', async () => {
    refundOrderPaymentMock.mockResolvedValueOnce({
      order,
      refund: null,
      error: 'refund_provider_402_card_declined',
    } as never);

    const response = await POST(postRequest('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to process the payment provider refund.',
      errorCode: 'refund_provider_failed',
      order,
    });
    expect(payload.error).not.toContain('card_declined');
  });

  it('returns localized fallback failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    refundOrderPaymentMock.mockRejectedValueOnce(new Error('refund secret leaked'));

    const response = await POST(postRequest('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to record refund.',
      errorCode: 'refund_failed',
    });
    expect(payload.error).not.toContain('refund secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/orders/:id/refunds] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('records refunds while preserving success response shape', async () => {
    const response = await POST(postRequest('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, order, refund });
    expect(refundOrderPaymentMock).toHaveBeenCalledWith('order-1', {
      amountCents: 12000,
      reason: 'Customer request',
      actor: 'admin',
    });
  });
});
