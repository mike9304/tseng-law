import { NextRequest, NextResponse } from 'next/server';
import {
  billingManualPaymentInstructionsForTarget,
  loadBillingDocumentAutomationSettings,
  type BillingAutomationTarget,
  type BillingManualPaymentInstructionEntry,
} from '@/lib/builder/billing-document-automation';
import {
  type BuilderBillingDocumentRow,
  getBillingDocument,
  parseBillingDocumentSource,
  renderBillingDocumentHtml,
  renderBillingDocumentPdf,
  trackBillingDocumentAccess,
  validateBillingDocumentShareToken,
} from '@/lib/builder/billing-documents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function manualInstructionsForTarget(target: BillingAutomationTarget): Promise<BillingManualPaymentInstructionEntry[]> {
  const settings = await loadBillingDocumentAutomationSettings();
  return billingManualPaymentInstructionsForTarget(settings, target);
}

function unavailableDocumentResponse(document: BuilderBillingDocumentRow): NextResponse {
  const message = document.shareStatus === 'revoked'
    ? 'This document link has been revoked. Ask the sender for a new link.'
    : 'This document link has expired. Ask the sender for a new link.';
  return new NextResponse(`<!doctype html>
<html lang="${document.locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Document link unavailable</title>
  <style>
    body { margin: 0; background: #f8fafc; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    main { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
    section { max-width: 520px; border: 1px solid #dbe4ee; border-radius: 10px; background: #fff; padding: 28px; box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08); }
    h1 { margin: 0 0 10px; font-size: 24px; }
    p { margin: 0; color: #475569; line-height: 1.6; overflow-wrap: anywhere; }
  </style>
</head>
<body>
  <main><section><h1>Document link unavailable</h1><p>${message}</p></section></main>
</body>
</html>`, {
    status: 410,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { source: string; ownerId: string; documentId: string } },
) {
  const source = parseBillingDocumentSource(params.source);
  if (!source) {
    return NextResponse.json({ ok: false, error: 'invalid_document_source' }, { status: 400 });
  }

  const document = await getBillingDocument(source, params.ownerId, params.documentId);
  if (!document) {
    return NextResponse.json({ ok: false, error: 'document_not_found' }, { status: 404 });
  }
  if (document.shareStatus === 'expired' || document.shareStatus === 'revoked') {
    return unavailableDocumentResponse(document);
  }
  if (!validateBillingDocumentShareToken(document, request.nextUrl.searchParams.get('token'))) {
    return NextResponse.json({ ok: false, error: 'invalid_document_token' }, { status: 403 });
  }

  if (request.nextUrl.searchParams.get('format') === 'pdf') {
    await trackBillingDocumentAccess(source, params.ownerId, params.documentId, 'downloaded');
    const manualInstructions = await manualInstructionsForTarget(source === 'order' ? 'orders' : 'bookings');
    const pdf = renderBillingDocumentPdf(document, { manualInstructions });
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/pdf',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }

  await trackBillingDocumentAccess(source, params.ownerId, params.documentId, 'viewed');
  const manualInstructions = await manualInstructionsForTarget(source === 'order' ? 'orders' : 'bookings');
  return new NextResponse(renderBillingDocumentHtml(document, { manualInstructions }), {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
