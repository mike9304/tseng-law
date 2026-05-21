import { describe, expect, it } from 'vitest';
import {
  commerceCartStorageKey,
  commerceCartTotals,
  makeCartItemId,
  makeEmptyCart,
  normalizeCartState,
  removeCartItem,
  setCartCoupon,
  updateCartItemQuantity,
  upsertCartItem,
  type CommerceCartItem,
} from '../cart-shared';

function item(overrides: Partial<CommerceCartItem> = {}): CommerceCartItem {
  return {
    itemId: makeCartItemId('product-1', 'variant-a'),
    productId: 'product-1',
    productSlug: 'product-one',
    variantId: 'variant-a',
    title: 'Product One',
    variantTitle: 'PDF',
    sku: 'SKU-1-A',
    priceCents: 12000,
    currency: 'TWD',
    quantity: 1,
    maxQuantity: 3,
    optionValues: { Format: 'PDF' },
    ...overrides,
  };
}

describe('commerce cart shared helpers', () => {
  it('uses a locale-scoped storage key', () => {
    expect(commerceCartStorageKey('ko')).toBe('tseng-commerce-cart-v1:ko');
  });

  it('adds, merges, clamps, updates, and removes items', () => {
    const empty = makeEmptyCart('ko', 'TWD');
    const added = upsertCartItem(empty, item(), 2);
    expect(added.items).toHaveLength(1);
    expect(added.items[0]?.quantity).toBe(2);

    const merged = upsertCartItem(added, item({ priceCents: 13000 }), 2);
    expect(merged.items).toHaveLength(1);
    expect(merged.items[0]).toMatchObject({ priceCents: 13000, quantity: 3 });

    const updated = updateCartItemQuantity(merged, item().itemId, 1);
    expect(updated.items[0]?.quantity).toBe(1);

    const removed = removeCartItem(updated, item().itemId);
    expect(removed.items).toEqual([]);
  });

  it('normalizes persisted state and rejects stale currency/version payloads', () => {
    const raw = {
      version: 1,
      locale: 'ko',
      currency: 'TWD',
      items: [
        item({ quantity: 99, maxQuantity: 2 }),
        item({ itemId: 'bad-currency', currency: 'USD' }),
        { itemId: 'missing-fields' },
      ],
      couponCode: ' welcome10 ',
      updatedAt: '2026-05-20T00:00:00.000Z',
    };

    const cart = normalizeCartState(raw, 'ko', 'TWD');
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]?.quantity).toBe(2);
    expect(cart.couponCode).toBe('WELCOME10');
    expect(normalizeCartState({ ...raw, currency: 'USD' }, 'ko', 'TWD').items).toHaveLength(0);
  });

  it('applies coupon discount rules in cart totals', () => {
    const cart = setCartCoupon(upsertCartItem(makeEmptyCart('ko', 'TWD'), item(), 2), 'spring');
    expect(commerceCartTotals(cart)).toMatchObject({
      itemCount: 2,
      subtotalCents: 24000,
      discountCents: 0,
      totalCents: 24000,
      couponCode: 'SPRING',
      discount: { applied: false, reason: 'not_found' },
    });

    const discounted = setCartCoupon(upsertCartItem(makeEmptyCart('ko', 'TWD'), item({ priceCents: 34000 }), 2), 'save10');
    expect(commerceCartTotals(discounted)).toMatchObject({
      subtotalCents: 68000,
      discountCents: 6800,
      totalCents: 61200,
      couponCode: 'SAVE10',
      discount: { applied: true },
    });
  });
});
