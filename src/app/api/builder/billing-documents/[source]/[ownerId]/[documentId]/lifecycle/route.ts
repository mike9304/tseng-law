import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  parseBillingDocumentSource,
  supersedeBuilderBillingDocument,
  voidBuilderBillingDocument,
} from '@/lib/builder/billing-documents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const lifecycleSchema = z.object({
  action: z.enum(['void', 'supersede']),
  reason: z.string().trim().max(500).optional(),
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
  { params }: { params: { source: string; ownerId: string; documentId: string } },
) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  const source = parseBillingDocumentSource(params.source);
  if (!source) return NextResponse.json({ ok: false, error: 'invalid_document_source' }, { status: 400 });

  try {
    const input = lifecycleSchema.parse(await request.json().catch(() => ({})));
    if (input.action === 'void') {
      const document = await voidBuilderBillingDocument(source, params.ownerId, params.documentId, {
        reason: input.reason,
      });
      if (!document) return NextResponse.json({ ok: false, error: 'document_lifecycle_unavailable' }, { status: 404 });
      return NextResponse.json({ ok: true, document });
    }

    const result = await supersedeBuilderBillingDocument(source, params.ownerId, params.documentId, {
      notes: input.notes,
      reason: input.reason,
    });
    if (!result.document || !result.supersededDocument) {
      return NextResponse.json({ ok: false, error: 'document_lifecycle_unavailable' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, document: result.document, supersededDocument: result.supersededDocument });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    console.error('[builder/billing-documents/lifecycle] POST failed:', error);
    return NextResponse.json({ ok: false, error: 'document_lifecycle_failed' }, { status: 500 });
  }
}
