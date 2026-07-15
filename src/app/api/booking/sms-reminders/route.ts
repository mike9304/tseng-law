import { NextRequest, NextResponse } from 'next/server';
import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import {
  appendBookingReminderMarker,
  getService,
  listBookings,
} from '@/lib/builder/bookings/storage';
import { sendSms } from '@/lib/builder/bookings/sms-client';
import type { Booking, BookingReminderType } from '@/lib/builder/bookings/types';
import { reminderWindowsForService } from '@/lib/builder/bookings/reminders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Phase 26 W204 — SMS reminder dispatcher.
 *
 * Designed for a cron schedule (e.g. every 15 minutes). Scans confirmed
 * bookings whose `startAt` falls in the next 24h / 1h window, and sends
 * a Twilio SMS if a matching reminder has not yet been recorded. Skips
 * bookings without a phone or cancelled bookings. Delivery and persistence
 * failures are reported truthfully to the cron caller.
 *
 * Auth: requires `CRON_SECRET` matching the `x-cron-secret` header (or
 * Vercel Cron's `authorization: Bearer ${CRON_SECRET}`). Returns a JSON
 * summary suitable for cron observability dashboards.
 */

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
  failed: number;
  skipped: number;
  errors: Array<{
    bookingId: string;
    type: BookingReminderType | 'metadata';
    reason: 'unconfigured' | 'provider_error' | 'internal_error' | 'marker_persist_failed_after_delivery';
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
    reason: 'unconfigured' | 'provider_error' | 'internal_error' | 'marker_persist_failed_after_delivery';
  }> = [];

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
    let service: Awaited<ReturnType<typeof getService>>;
    let windows: ReturnType<typeof reminderWindowsForService>;
    try {
      service = await getService(booking.serviceId);
      windows = reminderWindowsForService(service, 'sms');
    } catch {
      failed += 1;
      errors.push({
        bookingId: booking.bookingId,
        type: 'metadata',
        reason: 'internal_error',
      });
      continue;
    }
    const serviceName = service?.name?.ko || service?.name?.en;
    let currentBooking = booking;

    for (const win of windows) {
      const phone = currentBooking.customer.phone;
      if (!phone) {
        skipped += 1;
        break;
      }
      if (alreadySent(currentBooking, win.type)) continue;
      const targetMinutes = win.hoursAhead * 60;
      const delta = Math.abs(minutesToStart - targetMinutes);
      if (delta > win.toleranceMinutes) continue;

      try {
        const sms = await sendSms({
          toE164: phone,
          body: buildBody(currentBooking, win.hoursAhead, serviceName),
        });
        if (!sms.ok) {
          failed += 1;
          errors.push({
            bookingId: currentBooking.bookingId,
            type: win.type,
            reason: sms.reason === 'unconfigured' ? 'unconfigured' : 'provider_error',
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
            bookingId: currentBooking.bookingId,
            type: win.type,
            reason: 'marker_persist_failed_after_delivery',
          });
          continue;
        }
        sent += 1;
      } catch {
        failed += 1;
        errors.push({
          bookingId: currentBooking.bookingId,
          type: win.type,
          reason: 'internal_error',
        });
      }
    }
  }

  return { scanned: bookings.length, sent, failed, skipped, errors };
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
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
      errors: [{ bookingId: 'dispatch', type: 'metadata', reason: 'internal_error' }],
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
