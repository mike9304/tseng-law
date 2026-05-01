import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { recordColumnEvent } from '@/lib/builder/audit/record';
import { deleteDraftColumn, readColumnBundle, writeDraftColumn } from '@/lib/builder/columns/storage';
import { columnLocaleSchema, columnSlugSchema, patchColumnInputSchema, type ColumnDocument, type ColumnFrontmatter } from '@/lib/builder/columns/types';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ColumnRouteContext {
  params: {
    slug: string;
  };
}

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: 'validation_error',
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

function unknownErrorResponse(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : 'unknown_error';
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
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

  try {
    const locale = columnLocaleSchema.parse(request.nextUrl.searchParams.get('locale') ?? 'ko');
    const slug = columnSlugSchema.parse(context.params.slug);
    const bundle = await readColumnBundle(locale, slug);
    if (!bundle.preferred) {
      return NextResponse.json({ ok: false, error: 'Column not found.' }, { status: 404 });
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
      return validationErrorResponse(error);
    }
    console.error('[builder/columns/[slug]] GET failed:', error);
    return unknownErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest, context: ColumnRouteContext) {
  const auth = guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = columnLocaleSchema.parse(request.nextUrl.searchParams.get('locale') ?? 'ko');
    const slug = columnSlugSchema.parse(context.params.slug);
    const patch = patchColumnInputSchema.parse(await request.json());
    const bundle = await readColumnBundle(locale, slug);
    const base = bundle.draft ?? bundle.published;

    if (!base) {
      return NextResponse.json({ ok: false, error: 'Column not found.' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const nextRevision = (bundle.draft?.revision ?? bundle.published?.revision ?? 0) + 1;
    const nextDoc: ColumnDocument = {
      ...base,
      draft: true,
      revision: nextRevision,
      updatedAt: now,
      updatedBy: auth.username,
      title: patch.title ?? base.title,
      summary: patch.summary ?? base.summary,
      bodyMarkdown: patch.bodyMarkdown ?? base.bodyMarkdown,
      bodyHtml: patch.bodyHtml ?? base.bodyHtml,
      linkedSlugs: patch.linkedSlugs ? { ...base.linkedSlugs, ...patch.linkedSlugs } : base.linkedSlugs,
      frontmatter: mergeFrontmatter(base.frontmatter, patch.frontmatter, now),
    };

    const saved = await writeDraftColumn(nextDoc);
    await recordColumnEvent({
      request,
      type: 'update',
      slug: saved.slug,
      locale: saved.locale,
    });

    return NextResponse.json({
      ok: true,
      column: saved,
      createdFromPublished: !bundle.draft && Boolean(bundle.published),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    console.error('[builder/columns/[slug]] PATCH failed:', error);
    return unknownErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: ColumnRouteContext) {
  const auth = guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = columnLocaleSchema.parse(request.nextUrl.searchParams.get('locale') ?? 'ko');
    const slug = columnSlugSchema.parse(context.params.slug);
    const bundle = await readColumnBundle(locale, slug);
    if (!bundle.draft) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Draft column not found.',
          publishedStillExists: Boolean(bundle.published),
        },
        { status: 404 },
      );
    }

    await deleteDraftColumn(locale, slug);
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
      publishedStillExists: Boolean(bundle.published),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }
    console.error('[builder/columns/[slug]] DELETE failed:', error);
    return unknownErrorResponse(error);
  }
}
