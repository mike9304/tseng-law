import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteFaqItem,
  loadFaqItem,
  saveFaqItem,
  validateFaqItem,
} from '@/lib/builder/faq/faq-engine';
import {
  getBuilderFaqApiErrorPayload,
  type BuilderFaqApiErrorCode,
} from '@/lib/builder/faq/faq-api-copy';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  question: z.string().trim().min(1).max(500).optional(),
  answer: z.string().trim().min(1).max(5000).optional(),
  categoryId: z.string().trim().min(1).max(120).optional(),
  tags: z.array(z.string().trim().max(60)).max(20).optional(),
  status: z.enum(['draft', 'published']).optional(),
  sortOrder: z.coerce.number().int().min(0).max(100000).optional(),
  schemaEnabled: z.boolean().optional(),
  locale: z.string().trim().max(20).optional(),
});

function errorResponse(
  locale: Locale,
  errorCode: BuilderFaqApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderFaqApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function resolveRequestLocale(request: NextRequest, payload?: unknown): Locale {
  const queryLocale = request.nextUrl.searchParams.get('locale') ?? undefined;
  if (isLocale(queryLocale)) return queryLocale;
  if (payload && typeof payload === 'object') {
    const locale = (payload as { locale?: unknown }).locale;
    if (typeof locale === 'string' && isLocale(locale)) return locale;
  }
  return normalizeLocale(queryLocale);
}

export async function GET(request: NextRequest, { params }: { params: { faqId: string } }) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;
  const locale = resolveRequestLocale(request);

  try {
    const item = await loadFaqItem(params.faqId);
    if (!item) return errorResponse(locale, 'faq_not_found', 404);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    console.error('[builder/faq/:faqId] GET failed:', error);
    return errorResponse(locale, 'faq_load_failed', 500);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { faqId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  let errorLocale = resolveRequestLocale(request);
  try {
    const item = await loadFaqItem(params.faqId);
    if (!item) return errorResponse(errorLocale, 'faq_not_found', 404);
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const patch = patchSchema.parse(body);
    const saved = await saveFaqItem({ ...item, ...patch, locale: item.locale });
    const errors = validateFaqItem(saved);
    if (errors.length > 0) {
      return errorResponse(errorLocale, 'validation_error', 400);
    }
    return NextResponse.json({ ok: true, item: saved });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    console.error('[builder/faq/:faqId] PATCH failed:', error);
    return errorResponse(errorLocale, 'faq_update_failed', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { faqId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  const locale = resolveRequestLocale(request);
  try {
    await deleteFaqItem(params.faqId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/faq/:faqId] DELETE failed:', error);
    return errorResponse(locale, 'faq_delete_failed', 500);
  }
}
