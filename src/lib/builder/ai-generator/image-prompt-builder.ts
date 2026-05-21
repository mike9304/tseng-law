/**
 * F87 — AI Image prompt builder.
 *
 * Pure helper that crafts a gpt-image-2 prompt from canvas context:
 *   page purpose, section kind, brand voice profile, locale.
 *
 * Returns a high-quality prompt string containing style modifiers,
 * composition hints, lighting/palette cue, and a negative-space /
 * forbidden list (no text, no logos, no watermarks).
 *
 * No IO. No LLM call. Composes cleanly with the existing image route.
 */

import type { AiSectionKind } from '@/lib/builder/ai-generator/section-builder';
import type { BrandVoiceProfile } from '@/lib/builder/ai-generator/brand-voice';
import type { Locale } from '@/lib/locales';

export const IMAGE_REGISTERS = [
  'editorial',
  'lifestyle',
  'architectural',
  'studio',
  'documentary',
  'minimal',
] as const;

export type ImageRegister = (typeof IMAGE_REGISTERS)[number];

export interface ImagePromptContext {
  pagePurpose: string;
  sectionKind: AiSectionKind;
  locale: Locale;
  industry?: string;
  brandVoice?: BrandVoiceProfile | null;
  /** Optional extra direction the editor entered manually. */
  visualDirection?: string;
  /** Optional aspect descriptor, e.g. "16:9", "1:1", "4:5". */
  aspect?: string;
}

export interface ImagePromptResult {
  prompt: string;
  register: ImageRegister;
  modifiers: string[];
  composition: string;
  lighting: string;
  negativeSpace: string[];
}

const SECTION_COMPOSITION: Record<AiSectionKind, string> = {
  hero: 'Wide hero composition with deliberate negative space on the left third for an overlaid headline; clear focal subject on the right two-thirds; subject is centered along the rule-of-thirds vertical line.',
  features: 'Three-column friendly composition, each conceptual region distinct, no overlapping subjects, balanced midground and background, gentle vignette toward edges.',
  testimonials: 'Editorial portrait composition, soft shallow depth-of-field, single subject mid-frame, calm secondary plane behind, no other people in focus.',
  cta: 'Bold, simple composition with strong negative space at the center for a call-to-action button overlay; subject framed asymmetrically; horizon line low.',
  faq: 'Calm, uncluttered composition with a single low-contrast environmental subject; lots of breathing room for stacked text overlays.',
};

const SECTION_REGISTER: Record<AiSectionKind, ImageRegister> = {
  hero: 'editorial',
  features: 'minimal',
  testimonials: 'lifestyle',
  cta: 'editorial',
  faq: 'minimal',
};

const REGISTER_DESCRIPTION: Record<ImageRegister, string> = {
  editorial: 'Editorial magazine-grade composition with intentional cropping and refined color grading.',
  lifestyle: 'Natural-light lifestyle photography with authentic, candid energy and warm ambient tones.',
  architectural: 'Architectural photography with strong geometry, leading lines, and a clean perspective.',
  studio: 'Studio photography with controlled lighting and a clean backdrop, product-photography style.',
  documentary: 'Documentary photography with natural light and a slice-of-life feel, journalistic framing.',
  minimal: 'Minimal photography with generous negative space and a calm, restrained color palette.',
};

const REGISTER_LIGHTING: Record<ImageRegister, string> = {
  editorial: 'Soft directional key light, low-contrast fill, subtle rim light, neutral mid-tones.',
  lifestyle: 'Golden-hour natural light, warm highlights, gentle shadow falloff.',
  architectural: 'Even daylight with strong ambient bounce, controlled shadow contrast.',
  studio: 'Two-light setup, large soft key from camera-left, fill card camera-right, neutral background.',
  documentary: 'Available light only, no flash, real-world color temperatures preserved.',
  minimal: 'Diffuse overcast lighting or window light, low contrast, muted color values.',
};

const NEGATIVE_BASE = [
  'no text, captions, watermarks, signatures, or typography',
  'no logos, brand marks, or recognizable trademarks',
  'no private documents, passports, or identifiable papers',
  'no recognizable celebrity or public-figure likeness',
  'no AI artifacts, no extra fingers, no warped hands',
];

function brandVoiceRegister(profile: BrandVoiceProfile | null | undefined, fallback: ImageRegister): ImageRegister {
  if (!profile) return fallback;
  if (profile.warmth === 'warm' && profile.formality !== 'formal') return 'lifestyle';
  if (profile.formality === 'formal' && profile.warmth === 'cool') return 'architectural';
  if (profile.formality === 'formal') return 'editorial';
  if (profile.technicality === 'technical') return 'studio';
  if (profile.warmth === 'cool' && profile.formality === 'casual') return 'minimal';
  return fallback;
}

function brandVoiceModifiers(profile: BrandVoiceProfile | null | undefined): string[] {
  if (!profile) return [];
  const modifiers: string[] = [];
  if (profile.warmth === 'warm') {
    modifiers.push('warm color palette, amber and ivory hues, soft skin tones');
  } else if (profile.warmth === 'cool') {
    modifiers.push('cool color palette, slate and ice blues, restrained saturation');
  } else {
    modifiers.push('balanced color palette, neutral tones with one accent');
  }
  if (profile.formality === 'formal') {
    modifiers.push('refined, dignified mood, polished surfaces, considered styling');
  } else if (profile.formality === 'casual') {
    modifiers.push('relaxed, approachable mood, organic textures, lived-in feel');
  }
  if (profile.technicality === 'technical') {
    modifiers.push('precise geometry, clean engineered surfaces, blueprint-grade clarity');
  }
  if (profile.vocabularyBand === 'specialized') {
    modifiers.push('upscale, industry-credentialed aesthetic');
  } else if (profile.vocabularyBand === 'basic') {
    modifiers.push('immediately legible, friendly visual storytelling');
  }
  return modifiers;
}

const INDUSTRY_HINT: Record<string, string> = {
  law: 'professional services environment, neutral palette, architectural backdrop',
  accounting: 'professional services environment, ordered desk, neutral palette',
  consulting: 'professional services environment, contemporary workspace',
  medical: 'clinical environment, soft natural light, calm clinical palette',
  dental: 'clinical environment, soft natural light, calm clinical palette',
  restaurant: 'culinary environment, food-styled with restraint, ambient warm light',
  cafe: 'cafe environment, warm wood textures, soft window light',
  bakery: 'bakery environment, warm wood textures, soft window light',
  fitness: 'training environment, dynamic posture, natural energy',
  beauty: 'studio beauty environment, soft skin lighting, neutral backdrop',
  saas: 'modern workspace environment, devices arranged with restraint, soft daylight',
  tech: 'modern workspace environment, devices arranged with restraint, soft daylight',
  agency: 'creative studio environment, considered styling, daylight',
  photography: 'studio environment, controlled lighting, neutral seamless backdrop',
  retail: 'curated retail environment, soft daylight, considered merchandising',
  education: 'learning environment, natural light, calm workspaces',
};

function industryHint(industry: string | undefined): string | null {
  if (!industry) return null;
  return INDUSTRY_HINT[industry.toLowerCase()] ?? null;
}

function localeReadingDirection(locale: Locale): string {
  if (locale === 'zh-hant') {
    return 'Compose for Traditional Chinese reading patterns; leave negative space on the right of focal subjects so vertical overlay text reads cleanly.';
  }
  if (locale === 'ko') {
    return 'Compose for Korean reading patterns; left-aligned negative space for headline overlays.';
  }
  return 'Compose for English left-to-right reading; left-aligned negative space for headline overlays.';
}

function clampPrompt(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3).trim()}...`;
}

export function buildImagePrompt(context: ImagePromptContext): ImagePromptResult {
  const baseRegister = SECTION_REGISTER[context.sectionKind];
  const register = brandVoiceRegister(context.brandVoice, baseRegister);
  const modifiers = brandVoiceModifiers(context.brandVoice);
  const composition = SECTION_COMPOSITION[context.sectionKind];
  const lighting = REGISTER_LIGHTING[register];
  const negativeSpace = [...NEGATIVE_BASE];
  if (context.brandVoice?.taboos.length) {
    const tabooLine = context.brandVoice.taboos
      .slice(0, 8)
      .map((value) => `no ${value.toLowerCase()}`)
      .join(', ');
    negativeSpace.push(tabooLine);
  }

  const lines: string[] = [];
  lines.push(`Subject: ${clampPrompt(context.pagePurpose, 220)}.`);
  const industry = industryHint(context.industry);
  if (industry) lines.push(`Setting: ${industry}.`);
  lines.push(`Style register: ${REGISTER_DESCRIPTION[register]}`);
  if (modifiers.length > 0) {
    lines.push(`Modifiers: ${modifiers.join('; ')}.`);
  }
  lines.push(`Composition: ${composition}`);
  lines.push(`Lighting: ${lighting}`);
  lines.push(localeReadingDirection(context.locale));
  if (context.visualDirection) {
    lines.push(`Editor direction: ${clampPrompt(context.visualDirection, 260)}.`);
  }
  if (context.aspect) {
    lines.push(`Aspect ratio: ${context.aspect}.`);
  }
  lines.push(`Photorealistic; high resolution; commercial-website-grade.`);
  lines.push(`Forbidden: ${negativeSpace.join('; ')}.`);

  const prompt = clampPrompt(lines.join(' '), 1800);

  return {
    prompt,
    register,
    modifiers,
    composition,
    lighting,
    negativeSpace,
  };
}

export function describeImageRegister(register: ImageRegister): string {
  switch (register) {
    case 'editorial':
      return 'Editorial';
    case 'lifestyle':
      return 'Lifestyle';
    case 'architectural':
      return 'Architectural';
    case 'studio':
      return 'Studio';
    case 'documentary':
      return 'Documentary';
    case 'minimal':
      return 'Minimal';
    default:
      return 'Editorial';
  }
}