import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
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

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

function commerceError(error: unknown): NextResponse {
  if (error instanceof Error && error.message.startsWith('commerce_product_sku_conflict:')) {
    return NextResponse.json({ ok: false, error: 'sku_conflict', message: error.message }, { status: 409 });
  }
  return NextResponse.json(
    { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
    { status: 500 },
  );
}

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
  const scope = request.nextUrl.searchParams.get('scope') ?? 'public';
  if (scope === 'all') {
    const auth = requireBuilderAdminAuth(request);
    if (auth instanceof NextResponse) return auth;
  }

  const product = await loadProduct(params.productId);
  if (!product || (scope !== 'all' && product.status !== 'active')) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, product });
}

export async function PATCH(request: NextRequest, { params }: { params: { productId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const product = await loadProduct(params.productId);
    if (!product) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    const patch = patchSchema.parse(await request.json());
    const nextProduct: CommerceProduct = {
      ...product,
      ...patch,
      inventory: mergeInventory(product.inventory, patch.inventory),
      variants: patch.variants ?? product.variants,
    };
    const saved = await saveProduct(nextProduct);
    const errors = validateProduct(saved);
    if (errors.length > 0) return NextResponse.json({ ok: false, error: 'validation_error', errors }, { status: 400 });
    return NextResponse.json({ ok: true, product: saved });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    console.error('[builder/commerce/products/:productId] PATCH failed:', error);
    return commerceError(error);
  }
}

export async function POST(request: NextRequest, { params }: { params: { productId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const { action } = actionSchema.parse(await request.json());
    const product = action === 'duplicate'
      ? await duplicateProduct(params.productId)
      : await archiveProduct(params.productId);
    if (!product) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true, product }, { status: action === 'duplicate' ? 201 : 200 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    console.error('[builder/commerce/products/:productId] POST failed:', error);
    return commerceError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { productId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  await deleteProduct(params.productId);
  return NextResponse.json({ ok: true });
}
