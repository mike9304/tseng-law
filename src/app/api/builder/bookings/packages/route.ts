import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import { getBookingPackageApiErrorPayload } from '@/lib/builder/bookings/bookings-copy';
import { bookingPackageInputSchema } from '@/lib/builder/bookings/types';
import { listPackages, makePackageId, savePackage, timestamped } from '@/lib/builder/bookings/storage';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'view-bookings');
  if (auth instanceof NextResponse) return auth;
  const includeInactive = request.nextUrl.searchParams.get('includeInactive') === '1';
  const packages = await listPackages(includeInactive);
  return NextResponse.json({ packages });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const parsed = bookingPackageInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        ...getBookingPackageApiErrorPayload(locale, 'invalid_package_payload'),
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  const pkg = timestamped({
    packageId: makePackageId(),
    ...parsed.data,
    description: parsed.data.description ?? { ko: '', 'zh-hant': '', en: '' },
  });
  await savePackage(pkg);
  return NextResponse.json({ package: pkg }, { status: 201 });
}
