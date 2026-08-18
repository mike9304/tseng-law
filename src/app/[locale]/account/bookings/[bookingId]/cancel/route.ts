import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { getMemberPortalEmails } from '@/lib/builder/members/members-engine';
import { applyRefundOutcome, computeRefundForCancel, evaluateBookingSelfServicePolicy } from '@/lib/builder/bookings/refund';
import { listBookings, getService, getStaff, saveBooking } from '@/lib/builder/bookings/storage';
import { sendBookingCancellation } from '@/lib/builder/bookings/notifications';
import { restorePackageCreditForBooking } from '@/lib/builder/bookings/packages';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  reason: z.string().trim().max(300).optional(),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  );
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ locale: string; bookingId: string }> }
) {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  const params = await props.params;
  const member = await getCurrentSiteMember();
  if (!member) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const rate = await checkRateLimit(`member-booking-cancel:${member.memberId}:${clientIp(request)}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many cancellation attempts' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) } },
    );
  }

  const memberEmails = getMemberPortalEmails(member);
  const parsed = payloadSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid cancel payload' }, { status: 400 });
  }

  const booking = (await listBookings({ includeCancelled: true }))
    .find((item) => item.bookingId === params.bookingId && memberEmails.includes(item.customer.email.trim().toLowerCase()));
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  if (booking.status === 'cancelled') {
    return NextResponse.json({ error: 'Booking already cancelled' }, { status: 409 });
  }

  const service = await getService(booking.serviceId);
  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }
  const policy = await evaluateBookingSelfServicePolicy(booking, service);
  if (!policy.canCancel) {
    return NextResponse.json(
      { error: policy.cancelBlockedReason || 'Cancellation is not available for this booking.', policy },
      { status: 409 },
    );
  }

  const outcome = await computeRefundForCancel(booking, service);
  const cancelled = await restorePackageCreditForBooking(applyRefundOutcome(booking, outcome, parsed.data.reason));
  const latest = (await listBookings({ includeCancelled: true }))
    .find((item) => item.bookingId === params.bookingId);
  if (latest && latest.status === 'cancelled') {
    return NextResponse.json({ error: 'Booking already cancelled', booking: latest }, { status: 409 });
  }

  await saveBooking(cancelled);
  const staff = await getStaff(cancelled.staffId);
  let emailDelivery;
  try {
    const delivery = await sendBookingCancellation(cancelled, { service, staff });
    emailDelivery = delivery.ok
      ? { ok: true as const }
      : { ok: false as const, reason: delivery.reason };
  } catch {
    emailDelivery = { ok: false as const, reason: 'internal_error' as const };
  }
  emitEvent('booking.cancelled', {
    bookingId: cancelled.bookingId,
    reason: parsed.data.reason,
    refundDecision: outcome.decision,
    paymentStatus: cancelled.paymentStatus,
    source: 'member-portal',
  });

  return NextResponse.json({
    ok: true,
    booking: cancelled,
    refundDecision: outcome.decision,
    refundResult: outcome.refundResult,
    refundAmountCents: outcome.refundAmountCents,
    hoursUntilStart: outcome.hoursUntilStart,
    emailDelivery,
  });
}
