import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { bookingResourceInputSchema } from '@/lib/builder/bookings/types';
import { getResource, saveResource, timestamped } from '@/lib/builder/bookings/storage';
import { getBookingResourceApiErrorPayload } from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const existing = await getResource(params.id);
  if (!existing) {
    return NextResponse.json(getBookingResourceApiErrorPayload(locale, 'resource_not_found'), { status: 404 });
  }

  const parsed = bookingResourceInputSchema.partial().safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        ...getBookingResourceApiErrorPayload(locale, 'invalid_resource_payload'),
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  const next = timestamped({
    ...existing,
    ...parsed.data,
    description: parsed.data.description ?? existing.description,
    location: parsed.data.location ?? existing.location,
    recurringTemplateId: parsed.data.recurringTemplateId !== undefined
      ? parsed.data.recurringTemplateId?.trim() || undefined
      : existing.recurringTemplateId,
  }, existing.createdAt);
  await saveResource(next);
  return NextResponse.json({ resource: next });
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const existing = await getResource(params.id);
  if (!existing) {
    return NextResponse.json(getBookingResourceApiErrorPayload(locale, 'resource_not_found'), { status: 404 });
  }

  const next = timestamped({ ...existing, isActive: false }, existing.createdAt);
  await saveResource(next);
  return NextResponse.json({ resource: next });
}
