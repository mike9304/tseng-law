import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { bookingServiceInputSchema } from '@/lib/builder/bookings/types';
import { getService, saveService, slugify, timestamped } from '@/lib/builder/bookings/storage';
import {
  getBookingServiceApiDetailMessage,
  getBookingServiceApiErrorPayload,
} from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ServicePaymentFields = {
  paymentMode?: unknown;
  collectPaymentLater?: unknown;
  depositAmount?: unknown;
  priceAmount?: unknown;
  staffPriceOverrides?: unknown;
  resourcePriceOverrides?: unknown;
  discountCodes?: unknown;
};

function normalizeServicePaymentFields<T extends ServicePaymentFields>(service: T): T {
  if (service.paymentMode !== 'paid') {
    service.collectPaymentLater = false;
    delete service.depositAmount;
    delete service.priceAmount;
    delete service.staffPriceOverrides;
    delete service.resourcePriceOverrides;
    delete service.discountCodes;
    return service;
  }
  if (service.collectPaymentLater === true || service.collectPaymentLater === 'true') {
    delete service.depositAmount;
  }
  return service;
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const existing = await getService(params.id);
  if (!existing) {
    return NextResponse.json(getBookingServiceApiErrorPayload(locale, 'service_not_found'), { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json(
      {
        ...getBookingServiceApiErrorPayload(locale, 'invalid_service_payload'),
        details: [getBookingServiceApiDetailMessage(locale, 'expected_object_payload')],
      },
      { status: 400 },
    );
  }
  const parsed = bookingServiceInputSchema.safeParse(normalizeServicePaymentFields({
    ...existing,
    ...body,
    slug: (body as { slug?: string }).slug || existing.slug,
    image: (body as { image?: string }).image ?? existing.image,
  }));
  if (!parsed.success) {
    return NextResponse.json(
      {
        ...getBookingServiceApiErrorPayload(locale, 'invalid_service_payload'),
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  const next = timestamped(normalizeServicePaymentFields({
    ...existing,
    ...parsed.data,
    slug: parsed.data.slug || existing.slug || slugify(parsed.data.name?.en || parsed.data.name?.ko || existing.name.en),
    image: parsed.data.image ?? existing.image,
  }), existing.createdAt);
  await saveService(next);
  return NextResponse.json({ service: next });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const existing = await getService(params.id);
  if (!existing) {
    return NextResponse.json(getBookingServiceApiErrorPayload(locale, 'service_not_found'), { status: 404 });
  }

  const next = timestamped({ ...existing, isActive: false }, existing.createdAt);
  await saveService(next);
  return NextResponse.json({ service: next });
}
