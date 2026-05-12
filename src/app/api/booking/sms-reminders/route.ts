import { NextRequest, NextResponse } from 'next/server';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import { listBookings, saveBooking, getService } from '@/lib/builder/bookings/storage';
import { sendSms } from '@/lib/builder/bookings/sms-client';
import type { Booking, BookingReminderType } from '@/lib/builder/bookings/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Phase 26 W204 — SMS reminder dispatcher.
 *
 * Designed for a cron schedule (e.g. every 15 minutes). Scans confirmed
 * bookings whose `startAt` falls in the next 24h / 1h window, and sends
 * a Twilio SMS if a matching reminder has not yet been recorded. Skips
 * bookings without a phone, cancelled bookings, or when Twilio is not
 * configured (degrades silently).
 *
 * Auth: requires `CRON_SECRET` matching the `x-cron-secret` header (or
 * Vercel Cron's `authorization: Bearer ${CRON_SECRET}`). Returns a JSON
 * summary suitable for cron observability dashboards.
 */

interface ReminderWindow {
  type: BookingReminderType;
  hoursAhead: number;
  toleranceMinutes: number;
}

const WINDOWS: ReminderWindow[] = [
  { type: 'sms-reminder-24h', hoursAhead: 24, toleranceMinutes: 30 },
  { type: 'sms-reminder-1h', hoursAhead: 1, toleranceMinutes: 15 },
];

function authorized(request: NextRequest): boolean {
  return isCronAuthorized(request);
}

function alreadySent(booking: Booking, type: BookingReminderType): boolean {
  return booking.reminders.some((r) => r.type === type);
}

function buildBody(booking: Booking, hoursAhead: number, serviceName?: string): string {
  const date = new Date(booking.startAt);
  const when = date.toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' });
  const label = serviceName || '예약';
  if (hoursAhead === 24) {
    return `[호정법률] 내일 ${when} ${label} 예약이 있습니다. ${booking.meetingLink ? `링크: ${booking.meetingLink}` : ''}`.trim();
  }
  return `[호정법률] 1시간 뒤 ${when} ${label} 예약 시작입니다.${booking.meetingLink ? ` 링크: ${booking.meetingLink}` : ''}`;
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
    if (!booking.customer.phone) {
      skipped += 1;
      continue;
    }
    const startMs = Date.parse(booking.startAt);
    if (!Number.isFinite(startMs)) {
      skipped += 1;
      continue;
    }
    const minutesToStart = (startMs - now) / 60000;
    const service = await getService(booking.serviceId);
    const serviceName = service?.name?.ko || service?.name?.en;

    for (const win of WINDOWS) {
      if (alreadySent(booking, win.type)) continue;
      const targetMinutes = win.hoursAhead * 60;
      const delta = Math.abs(minutesToStart - targetMinutes);
      if (delta > win.toleranceMinutes) continue;

      const sms = await sendSms({
        toE164: booking.customer.phone,
        body: buildBody(booking, win.hoursAhead, serviceName),
      });
      if (sms.ok) {
        await saveBooking({
          ...booking,
          reminders: [...booking.reminders, { sentAt: new Date().toISOString(), type: win.type }],
          updatedAt: new Date().toISOString(),
        });
        sent += 1;
      } else if (sms.reason === 'unconfigured') {
        return { scanned: bookings.length, sent, skipped: skipped + 1, errors: [{ bookingId: booking.bookingId, reason: 'twilio unconfigured (aborting)' }] };
      } else {
        errors.push({ bookingId: booking.bookingId, reason: `${sms.reason}: ${sms.details ?? ''}` });
      }
    }
  }

  return { scanned: bookings.length, sent, skipped, errors };
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await dispatch();
  return NextResponse.json({ ok: true, ...result });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
