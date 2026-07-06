import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { revalidatePath } from 'next/cache';
import { recordColumnEvent } from '@/lib/builder/audit/record';
import {
  getBuilderColumnsApiErrorPayload,
  type BuilderColumnsApiErrorCode,
} from '@/lib/builder/columns/columns-api-copy';
import {
  deletePublishedColumn,
  readColumnVariant,
  writePublishedColumn,
} from '@/lib/builder/columns/storage';
import { columnSlugSchema } from '@/lib/builder/columns/types';
import { applyRecordSlugRedirect } from '@/lib/builder/dynamic-record-redirect-lifecycle';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { invalidateBlobColumnsCache } from '@/lib/consultation/columns-blob-reader';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

function errorResponse(
  locale: Locale,
  errorCode: BuilderColumnsApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, success: false, ...getBuilderColumnsApiErrorPayload(locale, errorCode) },
    { status },
  );
}

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
  const auth = await guardMutation(request, { bucket: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const slug = params.slug;
  const localeRaw = request.nextUrl.searchParams.get('locale') || 'ko';
  const locale = normalizeLocale(localeRaw);

  // Validate the slug PATTERN (kebab-case ascii), not just length, so a slug like
  // "../foo" can't path-traverse via buildLocalColumnPath/path.join. Matches the
  // sibling columns routes' columnSlugSchema.parse usage. (review: API hardening)
  if (!columnSlugSchema.safeParse(slug).success) {
    return errorResponse(locale, 'invalid_slug', 400);
  }

  const skipEmbeddings = request.nextUrl.searchParams.get('skipEmbeddings') === '1';

  try {
    const draft = await readColumnVariant(locale, slug, 'draft');
    if (!draft) {
      return errorResponse(locale, 'draft_not_found', 404);
    }

    const slugRedirectFrom = draft.frontmatter.slugRedirectFrom;
    const publishedFrontmatter = { ...draft.frontmatter };
    delete publishedFrontmatter.slugRedirectFrom;
    const published = await writePublishedColumn({
      ...draft,
      draft: false,
      frontmatter: publishedFrontmatter,
      updatedAt: new Date().toISOString(),
    });

    let slugRedirect:
      | Awaited<ReturnType<typeof applyRecordSlugRedirect>>
      | {
        status: 'failed';
        error: string;
        errorCode: BuilderColumnsApiErrorCode;
        deactivatedRedirectIds: string[];
      }
      | null = null;
    if (slugRedirectFrom && slugRedirectFrom !== published.slug) {
      try {
        slugRedirect = await applyRecordSlugRedirect(DEFAULT_BUILDER_SITE_ID, {
          locale,
          collectionId: 'columns',
          oldSlug: slugRedirectFrom,
          newSlug: published.slug,
        });
        const oldPublished = await readColumnVariant(locale, slugRedirectFrom, 'published');
        if (oldPublished && oldPublished.updatedBy !== 'legacy-column-import') {
          await deletePublishedColumn(locale, slugRedirectFrom);
        }
      } catch (error) {
        console.error('[columns] slug redirect create failed:', error);
        slugRedirect = {
          status: 'failed',
          ...getBuilderColumnsApiErrorPayload(locale, 'slug_redirect_failed'),
          deactivatedRedirectIds: [],
        };
      }
    }
    await recordColumnEvent({
      request,
      type: 'publish',
      slug: published.slug,
      locale: published.locale,
    });

    invalidateBlobColumnsCache(locale);

    // Fire-and-forget embeddings rebuild. The public site origin is
    // needed because this fetch runs server-side (no window.location).
    // We try a few env vars and default to the Vercel auto-URL.
    const origin =
      process.env.NEXT_PUBLIC_SITE_ORIGIN
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || `http://localhost:${process.env.PORT || 3000}`;

    if (!skipEmbeddings) {
      fetch(`${origin}/api/consultation/build-embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'column-publish', slug, locale }),
      }).catch((err) =>
        console.error('[columns] embeddings rebuild trigger failed:', err),
      );
    }

    // Best-effort ISR revalidation for the column's public page.
    try {
      revalidatePath(`/${locale}/columns`);
      revalidatePath(`/${locale}/columns/${slug}`);
      if (slugRedirectFrom) revalidatePath(`/${locale}/columns/${slugRedirectFrom}`);
    } catch {
      // revalidatePath can throw during dev or when the path doesn't
      // exist yet. Swallow — the column will appear on next full build
      // or ISR cycle.
    }

    void rebuildSearchIndexAfterColumnPublish();

    return NextResponse.json({
      success: true,
      slug: published.slug,
      locale: published.locale,
      revision: published.revision,
      publishedAt: published.updatedAt,
      slugRedirect,
    });
  } catch (error) {
    console.error('[columns] publish failed:', error);
    return errorResponse(locale, 'column_publish_failed', 500);
  }
}

async function rebuildSearchIndexAfterColumnPublish(): Promise<void> {
  try {
    const [{ collectAllSearchDocs }, { buildSearchIndex }, { saveSearchIndex }] = await Promise.all([
      import('@/lib/builder/search/source-collector'),
      import('@/lib/builder/search/index-builder'),
      import('@/lib/builder/search/index-storage'),
    ]);
    const docs = await collectAllSearchDocs('default');
    await saveSearchIndex(buildSearchIndex(docs));
  } catch (error) {
    console.warn('[columns] search index rebuild failed:', error);
  }
}
