import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import { staffAvailabilitySchema } from '@/lib/builder/bookings/types';
import { getStaffAvailability, saveStaffAvailability } from '@/lib/builder/bookings/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const availability = await getStaffAvailability(params.id);
  return NextResponse.json({ availability });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => null);
  const parsed = staffAvailabilitySchema.safeParse({ ...body, staffId: params.id });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid availability payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  await saveStaffAvailability(parsed.data);
  return NextResponse.json({ availability: parsed.data });
}
