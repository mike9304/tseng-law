import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { bookingServiceInputSchema } from '@/lib/builder/bookings/types';
import { getService, saveService, slugify, timestamped } from '@/lib/builder/bookings/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const existing = await getService(params.id);
  if (!existing) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

  const parsed = bookingServiceInputSchema.partial().safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid service payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const next = timestamped({
    ...existing,
    ...parsed.data,
    slug: parsed.data.slug || existing.slug || slugify(parsed.data.name?.en || parsed.data.name?.ko || existing.name.en),
    image: parsed.data.image ?? existing.image,
  }, existing.createdAt);
  await saveService(next);
  return NextResponse.json({ service: next });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const existing = await getService(params.id);
  if (!existing) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

  const next = timestamped({ ...existing, isActive: false }, existing.createdAt);
  await saveService(next);
  return NextResponse.json({ service: next });
}
