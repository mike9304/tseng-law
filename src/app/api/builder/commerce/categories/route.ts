import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import {
  filterProductsByLocale,
  filterProductsByStatus,
  listProductCategories,
  listProducts,
} from '@/lib/builder/commerce/products-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).default('ko'),
  scope: z.enum(['public', 'all']).default('public'),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
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
    if (error instanceof ZodError) return validationError(error);
    console.error('[builder/commerce/categories] GET failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}
