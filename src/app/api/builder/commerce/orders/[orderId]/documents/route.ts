import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getCommerceOrdersApiErrorPayload,
  type CommerceOrdersApiErrorCode,
} from '@/lib/builder/commerce/orders-api-copy';
import { issueOrderDocument, markOrderDocumentEmailed } from '@/lib/builder/commerce/orders-engine';
import { queueOrderDocumentNotification } from '@/lib/builder/commerce/notifications-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const documentSchema = z.object({
  type: z.enum(['invoice', 'receipt']),
  email: z.boolean().default(false),
  notes: z.string().trim().max(500).optional(),
});

const documentErrorCodes = new Set<CommerceOrdersApiErrorCode>([
  'order_not_found',
  'document_type_invalid',
  'receipt_requires_paid_order',
  'document_issue_failed',
]);

function documentErrorCode(error?: string): CommerceOrdersApiErrorCode {
  return documentErrorCodes.has(error as CommerceOrdersApiErrorCode)
    ? error as CommerceOrdersApiErrorCode
    : 'document_issue_failed';
}

function errorResponse(
  locale: Locale,
  errorCode: CommerceOrdersApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getCommerceOrdersApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

export async function POST(request: NextRequest, props: { params: Promise<{ orderId: string }> }) {
  const params = await props.params;
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-commerce' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = documentSchema.parse(await request.json());
    const issued = await issueOrderDocument(params.orderId, {
      type: input.type,
      notes: input.notes,
      actor: 'admin',
    });
    if (!issued.order) return errorResponse(errorLocale, 'order_not_found', 404);
    if (!issued.document) {
      return errorResponse(errorLocale, documentErrorCode(issued.error), 400, { order: issued.order });
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
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/orders/:id/documents] POST failed:', error);
    return errorResponse(errorLocale, 'document_issue_failed', 500);
  }
}
