import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createBillingDocumentTemplate,
  listBillingDocumentTemplates,
} from '@/lib/builder/billing-documents-templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createSchema = z.object({
  name: z.string().trim().min(1).max(120),
  language: z.enum(['ko', 'en', 'zh-hant']),
  headerHtml: z.string().max(4000).optional().default(''),
  footerHtml: z.string().max(4000).optional().default(''),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  logoAssetId: z.string().trim().max(200).nullable().optional(),
  includeQrCode: z.boolean().optional().default(false),
  isDefault: z.boolean().optional().default(false),
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
    const templates = await listBillingDocumentTemplates();
    return NextResponse.json({ ok: true, templates, total: templates.length });
  } catch (error) {
    console.error('[builder/billing-documents/templates] GET failed:', error);
    return NextResponse.json({ ok: false, error: 'templates_list_failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  try {
    const raw = await request.json().catch(() => ({}));
    const input = createSchema.parse(raw);
    const template = await createBillingDocumentTemplate({
      name: input.name,
      language: input.language,
      headerHtml: input.headerHtml,
      footerHtml: input.footerHtml,
      accentColor: input.accentColor,
      logoAssetId: input.logoAssetId ?? undefined,
      includeQrCode: input.includeQrCode,
      isDefault: input.isDefault,
    });
    return NextResponse.json({ ok: true, template }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    console.error('[builder/billing-documents/templates] POST failed:', error);
    return NextResponse.json({ ok: false, error: 'template_create_failed' }, { status: 500 });
  }
}