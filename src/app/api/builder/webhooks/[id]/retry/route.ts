import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { getDelivery, getSubscription } from '@/lib/builder/webhooks/storage';
import { retryDelivery } from '@/lib/builder/webhooks/dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({ deliveryId: z.string().trim().min(1).max(120) });

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const subscription = await getSubscription(params.id);
  if (!subscription) return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });

  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid retry payload' }, { status: 400 });

  const prior = await getDelivery(parsed.data.deliveryId);
  if (!prior || prior.webhookId !== params.id) {
    return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
  }

  const result = await retryDelivery(subscription, prior);
  return NextResponse.json({ ok: result.status === 'success', delivery: result });
}
