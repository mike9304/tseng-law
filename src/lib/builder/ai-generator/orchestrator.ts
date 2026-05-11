import { generateSiteContent, type GeneratedSiteContent } from './content-generator';
import { selectBlueprint, type SiteBlueprint } from './template-selector';
import type { SiteSpec } from './site-spec';

/**
 * PR #11 — End-to-end pipeline.
 *
 * 1) Pick a blueprint for the industry.
 * 2) Resolve a palette from colorPreference.
 * 3) Ask the content generator to produce headline/body/bullets per section.
 *
 * Returns a `GeneratedSiteDraft` the caller can hand to the canvas
 * importer in a follow-up; this round does not write to the site doc.
 */

export interface GeneratedSiteDraft {
  spec: SiteSpec;
  blueprint: SiteBlueprint;
  palette: SiteBlueprint['palettes'][keyof SiteBlueprint['palettes']];
  content: GeneratedSiteContent;
  generatedAt: string;
}

export async function generateSiteDraft(spec: SiteSpec): Promise<GeneratedSiteDraft> {
  const blueprint = selectBlueprint(spec.industry, spec.tone);
  const palette = blueprint.palettes[spec.colorPreference];
  const content = await generateSiteContent(spec, blueprint);
  return {
    spec,
    blueprint,
    palette,
    content,
    generatedAt: new Date().toISOString(),
  };
}
