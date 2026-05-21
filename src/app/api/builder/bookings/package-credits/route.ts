import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import { bookingPackageCreditInputSchema } from '@/lib/builder/bookings/types';
import {
  getPackage,
  listPackageCredits,
  makePackageCreditId,
  savePackageCredit,
  timestamped,
} from '@/lib/builder/bookings/storage';
import { normalizePackageEmail } from '@/lib/builder/bookings/packages';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function expiryFromValidityDays(days?: number): string | undefined {
  if (!days) return undefined;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return expires.toISOString();
}

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;
  const customerEmail = request.nextUrl.searchParams.get('customerEmail') ?? undefined;
  const packageId = request.nextUrl.searchParams.get('packageId') ?? undefined;
  const includeInactive = request.nextUrl.searchParams.get('includeInactive') === '1';
  const credits = await listPackageCredits({ customerEmail, packageId, includeInactive });
  return NextResponse.json({ credits });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const parsed = bookingPackageCreditInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid credit payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const pkg = await getPackage(parsed.data.packageId);
  if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 });

  const totalCredits = parsed.data.totalCredits ?? pkg.credits;
  const credit = timestamped({
    creditId: makePackageCreditId(),
    packageId: pkg.packageId,
    customerEmail: normalizePackageEmail(parsed.data.customerEmail),
    customerName: parsed.data.customerName ?? '',
    totalCredits,
    remainingCredits: totalCredits,
    expiresAt: parsed.data.expiresAt ?? expiryFromValidityDays(pkg.validityDays),
    status: parsed.data.status,
    note: parsed.data.note ?? '',
    redemptions: [],
  });
  await savePackageCredit(credit);
  return NextResponse.json({ credit }, { status: 201 });
}
