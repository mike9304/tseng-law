import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getBookingPackageApiErrorPayload } from '@/lib/builder/bookings/bookings-copy';
import { bookingPackageInputSchema } from '@/lib/builder/bookings/types';
import { getPackage, savePackage, timestamped } from '@/lib/builder/bookings/storage';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const existing = await getPackage(params.id);
  if (!existing) {
    return NextResponse.json(getBookingPackageApiErrorPayload(locale, 'package_not_found'), { status: 404 });
  }

  const parsed = bookingPackageInputSchema.partial().safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        ...getBookingPackageApiErrorPayload(locale, 'invalid_package_payload'),
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  const next = timestamped({
    ...existing,
    ...parsed.data,
    description: parsed.data.description ?? existing.description,
  }, existing.createdAt);
  await savePackage(next);
  return NextResponse.json({ package: next });
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const existing = await getPackage(params.id);
  if (!existing) {
    return NextResponse.json(getBookingPackageApiErrorPayload(locale, 'package_not_found'), { status: 404 });
  }

  const next = timestamped({ ...existing, isActive: false }, existing.createdAt);
  await savePackage(next);
  return NextResponse.json({ package: next });
}
