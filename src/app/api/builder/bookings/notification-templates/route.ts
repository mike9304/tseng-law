import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  createNotificationTemplate,
  isNotificationEventType,
  listNotificationTemplates,
  notificationTemplateInputSchema,
  type NotificationEventType,
} from '@/lib/builder/bookings/notification-template-store';
import {
  getBookingNotificationTemplateApiErrorPayload,
  type BookingNotificationTemplateApiErrorCode,
} from '@/lib/builder/bookings/bookings-copy';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

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

function localeFromPayload(payload: unknown): Locale {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const locale = (payload as { locale?: unknown }).locale;
    return normalizeLocale(typeof locale === 'string' ? locale : undefined);
  }
  return normalizeLocale();
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'view-bookings');
  if (auth instanceof NextResponse) return auth;

  const eventTypeRaw = request.nextUrl.searchParams.get('eventType');
  const localeRaw = request.nextUrl.searchParams.get('locale');
  const errorLocale = normalizeLocale(localeRaw || undefined);

  let eventType: NotificationEventType | undefined;
  if (eventTypeRaw) {
    if (!isNotificationEventType(eventTypeRaw)) {
      return errorResponse(errorLocale, 'unknown_event_type', 400);
    }
    eventType = eventTypeRaw;
  }

  let locale: Locale | undefined;
  if (localeRaw) {
    if (!isLocale(localeRaw)) {
      return errorResponse(errorLocale, 'unknown_locale', 400);
    }
    locale = localeRaw;
  }

  const templates = await listNotificationTemplates({ eventType, locale });
  return NextResponse.json({ templates });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const locale = localeFromPayload(raw);
  const parsed = notificationTemplateInputSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_template_payload', 400, parsed.error.issues.slice(0, 3));
  }

  const result = await createNotificationTemplate(parsed.data);
  if (!result.ok) {
    return errorResponse(locale, 'duplicate_template', 409);
  }
  return NextResponse.json({ template: result.template }, { status: 201 });
}
