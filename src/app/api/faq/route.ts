import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { columnLocaleSchema } from '@/lib/builder/columns/types';
import {
  listFaqCategories,
  listFaqItems,
} from '@/lib/builder/faq/faq-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  locale: columnLocaleSchema.default('ko'),
  category: z.string().trim().max(120).default('all'),
  q: z.string().trim().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const parsed = querySchema.parse({
      locale: sp.get('locale') ?? 'ko',
      category: sp.get('category') ?? 'all',
      q: sp.get('q') ?? undefined,
      limit: sp.get('limit') ?? 50,
    });
    const categories = listFaqCategories();
    const items = await listFaqItems({
      locale: parsed.locale,
      status: 'published',
      categoryId: parsed.category,
      q: parsed.q,
      limit: parsed.limit,
    });

    return NextResponse.json({
      ok: true,
      locale: parsed.locale,
      categories,
      total: items.length,
      items,
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    console.error('[faq] GET failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}
