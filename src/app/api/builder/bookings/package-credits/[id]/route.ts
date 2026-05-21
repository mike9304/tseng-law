import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { bookingPackageCreditUpdateSchema } from '@/lib/builder/bookings/types';
import { getPackageCredit, savePackageCredit, timestamped } from '@/lib/builder/bookings/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const existing = await getPackageCredit(params.id);
  if (!existing) return NextResponse.json({ error: 'Package credit not found' }, { status: 404 });

  const parsed = bookingPackageCreditUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid credit payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const totalCredits = parsed.data.totalCredits ?? existing.totalCredits;
  const remainingCredits = Math.min(parsed.data.remainingCredits ?? existing.remainingCredits, totalCredits);
  const status = parsed.data.status ?? (remainingCredits > 0 ? existing.status : 'used');
  const next = timestamped({
    ...existing,
    ...parsed.data,
    totalCredits,
    remainingCredits,
    expiresAt: parsed.data.expiresAt === '' ? undefined : parsed.data.expiresAt ?? existing.expiresAt,
    status,
  }, existing.createdAt);
  await savePackageCredit(next);
  return NextResponse.json({ credit: next });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const existing = await getPackageCredit(params.id);
  if (!existing) return NextResponse.json({ error: 'Package credit not found' }, { status: 404 });

  const next = timestamped({ ...existing, status: 'revoked' as const }, existing.createdAt);
  await savePackageCredit(next);
  return NextResponse.json({ credit: next });
}
