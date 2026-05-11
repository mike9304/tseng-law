import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createLightbox,
  listLightboxes,
  writeLightboxCanvas,
} from '@/lib/builder/site/persistence';
import { createDefaultCanvasDocument } from '@/lib/builder/canvas/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const lightboxes = await listLightboxes('default', locale);
  return NextResponse.json({ lightboxes });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let body: { slug?: string; name?: string; locale?: string };
  try {
    body = (await request.json()) as { slug?: string; name?: string; locale?: string };
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const locale = normalizeLocale(body.locale || 'ko');
  const slug = (body.slug ?? '').trim();
  const name = (body.name ?? '').trim() || 'Untitled lightbox';

  if (!slug || slug.length > 100 || !SLUG_RE.test(slug)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid slug — lowercase alphanumeric with hyphens only' },
      { status: 400 },
    );
  }

  const existing = await listLightboxes('default', locale);
  if (existing.some((lb) => lb.slug === slug)) {
    return NextResponse.json(
      { ok: false, error: 'A lightbox with this slug already exists' },
      { status: 409 },
    );
  }

  const lightbox = await createLightbox('default', locale, slug, name);

  // Seed an empty canvas document.
  const canvas = createDefaultCanvasDocument(locale);
  // Replace seeded nodes with an empty canvas — lightboxes start blank.
  const blank = { ...canvas, nodes: [], stageWidth: 600, stageHeight: 400 };
  await writeLightboxCanvas('default', lightbox.id, blank);

  return NextResponse.json({ ok: true, lightbox });
}
