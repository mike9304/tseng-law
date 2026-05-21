import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { columnLocaleSchema } from '@/lib/builder/columns/types';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createFaqItem,
  listFaqCategories,
  listFaqItems,
  validateFaqItem,
} from '@/lib/builder/faq/faq-engine';

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
    if (error instanceof ZodError) return validationError(error);
    console.error('[builder/faq] GET failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = faqInputSchema.parse(await request.json());
    const item = await createFaqItem(input);
    const errors = validateFaqItem(item);
    if (errors.length > 0) {
      return NextResponse.json({ ok: false, error: 'validation_error', errors }, { status: 400 });
    }
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    console.error('[builder/faq] POST failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}
