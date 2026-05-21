/**
 * F89 — POST /api/builder/ai-generator/theme
 *
 * Two modes:
 * - `{action: 'suggest', prompt}` — return a preset theme suggestion based
 *   on brand prompt keywords (vibe detection).
 * - `{action: 'analyze', theme}` — return WCAG-aware harmony issues for an
 *   existing theme.
 *
 * Pure heuristic engine (no LLM call). Future evolution: route the prompt
 * through gpt-4o-mini for finer-grained color selection.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  analyzeThemeHarmony,
  deriveAccentFromPrimary,
  suggestThemeFromPrompt,
} from '@/lib/builder/ai-generator/theme-suggestions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const suggestSchema = z.object({
  action: z.literal('suggest'),
  prompt: z.string().trim().max(800),
});

const analyzeSchema = z.object({
  action: z.literal('analyze'),
  theme: z.object({
    colors: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
      background: z.string(),
      text: z.string(),
      muted: z.string(),
    }),
  }),
});

const deriveSchema = z.object({
  action: z.literal('derive-accent'),
  primary: z.string(),
});

const bodySchema = z.discriminatedUnion('action', [suggestSchema, analyzeSchema, deriveSchema]);

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation', permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'invalid_theme_request', issues: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }

  if (parsed.data.action === 'suggest') {
    const suggestion = suggestThemeFromPrompt(parsed.data.prompt);
    return NextResponse.json({ ok: true, suggestion });
  }

  if (parsed.data.action === 'analyze') {
    const issues = analyzeThemeHarmony(parsed.data.theme);
    return NextResponse.json({ ok: true, issues });
  }

  const accent = deriveAccentFromPrimary(parsed.data.primary);
  return NextResponse.json({ ok: true, accent });
}
