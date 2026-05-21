import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { columnLocaleSchema } from '@/lib/builder/columns/types';
import { guardMutation } from '@/lib/builder/security/guard';
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

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
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
      const auth = requireBuilderAdminAuth(request);
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
    if (error instanceof ZodError) return validationError(error);
    console.error('[builder/portfolio] GET failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = projectInputSchema.parse(await request.json());
    const project = await createProject(input);
    const errors = validateProject(project);
    if (errors.length > 0) {
      return NextResponse.json({ ok: false, error: 'validation_error', errors }, { status: 400 });
    }
    return NextResponse.json({ ok: true, project }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    console.error('[builder/portfolio] POST failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}
