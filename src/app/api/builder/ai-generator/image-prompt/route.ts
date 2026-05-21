/**
 * F87 — AI Image prompt builder route.
 *
 * POST /api/builder/ai-generator/image-prompt
 * Body: { pagePurpose, sectionKind, locale, industry?, visualDirection?,
 *         aspect?, brandVoice? (saved profile is used if not provided) }
 * Returns: { ok, prompt, register, modifiers, composition, lighting,
 *            negativeSpace, usedSavedBrandVoice }
 *
 * Pure prompt builder — does NOT call gpt-image-2. The returned prompt
 * is ready to feed into /api/builder/ai-generator/image.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { AI_SECTION_KINDS } from '@/lib/builder/ai-generator/section-builder';
import { buildImagePrompt } from '@/lib/builder/ai-generator/image-prompt-builder';
import {
  FORMALITIES,
  TECHNICALITIES,
  VOCABULARY_BANDS,
  WARMTHS,
  readBrandVoiceProfile,
  type BrandVoiceProfile,
} from '@/lib/builder/ai-generator/brand-voice';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const brandVoiceInlineSchema = z
  .object({
    formality: z.enum(FORMALITIES),
    warmth: z.enum(WARMTHS),
    technicality: z.enum(TECHNICALITIES),
    vocabularyBand: z.enum(VOCABULARY_BANDS),
    taboos: z.array(z.string().trim().min(1).max(80)).max(12).optional(),
    signaturePhrases: z.array(z.string().trim().min(1).max(80)).max(12).optional(),
    notes: z.string().trim().max(400).optional(),
  })
  .optional();

const requestSchema = z.object({
  pagePurpose: z.string().trim().min(1).max(600),
  sectionKind: z.enum(AI_SECTION_KINDS),
  locale: z.enum(['ko', 'zh-hant', 'en']),
  industry: z.string().trim().max(80).optional(),
  visualDirection: z.string().trim().max(500).optional(),
  aspect: z.string().trim().max(10).optional(),
  useSavedBrandVoice: z.boolean().optional(),
  brandVoice: brandVoiceInlineSchema,
});

function profileFromInline(
  input: NonNullable<z.infer<typeof brandVoiceInlineSchema>>,
  locale: 'ko' | 'zh-hant' | 'en',
): BrandVoiceProfile {
  return {
    version: 1,
    locale,
    formality: input.formality,
    warmth: input.warmth,
    technicality: input.technicality,
    vocabularyBand: input.vocabularyBand,
    taboos: input.taboos ?? [],
    signaturePhrases: input.signaturePhrases ?? [],
    notes: input.notes,
    savedAt: null,
    updatedBy: null,
    fingerprint: 'bv_inline',
  };
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'edit-pages',
  });
  if (auth instanceof NextResponse) return auth;

  const raw = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_image_prompt_request',
        details: parsed.error.issues.slice(0, 3),
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  let brandVoice: BrandVoiceProfile | null = null;
  let usedSavedBrandVoice = false;

  if (input.brandVoice) {
    brandVoice = profileFromInline(input.brandVoice, input.locale);
  } else if (input.useSavedBrandVoice !== false) {
    try {
      const stored = await readBrandVoiceProfile();
      if (stored.persisted && stored.profile) {
        brandVoice = stored.profile;
        usedSavedBrandVoice = true;
      }
    } catch {
      // Best-effort: a missing/corrupt brand-voice file should never block prompt generation.
      brandVoice = null;
    }
  }

  const result = buildImagePrompt({
    pagePurpose: input.pagePurpose,
    sectionKind: input.sectionKind,
    locale: input.locale,
    industry: input.industry,
    visualDirection: input.visualDirection,
    aspect: input.aspect,
    brandVoice,
  });

  return NextResponse.json({
    ok: true,
    usedSavedBrandVoice,
    prompt: result.prompt,
    register: result.register,
    modifiers: result.modifiers,
    composition: result.composition,
    lighting: result.lighting,
    negativeSpace: result.negativeSpace,
  });
}