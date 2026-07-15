import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  captureCommercePaymentIntent,
  createCommercePaymentIntent,
  paymentIntentToOrderStatus,
} from '@/lib/builder/commerce/payment-providers';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/commerce/payment-providers', () => ({
  captureCommercePaymentIntent: vi.fn(() => null),
  createCommercePaymentIntent: vi.fn(() => null),
  paymentIntentToOrderStatus: vi.fn(() => 'authorized_stub'),
}));

const intent = {
  version: 1,
  intentId: 'pi_test',
  provider: 'sandbox-card',
  locale: 'ko',
  currency: 'TWD',
  amountCents: 12345,
  status: 'authorized',
  clientSecret: 'cs_test_secret',
  stub: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const guardMutationMock = vi.mocked(guardMutation);
const captureCommercePaymentIntentMock = vi.mocked(captureCommercePaymentIntent);
const createCommercePaymentIntentMock = vi.mocked(createCommercePaymentIntent);
const paymentIntentToOrderStatusMock = vi.mocked(paymentIntentToOrderStatus);

function postRequest(query = '', body: string | unknown = {
  provider: 'sandbox-card',
  locale: 'ko',
  currency: 'TWD',
  amountCents: 12345,
}): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/payment-intents${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder commerce payment intents API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    captureCommercePaymentIntentMock.mockReturnValue({ ...intent, status: 'captured' } as never);
    createCommercePaymentIntentMock.mockReturnValue(intent as never);
    paymentIntentToOrderStatusMock.mockReturnValue('authorized_stub' as never);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns localized validation errors using the body locale when available', async () => {
    const response = await POST(postRequest('', {
      provider: 'bad',
      locale: 'zh-hant',
      currency: 'TWD',
      amountCents: 12345,
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認付款意圖請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(createCommercePaymentIntentMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid-json errors using the query locale fallback', async () => {
    const response = await POST(postRequest('locale=zh-hant', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認付款意圖請求格式。',
      errorCode: 'invalid_json',
    });
    expect(createCommercePaymentIntentMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid intent errors without leaking raw codes only', async () => {
    captureCommercePaymentIntentMock.mockReturnValueOnce(null);

    const response = await POST(postRequest('', {
      action: 'capture',
      locale: 'ko',
      paymentIntent: { intentId: 'bad-intent' },
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '결제 의도가 유효하지 않습니다.',
      errorCode: 'payment_intent_invalid',
    });
  });

  it('returns localized fallback failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createCommercePaymentIntentMock.mockImplementationOnce(() => {
      throw new Error('payment intent secret leaked');
    });

    const response = await POST(postRequest('', {
      provider: 'sandbox-card',
      locale: 'en',
      currency: 'TWD',
      amountCents: 12345,
    }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to process payment intent.',
      errorCode: 'payment_intent_failed',
    });
    expect(payload.error).not.toContain('payment intent secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/payment-intents] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('creates payment intents while preserving success response shape', async () => {
    const response = await POST(postRequest());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      intent,
      paymentStatus: 'authorized_stub',
    });
    expect(createCommercePaymentIntentMock).toHaveBeenCalledWith({
      provider: 'sandbox-card',
      locale: 'ko',
      currency: 'TWD',
      amountCents: 12345,
      simulateFailure: undefined,
    });
    expect(paymentIntentToOrderStatusMock).toHaveBeenCalledWith(intent);
  });

  it('captures payment intents while preserving success response shape', async () => {
    paymentIntentToOrderStatusMock.mockReturnValueOnce('paid' as never);

    const response = await POST(postRequest('', {
      action: 'capture',
      paymentIntent: intent,
      simulateFailure: false,
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      intent: { ...intent, status: 'captured' },
      paymentStatus: 'paid',
    });
    expect(captureCommercePaymentIntentMock).toHaveBeenCalledWith(intent, { simulateFailure: false });
  });

  it('fails closed for sandbox create and capture in production before provider execution', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const createResponse = await POST(postRequest('', {
      provider: 'sandbox-card',
      locale: 'zh-hant',
      currency: 'TWD',
      amountCents: 12345,
    }));
    expect(createResponse.status).toBe(503);
    await expect(createResponse.json()).resolves.toEqual({
      ok: false,
      error: '所選付款服務提供者尚未在正式環境中設定。',
      errorCode: 'payment_provider_not_configured',
    });

    const captureResponse = await POST(postRequest('', {
      action: 'capture',
      locale: 'en',
      provider: 'manual-invoice',
      paymentIntent: intent,
    }));
    expect(captureResponse.status).toBe(503);
    await expect(captureResponse.json()).resolves.toEqual({
      ok: false,
      error: 'The selected payment provider is not configured for production.',
      errorCode: 'payment_provider_not_configured',
    });

    expect(createCommercePaymentIntentMock).not.toHaveBeenCalled();
    expect(captureCommercePaymentIntentMock).not.toHaveBeenCalled();
    expect(paymentIntentToOrderStatusMock).not.toHaveBeenCalled();
  });
});
