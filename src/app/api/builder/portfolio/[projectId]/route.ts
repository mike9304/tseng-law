import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
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

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  const scope = request.nextUrl.searchParams.get('scope') ?? 'public';
  if (scope === 'all') {
    const auth = requireBuilderAdminAuth(request);
    if (auth instanceof NextResponse) return auth;
  }

  const project = await loadProject(params.projectId);
  if (!project || (scope !== 'all' && project.status !== 'published')) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, project });
}

export async function PATCH(request: NextRequest, { params }: { params: { projectId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const project = await loadProject(params.projectId);
    if (!project) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    const patch = patchSchema.parse(await request.json());
    const saved = await saveProject({ ...project, ...patch });
    const errors = validateProject(saved);
    if (errors.length > 0) {
      return NextResponse.json({ ok: false, error: 'validation_error', errors }, { status: 400 });
    }
    return NextResponse.json({ ok: true, project: saved });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    console.error('[builder/portfolio/:projectId] PATCH failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { projectId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  await deleteProject(params.projectId);
  return NextResponse.json({ ok: true });
}
