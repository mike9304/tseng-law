/**
 * F88 — Responsive AI route.
 *
 * POST /api/builder/ai-generator/responsive
 * Body: { pageId, locale, targetViewport: 'mobile'|'tablet', canvas: BuilderCanvasDocument }
 * Returns: { ok, suggestions: ResponsiveSuggestion[] }
 *
 * First slice: pure heuristics (no OpenAI call). Plays the same role as
 * Wix's "Make it Mobile" — but auditable, deterministic, and free.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { builderCanvasDocumentSchema } from '@/lib/builder/canvas/types';
import {
  scanResponsiveSuggestions,
  RESPONSIVE_TARGET_VIEWPORTS,
} from '@/lib/builder/ai-generator/responsive-rules';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  pageId: z.string().trim().min(1).max(120),
  locale: z.enum(['ko', 'zh-hant', 'en']),
  targetViewport: z.enum(RESPONSIVE_TARGET_VIEWPORTS),
  canvas: builderCanvasDocumentSchema,
  safeWidth: z.number().int().positive().max(2000).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_responsive_request', details: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }

  const { canvas, targetViewport, pageId, locale, safeWidth } = parsed.data;
  try {
    const suggestions = scanResponsiveSuggestions({
      canvas,
      viewport: targetViewport,
      options: safeWidth ? { safeWidth } : undefined,
    });
    return NextResponse.json({
      ok: true,
      pageId,
      locale,
      targetViewport,
      generatedAt: new Date().toISOString(),
      suggestions,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: 'responsive_scan_failed',
        message: err instanceof Error ? err.message : 'Responsive heuristic scan failed.',
      },
      { status: 500 },
    );
  }
}