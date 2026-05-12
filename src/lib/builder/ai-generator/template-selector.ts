import type { Industry, Tone, ColorPreference } from './site-spec';

/**
 * PR #11 — Pick a starter blueprint for the requested industry.
 *
 * Returns a coarse blueprint (heroHeadlineHint, sections list, palette
 * preset) the content generator will hydrate. Industry mapping is a flat
 * table so it's easy to inspect and tune without re-running through an LLM.
 */

export interface SiteBlueprint {
  industry: Industry;
  /** Section ids in vertical order, from the canonical home-page template. */
  sections: Array<'hero' | 'about' | 'services' | 'expertise' | 'team' | 'reviews' | 'process' | 'gallery' | 'pricing' | 'faq' | 'contact' | 'cta'>;
  /** A copy hint that nudges the content generator toward the industry's voice. */
  heroHeadlineHint: string;
  /** Palette base color hexes the user picks between via colorPreference. */
  palettes: Record<ColorPreference, { primary: string; secondary: string; accent: string; background: string }>;
}

const LAW_PALETTES: SiteBlueprint['palettes'] = {
  cool: { primary: '#0f172a', secondary: '#1e3a8a', accent: '#2563eb', background: '#f8fafc' },
  warm: { primary: '#7c2d12', secondary: '#9a3412', accent: '#d97706', background: '#fefce8' },
  neutral: { primary: '#0f172a', secondary: '#334155', accent: '#64748b', background: '#ffffff' },
  'high-contrast': { primary: '#000000', secondary: '#0f172a', accent: '#dc2626', background: '#ffffff' },
  pastel: { primary: '#5b21b6', secondary: '#6d28d9', accent: '#a78bfa', background: '#faf5ff' },
};

const FRIENDLY_PALETTES: SiteBlueprint['palettes'] = {
  cool: { primary: '#0369a1', secondary: '#0891b2', accent: '#06b6d4', background: '#f0f9ff' },
  warm: { primary: '#dc2626', secondary: '#ea580c', accent: '#facc15', background: '#fff7ed' },
  neutral: { primary: '#1f2937', secondary: '#4b5563', accent: '#9ca3af', background: '#ffffff' },
  'high-contrast': { primary: '#000000', secondary: '#1f2937', accent: '#22c55e', background: '#ffffff' },
  pastel: { primary: '#db2777', secondary: '#ec4899', accent: '#f9a8d4', background: '#fdf2f8' },
};

const DEFAULT_BLUEPRINT: SiteBlueprint = {
  industry: 'other',
  sections: ['hero', 'about', 'services', 'reviews', 'contact', 'cta'],
  heroHeadlineHint: 'A clear positioning statement that names your audience and what you do for them.',
  palettes: FRIENDLY_PALETTES,
};

const REGISTRY: Partial<Record<Industry, Omit<SiteBlueprint, 'industry'>>> = {
  law: {
    sections: ['hero', 'expertise', 'team', 'reviews', 'process', 'faq', 'contact', 'cta'],
    heroHeadlineHint: 'A trust-first headline that signals expertise + jurisdiction.',
    palettes: LAW_PALETTES,
  },
  accounting: {
    sections: ['hero', 'services', 'expertise', 'team', 'reviews', 'process', 'contact', 'cta'],
    heroHeadlineHint: 'Accuracy + responsiveness, expressed plainly.',
    palettes: LAW_PALETTES,
  },
  consulting: {
    sections: ['hero', 'expertise', 'services', 'reviews', 'team', 'contact', 'cta'],
    heroHeadlineHint: 'Outcome the client wins, not deliverables.',
    palettes: LAW_PALETTES,
  },
  medical: {
    sections: ['hero', 'about', 'services', 'team', 'reviews', 'faq', 'contact', 'cta'],
    heroHeadlineHint: 'Calm, reassuring tone naming the patient need.',
    palettes: FRIENDLY_PALETTES,
  },
  dental: {
    sections: ['hero', 'about', 'services', 'team', 'reviews', 'faq', 'contact', 'cta'],
    heroHeadlineHint: 'Comfort + same-day appointments.',
    palettes: FRIENDLY_PALETTES,
  },
  restaurant: {
    sections: ['hero', 'about', 'gallery', 'pricing', 'reviews', 'contact', 'cta'],
    heroHeadlineHint: 'Sensory invitation — the moment they walk in.',
    palettes: FRIENDLY_PALETTES,
  },
  cafe: {
    sections: ['hero', 'gallery', 'pricing', 'reviews', 'contact', 'cta'],
    heroHeadlineHint: 'A neighbourhood scene; the smell of the bean.',
    palettes: FRIENDLY_PALETTES,
  },
  fitness: {
    sections: ['hero', 'about', 'services', 'pricing', 'team', 'reviews', 'contact', 'cta'],
    heroHeadlineHint: 'Transformation outcome in 6 weeks.',
    palettes: FRIENDLY_PALETTES,
  },
  beauty: {
    sections: ['hero', 'gallery', 'services', 'pricing', 'team', 'reviews', 'contact', 'cta'],
    heroHeadlineHint: 'Self-care moment, not a service list.',
    palettes: FRIENDLY_PALETTES,
  },
  photography: {
    sections: ['hero', 'gallery', 'services', 'pricing', 'reviews', 'contact', 'cta'],
    heroHeadlineHint: 'Sample image carries the message — keep copy minimal.',
    palettes: LAW_PALETTES,
  },
  retail: {
    sections: ['hero', 'gallery', 'services', 'reviews', 'contact', 'cta'],
    heroHeadlineHint: 'Lead with a single hero product image and a one-line promise.',
    palettes: FRIENDLY_PALETTES,
  },
  saas: {
    sections: ['hero', 'expertise', 'services', 'reviews', 'pricing', 'faq', 'cta'],
    heroHeadlineHint: 'Specific outcome unlocked + integration shorthand.',
    palettes: LAW_PALETTES,
  },
  agency: {
    sections: ['hero', 'expertise', 'gallery', 'reviews', 'team', 'contact', 'cta'],
    heroHeadlineHint: 'Outcomes-first headline; portfolio carries the proof.',
    palettes: LAW_PALETTES,
  },
};

export function selectBlueprint(industry: Industry, _tone: Tone = 'professional'): SiteBlueprint {
  void _tone;
  const partial = REGISTRY[industry];
  if (!partial) return DEFAULT_BLUEPRINT;
  return { industry, ...partial };
}
