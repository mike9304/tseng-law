import { z } from 'zod';
import { locales } from '@/lib/locales';

/**
 * PR #11 — User-supplied site brief for the AI generator.
 *
 * Kept intentionally small (5 inputs the spec lists) so the wizard fits in
 * one screen. Industry is the primary signal for template selection; tone
 * + colorPreference steer the content generator.
 */

export const INDUSTRIES = [
  'law',
  'accounting',
  'consulting',
  'medical',
  'dental',
  'real-estate',
  'architecture',
  'design-studio',
  'restaurant',
  'cafe',
  'bakery',
  'fitness',
  'yoga',
  'beauty',
  'photography',
  'wedding',
  'travel',
  'retail',
  'fashion',
  'education',
  'language-school',
  'tutoring',
  'nonprofit',
  'religion',
  'event-planning',
  'tech',
  'saas',
  'agency',
  'manufacturing',
  'logistics',
  'other',
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const TONES = ['professional', 'friendly', 'luxury', 'playful', 'authoritative'] as const;
export type Tone = (typeof TONES)[number];

export const COLOR_PREFERENCES = ['warm', 'cool', 'neutral', 'high-contrast', 'pastel'] as const;
export type ColorPreference = (typeof COLOR_PREFERENCES)[number];

const builderAssetIdPattern = /^builder\/assets\/(?:ko|en|zh-hant)\/[A-Za-z0-9._-]+\.(?:jpe?g|png|webp|gif|svg)$/i;

const heroImageAssetSchema = z.object({
  assetId: z
    .string()
    .trim()
    .max(240)
    .regex(builderAssetIdPattern, 'Hero image asset must be an existing builder image asset id.'),
  filename: z.string().trim().min(1).max(180),
  alt: z.string().trim().max(240).optional(),
});

export const siteSpecSchema = z.object({
  industry: z.enum(INDUSTRIES),
  companyName: z.string().trim().min(1).max(120),
  slogan: z.string().trim().max(200).optional(),
  audience: z.string().trim().max(160).optional(),
  goals: z.array(z.string().trim().min(1).max(120)).max(8).optional(),
  desiredPages: z.array(z.string().trim().min(1).max(80)).max(10).optional(),
  brandKeywords: z.array(z.string().trim().min(1).max(80)).max(10).optional(),
  constraints: z.string().trim().max(600).optional(),
  visualDirection: z.string().trim().max(500).optional(),
  heroImageAsset: heroImageAssetSchema.optional(),
  tone: z.enum(TONES).default('professional'),
  colorPreference: z.enum(COLOR_PREFERENCES).default('cool'),
  /** Primary locale for first-pass content. */
  locale: z.enum(locales).default('ko'),
});

export type HeroImageAsset = z.infer<typeof heroImageAssetSchema>;
export type SiteSpec = z.infer<typeof siteSpecSchema>;
