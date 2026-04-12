import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { getColumnsStorageBackend, listColumns, readColumnBundle, writeDraftColumn } from '@/lib/builder/columns/storage';
import { columnLocaleSchema, createColumnInputSchema, type ColumnDocument } from '@/lib/builder/columns/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = columnLocaleSchema.parse(request.nextUrl.searchParams.get('locale') ?? 'ko');
    const columns = await listColumns(locale);
    return NextResponse.json({
      ok: true,
      locale,
      backend: getColumnsStorageBackend(),
      columns,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }
    console.error('[builder/columns] GET failed:', error);
    return unknownErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const payload = createColumnInputSchema.parse(await request.json());
    const existing = await readColumnBundle(payload.locale, payload.slug);
    if (existing.draft || existing.published) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Column already exists for this locale and slug.',
          slug: payload.slug,
          locale: payload.locale,
        },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const column: ColumnDocument = {
      version: 1,
      slug: payload.slug,
      locale: payload.locale,
      title: payload.title,
      summary: payload.summary ?? '',
      bodyMarkdown: payload.bodyMarkdown ?? '',
      bodyHtml: payload.bodyHtml ?? '',
      frontmatter: {
        lastmod: payload.frontmatter?.lastmod ?? now,
        attorneyReviewStatus: payload.frontmatter?.attorneyReviewStatus ?? 'pending',
        freshness: payload.frontmatter?.freshness ?? 'unknown',
        category: payload.frontmatter?.category,
      },
      linkedSlugs: payload.linkedSlugs ?? {},
      draft: true,
      revision: 1,
      updatedAt: now,
      updatedBy: auth.username,
    };

    const saved = await writeDraftColumn(column);
    return NextResponse.json({ ok: true, column: saved });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error);
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    console.error('[builder/columns] POST failed:', error);
    return unknownErrorResponse(error);
  }
}
