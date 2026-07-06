import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getSubscription,
  saveSubscription,
} from '@/lib/builder/webhooks/storage';
import { subscriptionUpdateSchema } from '@/lib/builder/webhooks/types';
import {
  getBuilderWebhooksApiErrorPayload,
  type BuilderWebhooksApiErrorCode,
} from '@/lib/builder/webhooks/webhooks-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function requestLocale(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderWebhooksApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderWebhooksApiErrorPayload(locale, errorCode),
      ...(extra ?? {}),
    },
    { status },
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  const existing = await getSubscription(params.id);
  if (!existing) return errorResponse(locale, 'webhook_not_found', 404);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch (error) {
    console.error('[builder/webhooks/:id] PATCH JSON parse failed:', error);
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = subscriptionUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'validation_error', 400, { details: parsed.error.issues.slice(0, 3) });
  }

  const merged = {
    ...existing,
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };
  try {
    await saveSubscription(merged);
    return NextResponse.json({ ok: true, subscription: { ...merged, secret: `${merged.secret.slice(0, 12)}…` } });
  } catch (error) {
    console.error('[builder/webhooks/:id] PATCH failed:', error);
    return errorResponse(locale, 'webhook_update_failed', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  const existing = await getSubscription(params.id);
  if (!existing) return errorResponse(locale, 'webhook_not_found', 404);

  try {
    await saveSubscription({ ...existing, active: false, updatedAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, deactivated: true });
  } catch (error) {
    console.error('[builder/webhooks/:id] DELETE failed:', error);
    return errorResponse(locale, 'webhook_delete_failed', 500);
  }
}
