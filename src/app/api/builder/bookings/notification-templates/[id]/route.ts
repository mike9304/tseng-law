import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  deleteNotificationTemplate,
  getNotificationTemplate,
  notificationTemplatePatchSchema,
  updateNotificationTemplate,
} from '@/lib/builder/bookings/notification-template-store';
import {
  getBookingNotificationTemplateApiErrorPayload,
  type BookingNotificationTemplateApiErrorCode,
} from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BookingNotificationTemplateApiErrorCode,
  status: number,
  details?: unknown,
): NextResponse {
  return NextResponse.json(
    {
      ...getBookingNotificationTemplateApiErrorPayload(locale, errorCode),
      ...(details ? { details } : {}),
    },
    { status },
  );
}

function localeFromRequest(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') || undefined);
}

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardBuilderReadWithPermission(request, 'view-bookings');
  if (auth instanceof NextResponse) return auth;

  const locale = localeFromRequest(request);
  const template = await getNotificationTemplate(params.id);
  if (!template) {
    return errorResponse(locale, 'template_not_found', 404);
  }
  return NextResponse.json({ template });
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = localeFromRequest(request);
  const parsed = notificationTemplatePatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_template_patch', 400, parsed.error.issues.slice(0, 3));
  }

  const result = await updateNotificationTemplate(params.id, parsed.data);
  if (!result.ok) {
    return errorResponse(locale, 'template_not_found', 404);
  }
  return NextResponse.json({ template: result.template });
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const locale = localeFromRequest(request);
  const result = await deleteNotificationTemplate(params.id);
  if (!result.ok) {
    return errorResponse(locale, 'template_not_found', 404);
  }
  return NextResponse.json({ ok: true });
}
