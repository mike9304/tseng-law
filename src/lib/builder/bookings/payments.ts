import { randomUUID } from 'node:crypto';
import type {
  Booking,
  BookingBillingDocument,
  BookingManualPayment,
  BookingManualPaymentMethod,
  BookingManualPaymentStatus,
  BookingPaymentStatus,
  BookingService,
} from '@/lib/builder/bookings/types';
import { getBooking, getService, saveBooking } from '@/lib/builder/bookings/storage';
import { appendPaymentLinkHistory } from '@/lib/builder/billing-payment-link-history';

type BookingPaymentCurrency = NonNullable<BookingService['priceCurrency']>;

export function bookingPaymentAmountFor(booking: Booking, service?: BookingService | null): number {
  return Math.max(0, booking.paymentAmount ?? service?.priceAmount ?? service?.priceTwd ?? 0);
}

export function bookingPaymentCurrencyFor(
  booking: Booking,
  service?: BookingService | null,
): BookingPaymentCurrency {
  return booking.paymentCurrency ?? service?.priceCurrency ?? 'TWD';
}

export function successfulBookingManualPaymentTotal(booking: Booking): number {
  return (booking.manualPayments ?? [])
    .filter((payment) => payment.status === 'succeeded')
    .reduce((total, payment) => total + payment.amountCents, 0);
}

export function successfulBookingOnlinePaymentTotal(booking: Booking): number {
  return Math.max(0, booking.onlinePaidAmount ?? 0);
}

export function bookingPaymentBalanceDue(booking: Booking, service?: BookingService | null): number {
  const amount = bookingPaymentAmountFor(booking, service);
  if (booking.paymentStatus === 'paid' || booking.paymentStatus === 'refunded' || booking.paymentStatus === 'partial-refund') {
    return 0;
  }
  return Math.max(0, amount - successfulBookingOnlinePaymentTotal(booking) - successfulBookingManualPaymentTotal(booking));
}

function normalizeManualPaymentMethod(method?: BookingManualPaymentMethod): BookingManualPaymentMethod {
  return method === 'cash' || method === 'bank_transfer' || method === 'check' || method === 'other'
    ? method
    : 'other';
}

function isCurrentInvoice(document: BookingBillingDocument): boolean {
  return document.type === 'invoice' && (document.status === 'issued' || document.status === 'emailed_stub');
}

function updateCurrentInvoiceBalances(
  documents: BookingBillingDocument[] | undefined,
  balanceDue: number,
  now: string,
  input: { revokedByPaymentId?: string } = {},
): BookingBillingDocument[] | undefined {
  if (!documents?.length) return documents;
  let changed = false;
  const next = documents.map((document) => {
    if (!isCurrentInvoice(document)) return document;
    changed = true;
    const shouldRevokePaymentLink = Boolean(document.paymentLinkCreatedAt)
      && !document.paymentLinkRevokedAt
      && document.balanceDue !== balanceDue;
    const nextDocument = {
      ...document,
      balanceDue,
      paymentLinkRevokedAt: shouldRevokePaymentLink ? now : document.paymentLinkRevokedAt,
      paymentLinkRevokedReason: shouldRevokePaymentLink ? 'balance_changed' : document.paymentLinkRevokedReason,
      paymentLinkRevokedBalanceDue: shouldRevokePaymentLink ? balanceDue : document.paymentLinkRevokedBalanceDue,
      paymentLinkRevokedByPaymentId: shouldRevokePaymentLink ? input.revokedByPaymentId : document.paymentLinkRevokedByPaymentId,
    };
    if (!shouldRevokePaymentLink) return nextDocument;
    return appendPaymentLinkHistory(nextDocument, {
      type: 'revoked',
      actor: 'system',
      createdAt: now,
      paymentLinkId: document.paymentLinkId,
      reason: 'balance_changed',
      balanceDue,
      paymentId: input.revokedByPaymentId,
    });
  });
  return changed ? next : documents;
}

export async function recordBookingManualPayment(
  bookingId: string,
  input: {
    amountCents: number;
    method?: BookingManualPaymentMethod;
    status?: BookingManualPaymentStatus;
    reference?: string;
    note?: string;
    idempotencyKey?: string;
    actor?: 'admin' | 'system';
  },
): Promise<{ booking: Booking | null; manualPayment: BookingManualPayment | null; error?: string }> {
  const booking = await getBooking(bookingId);
  if (!booking) return { booking: null, manualPayment: null, error: 'booking_not_found' };
  const idempotencyKey = input.idempotencyKey?.trim();
  const existingPayment = idempotencyKey
    ? (booking.manualPayments ?? []).find((payment) => payment.idempotencyKey === idempotencyKey)
    : undefined;
  if (existingPayment) return { booking, manualPayment: existingPayment };
  if (booking.status === 'cancelled') {
    return { booking, manualPayment: null, error: 'booking_cancelled' };
  }
  if (booking.paymentStatus === 'refunded' || booking.paymentStatus === 'partial-refund') {
    return { booking, manualPayment: null, error: 'booking_refund_locked' };
  }

  const service = await getService(booking.serviceId);
  const amountCents = Math.floor(Number(input.amountCents));
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return { booking, manualPayment: null, error: 'manual_payment_amount_invalid' };
  }

  const balanceDue = bookingPaymentBalanceDue(booking, service);
  if (balanceDue <= 0 || booking.paymentStatus === 'paid') {
    return { booking, manualPayment: null, error: 'booking_already_paid' };
  }
  if (amountCents > balanceDue) {
    return { booking, manualPayment: null, error: 'manual_payment_exceeds_balance' };
  }

  const currency = bookingPaymentCurrencyFor(booking, service);
  const now = new Date().toISOString();
  const status: BookingManualPaymentStatus = input.status === 'pending'
    || input.status === 'failed'
    || input.status === 'canceled'
    || input.status === 'succeeded'
    ? input.status
    : 'succeeded';
  const manualPayment: BookingManualPayment = {
    paymentId: `bmp_${randomUUID()}`,
    amountCents,
    currency,
    method: normalizeManualPaymentMethod(input.method),
    reference: input.reference?.trim() || undefined,
    note: input.note?.trim() || undefined,
    idempotencyKey: idempotencyKey || undefined,
    status,
    actor: input.actor ?? 'admin',
    createdAt: now,
  };
  const succeeded = status === 'succeeded';
  const paidTotal = successfulBookingOnlinePaymentTotal(booking) + successfulBookingManualPaymentTotal(booking) + (succeeded ? amountCents : 0);
  const totalDue = bookingPaymentAmountFor(booking, service);
  const nextBalanceDue = Math.max(0, totalDue - paidTotal);
  const nextPaymentStatus: BookingPaymentStatus = succeeded
    ? (nextBalanceDue <= 0 ? 'paid' : 'partially_paid')
    : (booking.paymentStatus ?? 'unpaid');
  const nextBooking: Booking = {
    ...booking,
    paymentStatus: nextPaymentStatus,
    paymentAmount: booking.paymentAmount ?? totalDue,
    paymentCurrency: booking.paymentCurrency ?? currency,
    manualPayments: [...(booking.manualPayments ?? []), manualPayment],
    billingDocuments: succeeded
      ? updateCurrentInvoiceBalances(booking.billingDocuments, nextBalanceDue, now, { revokedByPaymentId: manualPayment.paymentId })
      : booking.billingDocuments,
    updatedAt: now,
  };

  await saveBooking(nextBooking);
  return { booking: nextBooking, manualPayment };
}
