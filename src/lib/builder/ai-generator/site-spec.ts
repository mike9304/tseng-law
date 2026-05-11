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

export const siteSpecSchema = z.object({
  industry: z.enum(INDUSTRIES),
  companyName: z.string().trim().min(1).max(120),
  slogan: z.string().trim().max(200).optional(),
  tone: z.enum(TONES).default('professional'),
  colorPreference: z.enum(COLOR_PREFERENCES).default('cool'),
  /** Primary locale for first-pass content. */
  locale: z.enum(locales).default('ko'),
});

export type SiteSpec = z.infer<typeof siteSpecSchema>;
