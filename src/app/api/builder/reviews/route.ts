import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  readReviewsForMutation,
  writeReviews,
  type Review,
} from '@/lib/reviews/storage';
import {
  guardBuilderReadWithPermission,
  guardMutation,
} from '@/lib/builder/security/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const statusSchema = z.enum(['approved', 'pending']);
const listStatusSchema = z.enum(['all', 'approved', 'pending']).default('all');
const patchSchema = z.object({
  id: z.string().trim().min(1),
  status: statusSchema,
});
const deleteSchema = z.object({
  id: z.string().trim().min(1),
});

function sortReviews(reviews: readonly Review[]): Review[] {
  return [...reviews].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'manage-forms');
  if (auth instanceof NextResponse) return auth;

  const status = listStatusSchema.parse(request.nextUrl.searchParams.get('status') ?? 'all');
  try {
    const reviews = sortReviews(await readReviewsForMutation());
    const filtered = status === 'all'
      ? reviews
      : reviews.filter((review) => review.status === status);
    return NextResponse.json({ ok: true, reviews: filtered, total: filtered.length });
  } catch (error) {
    console.error('[builder/reviews] GET failed:', error);
    return NextResponse.json(
      { ok: false, error: 'reviews_load_failed', message: errorMessage(error) },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-forms' });
  if (auth instanceof NextResponse) return auth;

  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_review_update' }, { status: 400 });
  }

  try {
    const reviews = await readReviewsForMutation();
    const index = reviews.findIndex((review) => review.id === parsed.data.id);
    if (index < 0) {
      return NextResponse.json({ ok: false, error: 'review_not_found' }, { status: 404 });
    }

    const review = { ...reviews[index], status: parsed.data.status };
    const nextReviews = reviews.map((item, itemIndex) => (itemIndex === index ? review : item));
    await writeReviews(nextReviews);
    return NextResponse.json({ ok: true, review });
  } catch (error) {
    console.error('[builder/reviews] PATCH failed:', error);
    return NextResponse.json(
      { ok: false, error: 'review_update_failed', message: errorMessage(error) },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'manage-forms' });
  if (auth instanceof NextResponse) return auth;

  const parsed = deleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_review_delete' }, { status: 400 });
  }

  try {
    const reviews = await readReviewsForMutation();
    const nextReviews = reviews.filter((review) => review.id !== parsed.data.id);
    if (nextReviews.length === reviews.length) {
      return NextResponse.json({ ok: false, error: 'review_not_found' }, { status: 404 });
    }

    await writeReviews(nextReviews);
    return NextResponse.json({ ok: true, id: parsed.data.id });
  } catch (error) {
    console.error('[builder/reviews] DELETE failed:', error);
    return NextResponse.json(
      { ok: false, error: 'review_delete_failed', message: errorMessage(error) },
      { status: 500 },
    );
  }
}
