import type { Booking, BookingCancellationPolicy, BookingService } from './types';
import { getService } from './storage';

/**
 * Shared cancel-refund logic used by /api/booking/cancel and
 * /api/booking/manage/[token]. Both entry points need to apply the same
 * cancellation policy and Stripe-refund attempt; previously /manage just
 * flipped status='cancelled' with no refund consideration.
 */

interface CancellationPolicyShape extends Pick<
  BookingCancellationPolicy,
  'policyId' | 'name' | 'description' | 'fullRefundHoursBefore' | 'partialRefundHoursBefore' | 'partialRefundPercent'
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
  refundDecision: RefundDecision;
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
};

const CANCELLATION_POLICIES: Record<string, CancellationPolicyShape> = {
  'standard-24h': {
    policyId: 'standard-24h',
    name: 'Standard policy',
    description: 'Full refund 24 hours before start, partial refund 6 hours before start.',
    cancelHoursBefore: 0,
    rescheduleHoursBefore: 6,
    fullRefundHoursBefore: 24,
    partialRefundHoursBefore: 6,
    partialRefundPercent: 50,
  },
  'strict-48h': {
    policyId: 'strict-48h',
    name: 'Strict policy',
    description: 'Full refund 48 hours before start, partial refund 24 hours before start.',
    cancelHoursBefore: 6,
    rescheduleHoursBefore: 24,
    fullRefundHoursBefore: 48,
    partialRefundHoursBefore: 24,
    partialRefundPercent: 50,
  },
  'flexible-6h': {
    policyId: 'flexible-6h',
    name: 'Flexible policy',
    description: 'Full refund 6 hours before start.',
    cancelHoursBefore: 0,
    rescheduleHoursBefore: 0,
    fullRefundHoursBefore: 6,
    partialRefundHoursBefore: 0,
    partialRefundPercent: 0,
  },
};

export type RefundDecision = 'full' | 'partial' | 'none';

export interface RefundOutcome {
  decision: RefundDecision;
  hoursUntilStart: number;
  refundResult: { ok: boolean; refundId?: string; error?: string } | null;
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
  if (!policy || booking.paymentStatus !== 'paid') return 'none';
  if (hoursUntilStart >= policy.fullRefundHoursBefore) return 'full';
  if (policy.partialRefundPercent > 0 && hoursUntilStart >= policy.partialRefundHoursBefore) return 'partial';
  return 'none';
}

export function resolveCancellationPolicy(service?: BookingService | null): CancellationPolicyShape | null {
  if (!service?.cancellationPolicyId) return null;
  return CANCELLATION_POLICIES[service.cancellationPolicyId] ?? CANCELLATION_POLICIES['standard-24h'];
}

async function loadPolicyForService(serviceId: string): Promise<CancellationPolicyShape | null> {
  return resolveCancellationPolicy(await getService(serviceId));
}

export function evaluateBookingSelfServicePolicy(
  booking: Booking,
  service?: BookingService | null,
  now = Date.now(),
): BookingSelfServicePolicy {
  const policy = resolveCancellationPolicy(service);
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
    refundDecision: refundDecisionFor(booking, policy, hoursUntilStart),
    ...(!canCancel
      ? { cancelBlockedReason: !isManageableStatus ? 'Booking is no longer active.' : hoursUntilStart <= 0 ? 'Booking has already started.' : `Cancellation requires at least ${effectivePolicy.cancelHoursBefore} hours before start.` }
      : {}),
    ...(!canReschedule
      ? { rescheduleBlockedReason: !isManageableStatus ? 'Booking is no longer active.' : hoursUntilStart <= 0 ? 'Booking has already started.' : `Reschedule requires at least ${effectivePolicy.rescheduleHoursBefore} hours before start.` }
      : {}),
  };
}

async function attemptStripeRefund(paymentIntentId: string, amountCents?: number): Promise<RefundOutcome['refundResult']> {
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
  const policy = service ? resolveCancellationPolicy(service) : await loadPolicyForService(booking.serviceId);
  const hoursUntilStart = hoursUntil(booking.startAt);
  const decision = refundDecisionFor(booking, policy, hoursUntilStart);

  let partialAmountCents: number | undefined;
  let refundResult: RefundOutcome['refundResult'] = null;
  if (decision !== 'none' && booking.paymentIntentId) {
    if (decision === 'partial' && policy) {
      const svc = service ?? (await getService(booking.serviceId));
      if (svc?.priceAmount && svc.priceAmount > 0) {
        partialAmountCents = Math.max(
          1,
          Math.floor((svc.priceAmount * policy.partialRefundPercent) / 100),
        );
      }
    }
    refundResult = await attemptStripeRefund(booking.paymentIntentId, partialAmountCents);
  }

  return {
    decision,
    hoursUntilStart,
    refundResult,
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
