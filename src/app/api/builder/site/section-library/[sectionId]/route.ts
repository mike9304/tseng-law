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
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import type { Locale } from '@/lib/locales';

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

function errorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function sectionWithSafeThumbnail(section: SavedSection): SavedSection {
  const nodes = normalizeSavedSectionSnapshot(section.nodes, section.rootNodeId);
  return {
    ...section,
    nodes,
    thumbnail: buildSavedSectionThumbnailSvg(nodes, section.rootNodeId),
  };
}

export async function GET(request: NextRequest, props: { params: Promise<{ sectionId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const section = await findSection('default', locale, params.sectionId);
  if (!section) {
    return errorResponse(locale, 'section_not_found', 404);
  }
  return NextResponse.json({ ok: true, section: sectionWithSafeThumbnail(section) });
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ sectionId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  try {
    const body = await request.json();
    const parsed = patchSchema.parse(body);

    if (parsed.incrementUsage) {
      const updated = await incrementSectionUsage('default', locale, params.sectionId);
      if (!updated) {
        return errorResponse(locale, 'section_not_found', 404);
      }
      return NextResponse.json({ ok: true, section: sectionWithSafeThumbnail(updated) });
    }

    const { incrementUsage: _ignore, ...rest } = parsed;
    void _ignore;
    const updated = await updateSection('default', locale, params.sectionId, rest);
    if (!updated) {
      return errorResponse(locale, 'section_not_found', 404);
    }
    return NextResponse.json({ ok: true, section: sectionWithSafeThumbnail(updated) });
  } catch (error) {
    if (error instanceof ZodError) return validationError(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    return errorResponse(locale, 'section_update_failed', 500);
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ sectionId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const ok = await deleteSection('default', locale, params.sectionId);
  if (!ok) {
    return errorResponse(locale, 'section_not_found', 404);
  }
  return NextResponse.json({ ok: true });
}
