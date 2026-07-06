import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { captureAbandonedCart } from '@/lib/builder/commerce/notifications-engine';
import { POST } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/commerce/notifications-engine', () => ({
  captureAbandonedCart: vi.fn(async () => ({ recovery, event })),
}));

const recovery = {
  version: 1,
  recoveryId: 'rcv_1',
  locale: 'ko',
  currency: 'TWD',
  email: 'customer@example.com',
  cart: {
    version: 1,
    locale: 'ko',
    currency: 'TWD',
    items: [],
    updatedAt: '2026-06-03T00:00:00.000Z',
  },
  totals: {
    itemCount: 1,
    subtotalCents: 12000,
    discountCents: 0,
    totalCents: 12000,
  },
  status: 'captured',
  recoveryUrl: '/ko/store/checkout',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
  expiresAt: '2026-06-10T00:00:00.000Z',
};

const event = {
  version: 1,
  eventId: 'evt_1',
  type: 'cart.abandoned.customer',
  locale: 'ko',
  channel: 'email',
  status: 'queued',
  recipient: { email: 'customer@example.com' },
  subject: 'Complete your checkout',
  relatedId: 'rcv_1',
  payload: { recoveryId: 'rcv_1' },
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const validPayload = {
  locale: 'ko',
  email: 'customer@example.com',
  currency: 'TWD',
  cart: {
    version: 1,
    locale: 'ko',
    currency: 'TWD',
    items: [{
      itemId: 'product-1::default',
      productId: 'product-1',
      productSlug: 'product',
      title: 'Product',
      sku: 'SKU-1',
      priceCents: 12000,
      currency: 'TWD',
      quantity: 1,
      maxQuantity: 5,
      optionValues: {},
    }],
    updatedAt: '2026-06-03T00:00:00.000Z',
  },
  recoveryUrl: '/ko/store/checkout',
};

const checkRateLimitMock = vi.mocked(checkRateLimit);
const captureAbandonedCartMock = vi.mocked(captureAbandonedCart);

function postRequest(query = '', body: string | unknown = validPayload): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/cart-recovery${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder commerce cart recovery API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterMs: 0 } as never);
    captureAbandonedCartMock.mockResolvedValue({ recovery, event } as never);
  });

  it('returns localized rate-limit errors using the query locale', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfterMs: 2100 } as never);

    const response = await POST(postRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('3');
    expect(payload).toEqual({
      ok: false,
      error: '請求過於頻繁，請稍後再試。',
      errorCode: 'too_many_requests',
    });
    expect(captureAbandonedCartMock).not.toHaveBeenCalled();
  });

  it('returns localized validation errors using the body locale', async () => {
    const response = await POST(postRequest('', {
      ...validPayload,
      locale: 'zh-hant',
      email: 'bad',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認購物車復原請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(captureAbandonedCartMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid-json errors using the query locale fallback', async () => {
    const response = await POST(postRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the cart recovery request format.',
      errorCode: 'invalid_json',
    });
    expect(captureAbandonedCartMock).not.toHaveBeenCalled();
  });

  it('returns localized empty-cart errors without leaking engine exception details', async () => {
    captureAbandonedCartMock.mockRejectedValueOnce(new Error('commerce_recovery_cart_empty'));

    const response = await POST(postRequest('', validPayload));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '복구할 장바구니가 비어 있습니다.',
      errorCode: 'cart_empty',
    });
    expect(JSON.stringify(payload)).not.toContain('commerce_recovery_cart_empty');
  });

  it('returns localized fallback failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    captureAbandonedCartMock.mockRejectedValueOnce(new Error('cart recovery secret leaked'));

    const response = await POST(postRequest('', validPayload));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '장바구니 복구 정보를 저장하지 못했습니다.',
      errorCode: 'cart_recovery_failed',
    });
    expect(payload.error).not.toContain('cart recovery secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/cart-recovery] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('captures cart recovery while preserving success response shape', async () => {
    const response = await POST(postRequest());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, recovery, event });
    expect(captureAbandonedCartMock).toHaveBeenCalledWith(validPayload);
  });
});
