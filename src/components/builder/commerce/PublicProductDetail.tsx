'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@/lib/locales';
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
} from '@/lib/builder/commerce/cart-shared';
import {
  commerceInventoryAvailability,
  slugifyProductCategory,
  type CommerceAvailabilityState,
  type CommerceCurrency,
  type CommerceInventory,
  type CommerceProduct,
  type CommerceProductCategory,
  type CommerceProductMedia,
  type CommerceProductOption,
  type CommerceProductVariant,
} from '@/lib/builder/commerce/products-shared';
import styles from './PublicProductDetail.module.css';

type DetailCopy = {
  back: string;
  collection: string;
  mediaThumbnails: string;
  status: string;
  details: string;
  mediaFallback: string;
  options: string;
  quantity: string;
  related: string;
  addToCart: string;
  applyCoupon: string;
  cartTitle: string;
  sku: string;
  closeCart: string;
  coupon: string;
  couponSaved: string;
  discount: string;
  emptyCart: string;
  openCart: string;
  remove: string;
  tags: string;
  cartPending: string;
  cartUnavailable: string;
  checkoutPending: string;
  noVariant: string;
  subtotal: string;
  total: string;
  uncategorized: string;
};

const copy: Record<Locale, DetailCopy> = {
  ko: {
    back: '스토어로 돌아가기',
    collection: '컬렉션',
    mediaThumbnails: '상품 썸네일',
    status: '상태',
    details: '상세 정보',
    mediaFallback: '상품 이미지',
    options: '옵션',
    quantity: '수량',
    related: '관련 상품',
    addToCart: '장바구니 담기',
    applyCoupon: '적용',
    cartTitle: '장바구니',
    sku: 'SKU',
    closeCart: '닫기',
    coupon: '쿠폰 코드',
    couponSaved: '쿠폰 코드 저장됨',
    discount: '할인',
    emptyCart: '장바구니가 비어 있습니다.',
    openCart: '장바구니',
    remove: '삭제',
    tags: '태그',
    cartPending: '장바구니 담기',
    cartUnavailable: '현재 선택은 구매할 수 없습니다',
    checkoutPending: '결제 진행',
    noVariant: '선택 가능한 조합이 없습니다',
    subtotal: '소계',
    total: '합계',
    uncategorized: '컬렉션',
  },
  'zh-hant': {
    back: '返回商店',
    collection: '系列',
    mediaThumbnails: '商品縮圖',
    status: '狀態',
    details: '商品詳情',
    mediaFallback: '商品圖片',
    options: '選項',
    quantity: '數量',
    related: '相關商品',
    addToCart: '加入購物車',
    applyCoupon: '套用',
    cartTitle: '購物車',
    sku: 'SKU',
    closeCart: '關閉',
    coupon: '優惠碼',
    couponSaved: '優惠碼已保存',
    discount: '折扣',
    emptyCart: '購物車是空的。',
    openCart: '購物車',
    remove: '移除',
    tags: '標籤',
    cartPending: '加入購物車',
    cartUnavailable: '目前選項無法購買',
    checkoutPending: '前往結帳',
    noVariant: '沒有可用的組合',
    subtotal: '小計',
    total: '總計',
    uncategorized: '系列',
  },
  en: {
    back: 'Back to store',
    collection: 'Collection',
    mediaThumbnails: 'Product thumbnails',
    status: 'Status',
    details: 'Details',
    mediaFallback: 'Product image',
    options: 'Options',
    quantity: 'Quantity',
    related: 'Related products',
    addToCart: 'Add to cart',
    applyCoupon: 'Apply',
    cartTitle: 'Cart',
    sku: 'SKU',
    closeCart: 'Close',
    coupon: 'Coupon code',
    couponSaved: 'Coupon code saved',
    discount: 'Discount',
    emptyCart: 'Your cart is empty.',
    openCart: 'Cart',
    remove: 'Remove',
    tags: 'Tags',
    cartPending: 'Add to cart',
    cartUnavailable: 'This selection is not available',
    checkoutPending: 'Checkout',
    noVariant: 'No available combination',
    subtotal: 'Subtotal',
    total: 'Total',
    uncategorized: 'Collection',
  },
};

const availabilityCopy: Record<Locale, Record<CommerceAvailabilityState, string>> = {
  ko: {
    'in-stock': '판매 중',
    'low-stock': '재고 적음',
    'out-of-stock': '품절',
    backorder: '예약 주문',
    disabled: '판매 중지',
  },
  'zh-hant': {
    'in-stock': '供應中',
    'low-stock': '庫存偏低',
    'out-of-stock': '缺貨',
    backorder: '可預訂',
    disabled: '已停用',
  },
  en: {
    'in-stock': 'In stock',
    'low-stock': 'Low stock',
    'out-of-stock': 'Out of stock',
    backorder: 'Backorder',
    disabled: 'Unavailable',
  },
};

interface PublicProductDetailProps {
  locale: Locale;
  product: CommerceProduct;
  categories: CommerceProductCategory[];
  relatedProducts: CommerceProduct[];
}

function sortedMedia(product: CommerceProduct): CommerceProductMedia[] {
  return [...product.media].sort((left, right) => left.sortOrder - right.sortOrder);
}

function formatPrice(locale: Locale, currency: CommerceCurrency, cents: number): string {
  return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : locale === 'zh-hant' ? 'zh-TW' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'TWD' || currency === 'KRW' ? 0 : 2,
  }).format(cents / 100);
}

function optionValue(variant: CommerceProductVariant, option: CommerceProductOption): string | undefined {
  return variant.optionValues[option.name] ?? variant.optionValues[option.optionId];
}

function buildInitialSelections(product: CommerceProduct): Record<string, string> {
  return Object.fromEntries(
    product.options.map((option) => [option.optionId, option.values[0] ?? '']),
  );
}

function findSelectedVariant(
  product: CommerceProduct,
  selections: Record<string, string>,
): CommerceProductVariant | null {
  if (product.variants.length === 0) return null;
  if (product.options.length === 0) return product.variants[0] ?? null;
  return product.variants.find((variant) => (
    product.options.every((option) => optionValue(variant, option) === selections[option.optionId])
  )) ?? null;
}

function categoryLabel(product: CommerceProduct, categories: CommerceProductCategory[], locale: Locale): string {
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category.name]));
  for (const id of product.categoryIds) {
    const slug = slugifyProductCategory(id);
    const name = categoryBySlug.get(slug);
    if (name) return name;
    if (id.trim()) return id;
  }
  return copy[locale].uncategorized;
}

function isPurchasable(availability: CommerceAvailabilityState): boolean {
  return availability === 'in-stock' || availability === 'low-stock' || availability === 'backorder';
}

function quantityLimit(inventory: CommerceInventory | undefined, availability: CommerceAvailabilityState): number {
  if (!isPurchasable(availability)) return 1;
  if (inventory?.trackInventory && !inventory.allowBackorder) return Math.max(1, inventory.quantity);
  return 99;
}

function clampQuantity(value: number, max: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(Math.max(1, Math.floor(value)), max);
}

function productHref(locale: Locale, product: CommerceProduct): string {
  return `/${locale}/store/products/${encodeURIComponent(product.slug)}`;
}

function selectedOptionValues(
  product: CommerceProduct,
  selections: Record<string, string>,
  variant: CommerceProductVariant | null,
): Record<string, string> {
  if (variant) return variant.optionValues;
  return Object.fromEntries(
    product.options.map((option) => [option.name, selections[option.optionId] ?? '']),
  );
}

export default function PublicProductDetail({
  locale,
  product,
  categories,
  relatedProducts,
}: PublicProductDetailProps) {
  const t = copy[locale];
  const media = useMemo(() => sortedMedia(product), [product]);
  const storageKey = commerceCartStorageKey(locale);
  const [selectedMediaId, setSelectedMediaId] = useState(media[0]?.mediaId ?? '');
  const [selections, setSelections] = useState(() => buildInitialSelections(product));
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState(() => makeEmptyCart(locale, product.currency));
  const [cartHydrated, setCartHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [couponDraft, setCouponDraft] = useState('');

  const selectedVariant = useMemo(() => findSelectedVariant(product, selections), [product, selections]);
  const previousVariantIdRef = useRef(selectedVariant?.variantId ?? '');
  const selectedInventory = selectedVariant?.inventory ?? product.inventory;
  const variantMissing = product.options.length > 0 && product.variants.length > 0 && !selectedVariant;
  const availability = variantMissing
    ? 'disabled'
    : commerceInventoryAvailability(selectedInventory, selectedVariant?.status ?? 'active');
  const maxQuantity = quantityLimit(selectedInventory, availability);
  const canSelectQuantity = isPurchasable(availability) && !variantMissing;
  const activeMedia = media.find((item) => item.mediaId === selectedMediaId)
    ?? media.find((item) => item.mediaId === selectedVariant?.mediaId)
    ?? media[0]
    ?? null;
  const priceCents = selectedVariant?.priceCents ?? product.priceCents;
  const compareAtPriceCents = selectedVariant?.compareAtPriceCents ?? product.compareAtPriceCents;
  const sku = selectedVariant?.sku ?? product.sku;
  const selectedCategory = categoryLabel(product, categories, locale);
  const cartTotals = useMemo(() => commerceCartTotals(cart), [cart]);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    let parsed: unknown = null;
    if (raw) {
      try {
        parsed = JSON.parse(raw) as unknown;
      } catch {
        parsed = null;
      }
    }
    const nextCart = normalizeCartState(parsed, locale, product.currency);
    setCart(nextCart);
    setCouponDraft(nextCart.couponCode ?? '');
    setCartHydrated(true);
  }, [locale, product.currency, storageKey]);

  useEffect(() => {
    if (!cartHydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, cartHydrated, storageKey]);

  useEffect(() => {
    const nextVariantId = selectedVariant?.variantId ?? '';
    if (previousVariantIdRef.current === nextVariantId) return;
    previousVariantIdRef.current = nextVariantId;
    if (selectedVariant?.mediaId && media.some((item) => item.mediaId === selectedVariant.mediaId)) {
      setSelectedMediaId(selectedVariant.mediaId);
    }
  }, [media, selectedVariant?.mediaId, selectedVariant?.variantId]);

  useEffect(() => {
    setQuantity((value) => clampQuantity(value, maxQuantity));
  }, [maxQuantity]);

  function handleAddToCart() {
    if (!canSelectQuantity || variantMissing) return;
    const cartItem: CommerceCartItem = {
      itemId: makeCartItemId(product.productId, selectedVariant?.variantId),
      productId: product.productId,
      productSlug: product.slug,
      variantId: selectedVariant?.variantId,
      title: product.title,
      variantTitle: selectedVariant?.title,
      sku,
      priceCents,
      compareAtPriceCents,
      currency: product.currency,
      quantity,
      maxQuantity,
      imageUrl: activeMedia?.url,
      imageAlt: activeMedia?.alt || product.title,
      optionValues: selectedOptionValues(product, selections, selectedVariant),
    };
    setCart((current) => upsertCartItem(current, cartItem, quantity));
    setCartOpen(true);
  }

  function formatCartPrice(cents: number): string {
    return formatPrice(locale, cart.currency, cents);
  }

  return (
    <main
      className={styles.page}
      data-commerce-product-detail
      data-commerce-product-slug={product.slug}
      data-commerce-product-availability={availability}
      data-commerce-product-hydrated={cartHydrated ? 'true' : 'false'}
    >
      <div className={styles.inner}>
        <Link href={`/${locale}/store`} className={styles.backLink} data-commerce-product-back-link>
          {t.back}
        </Link>

        <section className={styles.hero} aria-label={product.title}>
          <div className={styles.gallery} data-commerce-product-gallery>
            <div className={styles.mainMedia} data-commerce-product-media-main={activeMedia?.mediaId ?? 'fallback'}>
              {activeMedia?.url ? (
                <img src={activeMedia.url} alt={activeMedia.alt || product.title} />
              ) : (
                <div className={styles.mediaFallback}>{t.mediaFallback}</div>
              )}
            </div>
            {media.length > 1 ? (
              <div className={styles.thumbs} aria-label={t.mediaThumbnails} data-commerce-product-thumbnails>
                {media.map((item) => (
                  <button
                    key={item.mediaId}
                    type="button"
                    className={styles.thumb}
                    aria-pressed={activeMedia?.mediaId === item.mediaId}
                    data-commerce-product-media-thumb={item.mediaId}
                    data-commerce-product-media-selected={activeMedia?.mediaId === item.mediaId ? 'true' : 'false'}
                    onClick={() => setSelectedMediaId(item.mediaId)}
                  >
                    <img src={item.url} alt={item.alt || product.title} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className={styles.summary}>
            <p className={styles.eyebrow}>{t.collection} · {selectedCategory}</p>
            <h1>{product.title}</h1>
            <p className={styles.description}>{product.description}</p>

            <div className={styles.priceRow}>
              <strong data-commerce-product-price>{formatPrice(locale, product.currency, priceCents)}</strong>
              {compareAtPriceCents && compareAtPriceCents > priceCents ? (
                <span>{formatPrice(locale, product.currency, compareAtPriceCents)}</span>
              ) : null}
            </div>

            <dl className={styles.meta}>
              <div>
                <dt>{t.sku}</dt>
                <dd data-commerce-product-sku>{sku}</dd>
              </div>
              <div>
                <dt>{t.status}</dt>
                <dd>
                  <span className={styles.availability} data-state={availability} data-commerce-product-availability-label>
                    {variantMissing ? t.noVariant : availabilityCopy[locale][availability]}
                  </span>
                </dd>
              </div>
            </dl>

            {product.options.length > 0 ? (
              <section className={styles.options} aria-label={t.options}>
                <h2>{t.options}</h2>
                {product.options.map((option) => (
                  <div key={option.optionId} className={styles.optionGroup} data-commerce-product-option-group={option.optionId}>
                    <span>{option.name}</span>
                    <div>
                      {option.values.map((value) => (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={selections[option.optionId] === value}
                          data-commerce-product-option-value={`${option.optionId}:${value}`}
                          onClick={() => setSelections((current) => ({ ...current, [option.optionId]: value }))}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ) : null}

            <div className={styles.purchase}>
              <label className={styles.quantity}>
                <span>{t.quantity}</span>
                <div className={styles.stepper} data-commerce-product-quantity-control>
                  <button
                    type="button"
                    disabled={!canSelectQuantity || quantity <= 1}
                    data-commerce-product-quantity-decrement
                    onClick={() => setQuantity((value) => clampQuantity(value - 1, maxQuantity))}
                  >
                    -
                  </button>
                  <input
                    value={quantity}
                    min={1}
                    max={maxQuantity}
                    disabled={!canSelectQuantity}
                    inputMode="numeric"
                    data-commerce-product-quantity
                    onChange={(event) => setQuantity(clampQuantity(Number(event.target.value), maxQuantity))}
                  />
                  <button
                    type="button"
                    disabled={!canSelectQuantity || quantity >= maxQuantity}
                    data-commerce-product-quantity-increment
                    onClick={() => setQuantity((value) => clampQuantity(value + 1, maxQuantity))}
                  >
                    +
                  </button>
                </div>
              </label>
              <button
                type="button"
                className={styles.cartButton}
                disabled={!canSelectQuantity || variantMissing}
                data-commerce-product-add-to-cart
                data-commerce-product-cart-ready={canSelectQuantity && !variantMissing ? 'true' : 'false'}
                onClick={handleAddToCart}
              >
                {canSelectQuantity ? t.cartPending : t.cartUnavailable}
              </button>
            </div>
          </div>
        </section>

        <section className={styles.details} data-commerce-product-body>
          <h2>{t.details}</h2>
          <p>{product.body || product.description}</p>
          {product.tags.length > 0 ? (
            <div className={styles.tags} aria-label={t.tags}>
              {product.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          ) : null}
        </section>

        {relatedProducts.length > 0 ? (
          <section className={styles.related} data-commerce-related-products>
            <h2>{t.related}</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((item) => {
                const relatedMedia = sortedMedia(item)[0];
                return (
                  <Link
                    key={item.productId}
                    href={productHref(locale, item)}
                    className={styles.relatedCard}
                    data-commerce-related-product-card={item.productId}
                    data-commerce-product-slug={item.slug}
                  >
                    {relatedMedia?.url ? (
                      <img src={relatedMedia.url} alt={relatedMedia.alt || item.title} />
                    ) : (
                      <span className={styles.relatedFallback} aria-hidden />
                    )}
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                    <span>{formatPrice(locale, item.currency, item.priceCents)}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>

      <button
        type="button"
        className={styles.cartToggle}
        data-commerce-cart-toggle
        data-commerce-cart-count={cartTotals.itemCount}
        onClick={() => setCartOpen(true)}
      >
        {t.openCart} <span>{cartTotals.itemCount}</span>
      </button>

      {cartOpen ? (
        <div className={styles.cartOverlay} data-commerce-cart-overlay>
          <aside
            className={styles.cartDrawer}
            role="dialog"
            aria-modal="true"
            aria-label={t.cartTitle}
            data-commerce-cart-drawer
            data-commerce-cart-persisted={cartHydrated ? 'true' : 'false'}
          >
            <header>
              <h2>{t.cartTitle}</h2>
              <button type="button" data-commerce-cart-close onClick={() => setCartOpen(false)}>
                {t.closeCart}
              </button>
            </header>

            {cart.items.length === 0 ? (
              <p className={styles.emptyCart} data-commerce-cart-empty>{t.emptyCart}</p>
            ) : (
              <div className={styles.cartItems}>
                {cart.items.map((item) => (
                  <article
                    key={item.itemId}
                    className={styles.cartItem}
                    data-commerce-cart-item={item.itemId}
                    data-commerce-cart-item-sku={item.sku}
                  >
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.imageAlt || item.title} /> : <span aria-hidden />}
                    <div className={styles.cartItemBody}>
                      <Link href={`/${locale}/store/products/${encodeURIComponent(item.productSlug)}`}>
                        {item.title}
                      </Link>
                      {Object.keys(item.optionValues).length > 0 ? (
                        <p>{Object.entries(item.optionValues).map(([key, value]) => `${key}: ${value}`).join(' · ')}</p>
                      ) : null}
                      <span>{item.sku}</span>
                      <strong>{formatCartPrice(item.priceCents * item.quantity)}</strong>
                    </div>
                    <div className={styles.cartItemActions}>
                      <div className={styles.cartStepper}>
                        <button
                          type="button"
                          disabled={item.quantity <= 1}
                          data-commerce-cart-item-decrement={item.itemId}
                          onClick={() => setCart((current) => updateCartItemQuantity(current, item.itemId, item.quantity - 1))}
                        >
                          -
                        </button>
                        <input
                          value={item.quantity}
                          min={1}
                          max={item.maxQuantity}
                          inputMode="numeric"
                          data-commerce-cart-item-quantity={item.itemId}
                          onChange={(event) => setCart((current) => updateCartItemQuantity(current, item.itemId, Number(event.target.value)))}
                        />
                        <button
                          type="button"
                          disabled={item.quantity >= item.maxQuantity}
                          data-commerce-cart-item-increment={item.itemId}
                          onClick={() => setCart((current) => updateCartItemQuantity(current, item.itemId, item.quantity + 1))}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className={styles.removeButton}
                        data-commerce-cart-item-remove={item.itemId}
                        onClick={() => setCart((current) => removeCartItem(current, item.itemId))}
                      >
                        {t.remove}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <form
              className={styles.coupon}
              onSubmit={(event) => {
                event.preventDefault();
                setCart((current) => setCartCoupon(current, couponDraft));
              }}
            >
              <label>
                <span>{t.coupon}</span>
                <input
                  value={couponDraft}
                  data-commerce-cart-coupon-input
                  onChange={(event) => setCouponDraft(event.target.value)}
                />
              </label>
              <button type="submit" data-commerce-cart-coupon-apply>{t.applyCoupon}</button>
              {cartTotals.couponCode ? (
                <p data-commerce-cart-coupon-code={cartTotals.couponCode}>{t.couponSaved}: {cartTotals.couponCode}</p>
              ) : null}
            </form>

            <dl className={styles.cartTotals}>
              <div>
                <dt>{t.subtotal}</dt>
                <dd data-commerce-cart-subtotal>{formatCartPrice(cartTotals.subtotalCents)}</dd>
              </div>
              <div>
                <dt>{t.discount}</dt>
                <dd data-commerce-cart-discount>{formatCartPrice(cartTotals.discountCents)}</dd>
              </div>
              <div>
                <dt>{t.total}</dt>
                <dd data-commerce-cart-total>{formatCartPrice(cartTotals.totalCents)}</dd>
              </div>
            </dl>
            {cart.items.length > 0 ? (
              <Link
                href={`/${locale}/store/checkout`}
                className={styles.checkoutButton}
                data-commerce-cart-checkout
                data-commerce-cart-checkout-ready="true"
              >
                {t.checkoutPending}
              </Link>
            ) : (
              <button
                type="button"
                className={styles.checkoutButton}
                disabled
                data-commerce-cart-checkout
                data-commerce-cart-checkout-ready="false"
              >
                {t.checkoutPending}
              </button>
            )}
          </aside>
        </div>
      ) : null}
    </main>
  );
}
