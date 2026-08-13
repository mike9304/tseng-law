import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { columnLocaleSchema } from '@/lib/builder/columns/types';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderPortfolioApiErrorPayload,
  type BuilderPortfolioApiErrorCode,
} from '@/lib/builder/portfolio/portfolio-api-copy';
import {
  createProject,
  filterFeaturedProjects,
  filterProjectsByCategory,
  filterProjectsByLocale,
  filterProjectsByStatus,
  listProjects,
  searchProjects,
  sortProjects,
  validateProject,
} from '@/lib/builder/portfolio/portfolio-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const galleryImageSchema = z.object({
  imageId: z.string().trim().max(120).default(''),
  url: z.string().trim().min(1).max(2000),
  alt: z.string().trim().max(240).default('Portfolio image'),
  caption: z.string().trim().max(240).optional(),
});

const projectInputSchema = z.object({
  locale: columnLocaleSchema.default('ko'),
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(120).optional(),
  summary: z.string().trim().max(320).default(''),
  description: z.string().trim().max(2000).default(''),
  body: z.string().trim().max(8000).default(''),
  category: z.string().trim().max(80).default('company-setup'),
  client: z.string().trim().max(180).optional(),
  completedAt: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string().trim().max(80)).max(20).default([]),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).max(100000).default(0),
  coverImageUrl: z.string().trim().max(2000).optional(),
  gallery: z.array(galleryImageSchema).max(40).default([]),
  seoTitle: z.string().trim().max(180).optional(),
  seoDescription: z.string().trim().max(320).optional(),
});

const querySchema = z.object({
  locale: columnLocaleSchema,
  scope: z.enum(['public', 'all']).default('public'),
  status: z.enum(['all', 'draft', 'published', 'archived']).default('published'),
  category: z.string().trim().max(80).optional(),
  q: z.string().trim().max(200).optional(),
  featured: z.coerce.boolean().default(false),
  sort: z.enum(['date-desc', 'date-asc', 'order-asc']).default('date-desc'),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

function requestLocale(request: NextRequest, input?: unknown): Locale {
  if (typeof input === 'string') return normalizeLocale(input);
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderPortfolioApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderPortfolioApiErrorPayload(locale, errorCode),
      ...(extra ?? {}),
    },
    { status },
  );
}

function validationErrorResponse(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

export async function GET(request: NextRequest) {
  const errorLocale = requestLocale(request);

  try {
    const sp = request.nextUrl.searchParams;
    const parsed = querySchema.parse({
      locale: sp.get('locale') ?? 'ko',
      scope: sp.get('scope') ?? 'public',
      status: sp.get('status') ?? (sp.get('scope') === 'all' ? 'all' : 'published'),
      category: sp.get('category') ?? undefined,
      q: sp.get('q') ?? undefined,
      featured: sp.get('featured') ?? false,
      sort: sp.get('sort') ?? 'date-desc',
      limit: sp.get('limit') ?? 50,
    });

    if (parsed.scope === 'all') {
      const auth = await guardBuilderReadWithPermission(request, 'edit-pages');
      if (auth instanceof NextResponse) return auth;
    }

    let projects = await listProjects();
    projects = filterProjectsByLocale(projects, parsed.locale);
    projects = filterProjectsByStatus(projects, parsed.scope === 'public' ? 'published' : parsed.status);
    projects = filterProjectsByCategory(projects, parsed.category);
    projects = filterFeaturedProjects(projects, parsed.featured);
    projects = searchProjects(projects, parsed.q);
    const total = projects.length;
    projects = sortProjects(projects, parsed.sort).slice(0, parsed.limit);

    return NextResponse.json({ ok: true, locale: parsed.locale, total, projects });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(errorLocale, error);
    console.error('[builder/portfolio] GET failed:', error);
    return errorResponse(errorLocale, 'portfolio_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    console.error('[builder/portfolio] POST JSON parse failed:', error);
    return errorResponse(requestLocale(request), 'invalid_json', 400);
  }

  const errorLocale = requestLocale(
    request,
    body && typeof body === 'object' && 'locale' in body ? (body as { locale?: unknown }).locale : undefined,
  );

  try {
    const input = projectInputSchema.parse(body);
    const project = await createProject(input);
    const errors = validateProject(project);
    if (errors.length > 0) {
      return errorResponse(input.locale, 'validation_error', 400);
    }
    return NextResponse.json({ ok: true, project }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(errorLocale, error);
    console.error('[builder/portfolio] POST failed:', error);
    return errorResponse(errorLocale, 'portfolio_create_failed', 500);
  }
}
