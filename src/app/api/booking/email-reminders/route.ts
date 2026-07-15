import { NextRequest, NextResponse } from 'next/server';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import {
  appendBookingReminderMarker,
  getService,
  getStaff,
  listBookings,
} from '@/lib/builder/bookings/storage';
import { sendBookingReminder } from '@/lib/builder/bookings/notifications';
import type { Booking, BookingReminderType } from '@/lib/builder/bookings/types';
import { reminderWindowsForService } from '@/lib/builder/bookings/reminders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function alreadySent(booking: Booking, type: BookingReminderType): boolean {
  return booking.reminders.some((reminder) => reminder.type === type);
}

async function dispatch(): Promise<{
  scanned: number;
  sent: number;
  failed: number;
  skipped: number;
  errors: Array<{
    bookingId: string;
    type: BookingReminderType | 'metadata';
    reason: string;
  }>;
}> {
  const now = Date.now();
  const horizon = now + 25 * 60 * 60 * 1000;
  const bookings = await listBookings({
    from: new Date(now).toISOString(),
    to: new Date(horizon).toISOString(),
  });

  let sent = 0;
  let failed = 0;
  let skipped = 0;
  const errors: Array<{
    bookingId: string;
    type: BookingReminderType | 'metadata';
    reason: string;
  }> = [];

  for (const booking of bookings) {
    if (booking.status !== 'confirmed') {
      skipped += 1;
      continue;
    }
    const startMs = Date.parse(booking.startAt);
    if (!Number.isFinite(startMs)) {
      skipped += 1;
      continue;
    }
    let service: Awaited<ReturnType<typeof getService>>;
    let staff: Awaited<ReturnType<typeof getStaff>>;
    let windows: ReturnType<typeof reminderWindowsForService>;
    try {
      service = await getService(booking.serviceId);
      staff = await getStaff(booking.staffId);
      windows = reminderWindowsForService(service, 'email');
    } catch {
      failed += 1;
      errors.push({
        bookingId: booking.bookingId,
        type: 'metadata',
        reason: 'internal_error',
      });
      continue;
    }
    const minutesToStart = (startMs - now) / 60000;
    let currentBooking = booking;

    for (const win of windows) {
      if (alreadySent(currentBooking, win.type)) continue;
      const targetMinutes = win.hoursAhead * 60;
      const delta = Math.abs(minutesToStart - targetMinutes);
      if (delta > win.toleranceMinutes) continue;

      try {
        const delivery = await sendBookingReminder(currentBooking, {
          reminderType: win.type,
          service,
          staff,
        });
        if (!delivery.ok) {
          failed += 1;
          errors.push({
            bookingId: currentBooking.bookingId,
            type: win.type,
            reason: delivery.reason,
          });
          continue;
        }

        try {
          const markerResult = await appendBookingReminderMarker(currentBooking.bookingId, {
            sentAt: new Date().toISOString(),
            type: win.type,
          });
          if (!markerResult.ok) throw new Error('booking_not_found');
          currentBooking = markerResult.booking;
        } catch {
          failed += 1;
          errors.push({
            bookingId: booking.bookingId,
            type: win.type,
            reason: 'marker_persist_failed_after_delivery',
          });
          continue;
        }
        sent += 1;
      } catch {
        failed += 1;
        errors.push({
          bookingId: booking.bookingId,
          type: win.type,
          reason: 'internal_error',
        });
      }
    }
  }

  return { scanned: bookings.length, sent, failed, skipped, errors };
}

export async function POST(request: NextRequest) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await dispatch();
    if (result.errors.length === 0) {
      return NextResponse.json({ ok: true, ...result });
    }

    const hasInternalFailure = result.errors.some((error) => (
      error.reason === 'internal_error' || error.reason === 'marker_persist_failed_after_delivery'
    ));
    const hasProviderFailure = result.errors.some((error) => error.reason === 'provider_error');
    const status = hasInternalFailure ? 500 : hasProviderFailure ? 502 : 503;
    return NextResponse.json({ ok: false, ...result }, { status });
  } catch {
    return NextResponse.json({
      ok: false,
      scanned: 0,
      sent: 0,
      failed: 1,
      skipped: 0,
      errors: [{ bookingId: 'dispatch', type: 'dispatch', reason: 'internal_error' }],
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
