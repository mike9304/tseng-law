import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  listTemplates,
  makeTemplateId,
  saveTemplate,
} from '@/lib/builder/marketing/templates/storage';
import { templateCreateSchema, type EmailTemplate } from '@/lib/builder/marketing/templates/types';
import {
  getBuilderMarketingApiErrorPayload,
  type BuilderMarketingApiErrorCode,
} from '@/lib/builder/marketing/marketing-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BuilderMarketingApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderMarketingApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  try {
    const templates = await listTemplates();
    return NextResponse.json({ ok: true, templates, total: templates.length });
  } catch (error) {
    console.error('[builder/marketing/templates] list failed:', error);
    return errorResponse(locale, 'templates_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = templateCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_template_payload', 400, {
      details: parsed.error.issues.slice(0, 3),
    });
  }
  const now = new Date().toISOString();
  const template: EmailTemplate = {
    templateId: makeTemplateId(),
    name: parsed.data.name,
    description: parsed.data.description,
    category: parsed.data.category,
    blocks: parsed.data.blocks,
    pageBackground: parsed.data.pageBackground,
    contentBackground: parsed.data.contentBackground,
    createdAt: now,
    updatedAt: now,
  };
  try {
    await saveTemplate(template);
    return NextResponse.json({ ok: true, template }, { status: 201 });
  } catch (error) {
    console.error('[builder/marketing/templates] create failed:', error);
    return errorResponse(locale, 'template_create_failed', 500);
  }
}
