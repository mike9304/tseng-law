import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteLightbox,
  updateLightbox,
} from '@/lib/builder/site/persistence';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const patchSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    slug: z.string().trim().min(1).max(100).regex(SLUG_RE).optional(),
    sizeMode: z.enum(['auto', 'fixed']).optional(),
    width: z.number().int().min(120).max(2000).optional(),
    height: z.number().int().min(80).max(2000).optional(),
    closeOnOutsideClick: z.boolean().optional(),
    closeOnEsc: z.boolean().optional(),
    dismissable: z.boolean().optional(),
    backdropOpacity: z.number().int().min(0).max(100).optional(),
  })
  .strict();

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const patch = patchSchema.parse(body);
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const updated = await updateLightbox('default', locale, params.id, patch);
    if (!updated) {
      return NextResponse.json({ ok: false, error: 'Lightbox not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, lightbox: updated });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const ok = await deleteLightbox('default', locale, params.id);
  if (!ok) {
    return NextResponse.json({ ok: false, error: 'Lightbox not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
