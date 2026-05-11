import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getSubscription,
  saveSubscription,
} from '@/lib/builder/webhooks/storage';
import { subscriptionUpdateSchema } from '@/lib/builder/webhooks/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const existing = await getSubscription(params.id);
  if (!existing) return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });

  const raw = await request.json().catch(() => null);
  const parsed = subscriptionUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid update' }, { status: 400 });
  }

  const merged = {
    ...existing,
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };
  await saveSubscription(merged);
  return NextResponse.json({ ok: true, subscription: { ...merged, secret: `${merged.secret.slice(0, 12)}…` } });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const existing = await getSubscription(params.id);
  if (!existing) return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });

  await saveSubscription({ ...existing, active: false, updatedAt: new Date().toISOString() });
  return NextResponse.json({ ok: true, deactivated: true });
}
