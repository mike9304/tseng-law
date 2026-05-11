import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getSubscription, listDeliveriesForWebhook } from '@/lib/builder/webhooks/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const subscription = await getSubscription(params.id);
  if (!subscription) return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });

  const deliveries = await listDeliveriesForWebhook(params.id);
  return NextResponse.json({ ok: true, deliveries: deliveries.slice(0, 200), total: deliveries.length });
}
