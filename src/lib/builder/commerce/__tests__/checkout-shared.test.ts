import { describe, expect, it } from 'vitest';
import {
  checkoutAddressErrors,
  checkoutCustomerErrors,
  checkoutCurrencyErrors,
  checkoutLineItemErrors,
  commerceCheckoutConfirmationStorageKey,
  createCommerceCheckoutQuote,
  normalizeCheckoutAddress,
  normalizeCheckoutCurrency,
  normalizeCheckoutPaymentAdapter,
  normalizeCheckoutShippingMethod,
} from '../checkout-shared';
import {
  makeCartItemId,
  makeEmptyCart,
  setCartCoupon,
  upsertCartItem,
  type CommerceCartItem,
} from '../cart-shared';

function cartItem(overrides: Partial<CommerceCartItem> = {}): CommerceCartItem {
  return {
    itemId: makeCartItemId('product-f60', 'variant-a'),
    productId: 'product-f60',
    productSlug: 'product-f60',
    variantId: 'variant-a',
    title: 'F60 Product',
    sku: 'F60-SKU',
    priceCents: 34000,
    currency: 'TWD',
    quantity: 1,
    maxQuantity: 4,
    optionValues: { Format: 'Consultation' },
    ...overrides,
  };
}

describe('commerce checkout shared helpers', () => {
  it('normalizes checkout method, adapter, address, and storage keys', () => {
    expect(commerceCheckoutConfirmationStorageKey('ko')).toBe('tseng-commerce-checkout-confirmation-v1:ko');
    expect(normalizeCheckoutShippingMethod('express')).toBe('express');
    expect(normalizeCheckoutShippingMethod('bad')).toBe('standard');
    expect(normalizeCheckoutPaymentAdapter('sandbox-card')).toBe('sandbox-card');
    expect(normalizeCheckoutPaymentAdapter('bad')).toBe('manual-invoice');
    expect(normalizeCheckoutAddress({
      country: 'tw',
      region: ' Taipei ',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: ' 1 Road ',
    })).toMatchObject({
      country: 'TW',
      region: 'Taipei',
      addressLine1: '1 Road',
    });
  });

  it('calculates server-side shipping, tax, and grand total quotes', () => {
    const cart = setCartCoupon(upsertCartItem(makeEmptyCart('ko', 'TWD'), cartItem(), 2), 'SAVE10');
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'standard', normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: '1 Road',
    }));

    expect(quote.shipping).toMatchObject({ method: 'standard', amountCents: 12000 });
    expect(quote.tax).toMatchObject({ country: 'TW', rateBps: 500, amountCents: 3660 });
    expect(quote.totals).toMatchObject({
      itemCount: 2,
      subtotalCents: 68000,
      discountCents: 6800,
      totalCents: 61200,
      shippingCents: 12000,
      taxCents: 3660,
      grandTotalCents: 76860,
    });
  });

  it('keeps validation boundaries separate from order persistence', () => {
    expect(checkoutCustomerErrors({ name: '', email: 'bad' })).toEqual(['name_required', 'email_invalid']);
    expect(checkoutAddressErrors(normalizeCheckoutAddress({}))).toContain('address_line_1_required');
    expect(checkoutLineItemErrors(makeEmptyCart('ko', 'TWD'))).toEqual(['cart_empty']);
  });

  it('makes checkout currency restrictions explicit', () => {
    expect(normalizeCheckoutCurrency('USD')).toBe('USD');
    expect(normalizeCheckoutCurrency('EUR')).toBe('TWD');
    expect(checkoutCurrencyErrors({
      version: 1,
      locale: 'ko',
      currency: 'TWD',
      items: [
        cartItem({ currency: 'TWD' }),
        cartItem({ itemId: makeCartItemId('product-f60-usd'), productId: 'product-f60-usd', currency: 'USD' }),
      ],
    })).toEqual(['cart_mixed_currency']);
    expect(checkoutCurrencyErrors({
      version: 1,
      locale: 'ko',
      currency: 'EUR',
      items: [
        { ...cartItem(), currency: 'EUR' },
      ],
    })).toEqual(['currency_unsupported', 'cart_mixed_currency']);
    expect(normalizeCheckoutCurrency('USD', ['TWD'])).toBe('TWD');
    expect(checkoutCurrencyErrors({
      version: 1,
      locale: 'ko',
      currency: 'USD',
      items: [
        cartItem({ currency: 'USD' }),
      ],
    }, 'TWD', ['TWD'])).toEqual(['currency_unsupported', 'cart_mixed_currency']);
  });
});
