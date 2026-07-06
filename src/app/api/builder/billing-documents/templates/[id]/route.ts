import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteBillingDocumentTemplate,
  getBillingDocumentTemplate,
  updateBillingDocumentTemplate,
} from '@/lib/builder/billing-documents-templates';
import { getBuilderBillingDocumentsApiErrorPayload } from '@/lib/builder/billing-documents-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  language: z.enum(['ko', 'en', 'zh-hant']).optional(),
  headerHtml: z.string().max(4000).optional(),
  footerHtml: z.string().max(4000).optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  logoAssetId: z.string().trim().max(200).nullable().optional(),
  includeQrCode: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

function validationError(locale: Locale, error: ZodError): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderBillingDocumentsApiErrorPayload(locale, 'invalid_template_payload'),
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  try {
    const template = await getBillingDocumentTemplate(params.id);
    if (!template) {
      return NextResponse.json(
        { ok: false, ...getBuilderBillingDocumentsApiErrorPayload(errorLocale, 'template_not_found') },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, template });
  } catch (error) {
    console.error('[builder/billing-documents/templates/:id] GET failed:', error);
    return NextResponse.json(
      { ok: false, ...getBuilderBillingDocumentsApiErrorPayload(errorLocale, 'template_load_failed') },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  try {
    const raw = await request.json().catch(() => ({}));
    const input = patchSchema.parse(raw);
    const template = await updateBillingDocumentTemplate(params.id, {
      ...input,
      logoAssetId: input.logoAssetId === undefined ? undefined : input.logoAssetId,
    });
    if (!template) {
      return NextResponse.json(
        { ok: false, ...getBuilderBillingDocumentsApiErrorPayload(errorLocale, 'template_not_found') },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, template });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    console.error('[builder/billing-documents/templates/:id] PATCH failed:', error);
    return NextResponse.json(
      { ok: false, ...getBuilderBillingDocumentsApiErrorPayload(errorLocale, 'template_update_failed') },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  try {
    const ok = await deleteBillingDocumentTemplate(params.id);
    if (!ok) {
      return NextResponse.json(
        { ok: false, ...getBuilderBillingDocumentsApiErrorPayload(errorLocale, 'template_not_found') },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/billing-documents/templates/:id] DELETE failed:', error);
    return NextResponse.json(
      { ok: false, ...getBuilderBillingDocumentsApiErrorPayload(errorLocale, 'template_delete_failed') },
      { status: 500 },
    );
  }
}
