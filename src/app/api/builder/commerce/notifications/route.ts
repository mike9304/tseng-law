import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { recordCommerceSettingsUpdated } from '@/lib/builder/audit/record';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  isCommerceNotificationType,
  type CommerceNotificationStatus,
} from '@/lib/builder/commerce/notifications-shared';
import {
  listNotificationEvents,
  listRecoveryCarts,
  loadNotificationSettings,
  saveNotificationSettings,
} from '@/lib/builder/commerce/notifications-engine';
import {
  getCommerceNotificationsApiErrorPayload,
  type CommerceNotificationsApiErrorCode,
} from '@/lib/builder/commerce/notifications-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).optional(),
  type: z.string().default('all'),
  status: z.string().default('all'),
});

function errorResponse(
  locale: Locale,
  errorCode: CommerceNotificationsApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getCommerceNotificationsApiErrorPayload(locale, errorCode) },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getCommerceNotificationsApiErrorPayload(locale, 'invalid_notification_filters'),
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'view-commerce');
  if (auth instanceof NextResponse) return auth;

  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const sp = request.nextUrl.searchParams;
    const parsed = querySchema.parse({
      locale: sp.get('locale') ?? undefined,
      type: sp.get('type') ?? 'all',
      status: sp.get('status') ?? 'all',
    });
    const settings = await loadNotificationSettings();
    const eventStatus = parsed.status === 'queued' || parsed.status === 'sent_stub' || parsed.status === 'skipped'
      ? parsed.status as CommerceNotificationStatus
      : parsed.status === 'all' ? 'all' : undefined;
    const events = await listNotificationEvents({
      locale: parsed.locale,
      type: parsed.type === 'all' ? 'all' : isCommerceNotificationType(parsed.type) ? parsed.type : undefined,
      status: eventStatus,
    });
    const recoveries = await listRecoveryCarts({ locale: parsed.locale });
    return NextResponse.json({ ok: true, settings, events, recoveries });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    console.error('[builder/commerce/notifications] GET failed:', error);
    return errorResponse(errorLocale, 'notifications_failed', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-commerce' });
  if (auth instanceof NextResponse) return auth;

  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const body = await request.json();
    const settings = await saveNotificationSettings(body?.settings ?? body);
    await recordCommerceSettingsUpdated({ request, area: 'notifications' });
    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/notifications] PATCH failed:', error);
    return errorResponse(errorLocale, 'notifications_save_failed', 500);
  }
}
