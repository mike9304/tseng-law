import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { getMemberPortalEmails } from '@/lib/builder/members/members-engine';
import { addBookingDuration, isSlotAvailable } from '@/lib/builder/bookings/availability';
import { evaluateBookingSelfServicePolicy } from '@/lib/builder/bookings/refund';
import { getService, getStaff, listBookings, saveBooking, timestamped } from '@/lib/builder/bookings/storage';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  startAt: z.string().datetime({ offset: true }),
  staffId: z.string().trim().min(1).optional(),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  );
}

export async function POST(request: NextRequest, { params }: { params: { locale: string; bookingId: string } }) {
  const member = await getCurrentSiteMember();
  if (!member) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const rate = await checkRateLimit(`member-booking-reschedule:${member.memberId}:${clientIp(request)}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many reschedule attempts' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) } },
    );
  }

  const memberEmails = getMemberPortalEmails(member);
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid reschedule payload' }, { status: 400 });
  }

  const booking = (await listBookings({ includeCancelled: true }))
    .find((item) => item.bookingId === params.bookingId && memberEmails.includes(item.customer.email.trim().toLowerCase()));
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }
  if (booking.status === 'cancelled') {
    return NextResponse.json({ error: 'Booking is already cancelled' }, { status: 409 });
  }

  const service = await getService(booking.serviceId);
  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }
  const policy = await evaluateBookingSelfServicePolicy(booking, service);
  if (!policy.canReschedule) {
    return NextResponse.json(
      { error: policy.rescheduleBlockedReason || 'Reschedule is not available for this booking.', policy },
      { status: 409 },
    );
  }

  const nextStaffId = parsed.data.staffId ?? booking.staffId;
  const staff = await getStaff(nextStaffId);
  if (!staff || !staff.isActive) {
    return NextResponse.json({ error: 'Staff is not available' }, { status: 404 });
  }

  const resourceIds = service.requiredResourceIds ?? [];
  const endAt = addBookingDuration(parsed.data.startAt, service.durationMinutes);
  const slotKey = {
    serviceId: booking.serviceId,
    staffId: nextStaffId,
    startAt: parsed.data.startAt,
    resourceIds,
  };
  if (!acquireSlotLock(slotKey)) {
    return NextResponse.json({ error: 'Selected slot is being booked by another request.' }, { status: 409 });
  }

  try {
    const available = await isSlotAvailable({
      ...slotKey,
      excludeBookingId: booking.bookingId,
    });
    if (!available) {
      return NextResponse.json({ error: 'Selected slot is no longer available' }, { status: 409 });
    }

    const updated = timestamped({
      ...booking,
      staffId: nextStaffId,
      startAt: parsed.data.startAt,
      endAt,
      resourceIds,
    }, booking.createdAt);
    await saveBooking(updated);
    emitEvent('booking.rescheduled', {
      bookingId: updated.bookingId,
      staffId: updated.staffId,
      startAt: updated.startAt,
      source: 'member-portal',
    });
    return NextResponse.json({ ok: true, booking: updated });
  } finally {
    releaseSlotLock(slotKey);
  }
}
