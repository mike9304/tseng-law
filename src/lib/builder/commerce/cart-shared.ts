import type { Locale } from '@/lib/locales';
import type { CommerceCurrency } from './products-shared';
import { calculateCartDiscount, type CommerceDiscountRule, type CommerceDiscountResult } from './discounts-shared';

export const COMMERCE_CART_VERSION = 1;

export interface CommerceCartItem {
  itemId: string;
  productId: string;
  productSlug: string;
  variantId?: string;
  title: string;
  variantTitle?: string;
  sku: string;
  priceCents: number;
  compareAtPriceCents?: number;
  currency: CommerceCurrency;
  quantity: number;
  maxQuantity: number;
  imageUrl?: string;
  imageAlt?: string;
  optionValues: Record<string, string>;
}

export interface CommerceCartState {
  version: typeof COMMERCE_CART_VERSION;
  locale: Locale;
  currency: CommerceCurrency;
  items: CommerceCartItem[];
  couponCode?: string;
  updatedAt: string;
}

export interface CommerceCartTotals {
  itemCount: number;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  couponCode?: string;
  discount?: CommerceDiscountResult;
}

export function commerceCartStorageKey(locale: Locale): string {
  return `tseng-commerce-cart-v${COMMERCE_CART_VERSION}:${locale}`;
}

export function makeCartItemId(productId: string, variantId?: string): string {
  return `${productId}::${variantId || 'default'}`;
}

export function makeEmptyCart(locale: Locale, currency: CommerceCurrency): CommerceCartState {
  return {
    version: COMMERCE_CART_VERSION,
    locale,
    currency,
    items: [],
    updatedAt: new Date().toISOString(),
  };
}

function clampQuantity(quantity: number, maxQuantity: number): number {
  const max = Number.isFinite(maxQuantity) && maxQuantity > 0 ? Math.floor(maxQuantity) : 1;
  const value = Number.isFinite(quantity) ? Math.floor(quantity) : 1;
  return Math.min(Math.max(1, value), max);
}

function normalizeItem(input: unknown, currency: CommerceCurrency): CommerceCartItem | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<CommerceCartItem>;
  if (!source.itemId || !source.productId || !source.productSlug || !source.title || !source.sku) return null;
  if (source.currency !== currency) return null;
  const priceCents = Number(source.priceCents);
  if (!Number.isFinite(priceCents) || priceCents < 0) return null;
  const maxQuantity = Number.isFinite(source.maxQuantity) ? Number(source.maxQuantity) : 1;
  return {
    itemId: String(source.itemId),
    productId: String(source.productId),
    productSlug: String(source.productSlug),
    variantId: source.variantId ? String(source.variantId) : undefined,
    title: String(source.title),
    variantTitle: source.variantTitle ? String(source.variantTitle) : undefined,
    sku: String(source.sku),
    priceCents: Math.floor(priceCents),
    compareAtPriceCents: Number.isFinite(source.compareAtPriceCents) ? Math.floor(Number(source.compareAtPriceCents)) : undefined,
    currency,
    quantity: clampQuantity(Number(source.quantity), maxQuantity),
    maxQuantity: Math.max(1, Math.floor(maxQuantity)),
    imageUrl: source.imageUrl ? String(source.imageUrl) : undefined,
    imageAlt: source.imageAlt ? String(source.imageAlt) : undefined,
    optionValues: source.optionValues && typeof source.optionValues === 'object'
      ? Object.fromEntries(Object.entries(source.optionValues).map(([key, value]) => [key, String(value)]))
      : {},
  };
}

export function normalizeCartState(
  input: unknown,
  locale: Locale,
  currency: CommerceCurrency,
): CommerceCartState {
  if (!input || typeof input !== 'object') return makeEmptyCart(locale, currency);
  const source = input as Partial<CommerceCartState>;
  if (source.version !== COMMERCE_CART_VERSION || source.locale !== locale || source.currency !== currency) {
    return makeEmptyCart(locale, currency);
  }
  const items = Array.isArray(source.items)
    ? source.items.map((item) => normalizeItem(item, currency)).filter((item): item is CommerceCartItem => Boolean(item))
    : [];
  const couponCode = typeof source.couponCode === 'string' && source.couponCode.trim()
    ? source.couponCode.trim().toUpperCase().slice(0, 32)
    : undefined;
  return {
    version: COMMERCE_CART_VERSION,
    locale,
    currency,
    items,
    couponCode,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : new Date().toISOString(),
  };
}

function stamp(cart: CommerceCartState): CommerceCartState {
  return { ...cart, updatedAt: new Date().toISOString() };
}

export function upsertCartItem(
  cart: CommerceCartState,
  item: CommerceCartItem,
  quantity: number,
): CommerceCartState {
  if (item.currency !== cart.currency) return cart;
  const nextQuantity = clampQuantity(quantity, item.maxQuantity);
  const existing = cart.items.find((entry) => entry.itemId === item.itemId);
  const items = existing
    ? cart.items.map((entry) => (
        entry.itemId === item.itemId
          ? { ...item, quantity: clampQuantity(entry.quantity + nextQuantity, item.maxQuantity) }
          : entry
      ))
    : [...cart.items, { ...item, quantity: nextQuantity }];
  return stamp({ ...cart, items });
}

export function updateCartItemQuantity(
  cart: CommerceCartState,
  itemId: string,
  quantity: number,
): CommerceCartState {
  return stamp({
    ...cart,
    items: cart.items.map((item) => (
      item.itemId === itemId ? { ...item, quantity: clampQuantity(quantity, item.maxQuantity) } : item
    )),
  });
}

export function removeCartItem(cart: CommerceCartState, itemId: string): CommerceCartState {
  return stamp({
    ...cart,
    items: cart.items.filter((item) => item.itemId !== itemId),
  });
}

export function setCartCoupon(cart: CommerceCartState, couponCode: string): CommerceCartState {
  const normalized = couponCode.trim().toUpperCase().slice(0, 32);
  return stamp({
    ...cart,
    couponCode: normalized || undefined,
  });
}

export function commerceCartTotals(
  cart: CommerceCartState,
  rules?: CommerceDiscountRule[],
  now?: Date,
): CommerceCartTotals {
  const subtotalCents = cart.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  const discount = calculateCartDiscount(cart, subtotalCents, rules, now);
  const discountCents = discount.applied ? discount.discountCents : 0;
  return {
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotalCents,
    discountCents,
    totalCents: Math.max(0, subtotalCents - discountCents),
    couponCode: cart.couponCode,
    discount,
  };
}
