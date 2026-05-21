import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).optional(),
  type: z.string().default('all'),
  status: z.string().default('all'),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

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
    if (error instanceof ZodError) return validationError(error);
    console.error('[builder/commerce/notifications] GET failed:', error);
    return NextResponse.json({ ok: false, error: 'notifications_failed' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const settings = await saveNotificationSettings(body?.settings ?? body);
    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    console.error('[builder/commerce/notifications] PATCH failed:', error);
    return NextResponse.json({ ok: false, error: 'notifications_save_failed' }, { status: 500 });
  }
}
