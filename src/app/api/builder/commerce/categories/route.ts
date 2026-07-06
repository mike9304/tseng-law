import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  getCommerceCategoriesApiErrorPayload,
  type CommerceCategoriesApiErrorCode,
} from '@/lib/builder/commerce/categories-api-copy';
import {
  filterProductsByLocale,
  filterProductsByStatus,
  listProductCategories,
  listProducts,
} from '@/lib/builder/commerce/products-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).default('ko'),
  scope: z.enum(['public', 'all']).default('public'),
});

function errorResponse(
  locale: Locale,
  errorCode: CommerceCategoriesApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getCommerceCategoriesApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

export async function GET(request: NextRequest) {
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const parsed = querySchema.parse({
      locale: request.nextUrl.searchParams.get('locale') ?? 'ko',
      scope: request.nextUrl.searchParams.get('scope') ?? 'public',
    });

    if (parsed.scope === 'all') {
      const auth = requireBuilderAdminAuth(request);
      if (auth instanceof NextResponse) return auth;
    }

    const products = filterProductsByLocale(await listProducts(), parsed.locale);
    const visibleProducts = parsed.scope === 'public'
      ? filterProductsByStatus(products, 'active')
      : products;
    const categories = await listProductCategories(parsed.locale, {
      includeHidden: parsed.scope === 'all',
      products: visibleProducts,
    });

    return NextResponse.json({ ok: true, locale: parsed.locale, total: categories.length, categories });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    console.error('[builder/commerce/categories] GET failed:', error);
    return errorResponse(errorLocale, 'categories_failed', 500);
  }
}
