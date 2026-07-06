import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { recordOrderManualPayment } from '@/lib/builder/commerce/orders-engine';
import {
  queueBillingPaymentReceivedNotification,
  queueOrderUpdatedNotification,
} from '@/lib/builder/commerce/notifications-engine';
import { runOrderBillingAutomation } from '@/lib/builder/billing-document-automation';
import { getCurrentBillingInvoice } from '@/lib/builder/billing-documents';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/commerce/orders-engine', () => ({
  recordOrderManualPayment: vi.fn(async () => ({ order: null, manualPayment: null, error: 'order_not_found' })),
}));

vi.mock('@/lib/builder/commerce/notifications-engine', () => ({
  queueBillingPaymentReceivedNotification: vi.fn(async () => ({ ok: true })),
  queueOrderUpdatedNotification: vi.fn(async () => ({ ok: true })),
}));

vi.mock('@/lib/builder/billing-document-automation', () => ({
  runOrderBillingAutomation: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/billing-documents', () => ({
  getCurrentBillingInvoice: vi.fn(async () => null),
}));

const order = {
  orderId: 'order-1',
  locale: 'ko',
  payment: { status: 'partially_paid' },
};
const manualPayment = {
  paymentId: 'manual-1',
  amountCents: 12000,
  currency: 'TWD',
  method: 'bank_transfer',
  status: 'succeeded',
};

const guardMutationMock = vi.mocked(guardMutation);
const recordOrderManualPaymentMock = vi.mocked(recordOrderManualPayment);
const queueBillingPaymentReceivedNotificationMock = vi.mocked(queueBillingPaymentReceivedNotification);
const queueOrderUpdatedNotificationMock = vi.mocked(queueOrderUpdatedNotification);
const runOrderBillingAutomationMock = vi.mocked(runOrderBillingAutomation);
const getCurrentBillingInvoiceMock = vi.mocked(getCurrentBillingInvoice);

function postRequest(query = '', body: string | unknown = {
  amountCents: 12000,
  method: 'bank_transfer',
  reference: 'TX-1',
}): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/orders/order-1/manual-payments${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const params = { params: { orderId: 'order-1' } };

describe('builder commerce order manual payments API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    recordOrderManualPaymentMock.mockResolvedValue({ order, manualPayment } as never);
    queueBillingPaymentReceivedNotificationMock.mockResolvedValue({ ok: true } as never);
    queueOrderUpdatedNotificationMock.mockResolvedValue({ ok: true } as never);
    runOrderBillingAutomationMock.mockResolvedValue(null);
    getCurrentBillingInvoiceMock.mockResolvedValue(null);
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
    expect(recordOrderManualPaymentMock).not.toHaveBeenCalled();
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
    expect(recordOrderManualPaymentMock).not.toHaveBeenCalled();
  });

  it('returns localized missing-order errors', async () => {
    recordOrderManualPaymentMock.mockResolvedValueOnce({
      order: null,
      manualPayment: null,
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

  it('returns localized balance errors', async () => {
    recordOrderManualPaymentMock.mockResolvedValueOnce({
      order,
      manualPayment: null,
      error: 'manual_payment_exceeds_balance',
    } as never);

    const response = await POST(postRequest('locale=ko'), params);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '수동 결제 금액이 남은 잔액을 초과합니다.',
      errorCode: 'manual_payment_exceeds_balance',
    });
  });

  it('returns localized fallback failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    recordOrderManualPaymentMock.mockRejectedValueOnce(new Error('manual payment secret leaked'));

    const response = await POST(postRequest('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to record manual payment.',
      errorCode: 'manual_payment_failed',
    });
    expect(payload.error).not.toContain('manual payment secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/orders/:id/manual-payments] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('records manual payments while preserving success response shape', async () => {
    const response = await POST(postRequest('locale=en'), params);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, order, manualPayment });
    expect(recordOrderManualPaymentMock).toHaveBeenCalledWith('order-1', {
      amountCents: 12000,
      method: 'bank_transfer',
      status: 'succeeded',
      reference: 'TX-1',
      actor: 'admin',
    });
    expect(queueOrderUpdatedNotificationMock).toHaveBeenCalledWith(order, {
      manualPaymentId: manualPayment.paymentId,
      amountCents: manualPayment.amountCents,
      paymentStatus: order.payment.status,
    });
  });
});
