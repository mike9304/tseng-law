import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  listBillingDocumentWebhookEvents,
  summarizeBillingDocumentWebhookEvents,
} from '@/lib/builder/billing-document-webhooks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  q: z.string().trim().max(200).optional(),
  status: z.enum(['all', 'processed', 'failed', 'ignored']).default('all'),
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
      status: sp.get('status') ?? 'all',
    });
    const events = await listBillingDocumentWebhookEvents(input);
    return NextResponse.json({
      ok: true,
      events,
      kpis: summarizeBillingDocumentWebhookEvents(events),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    console.error('[builder/billing-documents/webhooks] GET failed:', error);
    return NextResponse.json({ ok: false, error: 'billing_document_webhooks_failed' }, { status: 500 });
  }
}
