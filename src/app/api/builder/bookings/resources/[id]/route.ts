import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { bookingResourceInputSchema } from '@/lib/builder/bookings/types';
import { getResource, saveResource, timestamped } from '@/lib/builder/bookings/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const existing = await getResource(params.id);
  if (!existing) return NextResponse.json({ error: 'Resource not found' }, { status: 404 });

  const parsed = bookingResourceInputSchema.partial().safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid resource payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const next = timestamped({
    ...existing,
    ...parsed.data,
    description: parsed.data.description ?? existing.description,
    location: parsed.data.location ?? existing.location,
  }, existing.createdAt);
  await saveResource(next);
  return NextResponse.json({ resource: next });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const existing = await getResource(params.id);
  if (!existing) return NextResponse.json({ error: 'Resource not found' }, { status: 404 });

  const next = timestamped({ ...existing, isActive: false }, existing.createdAt);
  await saveResource(next);
  return NextResponse.json({ resource: next });
}
