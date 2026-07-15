import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  checkoutAddressErrors,
  checkoutCurrenciesForCurrencySettings,
  checkoutCustomerErrors,
  checkoutCurrencyErrors,
  checkoutLineItemErrors,
  createCommerceCheckoutQuote,
  normalizeCheckoutAddress,
  normalizeCheckoutCustomer,
  normalizeCheckoutCurrency,
  normalizeCheckoutPaymentAdapter,
  normalizeCheckoutShippingMethod,
  type CommerceCheckoutConfirmation,
} from '@/lib/builder/commerce/checkout-shared';
import {
  getCommerceCheckoutApiErrorPayload,
  type CommerceCheckoutApiErrorCode,
} from '@/lib/builder/commerce/checkout-api-copy';
import { loadCurrencySettings } from '@/lib/builder/commerce/currency-engine';
import {
  makeCartItemId,
  normalizeCartState,
  type CommerceCartItem,
  type CommerceCartState,
} from '@/lib/builder/commerce/cart-shared';
import { loadProduct } from '@/lib/builder/commerce/products-engine';
import { createOrder } from '@/lib/builder/commerce/orders-engine';
import { markRecoveryCartsConverted, queueOrderCreatedNotifications } from '@/lib/builder/commerce/notifications-engine';
import { createCommercePaymentIntent, paymentIntentToOrderPayment } from '@/lib/builder/commerce/payment-providers';
import { runOrderBillingAutomation } from '@/lib/builder/billing-document-automation';
import { loadShippingRules } from '@/lib/builder/commerce/shipping-engine';
import { loadTaxRules } from '@/lib/builder/commerce/tax-engine';
import {
  commerceInventoryAvailability,
  type CommerceAvailabilityState,
  type CommerceInventory,
  type CommerceProduct,
  type CommerceProductMedia,
  type CommerceProductVariant,
} from '@/lib/builder/commerce/products-shared';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const checkoutSchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).default('ko'),
  cart: z.unknown(),
  customer: z.unknown(),
  shippingAddress: z.unknown(),
  shippingMethod: z.enum(['digital', 'standard', 'express', 'pickup', 'local-delivery']).default('standard'),
  paymentAdapter: z.enum(['manual-invoice', 'sandbox-card']).default('manual-invoice'),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function errorResponse(
  locale: Locale,
  errorCode: CommerceCheckoutApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
  init?: ResponseInit,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getCommerceCheckoutApiErrorPayload(locale, errorCode), ...extras },
    { ...init, status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function resolveRequestLocale(request: NextRequest, payload?: unknown): Locale {
  if (payload && typeof payload === 'object' && 'locale' in payload) {
    const locale = (payload as { locale?: unknown }).locale;
    if (typeof locale === 'string' && isLocale(locale)) return locale;
  }
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function confirmationNumber(): string {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `TSENG-${stamp}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function isPurchasable(availability: CommerceAvailabilityState): boolean {
  return availability === 'in-stock' || availability === 'low-stock' || availability === 'backorder';
}

function quantityLimit(inventory: CommerceInventory | undefined, availability: CommerceAvailabilityState): number {
  if (!isPurchasable(availability)) return 1;
  if (inventory?.trackInventory && !inventory.allowBackorder) return Math.max(1, inventory.quantity);
  return 99;
}

function sortedMedia(product: CommerceProduct): CommerceProductMedia[] {
  return [...product.media].sort((left, right) => left.sortOrder - right.sortOrder);
}

function activeMedia(product: CommerceProduct, variant: CommerceProductVariant | null): CommerceProductMedia | undefined {
  const media = sortedMedia(product);
  return media.find((item) => item.mediaId === variant?.mediaId) ?? media[0];
}

async function reconcileCheckoutCart(
  cart: CommerceCartState,
  locale: Locale,
): Promise<{ cart: CommerceCartState; errors: string[] }> {
  const errors: string[] = [];
  const items: CommerceCartItem[] = [];

  for (const item of cart.items) {
    const product = await loadProduct(item.productId);
    if (!product || product.locale !== locale || product.status !== 'active') {
      errors.push(`product_unavailable:${item.productId}`);
      continue;
    }
    if (product.currency !== cart.currency) {
      errors.push(`currency_mismatch:${item.productId}`);
      continue;
    }

    const variant = item.variantId
      ? product.variants.find((entry) => entry.variantId === item.variantId) ?? null
      : null;
    if (item.variantId && !variant) {
      errors.push(`variant_unavailable:${item.itemId}`);
      continue;
    }

    const inventory = variant?.inventory ?? product.inventory;
    const availability = commerceInventoryAvailability(inventory, variant?.status ?? 'active');
    if (!isPurchasable(availability)) {
      errors.push(`line_item_unavailable:${item.itemId}`);
      continue;
    }

    const maxQuantity = quantityLimit(inventory, availability);
    if (item.quantity > maxQuantity) {
      errors.push(`quantity_unavailable:${item.itemId}`);
      continue;
    }

    const media = activeMedia(product, variant);
    items.push({
      itemId: makeCartItemId(product.productId, variant?.variantId),
      productId: product.productId,
      productSlug: product.slug,
      variantId: variant?.variantId,
      title: product.title,
      variantTitle: variant?.title,
      sku: variant?.sku ?? product.sku,
      priceCents: variant?.priceCents ?? product.priceCents,
      compareAtPriceCents: variant?.compareAtPriceCents ?? product.compareAtPriceCents,
      currency: product.currency,
      quantity: item.quantity,
      maxQuantity,
      imageUrl: media?.url,
      imageAlt: media?.alt || product.title,
      optionValues: variant?.optionValues ?? {},
    });
  }

  return { cart: { ...cart, items, updatedAt: new Date().toISOString() }, errors };
}

export async function POST(request: NextRequest) {
  let errorLocale = resolveRequestLocale(request);
  // builder-route-guard: allow-public — intentional public visitor endpoint
  const rate = await checkRateLimit(`commerce-checkout:${clientIp(request)}`, 12, 60_000);
  if (!rate.allowed) {
    return errorResponse(
      errorLocale,
      'too_many_requests',
      429,
      undefined,
      { headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) } },
    );
  }

  try {
    const payload = await request.json();
    errorLocale = resolveRequestLocale(request, payload);
    const input = checkoutSchema.parse(payload);
    if (process.env.NODE_ENV === 'production' && input.paymentAdapter === 'sandbox-card') {
      return errorResponse(errorLocale, 'payment_provider_not_configured', 503);
    }
    const currencySettings = await loadCurrencySettings();
    const supportedCurrencies = checkoutCurrenciesForCurrencySettings(currencySettings);
    const requestedCurrency = normalizeCheckoutCurrency(input.cart && typeof input.cart === 'object'
      ? (input.cart as { currency?: unknown }).currency
      : undefined, supportedCurrencies);
    const rawCurrencyErrors = checkoutCurrencyErrors(input.cart, requestedCurrency, supportedCurrencies);
    const rawCart = normalizeCartState(input.cart, input.locale, requestedCurrency);
    const reconciledCart = await reconcileCheckoutCart(rawCart, input.locale);
    const cart = reconciledCart.cart;
    const customer = normalizeCheckoutCustomer(input.customer);
    const shippingAddress = normalizeCheckoutAddress(input.shippingAddress);
    const shippingMethod = normalizeCheckoutShippingMethod(input.shippingMethod);
    const paymentAdapter = normalizeCheckoutPaymentAdapter(input.paymentAdapter);
    const errors = [
      ...rawCurrencyErrors,
      ...reconciledCart.errors,
      ...checkoutLineItemErrors(cart),
      ...checkoutCustomerErrors(customer),
      ...checkoutAddressErrors(shippingAddress),
    ];

    if (errors.length > 0) {
      return errorResponse(errorLocale, 'checkout_validation_error', 400, { errors });
    }

    const taxRules = await loadTaxRules();
    const shippingRules = await loadShippingRules();
    const quote = createCommerceCheckoutQuote(cart, input.locale, shippingMethod, shippingAddress, taxRules, shippingRules);
    const now = new Date().toISOString();
    const paymentIntent = createCommercePaymentIntent({
      provider: paymentAdapter,
      locale: input.locale,
      currency: cart.currency,
      amountCents: quote.totals.grandTotalCents,
      now,
    });
    const payment = paymentIntentToOrderPayment(paymentIntent, input.locale);
    let order = await createOrder({
      confirmationNumber: confirmationNumber(),
      locale: input.locale,
      currency: cart.currency,
      customer,
      shippingAddress,
      lineItems: cart.items,
      couponCode: cart.couponCode,
      shipping: quote.shipping,
      tax: quote.tax,
      totals: quote.totals,
      payment,
      now,
    });
    try {
      const billingAutomation = await runOrderBillingAutomation(order.orderId, { trigger: 'created' });
      if (billingAutomation?.owner) order = billingAutomation.owner;
    } catch (error) {
      console.error('[builder/commerce/checkout] billing automation failed:', error);
    }
    await Promise.allSettled([
      queueOrderCreatedNotifications(order),
      markRecoveryCartsConverted({
        locale: input.locale,
        email: customer.email,
        orderId: order.orderId,
        now,
      }),
    ]);
    const checkout: CommerceCheckoutConfirmation = {
      checkoutId: `chk_${randomUUID()}`,
      orderId: order.orderId,
      confirmationNumber: order.confirmationNumber,
      locale: input.locale,
      currency: cart.currency,
      customer,
      shippingAddress,
      lineItems: cart.items,
      couponCode: cart.couponCode,
      shipping: quote.shipping,
      tax: quote.tax,
      totals: quote.totals,
      payment,
      createdAt: now,
    };

    return NextResponse.json({ ok: true, checkout, quote, order });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    console.error('[builder/commerce/checkout] POST failed:', error);
    return errorResponse(errorLocale, 'checkout_failed', 500);
  }
}
