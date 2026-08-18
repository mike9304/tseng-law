import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import { bookingServiceInputSchema } from '@/lib/builder/bookings/types';
import { listServices, makeServiceId, saveService, slugify, timestamped } from '@/lib/builder/bookings/storage';
import { getBookingServiceApiErrorPayload } from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'view-bookings');
  if (auth instanceof NextResponse) return auth;
  const includeInactive = request.nextUrl.searchParams.get('includeInactive') === '1';
  const services = await listServices(includeInactive);
  return NextResponse.json({ services });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const parsed = bookingServiceInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        ...getBookingServiceApiErrorPayload(locale, 'invalid_service_payload'),
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  const serviceId = makeServiceId();
  const service = timestamped({
    serviceId,
    ...parsed.data,
    slug: parsed.data.slug || slugify(parsed.data.name.en || parsed.data.name.ko),
    image: parsed.data.image || '',
    category: parsed.data.category || 'consultation',
  });
  await saveService(service);
  return NextResponse.json({ service }, { status: 201 });
}
