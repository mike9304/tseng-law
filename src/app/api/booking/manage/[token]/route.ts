import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { addBookingDuration, isSlotAvailable } from '@/lib/builder/bookings/availability';
import { verifyBookingManageToken } from '@/lib/builder/bookings/manage-token';
import { getBooking, getService, getStaff, saveBooking, timestamped } from '@/lib/builder/bookings/storage';
import { textForLocale } from '@/lib/builder/bookings/types';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import { applyRefundOutcome, computeRefundForCancel } from '@/lib/builder/bookings/refund';
import { sendBookingCancellation } from '@/lib/builder/bookings/notifications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const updateSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('cancel'),
    reason: z.string().trim().max(300).optional(),
  }),
  z.object({
    action: z.literal('reschedule'),
    startAt: z.string().datetime({ offset: true }),
    staffId: z.string().trim().min(1).optional(),
  }),
]);

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  );
}

async function resolveBooking(token: string) {
  const verified = verifyBookingManageToken(token);
  if (!verified) return { error: NextResponse.json({ error: 'Invalid or expired booking link' }, { status: 401 }) };

  const booking = await getBooking(verified.bookingId);
  if (!booking || booking.customer.email.toLowerCase() !== verified.email) {
    return { error: NextResponse.json({ error: 'Booking not found' }, { status: 404 }) };
  }

  const [service, staff] = await Promise.all([
    getService(booking.serviceId),
    getStaff(booking.staffId),
  ]);
  return { booking, service, staff };
}

function bookingPayload(result: Awaited<ReturnType<typeof resolveBooking>>) {
  if (!('booking' in result) || !result.booking) return null;
  const locale = result.booking.customer.locale;
  return {
    booking: result.booking,
    service: result.service ? {
      serviceId: result.service.serviceId,
      name: textForLocale(result.service.name, locale),
      durationMinutes: result.service.durationMinutes,
      meetingMode: result.service.meetingMode ?? 'in-person',
    } : null,
    staff: result.staff ? {
      staffId: result.staff.staffId,
      name: textForLocale(result.staff.name, locale),
    } : null,
  };
}

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  const rate = await checkRateLimit(`booking-manage-get:${clientIp(request)}`, 30, 60_000);
  if (!rate.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const result = await resolveBooking(params.token);
  if ('error' in result && result.error) return result.error;
  return NextResponse.json(bookingPayload(result));
}

export async function PATCH(request: NextRequest, { params }: { params: { token: string } }) {
  const rate = await checkRateLimit(`booking-manage-patch:${clientIp(request)}`, 8, 60_000);
  if (!rate.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const result = await resolveBooking(params.token);
  if ('error' in result && result.error) return result.error;
  if (!result.booking || !result.service) {
    return NextResponse.json({ error: 'Booking cannot be managed' }, { status: 404 });
  }
  if (result.booking.status === 'cancelled') {
    return NextResponse.json({ error: 'Booking is already cancelled' }, { status: 409 });
  }

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking update', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  if (parsed.data.action === 'cancel') {
    // Apply the cancellation policy + Stripe refund so customer-link
    // cancellations don't bypass the refund math that /api/booking/cancel
    // enforces for admin/web flows.
    const outcome = await computeRefundForCancel(result.booking, result.service);
    const cancelled = applyRefundOutcome(result.booking, outcome, parsed.data.reason);
    const updated = timestamped(cancelled, result.booking.createdAt);
    await saveBooking(updated);
    await sendBookingCancellation(updated, { service: result.service, staff: result.staff });
    emitEvent('booking.cancelled', {
      bookingId: updated.bookingId,
      reason: parsed.data.reason,
      source: 'customer-link',
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

  const nextStaffId = parsed.data.staffId || result.booking.staffId;
  const available = await isSlotAvailable({
    serviceId: result.booking.serviceId,
    staffId: nextStaffId,
    startAt: parsed.data.startAt,
  });
  if (!available) return NextResponse.json({ error: 'Selected slot is no longer available' }, { status: 409 });

  const nextStaff = await getStaff(nextStaffId);
  if (!nextStaff || !nextStaff.isActive) return NextResponse.json({ error: 'Staff is not available' }, { status: 404 });

  const updated = timestamped({
    ...result.booking,
    staffId: nextStaffId,
    startAt: parsed.data.startAt,
    endAt: addBookingDuration(parsed.data.startAt, result.service.durationMinutes),
  }, result.booking.createdAt);
  await saveBooking(updated);
  emitEvent('booking.rescheduled', {
    bookingId: updated.bookingId,
    staffId: updated.staffId,
    startAt: updated.startAt,
    source: 'customer-link',
  });
  return NextResponse.json({ ok: true, booking: updated });
}
