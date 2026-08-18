import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { columnLocaleSchema } from '@/lib/builder/columns/types';
import {
  listFaqCategories,
  listFaqItems,
} from '@/lib/builder/faq/faq-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FAQ_LIST_FAILURE_CODE = 'faq_list_failed';
const FAQ_LIST_FAILURE_MESSAGE = 'Unable to load frequently asked questions right now. Please try again later.';

function errorKind(error: unknown): string {
  if (error && typeof error === 'object' && 'constructor' in error) {
    const constructor = error.constructor;
    if (typeof constructor === 'function' && constructor.name) return constructor.name;
  }
  return 'unknown_error';
}

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
    console.error('[faq] operation failed', FAQ_LIST_FAILURE_CODE, errorKind(error));
    return NextResponse.json(
      {
        ok: false,
        error: FAQ_LIST_FAILURE_CODE,
        code: FAQ_LIST_FAILURE_CODE,
        message: FAQ_LIST_FAILURE_MESSAGE,
      },
      { status: 500 },
    );
  }
}
