import type { Locale } from '@/lib/locales';
import type { CommerceCartItem, CommerceCartState, CommerceCartTotals } from './cart-shared';
import { commerceCartTotals } from './cart-shared';
import type { CommerceOrderPaymentStatus } from './orders-shared';
import {
  checkoutCurrenciesForSettings,
  COMMERCE_SUPPORTED_CURRENCIES,
  normalizeCommerceCurrency,
  type CommerceCurrencySettings,
} from './currency-shared';
import {
  commercePaymentProviderLabel,
  normalizeCommercePaymentProvider,
  type CommercePaymentProviderId,
} from './payment-providers';
import type { CommerceCurrency } from './products-shared';
import { calculateCommerceShippingQuote, normalizeShippingMethod, type CommerceShippingMethod, type CommerceShippingQuote, type CommerceShippingRule } from './shipping-shared';
import { calculateCommerceTaxQuote, type CommerceTaxQuote, type CommerceTaxRule } from './tax-shared';

export const COMMERCE_CHECKOUT_VERSION = 1;

export type CommerceCheckoutShippingMethod = CommerceShippingMethod;
export type CommerceCheckoutPaymentAdapter = CommercePaymentProviderId;

export const COMMERCE_CHECKOUT_SUPPORTED_CURRENCIES = COMMERCE_SUPPORTED_CURRENCIES;

export interface CommerceCheckoutAddress {
  country: string;
  region: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
}

export interface CommerceCheckoutCustomer {
  name: string;
  email: string;
  phone?: string;
}

export type CommerceCheckoutShippingQuote = CommerceShippingQuote;

export type CommerceCheckoutTaxQuote = CommerceTaxQuote;

export interface CommerceCheckoutTotals extends CommerceCartTotals {
  shippingCents: number;
  taxCents: number;
  grandTotalCents: number;
}

export interface CommerceCheckoutQuote {
  version: typeof COMMERCE_CHECKOUT_VERSION;
  locale: Locale;
  currency: CommerceCurrency;
  shipping: CommerceCheckoutShippingQuote;
  tax: CommerceCheckoutTaxQuote;
  totals: CommerceCheckoutTotals;
}

export interface CommerceCheckoutConfirmation {
  checkoutId: string;
  orderId: string;
  confirmationNumber: string;
  locale: Locale;
  currency: CommerceCurrency;
  customer: CommerceCheckoutCustomer;
  shippingAddress: CommerceCheckoutAddress;
  lineItems: CommerceCartItem[];
  couponCode?: string;
  shipping: CommerceCheckoutShippingQuote;
  tax: CommerceCheckoutTaxQuote;
  totals: CommerceCheckoutTotals;
  payment: {
    adapter: CommerceCheckoutPaymentAdapter;
    status: CommerceOrderPaymentStatus;
    label: string;
    stub: boolean;
    referenceId?: string;
  };
  createdAt: string;
}

const DEFAULT_COUNTRY = 'TW';

export function commerceCheckoutConfirmationStorageKey(locale: Locale): string {
  return `tseng-commerce-checkout-confirmation-v${COMMERCE_CHECKOUT_VERSION}:${locale}`;
}

export function normalizeCheckoutShippingMethod(value: unknown): CommerceCheckoutShippingMethod {
  return normalizeShippingMethod(value);
}

export function normalizeCheckoutPaymentAdapter(value: unknown): CommerceCheckoutPaymentAdapter {
  return normalizeCommercePaymentProvider(value);
}

export function normalizeCheckoutCurrency(
  value: unknown,
  supportedCurrencies: readonly CommerceCurrency[] = COMMERCE_CHECKOUT_SUPPORTED_CURRENCIES,
): CommerceCurrency {
  return normalizeCommerceCurrency(value, 'TWD', supportedCurrencies);
}

export function normalizeCheckoutCountry(value: unknown): string {
  const country = typeof value === 'string' ? value.trim().toUpperCase().slice(0, 2) : '';
  return /^[A-Z]{2}$/.test(country) ? country : DEFAULT_COUNTRY;
}

function trimText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function normalizeCheckoutAddress(input: unknown): CommerceCheckoutAddress {
  const source = input && typeof input === 'object' ? input as Partial<CommerceCheckoutAddress> : {};
  return {
    country: normalizeCheckoutCountry(source.country),
    region: trimText(source.region, 120),
    city: trimText(source.city, 120),
    postalCode: trimText(source.postalCode, 32),
    addressLine1: trimText(source.addressLine1, 240),
    addressLine2: trimText(source.addressLine2, 240) || undefined,
  };
}

export function normalizeCheckoutCustomer(input: unknown): CommerceCheckoutCustomer {
  const source = input && typeof input === 'object' ? input as Partial<CommerceCheckoutCustomer> : {};
  return {
    name: trimText(source.name, 120),
    email: trimText(source.email, 200),
    phone: trimText(source.phone, 80) || undefined,
  };
}

export function checkoutAddressErrors(address: CommerceCheckoutAddress): string[] {
  const errors: string[] = [];
  if (!address.country) errors.push('country_required');
  if (!address.region) errors.push('region_required');
  if (!address.city) errors.push('city_required');
  if (!address.postalCode) errors.push('postal_code_required');
  if (!address.addressLine1) errors.push('address_line_1_required');
  return errors;
}

export function checkoutCustomerErrors(customer: CommerceCheckoutCustomer): string[] {
  const errors: string[] = [];
  if (!customer.name) errors.push('name_required');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) errors.push('email_invalid');
  return errors;
}

export function checkoutLineItemErrors(cart: CommerceCartState): string[] {
  const errors: string[] = [];
  if (cart.items.length === 0) errors.push('cart_empty');
  if (cart.items.some((item) => item.quantity < 1 || item.priceCents < 0)) errors.push('cart_invalid_line_item');
  if (cart.items.some((item) => item.currency !== cart.currency)) errors.push('cart_mixed_currency');
  return errors;
}

export function checkoutCurrencyErrors(
  input: unknown,
  expectedCurrency?: CommerceCurrency,
  supportedCurrencies: readonly CommerceCurrency[] = COMMERCE_CHECKOUT_SUPPORTED_CURRENCIES,
): string[] {
  if (!input || typeof input !== 'object') return [];
  const source = input as { currency?: unknown; items?: unknown };
  const errors = new Set<string>();
  const declaredCurrency = source.currency;
  const currency = expectedCurrency ?? normalizeCheckoutCurrency(declaredCurrency, supportedCurrencies);
  if (declaredCurrency !== undefined && !supportedCurrencies.includes(declaredCurrency as CommerceCurrency)) {
    errors.add('currency_unsupported');
  }
  if (Array.isArray(source.items)) {
    for (const item of source.items) {
      if (!item || typeof item !== 'object') continue;
      const itemCurrency = (item as { currency?: unknown }).currency;
      if (itemCurrency !== undefined && !supportedCurrencies.includes(itemCurrency as CommerceCurrency)) {
        errors.add('currency_unsupported');
      }
      if (itemCurrency && itemCurrency !== currency) {
        errors.add('cart_mixed_currency');
      }
    }
  }
  return [...errors];
}

export function checkoutCurrenciesForCurrencySettings(settings: CommerceCurrencySettings): readonly CommerceCurrency[] {
  return checkoutCurrenciesForSettings(settings);
}

export function createCommerceCheckoutQuote(
  cart: CommerceCartState,
  locale: Locale,
  shippingMethod: CommerceCheckoutShippingMethod,
  address: CommerceCheckoutAddress,
  taxRules?: CommerceTaxRule[],
  shippingRules?: CommerceShippingRule[],
): CommerceCheckoutQuote {
  const cartTotals = commerceCartTotals(cart);
  const shipping = calculateCommerceShippingQuote({
    method: shippingMethod,
    address,
    locale,
    currency: cart.currency,
    discountedSubtotalCents: cartTotals.totalCents,
    rules: shippingRules,
  });
  const shippingCents = shipping.amountCents;
  const country = normalizeCheckoutCountry(address.country);
  const taxableCents = Math.max(0, cartTotals.totalCents + shippingCents);
  const tax = calculateCommerceTaxQuote({
    address: { ...address, country },
    locale,
    currency: cart.currency,
    taxableCents,
    rules: taxRules,
  });
  const taxCents = tax.amountCents;
  const totals: CommerceCheckoutTotals = {
    ...cartTotals,
    shippingCents,
    taxCents,
    grandTotalCents: taxableCents + taxCents,
  };

  return {
    version: COMMERCE_CHECKOUT_VERSION,
    locale,
    currency: cart.currency,
    shipping,
    tax,
    totals,
  };
}

export function paymentAdapterLabel(adapter: CommerceCheckoutPaymentAdapter, locale: Locale): string {
  return commercePaymentProviderLabel(adapter, locale);
}
