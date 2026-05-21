import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { replayPaymentWebhookEvent } from '@/lib/builder/commerce/payment-webhooks-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } },
) {
  const auth = await guardMutation(request, { permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const result = await replayPaymentWebhookEvent(params.eventId);
  if (!result.event) return NextResponse.json({ ok: false, error: 'payment_webhook_event_not_found' }, { status: 404 });
  return NextResponse.json({
    ok: true,
    event: result.event,
    order: result.order,
    changed: result.changed,
    reason: result.reason,
  });
}
