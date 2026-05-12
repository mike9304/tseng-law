import { NextRequest, NextResponse } from 'next/server';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import { getService, getStaff, listBookings, saveBooking } from '@/lib/builder/bookings/storage';
import {
  isBookingEmailConfigured,
  sendBookingReminder,
} from '@/lib/builder/bookings/notifications';
import type { Booking, BookingReminderType } from '@/lib/builder/bookings/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ReminderWindow {
  type: BookingReminderType;
  hoursAhead: 1 | 24;
  toleranceMinutes: number;
}

const WINDOWS: ReminderWindow[] = [
  { type: 'email-reminder-24h', hoursAhead: 24, toleranceMinutes: 30 },
  { type: 'email-reminder-1h', hoursAhead: 1, toleranceMinutes: 15 },
];

function alreadySent(booking: Booking, type: BookingReminderType): boolean {
  return booking.reminders.some((reminder) => reminder.type === type);
}

function reminderHoursFor(service: Awaited<ReturnType<typeof getService>>): Set<number> {
  const configured = service?.reminderOffsetsHours?.filter((hours) => hours === 1 || hours === 24);
  return new Set(configured && configured.length > 0 ? configured : [24]);
}

async function dispatch(): Promise<{
  scanned: number;
  sent: number;
  skipped: number;
  errors: Array<{ bookingId: string; reason: string }>;
}> {
  const now = Date.now();
  const horizon = now + 25 * 60 * 60 * 1000;
  const bookings = await listBookings({
    from: new Date(now).toISOString(),
    to: new Date(horizon).toISOString(),
  });

  let sent = 0;
  let skipped = 0;
  const errors: Array<{ bookingId: string; reason: string }> = [];

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
    const service = await getService(booking.serviceId);
    const staff = await getStaff(booking.staffId);
    const enabledHours = reminderHoursFor(service);
    const minutesToStart = (startMs - now) / 60000;

    for (const win of WINDOWS) {
      if (!enabledHours.has(win.hoursAhead)) continue;
      if (alreadySent(booking, win.type)) continue;
      const targetMinutes = win.hoursAhead * 60;
      const delta = Math.abs(minutesToStart - targetMinutes);
      if (delta > win.toleranceMinutes) continue;
      if (!isBookingEmailConfigured()) {
        skipped += 1;
        errors.push({ bookingId: booking.bookingId, reason: 'resend unconfigured' });
        continue;
      }

      try {
        await sendBookingReminder(booking, { service, staff });
        await saveBooking({
          ...booking,
          reminders: [...booking.reminders, { sentAt: new Date().toISOString(), type: win.type }],
          updatedAt: new Date().toISOString(),
        });
        sent += 1;
      } catch (error) {
        errors.push({
          bookingId: booking.bookingId,
          reason: error instanceof Error ? error.message : 'email reminder failed',
        });
      }
    }
  }

  return { scanned: bookings.length, sent, skipped, errors };
}

export async function POST(request: NextRequest) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await dispatch();
  return NextResponse.json({ ok: true, ...result });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
