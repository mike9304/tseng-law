import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteNotification,
  markRead,
} from '@/lib/builder/notifications/notification-store';
import {
  getBuilderNotificationsApiErrorPayload,
  type BuilderNotificationsApiErrorCode,
} from '@/lib/builder/notifications/notifications-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BuilderNotificationsApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderNotificationsApiErrorPayload(locale, errorCode) },
    { status },
  );
}

function resolveRequestLocale(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;
  const locale = resolveRequestLocale(request);
  try {
    const updated = await markRead(params.id);
    if (!updated) return errorResponse(locale, 'notification_not_found', 404);
    return NextResponse.json({ ok: true, notification: updated });
  } catch (error) {
    console.error('[builder/notifications/[id]] PATCH failed:', error);
    return errorResponse(locale, 'notification_update_failed', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;
  const locale = resolveRequestLocale(request);
  try {
    const ok = await deleteNotification(params.id);
    if (!ok) return errorResponse(locale, 'notification_not_found', 404);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/notifications/[id]] DELETE failed:', error);
    return errorResponse(locale, 'notification_delete_failed', 500);
  }
}
