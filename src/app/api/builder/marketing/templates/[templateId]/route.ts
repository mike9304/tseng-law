import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { getTemplate, saveTemplate } from '@/lib/builder/marketing/templates/storage';
import {
  renderTemplateToHtml,
  renderTemplateToText,
} from '@/lib/builder/marketing/templates/renderer';
import { templateUpdateSchema, type EmailTemplate } from '@/lib/builder/marketing/templates/types';
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

export async function GET(request: NextRequest, props: { params: Promise<{ templateId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
  try {
    const template = await getTemplate(params.templateId);
    if (!template) return errorResponse(locale, 'template_not_found', 404);
    const renderHtml = request.nextUrl.searchParams.get('render') === 'html';
    if (renderHtml) {
      try {
        return NextResponse.json({
          ok: true,
          template,
          html: renderTemplateToHtml(template),
          text: renderTemplateToText(template),
        });
      } catch (error) {
        console.error('[builder/marketing/templates/:id] render failed:', error);
        return errorResponse(locale, 'template_render_failed', 500);
      }
    }
    return NextResponse.json({ ok: true, template });
  } catch (error) {
    console.error('[builder/marketing/templates/:id] load failed:', error);
    return errorResponse(locale, 'template_load_failed', 500);
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ templateId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'manage-campaigns' });
  if (auth instanceof NextResponse) return auth;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');

  let existing: EmailTemplate | null;
  try {
    existing = await getTemplate(params.templateId);
    if (!existing) return errorResponse(locale, 'template_not_found', 404);
  } catch (error) {
    console.error('[builder/marketing/templates/:id] load failed:', error);
    return errorResponse(locale, 'template_load_failed', 500);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = templateUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_template_update', 400, {
      details: parsed.error.issues.slice(0, 3),
    });
  }
  const merged = {
    ...existing,
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };
  try {
    await saveTemplate(merged);
    return NextResponse.json({ ok: true, template: merged });
  } catch (error) {
    console.error('[builder/marketing/templates/:id] update failed:', error);
    return errorResponse(locale, 'template_update_failed', 500);
  }
}
