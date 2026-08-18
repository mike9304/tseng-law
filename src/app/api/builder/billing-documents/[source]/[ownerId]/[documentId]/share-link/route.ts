import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createBillingDocumentShareLink,
  parseBillingDocumentSource,
  revokeBillingDocumentShareLink,
} from '@/lib/builder/billing-documents';
import {
  getBuilderBillingDocumentsApiErrorPayload,
  type BuilderBillingDocumentsApiErrorCode,
} from '@/lib/builder/billing-documents-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const shareLinkSchema = z.object({
  expiresAt: z.string().trim().datetime().optional(),
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
      ...getBuilderBillingDocumentsApiErrorPayload(locale, 'invalid_share_link_payload'),
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
    const input = shareLinkSchema.parse(await request.json().catch(() => ({})));
    const document = await createBillingDocumentShareLink(source, params.ownerId, params.documentId, {
      expiresAt: input.expiresAt,
    });
    if (!document) return errorResponse(errorLocale, 'document_not_found', 404);
    return NextResponse.json({ ok: true, document });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    console.error('[builder/billing-documents/share-link] POST failed:', error);
    return errorResponse(errorLocale, 'share_link_failed', 500);
  }
}

export async function DELETE(
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
    const document = await revokeBillingDocumentShareLink(source, params.ownerId, params.documentId);
    if (!document) return errorResponse(errorLocale, 'document_not_found', 404);
    return NextResponse.json({ ok: true, document });
  } catch (error) {
    console.error('[builder/billing-documents/share-link] DELETE failed:', error);
    return errorResponse(errorLocale, 'share_link_revoke_failed', 500);
  }
}
