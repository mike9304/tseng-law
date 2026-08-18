import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getBuilderColumnsApiErrorPayload,
  type BuilderColumnsApiErrorCode,
} from '@/lib/builder/columns/columns-api-copy';
import { recordColumnEvent } from '@/lib/builder/audit/record';
import { listColumns, readColumnBundle, writeDraftColumn } from '@/lib/builder/columns/storage';
import { sanitizeColumnBodyHtml } from '@/lib/builder/columns/sanitize-body-html';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  createColumnInputSchema,
  columnLocaleSchema,
  type ColumnDocument,
} from '@/lib/builder/columns/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'edit-blog');
  if (auth instanceof NextResponse) return auth;

  const errorLocale = requestLocale(request);

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
      return validationErrorResponse(errorLocale, error);
    }
    console.error('[builder/columns] GET failed:', error);
    return errorResponse(errorLocale, 'columns_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    console.error('[builder/columns] POST JSON parse failed:', error);
    return errorResponse(requestLocale(request), 'invalid_json', 400);
  }

  const errorLocale = requestLocale(
    request,
    body && typeof body === 'object' && 'locale' in body ? (body as { locale?: unknown }).locale : undefined,
  );

  try {
    const input = createColumnInputSchema.parse(body);
    const existing = await readColumnBundle(input.locale, input.slug);
    if (existing.preferred) {
      return errorResponse(input.locale, 'column_already_exists', 409, {
        slug: input.slug,
        locale: input.locale,
      });
    }

    const now = new Date().toISOString();
    const fm = input.frontmatter;
    const document: ColumnDocument = {
      version: 1,
      slug: input.slug,
      locale: input.locale,
      title: input.title,
      summary: input.summary ?? '',
      bodyMarkdown: input.bodyMarkdown ?? '',
      bodyHtml: sanitizeColumnBodyHtml(input.bodyHtml ?? ''),
      linkedSlugs: input.linkedSlugs ?? {},
      frontmatter: {
        lastmod: fm?.lastmod ?? now,
        attorneyReviewStatus: fm?.attorneyReviewStatus ?? 'pending',
        freshness: fm?.freshness ?? 'unknown',
        ...(fm?.category ? { category: fm.category } : {}),
        // Phase 14 blog meta passthrough (null/undefined skipped)
        ...(typeof fm?.blogCategory === 'string' ? { blogCategory: fm.blogCategory } : {}),
        ...(Array.isArray(fm?.tags) ? { tags: fm.tags as string[] } : {}),
        ...(fm?.author ? { author: fm.author } : {}),
        ...(typeof fm?.featuredImage === 'string' ? { featuredImage: fm.featuredImage } : {}),
        ...(typeof fm?.featured === 'boolean' ? { featured: fm.featured } : {}),
        ...(typeof fm?.publishedAt === 'string' ? { publishedAt: fm.publishedAt } : {}),
        ...(fm?.seo ? { seo: fm.seo } : {}),
        ...(fm?.typography ? { typography: fm.typography } : {}),
      },
      draft: true,
      revision: 1,
      updatedAt: now,
      updatedBy: auth.username,
    };

    const saved = await writeDraftColumn(document);
    await recordColumnEvent({
      request,
      type: 'create',
      slug: saved.slug,
      locale: saved.locale,
    });

    return NextResponse.json(
      {
        ok: true,
        column: saved,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(errorLocale, error);
    }
    console.error('[builder/columns] POST failed:', error);
    return errorResponse(errorLocale, 'column_create_failed', 500);
  }
}
