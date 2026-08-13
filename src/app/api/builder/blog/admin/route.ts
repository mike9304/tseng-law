import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import { readNativeBlogAdminModel } from '@/lib/builder/blog/admin-storage';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import {
  type BuilderBlogApiErrorCode,
  getBuilderBlogApiErrorPayload,
} from '@/lib/builder/blog/blog-api-copy';
import { columnLocaleSchema } from '@/lib/builder/columns/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BuilderBlogApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderBlogApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'edit-blog');
  if (auth instanceof NextResponse) return auth;
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  try {
    const locale = columnLocaleSchema.parse(request.nextUrl.searchParams.get('locale') ?? 'ko');
    const model = await readNativeBlogAdminModel(locale);
    return NextResponse.json({ ok: true, model });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(errorLocale, 'validation_error', 400, { issues: error.flatten() });
    }
    console.error('[builder/blog/admin] GET failed:', error);
    return errorResponse(errorLocale, 'blog_admin_load_failed', 500);
  }
}
