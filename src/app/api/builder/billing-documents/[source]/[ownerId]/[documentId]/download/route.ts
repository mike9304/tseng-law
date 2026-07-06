import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  billingManualPaymentInstructionsForTarget,
  loadBillingDocumentAutomationSettings,
  type BillingAutomationTarget,
  type BillingManualPaymentInstructionEntry,
} from '@/lib/builder/billing-document-automation';
import {
  billingDocumentFileName,
  getBillingDocument,
  parseBillingDocumentSource,
  renderBillingDocumentHtml,
  renderBillingDocumentPdf,
  trackBillingDocumentAccess,
} from '@/lib/builder/billing-documents';
import {
  getBuilderBillingDocumentsApiErrorPayload,
  type BuilderBillingDocumentsApiErrorCode,
} from '@/lib/builder/billing-documents-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function manualInstructionsForTarget(target: BillingAutomationTarget): Promise<BillingManualPaymentInstructionEntry[]> {
  const settings = await loadBillingDocumentAutomationSettings();
  return billingManualPaymentInstructionsForTarget(settings, target);
}

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

export async function GET(
  request: NextRequest,
  { params }: { params: { source: string; ownerId: string; documentId: string } },
) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const source = parseBillingDocumentSource(params.source);
  if (!source) {
    return errorResponse(errorLocale, 'invalid_document_source', 400);
  }

  const document = await getBillingDocument(source, params.ownerId, params.documentId);
  if (!document) {
    return errorResponse(errorLocale, 'document_not_found', 404);
  }

  const format = request.nextUrl.searchParams.get('format') === 'html' ? 'html' : 'pdf';
  await trackBillingDocumentAccess(source, params.ownerId, params.documentId, 'downloaded');
  const manualInstructions = await manualInstructionsForTarget(source === 'order' ? 'orders' : 'bookings');
  if (format === 'html') {
    return new NextResponse(renderBillingDocumentHtml(document, { manualInstructions }), {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Disposition': `attachment; filename="${billingDocumentFileName(document, 'html')}"`,
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }

  const pdf = renderBillingDocumentPdf(document, { manualInstructions });
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Disposition': `attachment; filename="${billingDocumentFileName(document, 'pdf')}"`,
      'Content-Type': 'application/pdf',
    },
  });
}
