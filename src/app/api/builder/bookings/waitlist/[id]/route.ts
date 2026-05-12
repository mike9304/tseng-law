import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { bookingWaitlistUpdateSchema } from '@/lib/builder/bookings/types';
import { getWaitlistEntry, saveWaitlistEntry, timestamped } from '@/lib/builder/bookings/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const existing = await getWaitlistEntry(params.id);
  if (!existing) return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 });

  const parsed = bookingWaitlistUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid waitlist payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  if (existing.status === 'promoted') {
    return NextResponse.json({ error: 'Promoted waitlist entries cannot be edited.' }, { status: 409 });
  }

  const next = timestamped({ ...existing, status: parsed.data.status }, existing.createdAt);
  await saveWaitlistEntry(next);
  return NextResponse.json({ waitlist: next });
}
