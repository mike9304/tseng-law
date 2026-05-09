import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { staffInputSchema } from '@/lib/builder/bookings/types';
import { getStaff, saveStaff, timestamped } from '@/lib/builder/bookings/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const existing = await getStaff(params.id);
  if (!existing) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

  const parsed = staffInputSchema.partial().safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid staff payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const next = timestamped({
    ...existing,
    ...parsed.data,
    photo: parsed.data.photo ?? existing.photo,
    email: parsed.data.email ?? existing.email,
  }, existing.createdAt);
  await saveStaff(next);
  return NextResponse.json({ staff: next });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const existing = await getStaff(params.id);
  if (!existing) return NextResponse.json({ error: 'Staff not found' }, { status: 404 });

  const next = timestamped({ ...existing, isActive: false }, existing.createdAt);
  await saveStaff(next);
  return NextResponse.json({ staff: next });
}
