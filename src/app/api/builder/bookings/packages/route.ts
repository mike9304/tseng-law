import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import { bookingPackageInputSchema } from '@/lib/builder/bookings/types';
import { listPackages, makePackageId, savePackage, timestamped } from '@/lib/builder/bookings/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;
  const includeInactive = request.nextUrl.searchParams.get('includeInactive') === '1';
  const packages = await listPackages(includeInactive);
  return NextResponse.json({ packages });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const parsed = bookingPackageInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid package payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const pkg = timestamped({
    packageId: makePackageId(),
    ...parsed.data,
    description: parsed.data.description ?? { ko: '', 'zh-hant': '', en: '' },
  });
  await savePackage(pkg);
  return NextResponse.json({ package: pkg }, { status: 201 });
}
