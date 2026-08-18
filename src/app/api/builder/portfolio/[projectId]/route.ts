import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderPortfolioApiErrorPayload,
  type BuilderPortfolioApiErrorCode,
} from '@/lib/builder/portfolio/portfolio-api-copy';
import {
  deleteProject,
  loadProject,
  saveProject,
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

const patchSchema = z.object({
  title: z.string().trim().min(1).max(180).optional(),
  slug: z.string().trim().min(1).max(120).optional(),
  summary: z.string().trim().max(320).optional(),
  description: z.string().trim().max(2000).optional(),
  body: z.string().trim().max(8000).optional(),
  category: z.string().trim().max(80).optional(),
  client: z.string().trim().max(180).optional(),
  completedAt: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  tags: z.array(z.string().trim().max(80)).max(20).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.boolean().optional(),
  order: z.coerce.number().int().min(0).max(100000).optional(),
  coverImageUrl: z.string().trim().max(2000).optional(),
  gallery: z.array(galleryImageSchema).max(40).optional(),
  seoTitle: z.string().trim().max(180).optional(),
  seoDescription: z.string().trim().max(320).optional(),
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

export async function GET(request: NextRequest, props: { params: Promise<{ projectId: string }> }) {
  const params = await props.params;
  const locale = requestLocale(request);
  const scope = request.nextUrl.searchParams.get('scope') ?? 'public';
  if (scope === 'all') {
    const auth = await guardBuilderReadWithPermission(request, 'edit-pages');
    if (auth instanceof NextResponse) return auth;
  }

  try {
    const project = await loadProject(params.projectId);
    if (!project || (scope !== 'all' && project.status !== 'published')) {
      return errorResponse(locale, 'portfolio_project_not_found', 404);
    }
    return NextResponse.json({ ok: true, project });
  } catch (error) {
    console.error('[builder/portfolio/:projectId] GET failed:', error);
    return errorResponse(locale, 'portfolio_load_failed', 500);
  }
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ projectId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  const locale = requestLocale(request);

  try {
    const project = await loadProject(params.projectId);
    if (!project) return errorResponse(locale, 'portfolio_project_not_found', 404);

    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error('[builder/portfolio/:projectId] PATCH JSON parse failed:', error);
      return errorResponse(locale, 'invalid_json', 400);
    }

    const patch = patchSchema.parse(body);
    const saved = await saveProject({ ...project, ...patch });
    const errors = validateProject(saved);
    if (errors.length > 0) {
      return errorResponse(locale, 'validation_error', 400);
    }
    return NextResponse.json({ ok: true, project: saved });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    console.error('[builder/portfolio/:projectId] PATCH failed:', error);
    return errorResponse(locale, 'portfolio_update_failed', 500);
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ projectId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  try {
    await deleteProject(params.projectId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/portfolio/:projectId] DELETE failed:', error);
    return errorResponse(locale, 'portfolio_delete_failed', 500);
  }
}
