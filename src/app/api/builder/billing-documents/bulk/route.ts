import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  bulkExportCsv,
  bulkIssueInvoicesForOrders,
  bulkVoidDocuments,
  parseBulkDocumentIds,
} from '@/lib/builder/billing-documents-bulk';
import {
  getBuilderBillingDocumentsApiErrorPayload,
  type BuilderBillingDocumentsApiErrorCode,
} from '@/lib/builder/billing-documents-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const targetSchema = z.object({
  source: z.enum(['order', 'booking']),
  ownerId: z.string().trim().min(1).max(200),
  documentId: z.string().trim().min(1).max(200).optional(),
});

const idsSchema = z.array(z.union([z.string().trim().min(3).max(600), targetSchema])).min(1).max(200);

const filterSchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).optional(),
  source: z.enum(['all', 'order', 'booking']).optional(),
  q: z.string().trim().max(200).optional(),
}).optional();

const localeProbeSchema = z.object({
  filter: z.object({
    locale: z.enum(['ko', 'zh-hant', 'en']).optional(),
  }).optional(),
}).optional();

const bodySchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('issue-invoice'),
    ids: idsSchema,
    notes: z.string().trim().max(500).optional(),
  }),
  z.object({
    action: z.literal('void'),
    ids: idsSchema,
    reason: z.string().trim().min(1).max(500),
  }),
  z.object({
    action: z.literal('export-csv'),
    filter: filterSchema,
  }),
]);

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
      ...getBuilderBillingDocumentsApiErrorPayload(locale, 'invalid_bulk_operation_payload'),
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

function localeFromBody(raw: unknown): Locale | undefined {
  const result = localeProbeSchema.safeParse(raw);
  return result.success ? result.data?.filter?.locale : undefined;
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'publish' });
  if (auth instanceof NextResponse) return auth;

  let errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const raw = await request.json().catch(() => ({}));
    errorLocale = normalizeLocale(
      request.nextUrl.searchParams.get('locale') ?? localeFromBody(raw),
    );
    const input = bodySchema.parse(raw);

    if (input.action === 'issue-invoice') {
      const targets = parseBulkDocumentIds(input.ids);
      if (targets.length === 0) {
        return errorResponse(errorLocale, 'no_valid_targets', 400);
      }
      const result = await bulkIssueInvoicesForOrders(targets, { notes: input.notes });
      return NextResponse.json({
        ok: true,
        action: 'issue-invoice',
        issued: result.issued,
        skipped: result.skipped,
        errors: result.errors,
        counts: {
          issued: result.issued.length,
          skipped: result.skipped.length,
          errors: result.errors.length,
        },
      });
    }

    if (input.action === 'void') {
      const targets = parseBulkDocumentIds(input.ids);
      if (targets.length === 0) {
        return errorResponse(errorLocale, 'no_valid_targets', 400);
      }
      const result = await bulkVoidDocuments(targets, input.reason);
      return NextResponse.json({
        ok: true,
        action: 'void',
        voided: result.voided,
        skipped: result.skipped,
        errors: result.errors,
        counts: {
          voided: result.voided.length,
          skipped: result.skipped.length,
          errors: result.errors.length,
        },
      });
    }

    const csv = await bulkExportCsv(input.filter ?? {});
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="billing-documents-${new Date().toISOString().slice(0, 10)}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    console.error('[builder/billing-documents/bulk] POST failed:', error);
    return errorResponse(errorLocale, 'bulk_operation_failed', 500);
  }
}
