/**
 * Section library — read / update / delete a single saved section.
 *
 * GET     /api/builder/site/section-library/:sectionId — fetch single section (full nodes)
 * PATCH   /api/builder/site/section-library/:sectionId — rename / change category / increment usage
 * DELETE  /api/builder/site/section-library/:sectionId — remove
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteSection,
  findSection,
  incrementSectionUsage,
  updateSection,
} from '@/lib/builder/site/persistence';
import {
  SAVED_SECTION_CATEGORIES,
  type SavedSection,
  type SavedSectionCategory,
} from '@/lib/builder/site/types';
import { normalizeSavedSectionSnapshot } from '@/lib/builder/sections/normalize';
import { buildSavedSectionThumbnailSvg } from '@/lib/builder/sections/thumbnail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(1000).optional(),
    category: z.enum(SAVED_SECTION_CATEGORIES as unknown as [SavedSectionCategory, ...SavedSectionCategory[]]).optional(),
    incrementUsage: z.boolean().optional(),
    usage: z.number().int().min(0).max(1_000_000).optional(),
  })
  .strict();

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

function sectionWithSafeThumbnail(section: SavedSection): SavedSection {
  const nodes = normalizeSavedSectionSnapshot(section.nodes, section.rootNodeId);
  return {
    ...section,
    nodes,
    thumbnail: buildSavedSectionThumbnailSvg(nodes, section.rootNodeId),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { sectionId: string } },
) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const section = await findSection('default', locale, params.sectionId);
  if (!section) {
    return NextResponse.json({ ok: false, error: 'Section not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, section: sectionWithSafeThumbnail(section) });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { sectionId: string } },
) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const parsed = patchSchema.parse(body);
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');

    if (parsed.incrementUsage) {
      const updated = await incrementSectionUsage('default', locale, params.sectionId);
      if (!updated) {
        return NextResponse.json({ ok: false, error: 'Section not found' }, { status: 404 });
      }
      return NextResponse.json({ ok: true, section: sectionWithSafeThumbnail(updated) });
    }

    const { incrementUsage: _ignore, ...rest } = parsed;
    void _ignore;
    const updated = await updateSection('default', locale, params.sectionId, rest);
    if (!updated) {
      return NextResponse.json({ ok: false, error: 'Section not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, section: sectionWithSafeThumbnail(updated) });
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
  { params }: { params: { sectionId: string } },
) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const ok = await deleteSection('default', locale, params.sectionId);
  if (!ok) {
    return NextResponse.json({ ok: false, error: 'Section not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
