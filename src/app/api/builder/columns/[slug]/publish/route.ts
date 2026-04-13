import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { revalidatePath } from 'next/cache';
import {
  readColumnVariant,
  writePublishedColumn,
} from '@/lib/builder/columns/storage';
import { invalidateBlobColumnsCache } from '@/lib/consultation/columns-blob-reader';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

/**
 * POST /api/builder/columns/[slug]/publish?locale=ko
 *
 * Sprint 0 task S0-03: publishes a draft column so it becomes visible
 * on the public site AND indexed by the AI consultant.
 *
 * Flow:
 *   1. Read the draft variant for (locale, slug).
 *   2. Write a published variant (same content, draft=false).
 *   3. Invalidate the in-memory Blob column cache so the AI consultant
 *      picks up the new column on next retrieval (within 5-min TTL, or
 *      immediately if the cache is cleared).
 *   4. Fire-and-forget POST to /api/consultation/build-embeddings so
 *      the new column gets a vector for semantic search. This MUST NOT
 *      block the 200 response — embedding takes ~10s.
 *   5. Best-effort revalidatePath for the column's public page so ISR
 *      picks up the new content on next request.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const slug = params.slug;
  if (!slug || slug.length > 120) {
    return NextResponse.json(
      { success: false, error: 'Invalid slug.' },
      { status: 400 },
    );
  }

  const localeRaw = request.nextUrl.searchParams.get('locale') || 'ko';
  const locale = normalizeLocale(localeRaw);

  const draft = await readColumnVariant(locale, slug, 'draft');
  if (!draft) {
    return NextResponse.json(
      { success: false, error: 'Draft not found for this locale/slug.' },
      { status: 404 },
    );
  }

  const published = await writePublishedColumn({
    ...draft,
    draft: false,
    updatedAt: new Date().toISOString(),
  });

  invalidateBlobColumnsCache(locale);

  // Fire-and-forget embeddings rebuild. The public site origin is
  // needed because this fetch runs server-side (no window.location).
  // We try a few env vars and default to the Vercel auto-URL.
  const origin =
    process.env.NEXT_PUBLIC_SITE_ORIGIN
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
    || `http://localhost:${process.env.PORT || 3000}`;

  fetch(`${origin}/api/consultation/build-embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trigger: 'column-publish', slug, locale }),
  }).catch((err) =>
    console.error('[columns] embeddings rebuild trigger failed:', err),
  );

  // Best-effort ISR revalidation for the column's public page.
  try {
    revalidatePath(`/${locale}/columns/${slug}`);
  } catch {
    // revalidatePath can throw during dev or when the path doesn't
    // exist yet. Swallow — the column will appear on next full build
    // or ISR cycle.
  }

  return NextResponse.json({
    success: true,
    slug: published.slug,
    locale: published.locale,
    revision: published.revision,
    publishedAt: published.updatedAt,
  });
}
