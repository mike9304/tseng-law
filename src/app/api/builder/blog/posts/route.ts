/**
 * Phase 14 — Public Blog Posts API.
 *
 * GET /api/builder/blog/posts?locale=ko&category=labor&tag=wage&sort=newest&limit=9&featured=true
 *
 * No auth — published-only adapter output. Used by client-side blog widgets
 * (blog-feed, blog-post-card, featured-posts) on both builder canvas
 * (preview) and the live site.
 */
import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import type { Locale } from '@/lib/locales';
import { normalizeLocale } from '@/lib/locales';
import {
  type BuilderBlogApiErrorCode,
  getBuilderBlogApiErrorPayload,
} from '@/lib/builder/blog/blog-api-copy';
import { columnLocaleSchema } from '@/lib/builder/columns/types';
import { listAllBlogPosts, listBlogPosts } from '@/lib/builder/blog/column-adapter';
import { filterPosts, sortPosts, type BlogPost } from '@/lib/builder/blog/blog-engine';
import { guardBuilderRead } from '@/lib/builder/security/guard';

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

const querySchema = z.object({
  locale: columnLocaleSchema,
  category: z.string().trim().max(80).optional(),
  tag: z.string().trim().max(80).optional(),
  author: z.string().trim().max(120).optional(),
  q: z.string().trim().max(200).optional(),
  sort: z.enum(['newest', 'oldest', 'featured-first']).default('newest'),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  featured: z.enum(['true', 'false']).optional(),
  // 'all' returns drafts + published (used by builder catalogues only)
  scope: z.enum(['public', 'all']).default('public'),
});

export async function GET(request: NextRequest) {
  const errorLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  try {
    const sp = request.nextUrl.searchParams;
    const parsed = querySchema.parse({
      locale: sp.get('locale') ?? 'ko',
      category: sp.get('category') ?? undefined,
      tag: sp.get('tag') ?? undefined,
      author: sp.get('author') ?? undefined,
      q: sp.get('q') ?? undefined,
      sort: sp.get('sort') ?? 'newest',
      limit: sp.get('limit') ?? 50,
      featured: sp.get('featured') ?? undefined,
      scope: sp.get('scope') ?? 'public',
    });

    // SECURITY: scope=all returns DRAFT posts. Drafts must never leak to
    // anonymous visitors. Require builder admin auth when callers ask for
    // unpublished content. Without this, /api/builder/blog/posts?scope=all
    // exposes work-in-progress legal articles to anyone with the URL.
    if (parsed.scope === 'all') {
      const auth = guardBuilderRead(request);
      if (auth instanceof NextResponse) return auth;
    }

    const all: BlogPost[] = parsed.scope === 'all'
      ? await listAllBlogPosts(parsed.locale)
      : await listBlogPosts(parsed.locale);

    let filtered = filterPosts(all, {
      category: parsed.category,
      tag: parsed.tag,
      author: parsed.author,
      query: parsed.q,
      locale: parsed.locale,
    });
    if (parsed.featured === 'true') filtered = filtered.filter((p) => p.featured);
    if (parsed.featured === 'false') filtered = filtered.filter((p) => !p.featured);

    const sorted = sortPosts(filtered, parsed.sort);
    const limited = sorted.slice(0, parsed.limit);

    return NextResponse.json({
      ok: true,
      locale: parsed.locale,
      total: filtered.length,
      posts: limited,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(errorLocale, 'validation_error', 400, { issues: error.flatten() });
    }
    // eslint-disable-next-line no-console
    console.error('[builder/blog/posts] GET failed:', error);
    return errorResponse(errorLocale, 'blog_posts_load_failed', 500);
  }
}
