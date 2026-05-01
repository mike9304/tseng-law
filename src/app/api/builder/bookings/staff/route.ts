import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import { staffInputSchema } from '@/lib/builder/bookings/types';
import { listStaff, makeStaffId, saveStaff, timestamped } from '@/lib/builder/bookings/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;
  const includeInactive = request.nextUrl.searchParams.get('includeInactive') === '1';
  const staff = await listStaff(includeInactive);
  return NextResponse.json({ staff });
}

export async function POST(request: NextRequest) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const parsed = staffInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid staff payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const staff = timestamped({
    staffId: makeStaffId(),
    ...parsed.data,
    photo: parsed.data.photo || '',
    email: parsed.data.email || '',
  });
  await saveStaff(staff);
  return NextResponse.json({ staff }, { status: 201 });
}
