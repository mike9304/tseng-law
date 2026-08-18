import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import { getBookingStaffAvailabilityApiErrorPayload } from '@/lib/builder/bookings/bookings-copy';
import { staffAvailabilitySchema } from '@/lib/builder/bookings/types';
import { getStaffAvailability, saveStaffAvailability } from '@/lib/builder/bookings/storage';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardBuilderReadWithPermission(request, 'view-bookings');
  if (auth instanceof NextResponse) return auth;

  const availability = await getStaffAvailability(params.id);
  return NextResponse.json({ availability });
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const body = await request.json().catch(() => null);
  const parsed = staffAvailabilitySchema.safeParse({ ...body, staffId: params.id });
  if (!parsed.success) {
    return NextResponse.json(
      {
        ...getBookingStaffAvailabilityApiErrorPayload(locale, 'invalid_availability_payload'),
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  await saveStaffAvailability(parsed.data);
  return NextResponse.json({ availability: parsed.data });
}
