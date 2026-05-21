import { describe, expect, it } from 'vitest';
import { makeCartItemId, makeEmptyCart, setCartCoupon, upsertCartItem, type CommerceCartItem } from '../cart-shared';
import { calculateCartDiscount } from '../discounts-shared';

function item(overrides: Partial<CommerceCartItem> = {}): CommerceCartItem {
  return {
    itemId: makeCartItemId('product-discount', 'variant-a'),
    productId: 'product-discount',
    productSlug: 'product-discount',
    variantId: 'variant-a',
    title: 'Discount Product',
    sku: 'DISC-SKU',
    priceCents: 34000,
    currency: 'TWD',
    quantity: 1,
    maxQuantity: 4,
    optionValues: {},
    ...overrides,
  };
}

describe('commerce discount shared helpers', () => {
  it('applies percent and fixed discount rules with caps and minimums', () => {
    const percentCart = setCartCoupon(upsertCartItem(makeEmptyCart('ko', 'TWD'), item(), 2), 'save10');
    expect(calculateCartDiscount(percentCart, 68000)).toMatchObject({
      code: 'SAVE10',
      applied: true,
      discountCents: 6800,
    });

    const fixedCart = setCartCoupon(upsertCartItem(makeEmptyCart('ko', 'TWD'), item(), 1), 'welcome');
    expect(calculateCartDiscount(fixedCart, 34000)).toMatchObject({
      code: 'WELCOME',
      applied: true,
      discountCents: 5000,
    });
  });

  it('rejects invalid, inactive, locale-mismatched, and below-minimum coupons', () => {
    const cart = setCartCoupon(upsertCartItem(makeEmptyCart('ko', 'TWD'), item({ priceCents: 5000 }), 1), 'KRONLY');
    expect(calculateCartDiscount(cart, 5000, [
      { code: 'KRONLY', type: 'percent', value: 20, active: true, locale: 'en', minSubtotalCents: 10000 },
    ])).toMatchObject({ applied: false, reason: 'locale_mismatch' });

    expect(calculateCartDiscount(setCartCoupon(cart, 'missing'), 5000)).toMatchObject({
      applied: false,
      reason: 'not_found',
    });
  });
});
