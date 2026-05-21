import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  listBillingDocuments,
  parseBillingDocumentSource,
  type BillingDocumentSource,
} from '@/lib/builder/billing-documents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).optional(),
  q: z.string().trim().max(200).optional(),
  source: z.enum(['all', 'order', 'booking']).default('all'),
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
    const parsed = querySchema.parse({
      locale: sp.get('locale') ?? undefined,
      q: sp.get('q') ?? undefined,
      source: sp.get('source') ?? 'all',
    });
    const source = parsed.source === 'all'
      ? 'all'
      : parseBillingDocumentSource(parsed.source) as BillingDocumentSource;
    const documents = await listBillingDocuments({
      locale: parsed.locale,
      q: parsed.q,
      source,
    });
    return NextResponse.json({ ok: true, documents, total: documents.length });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    console.error('[builder/billing-documents] GET failed:', error);
    return NextResponse.json({ ok: false, error: 'billing_documents_failed' }, { status: 500 });
  }
}
