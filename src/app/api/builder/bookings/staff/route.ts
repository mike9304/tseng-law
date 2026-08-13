import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import { staffInputSchema } from '@/lib/builder/bookings/types';
import { listStaff, makeStaffId, saveStaff, timestamped } from '@/lib/builder/bookings/storage';
import { getBookingStaffApiErrorPayload } from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'view-bookings');
  if (auth instanceof NextResponse) return auth;
  const includeInactive = request.nextUrl.searchParams.get('includeInactive') === '1';
  const staff = await listStaff(includeInactive);
  return NextResponse.json({ staff });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const parsed = staffInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        ...getBookingStaffApiErrorPayload(locale, 'invalid_staff_payload'),
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  const staff = timestamped({
    staffId: makeStaffId(),
    ...parsed.data,
    photo: parsed.data.photo || '',
    email: parsed.data.email || '',
  });
  await saveStaff(staff);
  return NextResponse.json({ staff }, { status: 201 });
}
