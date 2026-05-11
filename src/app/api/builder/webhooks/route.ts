import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  listSubscriptions,
  makeWebhookId,
  makeWebhookSecret,
  saveSubscription,
} from '@/lib/builder/webhooks/storage';
import { subscriptionCreateSchema, type WebhookSubscription } from '@/lib/builder/webhooks/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;
  const subscriptions = await listSubscriptions();
  return NextResponse.json({
    ok: true,
    subscriptions: subscriptions.map((s) => ({
      ...s,
      secret: `${s.secret.slice(0, 12)}…`, // mask
    })),
    total: subscriptions.length,
  });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = subscriptionCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid subscription payload', details: parsed.error.issues.slice(0, 3) }, { status: 400 });
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
  await saveSubscription(subscription);
  // Return the secret once on create — caller must store it.
  return NextResponse.json({ ok: true, subscription }, { status: 201 });
}
