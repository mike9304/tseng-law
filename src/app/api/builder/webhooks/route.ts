import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderWebhooksApiErrorPayload,
  type BuilderWebhooksApiErrorCode,
} from '@/lib/builder/webhooks/webhooks-api-copy';
import {
  listSubscriptions,
  makeWebhookId,
  makeWebhookSecret,
  saveSubscription,
} from '@/lib/builder/webhooks/storage';
import { subscriptionCreateSchema, type WebhookSubscription } from '@/lib/builder/webhooks/types';

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

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  try {
    const subscriptions = await listSubscriptions();
    return NextResponse.json({
      ok: true,
      subscriptions: subscriptions.map((s) => ({
        ...s,
        secret: `${s.secret.slice(0, 12)}…`, // mask
      })),
      total: subscriptions.length,
    });
  } catch (error) {
    console.error('[builder/webhooks] GET failed:', error);
    return errorResponse(locale, 'webhook_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch (error) {
    console.error('[builder/webhooks] POST JSON parse failed:', error);
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = subscriptionCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'validation_error', 400, { details: parsed.error.issues.slice(0, 3) });
  }
  const now = new Date().toISOString();
  const subscription: WebhookSubscription = {
    webhookId: makeWebhookId(),
    url: parsed.data.url,
    events: parsed.data.events,
    secret: makeWebhookSecret(),
    description: parsed.data.description,
    active: parsed.data.active,
    createdAt: now,
    updatedAt: now,
  };
  try {
    await saveSubscription(subscription);
    // Return the secret once on create — caller must store it.
    return NextResponse.json({ ok: true, subscription }, { status: 201 });
  } catch (error) {
    console.error('[builder/webhooks] POST failed:', error);
    return errorResponse(locale, 'webhook_create_failed', 500);
  }
}
