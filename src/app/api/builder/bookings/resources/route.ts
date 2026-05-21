import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import { bookingResourceInputSchema } from '@/lib/builder/bookings/types';
import { listResources, makeResourceId, saveResource, timestamped } from '@/lib/builder/bookings/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;
  const includeInactive = request.nextUrl.searchParams.get('includeInactive') === '1';
  const resources = await listResources(includeInactive);
  return NextResponse.json({ resources });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const parsed = bookingResourceInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid resource payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
  }

  const resource = timestamped({
    resourceId: makeResourceId(),
    ...parsed.data,
    description: parsed.data.description ?? { ko: '', 'zh-hant': '', en: '' },
    location: parsed.data.location ?? '',
  });
  await saveResource(resource);
  return NextResponse.json({ resource }, { status: 201 });
}
