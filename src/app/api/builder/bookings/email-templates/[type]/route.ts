import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { bookingEmailTemplateInputSchema } from '@/lib/builder/bookings/types';
import {
  isBookingEmailTemplateType,
  upsertBookingEmailTemplate,
} from '@/lib/builder/bookings/email-templates';
import {
  getBookingEmailTemplateApiErrorPayload,
  type BookingEmailTemplateApiErrorCode,
} from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BookingEmailTemplateApiErrorCode,
  status: number,
  details?: unknown,
) {
  return NextResponse.json(
    {
      ...getBookingEmailTemplateApiErrorPayload(locale, errorCode),
      ...(details ? { details } : {}),
    },
    { status },
  );
}

export async function PATCH(request: NextRequest, { params }: { params: { type: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  if (!isBookingEmailTemplateType(params.type)) {
    return errorResponse(locale, 'unknown_template_type', 404);
  }

  const parsed = bookingEmailTemplateInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_template_payload', 400, parsed.error.issues.slice(0, 3));
  }

  const template = await upsertBookingEmailTemplate(params.type, parsed.data);
  return NextResponse.json({ template });
}
