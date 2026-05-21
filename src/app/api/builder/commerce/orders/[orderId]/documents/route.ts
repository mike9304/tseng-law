import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { issueOrderDocument, markOrderDocumentEmailed } from '@/lib/builder/commerce/orders-engine';
import { queueOrderDocumentNotification } from '@/lib/builder/commerce/notifications-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const documentSchema = z.object({
  type: z.enum(['invoice', 'receipt']),
  email: z.boolean().default(false),
  notes: z.string().trim().max(500).optional(),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } },
) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = documentSchema.parse(await request.json());
    const issued = await issueOrderDocument(params.orderId, {
      type: input.type,
      notes: input.notes,
      actor: 'admin',
    });
    if (!issued.order) return NextResponse.json({ ok: false, error: 'order_not_found' }, { status: 404 });
    if (!issued.document) {
      return NextResponse.json({ ok: false, error: issued.error ?? 'document_issue_failed', order: issued.order }, { status: 400 });
    }

    if (!input.email) {
      return NextResponse.json({ ok: true, order: issued.order, document: issued.document, notification: null });
    }

    const notification = await queueOrderDocumentNotification(issued.order, issued.document);
    const emailed = await markOrderDocumentEmailed(params.orderId, issued.document.documentId, {
      notificationEventId: notification.eventId,
      actor: 'admin',
    });
    return NextResponse.json({
      ok: true,
      order: emailed.order ?? issued.order,
      document: emailed.document ?? issued.document,
      notification,
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    console.error('[builder/commerce/orders/:id/documents] POST failed:', error);
    return NextResponse.json({ ok: false, error: 'document_issue_failed' }, { status: 500 });
  }
}
