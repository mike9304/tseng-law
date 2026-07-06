/**
 * M166-BG — POST /api/builder/ai-generator/style-score
 *
 * Deterministic designer-polish scoring for AI-generated drafts. This keeps
 * the visual builder's style ranking auditable from both client and server.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  COLOR_PREFERENCES,
  INDUSTRIES,
  TONES,
} from '@/lib/builder/ai-generator/site-spec';
import {
  scoreDesignerStyleCandidates,
  serializeDesignerScorePayload,
} from '@/lib/builder/ai-generator/designer-scoring';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  industry: z.enum(INDUSTRIES),
  tone: z.enum(TONES).default('professional'),
  colorPreference: z.enum(COLOR_PREFERENCES).default('cool'),
  goals: z.array(z.string().trim().min(1).max(120)).max(8).optional(),
  brandKeywords: z.array(z.string().trim().min(1).max(80)).max(10).optional(),
  constraints: z.string().trim().max(600).optional(),
  audience: z.string().trim().max(160).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_style_score_request', issues: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }

  const scores = scoreDesignerStyleCandidates(parsed.data);
  return NextResponse.json({
    ok: true,
    top: scores[0] ?? null,
    scores,
    payload: serializeDesignerScorePayload(scores),
    generatedAt: new Date().toISOString(),
  });
}
