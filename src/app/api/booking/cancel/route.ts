import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getBooking,
  getService,
  getStaff,
  hasDurableBookingStorage,
  saveBooking,
} from '@/lib/builder/bookings/storage';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import { applyRefundOutcome, computeRefundForCancel, evaluateBookingSelfServicePolicy } from '@/lib/builder/bookings/refund';
import { sendBookingCancellation } from '@/lib/builder/bookings/notifications';
import { restorePackageCreditForBooking } from '@/lib/builder/bookings/packages';
import { verifyBookingManageToken } from '@/lib/builder/bookings/manage-token';
import { acquireSlotLock, releaseSlotLock, renewSlotLock } from '@/lib/builder/bookings/slot-lock';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Phase 26 W206 — Booking cancellation with refund evaluation.
 *
 * Customer posts `{ bookingId, token, reason? }` where `token` is the signed
 * manage token (createBookingManageToken) proving ownership of the booking.
 * Admin cancellations go through the authenticated builder route
 * (/api/builder/bookings/[id]). The handler:
 *   1. Verifies the manage token matches the bookingId + customer email.
 *   2. Validates the booking exists and is not already cancelled.
 *   3. If the service had a cancellation policy and `paymentStatus === 'paid'`,
 *      computes hours until start and decides full/partial/none refund.
 *   4. For real refund (Stripe), calls /v1/refunds when STRIPE_SECRET_KEY is set
 *      (best-effort; failure does not block the cancellation row).
 *   5. Marks booking as cancelled with cancelledAt + cancellationReason.
 */

const payloadSchema = z.object({
  bookingId: z.string().min(1).max(120),
  reason: z.string().max(300).optional(),
  token: z.string().min(1).max(2000).optional(),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;
  if (!hasDurableBookingStorage()) {
    return NextResponse.json(
      { error: 'Booking storage is temporarily unavailable. Try again shortly.', errorCode: 'booking_storage_unavailable' },
      { status: 503 },
    );
  }

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

  // Ownership proof: require a signed manage token whose bookingId + customer
  // email match this booking. Without it, any anonymous caller could cancel any
  // booking (and force a Stripe refund) by guessing/enumerating bookingId.
  const verified = parsed.data.token ? verifyBookingManageToken(parsed.data.token) : null;
  if (!verified || verified.bookingId !== parsed.data.bookingId) {
    return NextResponse.json({ error: 'Booking ownership verification required.' }, { status: 401 });
  }

  const booking = await getBooking(parsed.data.bookingId);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  if (booking.customer.email.toLowerCase() !== verified.email) {
    return NextResponse.json({ error: 'Booking ownership verification required.' }, { status: 403 });
  }
  if (booking.status === 'cancelled') {
    return NextResponse.json({ error: 'Booking already cancelled' }, { status: 409 });
  }

  const slotLease = await acquireSlotLock({
    serviceId: booking.serviceId,
    staffId: booking.staffId,
    startAt: booking.startAt,
    resourceIds: booking.resourceIds,
    bookingId: booking.bookingId,
  });
  if (!slotLease) {
    return NextResponse.json({ error: 'Booking is being updated. Try again shortly.' }, { status: 409 });
  }

  try {
    // The booking may have been cancelled while this request waited for the
    // booking-id lease. Re-read before initiating any refund or credit change.
    const latestBooking = await getBooking(parsed.data.bookingId);
    if (!latestBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    if (latestBooking.status === 'cancelled') {
      return NextResponse.json({ error: 'Booking already cancelled', booking: latestBooking }, { status: 409 });
    }

    const service = await getService(latestBooking.serviceId);
    const policy = await evaluateBookingSelfServicePolicy(latestBooking, service);
    if (!policy.canCancel) {
      return NextResponse.json(
        { error: policy.cancelBlockedReason || 'Cancellation is not available for this booking.', policy },
        { status: 409 },
      );
    }

    const outcome = await computeRefundForCancel(latestBooking, service ?? undefined);
    const updated = await restorePackageCreditForBooking(applyRefundOutcome(latestBooking, outcome, parsed.data.reason));
    if (!await renewSlotLock(slotLease)) {
      return NextResponse.json(
        { error: 'Booking storage is temporarily unavailable. Try again shortly.', errorCode: 'booking_storage_unavailable' },
        { status: 503 },
      );
    }
    await saveBooking(updated);
    const staff = await getStaff(updated.staffId);
    let emailDelivery;
    try {
      const delivery = await sendBookingCancellation(updated, { service, staff });
      emailDelivery = delivery.ok
        ? { ok: true as const }
        : { ok: false as const, reason: delivery.reason };
    } catch {
      emailDelivery = { ok: false as const, reason: 'internal_error' as const };
    }
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
      refundAmountCents: outcome.refundAmountCents,
      hoursUntilStart: outcome.hoursUntilStart,
      emailDelivery,
    });
  } finally {
    await releaseSlotLock(slotLease).catch(() => {
      console.error('[booking/cancel] slot lease release failed');
    });
  }
}
