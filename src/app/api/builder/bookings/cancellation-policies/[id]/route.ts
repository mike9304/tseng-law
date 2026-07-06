import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getBookingCancellationPolicyApiErrorPayload } from '@/lib/builder/bookings/bookings-copy';
import { bookingCancellationPolicyInputSchema } from '@/lib/builder/bookings/types';
import { getCancellationPolicy, saveCancellationPolicy, timestamped } from '@/lib/builder/bookings/storage';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const existing = await getCancellationPolicy(params.id);
  if (!existing) {
    return NextResponse.json(getBookingCancellationPolicyApiErrorPayload(locale, 'policy_not_found'), { status: 404 });
  }

  const parsed = bookingCancellationPolicyInputSchema.partial().safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        ...getBookingCancellationPolicyApiErrorPayload(locale, 'invalid_policy_payload'),
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  const next = timestamped({
    ...existing,
    ...parsed.data,
    description: parsed.data.description !== undefined ? parsed.data.description || undefined : existing.description,
    isActive: parsed.data.isActive ?? existing.isActive,
  }, existing.createdAt);
  await saveCancellationPolicy(next);
  return NextResponse.json({ policy: next });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const existing = await getCancellationPolicy(params.id);
  if (!existing) {
    return NextResponse.json(getBookingCancellationPolicyApiErrorPayload(locale, 'policy_not_found'), { status: 404 });
  }

  const next = timestamped({ ...existing, isActive: false }, existing.createdAt);
  await saveCancellationPolicy(next);
  return NextResponse.json({ policy: next });
}
