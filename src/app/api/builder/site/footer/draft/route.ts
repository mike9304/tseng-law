import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  ensureGlobalHeaderFooterIds,
  readFooterCanvas,
  writeFooterCanvas,
} from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import { normalizeCanvasDocument } from '@/lib/builder/canvas/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const draft = await readFooterCanvas('default');
  if (!draft) {
    return NextResponse.json({ ok: false, error: 'Global footer canvas not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, document: draft });
}

export async function PUT(request: NextRequest) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  let body: { document?: unknown };
  try {
    body = (await request.json()) as { document?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const normalized = normalizeCanvasDocument(body.document, locale);

  await writeFooterCanvas('default', normalized);
  await ensureGlobalHeaderFooterIds('default', locale);

  return NextResponse.json({ ok: true, document: normalized });
}
