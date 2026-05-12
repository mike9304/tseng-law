import { NextRequest, NextResponse } from 'next/server';
import { computeAvailableSlots } from '@/lib/builder/bookings/availability';
import { bookingWaitlistCreateSchema } from '@/lib/builder/bookings/types';
import {
  getService,
  getStaff,
  listWaitlistEntries,
  makeWaitlistId,
  saveWaitlistEntry,
  timestamped,
} from '@/lib/builder/bookings/storage';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

export async function POST(request: NextRequest) {
  const rate = await checkRateLimit(`booking-waitlist:${clientIp(request)}`, 8, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many waitlist attempts. Please try again shortly.' }, { status: 429 });
  }

  const raw = await request.json().catch(() => null);
  if (raw?.company) {
    return NextResponse.json({ error: 'Unable to accept this waitlist request.' }, { status: 400 });
  }

  const parsed = bookingWaitlistCreateSchema.safeParse({ ...raw, source: 'web' });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid waitlist payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const [service, staff] = await Promise.all([
    getService(parsed.data.serviceId),
    getStaff(parsed.data.staffId),
  ]);
  if (!service || !service.isActive || !staff || !staff.isActive) {
    return NextResponse.json({ error: 'Service or staff not available' }, { status: 404 });
  }
  if (service.staffIds.length > 0 && !service.staffIds.includes(staff.staffId)) {
    return NextResponse.json({ error: 'Staff is not assigned to this service.' }, { status: 400 });
  }

  const slots = await computeAvailableSlots({
    serviceId: service.serviceId,
    staffId: staff.staffId,
    date: parsed.data.requestedDate,
  });
  if (slots.length > 0) {
    return NextResponse.json({ error: 'Slots are available for this date.', slots }, { status: 409 });
  }

  const email = parsed.data.customer.email.toLowerCase();
  const existing = (await listWaitlistEntries({ status: 'active', serviceId: service.serviceId, staffId: staff.staffId }))
    .find((entry) => entry.requestedDate === parsed.data.requestedDate && entry.customer.email.toLowerCase() === email);
  if (existing) {
    return NextResponse.json({ waitlist: existing, duplicate: true }, { status: 200 });
  }

  const waitlist = timestamped({
    waitlistId: makeWaitlistId(),
    serviceId: parsed.data.serviceId,
    staffId: parsed.data.staffId,
    requestedDate: parsed.data.requestedDate,
    customer: parsed.data.customer,
    status: 'active' as const,
    source: 'web' as const,
    ...(parsed.data.customerTimezone ? { customerTimezone: parsed.data.customerTimezone } : {}),
  });
  await saveWaitlistEntry(waitlist);
  emitEvent('booking.waitlist.joined', {
    waitlistId: waitlist.waitlistId,
    serviceId: waitlist.serviceId,
    staffId: waitlist.staffId,
    requestedDate: waitlist.requestedDate,
    customer: { email: waitlist.customer.email, name: waitlist.customer.name, locale: waitlist.customer.locale },
  });

  return NextResponse.json({ waitlist }, { status: 201 });
}
