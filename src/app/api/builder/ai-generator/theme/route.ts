/**
 * F89 — POST /api/builder/ai-generator/theme
 *
 * Four modes:
 * - `{action: 'suggest', prompt}` — return a preset theme suggestion based
 *   on brand prompt keywords (vibe detection).
 * - `{action: 'analyze', theme}` — return WCAG-aware harmony issues for an
 *   existing theme.
 * - `{action: 'derive-accent', primary}` — derive a deterministic accent.
 * - `{action: 'apply', suggestion}` — persist a suggestion to site settings.
 *
 * Pure heuristic engine (no LLM call). Future evolution: route the prompt
 * through gpt-4o-mini for finer-grained color selection.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';
import { resolveBuilderSiteIdForMutationFromRequest } from '@/lib/builder/site/admin-routing';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import {
  applyThemeSuggestionToTheme,
  analyzeThemeHarmony,
  deriveAccentFromPrimary,
  suggestThemeFromPrompt,
} from '@/lib/builder/ai-generator/theme-suggestions';
import { mergeTheme } from '../../site/settings/route-appearance';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const suggestSchema = z.object({
  action: z.literal('suggest'),
  prompt: z.string().trim().max(800),
});

const colorsSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  text: z.string(),
  muted: z.string(),
});

const fontsSchema = z.object({
  heading: z.string(),
  body: z.string(),
});

const radiiSchema = z.object({
  sm: z.number().min(0).max(64),
  md: z.number().min(0).max(64),
  lg: z.number().min(0).max(64),
});

const effectsSchema = z.object({
  radiusPreset: z.enum(['sharp', 'medium', 'soft']),
  shadowPreset: z.enum(['none', 'soft', 'medium', 'strong']),
});

const typographyScaleSchema = z.object({
  baseSize: z.number().int().min(12).max(24),
  ratio: z.union([
    z.literal(1.125),
    z.literal(1.2),
    z.literal(1.25),
    z.literal(1.333),
    z.literal(1.414),
    z.literal(1.5),
  ]),
});

const themeSuggestionSchema = z.object({
  vibe: z.enum(['modern', 'warm', 'professional', 'playful', 'luxury', 'minimal']),
  rationale: z.string().max(400),
  colors: colorsSchema,
  fonts: fontsSchema,
  radii: radiiSchema,
  effects: effectsSchema,
  typographyScale: typographyScaleSchema,
});

const analyzeSchema = z.object({
  action: z.literal('analyze'),
  theme: z.object({
    colors: colorsSchema,
  }),
});

const deriveSchema = z.object({
  action: z.literal('derive-accent'),
  primary: z.string(),
});

const applySchema = z.object({
  action: z.literal('apply'),
  locale: z.string().optional(),
  suggestion: themeSuggestionSchema,
});

const bodySchema = z.discriminatedUnion('action', [suggestSchema, analyzeSchema, deriveSchema, applySchema]);

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

  if (parsed.data.action === 'apply') {
    if (!(await userHasPermission(auth.username, 'settings'))) {
      return NextResponse.json({ error: 'Missing permission: settings' }, { status: 403 });
    }
    const locale = normalizeLocale(parsed.data.locale ?? request.nextUrl.searchParams.get('locale') ?? 'ko');
    const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request);
    if (!siteResolution.ok) return siteResolution.response;
    const siteId = siteResolution.siteId;
    const site = await readSiteDocument(siteId, locale);
    site.theme = mergeTheme(applyThemeSuggestionToTheme(mergeTheme(site.theme), parsed.data.suggestion));
    site.updatedAt = new Date().toISOString();
    await writeSiteDocument(site);
    return NextResponse.json({ ok: true, theme: site.theme });
  }

  const accent = deriveAccentFromPrimary(parsed.data.primary);
  return NextResponse.json({ ok: true, accent });
}
