import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  createNotification,
  listNotifications,
  markAllRead,
} from '@/lib/builder/notifications/notification-store';
import type { BuilderNotificationKind } from '@/lib/builder/notifications/notification-model';
import {
  getBuilderNotificationsApiErrorPayload,
  type BuilderNotificationsApiErrorCode,
} from '@/lib/builder/notifications/notifications-api-copy';
import { sanitizeNotificationLink } from '@/lib/builder/notifications/notification-link';
import { safeEqualStrings } from '@/lib/builder/security/timing-safe';
import { resolveUserRole } from '@/lib/builder/security/resolve-permission';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_KINDS: BuilderNotificationKind[] = [
  'comment',
  'approval',
  'order',
  'booking',
  'app-install',
  'publish',
];

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

function resolveRequestLocale(request: NextRequest, payload?: unknown): Locale {
  const queryLocale = request.nextUrl.searchParams.get('locale') ?? undefined;
  if (isLocale(queryLocale)) return queryLocale;
  if (payload && typeof payload === 'object') {
    const locale = (payload as { locale?: unknown }).locale;
    if (typeof locale === 'string' && isLocale(locale)) return locale;
  }
  return normalizeLocale(queryLocale);
}

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  const url = new URL(request.url);
  const locale = resolveRequestLocale(request);
  try {
    const audienceScope = {
      principal: auth.username,
      role: await resolveUserRole(auth.username),
    };
    const kindParam = url.searchParams.get('kind') as BuilderNotificationKind | null;
    const unreadOnly = url.searchParams.get('unreadOnly') === '1';
    const limit = Number(url.searchParams.get('limit') ?? 50);
    const items = await listNotifications({
      kind: kindParam && ALLOWED_KINDS.includes(kindParam) ? kindParam : undefined,
      unreadOnly,
      audienceScope,
      limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 200) : 50,
    });
    const unread = items.filter((n) => !n.readAt).length;
    return NextResponse.json({ ok: true, notifications: items, total: items.length, unread });
  } catch (error) {
    console.error('[builder/notifications] GET failed:', error);
    return errorResponse(locale, 'notifications_list_failed', 500);
  }
}

function isInternalRequest(request: NextRequest): boolean {
  const configuredSecret = process.env.BUILDER_INTERNAL_NOTIFY_SECRET;
  if (!configuredSecret) return false;
  return safeEqualStrings(request.headers.get('x-internal-source'), configuredSecret);
}

export async function POST(request: NextRequest) {
  let errorLocale = resolveRequestLocale(request);
  if (!isInternalRequest(request)) {
    return errorResponse(errorLocale, 'internal_only', 403);
  }
  const contentType = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
  if (contentType !== 'application/json') {
    return errorResponse(errorLocale, 'invalid_content_type', 415);
  }
  let raw: {
    kind?: unknown;
    subject?: unknown;
    body?: unknown;
    audience?: unknown;
    link?: unknown;
    locale?: unknown;
  } | null;
  try {
    raw = await request.json();
    errorLocale = resolveRequestLocale(request, raw);
  } catch {
    return errorResponse(errorLocale, 'invalid_json', 400);
  }
  const kind = raw?.kind as BuilderNotificationKind | undefined;
  if (!kind || !ALLOWED_KINDS.includes(kind)) {
    return errorResponse(errorLocale, 'invalid_kind', 400);
  }
  const subject = typeof raw?.subject === 'string' ? raw.subject : '';
  if (!subject.trim()) {
    return errorResponse(errorLocale, 'subject_required', 400);
  }
  const body = typeof raw?.body === 'string' ? raw.body : '';
  const link = raw?.link === undefined ? undefined : sanitizeNotificationLink(raw.link);
  if (raw?.link !== undefined && link === null) {
    return errorResponse(errorLocale, 'invalid_link', 400);
  }
  const audienceRaw = (raw?.audience ?? {}) as { email?: unknown; role?: unknown };
  const audience: {
    email?: string;
    role?: 'owner' | 'admin' | 'designer' | 'editor' | 'client' | 'reviewer' | 'viewer';
  } = {};
  if (typeof audienceRaw.email === 'string') audience.email = audienceRaw.email;
  if (
    audienceRaw.role === 'owner' ||
    audienceRaw.role === 'admin' ||
    audienceRaw.role === 'designer' ||
    audienceRaw.role === 'editor' ||
    audienceRaw.role === 'client' ||
    audienceRaw.role === 'reviewer' ||
    audienceRaw.role === 'viewer'
  ) {
    audience.role = audienceRaw.role;
  }
  try {
    const notification = await createNotification({
      kind,
      subject,
      body,
      audience,
      link: link ?? undefined,
    });
    return NextResponse.json({ ok: true, notification }, { status: 201 });
  } catch (error) {
    console.error('[builder/notifications] POST failed:', error);
    return errorResponse(errorLocale, 'notification_create_failed', 500);
  }
}

export async function PUT(request: NextRequest) {
  // Bulk "mark all read".
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;
  let errorLocale = resolveRequestLocale(request);
  try {
    const raw = await request.json().catch(() => null) as { kind?: unknown; locale?: unknown } | null;
    errorLocale = resolveRequestLocale(request, raw);
    const audienceScope = {
      principal: auth.username,
      role: await resolveUserRole(auth.username),
    };
    const kind = raw?.kind as BuilderNotificationKind | undefined;
    const updated = await markAllRead({
      kind: kind && ALLOWED_KINDS.includes(kind) ? kind : undefined,
      audienceScope,
    });
    return NextResponse.json({ ok: true, updated });
  } catch (error) {
    console.error('[builder/notifications] PUT failed:', error);
    return errorResponse(errorLocale, 'notification_update_failed', 500);
  }
}
