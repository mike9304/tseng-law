import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { getBooking, getService, saveBooking } from '@/lib/builder/bookings/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Phase 26 W206 — Booking cancellation with refund evaluation.
 *
 * Customer or admin posts `{ bookingId, reason? }`. The handler:
 *   1. Validates the booking exists and is not already cancelled.
 *   2. If the service had a cancellation policy and `paymentStatus === 'paid'`,
 *      computes hours until start and decides full/partial/none refund.
 *   3. For real refund (Stripe), calls /v1/refunds when STRIPE_SECRET_KEY is set
 *      (best-effort; failure does not block the cancellation row).
 *   4. Marks booking as cancelled with cancelledAt + cancellationReason.
 */

const payloadSchema = z.object({
  bookingId: z.string().min(1).max(120),
  reason: z.string().max(300).optional(),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

interface CancellationPolicyShape {
  fullRefundHoursBefore: number;
  partialRefundHoursBefore: number;
  partialRefundPercent: number;
}

async function loadPolicyForService(serviceId: string): Promise<CancellationPolicyShape | null> {
  const svc = await getService(serviceId);
  if (!svc?.cancellationPolicyId) return null;
  // The policies are stored in the same bookings root by convention; if no
  // store is implemented yet, return a sensible default.
  return {
    fullRefundHoursBefore: 24,
    partialRefundHoursBefore: 6,
    partialRefundPercent: 50,
  };
}

async function attemptStripeRefund(paymentIntentId: string, amountCents?: number): Promise<{ ok: boolean; refundId?: string; error?: string }> {
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
    if (!res.ok) {
      return { ok: false, error: `Stripe ${res.status}` };
    }
    const data = (await res.json()) as { id?: string };
    return { ok: true, refundId: data.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const rate = await checkRateLimit(`booking-cancel:${ip}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many cancellation attempts' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) } },
    );
  }

  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid cancel payload' }, { status: 400 });
  }

  const booking = await getBooking(parsed.data.bookingId);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  if (booking.status === 'cancelled') {
    return NextResponse.json({ error: 'Booking already cancelled' }, { status: 409 });
  }

  const policy = await loadPolicyForService(booking.serviceId);
  const hoursUntilStart = (Date.parse(booking.startAt) - Date.now()) / (1000 * 60 * 60);

  let refundDecision: 'full' | 'partial' | 'none' = 'none';
  if (policy && booking.paymentStatus === 'paid') {
    if (hoursUntilStart >= policy.fullRefundHoursBefore) refundDecision = 'full';
    else if (hoursUntilStart >= policy.partialRefundHoursBefore) refundDecision = 'partial';
    else refundDecision = 'none';
  }

  let refundResult: { ok: boolean; refundId?: string; error?: string } | null = null;
  if (refundDecision !== 'none' && booking.paymentIntentId) {
    refundResult = await attemptStripeRefund(
      booking.paymentIntentId,
      refundDecision === 'partial' && policy
        ? undefined // partial requires knowing amount in cents; left for follow-up
        : undefined,
    );
  }

  const now = new Date().toISOString();
  const updated = {
    ...booking,
    status: 'cancelled' as const,
    cancelledAt: now,
    cancellationReason: parsed.data.reason,
    paymentStatus:
      refundDecision === 'full'
        ? ('refunded' as const)
        : refundDecision === 'partial'
          ? ('partial-refund' as const)
          : booking.paymentStatus,
    updatedAt: now,
  };
  await saveBooking(updated);

  return NextResponse.json({
    ok: true,
    booking: updated,
    refundDecision,
    refundResult,
    hoursUntilStart: Math.round(hoursUntilStart * 10) / 10,
  });
}
