import type { Locale } from '@/lib/locales';
import type { BookingService } from './types';
import { calculateBookingDiscount, normalizeBookingDiscountRules } from './discounts';

export interface BookingPriceOptions {
  staffId?: string;
  resourceIds?: readonly string[];
  /** Optional discount code submitted by the customer. Paid services only. */
  discountCode?: string;
  /** Locale used for discount locale gating. */
  locale?: Locale;
}

export interface BookingPriceSnapshot {
  paymentRequired: boolean;
  totalAmount: number;
  currency: NonNullable<BookingService['priceCurrency']>;
  amountDueNow: number;
  depositAmount?: number;
  balanceDueAfterOnlinePayment: number;
  isDeposit: boolean;
  payLater: boolean;
  effectiveResourceId?: string;
  /** Full price before discount; only present when a discount applied. */
  subtotalAmount?: number;
  /** Discount amount in the smallest currency unit; only present when > 0. */
  discountAmount?: number;
  /** Normalized discount code that was applied; only present when applied. */
  discountCode?: string;
}

function resolveResourceOverride(
  service: BookingService,
  resourceIds?: readonly string[],
): { amount: number; resourceId: string } | undefined {
  if (!resourceIds || resourceIds.length === 0) return undefined;
  const overrides = service.resourcePriceOverrides;
  if (!overrides) return undefined;
  for (const resourceId of resourceIds) {
    const value = overrides[resourceId];
    if (typeof value === 'number' && value > 0) {
      return { amount: value, resourceId };
    }
  }
  return undefined;
}

export function bookingServiceTotalAmount(service: BookingService, options?: BookingPriceOptions): number {
  const eligibleForOverride = service.paymentMode === 'paid';
  const resourceOverride = eligibleForOverride
    ? resolveResourceOverride(service, options?.resourceIds)
    : undefined;
  const staffOverrideValue = eligibleForOverride && options?.staffId
    ? service.staffPriceOverrides?.[options.staffId]
    : undefined;
  const staffOverride = typeof staffOverrideValue === 'number' && staffOverrideValue > 0
    ? staffOverrideValue
    : undefined;
  return Math.max(0, Math.floor(Number(resourceOverride?.amount ?? staffOverride ?? service.priceAmount ?? service.priceTwd ?? 0)));
}

/**
 * Resolve the discount applied to a paid service subtotal. Returns the
 * discount result plus the normalized code so the snapshot can expose a
 * stable `discountCode` even when the discount amount is zero.
 */
function resolveDiscount(
  service: BookingService,
  subtotalAmount: number,
  options: BookingPriceOptions | undefined,
) {
  const code = options?.discountCode;
  if (!code || service.paymentMode !== 'paid') {
    return { applied: false, discountAmount: 0, code: undefined as string | undefined };
  }
  const result = calculateBookingDiscount(
    { code, locale: options?.locale, subtotalAmount },
    normalizeBookingDiscountRules(service.discountCodes ?? []),
  );
  return {
    applied: result.applied && result.discountAmount > 0,
    discountAmount: result.discountAmount,
    code: result.applied && result.discountAmount > 0 ? result.code : undefined,
  };
}

export function bookingServicePriceSnapshot(service: BookingService, options?: BookingPriceOptions): BookingPriceSnapshot {
  const eligibleForOverride = service.paymentMode === 'paid';
  const resourceOverride = eligibleForOverride
    ? resolveResourceOverride(service, options?.resourceIds)
    : undefined;
  const subtotalAmount = bookingServiceTotalAmount(service, options);
  const currency = service.priceCurrency ?? 'TWD';
  const payLater = service.paymentMode === 'paid' && service.collectPaymentLater === true;
  const effectiveResourceId = resourceOverride?.resourceId;

  const discount = resolveDiscount(service, subtotalAmount, options);
  const totalAmount = Math.max(0, subtotalAmount - discount.discountAmount);
  const discountFields = discount.applied
    ? {
        subtotalAmount,
        discountAmount: discount.discountAmount,
        discountCode: discount.code,
      }
    : {};

  if (payLater) {
    return {
      paymentRequired: false,
      totalAmount,
      currency,
      amountDueNow: 0,
      balanceDueAfterOnlinePayment: totalAmount,
      isDeposit: false,
      payLater: true,
      ...(effectiveResourceId ? { effectiveResourceId } : {}),
      ...discountFields,
    };
  }

  if (service.paymentMode !== 'paid') {
    return {
      paymentRequired: false,
      totalAmount,
      currency,
      amountDueNow: 0,
      balanceDueAfterOnlinePayment: totalAmount,
      isDeposit: false,
      payLater: false,
    };
  }

  const configuredDeposit = Math.floor(Number(service.depositAmount ?? 0));
  const depositAmount = configuredDeposit > 0 && configuredDeposit < totalAmount
    ? configuredDeposit
    : undefined;
  const amountDueNow = depositAmount ?? totalAmount;

  return {
    paymentRequired: true,
    totalAmount,
    currency,
    amountDueNow,
    depositAmount,
    balanceDueAfterOnlinePayment: Math.max(0, totalAmount - amountDueNow),
    isDeposit: Boolean(depositAmount),
    payLater: false,
    ...(effectiveResourceId ? { effectiveResourceId } : {}),
    ...discountFields,
  };
}
