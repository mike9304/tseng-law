import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { addBookingDuration, isSlotAvailable } from '@/lib/builder/bookings/availability';
import { bookingCreateSchema } from '@/lib/builder/bookings/types';
import { getService, getStaff, makeBookingId, saveBooking, timestamped } from '@/lib/builder/bookings/storage';
import { sendBookingConfirmation } from '@/lib/builder/bookings/notifications';
import { createZoomMeeting } from '@/lib/builder/bookings/zoom-client';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rate = await checkRateLimit(`booking:${ip}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Too many booking attempts. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) } },
    );
  }

  const raw = await request.json().catch(() => null);
  if (raw?.company) {
    return NextResponse.json({ error: 'Unable to accept this booking.' }, { status: 400 });
  }

  const parsed = bookingCreateSchema.safeParse({ ...raw, source: 'web', status: 'confirmed' });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const service = await getService(parsed.data.serviceId);
  const staff = await getStaff(parsed.data.staffId);
  if (!service || !service.isActive || !staff || !staff.isActive) {
    return NextResponse.json({ error: 'Service or staff not available' }, { status: 404 });
  }

  const available = await isSlotAvailable({
    serviceId: parsed.data.serviceId,
    staffId: parsed.data.staffId,
    startAt: parsed.data.startAt,
  });
  if (!available) return NextResponse.json({ error: 'Selected slot is no longer available' }, { status: 409 });

  let meetingLink: string | undefined;
  if (service.meetingMode === 'zoom') {
    const zoom = await createZoomMeeting({
      topic: `${service.name?.ko || service.name?.en || 'Booking'} · ${parsed.data.customer.name}`,
      startTimeISO: parsed.data.startAt,
      durationMinutes: service.durationMinutes,
      customerEmail: parsed.data.customer.email,
    });
    if (zoom.ok) {
      meetingLink = zoom.meetingLink;
    } else if (zoom.reason !== 'unconfigured') {
      console.warn('[booking] zoom meeting creation failed', zoom.reason, zoom.details);
    }
  }

  const booking = timestamped({
    bookingId: makeBookingId(),
    serviceId: parsed.data.serviceId,
    staffId: parsed.data.staffId,
    customer: parsed.data.customer,
    startAt: parsed.data.startAt,
    endAt: addBookingDuration(parsed.data.startAt, service.durationMinutes),
    status: 'confirmed' as const,
    source: 'web' as const,
    reminders: [],
    ...(meetingLink ? { meetingLink } : {}),
    ...(parsed.data.paymentIntentId
      ? { paymentIntentId: parsed.data.paymentIntentId, paymentStatus: 'unpaid' as const }
      : {}),
  });
  await saveBooking(booking);
  await sendBookingConfirmation(booking, { service, staff });
  emitEvent('booking.created', {
    bookingId: booking.bookingId,
    serviceId: booking.serviceId,
    staffId: booking.staffId,
    startAt: booking.startAt,
    customer: { email: booking.customer.email, name: booking.customer.name, locale: booking.customer.locale },
  });

  return NextResponse.json({ bookingId: booking.bookingId, booking }, { status: 201 });
}
