import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  parseBillingDocumentSource,
  supersedeBuilderBillingDocument,
  voidBuilderBillingDocument,
} from '@/lib/builder/billing-documents';
import {
  getBuilderBillingDocumentsApiErrorPayload,
  type BuilderBillingDocumentsApiErrorCode,
} from '@/lib/builder/billing-documents-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const lifecycleSchema = z.object({
  action: z.enum(['void', 'supersede']),
  reason: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(500).optional(),
});

function errorResponse(
  locale: Locale,
  errorCode: BuilderBillingDocumentsApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderBillingDocumentsApiErrorPayload(locale, errorCode) },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderBillingDocumentsApiErrorPayload(locale, 'invalid_document_lifecycle_payload'),
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ source: string; ownerId: string; documentId: string }> }
) {
  const params = await props.params;
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-commerce' });
  if (auth instanceof NextResponse) return auth;

  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const source = parseBillingDocumentSource(params.source);
  if (!source) return errorResponse(errorLocale, 'invalid_document_source', 400);

  try {
    const input = lifecycleSchema.parse(await request.json().catch(() => ({})));
    if (input.action === 'void') {
      const document = await voidBuilderBillingDocument(source, params.ownerId, params.documentId, {
        reason: input.reason,
      });
      if (!document) return errorResponse(errorLocale, 'document_lifecycle_unavailable', 404);
      return NextResponse.json({ ok: true, document });
    }

    const result = await supersedeBuilderBillingDocument(source, params.ownerId, params.documentId, {
      notes: input.notes,
      reason: input.reason,
    });
    if (!result.document || !result.supersededDocument) {
      return errorResponse(errorLocale, 'document_lifecycle_unavailable', 404);
    }
    return NextResponse.json({ ok: true, document: result.document, supersededDocument: result.supersededDocument });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    console.error('[builder/billing-documents/lifecycle] POST failed:', error);
    return errorResponse(errorLocale, 'document_lifecycle_failed', 500);
  }
}
