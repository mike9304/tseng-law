import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { bookingWaitlistUpdateSchema } from '@/lib/builder/bookings/types';
import { getWaitlistEntry, saveWaitlistEntry, timestamped } from '@/lib/builder/bookings/storage';
import { getBookingWaitlistApiErrorPayload } from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  const existing = await getWaitlistEntry(params.id);
  if (!existing) {
    return NextResponse.json(getBookingWaitlistApiErrorPayload(locale, 'waitlist_not_found'), { status: 404 });
  }

  const parsed = bookingWaitlistUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({
      ...getBookingWaitlistApiErrorPayload(locale, 'invalid_waitlist_payload'),
      details: parsed.error.issues.slice(0, 3),
    }, { status: 400 });
  }

  if (existing.status === 'promoted') {
    return NextResponse.json(getBookingWaitlistApiErrorPayload(locale, 'waitlist_already_promoted'), { status: 409 });
  }

  const next = timestamped({ ...existing, status: parsed.data.status }, existing.createdAt);
  await saveWaitlistEntry(next);
  return NextResponse.json({ waitlist: next });
}
