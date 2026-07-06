/**
 * Section library — list + create.
 *
 * GET   /api/builder/site/section-library            — list all sections (locale-agnostic; sections are global)
 * POST  /api/builder/site/section-library            — create a new saved section
 *
 * Wix Studio "Saved Sections" parity. Sections live on the site document
 * under `sectionLibrary` and are CRUD'd via the section-library API.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import { createSection, listSections } from '@/lib/builder/site/persistence';
import { builderCanvasNodeSchema } from '@/lib/builder/canvas/types';
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

const createBodySchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    description: z.string().trim().max(1000).optional(),
    category: z.enum(SAVED_SECTION_CATEGORIES as unknown as [string, ...string[]]).optional(),
    thumbnail: z.string().max(500_000).optional(),
    rootNodeId: z.string().trim().min(1).max(120),
    nodes: z.array(builderCanvasNodeSchema).min(1).max(500),
    locale: z.string().optional(),
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

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const sections = (await listSections('default', locale)).map(sectionWithSafeThumbnail);
  return NextResponse.json({ sections });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  try {
    const body = await request.json();
    const parsed = createBodySchema.parse(body);
    locale = normalizeLocale(parsed.locale || 'ko');

    const normalizedNodes = normalizeSavedSectionSnapshot(parsed.nodes, parsed.rootNodeId);
    if (normalizedNodes.length === 0) {
      return errorResponse(locale, 'section_root_missing', 400);
    }
    const thumbnail = buildSavedSectionThumbnailSvg(normalizedNodes, parsed.rootNodeId);

    const section = await createSection('default', locale, {
      name: parsed.name,
      description: parsed.description,
      category: parsed.category as SavedSectionCategory | undefined,
      thumbnail,
      rootNodeId: parsed.rootNodeId,
      nodes: normalizedNodes,
    });

    return NextResponse.json({ ok: true, section: sectionWithSafeThumbnail(section) });
  } catch (error) {
    if (error instanceof ZodError) return validationError(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    return errorResponse(locale, 'section_create_failed', 500);
  }
}
