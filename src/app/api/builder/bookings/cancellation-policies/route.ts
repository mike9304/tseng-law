import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import { getBookingCancellationPolicyApiErrorPayload } from '@/lib/builder/bookings/bookings-copy';
import { bookingCancellationPolicyInputSchema } from '@/lib/builder/bookings/types';
import { listCancellationPolicies, makeCancellationPolicyId, saveCancellationPolicy, timestamped } from '@/lib/builder/bookings/storage';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'view-bookings');
  if (auth instanceof NextResponse) return auth;
  const includeInactive = request.nextUrl.searchParams.get('includeInactive') === '1';
  const policies = await listCancellationPolicies(includeInactive);
  return NextResponse.json({ policies });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const parsed = bookingCancellationPolicyInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        ...getBookingCancellationPolicyApiErrorPayload(locale, 'invalid_policy_payload'),
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  const policy = timestamped({
    policyId: makeCancellationPolicyId(),
    ...parsed.data,
    description: parsed.data.description || undefined,
  });
  await saveCancellationPolicy(policy);
  return NextResponse.json({ policy }, { status: 201 });
}
