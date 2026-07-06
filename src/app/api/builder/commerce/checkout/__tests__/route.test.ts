import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { DEFAULT_COMMERCE_CURRENCY_SETTINGS } from '@/lib/builder/commerce/currency-shared';
import { loadCurrencySettings } from '@/lib/builder/commerce/currency-engine';
import { loadProduct } from '@/lib/builder/commerce/products-engine';
import { createOrder } from '@/lib/builder/commerce/orders-engine';
import {
  markRecoveryCartsConverted,
  queueOrderCreatedNotifications,
} from '@/lib/builder/commerce/notifications-engine';
import { createCommercePaymentIntent, paymentIntentToOrderPayment } from '@/lib/builder/commerce/payment-providers';
import { runOrderBillingAutomation } from '@/lib/builder/billing-document-automation';
import { loadShippingRules } from '@/lib/builder/commerce/shipping-engine';
import { loadTaxRules } from '@/lib/builder/commerce/tax-engine';
import { POST } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/commerce/currency-engine', () => ({
  loadCurrencySettings: vi.fn(async () => DEFAULT_COMMERCE_CURRENCY_SETTINGS),
}));

vi.mock('@/lib/builder/commerce/products-engine', () => ({
  loadProduct: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/commerce/orders-engine', () => ({
  createOrder: vi.fn(async () => order),
}));

vi.mock('@/lib/builder/commerce/notifications-engine', () => ({
  markRecoveryCartsConverted: vi.fn(async () => undefined),
  queueOrderCreatedNotifications: vi.fn(async () => []),
}));

vi.mock('@/lib/builder/commerce/payment-providers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/commerce/payment-providers')>();
  return {
    ...actual,
    createCommercePaymentIntent: vi.fn(() => paymentIntent),
    paymentIntentToOrderPayment: vi.fn(() => payment),
  };
});

vi.mock('@/lib/builder/billing-document-automation', () => ({
  runOrderBillingAutomation: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/commerce/shipping-engine', () => ({
  loadShippingRules: vi.fn(async () => []),
}));

vi.mock('@/lib/builder/commerce/tax-engine', () => ({
  loadTaxRules: vi.fn(async () => []),
}));

const product = {
  productId: 'product-1',
  locale: 'ko',
  slug: 'product',
  title: 'Product',
  description: 'Product description',
  body: 'Product body',
  status: 'active',
  sku: 'SKU-1',
  priceCents: 12000,
  currency: 'TWD',
  inventory: {
    trackInventory: false,
    quantity: 0,
    lowStockThreshold: 0,
    allowBackorder: true,
  },
  media: [{ mediaId: 'cover', type: 'image', url: '/product.jpg', alt: 'Product', sortOrder: 1 }],
  options: [],
  variants: [],
  categoryIds: ['consultation'],
  tags: ['featured'],
  seo: {},
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const paymentIntent = {
  version: 1,
  intentId: 'pi_test',
  provider: 'manual-invoice',
  locale: 'ko',
  currency: 'TWD',
  amountCents: 24000,
  status: 'requires_manual_payment',
  stub: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const payment = {
  adapter: 'manual-invoice',
  status: 'requires_manual_payment',
  label: '수동 송장 결제',
  stub: true,
  referenceId: 'pi_test',
};

const order = {
  orderId: 'order-1',
  confirmationNumber: 'TSENG-20260603-ABC12345',
  locale: 'ko',
  currency: 'TWD',
  customer: { name: 'Customer', email: 'customer@example.com' },
  shippingAddress: {
    country: 'TW',
    region: 'Taipei',
    city: 'Taipei',
    postalCode: '100',
    addressLine1: 'No. 1 Road',
  },
  lineItems: [],
  shipping: { method: 'standard', amountCents: 12000, label: 'Standard' },
  tax: { country: 'TW', rateBps: 500, amountCents: 1800 },
  totals: {
    itemCount: 1,
    subtotalCents: 12000,
    discountCents: 0,
    totalCents: 12000,
    shippingCents: 12000,
    taxCents: 1200,
    grandTotalCents: 25200,
  },
  payment,
};

const cart = {
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
};

const validPayload = {
  locale: 'ko',
  cart,
  customer: { name: 'Customer', email: 'customer@example.com' },
  shippingAddress: {
    country: 'TW',
    region: 'Taipei',
    city: 'Taipei',
    postalCode: '100',
    addressLine1: 'No. 1 Road',
  },
  shippingMethod: 'standard',
  paymentAdapter: 'manual-invoice',
};

const checkRateLimitMock = vi.mocked(checkRateLimit);
const loadCurrencySettingsMock = vi.mocked(loadCurrencySettings);
const loadProductMock = vi.mocked(loadProduct);
const createOrderMock = vi.mocked(createOrder);
const markRecoveryCartsConvertedMock = vi.mocked(markRecoveryCartsConverted);
const queueOrderCreatedNotificationsMock = vi.mocked(queueOrderCreatedNotifications);
const createCommercePaymentIntentMock = vi.mocked(createCommercePaymentIntent);
const paymentIntentToOrderPaymentMock = vi.mocked(paymentIntentToOrderPayment);
const runOrderBillingAutomationMock = vi.mocked(runOrderBillingAutomation);
const loadShippingRulesMock = vi.mocked(loadShippingRules);
const loadTaxRulesMock = vi.mocked(loadTaxRules);

function postRequest(query = '', body: string | unknown = validPayload): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/checkout${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder commerce checkout API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterMs: 0 } as never);
    loadCurrencySettingsMock.mockResolvedValue(DEFAULT_COMMERCE_CURRENCY_SETTINGS as never);
    loadProductMock.mockResolvedValue(product as never);
    createOrderMock.mockResolvedValue(order as never);
    markRecoveryCartsConvertedMock.mockResolvedValue(undefined as never);
    queueOrderCreatedNotificationsMock.mockResolvedValue([] as never);
    createCommercePaymentIntentMock.mockReturnValue(paymentIntent as never);
    paymentIntentToOrderPaymentMock.mockReturnValue(payment as never);
    runOrderBillingAutomationMock.mockResolvedValue(null);
    loadShippingRulesMock.mockResolvedValue([] as never);
    loadTaxRulesMock.mockResolvedValue([] as never);
  });

  it('returns localized rate-limit errors using the query locale', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfterMs: 2500 } as never);

    const response = await POST(postRequest('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('3');
    expect(payload).toEqual({
      ok: false,
      error: '請求過於頻繁，請稍後再試。',
      errorCode: 'too_many_requests',
    });
    expect(loadCurrencySettingsMock).not.toHaveBeenCalled();
  });

  it('returns localized schema validation errors using the body locale', async () => {
    const response = await POST(postRequest('', {
      ...validPayload,
      locale: 'zh-hant',
      paymentAdapter: 'bad',
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認結帳請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(loadCurrencySettingsMock).not.toHaveBeenCalled();
  });

  it('returns localized checkout validation errors while preserving error details', async () => {
    const response = await POST(postRequest('', {
      ...validPayload,
      locale: 'ko',
      customer: { name: '', email: 'bad' },
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '체크아웃 정보를 확인해 주세요.',
      errorCode: 'checkout_validation_error',
      errors: ['name_required', 'email_invalid'],
    });
    expect(createOrderMock).not.toHaveBeenCalled();
  });

  it('returns localized invalid-json errors using the query locale fallback', async () => {
    const response = await POST(postRequest('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the checkout request format.',
      errorCode: 'invalid_json',
    });
    expect(loadCurrencySettingsMock).not.toHaveBeenCalled();
  });

  it('returns localized fallback failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createOrderMock.mockRejectedValueOnce(new Error('checkout storage secret leaked'));

    const response = await POST(postRequest('', validPayload));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '체크아웃을 완료하지 못했습니다.',
      errorCode: 'checkout_failed',
    });
    expect(payload.error).not.toContain('checkout storage secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/checkout] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('creates checkout orders while preserving success response shape', async () => {
    const response = await POST(postRequest());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      checkout: {
        orderId: 'order-1',
        confirmationNumber: 'TSENG-20260603-ABC12345',
        locale: 'ko',
        currency: 'TWD',
        customer: { name: 'Customer', email: 'customer@example.com' },
        payment,
      },
      quote: {
        locale: 'ko',
        currency: 'TWD',
      },
      order,
    });
    expect(payload.checkout.checkoutId).toMatch(/^chk_/);
    expect(loadProductMock).toHaveBeenCalledWith('product-1');
    expect(createCommercePaymentIntentMock).toHaveBeenCalledWith(expect.objectContaining({
      provider: 'manual-invoice',
      locale: 'ko',
      currency: 'TWD',
    }));
    expect(createOrderMock).toHaveBeenCalledWith(expect.objectContaining({
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Customer', email: 'customer@example.com', phone: undefined },
    }));
    expect(queueOrderCreatedNotificationsMock).toHaveBeenCalledWith(order);
    expect(markRecoveryCartsConvertedMock).toHaveBeenCalledWith(expect.objectContaining({
      locale: 'ko',
      email: 'customer@example.com',
      orderId: 'order-1',
    }));
  });
});
