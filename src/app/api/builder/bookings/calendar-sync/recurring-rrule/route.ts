import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  buildRecurringEventRrule,
  parseRecurringEventConfig,
} from '@/lib/builder/bookings/calendar-sync/recurring-event-rrule';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * F77 calendar-sync depth — POST converts a recurrence config into
 * an RFC 5545 RRULE string. Used by the admin calendar export UI
 * and by the in-process sync engine when staging recurring events.
 *
 * Body:
 *   {
 *     frequency: 'weekly' | 'biweekly' | 'monthly',
 *     weekdays?: DayOfWeek[],
 *     monthly?: { kind, dayOfMonth | ordinal+weekday },
 *     until?: ISO string,
 *     count?: number,
 *     weekStart?: DayOfWeek
 *   }
 */
export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const payload = await request.json().catch(() => null);
  const config = parseRecurringEventConfig(payload);
  if (!config) {
    return NextResponse.json(
      { error: 'Invalid recurrence config payload' },
      { status: 400 },
    );
  }

  const result = buildRecurringEventRrule(config);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ rrule: result.rrule, config });
}