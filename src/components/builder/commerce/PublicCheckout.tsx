'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import {
  commerceCartStorageKey,
  makeEmptyCart,
  normalizeCartState,
  type CommerceCartState,
} from '@/lib/builder/commerce/cart-shared';
import {
  commerceCheckoutConfirmationStorageKey,
  createCommerceCheckoutQuote,
  normalizeCheckoutAddress,
  normalizeCheckoutCurrency,
  normalizeCheckoutPaymentAdapter,
  normalizeCheckoutShippingMethod,
  type CommerceCheckoutAddress,
  type CommerceCheckoutConfirmation,
  type CommerceCheckoutCustomer,
  type CommerceCheckoutPaymentAdapter,
  type CommerceCheckoutShippingMethod,
} from '@/lib/builder/commerce/checkout-shared';
import {
  DEFAULT_COMMERCE_CURRENCY_SETTINGS,
  type CommerceCurrencySettings,
} from '@/lib/builder/commerce/currency-shared';
import type { CommerceCurrency } from '@/lib/builder/commerce/products-shared';
import type { CommerceShippingRule } from '@/lib/builder/commerce/shipping-shared';
import type { CommerceTaxRule } from '@/lib/builder/commerce/tax-shared';
import styles from './PublicCheckout.module.css';

type CheckoutCopy = {
  title: string;
  description: string;
  back: string;
  empty: string;
  customer: string;
  shipping: string;
  payment: string;
  summary: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  method: string;
  digital: string;
  standard: string;
  express: string;
  pickup: string;
  localDelivery: string;
  adapter: string;
  manualInvoice: string;
  sandboxCard: string;
  submit: string;
  processing: string;
  subtotal: string;
  shippingCost: string;
  tax: string;
  discount: string;
  total: string;
  confirmation: string;
  confirmationHelp: string;
  paymentStatus: string;
  clear: string;
  error: string;
  currencyPolicy: string;
  conversionPolicy: string;
  conversionDisabled: string;
  conversionPreview: string;
  currencyError: string;
};

const copy: Record<Locale, CheckoutCopy> = {
  ko: {
    title: '체크아웃',
    description: '장바구니를 확인하고 배송지, 세금, 결제 어댑터를 한 번에 검증합니다.',
    back: '스토어로 돌아가기',
    empty: '체크아웃할 장바구니가 없습니다.',
    customer: '고객 정보',
    shipping: '배송 정보',
    payment: '결제 어댑터',
    summary: '주문 요약',
    name: '이름',
    email: '이메일',
    phone: '전화',
    country: '국가 코드',
    region: '지역',
    city: '도시',
    postalCode: '우편번호',
    addressLine1: '주소',
    addressLine2: '상세 주소',
    method: '배송 방법',
    digital: '디지털 배송',
    standard: '표준 배송',
    express: '빠른 배송',
    pickup: '사무실 픽업',
    localDelivery: '지역 배송',
    adapter: '결제 방식',
    manualInvoice: '수동 송장',
    sandboxCard: '샌드박스 카드',
    submit: '주문 확인',
    processing: '확인 중',
    subtotal: '소계',
    shippingCost: '배송',
    tax: '세금',
    discount: '할인',
    total: '총 결제 금액',
    confirmation: '주문 확인 완료',
    confirmationHelp: '주문이 안전하게 저장되었습니다. 확인 이메일을 보내 드리며, 담당자가 곧 처리합니다.',
    paymentStatus: '결제 상태',
    clear: '장바구니가 비워졌습니다.',
    error: '체크아웃 정보를 확인해 주세요.',
    currencyPolicy: '현재 체크아웃 통화는 {currency}입니다. 변환 없이 다른 통화 상품을 섞어 결제할 수 없습니다.',
    conversionPolicy: '기준 통화는 {base}입니다. 환율 변환은 {mode} 상태이며 주문 금액은 장바구니 통화로 확정됩니다.',
    conversionDisabled: '비활성',
    conversionPreview: '미리보기',
    currencyError: '장바구니에 서로 다른 통화가 섞여 있습니다. 같은 통화 상품만 남긴 뒤 다시 결제해 주세요.',
  },
  'zh-hant': {
    title: '結帳',
    description: '檢查購物車，並驗證配送、稅額與付款介面。',
    back: '返回商店',
    empty: '沒有可結帳的購物車。',
    customer: '顧客資訊',
    shipping: '配送資訊',
    payment: '付款介面',
    summary: '訂單摘要',
    name: '姓名',
    email: '電子郵件',
    phone: '電話',
    country: '國家代碼',
    region: '地區',
    city: '城市',
    postalCode: '郵遞區號',
    addressLine1: '地址',
    addressLine2: '地址補充',
    method: '配送方式',
    digital: '數位交付',
    standard: '標準配送',
    express: '快速配送',
    pickup: '辦公室取件',
    localDelivery: '本地配送',
    adapter: '付款方式',
    manualInvoice: '人工發票',
    sandboxCard: '沙盒卡片',
    submit: '確認訂單',
    processing: '確認中',
    subtotal: '小計',
    shippingCost: '配送',
    tax: '稅額',
    discount: '折扣',
    total: '應付總額',
    confirmation: '訂單確認完成',
    confirmationHelp: '您的訂單已安全儲存。我們將寄送確認電子郵件，專人將盡快為您處理。',
    paymentStatus: '付款狀態',
    clear: '購物車已清空。',
    error: '請檢查結帳資訊。',
    currencyPolicy: '目前結帳幣別為 {currency}。未經轉換不能混合不同幣別商品。',
    conversionPolicy: '基準幣別為 {base}。匯率轉換目前為{mode}狀態，訂單金額仍以購物車幣別結算。',
    conversionDisabled: '停用',
    conversionPreview: '預覽',
    currencyError: '購物車包含不同幣別商品。請只保留同一幣別後再結帳。',
  },
  en: {
    title: 'Checkout',
    description: 'Review the cart and validate address, shipping, tax, and payment adapter details.',
    back: 'Back to store',
    empty: 'There is no cart to check out.',
    customer: 'Customer',
    shipping: 'Shipping',
    payment: 'Payment adapter',
    summary: 'Order summary',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    country: 'Country code',
    region: 'Region',
    city: 'City',
    postalCode: 'Postal code',
    addressLine1: 'Address',
    addressLine2: 'Address line 2',
    method: 'Shipping method',
    digital: 'Digital delivery',
    standard: 'Standard shipping',
    express: 'Express shipping',
    pickup: 'Office pickup',
    localDelivery: 'Local delivery',
    adapter: 'Payment method',
    manualInvoice: 'Manual invoice',
    sandboxCard: 'Sandbox card',
    submit: 'Confirm order',
    processing: 'Confirming',
    subtotal: 'Subtotal',
    shippingCost: 'Shipping',
    tax: 'Tax',
    discount: 'Discount',
    total: 'Total due',
    confirmation: 'Order confirmed',
    confirmationHelp: 'Your order has been saved securely. A confirmation email is on its way and our team will process it shortly.',
    paymentStatus: 'Payment status',
    clear: 'Cart cleared.',
    error: 'Check the checkout details.',
    currencyPolicy: 'This checkout is in {currency}. Products in another currency cannot be mixed without conversion.',
    conversionPolicy: 'Base currency is {base}. Conversion is {mode}; orders still settle in the cart currency.',
    conversionDisabled: 'disabled',
    conversionPreview: 'preview-only',
    currencyError: 'The cart contains mixed currencies. Keep only one checkout currency and try again.',
  },
};

function formatPrice(locale: Locale, currency: CommerceCurrency, cents: number): string {
  return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : locale === 'zh-hant' ? 'zh-TW' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'TWD' || currency === 'KRW' ? 0 : 2,
  }).format(cents / 100);
}

function parseStoredCart(locale: Locale): CommerceCartState {
  const raw = window.localStorage.getItem(commerceCartStorageKey(locale));
  let parsed: unknown = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      parsed = null;
    }
  }
  const currency = parsed && typeof parsed === 'object'
    ? normalizeCheckoutCurrency((parsed as { currency?: unknown }).currency)
    : 'TWD';
  return normalizeCartState(parsed, locale, currency);
}

const defaultCustomer: CommerceCheckoutCustomer = {
  name: '',
  email: '',
  phone: '',
};

const defaultAddress: CommerceCheckoutAddress = {
  country: 'TW',
  region: 'Taipei',
  city: 'Taipei',
  postalCode: '100',
  addressLine1: '',
  addressLine2: '',
};

export default function PublicCheckout({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [cart, setCart] = useState<CommerceCartState>(() => makeEmptyCart(locale, 'TWD'));
  const [hydrated, setHydrated] = useState(false);
  const [customer, setCustomer] = useState<CommerceCheckoutCustomer>(defaultCustomer);
  const [address, setAddress] = useState<CommerceCheckoutAddress>(defaultAddress);
  const [shippingMethod, setShippingMethod] = useState<CommerceCheckoutShippingMethod>('standard');
  const [paymentAdapter, setPaymentAdapter] = useState<CommerceCheckoutPaymentAdapter>('manual-invoice');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<CommerceCheckoutConfirmation | null>(null);
  const [taxRules, setTaxRules] = useState<CommerceTaxRule[] | undefined>(undefined);
  const [shippingRules, setShippingRules] = useState<CommerceShippingRule[] | undefined>(undefined);
  const [currencySettings, setCurrencySettings] = useState<CommerceCurrencySettings>(DEFAULT_COMMERCE_CURRENCY_SETTINGS);
  const [recoveryState, setRecoveryState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    const nextCart = parseStoredCart(locale);
    setCart(nextCart);
    setHydrated(true);
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    void fetch('/api/builder/commerce/currency-settings', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { ok?: boolean; settings?: CommerceCurrencySettings } | null) => {
        if (!cancelled && payload?.ok && payload.settings) setCurrencySettings(payload.settings);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/builder/commerce/tax-rules?locale=${locale}`, { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { ok?: boolean; rules?: CommerceTaxRule[] } | null) => {
        if (!cancelled && payload?.ok && Array.isArray(payload.rules)) setTaxRules(payload.rules);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/builder/commerce/shipping-rules?locale=${locale}&currency=${cart.currency}`, { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { ok?: boolean; rules?: CommerceShippingRule[] } | null) => {
        if (!cancelled && payload?.ok && Array.isArray(payload.rules)) setShippingRules(payload.rules);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [cart.currency, locale]);

  const normalizedAddress = useMemo(() => normalizeCheckoutAddress(address), [address]);
  const normalizedShippingMethod = normalizeCheckoutShippingMethod(shippingMethod);
  const normalizedPaymentAdapter = normalizeCheckoutPaymentAdapter(paymentAdapter);
  const conversionModeLabel = currencySettings.conversionMode === 'manual-preview'
    ? t.conversionPreview
    : t.conversionDisabled;
  const quote = useMemo(
    () => createCommerceCheckoutQuote(cart, locale, normalizedShippingMethod, normalizedAddress, taxRules, shippingRules),
    [cart, locale, normalizedAddress, normalizedShippingMethod, shippingRules, taxRules],
  );

  function updateCustomer(field: keyof CommerceCheckoutCustomer, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  function updateAddress(field: keyof CommerceCheckoutAddress, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
  }

  async function captureRecovery(email: string) {
    const normalizedEmail = email.trim();
    if (cart.items.length === 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return;
    setRecoveryState('saving');
    const response = await fetch(`/api/builder/commerce/cart-recovery?locale=${encodeURIComponent(locale)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locale,
        email: normalizedEmail,
        currency: cart.currency,
        cart,
        recoveryUrl: `/${locale}/store/checkout`,
      }),
    }).catch(() => null);
    setRecoveryState(response?.ok ? 'saved' : 'error');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cart.items.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    setError('');

    const response = await fetch(`/api/builder/commerce/checkout?locale=${encodeURIComponent(locale)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locale,
        cart,
        customer,
        shippingAddress: address,
        shippingMethod: normalizedShippingMethod,
        paymentAdapter: normalizedPaymentAdapter,
      }),
    }).catch(() => null);
    const payload = await response?.json().catch(() => null) as {
      ok?: boolean;
      checkout?: CommerceCheckoutConfirmation;
      errors?: string[];
    } | null;

    if (!response?.ok) {
      setError(payload?.errors?.includes('cart_mixed_currency') || payload?.errors?.includes('currency_unsupported')
        ? t.currencyError
        : t.error);
      setIsSubmitting(false);
      return;
    }

    if (!payload?.ok || !payload.checkout) {
      setError(t.error);
      setIsSubmitting(false);
      return;
    }

    window.localStorage.setItem(commerceCheckoutConfirmationStorageKey(locale), JSON.stringify(payload.checkout));
    window.localStorage.removeItem(commerceCartStorageKey(locale));
    setCart(makeEmptyCart(locale, payload.checkout.currency));
    setConfirmation(payload.checkout);
    setIsSubmitting(false);
  }

  if (confirmation) {
    return (
      <main className={styles.page} data-commerce-checkout data-commerce-checkout-confirmed="true">
        <section
          className={styles.confirmation}
          data-commerce-checkout-confirmation
          data-commerce-checkout-order-id={confirmation.orderId}
        >
          <p className={styles.eyebrow}>{t.confirmation}</p>
          <h1 data-commerce-checkout-confirmation-number>{confirmation.confirmationNumber}</h1>
          <p>{t.confirmationHelp}</p>
          <dl>
            <div>
              <dt>{t.total}</dt>
              <dd data-commerce-checkout-confirmation-total>
                {formatPrice(locale, confirmation.currency, confirmation.totals.grandTotalCents)}
              </dd>
            </div>
            <div>
              <dt>{t.paymentStatus}</dt>
              <dd data-commerce-checkout-payment-status>{confirmation.payment.status}</dd>
            </div>
          </dl>
          <p className={styles.clearNotice}>{t.clear}</p>
          <Link href={`/${locale}/store`} className={styles.primaryLink}>{t.back}</Link>
        </section>
      </main>
    );
  }

  return (
    <main
      className={styles.page}
      data-commerce-checkout
      data-commerce-checkout-hydrated={hydrated ? 'true' : 'false'}
      data-commerce-checkout-recovery-state={recoveryState}
    >
      <div className={styles.inner}>
        <Link href={`/${locale}/store`} className={styles.backLink}>{t.back}</Link>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Store checkout</p>
          <h1>{t.title}</h1>
          <p>{t.description}</p>
        </header>

        {hydrated && cart.items.length === 0 ? (
          <section className={styles.empty} data-commerce-checkout-empty>
            <p>{t.empty}</p>
            <Link href={`/${locale}/store`} className={styles.primaryLink}>{t.back}</Link>
          </section>
        ) : (
          <form className={styles.checkoutGrid} onSubmit={handleSubmit}>
            <div className={styles.formStack}>
              <section className={styles.panel}>
                <h2>{t.customer}</h2>
                <div className={styles.fields}>
                  <label>
                    <span>{t.name}</span>
                    <input
                      value={customer.name}
                      required
                      data-commerce-checkout-name
                      onChange={(event) => updateCustomer('name', event.target.value)}
                    />
                  </label>
                  <label>
                    <span>{t.email}</span>
                    <input
                      value={customer.email}
                      required
                      type="email"
                      data-commerce-checkout-email
                      onChange={(event) => updateCustomer('email', event.target.value)}
                      onBlur={(event) => void captureRecovery(event.target.value)}
                    />
                  </label>
                  <label>
                    <span>{t.phone}</span>
                    <input
                      value={customer.phone ?? ''}
                      data-commerce-checkout-phone
                      onChange={(event) => updateCustomer('phone', event.target.value)}
                    />
                  </label>
                </div>
              </section>

              <section className={styles.panel}>
                <h2>{t.shipping}</h2>
                <div className={styles.fields}>
                  <label>
                    <span>{t.country}</span>
                    <input
                      value={address.country}
                      required
                      maxLength={2}
                      data-commerce-checkout-country
                      onChange={(event) => updateAddress('country', event.target.value.toUpperCase())}
                    />
                  </label>
                  <label>
                    <span>{t.region}</span>
                    <input
                      value={address.region}
                      required
                      data-commerce-checkout-region
                      onChange={(event) => updateAddress('region', event.target.value)}
                    />
                  </label>
                  <label>
                    <span>{t.city}</span>
                    <input
                      value={address.city}
                      required
                      data-commerce-checkout-city
                      onChange={(event) => updateAddress('city', event.target.value)}
                    />
                  </label>
                  <label>
                    <span>{t.postalCode}</span>
                    <input
                      value={address.postalCode}
                      required
                      data-commerce-checkout-postal-code
                      onChange={(event) => updateAddress('postalCode', event.target.value)}
                    />
                  </label>
                  <label className={styles.wideField}>
                    <span>{t.addressLine1}</span>
                    <input
                      value={address.addressLine1}
                      required
                      data-commerce-checkout-address-1
                      onChange={(event) => updateAddress('addressLine1', event.target.value)}
                    />
                  </label>
                  <label className={styles.wideField}>
                    <span>{t.addressLine2}</span>
                    <input
                      value={address.addressLine2 ?? ''}
                      data-commerce-checkout-address-2
                      onChange={(event) => updateAddress('addressLine2', event.target.value)}
                    />
                  </label>
                  <label className={styles.wideField}>
                    <span>{t.method}</span>
                    <select
                      value={shippingMethod}
                      data-commerce-checkout-shipping-method
                      onChange={(event) => setShippingMethod(normalizeCheckoutShippingMethod(event.target.value))}
                    >
                      <option value="digital">{t.digital}</option>
                      <option value="standard">{t.standard}</option>
                      <option value="express">{t.express}</option>
                      <option value="pickup">{t.pickup}</option>
                      <option value="local-delivery">{t.localDelivery}</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className={styles.panel}>
                <h2>{t.payment}</h2>
                <label className={styles.wideField}>
                  <span>{t.adapter}</span>
                  <select
                    value={paymentAdapter}
                    data-commerce-checkout-payment-adapter
                    onChange={(event) => setPaymentAdapter(normalizeCheckoutPaymentAdapter(event.target.value))}
                  >
                    <option value="manual-invoice">{t.manualInvoice}</option>
                    <option value="sandbox-card">{t.sandboxCard}</option>
                  </select>
                </label>
              </section>
            </div>

            <aside className={styles.summary} data-commerce-checkout-summary>
              <h2>{t.summary}</h2>
              <p
                className={styles.currencyPolicy}
                data-commerce-checkout-currency-policy
                data-commerce-checkout-currency={cart.currency}
              >
                {t.currencyPolicy.replace('{currency}', cart.currency)}
              </p>
              <p
                className={styles.conversionPolicy}
                data-commerce-checkout-conversion-policy
                data-commerce-checkout-base-currency={currencySettings.baseCurrency}
                data-commerce-checkout-conversion-mode={currencySettings.conversionMode}
                data-commerce-checkout-conversion-status={currencySettings.conversionMode === 'disabled' ? 'off' : 'preview'}
                data-commerce-checkout-supported-currencies={currencySettings.supportedCurrencies.join(',')}
              >
                {t.conversionPolicy
                  .replace('{base}', currencySettings.baseCurrency)
                  .replace('{mode}', conversionModeLabel)}
              </p>
              <div className={styles.lines}>
                {cart.items.map((item) => (
                  <article key={item.itemId} data-commerce-checkout-line={item.itemId}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.sku}</span>
                    </div>
                    <span>{item.quantity} × {formatPrice(locale, cart.currency, item.priceCents)}</span>
                  </article>
                ))}
              </div>
              <dl className={styles.totals}>
                <div>
                  <dt>{t.subtotal}</dt>
                  <dd data-commerce-checkout-subtotal>{formatPrice(locale, cart.currency, quote.totals.subtotalCents)}</dd>
                </div>
                <div>
                  <dt>{t.discount}</dt>
                  <dd data-commerce-checkout-discount>{formatPrice(locale, cart.currency, quote.totals.discountCents)}</dd>
                </div>
                <div>
                  <dt>{t.shippingCost}</dt>
                  <dd
                    data-commerce-checkout-shipping
                    data-commerce-checkout-shipping-rule-id={quote.shipping.ruleId ?? ''}
                    data-commerce-checkout-free-shipping={quote.shipping.freeShippingApplied ? 'true' : 'false'}
                  >
                    {formatPrice(locale, cart.currency, quote.totals.shippingCents)}
                  </dd>
                </div>
                <div>
                  <dt>{t.tax}</dt>
                  <dd
                    data-commerce-checkout-tax
                    data-commerce-checkout-tax-rule-id={quote.tax.ruleId ?? ''}
                  >
                    {formatPrice(locale, cart.currency, quote.totals.taxCents)}
                  </dd>
                </div>
                <div>
                  <dt>{t.total}</dt>
                  <dd data-commerce-checkout-total>{formatPrice(locale, cart.currency, quote.totals.grandTotalCents)}</dd>
                </div>
              </dl>
              {error ? <p className={styles.error} data-commerce-checkout-error>{error}</p> : null}
              <button type="submit" disabled={isSubmitting || cart.items.length === 0} data-commerce-checkout-submit>
                {isSubmitting ? t.processing : t.submit}
              </button>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}
