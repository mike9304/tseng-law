import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { recordColumnEvent } from '@/lib/builder/audit/record';
import {
  getBuilderColumnsApiErrorPayload,
  type BuilderColumnsApiErrorCode,
} from '@/lib/builder/columns/columns-api-copy';
import { deleteDraftColumn, deletePublishedColumn, readColumnBundle, writeDraftColumn } from '@/lib/builder/columns/storage';
import { columnLocaleSchema, columnSlugSchema, patchColumnInputSchema, type ColumnDocument, type ColumnFrontmatter } from '@/lib/builder/columns/types';
import { guardMutation } from '@/lib/builder/security/guard';
import { invalidateBlobColumnsCache } from '@/lib/consultation/columns-blob-reader';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ColumnRouteContext {
  params: {
    slug: string;
  };
}

function requestLocale(request: NextRequest, input?: unknown): Locale {
  if (typeof input === 'string') return normalizeLocale(input);
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderColumnsApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderColumnsApiErrorPayload(locale, errorCode),
      ...(extra ?? {}),
    },
    { status },
  );
}

function validationErrorResponse(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function mergeFrontmatter(
  base: ColumnFrontmatter,
  incoming: Record<string, unknown> | undefined,
  now: string,
): ColumnFrontmatter {
  const next: ColumnFrontmatter = {
    ...base,
    lastmod: now,
  };
  if (!incoming) return next;
  if (typeof incoming.lastmod === 'string') next.lastmod = incoming.lastmod;
  if (incoming.attorneyReviewStatus === 'pending' || incoming.attorneyReviewStatus === 'reviewed' || incoming.attorneyReviewStatus === 'needs-revision') {
    next.attorneyReviewStatus = incoming.attorneyReviewStatus;
  }
  if (incoming.freshness === 'fresh' || incoming.freshness === 'review_needed' || incoming.freshness === 'unknown') {
    next.freshness = incoming.freshness;
  }
  if (incoming.category === null) {
    delete next.category;
  } else if (incoming.category === 'formation' || incoming.category === 'legal' || incoming.category === 'case') {
    next.category = incoming.category;
  }

  // Phase 14 blog meta — null clears, undefined preserves, value sets.
  if ('blogCategory' in incoming) {
    if (incoming.blogCategory === null) delete next.blogCategory;
    else if (typeof incoming.blogCategory === 'string') next.blogCategory = incoming.blogCategory;
  }
  if ('tags' in incoming) {
    if (incoming.tags === null) delete next.tags;
    else if (Array.isArray(incoming.tags)) {
      next.tags = incoming.tags.filter((t): t is string => typeof t === 'string');
    }
  }
  if ('author' in incoming) {
    if (incoming.author === null) delete next.author;
    else if (incoming.author && typeof incoming.author === 'object') {
      next.author = incoming.author as ColumnFrontmatter['author'];
    }
  }
  if ('featuredImage' in incoming) {
    if (incoming.featuredImage === null) delete next.featuredImage;
    else if (typeof incoming.featuredImage === 'string') next.featuredImage = incoming.featuredImage;
  }
  if ('featured' in incoming) {
    if (incoming.featured === null) delete next.featured;
    else if (typeof incoming.featured === 'boolean') next.featured = incoming.featured;
  }
  if ('publishedAt' in incoming) {
    if (incoming.publishedAt === null) delete next.publishedAt;
    else if (typeof incoming.publishedAt === 'string') next.publishedAt = incoming.publishedAt;
  }
  if ('seo' in incoming) {
    if (incoming.seo === null) delete next.seo;
    else if (incoming.seo && typeof incoming.seo === 'object') {
      next.seo = incoming.seo as ColumnFrontmatter['seo'];
    }
  }
  return next;
}

export async function GET(request: NextRequest, context: ColumnRouteContext) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const errorLocale = requestLocale(request);

  try {
    const locale = columnLocaleSchema.parse(request.nextUrl.searchParams.get('locale') ?? 'ko');
    const slug = columnSlugSchema.parse(context.params.slug);
    const bundle = await readColumnBundle(locale, slug);
    if (!bundle.preferred) {
      return errorResponse(locale, 'column_not_found', 404);
    }
    return NextResponse.json({
      ok: true,
      slug: bundle.slug,
      locale: bundle.locale,
      draft: bundle.draft,
      published: bundle.published,
      preferred: bundle.preferred,
      backend: bundle.backend,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(errorLocale, error);
    }
    console.error('[builder/columns/[slug]] GET failed:', error);
    return errorResponse(errorLocale, 'column_load_failed', 500);
  }
}

export async function PATCH(request: NextRequest, context: ColumnRouteContext) {
  // Draft autosave — use the higher-volume draft bucket, not general mutation.
  const auth = await guardMutation(request, { bucket: 'draft' });
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    console.error('[builder/columns/[slug]] PATCH JSON parse failed:', error);
    return errorResponse(requestLocale(request), 'invalid_json', 400);
  }

  const errorLocale = requestLocale(request);

  try {
    const locale = columnLocaleSchema.parse(request.nextUrl.searchParams.get('locale') ?? 'ko');
    const slug = columnSlugSchema.parse(context.params.slug);
    const patch = patchColumnInputSchema.parse(body);
    const bundle = await readColumnBundle(locale, slug);
    const base = bundle.draft ?? bundle.published;
    const nextSlug = patch.slug ?? slug;

    if (!base) {
      return errorResponse(locale, 'column_not_found', 404);
    }
    if (nextSlug !== slug) {
      const existing = await readColumnBundle(locale, nextSlug);
      if (existing.preferred) {
        return errorResponse(locale, 'column_slug_conflict', 409);
      }
    }

    const now = new Date().toISOString();
    const nextRevision = (bundle.draft?.revision ?? bundle.published?.revision ?? 0) + 1;
    const frontmatter = mergeFrontmatter(base.frontmatter, patch.frontmatter, now);
    if (nextSlug !== slug) {
      const redirectSourceSlug = bundle.published ? slug : base.frontmatter.slugRedirectFrom;
      if (redirectSourceSlug && redirectSourceSlug !== nextSlug) {
        frontmatter.slugRedirectFrom = redirectSourceSlug;
      } else {
        delete frontmatter.slugRedirectFrom;
      }
    }
    const nextDoc: ColumnDocument = {
      ...base,
      slug: nextSlug,
      draft: true,
      revision: nextRevision,
      updatedAt: now,
      updatedBy: auth.username,
      title: patch.title ?? base.title,
      summary: patch.summary ?? base.summary,
      bodyMarkdown: patch.bodyMarkdown ?? base.bodyMarkdown,
      bodyHtml: patch.bodyHtml ?? base.bodyHtml,
      linkedSlugs: patch.linkedSlugs ? { ...base.linkedSlugs, ...patch.linkedSlugs } : base.linkedSlugs,
      frontmatter,
    };

    const saved = await writeDraftColumn(nextDoc);
    if (nextSlug !== slug && bundle.draft) {
      await deleteDraftColumn(locale, slug);
    }
    await recordColumnEvent({
      request,
      type: 'update',
      slug: saved.slug,
      locale: saved.locale,
    });

    const pendingRedirectSourceSlug = nextSlug !== slug ? saved.frontmatter.slugRedirectFrom : undefined;
    return NextResponse.json({
      ok: true,
      column: saved,
      createdFromPublished: !bundle.draft && Boolean(bundle.published),
      slugRedirect: pendingRedirectSourceSlug
        ? {
            status: 'pending-publish',
            from: `/${locale}/columns/${pendingRedirectSourceSlug}`,
            to: `/${locale}/columns/${nextSlug}`,
          }
        : undefined,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(errorLocale, error);
    }
    console.error('[builder/columns/[slug]] PATCH failed:', error);
    return errorResponse(errorLocale, 'column_update_failed', 500);
  }
}

export async function DELETE(request: NextRequest, context: ColumnRouteContext) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  const errorLocale = requestLocale(request);

  try {
    const locale = columnLocaleSchema.parse(request.nextUrl.searchParams.get('locale') ?? 'ko');
    const slug = columnSlugSchema.parse(context.params.slug);
    const includePublished = request.nextUrl.searchParams.get('includePublished') === '1';
    const bundle = await readColumnBundle(locale, slug);
    if (!bundle.draft && (!includePublished || !bundle.published)) {
      return errorResponse(locale, 'draft_not_found', 404, {
        publishedStillExists: Boolean(bundle.published),
      });
    }
    if (includePublished && bundle.published?.updatedBy === 'legacy-column-import') {
      return errorResponse(locale, 'legacy_delete_blocked', 409, {
        publishedStillExists: true,
      });
    }

    if (bundle.draft) {
      await deleteDraftColumn(locale, slug);
    }
    if (includePublished && bundle.published) {
      await deletePublishedColumn(locale, slug);
      invalidateBlobColumnsCache(locale);
      try {
        revalidatePath(`/${locale}/columns`);
        revalidatePath(`/${locale}/columns/${slug}`);
      } catch {
        // Best effort only during dev/ISR.
      }
    }
    await recordColumnEvent({
      request,
      type: 'delete',
      slug,
      locale,
    });

    return NextResponse.json({
      ok: true,
      deleted: true,
      slug,
      locale,
      publishedStillExists: Boolean(bundle.published && !includePublished),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(errorLocale, error);
    }
    console.error('[builder/columns/[slug]] DELETE failed:', error);
    return errorResponse(errorLocale, 'column_delete_failed', 500);
  }
}
