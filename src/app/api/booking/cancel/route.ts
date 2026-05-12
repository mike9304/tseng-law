import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { getBooking, saveBooking } from '@/lib/builder/bookings/storage';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import { applyRefundOutcome, computeRefundForCancel } from '@/lib/builder/bookings/refund';

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

  const outcome = await computeRefundForCancel(booking);
  const updated = applyRefundOutcome(booking, outcome, parsed.data.reason);
  // Narrow the cancel race: re-read immediately before write so a parallel
  // cancel that already flipped status to 'cancelled' wins, and we don't
  // double-refund or clobber its updatedAt.
  const latest = await getBooking(parsed.data.bookingId);
  if (latest && latest.status === 'cancelled') {
    return NextResponse.json(
      { error: 'Booking already cancelled', booking: latest },
      { status: 409 },
    );
  }
  await saveBooking(updated);
  emitEvent('booking.cancelled', {
    bookingId: updated.bookingId,
    reason: parsed.data.reason,
    refundDecision: outcome.decision,
    paymentStatus: updated.paymentStatus,
  });

  return NextResponse.json({
    ok: true,
    booking: updated,
    refundDecision: outcome.decision,
    refundResult: outcome.refundResult,
    hoursUntilStart: outcome.hoursUntilStart,
  });
}
