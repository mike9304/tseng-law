import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  listPaymentWebhookEvents,
  summarizePaymentWebhookEvents,
} from '@/lib/builder/commerce/payment-webhooks-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  q: z.string().trim().max(200).optional(),
  provider: z.enum(['all', 'manual-invoice', 'sandbox-card']).default('all'),
  status: z.enum(['all', 'processed', 'unmatched', 'failed', 'ignored']).default('all'),
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
    const input = querySchema.parse({
      q: sp.get('q') ?? undefined,
      provider: sp.get('provider') ?? 'all',
      status: sp.get('status') ?? 'all',
    });
    const events = await listPaymentWebhookEvents(input);
    return NextResponse.json({
      ok: true,
      events,
      kpis: summarizePaymentWebhookEvents(events),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    console.error('[builder/commerce/payment-webhooks] GET failed:', error);
    return NextResponse.json({ ok: false, error: 'payment_webhooks_failed' }, { status: 500 });
  }
}
