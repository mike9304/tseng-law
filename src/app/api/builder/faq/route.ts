import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { columnLocaleSchema } from '@/lib/builder/columns/types';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  createFaqItem,
  listFaqCategories,
  listFaqItems,
  validateFaqItem,
} from '@/lib/builder/faq/faq-engine';
import {
  getBuilderFaqApiErrorPayload,
  type BuilderFaqApiErrorCode,
} from '@/lib/builder/faq/faq-api-copy';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  locale: columnLocaleSchema.default('ko'),
  status: z.enum(['all', 'draft', 'published']).default('all'),
  category: z.string().trim().max(120).default('all'),
  q: z.string().trim().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(200),
});

const faqInputSchema = z.object({
  locale: columnLocaleSchema.default('ko'),
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1).max(5000),
  categoryId: z.string().trim().min(1).max(120),
  tags: z.array(z.string().trim().max(60)).max(20).default([]),
  status: z.enum(['draft', 'published']).default('published'),
  sortOrder: z.coerce.number().int().min(0).max(100000).default(1000),
  schemaEnabled: z.boolean().default(true),
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

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'edit-pages');
  if (auth instanceof NextResponse) return auth;
  const locale = resolveRequestLocale(request);

  try {
    const sp = request.nextUrl.searchParams;
    const parsed = querySchema.parse({
      locale: sp.get('locale') ?? 'ko',
      status: sp.get('status') ?? 'all',
      category: sp.get('category') ?? 'all',
      q: sp.get('q') ?? undefined,
      limit: sp.get('limit') ?? 200,
    });
    const items = await listFaqItems({
      locale: parsed.locale,
      status: parsed.status,
      categoryId: parsed.category,
      q: parsed.q,
      limit: parsed.limit,
    });
    return NextResponse.json({
      ok: true,
      locale: parsed.locale,
      categories: listFaqCategories(),
      total: items.length,
      items,
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(locale, error);
    console.error('[builder/faq] GET failed:', error);
    return errorResponse(locale, 'faq_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  let errorLocale = resolveRequestLocale(request);
  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const input = faqInputSchema.parse(body);
    const item = await createFaqItem(input);
    const errors = validateFaqItem(item);
    if (errors.length > 0) {
      return errorResponse(errorLocale, 'validation_error', 400);
    }
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    console.error('[builder/faq] POST failed:', error);
    return errorResponse(errorLocale, 'faq_create_failed', 500);
  }
}
