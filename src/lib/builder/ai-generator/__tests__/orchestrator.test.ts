import { afterEach, describe, expect, it } from 'vitest';
import { generateSiteDraft } from '@/lib/builder/ai-generator/orchestrator';
import { selectBlueprint } from '@/lib/builder/ai-generator/template-selector';

describe('AI site generator', () => {
  afterEach(() => {
    delete process.env.OPENAI_API_KEY;
  });

  it('falls back to deterministic stub content when no LLM key is configured', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: '호정국제법률사무소',
      slogan: '대만 진출 전문',
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    });
    expect(draft.spec.companyName).toBe('호정국제법률사무소');
    // Slogan takes precedence in the hero headline; without a slogan the headline
    // would include the company name.
    expect(draft.content.hero.headline).toBe('대만 진출 전문');
    expect(draft.content.sections.length).toBeGreaterThanOrEqual(4);
    expect(draft.palette.primary).toMatch(/^#/);
  });

  it('uses company name in headline when no slogan provided', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: '호정국제법률사무소',
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    });
    expect(draft.content.hero.headline).toContain('호정국제법률사무소');
  });

  it('selects different sections per industry', () => {
    const law = selectBlueprint('law', 'professional');
    const cafe = selectBlueprint('cafe', 'friendly');
    expect(law.sections).toContain('expertise');
    expect(law.sections).toContain('team');
    expect(cafe.sections).toContain('gallery');
    expect(cafe.sections).not.toContain('expertise');
  });

  it('returns a default blueprint for unmapped industries', () => {
    const blueprint = selectBlueprint('manufacturing', 'professional');
    expect(blueprint.sections).toContain('hero');
    expect(blueprint.sections).toContain('contact');
  });

  it('produces palette swatches for every supported color preference', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: 'X',
      tone: 'professional',
      colorPreference: 'pastel',
      locale: 'en',
    });
    expect(draft.palette.primary).toMatch(/^#/);
    expect(draft.palette.background).toMatch(/^#/);
  });
});
