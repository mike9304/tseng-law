import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getCommerceProductsApiErrorPayload,
  type CommerceProductsApiErrorCode,
} from '@/lib/builder/commerce/products-api-copy';
import {
  createProduct,
  filterProductsByCategory,
  filterProductsByLocale,
  filterProductsByStatus,
  listProducts,
  loadProduct,
  saveProduct,
  searchProducts,
  sortProducts,
  validateProduct,
} from '@/lib/builder/commerce/products-engine';
import type { CommerceProduct } from '@/lib/builder/commerce/products-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const localeSchema = z.enum(['ko', 'zh-hant', 'en']).default('ko');
const currencySchema = z.enum(['TWD', 'KRW', 'USD']).default('TWD');

const inventorySchema = z.object({
  trackInventory: z.boolean().default(false),
  quantity: z.coerce.number().int().min(0).max(1000000).default(0),
  lowStockThreshold: z.coerce.number().int().min(0).max(1000000).default(0),
  allowBackorder: z.boolean().default(false),
});

const mediaSchema = z.object({
  mediaId: z.string().trim().max(120).default(''),
  type: z.enum(['image', 'video']).default('image'),
  url: z.string().trim().min(1).max(2000),
  alt: z.string().trim().max(240).default('Product image'),
  caption: z.string().trim().max(240).optional(),
  sortOrder: z.coerce.number().int().min(0).max(100000).default(0),
});

const optionSchema = z.object({
  optionId: z.string().trim().max(80).default(''),
  name: z.string().trim().min(1).max(80),
  values: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
});

const variantSchema = z.object({
  variantId: z.string().trim().max(120).default(''),
  title: z.string().trim().max(180).default(''),
  sku: z.string().trim().max(120).default(''),
  optionValues: z.record(z.string().trim().max(80), z.string().trim().max(80)).default({}),
  priceCents: z.coerce.number().int().min(0).max(1000000000).default(0),
  compareAtPriceCents: z.coerce.number().int().min(0).max(1000000000).optional(),
  inventory: inventorySchema.default({
    trackInventory: false,
    quantity: 0,
    lowStockThreshold: 0,
    allowBackorder: false,
  }),
  mediaId: z.string().trim().max(120).optional(),
  status: z.enum(['active', 'disabled']).default('active'),
});

const productInputSchema = z.object({
  locale: localeSchema,
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(120).optional(),
  description: z.string().trim().min(1).max(2000),
  body: z.string().trim().max(8000).default(''),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  sku: z.string().trim().min(1).max(120),
  priceCents: z.coerce.number().int().min(0).max(1000000000),
  compareAtPriceCents: z.coerce.number().int().min(0).max(1000000000).optional(),
  currency: currencySchema,
  inventory: inventorySchema.default({
    trackInventory: false,
    quantity: 0,
    lowStockThreshold: 0,
    allowBackorder: false,
  }),
  media: z.array(mediaSchema).max(40).default([]),
  options: z.array(optionSchema).max(6).default([]),
  variants: z.array(variantSchema).max(300).default([]),
  categoryIds: z.array(z.string().trim().min(1).max(120)).max(30).default([]),
  tags: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
  seo: z.object({
    title: z.string().trim().max(180).optional(),
    description: z.string().trim().max(320).optional(),
  }).default({}),
});

const querySchema = z.object({
  locale: localeSchema,
  scope: z.enum(['public', 'all']).default('public'),
  status: z.enum(['all', 'draft', 'active', 'archived']).default('active'),
  category: z.string().trim().max(120).optional(),
  q: z.string().trim().max(200).optional(),
  sort: z.enum(['updated-desc', 'title-asc', 'price-asc', 'price-desc']).default('updated-desc'),
  limit: z.coerce.number().int().min(1).max(500).default(100),
});

const bulkPatchSchema = z.object({
  productIds: z.array(z.string().trim().min(1).max(120)).min(1).max(200),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  categoryIds: z.array(z.string().trim().min(1).max(120)).max(30).optional(),
});

function errorResponse(
  locale: Locale,
  errorCode: CommerceProductsApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getCommerceProductsApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function isSkuConflictError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const { message } = error;
  return message.startsWith('commerce_product_sku_conflict:');
}

function commerceError(locale: Locale, fallbackCode: CommerceProductsApiErrorCode, error: unknown): NextResponse {
  if (isSkuConflictError(error)) {
    return errorResponse(locale, 'sku_conflict', 409);
  }
  return errorResponse(locale, fallbackCode, 500);
}

export async function GET(request: NextRequest) {
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const sp = request.nextUrl.searchParams;
    const parsed = querySchema.parse({
      locale: sp.get('locale') ?? 'ko',
      scope: sp.get('scope') ?? 'public',
      status: sp.get('status') ?? (sp.get('scope') === 'all' ? 'all' : 'active'),
      category: sp.get('category') ?? undefined,
      q: sp.get('q') ?? undefined,
      sort: sp.get('sort') ?? 'updated-desc',
      limit: sp.get('limit') ?? 100,
    });

    if (parsed.scope === 'all') {
      const auth = requireBuilderAdminAuth(request);
      if (auth instanceof NextResponse) return auth;
    }

    let products = await listProducts();
    products = filterProductsByLocale(products, parsed.locale);
    products = filterProductsByStatus(products, parsed.scope === 'public' ? 'active' : parsed.status);
    products = filterProductsByCategory(products, parsed.category);
    products = searchProducts(products, parsed.q);
    const total = products.length;
    products = sortProducts(products, parsed.sort).slice(0, parsed.limit);

    return NextResponse.json({ ok: true, locale: parsed.locale, total, products });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    console.error('[builder/commerce/products] GET failed:', error);
    return commerceError(errorLocale, 'products_failed', error);
  }
}

export async function POST(request: NextRequest) {
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = productInputSchema.parse(await request.json());
    const product = await createProduct(input);
    const errors = validateProduct(product);
    if (errors.length > 0) return errorResponse(errorLocale, 'validation_error', 400, { errors });
    return NextResponse.json({ ok: true, product }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/products] POST failed:', error);
    return commerceError(errorLocale, 'product_save_failed', error);
  }
}

export async function PATCH(request: NextRequest) {
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = bulkPatchSchema.parse(await request.json());
    const products: CommerceProduct[] = [];
    for (const productId of input.productIds) {
      const product = await loadProduct(productId);
      if (!product) continue;
      products.push(await saveProduct({
        ...product,
        ...(input.status ? { status: input.status } : {}),
        ...(input.categoryIds ? { categoryIds: input.categoryIds } : {}),
      }));
    }
    return NextResponse.json({ ok: true, products, updated: products.length });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/products] PATCH failed:', error);
    return commerceError(errorLocale, 'product_bulk_update_failed', error);
  }
}
