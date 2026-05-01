import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { readCanvasSandboxDraft, writeCanvasSandboxDraft } from '@/lib/builder/canvas/persistence';
import { builderCanvasDocumentSchema } from '@/lib/builder/canvas/types';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unknownErrorResponse(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : 'unknown_error';
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
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

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
    const draft = await readCanvasSandboxDraft(locale);
    return NextResponse.json({
      ok: true,
      backend: draft.backend,
      persisted: draft.persisted,
      document: draft.document,
      requestedBy: auth.username,
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return unknownErrorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  const auth = guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
    const payload = z.object({
      document: builderCanvasDocumentSchema,
    }).parse(await request.json());

    const saved = await writeCanvasSandboxDraft({
      ...payload.document,
      locale,
      updatedBy: auth.username,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      backend: saved.backend,
      document: saved.document,
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    return unknownErrorResponse(error);
  }
}
