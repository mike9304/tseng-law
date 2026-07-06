import type { Locale } from '@/lib/locales';
import type { Booking, BookingService } from './types';

export const bookingPaymentAttributionProviders = [
  'stripe',
  'manual',
  'package-credit',
  'pay-later',
  'free',
] as const;

export type BookingPaymentAttributionProvider = (typeof bookingPaymentAttributionProviders)[number];

export type BookingPaymentAttributionItem = {
  readonly provider: BookingPaymentAttributionProvider;
  readonly label: string;
  readonly total: number;
  readonly paidBookings: number;
  readonly revenueAmount: number;
};

type BookingPaymentAttributionBucket = {
  provider: BookingPaymentAttributionProvider;
  label: string;
  total: number;
  paidBookings: number;
  revenueAmount: number;
};

function providerLabel(provider: BookingPaymentAttributionProvider, locale: Locale): string {
  if (locale === 'ko') {
    switch (provider) {
      case 'stripe': return 'Stripe 온라인';
      case 'manual': return '수동 결제';
      case 'package-credit': return '패키지 크레딧';
      case 'pay-later': return '후불/미수금';
      case 'free': return '무료 예약';
    }
  }
  if (locale === 'zh-hant') {
    switch (provider) {
      case 'stripe': return 'Stripe 線上付款';
      case 'manual': return '手動付款';
      case 'package-credit': return '方案點數';
      case 'pay-later': return '稍後付款／未收款';
      case 'free': return '免費預約';
    }
  }
  switch (provider) {
    case 'stripe': return 'Stripe online';
    case 'manual': return 'Manual payment';
    case 'package-credit': return 'Package credit';
    case 'pay-later': return 'Pay later / unpaid';
    case 'free': return 'Free booking';
  }
}

function manualPaymentTotal(booking: Booking): number {
  return (booking.manualPayments ?? [])
    .filter((payment) => payment.status === 'succeeded')
    .reduce((total, payment) => total + payment.amountCents, 0);
}

function onlinePaymentTotal(booking: Booking): number {
  return Math.max(0, booking.onlinePaidAmount ?? 0);
}

function serviceAmount(booking: Booking, service?: BookingService): number {
  return Math.max(0, booking.paymentAmount ?? service?.priceAmount ?? service?.priceTwd ?? 0);
}

function resolvePaymentProvider(booking: Booking, service?: BookingService): BookingPaymentAttributionProvider {
  if (booking.paymentIntentId || onlinePaymentTotal(booking) > 0) return 'stripe';
  if (manualPaymentTotal(booking) > 0) return 'manual';
  if (booking.packageCreditId || (booking.packageCreditsUsed ?? 0) > 0) return 'package-credit';
  if (service?.paymentMode === 'paid' || booking.paymentStatus === 'unpaid') return 'pay-later';
  return 'free';
}

function paymentRevenueAmount(
  provider: BookingPaymentAttributionProvider,
  booking: Booking,
  service?: BookingService,
): number {
  switch (provider) {
    case 'stripe':
      if (onlinePaymentTotal(booking) > 0) return onlinePaymentTotal(booking);
      if (booking.paymentStatus === 'paid' || booking.paymentStatus === 'refunded' || booking.paymentStatus === 'partial-refund') {
        return Math.max(0, booking.paymentDueNow ?? serviceAmount(booking, service));
      }
      return 0;
    case 'manual':
      return manualPaymentTotal(booking);
    case 'package-credit':
      return serviceAmount(booking, service);
    case 'pay-later':
    case 'free':
      return 0;
  }
}

function getBucket(
  buckets: Map<BookingPaymentAttributionProvider, BookingPaymentAttributionBucket>,
  provider: BookingPaymentAttributionProvider,
  locale: Locale,
): BookingPaymentAttributionBucket {
  const existing = buckets.get(provider);
  if (existing) return existing;
  const bucket: BookingPaymentAttributionBucket = {
    provider,
    label: providerLabel(provider, locale),
    total: 0,
    paidBookings: 0,
    revenueAmount: 0,
  };
  buckets.set(provider, bucket);
  return bucket;
}

export function buildBookingPaymentAttribution(
  bookings: readonly Booking[],
  services: readonly BookingService[],
  locale: Locale,
): BookingPaymentAttributionItem[] {
  const serviceById = new Map(services.map((service) => [service.serviceId, service]));
  const buckets = new Map<BookingPaymentAttributionProvider, BookingPaymentAttributionBucket>();

  for (const booking of bookings) {
    const service = serviceById.get(booking.serviceId);
    const provider = resolvePaymentProvider(booking, service);
    const revenueAmount = paymentRevenueAmount(provider, booking, service);
    const bucket = getBucket(buckets, provider, locale);
    bucket.total += 1;
    bucket.paidBookings += revenueAmount > 0 ? 1 : 0;
    bucket.revenueAmount += revenueAmount;
  }

  const result: BookingPaymentAttributionItem[] = [];
  for (const provider of bookingPaymentAttributionProviders) {
    const bucket = buckets.get(provider);
    if (bucket && bucket.total > 0) result.push({ ...bucket });
  }
  return result;
}
