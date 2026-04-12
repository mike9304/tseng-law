import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { listColumns, readColumnBundle, writeDraftColumn } from '@/lib/builder/columns/storage';
import {
  createColumnInputSchema,
  columnLocaleSchema,
  type ColumnDocument,
} from '@/lib/builder/columns/types';

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
    const input = createColumnInputSchema.parse(await request.json());
    const existing = await readColumnBundle(input.locale, input.slug);
    if (existing.preferred) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Column already exists.',
          slug: input.slug,
          locale: input.locale,
        },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const document: ColumnDocument = {
      version: 1,
      slug: input.slug,
      locale: input.locale,
      title: input.title,
      summary: input.summary ?? '',
      bodyMarkdown: input.bodyMarkdown ?? '',
      bodyHtml: input.bodyHtml ?? '',
      linkedSlugs: input.linkedSlugs ?? {},
      frontmatter: {
        lastmod: input.frontmatter?.lastmod ?? now,
        attorneyReviewStatus: input.frontmatter?.attorneyReviewStatus ?? 'pending',
        freshness: input.frontmatter?.freshness ?? 'unknown',
        ...(input.frontmatter?.category ? { category: input.frontmatter.category } : {}),
      },
      draft: true,
      revision: 1,
      updatedAt: now,
      updatedBy: auth.username,
    };

    const saved = await writeDraftColumn(document);
    return NextResponse.json(
      {
        ok: true,
        column: saved,
      },
      { status: 201 },
    );
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
