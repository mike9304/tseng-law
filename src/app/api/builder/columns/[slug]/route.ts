import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { deleteDraftColumn, readColumnBundle, writeDraftColumn } from '@/lib/builder/columns/storage';
import { columnLocaleSchema, columnSlugSchema, patchColumnInputSchema, type ColumnDocument, type ColumnFrontmatter } from '@/lib/builder/columns/types';

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
  const auth = requireBuilderAdminAuth(request);
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
  const auth = requireBuilderAdminAuth(request);
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
