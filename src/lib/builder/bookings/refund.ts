import { createHash } from 'node:crypto';

import type { Booking, BookingCancellationPolicy, BookingService } from './types';
import { getCancellationPolicy, getService } from './storage';

/**
 * Shared cancel-refund logic used by /api/booking/cancel and
 * /api/booking/manage/[token]. Both entry points need to apply the same
 * cancellation policy and Stripe-refund attempt; previously /manage just
 * flipped status='cancelled' with no refund consideration.
 */

interface CancellationPolicyShape extends Pick<
  BookingCancellationPolicy,
  'policyId' | 'name' | 'description' | 'fullRefundHoursBefore' | 'partialRefundHoursBefore' | 'partialRefundPercent' | 'cancellationFeePercent'
> {
  cancelHoursBefore: number;
  rescheduleHoursBefore: number;
}

export interface BookingSelfServicePolicy {
  policyId: string | null;
  name: string;
  description?: string;
  hoursUntilStart: number;
  canCancel: boolean;
  canReschedule: boolean;
  cancelHoursBefore: number;
  rescheduleHoursBefore: number;
  fullRefundHoursBefore: number;
  partialRefundHoursBefore: number;
  partialRefundPercent: number;
  cancellationFeePercent: number;
  refundDecision: RefundDecision;
  refundAmountCents?: number;
  cancelBlockedReason?: string;
  rescheduleBlockedReason?: string;
}

const DEFAULT_SELF_SERVICE_POLICY: CancellationPolicyShape = {
  policyId: 'default',
  name: 'Default booking policy',
  description: 'Bookings can be managed until the appointment starts.',
  cancelHoursBefore: 0,
  rescheduleHoursBefore: 0,
  fullRefundHoursBefore: 0,
  partialRefundHoursBefore: 0,
  partialRefundPercent: 0,
  cancellationFeePercent: 0,
};

export type RefundDecision = 'full' | 'partial' | 'none';

export interface RefundOutcome {
  decision: RefundDecision;
  hoursUntilStart: number;
  refundResult: { ok: boolean; refundId?: string; error?: string } | null;
  refundAmountCents?: number;
  partialAmountCents?: number;
}

function hoursUntil(startAt: string, now = Date.now()): number {
  return Math.round(((Date.parse(startAt) - now) / (1000 * 60 * 60)) * 10) / 10;
}

function refundDecisionFor(
  booking: Booking,
  policy: CancellationPolicyShape | null,
  hoursUntilStart: number,
): RefundDecision {
  if (!policy || !hasRefundableOnlinePayment(booking)) return 'none';
  if (hoursUntilStart >= policy.fullRefundHoursBefore) return 'full';
  if (policy.partialRefundPercent > 0 && hoursUntilStart >= policy.partialRefundHoursBefore) return 'partial';
  return 'none';
}

function hasRefundableOnlinePayment(booking: Booking): boolean {
  return booking.paymentStatus === 'paid' || booking.paymentStatus === 'partially_paid';
}

function refundableOnlineAmount(booking: Booking, service: BookingService): number {
  const onlinePaidAmount = Math.max(0, Math.floor(booking.onlinePaidAmount ?? 0));
  if (onlinePaidAmount > 0) return onlinePaidAmount;
  const totalAmount = Math.max(0, Math.floor(booking.paymentAmount ?? service.priceAmount ?? service.priceTwd ?? 0));
  const dueNowAmount = Math.max(0, Math.floor(booking.paymentDueNow ?? 0));
  if (booking.paymentStatus === 'partially_paid') {
    return dueNowAmount > 0 ? Math.min(dueNowAmount, totalAmount) : 0;
  }
  return totalAmount;
}

function refundAmountForDecision(
  booking: Booking,
  service: BookingService | null | undefined,
  policy: CancellationPolicyShape | null,
  decision: RefundDecision,
): number {
  if (!policy || !hasRefundableOnlinePayment(booking) || decision === 'none' || !service) return 0;
  const gross = refundableOnlineAmount(booking, service);
  if (gross <= 0) return 0;
  const baseRefund = decision === 'full'
    ? gross
    : Math.floor((gross * policy.partialRefundPercent) / 100);
  if (baseRefund <= 0) return 0;
  const fee = Math.floor((baseRefund * policy.cancellationFeePercent) / 100);
  return Math.max(0, baseRefund - fee);
}

function toCancellationPolicyShape(policy: BookingCancellationPolicy): CancellationPolicyShape {
  return {
    policyId: policy.policyId,
    name: policy.name,
    description: policy.description,
    cancelHoursBefore: policy.cancelHoursBefore,
    rescheduleHoursBefore: policy.rescheduleHoursBefore,
    fullRefundHoursBefore: policy.fullRefundHoursBefore,
    partialRefundHoursBefore: policy.partialRefundHoursBefore,
    partialRefundPercent: policy.partialRefundPercent,
    cancellationFeePercent: policy.cancellationFeePercent,
  };
}

export async function resolveCancellationPolicy(service?: BookingService | null): Promise<CancellationPolicyShape | null> {
  if (!service?.cancellationPolicyId) return null;
  const policy = await getCancellationPolicy(service.cancellationPolicyId);
  return policy ? toCancellationPolicyShape(policy) : null;
}

export async function evaluateBookingSelfServicePolicy(
  booking: Booking,
  service?: BookingService | null,
  now = Date.now(),
): Promise<BookingSelfServicePolicy> {
  const policy = await resolveCancellationPolicy(service);
  const effectivePolicy = policy ?? DEFAULT_SELF_SERVICE_POLICY;
  const hoursUntilStart = hoursUntil(booking.startAt, now);
  const isManageableStatus = booking.status === 'pending' || booking.status === 'confirmed';
  const isActiveFutureBooking = isManageableStatus && hoursUntilStart > 0;
  const canCancel = isActiveFutureBooking && hoursUntilStart >= effectivePolicy.cancelHoursBefore;
  const canReschedule = isActiveFutureBooking && hoursUntilStart >= effectivePolicy.rescheduleHoursBefore;

  return {
    policyId: policy?.policyId ?? null,
    name: effectivePolicy.name,
    description: effectivePolicy.description,
    hoursUntilStart,
    canCancel,
    canReschedule,
    cancelHoursBefore: effectivePolicy.cancelHoursBefore,
    rescheduleHoursBefore: effectivePolicy.rescheduleHoursBefore,
    fullRefundHoursBefore: effectivePolicy.fullRefundHoursBefore,
    partialRefundHoursBefore: effectivePolicy.partialRefundHoursBefore,
    partialRefundPercent: effectivePolicy.partialRefundPercent,
    cancellationFeePercent: effectivePolicy.cancellationFeePercent,
    refundDecision: refundDecisionFor(booking, policy, hoursUntilStart),
    refundAmountCents: refundAmountForDecision(booking, service, policy, refundDecisionFor(booking, policy, hoursUntilStart)),
    ...(!canCancel
      ? { cancelBlockedReason: !isManageableStatus ? 'Booking is no longer active.' : hoursUntilStart <= 0 ? 'Booking has already started.' : `Cancellation requires at least ${effectivePolicy.cancelHoursBefore} hours before start.` }
      : {}),
    ...(!canReschedule
      ? { rescheduleBlockedReason: !isManageableStatus ? 'Booking is no longer active.' : hoursUntilStart <= 0 ? 'Booking has already started.' : `Reschedule requires at least ${effectivePolicy.rescheduleHoursBefore} hours before start.` }
      : {}),
  };
}

function stripeRefundIdempotencyKey(
  bookingId: string,
  paymentIntentId: string,
  amountCents: number,
  decision: RefundDecision,
): string {
  const digest = createHash('sha256')
    .update(JSON.stringify([bookingId, paymentIntentId, amountCents, decision]))
    .digest('hex');
  return `booking-refund-v1:${digest}`;
}

async function attemptStripeRefund(
  bookingId: string,
  paymentIntentId: string,
  amountCents: number,
  decision: RefundDecision,
): Promise<RefundOutcome['refundResult']> {
  const key = process.env.STRIPE_SECRET_KEY ?? '';
  if (!key) return { ok: false, error: 'STRIPE_SECRET_KEY unset' };
  try {
    const body = new URLSearchParams();
    body.set('payment_intent', paymentIntentId);
    if (amountCents !== undefined) body.set('amount', String(amountCents));
    const res = await fetch('https://api.stripe.com/v1/refunds', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': stripeRefundIdempotencyKey(bookingId, paymentIntentId, amountCents, decision),
      },
      body: body.toString(),
    });
    if (!res.ok) return { ok: false, error: `Stripe ${res.status}` };
    const data = (await res.json()) as { id?: string };
    return { ok: true, refundId: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function computeRefundForCancel(booking: Booking, service?: BookingService): Promise<RefundOutcome> {
  const resolvedService = service ?? await getService(booking.serviceId);
  const policy = resolvedService ? await resolveCancellationPolicy(resolvedService) : null;
  const hoursUntilStart = hoursUntil(booking.startAt);
  const decision = refundDecisionFor(booking, policy, hoursUntilStart);
  const refundAmountCents = refundAmountForDecision(booking, resolvedService, policy, decision);
  let partialAmountCents: number | undefined;
  let refundResult: RefundOutcome['refundResult'] = null;
  if (decision !== 'none' && refundAmountCents > 0 && booking.paymentIntentId) {
    if (decision === 'partial') {
      partialAmountCents = refundAmountCents;
    }
    refundResult = await attemptStripeRefund(
      booking.bookingId,
      booking.paymentIntentId,
      refundAmountCents,
      decision,
    );
  }

  return {
    decision,
    hoursUntilStart,
    refundResult,
    refundAmountCents,
    partialAmountCents,
  };
}

/** Apply the refund outcome to a booking record (does not save). */
export function applyRefundOutcome(
  booking: Booking,
  outcome: RefundOutcome,
  reason: string | undefined,
): Booking {
  const now = new Date().toISOString();
  const refundSucceeded = outcome.refundResult?.ok === true;
  const nextPaymentStatus =
    outcome.decision === 'full' && refundSucceeded
      ? 'refunded'
      : outcome.decision === 'partial' && refundSucceeded
        ? 'partial-refund'
        : booking.paymentStatus;
  return {
    ...booking,
    status: 'cancelled' as const,
    cancelledAt: now,
    cancellationReason: reason,
    paymentStatus: nextPaymentStatus,
    updatedAt: now,
  };
}
