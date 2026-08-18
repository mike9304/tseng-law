import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  getCommerceProductsApiErrorPayload,
  type CommerceProductsApiErrorCode,
} from '@/lib/builder/commerce/products-api-copy';
import {
  archiveProduct,
  deleteProduct,
  duplicateProduct,
  loadProduct,
  saveProduct,
  validateProduct,
} from '@/lib/builder/commerce/products-engine';
import type {
  CommerceInventory,
  CommerceProduct,
} from '@/lib/builder/commerce/products-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const inventoryPatchSchema = z.object({
  trackInventory: z.boolean().optional(),
  quantity: z.coerce.number().int().min(0).max(1000000).optional(),
  lowStockThreshold: z.coerce.number().int().min(0).max(1000000).optional(),
  allowBackorder: z.boolean().optional(),
});

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

const patchSchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).optional(),
  title: z.string().trim().min(1).max(180).optional(),
  slug: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().min(1).max(2000).optional(),
  body: z.string().trim().max(8000).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
  sku: z.string().trim().min(1).max(120).optional(),
  priceCents: z.coerce.number().int().min(0).max(1000000000).optional(),
  compareAtPriceCents: z.coerce.number().int().min(0).max(1000000000).optional(),
  currency: z.enum(['TWD', 'KRW', 'USD']).optional(),
  inventory: inventoryPatchSchema.optional(),
  media: z.array(mediaSchema).max(40).optional(),
  options: z.array(optionSchema).max(6).optional(),
  variants: z.array(variantSchema).max(300).optional(),
  categoryIds: z.array(z.string().trim().min(1).max(120)).max(30).optional(),
  tags: z.array(z.string().trim().min(1).max(80)).max(30).optional(),
  seo: z.object({
    title: z.string().trim().max(180).optional(),
    description: z.string().trim().max(320).optional(),
  }).optional(),
});

const actionSchema = z.object({
  action: z.enum(['duplicate', 'archive']),
});

function mergeInventory(
  base: CommerceInventory,
  patch: Partial<CommerceInventory> | undefined,
): CommerceInventory {
  return patch ? { ...base, ...patch } : base;
}

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

export async function GET(request: NextRequest, props: { params: Promise<{ productId: string }> }) {
  const params = await props.params;
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const scope = request.nextUrl.searchParams.get('scope') ?? 'public';
  if (scope === 'all') {
    const auth = await guardBuilderReadWithPermission(request, 'view-commerce');
    if (auth instanceof NextResponse) return auth;
  }

  try {
    const product = await loadProduct(params.productId);
    if (!product || (scope !== 'all' && product.status !== 'active')) {
      return errorResponse(errorLocale, 'product_not_found', 404);
    }
    return NextResponse.json({ ok: true, product });
  } catch (error) {
    console.error('[builder/commerce/products/:productId] GET failed:', error);
    return commerceError(errorLocale, 'products_failed', error);
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ productId: string }> }) {
  const params = await props.params;
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-commerce' });
  if (auth instanceof NextResponse) return auth;

  try {
    const product = await loadProduct(params.productId);
    if (!product) return errorResponse(errorLocale, 'product_not_found', 404);
    const patch = patchSchema.parse(await request.json());
    const nextProduct: CommerceProduct = {
      ...product,
      ...patch,
      inventory: mergeInventory(product.inventory, patch.inventory),
      variants: patch.variants ?? product.variants,
    };
    const saved = await saveProduct(nextProduct);
    const errors = validateProduct(saved);
    if (errors.length > 0) return errorResponse(errorLocale, 'validation_error', 400, { errors });
    return NextResponse.json({ ok: true, product: saved });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/products/:productId] PATCH failed:', error);
    return commerceError(errorLocale, 'product_save_failed', error);
  }
}

export async function POST(request: NextRequest, props: { params: Promise<{ productId: string }> }) {
  const params = await props.params;
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-commerce' });
  if (auth instanceof NextResponse) return auth;

  try {
    const { action } = actionSchema.parse(await request.json());
    const product = action === 'duplicate'
      ? await duplicateProduct(params.productId)
      : await archiveProduct(params.productId);
    if (!product) return errorResponse(errorLocale, 'product_not_found', 404);
    return NextResponse.json({ ok: true, product }, { status: action === 'duplicate' ? 201 : 200 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/products/:productId] POST failed:', error);
    return commerceError(errorLocale, 'product_action_failed', error);
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ productId: string }> }) {
  const params = await props.params;
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'manage-commerce' });
  if (auth instanceof NextResponse) return auth;
  try {
    await deleteProduct(params.productId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/commerce/products/:productId] DELETE failed:', error);
    return commerceError(errorLocale, 'product_action_failed', error);
  }
}
