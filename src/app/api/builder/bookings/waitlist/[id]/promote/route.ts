import { NextRequest, NextResponse } from 'next/server';
import { addBookingDuration, computeAvailableSlots, isSlotAvailable } from '@/lib/builder/bookings/availability';
import { bookingWaitlistPromoteSchema } from '@/lib/builder/bookings/types';
import {
  getService,
  getStaff,
  getWaitlistEntry,
  makeBookingId,
  saveBooking,
  saveWaitlistEntry,
  timestamped,
} from '@/lib/builder/bookings/storage';
import { sendBookingConfirmation } from '@/lib/builder/bookings/notifications';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const existing = await getWaitlistEntry(params.id);
  if (!existing) return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 });
  if (existing.status === 'promoted' && existing.promotedBookingId) {
    return NextResponse.json({ waitlist: existing, promotedBookingId: existing.promotedBookingId }, { status: 200 });
  }
  if (existing.status === 'closed') {
    return NextResponse.json({ error: 'Closed waitlist entries cannot be promoted.' }, { status: 409 });
  }

  const parsed = bookingWaitlistPromoteSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid waitlist promotion payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const staffId = parsed.data.staffId ?? existing.staffId;
  const date = parsed.data.date ?? existing.requestedDate;
  const [service, staff] = await Promise.all([
    getService(existing.serviceId),
    getStaff(staffId),
  ]);
  if (!service || !service.isActive || !staff || !staff.isActive) {
    return NextResponse.json({ error: 'Service or staff not available' }, { status: 404 });
  }
  if (service.staffIds.length > 0 && !service.staffIds.includes(staff.staffId)) {
    return NextResponse.json({ error: 'Staff is not assigned to this service.' }, { status: 400 });
  }

  const slots = await computeAvailableSlots({ serviceId: service.serviceId, staffId, date });
  const slot = slots[0];
  if (!slot) return NextResponse.json({ error: 'No available slot to promote this waitlist entry.' }, { status: 409 });

  const slotKey = { serviceId: service.serviceId, staffId, startAt: slot.startAt };
  if (!acquireSlotLock(slotKey)) {
    return NextResponse.json({ error: 'Selected slot is being booked by another request.' }, { status: 409 });
  }

  try {
    const available = await isSlotAvailable(slotKey);
    if (!available) return NextResponse.json({ error: 'Selected slot is no longer available.' }, { status: 409 });

    const booking = timestamped({
      bookingId: makeBookingId(),
      serviceId: service.serviceId,
      staffId,
      customer: existing.customer,
      startAt: slot.startAt,
      endAt: addBookingDuration(slot.startAt, service.durationMinutes),
      status: 'confirmed' as const,
      source: 'admin' as const,
      reminders: [],
      ...(existing.customerTimezone ? { customerTimezone: existing.customerTimezone } : {}),
      ...(service.paymentMode === 'paid' ? { paymentStatus: 'unpaid' as const } : {}),
    });
    await saveBooking(booking);

    const waitlist = timestamped({
      ...existing,
      status: 'promoted' as const,
      promotedBookingId: booking.bookingId,
    }, existing.createdAt);
    await saveWaitlistEntry(waitlist);
    await sendBookingConfirmation(booking, { service, staff });
    emitEvent('booking.created', {
      bookingId: booking.bookingId,
      serviceId: booking.serviceId,
      staffId: booking.staffId,
      startAt: booking.startAt,
      customer: { email: booking.customer.email, name: booking.customer.name, locale: booking.customer.locale },
      customerTimezone: booking.customerTimezone,
      source: 'waitlist-promotion',
      waitlistId: waitlist.waitlistId,
    });

    return NextResponse.json({ booking, waitlist }, { status: 201 });
  } finally {
    releaseSlotLock(slotKey);
  }
}
