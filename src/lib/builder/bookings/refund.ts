import type { Booking, BookingService } from './types';
import { getService } from './storage';

/**
 * Shared cancel-refund logic used by /api/booking/cancel and
 * /api/booking/manage/[token]. Both entry points need to apply the same
 * cancellation policy and Stripe-refund attempt; previously /manage just
 * flipped status='cancelled' with no refund consideration.
 */

interface CancellationPolicyShape {
  fullRefundHoursBefore: number;
  partialRefundHoursBefore: number;
  partialRefundPercent: number;
}

export type RefundDecision = 'full' | 'partial' | 'none';

export interface RefundOutcome {
  decision: RefundDecision;
  hoursUntilStart: number;
  refundResult: { ok: boolean; refundId?: string; error?: string } | null;
  partialAmountCents?: number;
}

async function loadPolicyForService(serviceId: string): Promise<CancellationPolicyShape | null> {
  const svc = await getService(serviceId);
  if (!svc?.cancellationPolicyId) return null;
  return {
    fullRefundHoursBefore: 24,
    partialRefundHoursBefore: 6,
    partialRefundPercent: 50,
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
  const policy = await loadPolicyForService(booking.serviceId);
  const hoursUntilStart = (Date.parse(booking.startAt) - Date.now()) / (1000 * 60 * 60);

  let decision: RefundDecision = 'none';
  if (policy && booking.paymentStatus === 'paid') {
    if (hoursUntilStart >= policy.fullRefundHoursBefore) decision = 'full';
    else if (hoursUntilStart >= policy.partialRefundHoursBefore) decision = 'partial';
  }

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
    hoursUntilStart: Math.round(hoursUntilStart * 10) / 10,
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
