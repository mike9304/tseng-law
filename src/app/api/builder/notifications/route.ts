import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createNotification,
  listNotifications,
  markAllRead,
} from '@/lib/builder/notifications/notification-store';
import type { BuilderNotificationKind } from '@/lib/builder/notifications/notification-model';

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

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true });
  if (auth instanceof NextResponse) return auth;
  const url = new URL(request.url);
  const kindParam = url.searchParams.get('kind') as BuilderNotificationKind | null;
  const unreadOnly = url.searchParams.get('unreadOnly') === '1';
  const limit = Number(url.searchParams.get('limit') ?? 50);
  const items = await listNotifications({
    kind: kindParam && ALLOWED_KINDS.includes(kindParam) ? kindParam : undefined,
    unreadOnly,
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 200) : 50,
  });
  const unread = items.filter((n) => !n.readAt).length;
  return NextResponse.json({ ok: true, notifications: items, total: items.length, unread });
}

/**
 * Internal POST is intentionally NOT auth-gated so server-side automations
 * (publish hooks, approval transitions, ecommerce events) can drop entries
 * without an admin session. To prevent open access the route requires
 * either a same-origin Referer or a matching `x-internal-source` header.
 */
function isInternalRequest(request: NextRequest): boolean {
  const headerSecret = process.env.BUILDER_INTERNAL_NOTIFY_SECRET;
  if (headerSecret) {
    const provided = request.headers.get('x-internal-source');
    if (provided && provided === headerSecret) return true;
  }
  const origin = request.headers.get('origin') ?? '';
  const referer = request.headers.get('referer') ?? '';
  const host = request.headers.get('host') ?? '';
  if (!host) return false;
  if (origin && origin.includes(host)) return true;
  if (referer && referer.includes(host)) return true;
  return false;
}

export async function POST(request: NextRequest) {
  if (!isInternalRequest(request)) {
    return NextResponse.json({ error: 'internal_only' }, { status: 403 });
  }
  const raw = await request.json().catch(() => null) as {
    kind?: unknown;
    subject?: unknown;
    body?: unknown;
    audience?: unknown;
    link?: unknown;
  } | null;
  const kind = raw?.kind as BuilderNotificationKind | undefined;
  if (!kind || !ALLOWED_KINDS.includes(kind)) {
    return NextResponse.json({ error: 'invalid_kind' }, { status: 400 });
  }
  const subject = typeof raw?.subject === 'string' ? raw.subject : '';
  if (!subject.trim()) {
    return NextResponse.json({ error: 'subject_required' }, { status: 400 });
  }
  const body = typeof raw?.body === 'string' ? raw.body : '';
  const link = typeof raw?.link === 'string' ? raw.link : undefined;
  const audienceRaw = (raw?.audience ?? {}) as { email?: unknown; role?: unknown };
  const audience: { email?: string; role?: 'owner' | 'editor' | 'reviewer' | 'viewer' } = {};
  if (typeof audienceRaw.email === 'string') audience.email = audienceRaw.email;
  if (
    audienceRaw.role === 'owner' ||
    audienceRaw.role === 'editor' ||
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
      link,
    });
    return NextResponse.json({ ok: true, notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'create_failed' },
      { status: 400 },
    );
  }
}

export async function PUT(request: NextRequest) {
  // Bulk "mark all read".
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;
  const raw = await request.json().catch(() => null) as { kind?: unknown } | null;
  const kind = raw?.kind as BuilderNotificationKind | undefined;
  const updated = await markAllRead({
    kind: kind && ALLOWED_KINDS.includes(kind) ? kind : undefined,
  });
  return NextResponse.json({ ok: true, updated });
}