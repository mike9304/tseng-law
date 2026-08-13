import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import {
  listBillingDocumentWebhookEvents,
  summarizeBillingDocumentWebhookEvents,
} from '@/lib/builder/billing-document-webhooks';
import { getBuilderBillingDocumentsApiErrorPayload } from '@/lib/builder/billing-documents-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).optional(),
  q: z.string().trim().max(200).optional(),
  status: z.enum(['all', 'processed', 'failed', 'ignored']).default('all'),
});

function validationError(locale: Locale, error: ZodError): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderBillingDocumentsApiErrorPayload(locale, 'validation_error'),
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'view-commerce');
  if (auth instanceof NextResponse) return auth;

  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const sp = request.nextUrl.searchParams;
    const input = querySchema.parse({
      locale: sp.get('locale') ?? undefined,
      q: sp.get('q') ?? undefined,
      status: sp.get('status') ?? 'all',
    });
    const events = await listBillingDocumentWebhookEvents({
      q: input.q,
      status: input.status,
    });
    return NextResponse.json({
      ok: true,
      events,
      kpis: summarizeBillingDocumentWebhookEvents(events),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    console.error('[builder/billing-documents/webhooks] GET failed:', error);
    return NextResponse.json(
      { ok: false, ...getBuilderBillingDocumentsApiErrorPayload(errorLocale, 'billing_document_webhooks_failed') },
      { status: 500 },
    );
  }
}
