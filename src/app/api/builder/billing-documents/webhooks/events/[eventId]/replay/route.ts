import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { replayBillingDocumentWebhookEvent } from '@/lib/builder/billing-document-webhooks';
import { getBuilderBillingDocumentsApiErrorPayload } from '@/lib/builder/billing-documents-copy';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { eventId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const result = await replayBillingDocumentWebhookEvent(params.eventId);
    if (!result.event) {
      return NextResponse.json(
        { ok: false, ...getBuilderBillingDocumentsApiErrorPayload(errorLocale, 'event_not_found') },
        { status: 404 },
      );
    }
    return NextResponse.json({
      ok: true,
      changed: result.changed,
      reason: result.reason,
      event: result.event,
      document: result.document,
      order: result.order,
      booking: result.booking,
    });
  } catch (error) {
    console.error('[builder/billing-documents/webhooks/events/:eventId/replay] POST failed:', error);
    return NextResponse.json(
      { ok: false, ...getBuilderBillingDocumentsApiErrorPayload(errorLocale, 'billing_document_webhook_replay_failed') },
      { status: 500 },
    );
  }
}
