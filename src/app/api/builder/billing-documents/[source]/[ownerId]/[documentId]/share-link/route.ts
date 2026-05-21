import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createBillingDocumentShareLink,
  parseBillingDocumentSource,
  revokeBillingDocumentShareLink,
} from '@/lib/builder/billing-documents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const shareLinkSchema = z.object({
  expiresAt: z.string().trim().datetime().optional(),
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
    const input = shareLinkSchema.parse(await request.json().catch(() => ({})));
    const document = await createBillingDocumentShareLink(source, params.ownerId, params.documentId, {
      expiresAt: input.expiresAt,
    });
    if (!document) return NextResponse.json({ ok: false, error: 'document_not_found' }, { status: 404 });
    return NextResponse.json({ ok: true, document });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    console.error('[builder/billing-documents/share-link] POST failed:', error);
    return NextResponse.json({ ok: false, error: 'share_link_failed' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { source: string; ownerId: string; documentId: string } },
) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  const source = parseBillingDocumentSource(params.source);
  if (!source) return NextResponse.json({ ok: false, error: 'invalid_document_source' }, { status: 400 });

  try {
    const document = await revokeBillingDocumentShareLink(source, params.ownerId, params.documentId);
    if (!document) return NextResponse.json({ ok: false, error: 'document_not_found' }, { status: 404 });
    return NextResponse.json({ ok: true, document });
  } catch (error) {
    console.error('[builder/billing-documents/share-link] DELETE failed:', error);
    return NextResponse.json({ ok: false, error: 'share_link_revoke_failed' }, { status: 500 });
  }
}
