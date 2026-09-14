import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
  stub: false,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const payment = {
  adapter: 'manual-invoice',
  status: 'requires_manual_payment',
  label: '수동 송장 결제',
  stub: false,
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

  afterEach(() => {
    vi.unstubAllEnvs();
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

  it('fails closed for sandbox checkout in production before order or payment mutation', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const response = await POST(postRequest('', {
      ...validPayload,
      locale: 'en',
      paymentAdapter: 'sandbox-card',
    }));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'The selected payment provider is not configured for production.',
      errorCode: 'payment_provider_not_configured',
    });
    expect(loadCurrencySettingsMock).not.toHaveBeenCalled();
    expect(createCommercePaymentIntentMock).not.toHaveBeenCalled();
    expect(paymentIntentToOrderPaymentMock).not.toHaveBeenCalled();
    expect(createOrderMock).not.toHaveBeenCalled();
    expect(queueOrderCreatedNotificationsMock).not.toHaveBeenCalled();
    expect(markRecoveryCartsConvertedMock).not.toHaveBeenCalled();
  });
  describe('aggregate inventory before checkout effects', () => {
    const tracked = { trackInventory: true, quantity: 1, lowStockThreshold: 0, allowBackorder: false };
    const variant = (variantId: string, inventory: unknown = tracked) => ({
      variantId, title: variantId, sku: variantId, priceCents: 12000, status: 'active', optionValues: {}, inventory,
    });
    const row = (itemId: string, variantId?: string) => ({ ...cart.items[0], itemId, variantId });
    const cases = [
      { name: 'same supplied IDs exceeding product stock', items: [row('same'), row('same')], variants: [], inventory: tracked, status: 400 },
      { name: 'different supplied IDs exceeding product stock', items: [row('one'), row('two')], variants: [], inventory: tracked, status: 400 },
      { name: 'same variant stock shared across rows', items: [row('one', 'a'), row('two', 'a')], variants: [variant('a')], inventory: tracked, status: 400 },
      // Defensive route fallback: normal loadProduct materializes variant inventory.
      { name: 'missing variant inventories share product fallback', items: [row('one', 'a'), row('two', 'b')], variants: [variant('a', null), variant('b', null)], inventory: tracked, status: 400 },
      { name: 'base row and missing variant inventory share product fallback', items: [row('one'), row('two', 'a')], variants: [variant('a', null)], inventory: tracked, status: 400 },
      { name: 'independent variant inventories stay independent', items: [row('one', 'a'), row('two', 'b')], variants: [variant('a'), variant('b')], inventory: tracked, status: 200 },
      { name: 'single legitimate item', items: [row('one')], variants: [], inventory: tracked, status: 200 },
      { name: 'within-stock duplicates preserve both rows', items: [row('one'), row('two')], variants: [], inventory: { ...tracked, quantity: 2 }, status: 200 },
      { name: 'untracked stock permits duplicates', items: [row('one'), row('two')], variants: [], inventory: { ...tracked, trackInventory: false }, status: 200 },
      { name: 'backorder permits duplicates beyond stock', items: [row('one'), row('two')], variants: [], inventory: { ...tracked, allowBackorder: true }, status: 200 },
      { name: 'missing variant remains rejected', items: [row('one', 'missing')], variants: [], inventory: tracked, status: 400 },
    ];
    it.each(cases)('$name', async ({ items, variants, inventory, status }) => {
      loadProductMock.mockResolvedValue({ ...product, variants, inventory } as never);
      const response = await POST(postRequest('', { ...validPayload, cart: { ...cart, items } }));
      expect(response.status).toBe(status);
      const body = await response.json();
      if (status === 400) {
        expect(body).toMatchObject({ ok: false, errorCode: 'checkout_validation_error' });
        expect(createCommercePaymentIntentMock).not.toHaveBeenCalled();
        expect(createOrderMock).not.toHaveBeenCalled();
        expect(runOrderBillingAutomationMock).not.toHaveBeenCalled();
        expect(queueOrderCreatedNotificationsMock).not.toHaveBeenCalled();
        expect(markRecoveryCartsConvertedMock).not.toHaveBeenCalled();
      } else {
        expect(createOrderMock).toHaveBeenCalledTimes(1);
        const submitted = createOrderMock.mock.calls[0][0].lineItems;
        expect(submitted).toHaveLength(items.length);
        expect(submitted.map((item) => item.quantity)).toEqual(items.map((item) => item.quantity));
        expect(submitted.map((item) => item.variantId)).toEqual(items.map((item) => item.variantId));
        expect(body.checkout.lineItems).toEqual(submitted);
      }
    });
    it('does not combine stock from different products with the same supplied itemId', async () => {
      loadProductMock.mockImplementation(async (id) => ({ ...product, productId: id, inventory: tracked }) as never);
      const response = await POST(postRequest('', { ...validPayload, cart: { ...cart, items: [row('same'), { ...row('same'), productId: 'product-2' }] } }));
      expect(response.status).toBe(200);
      expect(createOrderMock.mock.calls[0][0].lineItems.map((item) => item.productId)).toEqual(['product-1', 'product-2']);
    });
  });

});
